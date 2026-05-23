# build_dataset_final_svdc.py
# ------------------------------------------------------------
# SVDC - Poster/Data Story em D3.js sobre adoção de IA em 2025
#
# Este script combina os CSVs da Eurostat que descarregaste:
# - isoc_eb_ai_2025.csv
# - isoc_eb_ain2_2025.csv
# - isoc_cicce_use_2025.csv
# - isoc_eb_das_2025.csv
# - isoc_e_dii_2025.csv
#
# Saída principal:
# - datasets_final/dataset_final.csv
#
# Saídas auxiliares úteis para o poster em D3:
# - datasets_final/dataset_final_long.csv
# - datasets_final/dataset_setores_ai_2025.csv
# - datasets_final/dataset_dimensao_ai_2025.csv
# - datasets_final/dataset_tecnologias_ai_2025.csv
# - datasets_final/dataset_final_report.json
#
# Como usar:
# 1) Coloca este script na pasta onde tens a pasta "csv" OU na própria pasta dos CSVs.
# 2) Corre:
#       python build_dataset_final_svdc.py
# ------------------------------------------------------------

from pathlib import Path
import json
import sys

import pandas as pd
import numpy as np


YEAR = 2025

# Países da União Europeia. A Eurostat usa "EL" para Grécia, não "GR".
EU27_CODES = [
    "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "EL", "ES",
    "FI", "FR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT",
    "NL", "PL", "PT", "RO", "SE", "SI", "SK"
]

# Incluímos a média/agregado da UE como referência.
GEO_CODES = EU27_CODES + ["EU27_2020"]

# Mapeamento útil para D3, especialmente se usares mapas GeoJSON/TopoJSON com ISO.
ISO_A2_TO_A3 = {
    "AT": "AUT", "BE": "BEL", "BG": "BGR", "CY": "CYP", "CZ": "CZE",
    "DE": "DEU", "DK": "DNK", "EE": "EST", "EL": "GRC", "ES": "ESP",
    "FI": "FIN", "FR": "FRA", "HR": "HRV", "HU": "HUN", "IE": "IRL",
    "IT": "ITA", "LT": "LTU", "LU": "LUX", "LV": "LVA", "MT": "MLT",
    "NL": "NLD", "PL": "POL", "PT": "PRT", "RO": "ROU", "SE": "SWE",
    "SI": "SVN", "SK": "SVK", "EU27_2020": ""
}

EUROSTAT_TO_ISO_A2 = {
    **{code: code for code in EU27_CODES},
    "EL": "GR",
    "EU27_2020": ""
}

BASE_FILTER = {
    "time": YEAR,
    "unit": "PC_ENT",
    "size_emp": "GE10",
    "nace_r2": "C10-S951_X_K",
}


# ------------------------------------------------------------
# Indicadores principais para o dataset final por país
# ------------------------------------------------------------

COUNTRY_METRICS = [
    # Fonte: isoc_eb_ai
    ("ai", "E_AI_TANY", "ai_adoption_pct", "Empresas que usam pelo menos uma tecnologia de IA"),
    ("ai", "E_AI_TGE2", "ai_two_or_more_technologies_pct", "Empresas que usam pelo menos duas tecnologias de IA"),
    ("ai", "E_AI_TGE3", "ai_three_or_more_technologies_pct", "Empresas que usam pelo menos três tecnologias de IA"),
    ("ai", "E_AI_DA", "ai_and_data_analytics_pct", "Empresas que usam IA e fazem data analytics"),
    ("ai", "E_AI_CC", "ai_and_cloud_pct", "Empresas que usam IA e compram serviços cloud"),
    ("ai", "E_AI_CC1SI_DA", "ai_sophisticated_cloud_and_data_pct", "Empresas que usam IA, cloud intermédia/sofisticada e data analytics"),
    ("ai", "E_AIX_CC1SI_DA", "cloud_data_but_no_ai_pct", "Empresas com cloud intermédia/sofisticada e data analytics, mas sem IA"),
    ("ai", "E_AI_CC1SIX_DAX", "ai_without_sophisticated_cloud_or_data_pct", "Empresas que usam IA sem cloud intermédia/sofisticada nem data analytics"),

    # Fonte: cloud
    ("cloud", "E_CC", "cloud_use_pct", "Empresas que usam serviços cloud pagos"),
    ("cloud", "E_CC1_SI", "sophisticated_or_intermediate_cloud_pct", "Empresas que usam cloud intermédia ou sofisticada"),
    ("cloud", "E_CC_DA", "cloud_and_data_analytics_pct", "Empresas que usam cloud e fazem data analytics"),

    # Fonte: data analytics
    ("das", "E_DA", "data_analytics_pct", "Empresas que fazem data analytics"),
    ("das", "E_DASGE3", "data_analytics_3_sources_pct", "Empresas que fazem data analytics com pelo menos três fontes de dados"),

    # Fonte: digital intensity
    ("dii", "E_DI3_GELO", "dii_at_least_basic_pct", "Empresas com pelo menos intensidade digital básica"),
    ("dii", "E_DI3_HI", "dii_high_pct", "Empresas com alta intensidade digital"),
    ("dii", "E_DI3_VHI", "dii_very_high_pct", "Empresas com intensidade digital muito alta"),
    ("dii", "E_DI3_LO", "dii_low_pct", "Empresas com baixa intensidade digital"),
    ("dii", "E_DI3_VLO", "dii_very_low_pct", "Empresas com intensidade digital muito baixa"),
]


AI_TECHNOLOGY_INDICATORS = {
    "E_AI_TTM": "Text mining",
    "E_AI_TSR": "Speech recognition",
    "E_AI_TNLG": "Natural language generation / code generation",
    "E_AI_TIR": "Image recognition / image processing",
    "E_AI_TML": "Machine learning for data analysis",
    "E_AI_TPA": "Workflow automation / decision support",
    "E_AI_TAR": "Autonomous robots / vehicles / drones",
    "E_AI_TPVSG": "Generative pictures / video / sound",
}

AI_PURPOSE_INDICATORS = {
    "E_AI_PMS": "Marketing or sales",
    "E_AI_PPP": "Production processes",
    "E_AI_PBAM": "Business administration / management",
    "E_AI_PLOG": "Logistics",
    "E_AI_PITS": "ICT security",
    "E_AI_PFIN": "Accounting / finance management",
    "E_AI_PRDI": "R&D or innovation",
}

AI_BARRIER_INDICATORS = {
    "E_AI_BCST": "Costs too high",
    "E_AI_BLE": "Lack of relevant expertise",
    "E_AI_BINC": "Incompatibility with existing systems",
    "E_AI_BDDT": "Problems with data availability or quality",
    "E_AI_BCDP": "Data protection and privacy concerns",
    "E_AI_BLEG": "Legal uncertainty",
    "E_AI_BEC": "Ethical considerations",
    "E_AI_BNU": "AI not useful for the enterprise",
}


def choose_input_dir() -> Path:
    """
    Procura automaticamente onde estão os CSVs.
    Prioridade:
    1) ./csv
    2) ./datasets/csv
    3) pasta atual
    """
    candidates = [Path("csv"), Path("datasets") / "csv", Path(".")]

    for folder in candidates:
        if folder.exists() and any(folder.glob("isoc_*2025*.csv")):
            return folder

    raise FileNotFoundError(
        "Não encontrei os CSVs. Coloca o script na pasta do projeto, "
        "com os CSVs dentro de uma pasta 'csv', ou na própria pasta dos CSVs."
    )


def find_file(input_dir: Path, pattern: str) -> Path:
    matches = sorted(input_dir.glob(pattern))
    if not matches:
        raise FileNotFoundError(f"Ficheiro não encontrado com padrão: {pattern}")

    # Se existirem versões duplicadas, escolhe a primeira por ordem alfabética.
    # Ex.: isoc_eb_ai_2025.csv antes de isoc_eb_ai_2025(1).csv.
    return matches[0]


def load_inputs(input_dir: Path) -> dict:
    files = {
        "ai": find_file(input_dir, "isoc_eb_ai_2025*.csv"),
        "sector": find_file(input_dir, "isoc_eb_ain2_2025*.csv"),
        "cloud": find_file(input_dir, "isoc_cicce_use_2025*.csv"),
        "das": find_file(input_dir, "isoc_eb_das_2025*.csv"),
        "dii": find_file(input_dir, "isoc_e_dii_2025*.csv"),
    }

    print("Ficheiros usados:")
    for key, path in files.items():
        print(f"  {key:8s} -> {path}")

    data = {key: pd.read_csv(path) for key, path in files.items()}

    for key, df in data.items():
        if "time" not in df.columns:
            raise ValueError(f"O ficheiro {key} não tem coluna 'time'.")
        years = sorted(pd.to_numeric(df["time"], errors="coerce").dropna().astype(int).unique().tolist())
        if years != [YEAR]:
            raise ValueError(
                f"O ficheiro {key} não está filtrado apenas para {YEAR}. "
                f"Anos encontrados: {years}"
            )

    return data


def apply_base_filter(df: pd.DataFrame, indicator: str, unit: str = "PC_ENT") -> pd.DataFrame:
    d = df.copy()

    filters = {
        "time": YEAR,
        "unit": unit,
        "size_emp": "GE10",
        "nace_r2": "C10-S951_X_K",
        "indic_is": indicator,
    }

    for col, value in filters.items():
        if col not in d.columns:
            raise ValueError(f"Coluna obrigatória em falta: {col}")
        d = d[d[col].astype(str) == str(value)]

    d = d[d["geo"].isin(GEO_CODES)].copy()

    # Garante valor numérico.
    d["value"] = pd.to_numeric(d["value"], errors="coerce")

    # Evita duplicados inesperados.
    d = d.sort_values(["geo"]).drop_duplicates(subset=["geo"], keep="first")

    return d


def metric_series(df: pd.DataFrame, indicator: str, output_name: str, unit: str = "PC_ENT") -> pd.DataFrame:
    d = apply_base_filter(df, indicator, unit=unit)

    return d[["geo", "geo_label", "value"]].rename(columns={"value": output_name})


def build_country_dataset(data: dict) -> tuple[pd.DataFrame, list]:
    """
    Constrói o dataset central: uma linha por país UE27 + agregado EU27_2020.
    """
    warnings = []

    base = metric_series(data["ai"], "E_AI_TANY", "ai_adoption_pct")

    result = base.copy()

    for source_key, indicator, output_name, description in COUNTRY_METRICS:
        # E_AI_TANY já está na base
        if output_name == "ai_adoption_pct":
            continue

        try:
            m = metric_series(data[source_key], indicator, output_name)
            result = result.merge(m, on=["geo", "geo_label"], how="left")
        except Exception as exc:
            warnings.append(f"Não foi possível extrair {indicator} ({output_name}): {exc}")
            result[output_name] = np.nan

    # Adiciona identificadores para D3/maps.
    result["is_eu_aggregate"] = result["geo"].eq("EU27_2020")
    result["geo_eurostat"] = result["geo"]
    result["iso_a2"] = result["geo"].map(EUROSTAT_TO_ISO_A2)
    result["iso_a3"] = result["geo"].map(ISO_A2_TO_A3)
    result["year"] = YEAR
    result["source"] = "Eurostat"

    # Gap face à média da UE.
    eu_row = result[result["geo"] == "EU27_2020"]
    if not eu_row.empty:
        eu_ai = eu_row["ai_adoption_pct"].iloc[0]
        eu_cloud = eu_row["cloud_use_pct"].iloc[0]
        eu_da = eu_row["data_analytics_pct"].iloc[0]
        eu_dii_hi = eu_row["dii_high_pct"].iloc[0]

        result["ai_gap_to_eu_pp"] = result["ai_adoption_pct"] - eu_ai
        result["cloud_gap_to_eu_pp"] = result["cloud_use_pct"] - eu_cloud
        result["data_analytics_gap_to_eu_pp"] = result["data_analytics_pct"] - eu_da
        result["dii_high_gap_to_eu_pp"] = result["dii_high_pct"] - eu_dii_hi
    else:
        warnings.append("Não encontrei EU27_2020. Não calculei gaps face à média da UE.")
        result["ai_gap_to_eu_pp"] = np.nan
        result["cloud_gap_to_eu_pp"] = np.nan
        result["data_analytics_gap_to_eu_pp"] = np.nan
        result["dii_high_gap_to_eu_pp"] = np.nan

    # Ranking apenas entre países da UE, sem o agregado EU27_2020.
    result["ai_rank_eu27"] = pd.NA
    country_mask = result["geo"].isin(EU27_CODES)
    ranks = result.loc[country_mask, "ai_adoption_pct"].rank(ascending=False, method="min")
    result.loc[country_mask, "ai_rank_eu27"] = ranks.astype("Int64")

    # Índice simples para ordenar visualmente maturidade digital.
    # Não é uma métrica oficial: é apenas uma média dos pilares digitais normalizados em percentagem.
    maturity_cols = [
        "cloud_use_pct",
        "data_analytics_pct",
        "dii_at_least_basic_pct",
        "dii_high_pct",
        "dii_very_high_pct",
    ]
    result["digital_maturity_score_simple"] = result[maturity_cols].mean(axis=1)

    # Diferença entre capacidade digital e uso efetivo de IA.
    result["digital_maturity_minus_ai_pp"] = (
        result["digital_maturity_score_simple"] - result["ai_adoption_pct"]
    )

    # Ordenação: agregado primeiro, depois países por rank de IA.
    result["_sort"] = np.where(result["geo"] == "EU27_2020", 0, 1)
    result = result.sort_values(["_sort", "ai_rank_eu27", "geo"], na_position="last").drop(columns=["_sort"])

    # Arredonda percentagens.
    numeric_cols = result.select_dtypes(include=[np.number]).columns
    result[numeric_cols] = result[numeric_cols].round(2)

    return result, warnings


def build_long_country_dataset(country_df: pd.DataFrame) -> pd.DataFrame:
    metric_cols = [
        "ai_adoption_pct",
        "ai_two_or_more_technologies_pct",
        "ai_three_or_more_technologies_pct",
        "ai_and_data_analytics_pct",
        "ai_and_cloud_pct",
        "ai_sophisticated_cloud_and_data_pct",
        "cloud_data_but_no_ai_pct",
        "ai_without_sophisticated_cloud_or_data_pct",
        "cloud_use_pct",
        "sophisticated_or_intermediate_cloud_pct",
        "cloud_and_data_analytics_pct",
        "data_analytics_pct",
        "data_analytics_3_sources_pct",
        "dii_at_least_basic_pct",
        "dii_high_pct",
        "dii_very_high_pct",
        "dii_low_pct",
        "dii_very_low_pct",
    ]

    available = [c for c in metric_cols if c in country_df.columns]

    long_df = country_df.melt(
        id_vars=["geo", "geo_label", "geo_eurostat", "iso_a2", "iso_a3", "year", "is_eu_aggregate"],
        value_vars=available,
        var_name="metric",
        value_name="value"
    ).dropna(subset=["value"])

    return long_df.sort_values(["metric", "is_eu_aggregate", "geo"])


def build_size_dataset(data: dict) -> pd.DataFrame:
    """
    IA por dimensão da empresa.
    Bom para um gráfico de barras: pequenas vs médias vs grandes.
    """
    df = data["ai"].copy()
    size_order = {
        "10-49": 1,
        "50-249": 2,
        "GE250": 3,
        "GE10": 4,
    }

    d = df[
        (df["time"].astype(str) == str(YEAR)) &
        (df["unit"] == "PC_ENT") &
        (df["nace_r2"] == "C10-S951_X_K") &
        (df["indic_is"] == "E_AI_TANY") &
        (df["geo"].isin(GEO_CODES)) &
        (df["size_emp"].isin(size_order.keys()))
    ].copy()

    d["value"] = pd.to_numeric(d["value"], errors="coerce")
    d["size_order"] = d["size_emp"].map(size_order)
    d["year"] = YEAR

    cols = [
        "geo", "geo_label", "time", "year",
        "size_emp", "size_emp_label", "size_order",
        "value"
    ]

    return d[cols].rename(columns={"value": "ai_adoption_pct"}).sort_values(["geo", "size_order"])


def build_sector_dataset(data: dict) -> pd.DataFrame:
    """
    IA por setor económico.
    Para o poster, a vista mais forte é usar geo = EU27_2020,
    mas manter países permite interações/filtragem em D3.
    """
    df = data["sector"].copy()

    d = df[
        (df["time"].astype(str) == str(YEAR)) &
        (df["unit"] == "PC_ENT") &
        (df["size_emp"] == "GE10") &
        (df["indic_is"] == "E_AI_TANY") &
        (df["geo"].isin(GEO_CODES))
    ].copy()

    d["value"] = pd.to_numeric(d["value"], errors="coerce")
    d["year"] = YEAR
    d["is_total_sector"] = d["nace_r2"].eq("C10-S951_X_K")
    d["sector_rank_within_geo"] = d.groupby("geo")["value"].rank(ascending=False, method="first")

    cols = [
        "geo", "geo_label", "time", "year",
        "nace_r2", "nace_r2_label", "is_total_sector",
        "value", "sector_rank_within_geo"
    ]

    return d[cols].rename(columns={"value": "ai_adoption_pct"}).sort_values(["geo", "sector_rank_within_geo"])


def build_indicator_long_dataset(
    data: dict,
    indicators: dict,
    output_category: str,
    unit: str = "PC_ENT"
) -> pd.DataFrame:
    """
    Cria ficheiro longo para tecnologias, finalidades ou barreiras de IA.
    """
    df = data["ai"].copy()

    d = df[
        (df["time"].astype(str) == str(YEAR)) &
        (df["unit"] == unit) &
        (df["size_emp"] == "GE10") &
        (df["nace_r2"] == "C10-S951_X_K") &
        (df["indic_is"].isin(indicators.keys())) &
        (df["geo"].isin(GEO_CODES))
    ].copy()

    d["value"] = pd.to_numeric(d["value"], errors="coerce")
    d["year"] = YEAR
    d["indicator_short_label"] = d["indic_is"].map(indicators)
    d["indicator_category"] = output_category

    cols = [
        "geo", "geo_label", "time", "year",
        "indic_is", "indicator_short_label", "indic_is_label",
        "indicator_category", "unit", "unit_label", "value"
    ]

    return d[cols].sort_values(["geo", "indicator_category", "indic_is"])


def build_report(country_df: pd.DataFrame, warnings: list) -> dict:
    country_only = country_df[country_df["geo"].isin(EU27_CODES)].copy()

    corr_cols = [
        "cloud_use_pct",
        "data_analytics_pct",
        "dii_at_least_basic_pct",
        "dii_high_pct",
        "dii_very_high_pct",
        "digital_maturity_score_simple",
    ]

    correlations = {}
    for col in corr_cols:
        valid = country_only[["ai_adoption_pct", col]].dropna()
        if len(valid) >= 3:
            correlations[f"corr_ai_vs_{col}"] = round(valid["ai_adoption_pct"].corr(valid[col]), 4)
        else:
            correlations[f"corr_ai_vs_{col}"] = None

    top5 = (
        country_only.sort_values("ai_adoption_pct", ascending=False)
        [["geo", "geo_label", "ai_adoption_pct"]]
        .head(5)
        .to_dict(orient="records")
    )

    bottom5 = (
        country_only.sort_values("ai_adoption_pct", ascending=True)
        [["geo", "geo_label", "ai_adoption_pct"]]
        .head(5)
        .to_dict(orient="records")
    )

    portugal = (
        country_df[country_df["geo"] == "PT"]
        .replace({np.nan: None})
        .to_dict(orient="records")
    )

    missing_by_column = country_df.isna().sum().to_dict()

    return {
        "year": YEAR,
        "geographic_scope": "EU27 countries + EU27_2020 aggregate",
        "main_dataset_rows": int(len(country_df)),
        "country_rows_without_aggregate": int(len(country_only)),
        "main_question": (
            "In 2025, is AI adoption by European enterprises more strongly associated "
            "with overall digital maturity, cloud computing or data analytics?"
        ),
        "recommended_poster_title": (
            "AI Adoption in European Enterprises, 2025: "
            "innovation gap or digital maturity gap?"
        ),
        "correlations_eu27_only": correlations,
        "top5_ai_adoption": top5,
        "bottom5_ai_adoption": bottom5,
        "portugal_summary": portugal,
        "missing_values_by_column": missing_by_column,
        "warnings": warnings,
        "notes": [
            "Todas as percentagens usam unit=PC_ENT, exceto ficheiros auxiliares quando indicado.",
            "O dataset_final.csv está ao nível país/agregado.",
            "Os ficheiros auxiliares são recomendados para completar o poster em D3.",
            "digital_maturity_score_simple não é indicador oficial Eurostat; é uma média simples criada para ordenação visual."
        ]
    }


def main():
    try:
        input_dir = choose_input_dir()
        output_dir = Path("datasets_final")
        output_dir.mkdir(parents=True, exist_ok=True)

        print(f"Pasta de entrada: {input_dir.resolve()}")
        print(f"Pasta de saída:   {output_dir.resolve()}")
        print()

        data = load_inputs(input_dir)

        country_df, warnings = build_country_dataset(data)
        long_df = build_long_country_dataset(country_df)
        size_df = build_size_dataset(data)
        sector_df = build_sector_dataset(data)
        tech_df = build_indicator_long_dataset(
            data,
            AI_TECHNOLOGY_INDICATORS,
            output_category="AI technology",
            unit="PC_ENT"
        )
        purpose_df = build_indicator_long_dataset(
            data,
            AI_PURPOSE_INDICATORS,
            output_category="AI purpose",
            unit="PC_ENT"
        )

        # Barreiras: aqui usamos PC_ENT_AI_TX, isto é, percentagem dentro das empresas que não usam IA.
        barriers_df = build_indicator_long_dataset(
            data,
            AI_BARRIER_INDICATORS,
            output_category="AI barrier among non-users",
            unit="PC_ENT_AI_TX"
        )

        report = build_report(country_df, warnings)

        # Guardar ficheiros.
        country_df.to_csv(output_dir / "dataset_final.csv", index=False, encoding="utf-8-sig")
        long_df.to_csv(output_dir / "dataset_final_long.csv", index=False, encoding="utf-8-sig")
        size_df.to_csv(output_dir / "dataset_dimensao_ai_2025.csv", index=False, encoding="utf-8-sig")
        sector_df.to_csv(output_dir / "dataset_setores_ai_2025.csv", index=False, encoding="utf-8-sig")
        tech_df.to_csv(output_dir / "dataset_tecnologias_ai_2025.csv", index=False, encoding="utf-8-sig")
        purpose_df.to_csv(output_dir / "dataset_finalidades_ai_2025.csv", index=False, encoding="utf-8-sig")
        barriers_df.to_csv(output_dir / "dataset_barreiras_ai_2025.csv", index=False, encoding="utf-8-sig")

        with open(output_dir / "dataset_final_report.json", "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)

        print("\nFicheiros gerados com sucesso:")
        for file in sorted(output_dir.glob("*")):
            print(f"  - {file}")

        print("\nResumo rápido:")
        print(f"  dataset_final.csv: {len(country_df)} linhas")
        print(f"  Países UE27:       {country_df['geo'].isin(EU27_CODES).sum()} linhas")
        print(f"  Agregado UE:       {country_df['geo'].eq('EU27_2020').sum()} linha")

        eu = country_df[country_df["geo"] == "EU27_2020"]
        pt = country_df[country_df["geo"] == "PT"]

        if not eu.empty:
            print(f"  IA EU27_2020:      {eu['ai_adoption_pct'].iloc[0]}%")
        if not pt.empty:
            print(f"  IA Portugal:       {pt['ai_adoption_pct'].iloc[0]}%")
            print(f"  Rank Portugal:     {pt['ai_rank_eu27'].iloc[0]} / 27")

        if warnings:
            print("\nAvisos:")
            for w in warnings:
                print(f"  - {w}")

        print("\nPróximo passo:")
        print("  Envia-me o ficheiro datasets_final/dataset_final.csv e, idealmente,")
        print("  também dataset_final_report.json para eu validar se está pronto para o poster em D3.")

    except Exception as exc:
        print(f"\nERRO: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

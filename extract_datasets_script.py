# download_eurostat_ai_datasets.py

import json
import time
from pathlib import Path
from itertools import product

import requests
import pandas as pd


DATASETS = {
    "isoc_eb_ai_2025": {
        "name": "IA por país / dimensão da empresa",
        "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/isoc_eb_ai?time=2025&lang=EN",
    },
    "isoc_eb_ain2_2025": {
        "name": "IA por setor de atividade económica",
        "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/isoc_eb_ain2?time=2025&lang=EN",
    },
    "isoc_cicce_use_2025": {
        "name": "Cloud computing nas empresas",
        "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/isoc_cicce_use?time=2025&lang=EN",
    },
    "isoc_eb_das_2025": {
        "name": "Data analytics nas empresas",
        "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/isoc_eb_das?time=2025&lang=EN",
    },
    "isoc_e_dii_2025": {
        "name": "Intensidade digital das empresas",
        "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/isoc_e_dii?time=2025&lang=EN",
    },
}


BASE_DIR = Path("datasets")
RAW_DIR = BASE_DIR / "raw_json"
CSV_DIR = BASE_DIR / "csv"
META_DIR = BASE_DIR / "metadata"


def setup_dirs():
    for folder in [BASE_DIR, RAW_DIR, CSV_DIR, META_DIR]:
        folder.mkdir(parents=True, exist_ok=True)


def download_json(url, retries=3, sleep_seconds=2):
    headers = {
        "User-Agent": "Mozilla/5.0 dataset-downloader/1.0",
        "Accept": "application/json",
    }

    last_error = None

    for attempt in range(1, retries + 1):
        try:
            response = requests.get(url, headers=headers, timeout=60)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            last_error = e
            print(f"  Tentativa {attempt}/{retries} falhou: {e}")
            time.sleep(sleep_seconds)

    raise RuntimeError(f"Falha ao descarregar depois de {retries} tentativas: {last_error}")


def get_dimension_codes_and_labels(dataset_json, dim_id):
    dim = dataset_json["dimension"][dim_id]
    categories = dim["category"]

    index = categories["index"]
    labels = categories.get("label", {})

    # O index pode vir como dict {codigo: posição}
    # ou como lista [codigo1, codigo2, ...]
    if isinstance(index, dict):
        ordered_codes = sorted(index.keys(), key=lambda code: index[code])
    elif isinstance(index, list):
        ordered_codes = index
    else:
        raise ValueError(f"Formato inesperado em category.index para dimensão {dim_id}")

    return [(code, labels.get(code, code)) for code in ordered_codes]


def get_value_at_position(values, position):
    """
    JSON-stat pode trazer:
    - value como lista: posição direta
    - value como dict: apenas posições com valor
    """
    if values is None:
        return None

    if isinstance(values, list):
        if position < len(values):
            return values[position]
        return None

    if isinstance(values, dict):
        return values.get(str(position), None)

    return None


def get_status_at_position(status, position):
    """
    Status pode vir como lista, dict ou nem existir.
    Ex.: valores com baixa fiabilidade, quebra de série, confidenciais, etc.
    """
    if status is None:
        return None

    if isinstance(status, list):
        if position < len(status):
            return status[position]
        return None

    if isinstance(status, dict):
        return status.get(str(position), None)

    return None


def flatten_jsonstat(dataset_json):
    """
    Converte JSON-stat da Eurostat para uma tabela plana.
    Cada linha fica com:
    - códigos das dimensões
    - labels das dimensões
    - valor
    - status/flag, se existir
    """

    dim_ids = dataset_json["id"]
    sizes = dataset_json["size"]

    dimensions = {
        dim_id: get_dimension_codes_and_labels(dataset_json, dim_id)
        for dim_id in dim_ids
    }

    values = dataset_json.get("value")
    status = dataset_json.get("status")

    rows = []

    # Multiplicadores para calcular a posição linear no cubo JSON-stat
    multipliers = []
    for i in range(len(sizes)):
        multiplier = 1
        for size in sizes[i + 1:]:
            multiplier *= size
        multipliers.append(multiplier)

    all_dimension_positions = [
        range(len(dimensions[dim_id]))
        for dim_id in dim_ids
    ]

    for positions in product(*all_dimension_positions):
        linear_position = sum(pos * mult for pos, mult in zip(positions, multipliers))
        value = get_value_at_position(values, linear_position)

        # Para não encher os CSV com combinações sem dados
        if value is None:
            continue

        row = {}

        for dim_id, pos in zip(dim_ids, positions):
            code, label = dimensions[dim_id][pos]
            row[dim_id] = code
            row[f"{dim_id}_label"] = label

        row["value"] = value
        row["status"] = get_status_at_position(status, linear_position)

        rows.append(row)

    return pd.DataFrame(rows)


def save_metadata(dataset_key, dataset_json):
    metadata = {
        "label": dataset_json.get("label"),
        "source": dataset_json.get("source"),
        "updated": dataset_json.get("updated"),
        "id": dataset_json.get("id"),
        "size": dataset_json.get("size"),
        "dimension_labels": {},
        "extension": dataset_json.get("extension", {}),
    }

    for dim_id in dataset_json.get("id", []):
        dim = dataset_json["dimension"][dim_id]
        metadata["dimension_labels"][dim_id] = {
            "label": dim.get("label"),
            "categories": dim.get("category", {}).get("label", {}),
        }

    meta_path = META_DIR / f"{dataset_key}_metadata.json"
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)

    return meta_path


def main():
    setup_dirs()

    report_rows = []

    print("A descarregar datasets Eurostat 2025...\n")

    for dataset_key, info in DATASETS.items():
        print(f"Dataset: {dataset_key}")
        print(f"  Nome: {info['name']}")
        print(f"  URL: {info['url']}")

        try:
            data = download_json(info["url"])

            raw_path = RAW_DIR / f"{dataset_key}.json"
            with open(raw_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

            df = flatten_jsonstat(data)

            csv_path = CSV_DIR / f"{dataset_key}.csv"
            df.to_csv(csv_path, index=False, encoding="utf-8-sig")

            meta_path = save_metadata(dataset_key, data)

            report_rows.append({
                "dataset_key": dataset_key,
                "name": info["name"],
                "url": info["url"],
                "rows_csv": len(df),
                "columns_csv": len(df.columns),
                "raw_json": str(raw_path),
                "csv": str(csv_path),
                "metadata": str(meta_path),
                "status": "OK",
                "error": "",
            })

            print(f"  OK: {len(df)} linhas guardadas em {csv_path}\n")

        except Exception as e:
            report_rows.append({
                "dataset_key": dataset_key,
                "name": info["name"],
                "url": info["url"],
                "rows_csv": 0,
                "columns_csv": 0,
                "raw_json": "",
                "csv": "",
                "metadata": "",
                "status": "ERRO",
                "error": str(e),
            })

            print(f"  ERRO: {e}\n")

    report = pd.DataFrame(report_rows)
    report_path = BASE_DIR / "download_report.csv"
    report.to_csv(report_path, index=False, encoding="utf-8-sig")

    print("Processo terminado.")
    print(f"Relatório guardado em: {report_path}")
    print(f"Pasta final: {BASE_DIR.resolve()}")


if __name__ == "__main__":
    main()
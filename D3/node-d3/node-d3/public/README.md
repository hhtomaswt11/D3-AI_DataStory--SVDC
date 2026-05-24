# Poster D3.js — Adoção de IA nas empresas europeias em 2025

Projeto para a UC Sistemas de Visualização de Dados e Conhecimento.

## Como correr com Node/npm

```bash
npm install
npm start
```

Depois abrir:

```text
http://localhost:3000
```

## Alternativa com Python

```bash
python -m http.server 8000
```

Depois abrir:

```text
http://localhost:8000
```

Não abrir o ficheiro `index.html` diretamente com duplo clique, porque o navegador pode bloquear o carregamento dos CSVs por causa das regras de segurança do `file://`.

## Estrutura esperada

```text
index.html
css/style.css
js/main.js
package.json
README.md
data/*.csv
```

A pasta `data/` deve manter os CSVs já gerados:

- `dataset_final.csv`
- `dataset_dimensao_ai_2025.csv`
- `dataset_setores_ai_2025.csv`
- `dataset_tecnologias_ai_2025.csv`
- `dataset_finalidades_ai_2025.csv`
- `dataset_barreiras_ai_2025.csv`
- `dataset_final_report.json`

## Pergunta de investigação

Em 2025, a utilização de Inteligência Artificial nas empresas europeias está mais associada à maturidade digital global, ao uso de cloud ou à capacidade de análise de dados?

## Melhorias adicionadas

Além dos gráficos principais, o poster inclui agora um bloco de diagnóstico analítico com:

- correlações entre IA e indicadores de maturidade digital;
- países com capacidade digital ainda não convertida em IA;
- profundidade de adoção de IA, comparando 1+, 2+ e 3+ tecnologias.

## Fonte

Eurostat, 2025. Datasets tratados para visualização em D3.js.

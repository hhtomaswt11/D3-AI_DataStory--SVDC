# Adoção de IA nas Empresas Europeias em 2025

Projeto desenvolvido para a UC **Sistemas de Visualização de Dados e Conhecimento (SVDC)**.

O projeto consiste num **poster/data story interativo em D3.js** sobre a adoção de tecnologias de Inteligência Artificial nas empresas europeias em 2025, usando dados tratados da **Eurostat**.

## Autores

- Tomás Melo
- Nuno Araújo

Mestrado em Inteligência Artificial · Universidade do Minho · 2025/2026

## Pergunta de investigação

> Em 2025, a utilização de Inteligência Artificial nas empresas europeias está mais associada à maturidade digital global, ao uso de cloud ou à capacidade de análise de dados?

## Objetivo do projeto

O objetivo é construir uma visualização exploratória e narrativa que permita perceber se a adoção de IA nas empresas europeias surge de forma isolada ou se está relacionada com condições digitais mais amplas, como:

- intensidade digital das empresas;
- utilização de serviços cloud;
- uso de data analytics;
- dimensão das empresas;
- setor de atividade económica;
- tecnologias de IA utilizadas;
- finalidades de uso;
- barreiras à adoção.

A visualização destaca também a posição de **Portugal** face à média da **União Europeia (EU27)**.

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript
- D3.js v7
- Node.js
- http-server
- Python
- pandas
- NumPy
- requests

## Dados usados

Os dados foram obtidos através da API da **Eurostat** e filtrados para o ano de **2025**.

Foram usados cinco datasets principais:

| Dataset Eurostat | Tema |
|---|---|
| `isoc_eb_ai` | Utilização de IA por país e dimensão da empresa |
| `isoc_eb_ain2` | Utilização de IA por setor de atividade económica |
| `isoc_cicce_use` | Utilização de cloud computing nas empresas |
| `isoc_eb_das` | Utilização de data analytics nas empresas |
| `isoc_e_dii` | Índice de intensidade digital das empresas |

A unidade principal é a **percentagem de empresas** (`PC_ENT`) com 10 ou mais pessoas empregadas.

## Indicadores principais

A partir dos dados tratados, o projeto analisa:

- percentagem de empresas que usam pelo menos uma tecnologia de IA;
- empresas que usam duas ou mais tecnologias de IA;
- empresas que usam três ou mais tecnologias de IA;
- uso de cloud computing;
- uso de data analytics;
- intensidade digital básica, alta e muito alta;
- diferença de cada país face à média da UE;
- ranking dos países da UE27;
- comparação entre Portugal e a UE27.

Alguns valores calculados no dataset final:

| Indicador | Valor |
|---|---:|
| Adoção de IA na UE27 | 19,95% |
| Adoção de IA em Portugal | 11,54% |
| Diferença de Portugal face à UE27 | -8,41 p.p. |
| País líder | Dinamarca, 42,03% |
| Correlação IA × cloud | 0,64 |
| Correlação IA × data analytics | 0,48 |
| Correlação IA × intensidade digital muito alta | 0,85 |

## Visualizações implementadas

O poster/data story está organizado como uma narrativa visual em cinco blocos principais. A numeração abaixo segue a versão atual do `index.html` e do `main.js`.

### Indicadores principais

Antes dos gráficos, o projeto apresenta quatro KPIs de síntese:

- adoção de IA na UE27;
- adoção de IA em Portugal;
- país líder na adoção de IA;
- relação/correlação mais forte observada.

### 01 · Geografia da adoção

1. **Mapa sintético da UE27**  
   Representação em grelha dos países da UE27, onde cada célula corresponde a um país e a cor representa a percentagem de empresas que usam pelo menos uma tecnologia de IA.

2. **Ranking UE27**  
   Ordenação dos países da UE27 por adoção de IA, com Portugal destacado e com a média da UE27 assinalada como referência.

### 02 · Maturidade digital

3. **IA vs intensidade digital muito alta**  
   Gráfico de dispersão que cruza adoção de IA com intensidade digital muito alta. O tamanho dos pontos representa o uso de cloud e a cor representa data analytics. Portugal surge destacado.

4. **Portugal vs UE27**  
   Comparação direta entre Portugal e a média europeia em IA, cloud, data analytics e intensidade digital alta. O gráfico inclui uma anotação específica para o gap de cloud entre Portugal e a UE27.

### 03 · Diagnóstico analítico

5. **Gap entre maturidade digital e adoção de IA**  
   Identifica países onde a maturidade digital é superior à adoção efetiva de IA, mostrando potencial digital ainda não convertido em utilização de IA.

6. **Adoção simples ou adoção intensiva?**  
   Compara a utilização de pelo menos uma tecnologia de IA, duas ou mais tecnologias e três ou mais tecnologias, distinguindo adoção superficial de adoção mais profunda.

### 04 · Estrutura empresarial

7. **Escala empresarial: UE27 vs Portugal**  
   Compara pequenas, médias e grandes empresas, mostrando que a adoção de IA aumenta com a dimensão empresarial e que Portugal fica abaixo da média europeia nos três grupos.

8. **Setores onde a IA está mais concentrada**  
   Mostra os setores da UE27 com maior percentagem de empresas que usam IA, evidenciando a concentração em áreas mais intensivas em informação, programação, investigação e comunicação.

### 05 · Usos, tecnologias e barreiras

9. **Tecnologias de IA mais usadas**  
   Apresenta as tecnologias de IA mais utilizadas pelas empresas europeias.

10. **Finalidades de uso**  
    Mostra as principais áreas de aplicação da IA nas empresas, como vendas, gestão, processos internos, segurança TIC e inovação.

11. **Barreiras à adoção: Portugal vs UE27**  
    Compara as barreiras reportadas por Portugal e pela média da UE27, mostrando onde Portugal se aproxima ou se afasta do padrão europeu.

> Nota: esta numeração substitui versões anteriores do projeto. Referências antigas a gráficos removidos ou com numeração diferente não devem ser usadas.

## Estrutura do projeto

```text
SVDC/
├── D3/
│   └── node-d3/
│       └── node-d3/
│           ├── package.json
│           ├── package-lock.json
│           ├── public/
│           │   ├── index.html
│           │   ├── README.md
│           │   ├── css/
│           │   │   └── style.css
│           │   ├── js/
│           │   │   └── main.js
│           │   └── data/
│           │       ├── dataset_final.csv
│           │       ├── dataset_final_long.csv
│           │       ├── dataset_dimensao_ai_2025.csv
│           │       ├── dataset_setores_ai_2025.csv
│           │       ├── dataset_tecnologias_ai_2025.csv
│           │       ├── dataset_finalidades_ai_2025.csv
│           │       ├── dataset_barreiras_ai_2025.csv
│           │       └── dataset_final_report.json
│
├── datasets/
│   ├── raw_json/
│   ├── metadata/
│   ├── csv/
│   │   ├── build_dataset_final_svdc.py
│   │   ├── isoc_eb_ai_2025.csv
│   │   ├── isoc_eb_ain2_2025.csv
│   │   ├── isoc_cicce_use_2025.csv
│   │   ├── isoc_eb_das_2025.csv
│   │   ├── isoc_e_dii_2025.csv
│   │   └── datasets_final/
│   └── download_report.csv
│
├── docs/
│   ├── Evaluation.pdf
│   └── evaluation_assignment.pdf
│
└── extract_datasets_script.py
```

## Como correr o projeto

### 1. Entrar na pasta da aplicação D3

```bash
cd D3/node-d3/node-d3
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Iniciar o servidor local

```bash
npm start
```

O projeto fica disponível em:

```text
http://localhost:3000
```

## Alternativa sem Node.js

Também é possível correr diretamente a pasta `public` com Python:

```bash
cd D3/node-d3/node-d3/public
python3 -m http.server 8000
```

Depois abrir no browser:

```text
http://localhost:8000
```

## Nota importante

Não se deve abrir o ficheiro `index.html` diretamente com duplo clique, porque o browser pode bloquear o carregamento dos ficheiros CSV devido às regras de segurança associadas ao protocolo `file://`.

O projeto deve ser aberto sempre através de um servidor local, como `http-server` ou `python3 -m http.server`.

## Problema comum no Ubuntu

Se aparecer o erro:

```bash
sh: 1: http-server: Permission denied
```

é provável que a pasta `node_modules` tenha vindo de outro sistema operativo, por exemplo Windows, e os executáveis tenham ficado sem permissões corretas em Linux.

A solução recomendada é apagar as dependências antigas e reinstalar no Ubuntu:

```bash
cd D3/node-d3/node-d3
rm -rf node_modules package-lock.json
npm install
npm start
```

Evitar correr com `sudo npm start`, porque isso pode criar novos problemas de permissões.

## Como reconstruir os datasets

O projeto já inclui os ficheiros CSV tratados dentro de:

```text
D3/node-d3/node-d3/public/data/
```

Caso seja necessário voltar a descarregar e tratar os dados, podem ser usados os scripts Python incluídos no projeto.

### 1. Instalar dependências Python

```bash
pip install pandas numpy requests
```

### 2. Descarregar dados da Eurostat

Na raiz do projeto:

```bash
python extract_datasets_script.py
```

Este script descarrega os dados para:

```text
datasets/raw_json/
datasets/csv/
datasets/metadata/
```

### 3. Gerar os datasets finais

A partir da raiz do projeto:

```bash
python datasets/csv/build_dataset_final_svdc.py
```

O script gera ficheiros tratados como:

```text
datasets_final/dataset_final.csv
datasets_final/dataset_final_long.csv
datasets_final/dataset_dimensao_ai_2025.csv
datasets_final/dataset_setores_ai_2025.csv
datasets_final/dataset_tecnologias_ai_2025.csv
datasets_final/dataset_finalidades_ai_2025.csv
datasets_final/dataset_barreiras_ai_2025.csv
datasets_final/dataset_final_report.json
```

Para a visualização D3 usar os novos dados, copiar esses ficheiros para:

```text
D3/node-d3/node-d3/public/data/
```

## Ficheiros principais da visualização

| Ficheiro | Função |
|---|---|
| `public/index.html` | Estrutura do poster e organização das secções |
| `public/css/style.css` | Estilos visuais, layout, tipografia e responsividade |
| `public/js/main.js` | Código D3.js responsável por carregar dados, calcular escalas e desenhar os gráficos |
| `public/data/*.csv` | Datasets tratados usados pela visualização |
| `public/data/dataset_final_report.json` | Resumo estatístico usado em KPIs e correlações |

## Conclusão do projeto

A leitura principal do poster é que a adoção de IA nas empresas europeias em 2025 não surge isolada. Os países com maior utilização de IA tendem também a apresentar maior maturidade digital, especialmente nos indicadores de intensidade digital muito alta.

Portugal aparece abaixo da média europeia na adoção de IA e no uso de cloud, mas apresenta uma base relevante de data analytics, sugerindo potencial de crescimento caso essa capacidade analítica seja combinada com maior integração tecnológica.

## Observações para GitHub

A pasta `node_modules/` não deve ser versionada no GitHub. Cada pessoa deve instalar as dependências localmente com:

```bash
npm install
```

É recomendado ter um ficheiro `.gitignore` com pelo menos:

```gitignore
node_modules/
.DS_Store
*.log
```

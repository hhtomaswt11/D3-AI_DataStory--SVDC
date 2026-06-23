# Adoção de IA nas Empresas Europeias em 2025

Data story interativo em **D3.js** sobre a adoção de tecnologias de Inteligência Artificial nas empresas europeias em 2025, com dados tratados da **Eurostat**.

Projeto desenvolvido para a UC **Sistemas de Visualização de Dados e Conhecimento (SVDC)**.

## Avaliação

**17.9 / 20.0**

## Autores

* Tomás Melo
* Nuno Araújo

Mestrado em Inteligência Artificial · Universidade do Minho · 2025/2026

## Pergunta de investigação

> Em 2025, a utilização de Inteligência Artificial nas empresas europeias está mais associada à maturidade digital global, ao uso de cloud ou à capacidade de análise de dados?

## Objetivo

O projeto procura perceber se a adoção de IA nas empresas europeias surge isoladamente ou se está relacionada com indicadores de maturidade digital, como:

* intensidade digital;
* cloud computing;
* data analytics;
* dimensão das empresas;
* setor de atividade;
* tecnologias, finalidades e barreiras à adoção.

A visualização destaca também a posição de **Portugal** face à média da **União Europeia (EU27)**.

## Tecnologias

* HTML5
* CSS3
* JavaScript
* D3.js v7
* Node.js
* Python
* pandas / NumPy / requests

## Dados

Os dados foram obtidos através da API da **Eurostat** e filtrados para o ano de **2025**.

Datasets principais:

| Dataset          | Tema                                            |
| ---------------- | ----------------------------------------------- |
| `isoc_eb_ai`     | Utilização de IA por país e dimensão da empresa |
| `isoc_eb_ain2`   | Utilização de IA por setor de atividade         |
| `isoc_cicce_use` | Cloud computing                                 |
| `isoc_eb_das`    | Data analytics                                  |
| `isoc_e_dii`     | Intensidade digital das empresas                |

A unidade principal é a percentagem de empresas com 10 ou mais pessoas empregadas.

## Principais resultados

| Indicador                                      |             Valor |
| ---------------------------------------------- | ----------------: |
| Adoção de IA na UE27                           |            19,95% |
| Adoção de IA em Portugal                       |            11,54% |
| Diferença de Portugal face à UE27              |        -8,41 p.p. |
| País líder                                     | Dinamarca, 42,03% |
| Correlação IA × cloud                          |              0,64 |
| Correlação IA × data analytics                 |              0,48 |
| Correlação IA × intensidade digital muito alta |              0,85 |

## Visualizações

O data story está organizado em cinco blocos:

1. **Geografia da adoção**
   Mapa sintético da UE27 e ranking dos países por adoção de IA.

2. **Maturidade digital**
   Relação entre IA, intensidade digital, cloud e data analytics.

3. **Diagnóstico analítico**
   Comparação entre maturidade digital e adoção efetiva de IA.

4. **Estrutura empresarial**
   Análise por dimensão das empresas e por setor de atividade.

5. **Usos, tecnologias e barreiras**
   Tecnologias de IA mais usadas, finalidades de uso e barreiras à adoção.

## Como correr o projeto

Entrar na pasta da aplicação:

```bash
cd D3/node-d3/node-d3
```

Instalar dependências:

```bash
npm install
```

Iniciar o servidor local:

```bash
npm start
```

Abrir no browser:

```text
http://localhost:3000
```

## Alternativa com Python

Também é possível correr diretamente a pasta `public`:

```bash
cd D3/node-d3/node-d3/public
python3 -m http.server 8000
```

Depois abrir:

```text
http://localhost:8000
```

> O ficheiro `index.html` não deve ser aberto diretamente com duplo clique, porque o browser pode bloquear o carregamento dos ficheiros CSV.

## Reconstrução dos datasets

O projeto já inclui os CSV tratados em:

```text
D3/node-d3/node-d3/public/data/
```

Para voltar a descarregar e tratar os dados:

```bash
pip install pandas numpy requests
python extract_datasets_script.py
python datasets/csv/build_dataset_final_svdc.py
```

Depois, copiar os ficheiros gerados para:

```text
D3/node-d3/node-d3/public/data/
```

## Conclusão

A adoção de IA nas empresas europeias em 2025 não surge de forma isolada. Os países com maior utilização de IA tendem também a apresentar maior maturidade digital, sobretudo ao nível da intensidade digital muito alta.

Portugal aparece abaixo da média europeia na adoção de IA e no uso de cloud, mas apresenta uma base relevante de data analytics, sugerindo potencial de crescimento caso essa capacidade analítica seja combinada com maior integração tecnológica.

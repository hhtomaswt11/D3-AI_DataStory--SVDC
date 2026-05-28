# D3.js — Adoção de IA nas empresas europeias em 2025

Projeto desenvolvido para a UC **Sistemas de Visualização de Dados e Conhecimento**, usando **D3.js** para construir uma narrativa visual sobre a adoção de Inteligência Artificial nas empresas europeias em 2025.

O trabalho procura perceber se a adoção de IA surge como um fenómeno isolado ou se aparece associada a contextos empresariais com maior maturidade digital, maior utilização de cloud e maior capacidade de análise de dados.

## Pergunta de investigação

**Em 2025, a utilização de Inteligência Artificial nas empresas europeias está mais associada à maturidade digital global, ao uso de cloud ou à capacidade de análise de dados?**

## Ideia principal

A leitura do projeto mostra que a IA empresarial tende a acompanhar ecossistemas empresariais mais digitalizados. Ou seja, a questão não é apenas perceber que países usam mais IA, mas também perceber que condições digitais tornam essa adoção mais provável.

Portugal surge abaixo da média europeia em adoção de IA e em uso de cloud, mas apresenta uma base relevante de data analytics. Isto sugere que existe capacidade digital que ainda não foi totalmente convertida em adoção efetiva de IA.

## Estrutura narrativa atual

A versão atual está organizada em cinco blocos de leitura:

1. **Geografia da adoção** — localização dos países onde a IA empresarial já ganhou mais escala.
2. **Maturidade digital** — relação entre IA, intensidade digital, cloud e data analytics.
3. **Diagnóstico analítico** — identificação de potencial digital ainda não convertido em IA.
4. **Estrutura empresarial** — diferenças por dimensão de empresa e por setor de atividade.
5. **Usos, tecnologias e barreiras** — tecnologias usadas, finalidades de uso e obstáculos à adoção.

## Visualizações incluídas

A numeração abaixo corresponde à versão atual do `index.html` e do `main.js`.

| Nº | Visualização | Objetivo |
|---:|---|---|
| 01 | Mapa sintético da UE27 | Mostrar a distribuição territorial da adoção de IA nas empresas. |
| 02 | Ranking UE27 | Comparar os países europeus e destacar Portugal face à média UE27. |
| 03 | IA vs intensidade digital muito alta | Relacionar adoção de IA com maturidade digital; o tamanho do ponto representa cloud e a cor representa data analytics. |
| 04 | Portugal vs UE27 | Comparar Portugal com a média europeia em IA, cloud, data analytics e intensidade digital alta. |
| 05 | Gap entre maturidade digital e adoção de IA | Identificar países com capacidade digital ainda não totalmente convertida em adoção de IA. |
| 06 | Adoção simples ou adoção intensiva? | Comparar a utilização de uma, duas ou três ou mais tecnologias de IA. |
| 07 | Escala empresarial: UE27 vs Portugal | Mostrar como a adoção de IA varia entre pequenas, médias e grandes empresas. |
| 08 | Setores onde a IA está mais concentrada | Identificar os setores europeus com maior adoção de IA. |
| 09 | Tecnologias de IA mais usadas | Mostrar quais são as tecnologias de IA mais presentes nas empresas. |
| 10 | Finalidades de uso | Explicar para que fins as empresas usam IA. |
| 11 | Barreiras à adoção: Portugal vs UE27 | Comparar os principais obstáculos reportados por Portugal e pela média europeia. |

> Nota: a numeração foi revista para corresponder apenas aos gráficos que existem atualmente no projeto. Referências a gráficos antigos/removidos não devem ser usadas.

## Dados utilizados

Os dados foram obtidos a partir do **Eurostat** e tratados previamente para ficheiros finais em CSV/JSON, usados diretamente pelas visualizações D3.

A pasta `data/` deve manter os seguintes ficheiros:

```text
data/dataset_final.csv
data/dataset_dimensao_ai_2025.csv
data/dataset_setores_ai_2025.csv
data/dataset_tecnologias_ai_2025.csv
data/dataset_finalidades_ai_2025.csv
data/dataset_barreiras_ai_2025.csv
data/dataset_final_report.json
```

## Estrutura esperada do projeto

```text
index.html
css/style.css
js/main.js
package.json
README.md
data/
  dataset_final.csv
  dataset_dimensao_ai_2025.csv
  dataset_setores_ai_2025.csv
  dataset_tecnologias_ai_2025.csv
  dataset_finalidades_ai_2025.csv
  dataset_barreiras_ai_2025.csv
  dataset_final_report.json
```

O projeto carrega o D3.js através de CDN no `index.html`, por isso não é obrigatório existir um ficheiro local `js/d3.v7.min.js`.

## Como correr com Node/npm

Instalar as dependências:

```bash
npm install
```

Iniciar o servidor local:

```bash
npm start
```

Depois abrir no navegador:

```text
http://localhost:3000
```

## Alternativa com Python

Também é possível correr com um servidor local simples em Python:

```bash
python -m http.server 8000
```

Depois abrir:

```text
http://localhost:8000
```

## Nota importante

Não abrir o ficheiro `index.html` diretamente com duplo clique, porque o navegador pode bloquear o carregamento dos ficheiros CSV/JSON devido às regras de segurança associadas ao protocolo `file://`.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- D3.js
- CSV/JSON
- Eurostat

## Fonte

**Eurostat, 2025.**  
Datasets tratados para visualização em D3.js.

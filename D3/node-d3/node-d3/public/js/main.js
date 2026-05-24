/*
  SVDC · D3.js Poster
  Tema: Adoção de IA nas empresas europeias em 2025
  Dados: Eurostat, tratados previamente para CSVs temáticos.

  Estrutura esperada:
  data/dataset_final.csv
  data/dataset_dimensao_ai_2025.csv
  data/dataset_setores_ai_2025.csv
  data/dataset_tecnologias_ai_2025.csv
  data/dataset_finalidades_ai_2025.csv
  data/dataset_barreiras_ai_2025.csv
  data/dataset_final_report.json
*/

const DATA_PATHS = {
  final: "data/dataset_final.csv",
  size: "data/dataset_dimensao_ai_2025.csv",
  sectors: "data/dataset_setores_ai_2025.csv",
  tech: "data/dataset_tecnologias_ai_2025.csv",
  purpose: "data/dataset_finalidades_ai_2025.csv",
  barriers: "data/dataset_barreiras_ai_2025.csv",
  report: "data/dataset_final_report.json"
};

const fmt = {
  pct: d3.format(".1f"),
  pct2: d3.format(".2f"),
  signed: d3.format("+.1f"),
  corr: d3.format(".2f")
};

const COLORS = {
  ink: "#18202a",
  muted: "#64748b",
  grid: "#e5e7eb",
  blue: "#2563eb",
  blueDark: "#1d4ed8",
  lightBlue: "#dbeafe",
  orange: "#f97316",
  amber: "#f59e0b",
  green: "#059669",
  red: "#dc2626",
  purple: "#7c3aed"
};

const EU27 = new Set([
  "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "EL", "ES", "FI", "FR", "HR", "HU", "IE", "IT",
  "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK"
]);

const TILE_POSITIONS = {
  FI: [6, 0], SE: [5, 1], EE: [7, 2],
  LV: [7, 3], LT: [7, 4], DK: [5, 3],
  IE: [1, 4], NL: [4, 4], BE: [3, 5], LU: [4, 5], DE: [5, 5], PL: [6, 5],
  CZ: [5, 6], AT: [5, 7], SK: [6, 7], HU: [6, 8],
  FR: [3, 7], SI: [5, 8], HR: [5, 9], RO: [7, 9],
  ES: [2, 9], PT: [1, 9], IT: [4, 9], BG: [7, 10],
  EL: [6, 11], MT: [4, 11], CY: [8, 11]
};

const COUNTRY_SHORT = {
  AT: "Áustria", BE: "Bélgica", BG: "Bulgária", CY: "Chipre", CZ: "Chéquia",
  DE: "Alemanha", DK: "Dinamarca", EE: "Estónia", EL: "Grécia", ES: "Espanha",
  FI: "Finlândia", FR: "França", HR: "Croácia", HU: "Hungria", IE: "Irlanda",
  IT: "Itália", LT: "Lituânia", LU: "Luxemburgo", LV: "Letónia", MT: "Malta",
  NL: "Países Baixos", PL: "Polónia", PT: "Portugal", RO: "Roménia", SE: "Suécia",
  SI: "Eslovénia", SK: "Eslováquia", EU27_2020: "UE27"
};

const LABELS = {
  ai_adoption_pct: "Empresas que usam IA",
  cloud_use_pct: "Uso de cloud paga",
  data_analytics_pct: "Data analytics",
  dii_high_pct: "Intensidade digital alta",
  dii_very_high_pct: "Intensidade digital muito alta",
  dii_at_least_basic_pct: "Intensidade digital básica+",
  digital_maturity_score_simple: "Score de maturidade digital"
};

const TECH_TRANSLATION = {
  "Text mining": "Text mining",
  "Speech recognition": "Reconhecimento de fala",
  "Generative pictures / video / sound": "Geração de imagem/vídeo/som",
  "Natural language generation / code generation": "Geração de linguagem/código",
  "Workflow automation / decision support": "Automação / apoio à decisão",
  "Machine learning for data analysis": "Machine learning para dados",
  "Image recognition / image processing": "Reconhecimento de imagem",
  "Autonomous robots / vehicles / drones": "Robôs/veículos/drones autónomos"
};

const PURPOSE_TRANSLATION = {
  "Marketing or sales": "Marketing ou vendas",
  "Business administration / management": "Administração / gestão",
  "Accounting / finance management": "Contabilidade / finanças",
  "Production processes": "Processos produtivos",
  "ICT security": "Segurança TIC",
  "R&D or innovation": "I&D / inovação",
  "Logistics": "Logística"
};

const BARRIER_TRANSLATION = {
  "Lack of relevant expertise": "Falta de conhecimento especializado",
  "Legal uncertainty": "Incerteza legal",
  "Data protection and privacy concerns": "Proteção de dados / privacidade",
  "Problems with data availability or quality": "Problemas com dados",
  "Incompatibility with existing systems": "Incompatibilidade com sistemas",
  "Costs too high": "Custos demasiado altos",
  "Ethical considerations": "Questões éticas",
  "AI not useful for the enterprise": "IA considerada pouco útil"
};

const SECTOR_SHORTEN = [
  [/Computer programming, consultancy, and information service activities/i, "Programação e serviços de informação"],
  [/Information and Communication Technology - total/i, "TIC · total"],
  [/Information and communication/i, "Informação e comunicação"],
  [/Publishing, motion picture.*broadcasting activities/i, "Media, audiovisual e broadcasting"],
  [/Scientific research and development/i, "Investigação científica e desenvolvimento"],
  [/Advertising and market research.*veterinary activities/i, "Publicidade, investigação de mercado e técnicos"],
  [/Manufacture of basic pharmaceutical products.*/i, "Indústria farmacêutica"],
  [/Professional, scientific and technical activities/i, "Atividades profissionais e científicas"],
  [/Telecommunications/i, "Telecomunicações"],
  [/Real estate activities.*scientific and technical activities/i, "Imobiliário + profissionais/científicas"],
  [/Legal and accounting activities.*technical testing and analysis/i, "Jurídico, contabilidade, engenharia e consultoria"],
  [/Manufacture of computer, electronic and optical products/i, "Equipamento informático/eletrónico/ótico"],
  [/Electricity, gas, steam and air conditioning supply/i, "Energia"],
  [/Construction/i, "Construção"],
  [/Transportation and storage/i, "Transportes e armazenagem"],
  [/Accommodation and food service/i, "Alojamento e restauração"]
];

function sectorLabel(label) {
  for (const [regex, replacement] of SECTOR_SHORTEN) {
    if (regex.test(label)) return replacement;
  }
  return label.length > 50 ? label.slice(0, 48) + "…" : label;
}

const SECTOR_CODE_LABELS = {
  "J62_J63": "Programação e serviços de informação",
  "J": "Informação e comunicação",
  "ICT": "TIC · total",
  "J58-J60": "Media, audiovisual e broadcasting",
  "M72": "Investigação científica e desenvolvimento",
  "M73-M75": "Publicidade, mercado e técnicos",
  "C21": "Indústria farmacêutica",
  "M": "Ativ. profissionais/científicas · total",
  "J61": "Telecomunicações",
  "L_M": "Imobiliário + serv. profissionais",
  "M69-M71": "Jurídico, contabilidade e engenharia",
  "C26": "Equipamento informático/eletrónico",
  "D": "Energia · total",
  "D35": "Energia elétrica, gás e vapor",
  "N79": "Agências de viagem",
  "F": "Construção",
  "H": "Transportes e armazenagem",
  "I": "Alojamento e restauração"
};

function sectorDisplay(rowOrCode, maybeLabel) {
  const code = typeof rowOrCode === "object" ? rowOrCode.nace_r2 : rowOrCode;
  const label = typeof rowOrCode === "object" ? rowOrCode.nace_r2_label : maybeLabel;
  return SECTOR_CODE_LABELS[code] || sectorLabel(label || code);
}

function pct(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(+value)) return "—";
  const f = digits === 2 ? fmt.pct2 : fmt.pct;
  return `${f(+value).replace(".", ",")}%`;
}

function pp(value) {
  if (value === null || value === undefined || Number.isNaN(+value)) return "—";
  return `${fmt.signed(+value).replace(".", ",")} p.p.`;
}

function shortCountry(row) {
  return COUNTRY_SHORT[row.geo] || row.geo_label || row.geo;
}

function isEUCountry(row) {
  return EU27.has(row.geo);
}

function isAggregate(row) {
  return row.geo === "EU27_2020" || row.is_eu_aggregate === true || row.is_eu_aggregate === "True";
}

function setLoading() {
  d3.selectAll(".chart").html(`<div class="loading">A carregar dados Eurostat tratados…</div>`);
}

function setError(error) {
  console.error(error);
  d3.selectAll(".chart").html(`
    <div class="error-box">
      <strong>Não foi possível carregar os CSVs.</strong><br />
      Abre o projeto através de um servidor local, por exemplo:<br />
      <code>python -m http.server 8000</code><br />
      Depois entra em <code>http://localhost:8000</code>.
    </div>
  `);
}

function getTooltip() {
  return d3.select("#tooltip");
}

function showTooltip(event, html) {
  getTooltip()
    .style("opacity", 1)
    .style("left", `${event.clientX}px`)
    .style("top", `${event.clientY}px`)
    .html(html);
}

function moveTooltip(event) {
  getTooltip()
    .style("left", `${event.clientX}px`)
    .style("top", `${event.clientY}px`);
}

function hideTooltip() {
  getTooltip().style("opacity", 0);
}

function clear(container) {
  d3.select(container).selectAll("*").remove();
}

function createSvg(container, width, height, margin = { top: 20, right: 20, bottom: 40, left: 50 }) {
  clear(container);
  const svg = d3.select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img");

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  return {
    svg,
    g,
    width,
    height,
    innerWidth: width - margin.left - margin.right,
    innerHeight: height - margin.top - margin.bottom,
    margin
  };
}

function addGridX(g, x, height) {
  g.append("g")
    .attr("class", "grid")
    .call(d3.axisBottom(x).ticks(5).tickSize(height).tickFormat(""))
    .selectAll("line")
    .attr("y1", 0)
    .attr("y2", height);
}

function addGridY(g, y, width) {
  g.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""));
}

function linearRegression(data, xAccessor, yAccessor) {
  const points = data
    .map(d => [xAccessor(d), yAccessor(d)])
    .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));

  const n = points.length;
  const meanX = d3.mean(points, d => d[0]);
  const meanY = d3.mean(points, d => d[1]);
  const numerator = d3.sum(points, d => (d[0] - meanX) * (d[1] - meanY));
  const denominator = d3.sum(points, d => Math.pow(d[0] - meanX, 2));
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;
  return { slope, intercept, n };
}

function updateKpis(finalData, report) {
  const eu = finalData.find(isAggregate);
  const pt = finalData.find(d => d.geo === "PT");
  const countries = finalData.filter(isEUCountry).sort((a, b) => d3.descending(a.ai_adoption_pct, b.ai_adoption_pct));
  const leader = countries[0];

  d3.select("#kpi-eu-ai").text(pct(eu.ai_adoption_pct));
  d3.select("#kpi-pt-ai").text(pct(pt.ai_adoption_pct));
  d3.select("#kpi-pt-gap").text(`${pp(pt.ai_gap_to_eu_pp)} face à média da UE · rank ${pt.ai_rank_eu27}/27`);
  d3.select("#kpi-leader").text(shortCountry(leader));
  d3.select("#kpi-leader-detail").text(`${pct(leader.ai_adoption_pct)} das empresas usam IA`);

  const corr = report?.correlations_eu27_only?.corr_ai_vs_dii_very_high_pct;
  d3.select("#kpi-corr").text(corr ? fmt.corr(corr).replace(".", ",") : "—");
  d3.select("#corr-cloud").text(report?.correlations_eu27_only?.corr_ai_vs_cloud_use_pct ? fmt.corr(report.correlations_eu27_only.corr_ai_vs_cloud_use_pct).replace(".", ",") : "—");
  d3.select("#corr-data").text(report?.correlations_eu27_only?.corr_ai_vs_data_analytics_pct ? fmt.corr(report.correlations_eu27_only.corr_ai_vs_data_analytics_pct).replace(".", ",") : "—");
  d3.select("#corr-dii").text(corr ? fmt.corr(corr).replace(".", ",") : "—");
}

function drawTileMap(finalData) {
  const countries = finalData.filter(isEUCountry).map(d => ({ ...d, pos: TILE_POSITIONS[d.geo] })).filter(d => d.pos);
  const { svg, g } = createSvg("#tile-map", 880, 780, { top: 28, right: 180, bottom: 60, left: 32 });

  const cell = 54;
  const gap = 8;
  const color = d3.scaleSequential()
    .domain([d3.min(countries, d => d.ai_adoption_pct), d3.max(countries, d => d.ai_adoption_pct)])
    .interpolator(d3.interpolateYlGnBu);

  const tiles = g.selectAll("g.country-tile")
    .data(countries)
    .join("g")
    .attr("class", "country-tile")
    .attr("transform", d => `translate(${d.pos[0] * (cell + gap)},${d.pos[1] * (cell + gap)})`)
    .on("mouseenter", (event, d) => showTooltip(event, `
      <strong>${shortCountry(d)}</strong>
      IA: ${pct(d.ai_adoption_pct)}<br />
      Cloud: ${pct(d.cloud_use_pct)}<br />
      Data analytics: ${pct(d.data_analytics_pct)}<br />
      Intensidade digital alta: ${pct(d.dii_high_pct)}
    `))
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  tiles.append("rect")
    .attr("width", cell)
    .attr("height", cell)
    .attr("rx", 13)
    .attr("fill", d => color(d.ai_adoption_pct))
    .attr("stroke", d => d.geo === "PT" ? COLORS.orange : "rgba(15, 23, 42, 0.16)")
    .attr("stroke-width", d => d.geo === "PT" ? 4 : 1.2);

  tiles.append("text")
    .attr("x", cell / 2)
    .attr("y", 22)
    .attr("text-anchor", "middle")
    .attr("font-size", 15)
    .attr("font-weight", 900)
    .attr("fill", d => d.ai_adoption_pct > 25 ? "#fff" : COLORS.ink)
    .text(d => d.geo);

  tiles.append("text")
    .attr("x", cell / 2)
    .attr("y", 41)
    .attr("text-anchor", "middle")
    .attr("font-size", 11)
    .attr("font-weight", 800)
    .attr("fill", d => d.ai_adoption_pct > 25 ? "#dbeafe" : COLORS.muted)
    .text(d => fmt.pct(d.ai_adoption_pct).replace(".", ","));

  const eu = finalData.find(isAggregate);
  const pt = finalData.find(d => d.geo === "PT");
  const note = svg.append("g").attr("transform", "translate(675,56)");

  note.append("text")
    .attr("class", "chart-title-small")
    .attr("x", 0)
    .attr("y", 0)
    .text("Referências");

  const callouts = [
    { label: "UE27", value: eu.ai_adoption_pct, color: COLORS.blue },
    { label: "Portugal", value: pt.ai_adoption_pct, color: COLORS.orange },
    { label: "Gap PT", value: pt.ai_gap_to_eu_pp, color: COLORS.orange, signed: true }
  ];

  const callout = note.selectAll("g.callout")
    .data(callouts)
    .join("g")
    .attr("transform", (d, i) => `translate(0,${32 + i * 74})`);

  callout.append("circle")
    .attr("r", 7)
    .attr("fill", d => d.color);

  callout.append("text")
    .attr("x", 18)
    .attr("y", -2)
    .attr("fill", COLORS.muted)
    .attr("font-size", 13)
    .attr("font-weight", 800)
    .text(d => d.label);

  callout.append("text")
    .attr("x", 18)
    .attr("y", 24)
    .attr("fill", COLORS.ink)
    .attr("font-size", 30)
    .attr("font-weight", 900)
    .attr("letter-spacing", "-0.06em")
    .text(d => d.signed ? pp(d.value) : pct(d.value));

  const legend = svg.append("g").attr("transform", "translate(675,390)");
  const defs = svg.append("defs");
  const gradient = defs.append("linearGradient")
    .attr("id", "legend-ai-gradient")
    .attr("x1", "0%")
    .attr("x2", "100%");

  d3.range(0, 1.01, 0.1).forEach(t => {
    gradient.append("stop")
      .attr("offset", `${t * 100}%`)
      .attr("stop-color", color(color.domain()[0] + t * (color.domain()[1] - color.domain()[0])));
  });

  legend.append("text")
    .attr("class", "chart-title-small")
    .attr("x", 0)
    .attr("y", 0)
    .text("% de empresas com IA");

  legend.append("rect")
    .attr("x", 0)
    .attr("y", 16)
    .attr("width", 150)
    .attr("height", 12)
    .attr("rx", 6)
    .attr("fill", "url(#legend-ai-gradient)");

  legend.append("text")
    .attr("class", "legend-label")
    .attr("x", 0)
    .attr("y", 48)
    .text(`${pct(color.domain()[0])}`);

  legend.append("text")
    .attr("class", "legend-label")
    .attr("x", 150)
    .attr("y", 48)
    .attr("text-anchor", "end")
    .text(`${pct(color.domain()[1])}`);
}

function drawCountryRanking(finalData) {
  const data = finalData.filter(isEUCountry).sort((a, b) => d3.descending(a.ai_adoption_pct, b.ai_adoption_pct));
  const eu = finalData.find(isAggregate);
  const { g, innerWidth, innerHeight } = createSvg("#country-ranking", 560, 620, { top: 48, right: 42, bottom: 40, left: 132 });

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.ai_adoption_pct) * 1.08])
    .range([0, innerWidth]);

  const y = d3.scaleBand()
    .domain(data.map(d => d.geo))
    .range([0, innerHeight])
    .padding(0.21);

  addGridX(g, x, innerHeight);

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).tickFormat(code => `${code} · ${COUNTRY_SHORT[code] || code}`))
    .selectAll("text")
    .attr("font-weight", d => d === "PT" ? 900 : 600)
    .attr("fill", d => d === "PT" ? COLORS.orange : COLORS.muted);

  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d}%`));

  g.append("line")
    .attr("x1", x(eu.ai_adoption_pct))
    .attr("x2", x(eu.ai_adoption_pct))
    .attr("y1", 0)
    .attr("y2", innerHeight)
    .attr("stroke", COLORS.red)
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "6 5");

  const meanLabel = g.append("g")
    .attr("transform", `translate(${x(eu.ai_adoption_pct)}, -18)`);

  meanLabel.append("rect")
    .attr("x", -54)
    .attr("y", -13)
    .attr("width", 108)
    .attr("height", 22)
    .attr("rx", 11)
    .attr("fill", "#fffdf8")
    .attr("stroke", "#fecaca")
    .attr("stroke-width", 1);

  meanLabel.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", COLORS.red)
    .attr("font-size", 12)
    .attr("font-weight", 900)
    .text(`Média UE ${pct(eu.ai_adoption_pct)}`);

  g.selectAll("rect.bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", d => y(d.geo))
    .attr("width", d => x(d.ai_adoption_pct))
    .attr("height", y.bandwidth())
    .attr("rx", y.bandwidth() / 2)
    .attr("fill", d => d.geo === "PT" ? COLORS.orange : d.ai_adoption_pct >= eu.ai_adoption_pct ? COLORS.blue : "#cbd5e1")
    .on("mouseenter", (event, d) => showTooltip(event, `
      <strong>${shortCountry(d)}</strong>
      Rank UE27: ${d.ai_rank_eu27}/27<br />
      IA: ${pct(d.ai_adoption_pct)}<br />
      Gap face à UE: ${pp(d.ai_gap_to_eu_pp)}
    `))
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  g.selectAll("text.value")
    .data(data)
    .join("text")
    .attr("class", "value")
    .attr("x", d => x(d.ai_adoption_pct) + 6)
    .attr("y", d => y(d.geo) + y.bandwidth() / 2 + 4)
    .attr("font-size", 11)
    .attr("font-weight", 800)
    .attr("fill", COLORS.muted)
    .text(d => fmt.pct(d.ai_adoption_pct).replace(".", ","));
}

function drawScatterMaturity(finalData) {
  const data = finalData.filter(isEUCountry);

  // Versão revista para reduzir sobreposição visual:
  // - área do gráfico ligeiramente maior;
  // - bolhas mais pequenas;
  // - linha de tendência recortada à área do gráfico;
  // - labels com offsets manuais e halo branco para melhorar legibilidade.
  const { svg, g, innerWidth, innerHeight, margin } = createSvg(
    "#scatter-maturity",
    940,
    620,
    { top: 30, right: 48, bottom: 82, left: 78 }
  );

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.dii_very_high_pct) * 1.18])
    .nice()
    .range([0, innerWidth]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.ai_adoption_pct) * 1.18])
    .nice()
    .range([innerHeight, 0]);

  const r = d3.scaleSqrt()
    .domain(d3.extent(data, d => d.cloud_use_pct))
    .range([4.5, 14]);

  const clipId = "clip-scatter-maturity";
  svg.append("defs")
    .append("clipPath")
    .attr("id", clipId)
    .append("rect")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .attr("width", innerWidth)
    .attr("height", innerHeight);

  addGridY(g, y, innerWidth);
  addGridX(g, x, innerHeight);

  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).ticks(6).tickFormat(d => `${d}%`));

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(6).tickFormat(d => `${d}%`));

  g.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 58)
    .attr("text-anchor", "middle")
    .attr("fill", COLORS.muted)
    .attr("font-size", 13)
    .attr("font-weight", 800)
    .text("Empresas com intensidade digital muito alta (%)");

  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -56)
    .attr("text-anchor", "middle")
    .attr("fill", COLORS.muted)
    .attr("font-size", 13)
    .attr("font-weight", 800)
    .text("Empresas que usam IA (%)");

  const plotArea = g.append("g").attr("clip-path", `url(#${clipId})`);

  const reg = linearRegression(data, d => d.dii_very_high_pct, d => d.ai_adoption_pct);
  const xDomain = x.domain();
  const regLine = [
    { x: xDomain[0], y: reg.intercept + reg.slope * xDomain[0] },
    { x: xDomain[1], y: reg.intercept + reg.slope * xDomain[1] }
  ];

  plotArea.append("path")
    .datum(regLine)
    .attr("fill", "none")
    .attr("stroke", COLORS.orange)
    .attr("stroke-width", 2.6)
    .attr("stroke-dasharray", "8 6")
    .attr("opacity", 0.95)
    .attr("d", d3.line().x(d => x(d.x)).y(d => y(d.y)));

  plotArea.selectAll("circle.point")
    .data(data)
    .join("circle")
    .attr("class", "point")
    .attr("cx", d => x(d.dii_very_high_pct))
    .attr("cy", d => y(d.ai_adoption_pct))
    .attr("r", d => r(d.cloud_use_pct))
    .attr("fill", d => d.geo === "PT" ? COLORS.orange : COLORS.blue)
    .attr("fill-opacity", d => d.geo === "PT" ? 0.95 : 0.62)
    .attr("stroke", "#fff")
    .attr("stroke-width", d => d.geo === "PT" ? 2.6 : 2)
    .on("mouseenter", (event, d) => showTooltip(event, `
      <strong>${shortCountry(d)}</strong>
      IA: ${pct(d.ai_adoption_pct)}<br />
      Intensidade digital muito alta: ${pct(d.dii_very_high_pct)}<br />
      Cloud: ${pct(d.cloud_use_pct)}<br />
      Data analytics: ${pct(d.data_analytics_pct)}
    `))
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  const labelOffsets = {
    PT: [12, -10],
    DK: [14, 2],
    FI: [12, 12],
    SE: [12, -10],
    RO: [12, 8],
    LU: [12, -10]
  };
  const labels = new Set(Object.keys(labelOffsets));

  g.selectAll("text.country-label")
    .data(data.filter(d => labels.has(d.geo)))
    .join("text")
    .attr("class", "country-label")
    .attr("x", d => x(d.dii_very_high_pct) + r(d.cloud_use_pct) + labelOffsets[d.geo][0])
    .attr("y", d => y(d.ai_adoption_pct) + labelOffsets[d.geo][1])
    .attr("font-size", 13)
    .attr("font-weight", 900)
    .attr("paint-order", "stroke")
    .attr("stroke", "#fffdf8")
    .attr("stroke-width", 5)
    .attr("stroke-linejoin", "round")
    .attr("fill", d => d.geo === "PT" ? COLORS.orange : COLORS.ink)
    .text(d => d.geo);

  const legend = g.append("g").attr("transform", `translate(${innerWidth - 188},${innerHeight - 88})`);
  legend.append("rect")
    .attr("width", 178)
    .attr("height", 72)
    .attr("rx", 14)
    .attr("fill", "rgba(255,255,255,0.88)")
    .attr("stroke", "#e5e7eb");

  legend.append("text")
    .attr("x", 14)
    .attr("y", 22)
    .attr("class", "chart-title-small")
    .text("Tamanho do ponto");

  legend.append("circle")
    .attr("cx", 32)
    .attr("cy", 50)
    .attr("r", r(35))
    .attr("fill", COLORS.lightBlue)
    .attr("stroke", COLORS.blue);

  legend.append("circle")
    .attr("cx", 72)
    .attr("cy", 50)
    .attr("r", r(75))
    .attr("fill", COLORS.lightBlue)
    .attr("stroke", COLORS.blue);

  legend.append("text")
    .attr("x", 100)
    .attr("y", 54)
    .attr("fill", COLORS.muted)
    .attr("font-size", 12)
    .text("uso de cloud");
}

function drawPortugalVsEU(finalData) {
  const eu = finalData.find(isAggregate);
  const pt = finalData.find(d => d.geo === "PT");
  const metrics = [
    ["IA", "ai_adoption_pct"],
    ["Cloud", "cloud_use_pct"],
    ["Analytics", "data_analytics_pct"],
    ["DII alta", "dii_high_pct"]
  ];

  const data = metrics.flatMap(([label, key]) => [
    { metric: label, group: "UE27", value: eu[key] },
    { metric: label, group: "Portugal", value: pt[key] }
  ]);

  const { g, innerWidth, innerHeight } = createSvg("#pt-vs-eu", 560, 390, { top: 24, right: 18, bottom: 58, left: 52 });
  const x0 = d3.scaleBand().domain(metrics.map(d => d[0])).range([0, innerWidth]).padding(0.28);
  const x1 = d3.scaleBand().domain(["UE27", "Portugal"]).range([0, x0.bandwidth()]).padding(0.12);
  const y = d3.scaleLinear().domain([0, 80]).range([innerHeight, 0]);
  const color = d3.scaleOrdinal().domain(["UE27", "Portugal"]).range([COLORS.blue, COLORS.orange]);

  addGridY(g, y, innerWidth);
  g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`));
  g.append("g").attr("class", "axis").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x0));

  g.selectAll("rect.compare")
    .data(data)
    .join("rect")
    .attr("class", "compare")
    .attr("x", d => x0(d.metric) + x1(d.group))
    .attr("y", d => y(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", d => innerHeight - y(d.value))
    .attr("rx", 8)
    .attr("fill", d => color(d.group))
    .on("mouseenter", (event, d) => showTooltip(event, `<strong>${d.group} · ${d.metric}</strong>${pct(d.value)}`))
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  g.selectAll("text.value")
    .data(data)
    .join("text")
    .attr("x", d => x0(d.metric) + x1(d.group) + x1.bandwidth() / 2)
    .attr("y", d => y(d.value) - 7)
    .attr("text-anchor", "middle")
    .attr("font-size", 11)
    .attr("font-weight", 900)
    .attr("fill", d => color(d.group))
    .text(d => fmt.pct(d.value).replace(".", ","));

  const legend = g.append("g").attr("transform", `translate(${innerWidth - 162},8)`);
  ["UE27", "Portugal"].forEach((name, i) => {
    const item = legend.append("g").attr("transform", `translate(${i * 84},0)`);
    item.append("rect").attr("width", 12).attr("height", 12).attr("rx", 3).attr("fill", color(name));
    item.append("text").attr("x", 18).attr("y", 11).attr("font-size", 12).attr("font-weight", 800).attr("fill", COLORS.muted).text(name);
  });
}

function drawSizeChart(sizeData) {
  // Grouped bars: UE27 vs Portugal, por dimensao empresarial
  const sizeOrder = ["10-49", "50-249", "GE250"];
  const sizeLabels = { "10-49": "Pequenas (10–49)", "50-249": "Medias (50–249)", "GE250": "Grandes (250+)" };

  const euRows = sizeData.filter(d => d.geo === "EU27_2020" && sizeOrder.includes(d.size_emp));
  const ptRows = sizeData.filter(d => d.geo === "PT" && sizeOrder.includes(d.size_emp));

  // Flat array for grouped bars
  const data = sizeOrder.flatMap(sz => [
    { size: sz, group: "UE27", value: (euRows.find(d => d.size_emp === sz) || {}).ai_adoption_pct || 0 },
    { size: sz, group: "Portugal", value: (ptRows.find(d => d.size_emp === sz) || {}).ai_adoption_pct || 0 }
  ]);

  const { g, innerWidth, innerHeight } = createSvg("#size-chart", 560, 370, { top: 48, right: 22, bottom: 62, left: 52 });
  const x0 = d3.scaleBand().domain(sizeOrder).range([0, innerWidth]).padding(0.28);
  const x1 = d3.scaleBand().domain(["UE27", "Portugal"]).range([0, x0.bandwidth()]).padding(0.1);
  const y = d3.scaleLinear().domain([0, 62]).range([innerHeight, 0]);
  const colorMap = { "UE27": COLORS.blue, "Portugal": COLORS.orange };

  addGridY(g, y, innerWidth);
  g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(5).tickFormat(d => d + "%"));

  const xAxis = g.append("g").attr("class", "axis").attr("transform", "translate(0," + innerHeight + ")")
    .call(d3.axisBottom(x0).tickFormat(d => sizeLabels[d].split(" ")[0]));
  xAxis.selectAll("text").attr("font-weight", 800);

  // Subtick labels
  sizeOrder.forEach(sz => {
    g.append("text")
      .attr("x", x0(sz) + x0.bandwidth() / 2)
      .attr("y", innerHeight + 42)
      .attr("text-anchor", "middle")
      .attr("fill", COLORS.muted)
      .attr("font-size", 11)
      .text(sizeLabels[sz].replace(/^\S+ /, ""));
  });

  // Bars
  const groups = g.selectAll("g.size-group")
    .data(sizeOrder)
    .join("g")
    .attr("class", "size-group")
    .attr("transform", sz => "translate(" + x0(sz) + ",0)");

  groups.selectAll("rect.size-bar")
    .data(sz => data.filter(d => d.size === sz))
    .join("rect")
    .attr("class", "size-bar")
    .attr("x", d => x1(d.group))
    .attr("y", d => y(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", d => innerHeight - y(d.value))
    .attr("rx", 7)
    .attr("fill", d => colorMap[d.group])
    .attr("fill-opacity", d => d.group === "Portugal" ? 0.88 : 0.72)
    .on("mouseenter", (event, d) => showTooltip(event,
      "<strong>" + d.group + " · " + sizeLabels[d.size] + "</strong>" +
      "Adoção de IA: " + pct(d.value)
    ))
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  // Value labels on top of bars
  groups.selectAll("text.size-val")
    .data(sz => data.filter(d => d.size === sz))
    .join("text")
    .attr("class", "size-val")
    .attr("x", d => x1(d.group) + x1.bandwidth() / 2)
    .attr("y", d => y(d.value) - 6)
    .attr("text-anchor", "middle")
    .attr("font-size", 12)
    .attr("font-weight", 900)
    .attr("fill", d => colorMap[d.group])
    .text(d => pct(d.value));

  // Gap annotations between bars for each size
  sizeOrder.forEach(sz => {
    const eu = data.find(d => d.size === sz && d.group === "UE27");
    const pt = data.find(d => d.size === sz && d.group === "Portugal");
    if (!eu || !pt) return;
    const gap = pt.value - eu.value;
    const midX = x0(sz) + x1("UE27") + (x1("Portugal") + x1.bandwidth() - x1("UE27")) / 2;
    const topY = Math.min(y(eu.value), y(pt.value)) - 20;
    g.append("text")
      .attr("x", midX)
      .attr("y", topY)
      .attr("text-anchor", "middle")
      .attr("font-size", 10.5)
      .attr("font-weight", 900)
      .attr("fill", COLORS.red)
      .text((gap >= 0 ? "+" : "") + gap.toFixed(1) + " p.p.");
  });

  // Legend
  const legend = g.append("g").attr("transform", "translate(0,-32)");
  ["UE27", "Portugal"].forEach((name, i) => {
    const item = legend.append("g").attr("transform", "translate(" + (i * 106) + ",0)");
    item.append("rect").attr("width", 12).attr("height", 12).attr("rx", 3).attr("fill", colorMap[name]);
    item.append("text").attr("x", 18).attr("y", 11).attr("font-size", 12).attr("font-weight", 800)
      .attr("fill", COLORS.muted).text(name);
  });
}

function drawSectorChart(sectorData) {
  const data = sectorData
    .filter(d => d.geo === "EU27_2020")
    .filter(d => String(d.is_total_sector).toLowerCase() !== "true")
    .sort((a, b) => d3.descending(a.ai_adoption_pct, b.ai_adoption_pct))
    .slice(0, 10)
    .reverse();

  const { g, innerWidth, innerHeight } = createSvg("#sector-chart", 920, 520, { top: 20, right: 56, bottom: 46, left: 310 });
  const x = d3.scaleLinear().domain([0, d3.max(data, d => d.ai_adoption_pct) * 1.12]).range([0, innerWidth]);
  const y = d3.scaleBand().domain(data.map(d => d.nace_r2)).range([innerHeight, 0]).padding(0.22);

  addGridX(g, x, innerHeight);
  g.append("g").attr("class", "axis").call(d3.axisLeft(y).tickFormat(code => sectorDisplay(data.find(d => d.nace_r2 === code))));
  g.append("g").attr("class", "axis").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x).ticks(6).tickFormat(d => `${d}%`));

  g.selectAll("rect.sector")
    .data(data)
    .join("rect")
    .attr("x", 0)
    .attr("y", d => y(d.nace_r2))
    .attr("width", d => x(d.ai_adoption_pct))
    .attr("height", y.bandwidth())
    .attr("rx", y.bandwidth() / 2)
    .attr("fill", (d, i) => i >= data.length - 3 ? COLORS.blueDark : COLORS.blue)
    .attr("fill-opacity", (d, i) => 0.46 + i / data.length * 0.52)
    .on("mouseenter", (event, d) => showTooltip(event, `
      <strong>${sectorDisplay(d)}</strong>
      Código NACE: ${d.nace_r2}<br />
      IA: ${pct(d.ai_adoption_pct)}<br />
      Rank no agregado UE: ${d.sector_rank_within_geo}
    `))
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  g.selectAll("text.sector-value")
    .data(data)
    .join("text")
    .attr("x", d => x(d.ai_adoption_pct) + 8)
    .attr("y", d => y(d.nace_r2) + y.bandwidth() / 2 + 5)
    .attr("font-size", 12)
    .attr("font-weight", 900)
    .attr("fill", COLORS.muted)
    .text(d => pct(d.ai_adoption_pct));
}

function drawSimpleHorizontalBars(container, rawData, options) {
  const {
    valueKey = "value",
    labelKey = "indicator_short_label",
    title = null,
    labelMap = {},
    color = COLORS.blue,
    height = 380,
    marginLeft = 210,
    marginBottom = 42,
    maxDomain = null,
    sort = "desc",
    tooltipUnit = "%",
    labelMaxChars = 32
  } = options;

  let data = rawData.slice();
  if (sort === "desc") data.sort((a, b) => d3.descending(+a[valueKey], +b[valueKey]));
  if (sort === "asc") data.sort((a, b) => d3.ascending(+a[valueKey], +b[valueKey]));
  data = data.reverse();

  const { g, innerWidth, innerHeight } = createSvg(container, 560, height, { top: title ? 42 : 16, right: 38, bottom: marginBottom, left: marginLeft });
  if (title) {
    g.append("text")
      .attr("x", 0)
      .attr("y", -20)
      .attr("class", "chart-title-small")
      .text(title);
  }

  const labels = d => labelMap[d[labelKey]] || d[labelKey];
  const x = d3.scaleLinear().domain([0, maxDomain || d3.max(data, d => +d[valueKey]) * 1.16]).range([0, innerWidth]);
  const y = d3.scaleBand().domain(data.map(d => d[labelKey])).range([innerHeight, 0]).padding(0.22);

  addGridX(g, x, innerHeight);
  g.append("g").attr("class", "axis").call(d3.axisLeft(y).tickFormat(key => {
    const row = data.find(d => d[labelKey] === key);
    const label = labels(row);
    return label.length > labelMaxChars ? label.slice(0, labelMaxChars - 2) + "…" : label;
  }));
  g.append("g").attr("class", "axis").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d}${tooltipUnit}`));

  const colorScale = d3.scaleLinear()
    .domain([0, Math.max(1, data.length - 1)])
    .range(["#bfdbfe", color]);

  g.selectAll("rect.bar")
    .data(data)
    .join("rect")
    .attr("x", 0)
    .attr("y", d => y(d[labelKey]))
    .attr("width", d => x(+d[valueKey]))
    .attr("height", y.bandwidth())
    .attr("rx", y.bandwidth() / 2)
    .attr("fill", (d, i) => colorScale(i))
    .on("mouseenter", (event, d) => showTooltip(event, `<strong>${labels(d)}</strong>${pct(+d[valueKey])}`))
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  g.selectAll("text.value")
    .data(data)
    .join("text")
    .attr("x", d => x(+d[valueKey]) + 7)
    .attr("y", d => y(d[labelKey]) + y.bandwidth() / 2 + 4)
    .attr("font-size", 12)
    .attr("font-weight", 900)
    .attr("fill", COLORS.muted)
    .text(d => pct(+d[valueKey]));
}

function drawTechnologyChart(techData) {
  const eu = techData.filter(d => d.geo === "EU27_2020");
  drawSimpleHorizontalBars("#tech-chart", eu, {
    labelMap: TECH_TRANSLATION,
    color: COLORS.purple,
    height: 420,
    marginLeft: 235,
    maxDomain: 13,
    tooltipUnit: "%"
  });
}

function drawPurposeChart(purposeData) {
  const eu = purposeData.filter(d => d.geo === "EU27_2020");
  drawSimpleHorizontalBars("#purpose-chart", eu, {
    labelMap: PURPOSE_TRANSLATION,
    color: COLORS.green,
    height: 380,
    marginLeft: 205,
    maxDomain: 8,
    tooltipUnit: "%"
  });
}

function drawBarrierChart(barrierData) {
  // PT vs EU27 lollipop side-by-side — mostra onde PT diverge da media europeia
  const eu = barrierData.filter(d => d.geo === "EU27_2020");
  const pt = barrierData.filter(d => d.geo === "PT");

  // Sort by EU value descending
  const sortedBarriers = eu
    .slice()
    .sort((a, b) => d3.ascending(a.value, b.value))
    .map(d => d.indicator_short_label);

  const combined = sortedBarriers.map(label => {
    const euRow = eu.find(d => d.indicator_short_label === label);
    const ptRow = pt.find(d => d.indicator_short_label === label);
    return {
      label: BARRIER_TRANSLATION[label] || label,
      eu: euRow ? euRow.value : 0,
      pt: ptRow ? ptRow.value : 0,
      diff: (ptRow ? ptRow.value : 0) - (euRow ? euRow.value : 0)
    };
  });

  const maxVal = d3.max(combined, d => Math.max(d.eu, d.pt)) * 1.12;

  const { g, innerWidth, innerHeight } = createSvg("#barrier-chart", 1080, 400,
    { top: 52, right: 36, bottom: 72, left: 290 });

  const x = d3.scaleLinear().domain([0, maxVal]).nice().range([0, innerWidth]);
  const y = d3.scaleBand().domain(combined.map(d => d.label)).range([innerHeight, 0]).padding(0.3);

  addGridX(g, x, innerHeight);

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll("text")
    .attr("font-size", 12)
    .attr("font-weight", d => {
      const item = combined.find(c => c.label === d);
      return (item && Math.abs(item.diff) > 2) ? 800 : 600;
    })
    .attr("fill", d => {
      const item = combined.find(c => c.label === d);
      return (item && item.diff > 2) ? COLORS.orange : COLORS.muted;
    });

  g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + innerHeight + ")")
    .call(d3.axisBottom(x).ticks(6).tickFormat(d => d + "%"));

  // Connecting line between EU and PT dots
  g.selectAll("line.connect")
    .data(combined)
    .join("line")
    .attr("class", "connect")
    .attr("x1", d => x(d.eu))
    .attr("x2", d => x(d.pt))
    .attr("y1", d => y(d.label) + y.bandwidth() / 2)
    .attr("y2", d => y(d.label) + y.bandwidth() / 2)
    .attr("stroke", d => d.diff >= 0 ? COLORS.orange : COLORS.green)
    .attr("stroke-opacity", d => Math.abs(d.diff) >= 1.5 ? 0.95 : 0.42)
    .attr("stroke-width", d => Math.abs(d.diff) >= 1.5 ? 2.2 : 1.2)
    .attr("stroke-dasharray", d => d.diff <= 0 ? "none" : "none");

  // EU dots
  g.selectAll("circle.dot-eu")
    .data(combined)
    .join("circle")
    .attr("class", "dot-eu")
    .attr("cx", d => x(d.eu))
    .attr("cy", d => y(d.label) + y.bandwidth() / 2)
    .attr("r", 7)
    .attr("fill", COLORS.blue)
    .attr("fill-opacity", 0.80)
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .on("mouseenter", (event, d) => showTooltip(event,
      "<strong>" + d.label + "</strong>" +
      "UE27: " + pct(d.eu) + "<br/>Portugal: " + pct(d.pt) + "<br/>" +
      "Diferenca PT\u2013UE: " + (d.diff >= 0 ? "+" : "") + d.diff.toFixed(1) + " p.p."
    ))
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  // PT dots — Portugal fica sempre a laranja para a legenda não ser ambígua.
  g.selectAll("circle.dot-pt")
    .data(combined)
    .join("circle")
    .attr("class", "dot-pt")
    .attr("cx", d => x(d.pt))
    .attr("cy", d => y(d.label) + y.bandwidth() / 2)
    .attr("r", 7)
    .attr("fill", COLORS.orange)
    .attr("fill-opacity", 0.95)
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .on("mouseenter", (event, d) => showTooltip(event,
      "<strong>" + d.label + "</strong>" +
      "UE27: " + pct(d.eu) + "<br/>Portugal: " + pct(d.pt) + "<br/>" +
      "Diferenca PT\u2013UE: " + (d.diff >= 0 ? "+" : "") + d.diff.toFixed(1) + " p.p."
    ))
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  // Diff label for high-diff items
  g.selectAll("text.diff-label")
    .data(combined.filter(d => Math.abs(d.diff) > 1.5))
    .join("text")
    .attr("class", "diff-label")
    .attr("x", d => x(Math.max(d.eu, d.pt)) + 10)
    .attr("y", d => y(d.label) + y.bandwidth() / 2 + 4)
    .attr("font-size", 11)
    .attr("font-weight", 900)
    .attr("fill", d => d.diff > 0 ? COLORS.orange : COLORS.green)
    .text(d => (d.diff > 0 ? "PT +" : "PT ") + d.diff.toFixed(1) + " p.p.");

  // Legend
  const legend = g.append("g").attr("transform", "translate(0,-36)");
  [
    { label: "UE27", color: COLORS.blue, r: 7 },
    { label: "Portugal", color: COLORS.orange, r: 7 }
  ].forEach((item, i) => {
    const grp = legend.append("g").attr("transform", "translate(" + (i * 110) + ",0)");
    grp.append("circle").attr("cx", 7).attr("cy", 0).attr("r", item.r)
      .attr("fill", item.color).attr("fill-opacity", 0.85);
    grp.append("text").attr("x", 20).attr("y", 4).attr("font-size", 12)
      .attr("font-weight", 800).attr("fill", COLORS.muted).text(item.label);
  });

  // Footnote
  g.append("text")
    .attr("x", 0)
    .attr("y", innerHeight + 58)
    .attr("fill", COLORS.muted)
    .attr("font-size", 11)
    .attr("font-weight", 700)
    .text("Nota: percentagem calculada entre empresas que nao usam IA. A linha mostra a diferenca PT-UE.");
}



function drawCorrelationChart(report) {
  const corr = report?.correlations_eu27_only || {};
  const data = [
    { label: "Intensidade digital muito alta", value: corr.corr_ai_vs_dii_very_high_pct, color: COLORS.blueDark },
    { label: "Intensidade digital básica+", value: corr.corr_ai_vs_dii_at_least_basic_pct, color: COLORS.blue },
    { label: "Intensidade digital alta", value: corr.corr_ai_vs_dii_high_pct, color: COLORS.blue },
    { label: "Score de maturidade digital", value: corr.corr_ai_vs_digital_maturity_score_simple, color: COLORS.cyan },
    { label: "Uso de cloud", value: corr.corr_ai_vs_cloud_use_pct, color: COLORS.orange },
    { label: "Data analytics", value: corr.corr_ai_vs_data_analytics_pct, color: COLORS.green }
  ]
    .filter(d => Number.isFinite(+d.value))
    .sort((a, b) => d3.ascending(a.value, b.value));

  const { g, innerWidth, innerHeight } = createSvg("#correlation-chart", 560, 430, { top: 24, right: 48, bottom: 54, left: 212 });
  const x = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);
  const y = d3.scaleBand().domain(data.map(d => d.label)).range([innerHeight, 0]).padding(0.26);

  addGridX(g, x, innerHeight);
  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).tickSize(0));

  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d => d3.format(".1f")(d).replace(".", ",")));

  g.selectAll("rect.corr-bar")
    .data(data)
    .join("rect")
    .attr("class", "corr-bar")
    .attr("x", 0)
    .attr("y", d => y(d.label))
    .attr("width", d => x(d.value))
    .attr("height", y.bandwidth())
    .attr("rx", y.bandwidth() / 2)
    .attr("fill", d => d.color)
    .attr("fill-opacity", 0.86)
    .on("mouseenter", (event, d) => showTooltip(event, `<strong>${d.label}</strong>Correlação com adoção de IA: ${fmt.corr(d.value).replace(".", ",")}`))
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  g.selectAll("text.corr-value")
    .data(data)
    .join("text")
    .attr("x", d => x(d.value) + 8)
    .attr("y", d => y(d.label) + y.bandwidth() / 2 + 4)
    .attr("fill", COLORS.ink)
    .attr("font-size", 13)
    .attr("font-weight", 900)
    .text(d => fmt.corr(d.value).replace(".", ","));

  g.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 42)
    .attr("text-anchor", "middle")
    .attr("fill", COLORS.muted)
    .attr("font-size", 12)
    .attr("font-weight", 800)
    .text("Correlação linear com adoção de IA nos países UE27");
}

function drawMaturityAiGap(finalData) {
  // Top 10 paises com maior gap entre maturidade digital e adocao de IA
  // digital_maturity_minus_ai_pp = digital_maturity_score_simple - ai_adoption_pct
  const data = finalData
    .filter(isEUCountry)
    .filter(d => Number.isFinite(d.digital_maturity_minus_ai_pp) && Number.isFinite(d.ai_adoption_pct))
    .sort((a, b) => d3.descending(a.digital_maturity_minus_ai_pp, b.digital_maturity_minus_ai_pp))
    .slice(0, 10)
    .reverse();

  const eu = finalData.find(isAggregate);
  const { g, innerWidth, innerHeight } = createSvg("#conversion-gap", 560, 430, { top: 28, right: 58, bottom: 52, left: 130 });

  const maxGap = d3.max(data, d => d.digital_maturity_minus_ai_pp) * 1.18;
  const x = d3.scaleLinear().domain([0, maxGap]).nice().range([0, innerWidth]);
  const y = d3.scaleBand().domain(data.map(d => d.geo)).range([innerHeight, 0]).padding(0.24);

  addGridX(g, x, innerHeight);

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).tickFormat(code => `${code} · ${COUNTRY_SHORT[code] || code}`))
    .selectAll("text")
    .attr("font-weight", d => d === "PT" ? 900 : 650)
    .attr("fill", d => d === "PT" ? COLORS.orange : COLORS.muted);

  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d => `+${d} p.p.`));

  // Referencia EU27
  if (eu && Number.isFinite(eu.digital_maturity_minus_ai_pp)) {
    g.append("line")
      .attr("x1", x(eu.digital_maturity_minus_ai_pp))
      .attr("x2", x(eu.digital_maturity_minus_ai_pp))
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", COLORS.red)
      .attr("stroke-width", 1.8)
      .attr("stroke-dasharray", "6 4");

    g.append("text")
      .attr("x", x(eu.digital_maturity_minus_ai_pp) + 5)
      .attr("y", -10)
      .attr("fill", COLORS.red)
      .attr("font-size", 11)
      .attr("font-weight", 900)
      .text("UE27 +" + eu.digital_maturity_minus_ai_pp.toFixed(1) + " p.p.");
  }

  // Barras do gap
  g.selectAll("rect.gap-bar")
    .data(data)
    .join("rect")
    .attr("class", "gap-bar")
    .attr("x", 0)
    .attr("y", d => y(d.geo))
    .attr("width", d => x(d.digital_maturity_minus_ai_pp))
    .attr("height", y.bandwidth())
    .attr("rx", y.bandwidth() / 2)
    .attr("fill", d => d.geo === "PT" ? COLORS.orange : COLORS.amber)
    .attr("fill-opacity", d => d.geo === "PT" ? 0.92 : 0.68)
    .on("mouseenter", (event, d) => showTooltip(event,
      "<strong>" + (COUNTRY_SHORT[d.geo] || d.geo) + "</strong>" +
      "Gap maturidade→IA: +" + d.digital_maturity_minus_ai_pp.toFixed(1) + " p.p.<br/>" +
      "Score maturidade digital: " + pct(d.digital_maturity_score_simple) + "<br/>" +
      "Adoção de IA: " + pct(d.ai_adoption_pct) + "<br/>" +
      "<em>Potencial digital ainda não convertido em IA</em>"
    ))
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  // Valores no fim das barras
  g.selectAll("text.gap-value")
    .data(data)
    .join("text")
    .attr("x", d => x(d.digital_maturity_minus_ai_pp) + 6)
    .attr("y", d => y(d.geo) + y.bandwidth() / 2 + 4)
    .attr("fill", COLORS.muted)
    .attr("font-size", 12)
    .attr("font-weight", 900)
    .text(d => "+" + d.digital_maturity_minus_ai_pp.toFixed(1));

  g.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 42)
    .attr("text-anchor", "middle")
    .attr("fill", COLORS.muted)
    .attr("font-size", 12)
    .attr("font-weight", 800)
    .text("Gap entre score de maturidade digital e adoção de IA (p.p.)");
}

function drawAIDepth(finalData) {
  const wanted = ["EU27_2020", "PT", "DK", "FI", "SE", "RO"];
  const data = wanted
    .map(code => finalData.find(d => d.geo === code))
    .filter(Boolean);

  const series = [
    { key: "ai_adoption_pct", label: "1+ tecnologia", color: COLORS.blue },
    { key: "ai_two_or_more_technologies_pct", label: "2+ tecnologias", color: COLORS.purple },
    { key: "ai_three_or_more_technologies_pct", label: "3+ tecnologias", color: COLORS.orange }
  ];

  const { g, innerWidth, innerHeight } = createSvg("#ai-depth", 560, 430, { top: 54, right: 42, bottom: 52, left: 116 });
  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.ai_adoption_pct) * 1.12])
    .nice()
    .range([0, innerWidth]);
  const y = d3.scaleBand().domain(data.map(d => d.geo)).range([0, innerHeight]).padding(0.22);
  const innerBand = d3.scaleBand().domain(series.map(s => s.key)).range([0, y.bandwidth()]).padding(0.16);

  addGridX(g, x, innerHeight);
  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).tickFormat(code => COUNTRY_SHORT[code] || code));
  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d}%`));

  const groups = g.selectAll("g.depth-row")
    .data(data)
    .join("g")
    .attr("class", "depth-row")
    .attr("transform", d => `translate(0,${y(d.geo)})`);

  groups.selectAll("rect.depth-bar")
    .data(d => series.map(s => ({ ...s, geo: d.geo, country: shortCountry(d), value: d[s.key] })))
    .join("rect")
    .attr("class", "depth-bar")
    .attr("x", 0)
    .attr("y", d => innerBand(d.key))
    .attr("width", d => x(d.value))
    .attr("height", innerBand.bandwidth())
    .attr("rx", innerBand.bandwidth() / 2)
    .attr("fill", d => d.color)
    .attr("fill-opacity", 0.82)
    .on("mouseenter", (event, d) => showTooltip(event, `<strong>${d.country}</strong>${d.label}: ${pct(d.value)}`))
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  groups.selectAll("text.depth-value")
    .data(d => series.map(s => ({ ...s, geo: d.geo, value: d[s.key] })))
    .join("text")
    .attr("class", "depth-value")
    .attr("x", d => x(d.value) + 6)
    .attr("y", d => innerBand(d.key) + innerBand.bandwidth() / 2 + 4)
    .attr("fill", COLORS.muted)
    .attr("font-size", 10.5)
    .attr("font-weight", 900)
    .text(d => pct(d.value));

  const legend = g.append("g").attr("transform", "translate(0,-36)");
  series.forEach((s, i) => {
    const item = legend.append("g").attr("transform", `translate(${i * 132},0)`);
    item.append("rect").attr("width", 12).attr("height", 12).attr("rx", 3).attr("fill", s.color);
    item.append("text").attr("x", 18).attr("y", 11).attr("font-size", 11).attr("font-weight", 850).attr("fill", COLORS.muted).text(s.label);
  });

  g.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 40)
    .attr("text-anchor", "middle")
    .attr("fill", COLORS.muted)
    .attr("font-size", 12)
    .attr("font-weight", 800)
    .text("Empresas por profundidade de adoção de tecnologias de IA (%)");
}

async function init() {
  setLoading();

  try {
    const [finalData, sizeData, sectorData, techData, purposeData, barrierData, report] = await Promise.all([
      d3.csv(DATA_PATHS.final, d3.autoType),
      d3.csv(DATA_PATHS.size, d3.autoType),
      d3.csv(DATA_PATHS.sectors, d3.autoType),
      d3.csv(DATA_PATHS.tech, d3.autoType),
      d3.csv(DATA_PATHS.purpose, d3.autoType),
      d3.csv(DATA_PATHS.barriers, d3.autoType),
      d3.json(DATA_PATHS.report)
    ]);

    // Limpeza leve defensiva: garantir valores numéricos nos campos usados.
    finalData.forEach(d => {
      Object.keys(d).forEach(k => {
        if (k.endsWith("_pct") || k.endsWith("_pp") || k.includes("score") || k.includes("rank")) d[k] = +d[k];
      });
    });
    [sizeData, sectorData, techData, purposeData, barrierData].forEach(table => {
      table.forEach(d => {
        if (d.value !== undefined) d.value = +d.value;
        if (d.ai_adoption_pct !== undefined) d.ai_adoption_pct = +d.ai_adoption_pct;
      });
    });

    updateKpis(finalData, report);
    drawTileMap(finalData);
    drawCountryRanking(finalData);
    drawScatterMaturity(finalData);
    drawPortugalVsEU(finalData);
    drawSizeChart(sizeData);
    drawSectorChart(sectorData);
    drawCorrelationChart(report);
    drawMaturityAiGap(finalData);
    drawAIDepth(finalData);
    drawTechnologyChart(techData);
    drawPurposeChart(purposeData);
    drawBarrierChart(barrierData);
  } catch (error) {
    setError(error);
  }
}

init();

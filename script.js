// Função para formatar números com separadores
function formatNumber(n) {
  return Number(n).toLocaleString('en-US');
}

// ================= POPULAÇÃO & DENSIDADE =================
async function carregarPopulacao() {
  try {
    const res = await fetch('https://api.worldbank.org/v2/country/US/indicator/SP.POP.TOTL?format=json');
    const data = await res.json();
    const ultimo = data[1].find(x => x.value !== null);

    document.getElementById('populacao').innerText = formatNumber(ultimo.value) + ' habitantes';

    const densRes = await fetch('https://api.worldbank.org/v2/country/US/indicator/EN.POP.DNST?format=json');
    const densData = await densRes.json();
    const densUltimo = densData[1].find(x => x.value !== null);

    document.getElementById('densidade').innerText = densUltimo.value.toFixed(1) + ' hab/km²';
  } catch {
    document.getElementById('populacao').innerText = 'Erro ao carregar.';
    document.getElementById('densidade').innerText = 'Erro ao carregar.';
  }
}

// ================= PIB TOTAL & PER CAPITA =================
async function carregarPIB() {
  try {
    const res = await fetch('https://api.worldbank.org/v2/country/US/indicator/NY.GDP.MKTP.CD?format=json&per_page=20');
    const data = await res.json();
    const serie = data[1].filter(x => x.value !== null).slice(0, 10).reverse();

    // PIB total
    const ultimo = serie[serie.length - 1];
    document.getElementById('pib').innerHTML = `PIB total (${ultimo.date}): <strong>$${formatNumber(ultimo.value)}</strong>`;

    // PIB per capita
    const resPc = await fetch('https://api.worldbank.org/v2/country/US/indicator/NY.GDP.PCAP.CD?format=json');
    const dataPc = await resPc.json();
    const pc = dataPc[1].find(x => x.value !== null);

    document.getElementById('pibpc').innerHTML = `PIB per capita (${pc.date}): <strong>$${formatNumber(pc.value)}</strong>`;

    // Criar gráfico
    const anos = serie.map(x => x.date);
    const valores = serie.map(x => x.value);

    const ctx = document.getElementById('graficoPIB');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: anos,
        datasets: [{
          label: 'PIB (US$ correntes)',
          data: valores,
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            ticks: {
              callback: value => '$' + (value / 1e12).toFixed(1) + 'T'
            }
          }
        }
      }
    });

  } catch (e) {
    console.log(e);
    document.getElementById('pib').innerText = 'Erro ao carregar PIB.';
  }
}

// ================= CRESCIMENTO ECONÓMICO =================
async function carregarCrescimento() {
  try {
    const res = await fetch('https://api.worldbank.org/v2/country/US/indicator/NY.GDP.MKTP.KD.ZG?format=json');
    const data = await res.json();
    const ultimo = data[1].find(x => x.value !== null);

    document.getElementById('crescimento').innerHTML = `Crescimento (${ultimo.date}): <strong>${ultimo.value}%</strong>`;
  } catch {
    document.getElementById('crescimento').innerText = 'Erro ao carregar.';
  }
}

// ================= DESEMPREGO =================
function carregarDesemprego() {
  // BLS tem bloqueio CORS → colocar valor manual aproximado
  document.getElementById('desemprego').innerHTML =
    'Taxa de desemprego aproximada (BLS, 2024): <strong>4.0%</strong>';
}

// ================= INICIAR CARREGAMENTO =================
carregarPopulacao();
carregarPIB();
carregarCrescimento();
carregarDesemprego();
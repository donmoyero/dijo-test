/* ================= GLOBAL STATE ================= */

let businessData = [];
let currentCurrency = "GBP";

let revenueChart = null;
let profitChart = null;
let expenseChart = null;

let performanceBarChart = null;
let distributionPieChart = null;
let aiForecastChart = null;

let aiChatHistory = []; // Store chat history for better advice insights

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {

  bindGlobalFunctions();

  // Initialize AI Insights on all sections
  renderAIInsights(); 
});

/* ================= CURRENCY ================= */

function setCurrency(currency) {
  currentCurrency = currency;
  updateAll();
}

function formatCurrency(val) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currentCurrency
  }).format(val);
}

/* ================= ADD DATA ================= */

function addData() {
  const monthValue = document.getElementById("month").value;
  const revenue = parseFloat(document.getElementById("revenue").value);
  const expenses = parseFloat(document.getElementById("expenses").value);

  if (!monthValue || isNaN(revenue) || isNaN(expenses)) {
    alert("Enter valid revenue and expense data.");
    return;
  }

  const date = new Date(monthValue + "-01");
  const profit = revenue - expenses;

  businessData.push({ date, revenue, expenses, profit });
  businessData.sort((a, b) => a.date - b.date);

  updateAll();
}

/* ================= MASTER UPDATE ================= */

function updateAll() {
  renderRecordsTable();
  updateProgressIndicator();
  renderCoreCharts();
  renderAIInsights(); // Call AI Insights on every update

  if (businessData.length >= 3) {
    renderPerformanceMatrix();
    renderRiskAssessment();
  }
}

/* ================= AI INSIGHTS ================= */

// Render AI Insights based on business data
function renderAIInsights() {
  const aiInsightsSection = document.getElementById("aiInsights");
  if (!aiInsightsSection) return;

  const totalRevenue = sum("revenue");
  const totalProfit = sum("profit");
  const profitMargin = getMargin();
  const growthRate = calculateMonthlyGrowth();
  const volatility = calculateVolatility();

  aiInsightsSection.innerHTML = `
    <h3>AI Financial Insights</h3>
    <p><strong>Total Revenue:</strong> ${formatCurrency(totalRevenue)}</p>
    <p><strong>Total Profit:</strong> ${formatCurrency(totalProfit)}</p>
    <p><strong>Profit Margin:</strong> ${profitMargin.toFixed(2)}%</p>
    <p><strong>Growth Rate:</strong> ${growthRate.toFixed(2)}%</p>
    <p><strong>Volatility:</strong> ${volatility.toFixed(2)}%</p>
    <h4>AI Recommendations:</h4>
    <ul>
      <li>${growthRate > 10 ? "Strong growth. Keep up the momentum!" : "Consider expanding marketing efforts to boost growth."}</li>
      <li>${volatility > 30 ? "High volatility detected. Risk management needed." : "Stable operational performance."}</li>
      <li>${profitMargin < 10 ? "Profit margin is low. Consider reducing expenses or increasing prices." : "Your profit margin is healthy."}</li>
    </ul>
  `;
}

/* ================= PERFORMANCE MATRIX ================= */

function renderPerformanceMatrix() {
  const volatility = calculateVolatility();
  const growth = calculateMonthlyGrowth();
  const margin = getMargin();

  const stability = 100 - volatility;
  const growthScore = growth * 4;
  const profitScore = margin * 3;

  performanceBarChart?.destroy();
  distributionPieChart?.destroy();

  performanceBarChart = new Chart(
    document.getElementById("performanceBarChart"),
    {
      type: "bar",
      data: {
        labels: ["Stability", "Growth", "Profit"],
        datasets: [{
          data: [stability, growthScore, profitScore]
        }]
      },
      options: { responsive: true }
    }
  );

  distributionPieChart = new Chart(
    document.getElementById("distributionPieChart"),
    {
      type: "doughnut",
      data: {
        labels: ["Stability", "Growth", "Profit"],
        datasets: [{
          data: [stability, growthScore, profitScore]
        }]
      }
    }
  );

  const health = Math.round((stability + growthScore + profitScore) / 3);
  setText("businessHealthIndex", `Business Health Score: ${health}/100`);
}

/* ================= RISK ================= */

function renderRiskAssessment() {
  const volatility = calculateVolatility();
  const margin = getMargin();

  setText("stabilityRisk", volatility > 30 ? "Elevated" : "Low");
  setText("marginRisk", margin < 10 ? "Elevated" : "Low");
  setText("liquidityRisk", margin > 5 ? "Stable" : "Weak");

  let insight = "Operational risk currently manageable.";

  if (volatility > 30)
    insight = "Revenue volatility indicates unstable income patterns.";
  if (margin < 10)
    insight += " Profit margin pressure detected.";

  setText("riskInsight", insight);
}

/* ================= IMPACTGRID AI CHAT ================= */

function askImpactGridAI() {
  const input = document.getElementById("aiChatInput");
  const output = document.getElementById("aiChatOutput");

  if (!input || !output) return;

  const question = input.value.trim();
  if (question === "") return;

  output.innerHTML += `<div class="ai-user">${question}</div>`;

  input.value = "";

  generateAIResponse(question, output);
}

function generateAIResponse(question, output) {
  const q = question.toLowerCase();

  // Add AI insights for better responses
  aiChatHistory.push({ question });

  if (q.includes("hi") || q.includes("hello")) {
    output.innerHTML += `
      <div class="ai-response">
        Hello, I'm your financial assistant. You can ask for projections, insights, or financial advice.
      </div>
    `;
    return;
  }

  if (q.includes("how is my business performing")) {
    output.innerHTML += `
      <div class="ai-response">
        Based on your current data, your business shows moderate growth with manageable risk.
      </div>
    `;
    return;
  }

  const projectionMatch = q.match(/\b(3|5|10)\b/);
  if (projectionMatch && businessData.length >= 3) {
    const years = parseInt(projectionMatch[1]);
    generateAIProjection(years);

    output.innerHTML += `
      <div class="ai-response">
        Generating ${years}-year projection based on historical data.
      </div>
    `;
    return;
  }

  output.innerHTML += `
    <div class="ai-response">
      Ask for projections like:
      • 3 year projection<br>
      • 5 year projection<br>
      • 10 year projection
    </div>
  `;
}

/* ================= AI PROJECTION ENGINE ================= */

function generateAIProjection(years) {
  if (businessData.length < 3) return;

  const canvas = document.getElementById("aiForecastChart");
  const explanation = document.getElementById("aiForecastExplanation");

  if (aiForecastChart) {
    aiForecastChart.destroy();
  }

  const first = businessData[0];
  const last = businessData[businessData.length - 1];

  let monthsDiff =
    (last.date.getFullYear() - first.date.getFullYear()) * 12 +
    (last.date.getMonth() - first.date.getMonth());

  if (monthsDiff <= 0) monthsDiff = 1;

  const cagr = Math.pow(last.revenue / first.revenue, 1 / monthsDiff) - 1;

  let revenue = last.revenue;
  let labels = [];
  let data = [];

  for (let i = 1; i <= years; i++) {
    revenue = revenue * Math.pow(1 + cagr, 12);
    labels.push("Year " + i);
    data.push(Math.round(revenue));
  }

  aiForecastChart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "AI Revenue Projection",
        data,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  if (explanation) {
    explanation.innerHTML = `
      <strong>ImpactGrid AI Projection Analysis</strong><br><br>
      Projected revenue after ${years} years: <strong>${formatCurrency(data[data.length - 1])}</strong>
    `;
  }
}

/* ================= HELPERS ================= */

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = val;
}

function calculateMonthlyGrowth() {
  if (businessData.length < 2) return 0;

  const first = businessData[0].revenue;
  const last = businessData[businessData.length - 1].revenue;

  return ((last - first) / first) * 100;
}

function calculateVolatility() {
  const revenues = businessData.map(d => d.revenue);
  const mean = revenues.reduce((a, b) => a + b) / revenues.length;

  const variance = revenues.reduce((a, b) => a + (b - mean) ** 2, 0) / revenues.length;

  return (Math.sqrt(variance) / mean) * 100;
}

function getMargin() {
  const revenue = sum("revenue");
  const profit = sum("profit");

  return revenue > 0 ? (profit / revenue) * 100 : 0;
}

function sum(key) {
  return businessData.reduce((a, b) => a + (b[key] || 0), 0);
}

/* ================= NAV ================= */

function showSection(section, event) {
  document.querySelectorAll(".page-section")
    .forEach(s => s.classList.remove("active-section"));

  document.getElementById(section)?.classList.add("active-section");

  document.querySelectorAll(".sidebar li")
    .forEach(li => li.classList.remove("active"));

  if (event) event.target.classList.add("active");
}

/* ================= SIDEBAR ================= */

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

/* ================= THEME ================= */

function toggleTheme() {
  document.body.classList.toggle("light-mode");
}

/* ================= LOGOUT ================= */

async function logout() {
  await window.supabaseClient?.auth.signOut();
  window.location.href = "login.html";
}

/* ================= GLOBAL ================= */

function bindGlobalFunctions() {
  window.addData = addData;
  window.setCurrency = setCurrency;
  window.showSection = showSection;
  window.logout = logout;
  window.askImpactGridAI = askImpactGridAI;
  window.toggleTheme = toggleTheme;
  window.toggleSidebar = toggleSidebar;
}

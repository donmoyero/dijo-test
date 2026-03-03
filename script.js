/* ================= GLOBAL STATE ================= */

let businessData = [];
let currentCurrency = "GBP";

let revenueChart = null;
let profitChart = null;
let expenseChart = null;

let forecastCharts = {};
let performanceBarChart = null;
let distributionPieChart = null;

/* ================= SCENARIO STATE ================= */

let scenarioActive = false;
let scenarioRevenueShock = 0;
let scenarioExpenseShock = 0;
let scenarioGrowthOverride = null;

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
    bindGlobalFunctions();
    loadFromStorage();
});

/* ================= LOCAL STORAGE ================= */

function saveToStorage() {
    const serialisableData = businessData.map(d => ({
        date: d.date.toISOString(),
        revenue: d.revenue,
        expenses: d.expenses,
        profit: d.profit
    }));

    localStorage.setItem("impactgrid_businessData", JSON.stringify(serialisableData));
    localStorage.setItem("impactgrid_currency", currentCurrency);
}

function loadFromStorage() {
    try {
        const storedData = localStorage.getItem("impactgrid_businessData");
        const storedCurrency = localStorage.getItem("impactgrid_currency");

        if (storedData) {
            const parsed = JSON.parse(storedData);
            businessData = parsed.map(d => ({
                date: new Date(d.date),
                revenue: d.revenue,
                expenses: d.expenses,
                profit: d.profit
            }));
        }

        if (storedCurrency) {
            currentCurrency = storedCurrency;
        }

        if (businessData.length > 0) {
            updateAll();
        }

    } catch (error) {
        console.error("Storage load error:", error);
        businessData = [];
    }
}

/* ================= SCENARIO ENGINE ================= */

function getActiveData() {

    if (!scenarioActive) return businessData;

    return businessData.map(d => {
        const adjustedRevenue = d.revenue * (1 + scenarioRevenueShock / 100);
        const adjustedExpenses = d.expenses * (1 + scenarioExpenseShock / 100);
        const adjustedProfit = adjustedRevenue - adjustedExpenses;

        return {
            date: d.date,
            revenue: adjustedRevenue,
            expenses: adjustedExpenses,
            profit: adjustedProfit
        };
    });
}

function applyScenario() {

    if (businessData.length === 0) return;

    scenarioRevenueShock = parseFloat(document.getElementById("scenarioRevenueShock").value) || 0;
    scenarioExpenseShock = parseFloat(document.getElementById("scenarioExpenseShock").value) || 0;

    const growthInput = parseFloat(document.getElementById("scenarioGrowthOverride").value);
    scenarioGrowthOverride = isNaN(growthInput) ? null : growthInput;

    scenarioActive = true;

    setText("scenarioModeStatus", "Stress / Scenario Case Active");

    updateAll();
}

function resetScenario() {

    scenarioActive = false;
    scenarioRevenueShock = 0;
    scenarioExpenseShock = 0;
    scenarioGrowthOverride = null;

    document.getElementById("scenarioRevenueShock").value = 0;
    document.getElementById("scenarioExpenseShock").value = 0;
    document.getElementById("scenarioGrowthOverride").value = 0;

    setText("scenarioModeStatus", "Base Case");

    updateAll();
}

/* ================= CURRENCY ================= */

function setCurrency(currency){
    currentCurrency = currency;
    saveToStorage();
    updateAll();
}

function formatCurrency(val){
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
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

    const exists = businessData.find(d =>
        d.date.toISOString().slice(0,7) === date.toISOString().slice(0,7)
    );

    if (exists) {
        alert("Data for this month already exists.");
        return;
    }

    businessData.push({ date, revenue, expenses, profit });
    businessData.sort((a,b)=>a.date-b.date);

    saveToStorage();
    updateAll();
}

/* ================= MASTER UPDATE ================= */

function updateAll() {

    if (businessData.length === 0) return;

    renderExecutiveSummary();
    renderLifecycle();
    renderCoreCharts();

    if (businessData.length >= 3) {
        renderFinancialStabilityAssessment();
        renderInsights();
        renderForecasts();
        renderPerformanceMatrix();
        renderRiskAssessment();
    } else {
        resetAdvancedSections();
    }
}

/* ================= ENHANCED STABILITY ENGINE ================= */

function renderFinancialStabilityAssessment() {

    const activeData = getActiveData();

    const volatility = calculateVolatility(activeData);
    const growth = calculateMonthlyGrowth(activeData);

    const totalRevenue = activeData.reduce((a,b)=>a+b.revenue,0);
    const totalProfit = activeData.reduce((a,b)=>a+b.profit,0);
    const margin = totalRevenue > 0 ? (totalProfit/totalRevenue)*100 : 0;

    // ---- Enhanced Weighted Model ----

    const volatilityPressure = Math.min(volatility * 1.2, 100);
    const marginResilience = Math.max(Math.min(margin * 2, 100), 0);
    const growthStability = 100 - Math.min(Math.abs(growth) * 2, 100);

    let regimePenalty = 0;

    if (volatility > 35 && margin < 10) regimePenalty = 20;
    else if (volatility > 30) regimePenalty = 12;
    else if (margin < 8) regimePenalty = 10;

    let stabilityIndex =
        (0.4 * (100 - volatilityPressure)) +
        (0.35 * marginResilience) +
        (0.25 * growthStability) -
        regimePenalty;

    stabilityIndex = Math.max(0, Math.min(100, Math.round(stabilityIndex)));

    let regime = "Structural Stability";
    if (stabilityIndex < 40) regime = "Structural Fragility";
    else if (stabilityIndex < 60) regime = "Financial Stress";
    else if (growth > 15 && margin > 10) regime = "Controlled Expansion";

    setText("stabilityRegimeOutput", `<strong>${regime}</strong>`);
    setText("interactionSensitivityOutput", volatility.toFixed(2));
    setText("stabilityIndexOutput", `<strong>${stabilityIndex} / 100</strong>`);

    setText("stabilityInterpretation",
        "Regime-weighted structural stability calculated using volatility pressure, margin resilience, and growth moderation.");

    setText("stabilityFocus",
        margin < 10 ? "Strengthen margin structure and cost control."
        : volatility > 30 ? "Reduce revenue variability."
        : "Maintain structural discipline and controlled scaling.");

    setText("stabilityOutlook",
        stabilityIndex < 50 ? "Elevated structural risk under current conditions."
        : "Stable structural outlook with manageable systemic exposure.");
}

/* ================= EXECUTIVE SUMMARY ================= */

function renderExecutiveSummary() {

    const activeData = getActiveData();

    const totalRevenue = activeData.reduce((a,b)=>a+b.revenue,0);
    const totalProfit = activeData.reduce((a,b)=>a+b.profit,0);

    const margin = totalRevenue > 0 ? (totalProfit/totalRevenue)*100 : 0;

    const growth = calculateMonthlyGrowth(activeData);
    const volatility = calculateVolatility(activeData);

    const container = document.getElementById("financialPositionSummary");
    const classificationEl = document.getElementById("financialClassification");
    const commentaryEl = document.getElementById("executiveCommentary");

    container.innerHTML = `
        <p>Total Revenue: ${formatCurrency(totalRevenue)}</p>
        <p>Net Profit: ${formatCurrency(totalProfit)}</p>
        <p>Profit Margin: ${margin.toFixed(2)}%</p>
        <p>Average Monthly Growth: ${growth.toFixed(2)}%</p>
        <p>Revenue Volatility: ${volatility.toFixed(2)}%</p>
    `;

    let status = "Stable Operating Position";
    if (volatility > 35) status = "Volatility Risk Exposure";
    else if (margin < 10) status = "Margin Compression Risk";
    else if (growth > 15) status = "Accelerated Growth Phase";

    classificationEl.innerHTML = status;
    commentaryEl.innerHTML =
        "Financial structure evaluated across growth, margin and volatility dynamics.";
}

/* ================= HELPERS ================= */

function calculateMonthlyGrowth(dataOverride){
    const data = dataOverride || businessData;
    if (data.length < 2) return 0;

    if (scenarioActive && scenarioGrowthOverride !== null) {
        return scenarioGrowthOverride;
    }

    const first = data[0].revenue;
    const last = data[data.length - 1].revenue;
    return ((last - first) / first) * 100;
}

function calculateVolatility(dataOverride){
    const data = dataOverride || businessData;
    if (data.length < 2) return 0;

    const revenues = data.map(d=>d.revenue);
    const mean = revenues.reduce((a,b)=>a+b,0)/revenues.length;
    const variance = revenues.reduce((a,b)=>a+Math.pow(b-mean,2),0)/revenues.length;
    return (Math.sqrt(variance)/mean)*100;
}

/* ================= GLOBAL BINDING ================= */

function bindGlobalFunctions(){
    window.addData = addData;
    window.setCurrency = setCurrency;
    window.applyScenario = applyScenario;
    window.resetScenario = resetScenario;
}

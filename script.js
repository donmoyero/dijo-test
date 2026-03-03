/* ================= GLOBAL STATE ================= */

let businessData = [];
let currentCurrency = "GBP";

let revenueChart = null;
let profitChart = null;
let expenseChart = null;

let forecastCharts = {};
let performanceBarChart = null;
let distributionPieChart = null;

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
    bindGlobalFunctions();
    loadFromStorage(); // ✅ ADDED
});

/* ================= LOCAL STORAGE ================= */

// ✅ ADDED
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

// ✅ ADDED
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

/* ================= CURRENCY ================= */

function setCurrency(currency){
    currentCurrency = currency;
    saveToStorage(); // ✅ ADDED
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

    saveToStorage(); // ✅ ADDED
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

/* ================= RESET IF UNDER 3 MONTHS ================= */

function resetAdvancedSections() {

    setText("stabilityRegimeOutput", "Awaiting sufficient data...");
    setText("interactionSensitivityOutput", "—");
    setText("stabilityIndexOutput", "—");
    setText("stabilityInterpretation", "");
    setText("stabilityFocus", "");
    setText("stabilityOutlook", "");
    setText("insightEngine", "");
    setText("businessHealthIndex", "");
    setText("stabilityRisk", "");
    setText("marginRisk", "");
    setText("liquidityRisk", "");

    performanceBarChart?.destroy();
    distributionPieChart?.destroy();

    Object.keys(forecastCharts).forEach(key => {
        forecastCharts[key]?.destroy();
        delete forecastCharts[key];
    });
}

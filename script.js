/* ================= GLOBAL STATE ================= */

let businessData = [];

let revenueChart = null;
let profitChart = null;
let expenseChart = null;

let forecastCharts = {};
let performanceBarChart = null;
let distributionPieChart = null;

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
    bindGlobalFunctions();
});

/* ================= ADD DATA ================= */

function addData() {

    const monthValue = document.getElementById("month")?.value;
    const revenue = parseFloat(document.getElementById("revenue")?.value);
    const expenses = parseFloat(document.getElementById("expenses")?.value);

    if (!monthValue || isNaN(revenue) || isNaN(expenses)) {
        alert("Enter valid financial data.");
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

    updateAll();
}

/* ================= MASTER UPDATE ================= */

function updateAll() {
    if (!businessData.length) return;

    renderExecutiveSummary();
    renderLifecycle();
    renderInsights();
    renderCoreCharts();
    renderForecasts();
    renderPerformanceMatrix();
    renderRiskAssessment();

    // VERSION 2 ENGINE
    renderFinancialStabilityAssessment();
}

/* ================= CORE CHARTS ================= */

function renderCoreCharts() {

    revenueChart?.destroy();
    profitChart?.destroy();
    expenseChart?.destroy();

    const labels = businessData.map(d =>
        d.date.toISOString().slice(0,7)
    );

    revenueChart = createChart(
        "revenueChart",
        "line",
        labels,
        businessData.map(d=>d.revenue),
        "#22c55e",
        "Revenue"
    );

    profitChart = createChart(
        "profitChart",
        "line",
        labels,
        businessData.map(d=>d.profit),
        "#3b82f6",
        "Profit"
    );

    expenseChart = createChart(
        "expenseChart",
        "bar",
        labels,
        businessData.map(d=>d.expenses),
        "#ef4444",
        "Expenses"
    );
}

/* ================= CHART FACTORY ================= */

function createChart(id,type,labels,data,color,label){

    const canvas = document.getElementById(id);
    if (!canvas) return null;

    return new Chart(canvas.getContext("2d"),{
        type,
        data:{
            labels,
            datasets:[{
                label,
                data,
                borderColor:color,
                backgroundColor:type==="bar"?color:"transparent",
                tension:0.4
            }]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false,
            scales:{ y:{ beginAtZero:true } }
        }
    });
}

/* ================= LIFECYCLE ================= */

function getBusinessAgeMonths() {

    const startDateInput = document.getElementById("businessStartDate")?.value;
    const reportingDateInput = document.getElementById("reportingDate")?.value;

    if (!startDateInput || !reportingDateInput) return 0;

    const start = new Date(startDateInput);
    const end = new Date(reportingDateInput);

    return (end.getFullYear() - start.getFullYear()) * 12 +
           (end.getMonth() - start.getMonth());
}

function renderLifecycle() {

    const container = document.getElementById("lifecycleClassification");
    if (!container) return;

    const age = getBusinessAgeMonths();
    const volatility = calculateVolatility();
    const growth = calculateMonthlyGrowth();

    let classification = "Early Operational Stage";

    if (age > 60 && volatility < 20) classification = "Mature Operational Phase";
    else if (growth > 5 && volatility < 25) classification = "Expansion Phase";
    else if (volatility > 40) classification = "At-Risk Phase";
    else if (age > 24) classification = "Stabilisation Phase";

    container.innerHTML = `<strong>Lifecycle Classification:</strong> ${classification}`;
}

/* ================= EXECUTIVE SUMMARY ================= */

function renderExecutiveSummary() {

    const container = document.getElementById("financialPositionSummary");
    const classificationContainer = document.getElementById("financialClassification");
    const commentaryContainer = document.getElementById("executiveCommentary");

    if (!container) return;

    const totalRevenue = sum("revenue");
    const totalProfit = sum("profit");
    const margin = getMargin();
    const growth = calculateMonthlyGrowth();
    const volatility = calculateVolatility();
    const age = getBusinessAgeMonths();

    container.innerHTML = `
        <p>Total Revenue: ${formatCurrency(totalRevenue)}</p>
        <p>Net Profit: ${formatCurrency(totalProfit)}</p>
        <p>Profit Margin: ${margin.toFixed(2)}%</p>
        <p>Average Monthly Growth: ${growth.toFixed(2)}%</p>
        <p>Revenue Volatility: ${volatility.toFixed(2)}%</p>
        <p>Business Age: ${age} months</p>
    `;

    let status = "Stable Growth Phase";

    if (volatility > 40) status = "Volatile Early Stage";
    if (margin < 5) status = "Margin Compression Risk";
    if (growth > 8) status = "Expansion Phase";

    classificationContainer.innerHTML = status;

    commentaryContainer.innerHTML =
        "Financial position reflects structural performance across revenue growth, margin efficiency and revenue variability.";
}

/* ================= VERSION 2 – STABILITY ENGINE ================= */

function calculateStructuralStates() {

    const volatility = calculateVolatility();
    const margin = getMargin();
    const growth = calculateMonthlyGrowth();
    const age = getBusinessAgeMonths();

    let volatilityState = "Low";
    if (volatility > 25) volatilityState = "High";
    else if (volatility > 10) volatilityState = "Moderate";

    let marginState = "Weak";
    if (margin > 20) marginState = "Strong";
    else if (margin >= 10) marginState = "Resilient";

    let growthState = "Stable";
    if (growth > 15) growthState = "Accelerating";
    else if (growth < 0) growthState = "Contracting";

    let lifecycle = "Early";
    if (age > 60) lifecycle = "Mature";
    else if (age > 24) lifecycle = "Scaling";

    return { volatility, margin, growth, age, volatilityState, marginState, growthState, lifecycle };
}

function calculateInteractionSensitivity(states) {

    let iss = states.volatility;

    if (states.marginState === "Weak") iss *= 1.5;
    if (states.marginState === "Strong") iss *= 0.7;

    if (states.growthState === "Accelerating" && states.marginState === "Weak")
        iss += 15;

    if (states.growthState === "Accelerating" && states.marginState === "Strong")
        iss -= 5;

    if (states.growthState === "Contracting" && states.volatilityState === "High")
        iss += 10;

    return Math.max(0, Math.min(100, iss));
}

function determineStabilityRegime(states, iss) {

    if (states.volatilityState === "High" && states.marginState === "Weak" && iss >= 60)
        return "Structural Fragility Regime";

    if (iss >= 40 && (states.marginState === "Weak" || states.volatilityState === "High"))
        return "Financial Stress Regime";

    if (states.growthState === "Accelerating" && (states.marginState === "Resilient" || states.marginState === "Strong"))
        return "Controlled Expansion Regime";

    return "Structural Stability Regime";
}

function calculateStabilityIndex(regime, iss) {

    let score = 100 - iss;

    if (regime === "Structural Fragility Regime") score -= 20;
    if (regime === "Financial Stress Regime") score -= 10;
    if (regime === "Controlled Expansion Regime") score += 5;
    if (regime === "Structural Stability Regime") score += 10;

    return Math.max(0, Math.min(100, Math.round(score)));
}

function renderFinancialStabilityAssessment() {

    const states = calculateStructuralStates();
    const iss = calculateInteractionSensitivity(states);
    const regime = determineStabilityRegime(states, iss);
    const index = calculateStabilityIndex(regime, iss);

    const interpretationEl = document.getElementById("stabilityInterpretation");
    const focusEl = document.getElementById("stabilityFocus");
    const outlookEl = document.getElementById("stabilityOutlook");

    document.getElementById("stabilityRegimeOutput").innerHTML = `<strong>${regime}</strong>`;
    document.getElementById("interactionSensitivityOutput").innerHTML = `${iss.toFixed(2)} / 100`;
    document.getElementById("stabilityIndexOutput").innerHTML = `<strong>${index} / 100</strong>`;

    if (regime === "Structural Fragility Regime") {
        interpretationEl.innerHTML = "Structural exposure to volatility and margin weakness.";
        focusEl.innerHTML = "Reinforce margin and stabilise revenue streams immediately.";
        outlookEl.innerHTML = "High instability risk without corrective measures.";
    }

    if (regime === "Financial Stress Regime") {
        interpretationEl.innerHTML = "Elevated sensitivity to financial shocks.";
        focusEl.innerHTML = "Improve cost control and revenue predictability.";
        outlookEl.innerHTML = "Recoverable with disciplined management.";
    }

    if (regime === "Controlled Expansion Regime") {
        interpretationEl.innerHTML = "Growth supported by margin resilience.";
        focusEl.innerHTML = "Protect margins while scaling.";
        outlookEl.innerHTML = "Positive outlook if volatility remains controlled.";
    }

    if (regime === "Structural Stability Regime") {
        interpretationEl.innerHTML = "Low structural sensitivity to volatility.";
        focusEl.innerHTML = "Maintain disciplined operations.";
        outlookEl.innerHTML = "Strong short-term stability.";
    }
}

/* ================= HELPERS ================= */

function calculateMonthlyGrowth() {
    let rates = [];
    for (let i=1;i<businessData.length;i++){
        const prev=businessData[i-1].revenue;
        const curr=businessData[i].revenue;
        if(prev>0) rates.push((curr-prev)/prev);
    }
    if(!rates.length) return 0;
    return (rates.reduce((a,b)=>a+b,0)/rates.length)*100;
}

function calculateVolatility(){
    const revenues=businessData.map(d=>d.revenue);
    const mean=revenues.reduce((a,b)=>a+b,0)/revenues.length;
    if(mean===0) return 0;
    const variance=revenues.reduce((a,b)=>a+Math.pow(b-mean,2),0)/revenues.length;
    return (Math.sqrt(variance)/mean)*100;
}

function getMargin(){
    const totalRevenue=sum("revenue");
    const totalProfit=sum("profit");
    return totalRevenue>0?(totalProfit/totalRevenue)*100:0;
}

function sum(key){
    return businessData.reduce((a,b)=>a+(b[key]||0),0);
}

function formatCurrency(val){
    return "£"+Number(val).toLocaleString(undefined,{
        minimumFractionDigits:2,
        maximumFractionDigits:2
    });
}

/* ================= NAVIGATION ================= */

function showSection(sectionId, event) {
    document.querySelectorAll(".page-section").forEach(sec =>
        sec.classList.remove("active-section")
    );
    document.getElementById(sectionId)?.classList.add("active-section");

    document.querySelectorAll(".sidebar li").forEach(li =>
        li.classList.remove("active")
    );

    if (event) event.target.classList.add("active");
}

function logout() {
    location.reload();
}

function bindGlobalFunctions(){
    window.addData = addData;
    window.showSection = showSection;
    window.logout = logout;
}

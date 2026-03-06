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
});

/* ================= CURRENCY ================= */

function setCurrency(currency){
    currentCurrency = currency;
    updateAll();
}

function formatCurrency(val){
    return new Intl.NumberFormat(undefined,{
        style:'currency',
        currency:currentCurrency
    }).format(val);
}

/* ================= ADD DATA ================= */

function addData(){

    const monthValue=document.getElementById("month").value;
    const revenue=parseFloat(document.getElementById("revenue").value);
    const expenses=parseFloat(document.getElementById("expenses").value);

    if(!monthValue||isNaN(revenue)||isNaN(expenses)){
        alert("Enter valid revenue and expense data.");
        return;
    }

    const date=new Date(monthValue+"-01");
    const profit=revenue-expenses;

    const exists=businessData.find(d =>
        d.date.toISOString().slice(0,7) === date.toISOString().slice(0,7)
    );

    if(exists){
        alert("Data for this month already exists.");
        return;
    }

    businessData.push({date,revenue,expenses,profit});
    businessData.sort((a,b)=>a.date-b.date);

    updateAll();
}

/* ================= MASTER UPDATE ================= */

function updateAll(){

    if(businessData.length===0) return;

    renderRecordsTable();
    updateProgressIndicator();
    renderExecutiveSummary();
    renderLifecycle();
    renderCoreCharts();

    if(businessData.length>=3){

        renderInsights();
        renderForecasts();
        renderPerformanceMatrix();
        renderRiskAssessment();
        renderAIInsights();

    }else{

        resetAdvancedSections();

    }
}

/* ================= RECORD TABLE ================= */

function renderRecordsTable(){

    const tbody=document.getElementById("recordsTableBody");
    if(!tbody) return;

    tbody.innerHTML="";

    businessData.forEach(record=>{

        const row=document.createElement("tr");
        const month=record.date.toISOString().slice(0,7);

        row.innerHTML=`
        <td>${month}</td>
        <td>${formatCurrency(record.revenue)}</td>
        <td>${formatCurrency(record.expenses)}</td>
        <td>${formatCurrency(record.profit)}</td>
        `;

        tbody.appendChild(row);

    });
}

/* ================= DATA PROGRESS ================= */

function updateProgressIndicator(){

    const progress=document.getElementById("dataProgress");
    if(!progress) return;

    const count=businessData.length;

    if(count<3){

        const remaining=3-count;

        progress.innerHTML=`
        ${count} / 3 months entered<br>
        Enter ${remaining} more month${remaining>1?"s":""} to activate ImpactGrid Insights.
        `;

    }else{

        progress.innerHTML=`
        ${count} months recorded<br>
        <strong>ImpactGrid Insights Activated</strong>
        `;
    }
}

/* ================= EXECUTIVE SUMMARY ================= */

function renderExecutiveSummary(){

    const container=document.getElementById("financialPositionSummary");
    const classificationEl=document.getElementById("financialClassification");
    const commentaryEl=document.getElementById("executiveCommentary");

    if(!container) return;

    const totalRevenue=sum("revenue");
    const totalProfit=sum("profit");
    const margin=getMargin();
    const growth=calculateMonthlyGrowth();
    const volatility=calculateVolatility();

    container.innerHTML=`
        <p>Total Revenue: ${formatCurrency(totalRevenue)}</p>
        <p>Net Profit: ${formatCurrency(totalProfit)}</p>
        <p>Profit Margin: ${margin.toFixed(2)}%</p>
        <p>Average Monthly Growth: ${growth.toFixed(2)}%</p>
        <p>Revenue Volatility: ${volatility.toFixed(2)}%</p>
    `;

    if(classificationEl){

        let status="Stable Operating Position";

        if(volatility>35) status="Volatility Risk Exposure";
        else if(margin<10) status="Margin Compression Risk";
        else if(growth>15) status="Accelerated Growth Phase";

        classificationEl.innerHTML=status;
    }

    if(commentaryEl){

        let commentary="Financial structure evaluated across growth, margin and volatility dynamics.";

        if(volatility>35){
            commentary="Revenue volatility suggests fluctuating income patterns.";
        }

        if(margin<10){
            commentary+=" Profit margins appear compressed indicating operational cost pressure.";
        }

        if(growth>12){
            commentary+=" Revenue growth indicates expansion dynamics.";
        }

        commentaryEl.innerHTML=commentary;
    }
}

/* ================= LIFECYCLE ================= */

function renderLifecycle(){

    const container=document.getElementById("lifecycleClassification");
    if(!container) return;

    if(businessData.length<3){
        container.innerHTML="Enter at least 3 months for lifecycle analysis.";
        return;
    }

    const volatility=calculateVolatility();
    const growth=calculateMonthlyGrowth();

    let classification="Stabilisation Phase";

    if(volatility>35) classification="At-Risk Phase";
    else if(growth>10) classification="Expansion Phase";
    else if(volatility<15) classification="Stable Phase";

    container.innerHTML=`<strong>Lifecycle Classification:</strong> ${classification}`;
}

/* ================= CORE CHARTS ================= */

function renderCoreCharts(){

    if(!document.getElementById("revenueChart")) return;

    revenueChart?.destroy();
    profitChart?.destroy();
    expenseChart?.destroy();

    const labels=businessData.map(d=>d.date.toISOString().slice(0,7));

    revenueChart=createChart("revenueChart","line",labels,businessData.map(d=>d.revenue),"Revenue");
    profitChart=createChart("profitChart","line",labels,businessData.map(d=>d.profit),"Profit");
    expenseChart=createChart("expenseChart","bar",labels,businessData.map(d=>d.expenses),"Expenses");
}

function createChart(id,type,labels,data,label){

    const canvas=document.getElementById(id);
    if(!canvas) return null;

    return new Chart(canvas,{
        type:type,
        data:{labels,datasets:[{label,data}]},
        options:{responsive:true,maintainAspectRatio:false}
    });
}

/* ================= AI CHAT ENGINE ================= */

function askImpactGridAI(){

    const input=document.getElementById("aiChatInput");
    const output=document.getElementById("aiChatOutput");

    if(!input||!output) return;

    const question=input.value.trim();

    if(question==="") return;

    const answer=generateAIResponse(question);

    output.innerHTML+=`
    <div class="ai-user">${question}</div>
    <div class="ai-response">${answer}</div>
    `;

    input.value="";
}

/* ================= AI RESPONSE ================= */

function generateAIResponse(question){

    if(businessData.length<3){
        return "Please enter at least three months of financial data for analysis.";
    }

    const volatility=calculateVolatility();
    const margin=getMargin();
    const growth=calculateMonthlyGrowth();

    const healthScore=Math.round(
        (Math.max(0,100-volatility)+
        Math.min(Math.abs(growth)*5,100)+
        Math.min(margin*3,100))/3
    );

    const q=question.toLowerCase();

    if(q.includes("health")){
        return `Your Business Health Index is approximately ${healthScore}/100. This reflects current revenue volatility of ${volatility.toFixed(1)}% and a profit margin of ${margin.toFixed(1)}%. Improving margin efficiency and stabilising revenue would increase this score.`;
    }

    if(q.includes("risk")){
        if(volatility>35){
            return "Revenue volatility is elevated which introduces financial uncertainty. Stabilising income streams should be prioritised.";
        }
        return "Operational risk currently appears manageable based on the current financial data.";
    }

    if(q.includes("profit")){
        return `Your current profit margin is ${margin.toFixed(1)}%. Increasing operational efficiency or reducing expenses would strengthen profitability.`;
    }

    if(q.includes("growth")){
        return `Average monthly revenue growth is ${growth.toFixed(1)}%. Sustained growth above 10% indicates expansion potential if profitability remains stable.`;
    }

    return "ImpactGrid AI analyses revenue growth, volatility, margins and operational risk to evaluate business stability. Ask about profit, risk, growth or health score.";
}

/* ================= HELPERS ================= */

function calculateMonthlyGrowth(){
    if(businessData.length<2) return 0;
    const first=businessData[0].revenue;
    const last=businessData[businessData.length-1].revenue;
    return ((last-first)/first)*100;
}

function calculateVolatility(){

    if(businessData.length<2) return 0;

    const revenues=businessData.map(d=>d.revenue);
    const mean=revenues.reduce((a,b)=>a+b,0)/revenues.length;
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

/* ================= LOGOUT ================= */

async function logout(){

    try{
        if(window.supabaseClient){
            await window.supabaseClient.auth.signOut();
        }
    }catch(err){
        console.error("Logout error:",err);
    }

    window.location.href="login.html";
}

/* ================= GLOBAL BINDING ================= */

function bindGlobalFunctions(){
    window.addData=addData;
    window.showSection=showSection;
    window.logout=logout;
    window.setCurrency=setCurrency;
    window.askImpactGridAI=askImpactGridAI;
}

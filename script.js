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
    renderCoreCharts();

    if(businessData.length>=3){

        renderForecasts();
        renderPerformanceMatrix();
        renderRiskAssessment();
        renderAIInsights();

    }else{

        resetAdvancedSections();

    }
}


/* ================= RESET ================= */

function resetAdvancedSections(){

    setText("businessHealthIndex","Enter at least 3 months of financial data.");

    setText("stabilityRisk","Awaiting data...");
    setText("marginRisk","");
    setText("liquidityRisk","");
    setText("riskInsight","");

    setText("aiFinancial","");
    setText("aiOperations","");
    setText("aiForecast","");
    setText("aiPerformance","");
    setText("aiRisk","");

    performanceBarChart?.destroy();
    distributionPieChart?.destroy();

    Object.keys(forecastCharts).forEach(key=>{
        forecastCharts[key]?.destroy();
        delete forecastCharts[key];
    });
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

        progress.innerHTML=
        `${count} / 3 months entered<br>
        Enter ${remaining} more month${remaining>1?"s":""} to activate ImpactGrid Insights.`

    }else{

        progress.innerHTML=
        `${count} months recorded<br>
        <strong>ImpactGrid Insights Activated</strong>`

    }
}


/* ================= EXECUTIVE SUMMARY ================= */

function renderExecutiveSummary(){

    const container=document.getElementById("financialPositionSummary");
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
}


/* ================= CORE CHARTS ================= */

function renderCoreCharts(){

    const canvas=document.getElementById("revenueChart");
    if(!canvas) return;

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
        type,
        data:{labels,datasets:[{label,data}]},
        options:{responsive:true,maintainAspectRatio:false}
    });

}


/* ================= FORECAST ================= */

function renderForecasts(){

    if(businessData.length<3) return;

    const first=businessData[0];
    const last=businessData[businessData.length-1];

    const monthsDiff=
        (last.date.getFullYear()-first.date.getFullYear())*12+
        (last.date.getMonth()-first.date.getMonth());

    if(monthsDiff<=0||first.revenue<=0) return;

    const cagr=Math.pow(last.revenue/first.revenue,1/monthsDiff)-1;

    generateProjection("forecast6m",6,cagr);
    generateProjection("forecast1y",12,cagr);
    generateProjection("forecast3y",36,cagr);
    generateProjection("forecast5y",60,cagr);

}

function generateProjection(id,months,cagr){

    const canvas=document.getElementById(id);
    if(!canvas) return;

    forecastCharts[id]?.destroy();

    const last=businessData[businessData.length-1];

    let revenue=last.revenue;
    let date=new Date(last.date);

    let labels=[];
    let data=[];

    for(let i=1;i<=months;i++){

        revenue*=(1+cagr);
        date.setMonth(date.getMonth()+1);

        labels.push(date.toISOString().slice(0,7));
        data.push(Math.round(revenue));

    }

    forecastCharts[id]=new Chart(canvas,{
        type:"line",
        data:{labels,datasets:[{label:"Projected Revenue",data}]},
        options:{responsive:true,maintainAspectRatio:false}
    });

}


/* ================= PERFORMANCE MATRIX ================= */

function renderPerformanceMatrix(){

    if(businessData.length<3) return;

    const volatility=calculateVolatility();
    const growth=calculateMonthlyGrowth();
    const margin=getMargin();

    const stabilityScore=Math.max(0,100-volatility);
    const growthScore=Math.min(Math.abs(growth)*5,100);
    const profitabilityScore=Math.min(margin*3,100);

    const bar=document.getElementById("performanceBarChart");
    const pie=document.getElementById("distributionPieChart");

    if(!bar||!pie) return;

    performanceBarChart?.destroy();
    distributionPieChart?.destroy();

    performanceBarChart=new Chart(bar,{
        type:"bar",
        data:{
            labels:["Stability","Growth","Profitability"],
            datasets:[{data:[stabilityScore,growthScore,profitabilityScore]}]
        },
        options:{scales:{y:{beginAtZero:true,max:100}}}
    });

    distributionPieChart=new Chart(pie,{
        type:"doughnut",
        data:{
            labels:["Stability","Growth","Profitability"],
            datasets:[{data:[stabilityScore,growthScore,profitabilityScore]}]
        }
    });

}


/* ================= RISK ================= */

function renderRiskAssessment(){

    if(businessData.length<3) return;

    const volatility=calculateVolatility();
    const margin=getMargin();

    setText("stabilityRisk",volatility>35?"Elevated":"Low");
    setText("marginRisk",margin<8?"Elevated":"Low");
    setText("liquidityRisk",margin>5?"Stable":"Constrained");

}


/* ================= AI CHAT ================= */

function askImpactGridAI(){

    const input=document.getElementById("aiChatInput");
    const output=document.getElementById("aiChatOutput");

    if(!input||!output) return;

    const question=input.value.trim();
    if(question==="") return;

    let answer="ImpactGrid AI requires at least 3 months of financial data.";

    if(businessData.length>=3){

        const margin=getMargin().toFixed(1);
        const growth=calculateMonthlyGrowth().toFixed(1);

        answer=`Your business shows ${growth}% growth with a ${margin}% margin. Operational stability appears moderate based on current financial inputs.`;

    }

    output.innerHTML+=`
    <div class="ai-user">${question}</div>
    <div class="ai-response">${answer}</div>
    `;

    input.value="";

}


/* ================= HELPERS ================= */

function setText(id,value){
    const el=document.getElementById(id);
    if(el) el.innerHTML=value;
}

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


/* ================= NAVIGATION ================= */

function showSection(sectionId,event){

    document.querySelectorAll(".page-section").forEach(sec =>
        sec.classList.remove("active-section")
    );

    document.getElementById(sectionId)?.classList.add("active-section");

    document.querySelectorAll(".sidebar li").forEach(li =>
        li.classList.remove("active")
    );

    if(event) event.target.classList.add("active");

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

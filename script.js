/* ================= GLOBAL STATE ================= */

let businessData = [];
let currentCurrency = "GBP";

let revenueChart=null;
let profitChart=null;
let expenseChart=null;

let forecastCharts={};
let performanceBarChart=null;
let distributionPieChart=null;
let aiForecastChart=null;


/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded",()=>{

bindGlobalFunctions();

});


/* ================= CURRENCY ================= */

function setCurrency(currency){

currentCurrency=currency;
updateAll();

}

function formatCurrency(val){

return new Intl.NumberFormat(undefined,{
style:"currency",
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

businessData.push({date,revenue,expenses,profit});
businessData.sort((a,b)=>a.date-b.date);

updateAll();

}


/* ================= MASTER UPDATE ================= */

function updateAll(){

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
setText("riskInsight","Awaiting data...");
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

row.innerHTML=`
<td>${record.date.toISOString().slice(0,7)}</td>
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

progress.innerHTML=
`${count} / 3 months entered<br>
Enter ${3-count} more months to activate ImpactGrid Insights`;

}else{

progress.innerHTML=
`${count} months recorded<br>
<strong>ImpactGrid Insights Activated</strong>`;

}

}


/* ================= EXECUTIVE SUMMARY ================= */

function renderExecutiveSummary(){

const container=document.getElementById("financialPositionSummary");
const classification=document.getElementById("financialClassification");
const commentary=document.getElementById("executiveCommentary");

if(!container) return;

const revenue=sum("revenue");
const profit=sum("profit");

const margin=getMargin();
const growth=calculateMonthlyGrowth();
const volatility=calculateVolatility();

container.innerHTML=`
<p>Total Revenue: ${formatCurrency(revenue)}</p>
<p>Total Profit: ${formatCurrency(profit)}</p>
<p>Profit Margin: ${margin.toFixed(2)}%</p>
<p>Growth: ${growth.toFixed(2)}%</p>
<p>Volatility: ${volatility.toFixed(2)}%</p>
`;

let status="Stable";

if(volatility>30) status="High Volatility";
else if(margin<10) status="Low Profit Margin";
else if(growth>15) status="Expansion Phase";

classification.innerHTML=status;

commentary.innerHTML=
`Current financial structure indicates ${status.toLowerCase()} with
${margin.toFixed(1)}% margin and ${growth.toFixed(1)}% growth.`;

}


/* ================= CORE CHARTS ================= */

function renderCoreCharts(){

const labels=businessData.map(d=>d.date.toISOString().slice(0,7));

revenueChart?.destroy();
profitChart?.destroy();
expenseChart?.destroy();

revenueChart=createChart("revenueChart","line",labels,businessData.map(d=>d.revenue),"Revenue");
profitChart=createChart("profitChart","line",labels,businessData.map(d=>d.profit),"Profit");
expenseChart=createChart("expenseChart","bar",labels,businessData.map(d=>d.expenses),"Expenses");

}

function createChart(id,type,labels,data,label){

const canvas=document.getElementById(id);
if(!canvas) return;

return new Chart(canvas,{
type,
data:{labels,datasets:[{label,data}]},
options:{responsive:true,maintainAspectRatio:false}
});

}


/* ================= PERFORMANCE MATRIX ================= */

function renderPerformanceMatrix(){

if(businessData.length<3) return;

const volatility=calculateVolatility();
const growth=calculateMonthlyGrowth();
const margin=getMargin();

const stability=100-volatility;
const growthScore=growth*4;
const profitScore=margin*3;

performanceBarChart?.destroy();
distributionPieChart?.destroy();

performanceBarChart=new Chart(
document.getElementById("performanceBarChart"),
{
type:"bar",
data:{
labels:["Stability","Growth","Profit"],
datasets:[{data:[stability,growthScore,profitScore]}]
}
});

distributionPieChart=new Chart(
document.getElementById("distributionPieChart"),
{
type:"doughnut",
data:{
labels:["Stability","Growth","Profit"],
datasets:[{data:[stability,growthScore,profitScore]}]
}
});

const health=Math.round((stability+growthScore+profitScore)/3);

setText("businessHealthIndex","Business Health Score: "+health+"/100");

}


/* ================= RISK ================= */

function renderRiskAssessment(){

if(businessData.length<3) return;

const volatility=calculateVolatility();
const margin=getMargin();

setText("stabilityRisk",volatility>30?"Elevated":"Low");
setText("marginRisk",margin<10?"Elevated":"Low");
setText("liquidityRisk",margin>5?"Stable":"Weak");

let insight="Operational risk currently manageable.";

if(volatility>30)
insight="Revenue volatility indicates unstable income patterns.";

if(margin<10)
insight+=" Profit margin pressure detected.";

setText("riskInsight",insight);

}


/* ================= IMPACTGRID AI CHAT ================= */

function askImpactGridAI(){

const input=document.getElementById("aiChatInput");
const output=document.getElementById("aiChatOutput");

if(!input||!output) return;

const question=input.value.trim();
if(question==="") return;

output.innerHTML+=`<div class="ai-user">${question}</div>`;

input.value="";

generateAIResponse(question,output);

}


function generateAIResponse(question,output){

const q=question.toLowerCase();

const projectionMatch=q.match(/\b(3|5|10)\b/);

if(projectionMatch && businessData.length>=3){

const years=parseInt(projectionMatch[1]);

generateAIProjection(years);

output.innerHTML+=`
<div class="ai-response">
Generating ${years}-year projection based on historical revenue growth.
</div>
`;

return;

}

output.innerHTML+=`
<div class="ai-response">
Ask for projections such as:
• 3 year projection
• 5 year projection
• 10 year projection
</div>
`;

}


/* ================= AI PROJECTION ENGINE ================= */

function generateAIProjection(years){

if(businessData.length<3) return;

const canvas=document.getElementById("aiForecastChart");
const explanation=document.getElementById("aiForecastExplanation");

if(!canvas) return;

if(aiForecastChart){
aiForecastChart.destroy();
}

const first=businessData[0];
const last=businessData[businessData.length-1];

const monthsDiff=
(last.date.getFullYear()-first.date.getFullYear())*12+
(last.date.getMonth()-first.date.getMonth());

const cagr=Math.pow(last.revenue/first.revenue,1/monthsDiff)-1;

let revenue=last.revenue;

let labels=[];
let data=[];

for(let i=1;i<=years;i++){

revenue=revenue*Math.pow(1+cagr,12);

labels.push("Year "+i);
data.push(Math.round(revenue));

}

aiForecastChart=new Chart(canvas,{
type:"line",
data:{
labels,
datasets:[{
label:"AI Revenue Projection",
data,
tension:0.3
}]
},
options:{
responsive:true,
maintainAspectRatio:false
}
});

if(explanation){

explanation.innerHTML=`
<strong>ImpactGrid AI Projection Analysis</strong><br><br>
Projected revenue after ${years} years: <strong>${formatCurrency(data[data.length-1])}</strong>
`;

}

}


/* ================= HELPERS ================= */

function setText(id,val){

const el=document.getElementById(id);
if(el) el.innerHTML=val;

}

function calculateMonthlyGrowth(){

if(businessData.length<2) return 0;

const first=businessData[0].revenue;
const last=businessData[businessData.length-1].revenue;

return ((last-first)/first)*100;

}

function calculateVolatility(){

const revenues=businessData.map(d=>d.revenue);
const mean=revenues.reduce((a,b)=>a+b)/revenues.length;

const variance=revenues.reduce((a,b)=>a+(b-mean)**2,0)/revenues.length;

return (Math.sqrt(variance)/mean)*100;

}

function getMargin(){

const revenue=sum("revenue");
const profit=sum("profit");

return revenue>0?(profit/revenue)*100:0;

}

function sum(key){

return businessData.reduce((a,b)=>a+(b[key]||0),0);

}


/* ================= NAV ================= */

function showSection(section,event){

document.querySelectorAll(".page-section")
.forEach(s=>s.classList.remove("active-section"));

document.getElementById(section)?.classList.add("active-section");

document.querySelectorAll(".sidebar li")
.forEach(li=>li.classList.remove("active"));

if(event) event.target.classList.add("active");

}


/* ================= LOGOUT ================= */

async function logout(){

await window.supabaseClient?.auth.signOut();
window.location.href="login.html";

}


/* ================= GLOBAL ================= */

function bindGlobalFunctions(){

window.addData=addData;
window.setCurrency=setCurrency;
window.showSection=showSection;
window.logout=logout;
window.askImpactGridAI=askImpactGridAI;

}

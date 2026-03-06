/* =====================================================
   IMPACTGRID AI ENGINE
   Financial Intelligence & Consultant Engine
===================================================== */

const ImpactGridAI = {

analyze(question,data,currency){

const q = question.toLowerCase();

if(this.isForecastQuestion(q))
return this.forecastEngine(q,data,currency);

if(this.isRiskQuestion(q))
return this.riskEngine(data,currency);

if(this.isPerformanceQuestion(q))
return this.performanceEngine(data,currency);

if(this.isStrategyQuestion(q))
return this.strategyEngine(data,currency);

if(this.isChartQuestion(q))
return this.chartExplanation(data,currency);

return this.generalAdvice();

},

/* =====================================================
   INTENT DETECTION
===================================================== */

isForecastQuestion(q){
return q.includes("forecast") ||
       q.includes("projection") ||
       q.includes("future") ||
       q.includes("year");
},

isRiskQuestion(q){
return q.includes("risk") ||
       q.includes("stable") ||
       q.includes("volatility");
},

isPerformanceQuestion(q){
return q.includes("performance") ||
       q.includes("health") ||
       q.includes("profit") ||
       q.includes("margin");
},

isStrategyQuestion(q){
return q.includes("strategy") ||
       q.includes("improve") ||
       q.includes("grow") ||
       q.includes("increase");
},

isChartQuestion(q){
return q.includes("chart") ||
       q.includes("analysis") ||
       q.includes("explain");
},

/* =====================================================
   FORECAST ENGINE
===================================================== */

forecastEngine(question,data,currency){

if(data.length < 3){
return "ImpactGrid AI requires at least 3 months of financial data to generate reliable projections.";
}

let years = 3;

if(question.includes("5")) years = 5;
if(question.includes("10")) years = 10;

/* generate forecast chart */
if(typeof generateAIProjection === "function"){
generateAIProjection(years);
}

const first = data[0];
const last = data[data.length-1];

let months =
(last.date.getFullYear()-first.date.getFullYear())*12 +
(last.date.getMonth()-first.date.getMonth());

if(months<=0) months=1;

const cagr = Math.pow(last.revenue/first.revenue,1/months)-1;

const projected = last.revenue*Math.pow(1+cagr,years*12);

return `
ImpactGrid AI Projection Analysis

Based on your historical revenue trend your business
is expanding at approximately ${(cagr*100).toFixed(2)}% monthly.

If the current trajectory continues,
projected revenue after ${years} years may reach:

${this.formatCurrency(projected,currency)}

Consultant Insight:

Growth appears sustainable if operational costs
remain controlled and revenue volatility stays stable.

A visual forecast has been generated below.
`;

},

/* =====================================================
   PERFORMANCE ENGINE
===================================================== */

performanceEngine(data,currency){

const revenue = this.sum(data,"revenue");
const profit = this.sum(data,"profit");

const margin = revenue>0?(profit/revenue)*100:0;

let insight="";

if(margin>20)
insight="Your business demonstrates strong profitability and efficient operations.";

else if(margin>10)
insight="Your business shows moderate profitability with room to improve margins.";

else
insight="Profit margins are currently low which suggests cost pressure.";

return `
ImpactGrid AI Performance Review

Total Revenue:
${this.formatCurrency(revenue,currency)}

Total Profit:
${this.formatCurrency(profit,currency)}

Average Profit Margin:
${margin.toFixed(2)}%

Consultant Assessment:

${insight}

Recommendation:

Focus on cost efficiency and scalable revenue streams
to strengthen long-term stability.
`;

},

/* =====================================================
   RISK ENGINE
===================================================== */

riskEngine(data,currency){

const volatility = this.calculateVolatility(data);

let level="";
let insight="";

if(volatility<15){
level="Low";
insight="Revenue patterns appear stable and predictable.";
}

else if(volatility<30){
level="Moderate";
insight="Some revenue fluctuations may impact forecasting stability.";
}

else{
level="Elevated";
insight="High volatility indicates unstable revenue patterns.";
}

return `
ImpactGrid AI Risk Assessment

Revenue Volatility:
${volatility.toFixed(2)}%

Risk Level:
${level}

Consultant Insight:

${insight}

Strategic Recommendation:

Introduce recurring revenue streams and stabilise
monthly sales cycles where possible.
`;

},

/* =====================================================
   STRATEGY ENGINE
===================================================== */

strategyEngine(data,currency){

const margin = this.getMargin(data);
const volatility = this.calculateVolatility(data);

let strategy="";

if(margin<10)
strategy += "• Review operational expenses and cost structure.\n";

if(volatility>30)
strategy += "• Stabilise revenue through recurring contracts or subscriptions.\n";

if(margin>20)
strategy += "• Consider reinvesting profits into expansion.\n";

if(strategy==="")
strategy="• Continue scaling while maintaining financial stability.";

return `
ImpactGrid AI Strategic Recommendations

${strategy}

Long-Term Consultant Insight:

Sustainable SME growth is achieved by balancing
profitability, operational efficiency, and revenue stability.
`;

},

/* =====================================================
   CHART ANALYSIS
===================================================== */

chartExplanation(data,currency){

if(data.length<3)
return "ImpactGrid AI requires additional data to analyse chart behaviour.";

const growth = this.calculateGrowth(data);
const volatility = this.calculateVolatility(data);

return `
ImpactGrid Chart Analysis

Revenue Growth:
${growth.toFixed(2)}%

Revenue Volatility:
${volatility.toFixed(2)}%

Consultant Insight:

These charts illustrate how revenue, expenses,
and profit evolve over time.

Stable upward revenue with controlled expenses
indicates a healthy operational trajectory.

Monitoring volatility alongside margin performance
helps anticipate potential operational risk.
`;

},

/* =====================================================
   EXECUTIVE REPORT
===================================================== */

generateExecutiveSummary(data,currency){

const revenue=this.sum(data,"revenue");
const profit=this.sum(data,"profit");
const margin=this.getMargin(data);
const volatility=this.calculateVolatility(data);

return `
Executive Financial Summary

Total Revenue:
${this.formatCurrency(revenue,currency)}

Total Profit:
${this.formatCurrency(profit,currency)}

Profit Margin:
${margin.toFixed(2)}%

Revenue Volatility:
${volatility.toFixed(2)}%

Consultant Summary:

The business demonstrates ${
margin>15 ? "strong profitability" : "moderate profitability"
} with ${
volatility<20 ? "stable revenue patterns." : "some revenue volatility."
}

Maintaining cost discipline and predictable revenue
streams will strengthen long-term stability.
`;

},

/* =====================================================
   GENERAL ADVICE
===================================================== */

generalAdvice(){

return `
ImpactGrid AI Consultant

You can ask questions like:

• "3 year projection"
• "5 year forecast"
• "Explain my charts"
• "How risky is my business?"
• "How can I improve profitability?"
• "Give strategic advice"
`;

},

/* =====================================================
   HELPERS
===================================================== */

sum(data,key){
return data.reduce((a,b)=>a+(b[key]||0),0);
},

calculateVolatility(data){

const revenues=data.map(d=>d.revenue);

const mean=revenues.reduce((a,b)=>a+b)/revenues.length;

const variance=revenues.reduce((a,b)=>a+(b-mean)**2,0)/revenues.length;

return (Math.sqrt(variance)/mean)*100;

},

calculateGrowth(data){

if(data.length<2) return 0;

const first=data[0].revenue;
const last=data[data.length-1].revenue;

return ((last-first)/first)*100;

},

getMargin(data){

const revenue=this.sum(data,"revenue");
const profit=this.sum(data,"profit");

return revenue>0?(profit/revenue)*100:0;

},

formatCurrency(value,currency){

return new Intl.NumberFormat(undefined,{
style:"currency",
currency:currency
}).format(value);

}

};

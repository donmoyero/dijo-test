<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ImpactGrid — How Far Can You Go Without an API?</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg:#06080f; --surface:#0e1220; --elevated:#121729;
  --border:#1a2035; --mid:#222b42;
  --gold:#c8a96e; --gold-l:#e2c98a; --gold-g:rgba(200,169,110,0.10);
  --success:#2dd4a0; --warn:#f5a623; --danger:#ff4d6d; --blue:#3d7fff;
  --text:#edf0f7; --sec:#7a8ba8; --muted:#3d4e68;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Manrope',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;padding:2.5rem 1.5rem 5rem;}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 55% 40% at 5% 0%,rgba(200,169,110,0.05) 0%,transparent 60%),radial-gradient(ellipse 45% 35% at 95% 100%,rgba(61,127,255,0.04) 0%,transparent 55%);pointer-events:none;z-index:0;}
.wrap{max-width:860px;margin:0 auto;position:relative;z-index:1;}

/* HERO */
.hero{text-align:center;margin-bottom:3.5rem;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--gold);letter-spacing:0.14em;text-transform:uppercase;border:1px solid rgba(200,169,110,0.2);border-radius:20px;padding:5px 15px;margin-bottom:18px;background:rgba(200,169,110,0.06);}
.hero-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--gold);box-shadow:0 0 8px rgba(200,169,110,0.8);}
.hero h1{font-family:'Syne',sans-serif;font-size:2.4rem;font-weight:800;color:var(--text);letter-spacing:-0.5px;line-height:1.15;margin-bottom:12px;}
.hero h1 span{color:var(--gold-l);}
.hero p{font-size:0.92rem;color:var(--sec);max-width:560px;margin:0 auto;line-height:1.7;}

/* VERDICT BOX */
.verdict{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px;margin-bottom:3rem;}
.v-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px 20px;position:relative;overflow:hidden;}
.v-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
.v-card.gold::before{background:linear-gradient(to right,transparent,var(--gold),transparent);}
.v-card.green::before{background:linear-gradient(to right,transparent,var(--success),transparent);}
.v-card.blue::before{background:linear-gradient(to right,transparent,var(--blue),transparent);}
.v-card.warn::before{background:linear-gradient(to right,transparent,var(--warn),transparent);}
.v-label{font-family:'JetBrains Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.12em;color:var(--muted);margin-bottom:8px;}
.v-val{font-family:'Syne',sans-serif;font-size:1.35rem;font-weight:800;}
.v-sub{font-size:11px;color:var(--sec);margin-top:4px;line-height:1.5;}

/* TABS */
.tab-row{display:flex;gap:8px;margin-bottom:2rem;flex-wrap:wrap;}
.tab{padding:8px 18px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--sec);font-size:12px;font-family:'Manrope',sans-serif;font-weight:600;cursor:pointer;transition:all 0.18s;letter-spacing:0.02em;}
.tab.active,.tab:hover{background:var(--gold-g);border-color:var(--gold);color:var(--gold-l);}

/* CONTENT PANELS */
.panel{display:none;}
.panel.active{display:block;}

/* SECTION GROUP */
.section-title{font-family:'JetBrains Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.14em;color:var(--muted);margin-bottom:12px;}

/* FEATURE CARDS */
.feature-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;margin-bottom:2rem;}
.feat{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px 22px;transition:border-color 0.2s,transform 0.2s;cursor:default;}
.feat:hover{border-color:var(--mid);transform:translateY(-2px);}
.feat-top{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
.feat-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.feat-meta{}
.feat-difficulty{font-family:'JetBrains Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:3px;}
.feat-name{font-family:'Syne',sans-serif;font-size:0.95rem;font-weight:700;color:var(--text);}
.feat-desc{font-size:12.5px;color:var(--sec);line-height:1.7;margin-bottom:10px;}
.feat-tags{display:flex;flex-wrap:wrap;gap:6px;}
.tag{font-size:10px;font-family:'JetBrains Mono',monospace;padding:3px 9px;border-radius:12px;border:1px solid;}

/* DIFFICULTY COLOURS */
.d-easy{color:var(--success);}
.d-medium{color:var(--gold);}
.d-hard{color:var(--warn);}
.d-expert{color:var(--danger);}
.bg-easy{background:rgba(45,212,160,0.1);border-color:rgba(45,212,160,0.3);color:var(--success);}
.bg-medium{background:rgba(200,169,110,0.1);border-color:rgba(200,169,110,0.3);color:var(--gold-l);}
.bg-hard{background:rgba(245,166,35,0.1);border-color:rgba(245,166,35,0.3);color:var(--warn);}
.bg-expert{background:rgba(255,77,109,0.1);border-color:rgba(255,77,109,0.3);color:var(--danger);}
.bg-blue{background:rgba(61,127,255,0.1);border-color:rgba(61,127,255,0.3);color:#79b8ff;}

/* HONEST WALL */
.wall{background:var(--surface);border:1px solid var(--mid);border-radius:16px;padding:28px 30px;margin-bottom:2rem;}
.wall h2{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;margin-bottom:16px;color:var(--text);}
.wall-row{display:flex;gap:14px;padding:11px 0;border-bottom:1px solid var(--border);align-items:flex-start;}
.wall-row:last-child{border-bottom:none;}
.wall-icon{font-size:16px;flex-shrink:0;margin-top:2px;width:24px;text-align:center;}
.wall-text{font-size:13px;color:var(--sec);line-height:1.65;}
.wall-text strong{color:var(--text);}

/* COMPARISON TABLE */
.compare{width:100%;border-collapse:collapse;margin-bottom:2rem;font-size:13px;}
.compare th{padding:10px 14px;text-align:left;font-family:'JetBrains Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);border-bottom:1px solid var(--border);}
.compare td{padding:11px 14px;border-bottom:1px solid var(--border);vertical-align:middle;}
.compare tr:last-child td{border-bottom:none;}
.compare tr:hover td{background:rgba(255,255,255,0.015);}
.yes{color:var(--success);font-weight:700;}
.no{color:var(--danger);}
.partial{color:var(--warn);}

/* ROADMAP */
.roadmap{position:relative;padding-left:30px;}
.roadmap::before{content:'';position:absolute;left:10px;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,var(--gold),var(--blue),transparent);}
.rm-item{position:relative;margin-bottom:22px;}
.rm-dot{position:absolute;left:-24px;top:4px;width:10px;height:10px;border-radius:50%;border:2px solid;}
.rm-phase{font-family:'JetBrains Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:4px;}
.rm-title{font-family:'Syne',sans-serif;font-size:0.92rem;font-weight:700;color:var(--text);margin-bottom:4px;}
.rm-detail{font-size:12px;color:var(--sec);line-height:1.65;}

/* BOTTOM CTA */
.cta{text-align:center;margin-top:3rem;padding:32px;background:var(--surface);border:1px solid var(--mid);border-radius:16px;position:relative;overflow:hidden;}
.cta::before{content:'';position:absolute;top:0;left:15%;right:15%;height:1px;background:linear-gradient(to right,transparent,var(--gold-l),transparent);opacity:0.5;}
.cta h2{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;margin-bottom:10px;}
.cta p{font-size:13px;color:var(--sec);max-width:480px;margin:0 auto 20px;line-height:1.7;}
.cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
.btn-gold{padding:11px 24px;background:linear-gradient(135deg,#b8923e,var(--gold-l));color:#06080f;font-weight:700;font-size:13px;border:none;border-radius:8px;cursor:pointer;font-family:'Manrope',sans-serif;transition:opacity 0.15s,transform 0.15s;}
.btn-gold:hover{opacity:0.9;transform:translateY(-1px);}
.btn-ghost{padding:11px 24px;background:transparent;color:var(--sec);font-size:13px;border:1px solid var(--border);border-radius:8px;cursor:pointer;font-family:'Manrope',sans-serif;transition:border-color 0.15s,color 0.15s;}
.btn-ghost:hover{border-color:var(--gold);color:var(--gold-l);}
</style>
</head>
<body>
<div class="wrap">

<!-- HERO -->
<div class="hero">
  <div class="hero-badge">ImpactGrid · No-API Upgrade Guide</div>
  <h1>How advanced can ImpactGrid get <span>without an API?</span></h1>
  <p>The short answer: very. Here's an honest breakdown of what's possible with pure JavaScript, what takes a weekend, and where the real ceiling is.</p>
</div>

<!-- VERDICT CARDS -->
<div class="verdict">
  <div class="v-card gold">
    <div class="v-label">AI Intelligence</div>
    <div class="v-val" style="color:var(--gold-l);">85%</div>
    <div class="v-sub">of what an API gives you is achievable with a well-built rule engine</div>
  </div>
  <div class="v-card green">
    <div class="v-label">Dashboard Features</div>
    <div class="v-val" style="color:var(--success);">100%</div>
    <div class="v-sub">Zero features require an API. Every dashboard upgrade is pure JS</div>
  </div>
  <div class="v-card blue">
    <div class="v-label">What needs API</div>
    <div class="v-val" style="color:#79b8ff;">~15%</div>
    <div class="v-sub">Only true natural language understanding &amp; generative text</div>
  </div>
  <div class="v-card warn">
    <div class="v-label">Upgrade Time</div>
    <div class="v-val" style="color:var(--warn);">2–4 weeks</div>
    <div class="v-sub">To implement all features below at a production level</div>
  </div>
</div>

<!-- TABS -->
<div class="tab-row">
  <button class="tab active" onclick="switchTab('ai')">🧠 AI Upgrades</button>
  <button class="tab" onclick="switchTab('dashboard')">📊 Dashboard Features</button>
  <button class="tab" onclick="switchTab('ux')">✨ UX &amp; Design</button>
  <button class="tab" onclick="switchTab('limits')">⚠️ Honest Limits</button>
  <button class="tab" onclick="switchTab('roadmap')">🗺️ Build Roadmap</button>
</div>

<!-- ===================== AI PANEL ===================== -->
<div class="panel active" id="panel-ai">

  <div class="section-title">AI engine upgrades — no API required</div>
  <div class="feature-grid">

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(200,169,110,0.12);">🎯</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-easy">Easy · Already Built</div>
          <div class="feat-name">Deep Financial Analysis Engine</div>
        </div>
      </div>
      <div class="feat-desc">The current v3 engine already does break-even, margin, volatility, trend acceleration, cost creep, anomaly detection, benchmarks and 17 specialist modules. This is 80% of what a paid AI tool does.</div>
      <div class="feat-tags"><span class="tag bg-easy">Done ✓</span><span class="tag bg-blue">17 modules</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(45,212,160,0.12);">🧮</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-easy">Easy · 1 day</div>
          <div class="feat-name">Advanced Statistical Engine</div>
        </div>
      </div>
      <div class="feat-desc">Add linear regression for trend lines, moving averages (3-month, 6-month), standard error bands on forecasts, and R² confidence scoring. Makes forecasts dramatically more accurate.</div>
      <div class="feat-tags"><span class="tag bg-easy">Pure JS</span><span class="tag bg-medium">Math only</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(61,127,255,0.12);">🔮</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-medium">Medium · 2 days</div>
          <div class="feat-name">ML-Style Forecasting (No API)</div>
        </div>
      </div>
      <div class="feat-desc">Exponential smoothing (Holt-Winters), seasonal decomposition, and weighted trend forecasting. This is the same algorithm Excel and Google Sheets use. Significantly better than simple growth-rate projection.</div>
      <div class="feat-tags"><span class="tag bg-medium">No library needed</span><span class="tag bg-blue">Holt-Winters</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(245,166,35,0.12);">💬</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-medium">Medium · 2 days</div>
          <div class="feat-name">Smarter Conversation Memory</div>
        </div>
      </div>
      <div class="feat-desc">Track conversation topics over multiple turns. If user asks about risk then asks "why?", understand that "why" refers to risk. Store context slots (last topic, last metric discussed, last time period mentioned) for natural follow-ups.</div>
      <div class="feat-tags"><span class="tag bg-medium">State machine</span><span class="tag bg-blue">localStorage</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(200,169,110,0.12);">📝</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-medium">Medium · 2 days</div>
          <div class="feat-name">Auto-Generated Financial Narratives</div>
        </div>
      </div>
      <div class="feat-desc">Build a template engine that writes a full paragraph-style financial narrative every month — like a real management accountant would. "In Q3, revenue grew 12% driven by strong August performance, though margin compression of 2.3pts warrants attention."</div>
      <div class="feat-tags"><span class="tag bg-medium">Template engine</span><span class="tag bg-easy">No API</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(255,77,109,0.12);">🚨</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-easy">Easy · 4 hours</div>
          <div class="feat-name">Proactive Alert System</div>
        </div>
      </div>
      <div class="feat-desc">AI watches your data continuously. When margin drops below a threshold, growth reverses, or volatility spikes — it proactively surfaces an alert card without being asked. Like a real adviser who flags problems before you notice.</div>
      <div class="feat-tags"><span class="tag bg-easy">Rule-based</span><span class="tag bg-medium">Threshold engine</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(45,212,160,0.12);">🎓</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-hard">Medium-Hard · 3 days</div>
          <div class="feat-name">Scenario Modelling ("What If" Engine)</div>
        </div>
      </div>
      <div class="feat-desc">Let users ask "what if I cut expenses by 15%?" or "what if revenue grows 5% next month?" — the AI recalculates all metrics, reforecasts, and shows the new financial picture in real time. No API needed.</div>
      <div class="feat-tags"><span class="tag bg-hard">Simulation engine</span><span class="tag bg-blue">Interactive</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(61,127,255,0.12);">📊</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-hard">Hard · 4 days</div>
          <div class="feat-name">Comparative Period Intelligence</div>
        </div>
      </div>
      <div class="feat-desc">Month-over-month, quarter-over-quarter, and year-over-year comparisons with automatic commentary. "This quarter is your best quarter on record, outperforming Q2 by 23%. Revenue per month is 18% above the 6-month average."</div>
      <div class="feat-tags"><span class="tag bg-hard">Period engine</span><span class="tag bg-medium">Auto-commentary</span></div>
    </div>

  </div>
</div>

<!-- ===================== DASHBOARD PANEL ===================== -->
<div class="panel" id="panel-dashboard">

  <div class="section-title">Dashboard &amp; data features — all pure JS</div>
  <div class="feature-grid">

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(200,169,110,0.12);">💾</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-easy">Easy · 2 hours</div>
          <div class="feat-name">Auto-Save Everything (localStorage)</div>
        </div>
      </div>
      <div class="feat-desc">Business data, chat history, currency preference, and business profile all persist between sessions automatically. Nothing is lost on refresh. Feels like a real SaaS app.</div>
      <div class="feat-tags"><span class="tag bg-easy">localStorage</span><span class="tag bg-easy">2 hrs</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(45,212,160,0.12);">📁</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-easy">Easy · 1 day</div>
          <div class="feat-name">Multi-Business Support</div>
        </div>
      </div>
      <div class="feat-desc">Let users create and switch between multiple business profiles (e.g. "Main Business", "Side Project"). Each has its own dataset, stored separately in localStorage. A real power-user feature.</div>
      <div class="feat-tags"><span class="tag bg-easy">localStorage</span><span class="tag bg-medium">Profile switcher</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(61,127,255,0.12);">📤</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-easy">Easy · 4 hours</div>
          <div class="feat-name">Export to Excel / CSV</div>
        </div>
      </div>
      <div class="feat-desc">Export all financial records, AI insights, and performance scores to a formatted Excel file using SheetJS (already loaded). One click to produce a spreadsheet clients and accountants can use immediately.</div>
      <div class="feat-tags"><span class="tag bg-easy">SheetJS</span><span class="tag bg-easy">Already loaded</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(245,166,35,0.12);">🎯</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-medium">Medium · 2 days</div>
          <div class="feat-name">Goals &amp; Targets Module</div>
        </div>
      </div>
      <div class="feat-desc">Let users set revenue, profit, and margin targets. Dashboard shows progress bars, countdown to target, and AI commentary on whether the target is achievable at current growth rate.</div>
      <div class="feat-tags"><span class="tag bg-medium">Goal engine</span><span class="tag bg-blue">Progress tracking</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(200,169,110,0.12);">📅</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-medium">Medium · 2 days</div>
          <div class="feat-name">Budget vs Actuals Tracking</div>
        </div>
      </div>
      <div class="feat-desc">Users enter monthly budgets alongside actuals. Dashboard shows variance (over/under), percentage deviation, and AI flags months where actuals deviated significantly from budget.</div>
      <div class="feat-tags"><span class="tag bg-medium">Variance engine</span><span class="tag bg-blue">Budget tracking</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(45,212,160,0.12);">📈</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-medium">Medium · 3 days</div>
          <div class="feat-name">Advanced Chart Suite</div>
        </div>
      </div>
      <div class="feat-desc">Waterfall charts (shows revenue → expenses → profit visually), scatter plots (revenue vs profit correlation), rolling 3-month average overlay on all line charts, and a heat map calendar showing best/worst months by colour intensity.</div>
      <div class="feat-tags"><span class="tag bg-medium">Chart.js</span><span class="tag bg-blue">5 new chart types</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(255,77,109,0.12);">🔔</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-easy">Easy · 1 day</div>
          <div class="feat-name">Smart Notification Centre</div>
        </div>
      </div>
      <div class="feat-desc">A notification bell in the header. When AI detects something important (margin drop, anomaly, goal reached, 3-month streak) it adds a notification. Users can review and dismiss them.</div>
      <div class="feat-tags"><span class="tag bg-easy">Event system</span><span class="tag bg-easy">Pure JS</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(61,127,255,0.12);">🗓️</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-hard">Hard · 4 days</div>
          <div class="feat-name">Expense Category Breakdown</div>
        </div>
      </div>
      <div class="feat-desc">Let users split expenses into categories (staff, rent, marketing, COGS, etc.) per month. AI then analyses which category is growing fastest, which has the best reduction potential, and produces a category-level P&amp;L.</div>
      <div class="feat-tags"><span class="tag bg-hard">Data model change</span><span class="tag bg-medium">New UI</span></div>
    </div>

  </div>
</div>

<!-- ===================== UX PANEL ===================== -->
<div class="panel" id="panel-ux">

  <div class="section-title">UX &amp; design upgrades — zero cost, high impact</div>
  <div class="feature-grid">

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(200,169,110,0.12);">🎨</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-easy">Easy · 1 day</div>
          <div class="feat-name">Onboarding Flow</div>
        </div>
      </div>
      <div class="feat-desc">A guided first-run experience: welcome screen → business type → currency → first 3 months entered step-by-step with tips. New users instantly understand the product. Huge impact on retention.</div>
      <div class="feat-tags"><span class="tag bg-easy">Step wizard</span><span class="tag bg-blue">First-run only</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(45,212,160,0.12);">✨</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-easy">Easy · 4 hours</div>
          <div class="feat-name">Animated Dashboard Transitions</div>
        </div>
      </div>
      <div class="feat-desc">Charts animate in on data entry, numbers count up from 0 when first rendered, section transitions use smooth fade/slide. Metric tiles "flash" gold when values update. Makes the product feel alive and premium.</div>
      <div class="feat-tags"><span class="tag bg-easy">CSS animations</span><span class="tag bg-easy">JS counters</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(61,127,255,0.12);">📱</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-medium">Medium · 2 days</div>
          <div class="feat-name">Full Mobile Optimisation</div>
        </div>
      </div>
      <div class="feat-desc">Bottom navigation bar on mobile, touch-friendly chart tooltips, swipe gestures between sections, and collapsible card groups. Currently the layout works on mobile but isn't optimised for it.</div>
      <div class="feat-tags"><span class="tag bg-medium">Responsive</span><span class="tag bg-blue">Touch events</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(245,166,35,0.12);">🏆</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-medium">Medium · 2 days</div>
          <div class="feat-name">Achievement &amp; Milestone System</div>
        </div>
      </div>
      <div class="feat-desc">Celebrate financial milestones automatically: first profitable month, 6-month streak, margin above 20%, revenue doubling. Gold badge notifications with a brief celebration moment. Increases engagement significantly.</div>
      <div class="feat-tags"><span class="tag bg-medium">Event triggers</span><span class="tag bg-blue">Milestone engine</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(200,169,110,0.12);">🖨️</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-hard">Hard · 3 days</div>
          <div class="feat-name">Enhanced PDF Reports</div>
        </div>
      </div>
      <div class="feat-desc">Charts rendered as images in PDF (using canvas.toDataURL), executive summary page, a full AI narrative section, colour-coded tables, and a branded cover page with logo. Currently the PDF is text-only — charts would make it professional-grade.</div>
      <div class="feat-tags"><span class="tag bg-hard">Canvas → PNG</span><span class="tag bg-medium">jsPDF</span></div>
    </div>

    <div class="feat">
      <div class="feat-top">
        <div class="feat-icon" style="background:rgba(45,212,160,0.12);">🌐</div>
        <div class="feat-meta">
          <div class="feat-difficulty d-easy">Easy · 4 hours</div>
          <div class="feat-name">Keyboard Shortcuts</div>
        </div>
      </div>
      <div class="feat-desc">Power-user keyboard shortcuts: N for new record, 1-6 to switch sections, / to focus AI chat, Ctrl+P for PDF, Ctrl+S to export. Makes the product feel like professional software.</div>
      <div class="feat-tags"><span class="tag bg-easy">keydown events</span><span class="tag bg-easy">4 hours</span></div>
    </div>

  </div>
</div>

<!-- ===================== LIMITS PANEL ===================== -->
<div class="panel" id="panel-limits">

  <div class="wall" style="border-color:rgba(255,77,109,0.3);">
    <h2 style="color:var(--text);">What you genuinely cannot do without an API</h2>

    <div class="wall-row">
      <div class="wall-icon">✗</div>
      <div class="wall-text"><strong>True natural language understanding</strong> — if a user types "my sales were terrible last quarter, what's going on?", a rule engine can detect "terrible" and "last quarter" but cannot truly understand the emotional context, ambiguity, or generate a unique empathetic response. An API gives you this.</div>
    </div>
    <div class="wall-row">
      <div class="wall-icon">✗</div>
      <div class="wall-text"><strong>Generative text</strong> — every response from the no-API engine is assembled from pre-written templates. Two businesses with the same data get the same words. An API generates genuinely unique, contextual responses every time.</div>
    </div>
    <div class="wall-row">
      <div class="wall-icon">✗</div>
      <div class="wall-text"><strong>Open-ended questions</strong> — "what do you think about my pricing strategy?" or "is now a good time to hire?" requires reasoning the no-API engine cannot do. It needs to weigh multiple factors dynamically.</div>
    </div>
    <div class="wall-row">
      <div class="wall-icon">✗</div>
      <div class="wall-text"><strong>Multi-document intelligence</strong> — analysing invoices, contracts, or bank statements and extracting insights from unstructured text requires an LLM. Rule engines can only work with structured numbers.</div>
    </div>
    <div class="wall-row">
      <div class="wall-icon">~</div>
      <div class="wall-text"><strong>Partial: Sentiment &amp; intent detection</strong> — you can improve keyword matching significantly (synonym lists, fuzzy matching, question parsing) but it will never match a model that truly understands language.</div>
    </div>
  </div>

  <table class="compare">
    <thead>
      <tr>
        <th>Capability</th>
        <th>No API (Rule Engine)</th>
        <th>With Claude API</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Financial ratio analysis</td>
        <td class="yes">✓ Full</td>
        <td class="yes">✓ Full</td>
      </tr>
      <tr>
        <td>Forecasting &amp; projections</td>
        <td class="yes">✓ Full (Holt-Winters etc.)</td>
        <td class="yes">✓ Full + narrative</td>
      </tr>
      <tr>
        <td>Risk &amp; anomaly detection</td>
        <td class="yes">✓ Full</td>
        <td class="yes">✓ Full + deeper context</td>
      </tr>
      <tr>
        <td>Industry benchmarking</td>
        <td class="yes">✓ With hardcoded benchmarks</td>
        <td class="yes">✓ Dynamic + research-based</td>
      </tr>
      <tr>
        <td>Strategic recommendations</td>
        <td class="partial">~ Template-based, very good</td>
        <td class="yes">✓ Genuinely unique advice</td>
      </tr>
      <tr>
        <td>Natural conversation</td>
        <td class="partial">~ Keyword routing, good UX</td>
        <td class="yes">✓ True understanding</td>
      </tr>
      <tr>
        <td>Open-ended questions</td>
        <td class="no">✗ Needs pre-defined intent</td>
        <td class="yes">✓ Handles anything</td>
      </tr>
      <tr>
        <td>Unique response text</td>
        <td class="no">✗ Template assembled</td>
        <td class="yes">✓ Generated fresh every time</td>
      </tr>
      <tr>
        <td>Cost</td>
        <td class="yes">✓ Free</td>
        <td class="partial">~ £0.50–£3/month</td>
      </tr>
    </tbody>
  </table>

</div>

<!-- ===================== ROADMAP PANEL ===================== -->
<div class="panel" id="panel-roadmap">

  <div class="section-title">Recommended build order — most impact first</div>
  <div class="roadmap">

    <div class="rm-item">
      <div class="rm-dot" style="background:var(--success);border-color:var(--success);box-shadow:0 0 8px rgba(45,212,160,0.5);"></div>
      <div class="rm-phase d-easy">Week 1 — Quick Wins (Already Done + Easy)</div>
      <div class="rm-title">Auto-Save + Export to Excel + Proactive Alerts</div>
      <div class="rm-detail">localStorage persistence so nothing is lost on refresh. Export button to produce a spreadsheet in one click. Alert system that flags issues without being asked. Combined: ~2 days of work, massive quality jump.</div>
    </div>

    <div class="rm-item">
      <div class="rm-dot" style="background:var(--gold);border-color:var(--gold);box-shadow:0 0 8px rgba(200,169,110,0.5);"></div>
      <div class="rm-phase d-medium">Week 2 — AI Brain Upgrade</div>
      <div class="rm-title">Holt-Winters Forecasting + Scenario Engine + Smarter Memory</div>
      <div class="rm-detail">Replace simple growth projection with exponential smoothing for dramatically better forecasts. Add "what if" scenario modelling. Improve conversation memory to track topic context across messages.</div>
    </div>

    <div class="rm-item">
      <div class="rm-dot" style="background:var(--blue);border-color:var(--blue);box-shadow:0 0 8px rgba(61,127,255,0.5);"></div>
      <div class="rm-phase d-medium">Week 3 — Data Power Features</div>
      <div class="rm-title">Goals + Budget vs Actuals + Multi-Business Support</div>
      <div class="rm-detail">Let users set targets and track against them. Add budget entry so AI can flag variances. Multi-business profile switching so the tool works for users with more than one venture.</div>
    </div>

    <div class="rm-item">
      <div class="rm-dot" style="background:var(--warn);border-color:var(--warn);box-shadow:0 0 8px rgba(245,166,35,0.5);"></div>
      <div class="rm-phase d-hard">Week 4 — Premium Finishing</div>
      <div class="rm-title">Charts in PDF + Advanced Chart Suite + Mobile + Onboarding</div>
      <div class="rm-detail">Render charts as PNG images inside PDF reports. Add waterfall charts and heat map calendar. Full mobile optimisation. Guided onboarding flow for new users. After this, ImpactGrid is a genuinely competitive financial SaaS product.</div>
    </div>

    <div class="rm-item">
      <div class="rm-dot" style="background:var(--danger);border-color:var(--danger);"></div>
      <div class="rm-phase" style="color:var(--sec);">Optional — If You Want It</div>
      <div class="rm-title">Add Claude API for the final 15%</div>
      <div class="rm-detail">After all the above, the only remaining gap is true natural language and generative responses. At ~£1–2/month for typical SME usage, this is the most cost-effective upgrade available. Supabase Edge Function takes under an hour to set up.</div>
    </div>

  </div>
</div>

<!-- CTA -->
<div class="cta">
  <h2>Ready to build the next upgrade?</h2>
  <p>Tell me which feature you want first and I'll build it — complete, working code, no placeholders. Each one is a single conversation away.</p>
  <div class="cta-btns">
    <button class="btn-gold" onclick="alert('Tell Claude: \'Build the auto-save and localStorage persistence for ImpactGrid\'')">Start with Auto-Save</button>
    <button class="btn-gold" onclick="alert('Tell Claude: \'Build the Holt-Winters forecasting engine for ImpactGrid\'')">Holt-Winters Forecasts</button>
    <button class="btn-ghost" onclick="alert('Tell Claude: \'Build the scenario what-if engine for ImpactGrid\'')">What-If Scenarios</button>
  </div>
</div>

</div>
<script>
function switchTab(id) {
  document.querySelectorAll('.tab').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('active');});
  event.target.classList.add('active');
  document.getElementById('panel-' + id).classList.add('active');
}
</script>
</body>
</html>

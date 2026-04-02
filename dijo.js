<script>
const DIJO_API = 'https://impactgrid-dijo-api.onrender.com';

let allJobs = [];
let userCV = "";

/* =========================
   INIT
========================= */
document.addEventListener('DOMContentLoaded', async function() {
  await loadJobs();
});

/* =========================
   LOAD JOBS
========================= */
async function loadJobs() {
  try {
    const res = await fetch(DIJO_API + '/ai/jobs');
    const data = await res.json();

    allJobs = data.jobs || [];

    updateStats();
    renderJobs(allJobs);

  } catch (e) {
    document.getElementById('jobsGrid').innerHTML =
      '<p style="text-align:center;padding:40px;">Failed to load jobs</p>';
  }
}

/* =========================
   START MATCHING (FIXED 🔥)
========================= */
async function startMatching() {
  userCV = prompt("Paste your CV:");

  if (!userCV) return;

  document.getElementById('jobsGrid').innerHTML =
    '<p style="text-align:center;padding:40px;">Dijo is understanding your profile...</p>';

  /* =========================
     STEP 1: EXTRACT PROFILE
  ========================= */
  let profile;

  try {
    const res = await fetch(DIJO_API + '/ai/extract-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cv_text: userCV })
    });

    profile = await res.json();

  } catch (e) {
    console.error('Profile extraction failed', e);
    return;
  }

  const keywords = profile.search_keywords || [];

  /* =========================
     STEP 2: FILTER JOBS (REAL FIX)
  ========================= */
  const filteredJobs = allJobs.filter(job => {
    const text = (job.title + " " + job.description).toLowerCase();

    return keywords.some(k => text.includes(k.toLowerCase()));
  }).slice(0, 10);

  if (!filteredJobs.length) {
    document.getElementById('jobsGrid').innerHTML =
      '<p style="text-align:center;padding:40px;">No strong matches found.</p>';
    return;
  }

  document.getElementById('jobsGrid').innerHTML =
    '<p style="text-align:center;padding:40px;">Matching you with best jobs...</p>';

  /* =========================
     STEP 3: MATCH
  ========================= */
  const results = [];

  for (let job of filteredJobs) {
    try {
      const res = await fetch(DIJO_API + '/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv_text: userCV,
          job_description: job.description
        })
      });

      const data = await res.json();

      results.push({
        ...job,
        score: data.result?.score || 0,
        reasons: data.result?.reasons || []
      });

    } catch (e) {
      console.error('Match error', e);
    }
  }

  /* =========================
     STEP 4: SORT + TOP 3
  ========================= */
  results.sort((a, b) => b.score - a.score);

  renderMatches(results.slice(0, 3));
}

/* =========================
   FILTER
========================= */
function filterJobs() {
  const q = document.getElementById('searchInput').value.toLowerCase();

  const filtered = allJobs.filter(j =>
    (j.title || '').toLowerCase().includes(q) ||
    (j.company_name || '').toLowerCase().includes(q) ||
    (j.description || '').toLowerCase().includes(q)
  );

  renderJobs(filtered);
}

/* =========================
   STATS
========================= */
function updateStats() {
  document.getElementById('sTotal').textContent = allJobs.length;

  const companies = new Set(allJobs.map(j => j.company_name));
  document.getElementById('sCompanies').textContent = companies.size;

  const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const newJobs = allJobs.filter(j => new Date(j.created_at).getTime() > weekAgo);

  document.getElementById('sNew').textContent = newJobs.length;
}

/* =========================
   NORMAL JOBS
========================= */
function renderJobs(jobs) {
  const el = document.getElementById('jobsGrid');

  el.innerHTML = `
    <h3 style="margin-bottom:20px;">All Jobs</h3>
    ${jobs.map(j => `
      <div class="job-card">
        <h3>${escapeHTML(j.title)}</h3>
        <p>${escapeHTML(j.company_name)}</p>
        <a href="./dijo.html" class="job-apply-btn">Apply with Dijo</a>
      </div>
    `).join('')}
  `;
}

/* =========================
   MATCH RESULTS
========================= */
function renderMatches(jobs) {
  const el = document.getElementById('jobsGrid');

  el.innerHTML = `
    <h3 style="margin-bottom:20px;color:gold;">🔥 Top Matches For You</h3>

    ${jobs.map((j, i) => `
      <div class="job-card" style="border:2px solid ${i === 0 ? 'gold' : '#333'};">
        <h3>${escapeHTML(j.title)}</h3>
        <p>${escapeHTML(j.company_name)}</p>

        <p><strong>${j.score}% Match</strong></p>

        <ul>
          ${(j.reasons || []).slice(0,2).map(r => `<li>${escapeHTML(r)}</li>`).join('')}
        </ul>

        <a href="./dijo.html" class="job-apply-btn">Apply</a>
      </div>
    `).join('')}
  `;
}

/* =========================
   SAFE HTML
========================= */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
}
</script>

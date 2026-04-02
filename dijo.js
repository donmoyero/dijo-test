// STATE
let currentStep = 0;

const steps = document.querySelectorAll(".step");

// USER DATA
let user = {
  cv: "",
  role: "",
  location: ""
};


// 🚀 START BUTTON
document.getElementById("startBtn").onclick = () => {
  document.getElementById("landing").style.display = "none";
  document.getElementById("app").style.display = "block";
  showStep(0);
};


// 🔄 STEP CONTROL
function showStep(index) {
  steps.forEach(step => step.classList.remove("active"));
  steps[index].classList.add("active");
}


// ➡️ NEXT BUTTONS
document.querySelectorAll(".nextBtn").forEach(btn => {
  btn.onclick = () => {

    // CAPTURE DATA AT STEP 2
    if (currentStep === 1) {
      user.cv = document.getElementById("cvText").value;
      user.role = document.getElementById("role").value.toLowerCase();
      user.location = document.getElementById("location").value;
    }

    currentStep++;
    showStep(currentStep);

    // STEP 3 → LOADING
    if (currentStep === 2) {
      runAI();
    }

    // STEP 4 → SHOW JOBS
    if (currentStep === 3) {
      loadJobs();
    }
  };
});


// 🧠 FAKE AI THINKING (FEELS REAL)
function runAI() {
  const messages = [
    "Reading your CV...",
    "Understanding your skills...",
    "Finding best roles...",
    "Matching jobs to your profile..."
  ];

  let i = 0;

  const interval = setInterval(() => {
    document.getElementById("loadingText").innerText = messages[i];
    i++;

    if (i >= messages.length) {
      clearInterval(interval);

      setTimeout(() => {
        currentStep++;
        showStep(currentStep);
        loadJobs();
      }, 800);
    }

  }, 1200);
}


// 💼 GENERATE JOBS (SMART LOGIC)
function loadJobs() {
  const container = document.getElementById("jobs");
  container.innerHTML = "";

  let jobs = [];

  // ROLE-BASED MATCHING
  if (user.role.includes("frontend")) {
    jobs = [
      { title: "Frontend Developer", match: "92%" },
      { title: "React Developer", match: "88%" }
    ];
  } 
  else if (user.role.includes("data")) {
    jobs = [
      { title: "Data Analyst", match: "90%" },
      { title: "BI Analyst", match: "85%" }
    ];
  } 
  else if (user.role.includes("marketing")) {
    jobs = [
      { title: "Digital Marketing Executive", match: "89%" },
      { title: "Growth Marketer", match: "84%" }
    ];
  } 
  else {
    jobs = [
      { title: "General Assistant", match: "75%" },
      { title: "Operations Associate", match: "70%" }
    ];
  }

  // RENDER JOBS
  jobs.forEach((job, index) => {
    const div = document.createElement("div");
    div.className = "job-card";

    div.innerHTML = `
      <h3>${job.title}</h3>
      <p>Match: ${job.match}</p>
      <button onclick="applyJob('${job.title}')">
        Apply with Dijo
      </button>
    `;

    container.appendChild(div);
  });
}


// 📩 APPLY FLOW
function applyJob(jobTitle) {

  currentStep = 4;
  showStep(currentStep);

  setTimeout(() => {

    currentStep = 5;
    showStep(currentStep);

    document.getElementById("result").innerHTML = `
      <h3>${jobTitle}</h3>
      <p>This job fits you because:</p>
      <ul>
        <li>Matches your selected role (${user.role || "your profile"})</li>
        <li>Aligned with your experience</li>
        <li>High success probability</li>
      </ul>
    `;

  }, 2000);
}

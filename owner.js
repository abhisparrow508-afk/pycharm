
// OWNER LOGIN DETAILS - DEMO ONLY

const OWNER_USERNAME = "Abhishek CS";
const OWNER_PASSWORD = "12345";

// OWNER LOGIN
const ownerLoginButton = document.getElementById("ownerLoginBtn");

if (ownerLoginButton) {

    ownerLoginButton.addEventListener("click", function () {

        const username = document.getElementById("ownerUsername").value.trim();
        const password = document.getElementById("ownerPassword").value;

        if (username === OWNER_USERNAME && password === OWNER_PASSWORD) {

            sessionStorage.setItem("ownerLoggedIn", "true");

            window.location.href = "owner.html";

        } else {

            alert("Invalid Owner Username or Password!");

        }

    });

}

// PROTECT DASHBOARD
if (window.location.pathname.endsWith("owner.html")) {

    if (sessionStorage.getItem("ownerLoggedIn") !== "true") {
        window.location.replace("vote.html");
    } else {
        showOverview();
    }

}

// DASHBOARD OVERVIEW
function showOverview() {

    const voters = JSON.parse(localStorage.getItem("voters") || "{}");
    const votes = JSON.parse(localStorage.getItem("votes") || "{}");

    document.getElementById("dashboardContent").innerHTML = `
        <h2>Dashboard Overview</h2>

        <div class="stat">
            <h3>Total Registered Voters</h3>
            <p>${Object.keys(voters).length}</p>
        </div>

        <div class="stat">
            <h3>Total Votes Submitted</h3>
            <p>${Object.keys(votes).length}</p>
        </div>
    `;
}

// MANAGE CANDIDATES
function manageCandidates() {

    const candidates = [
        "Candidate A - Party A",
        "Candidate B - Party B",
        "Candidate C - Party C"
    ];

    document.getElementById("dashboardContent").innerHTML = `
        <h2>Manage Candidates</h2>
        ${candidates.map(candidate => `<div class="stat">${candidate}</div>`).join("")}
    `;

}

// MANAGE VOTERS
function manageVoters() {

    const voters = JSON.parse(localStorage.getItem("voters") || "{}");

    let html = "<h2>Registered Voters</h2>";

    Object.entries(voters).forEach(([id, name]) => {
        html += `<div class="stat">${name} - ${id}</div>`;
    });

    if (Object.keys(voters).length === 0) {
        html += "<p>No registered voters yet.</p>";
    }

    document.getElementById("dashboardContent").innerHTML = html;

}

// VIEW RESULTS
function viewResults() {

    const votes = JSON.parse(localStorage.getItem("votes") || "{}");

    const counts = {};

    Object.values(votes).forEach(candidateId => {
        counts[candidateId] = (counts[candidateId] || 0) + 1;
    });

    const candidates = [
        { id: 1, name: "Candidate A" },
        { id: 2, name: "Candidate B" },
        { id: 3, name: "Candidate C" }
    ];

    let html = "<h2>Election Results</h2>";

    candidates.forEach(candidate => {
        html += `
            <div class="stat">
                <h3>${candidate.name}</h3>
                <p>Total Votes: ${counts[candidate.id] || 0}</p>
            </div>
        `;
    });

    document.getElementById("dashboardContent").innerHTML = html;

}

// OWNER LOGOUT
function logout() {

    sessionStorage.removeItem("ownerLoggedIn");

    window.location.href="voter.html";

}

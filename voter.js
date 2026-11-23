
// DEMO VOTING SYSTEM
(() => {
    const candidates = [
        { id: 1, name: "Candidate A", party: "Party A" },
        { id: 2, name: "Candidate B", party: "Party B" },
        { id: 3, name: "Candidate C", party: "Party C" }
    ];

    function getVoters() {
        return JSON.parse(localStorage.getItem("voters") || "{}");
    }

    function getVotes() {
        return JSON.parse(localStorage.getItem("votes") || "{}");
    }

    // VOTER LOGIN PAGE
    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            const name = document.getElementById("voterName").value.trim();
            const voterId = document.getElementById("voterId").value.trim();

            if (!name || !voterId) {
                alert("Please enter your name and voter ID!");
                return;
            }

            const voters = getVoters();

            if (voters[voterId] && voters[voterId] !== name) {
                alert("This voter ID is already registered!");
                return;
            }

            voters[voterId] = name;

            localStorage.setItem("voters", JSON.stringify(voters));
            sessionStorage.setItem("currentVoter", voterId);

            window.location.href = "voter-dashboard.html";
        });
    }

    // RUN DASHBOARD CODE ONLY ON voter-dashboard.html
    if (document.getElementById("voterDashboardPage")) {

        const candidateList = document.getElementById("candidateList");
        const welcomeMessage = document.getElementById("welcomeMessage");
        const logoutBtn = document.getElementById("logoutBtn");

        const voterId = sessionStorage.getItem("currentVoter");
        const voters = getVoters();

        if (!voterId || !voters[voterId]) {
            window.location.href = "voter.html";
            return;
        }

        welcomeMessage.innerText = "Welcome " + voters[voterId] + "!";

        // DISPLAY CANDIDATES
        function displayCandidates() {
            const votes = getVotes();

            candidateList.innerHTML = "";

            candidates.forEach(candidate => {
                const div = document.createElement("div");
                div.className = "candidate";

                const heading = document.createElement("h3");
                heading.textContent = candidate.name;

                const party = document.createElement("p");
                party.textContent = candidate.party;

                const button = document.createElement("button");

                if (votes[voterId]) {
                    button.textContent = "Already Voted";
                    button.disabled = true;
                } else {
                    button.textContent = "Vote";

                    button.addEventListener("click", function () {
                        castVote(candidate.id);
                    });
                }

                div.appendChild(heading);
                div.appendChild(party);
                div.appendChild(button);

                candidateList.appendChild(div);
            });
        }

        // CAST VOTE
        function castVote(candidateId) {
            const votes = getVotes();

            if (votes[voterId]) {
                alert("You have already voted!");
                return;
            }

            votes[voterId] = candidateId;

            localStorage.setItem("votes", JSON.stringify(votes));

            alert("Your vote has been recorded!");

            displayCandidates();
        }

        // LOGOUT
        logoutBtn.addEventListener("click", function () {
            sessionStorage.removeItem("currentVoter");
            window.location.href = "voter.html";
        });

        displayCandidates();
    }
})();

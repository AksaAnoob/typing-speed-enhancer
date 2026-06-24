const EVENT_MODES = {
    rain: {
        name: "Rain Mode",
        speed: 5000
    },
    fire: {
        name: "Fire Mode",
        speed: 3000
    }
};

let currentMode = null;
let currentModeKey = null;
let currentWord = "";
let eventScore = 0;

let eventInterval = null;
let eventTimer = null;
let timeLeft = 60;

const currentUser = localStorage.getItem("username");

/* ================= TIMER ================= */
function startTimer() {
    timeLeft = 60;
    document.getElementById("eventTimer").innerText = timeLeft;

    eventTimer = setInterval(() => {
        timeLeft--;
        document.getElementById("eventTimer").innerText = timeLeft;

        if (timeLeft <= 0) {
            stopEventMode(true);
        }
    }, 1000);
}

/* ================= START MODE ================= */
function startEventMode(modeKey) {

    currentMode = EVENT_MODES[modeKey];
    currentModeKey = modeKey;
    eventScore = 0;

    clearInterval(eventInterval);
    clearInterval(eventTimer);

    document.getElementById("eventScore").innerText = 0;
    document.getElementById("eventTitle").innerText = currentMode.name;

    const input = document.getElementById("hiddenInput");
    input.disabled = false;
    input.value = "";
    input.focus();

    loadText();
    startTimer();

    eventInterval = setInterval(() => {
        loadText();
        document.getElementById("hiddenInput").value = "";
    }, currentMode.speed);
}

/* ================= LOAD WORD ================= */
function loadText() {
    const pool = WORD_BANK.easy;
    currentWord = pool[Math.floor(Math.random() * pool.length)];

    document.getElementById("textDisplay").innerHTML =
        currentWord
            .split("")
            .map(c => `<span>${c}</span>`)
            .join("");
}

/* ================= TYPING ================= */
function handleTyping() {
    const inputEl = document.getElementById("hiddenInput");
    const input = inputEl.value;
    const spans = document.querySelectorAll("#textDisplay span");

    spans.forEach((span, i) => {
        const typed = input[i];

        span.classList.remove("correct", "wrong");

        if (!typed) return;

        if (typed === span.innerText) {
            span.classList.add("correct");
        } else {
            span.classList.add("wrong");
        }
    });

    if (input === currentWord && currentWord.length > 0) {
        eventScore++;
        document.getElementById("eventScore").innerText = eventScore;

        inputEl.value = "";
        loadText();
    }
}

/* ================= STOP MODE ================= */
function stopEventMode(auto = false) {
    clearInterval(eventInterval);
    clearInterval(eventTimer);

    document.getElementById("hiddenInput").disabled = true;

    document.getElementById("eventTitle").innerText =
        auto ? "Time Up!" : "Stopped";

    saveEventScore();
}

/* ================= SAVE SCORE ================= */
function saveEventScore() {

    const username = localStorage.getItem("username");

    if (!username) return;

    fetch("https://typing-speed-enhancer-1.onrender.com/save-event-score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            score: eventScore,
            mode: currentModeKey
        })
    })
    .then(res => res.json())
    .then(data => console.log("Saved:", data.message))
    .catch(err => console.error("SAVE ERROR:", err));
}

/* ================= EVENT LEADERBOARD (BURST STYLE FIXED) ================= */
fetch("https://typing-speed-enhancer-1.onrender.com/event-leaderboard")
.then(res => res.json())
.then(data => {

    const container = document.getElementById("leaderboard");

    if (!data || data.length === 0) {
        container.innerHTML = `<p class="empty">No scores yet. Be the first 🔥</p>`;
        return;
    }

    // sort by score
    data.sort((a, b) => b.score - a.score);

    // rank calculation
    let rank = 1;

    for (let i = 0; i < data.length; i++) {
        if (i > 0 && data[i].score < data[i - 1].score) {
            rank = i + 1;
        }
        data[i].rank = rank;
    }

    let html = `
        <table>
            <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Mode</th>
            </tr>
    `;

    data.forEach(player => {

        const isCurrentUser =
            currentUser && player.username === currentUser;

        const rowClass = isCurrentUser ? "current-user" : "";

        // 🥇 medals fix
        let displayRank;
        if (player.rank === 1) displayRank = "🥇";
        else if (player.rank === 2) displayRank = "🥈";
        else if (player.rank === 3) displayRank = "🥉";
        else displayRank = `#${player.rank}`;

        // 👤 REAL burst-style avatar (NOT letters)
        const avatar =
            player.avatar ||
            `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(player.username)}`;

        html += `
            <tr class="${rowClass}">
                <td>${displayRank}</td>

                <td style="display:flex;align-items:center;gap:10px;justify-content:center;">
                    <img
                        src="${avatar}"
                        width="40"
                        height="40"
                        style="border-radius:50%"
                    >
                    ${player.username || "Unknown"}
                </td>

                <td>${player.score}</td>
                <td>${player.mode || "event"}</td>
            </tr>
        `;
    });

    html += "</table>";

    container.innerHTML = html;
})
.catch(err => {
    console.error(err);
    document.getElementById("leaderboard").innerHTML =
        `<p class="empty">Failed to load leaderboard ❌</p>`;
});

/* ================= FOCUS INPUT ================= */
function focusInput() {
    document.getElementById("hiddenInput").focus();
}
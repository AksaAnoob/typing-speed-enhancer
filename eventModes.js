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

let wordTimeout = null;     // FIXED: word timer
let countdownTimer = null;
let timeLeft = 60;

const currentUser = localStorage.getItem("username");

/* ================= TIMER ================= */
function startTimer() {
    timeLeft = 60;
    document.getElementById("eventTimer").innerText = timeLeft;

    countdownTimer = setInterval(() => {
        timeLeft--;
        document.getElementById("eventTimer").innerText = timeLeft;

        if (timeLeft <= 0) {
            stopEventMode(true);
        }
    }, 1000);
}

/* ================= LOAD WORD ================= */
function loadText() {

    const pool = WORD_BANK.medium; // your current choice
    currentWord = pool[Math.floor(Math.random() * pool.length)];

    document.getElementById("textDisplay").innerHTML =
        currentWord
            .split("")
            .map(c => `<span>${c}</span>`)
            .join("");
}

/* ================= RESET UI ================= */
function resetTypingUI() {

    const input = document.getElementById("hiddenInput");
    input.value = "";

    const spans = document.querySelectorAll("#textDisplay span");
    spans.forEach(span => {
        span.classList.remove("correct", "wrong");
    });
}

/* ================= NEXT WORD ================= */
function startNextWord() {

    clearTimeout(wordTimeout);

    loadText();
    resetTypingUI();

    wordTimeout = setTimeout(() => {
        startNextWord();
    }, currentMode.speed);
}

/* ================= START MODE ================= */
function startEventMode(modeKey) {

    currentMode = EVENT_MODES[modeKey];
    currentModeKey = modeKey;
    eventScore = 0;

    clearInterval(countdownTimer);
    clearTimeout(wordTimeout);

    document.getElementById("eventScore").innerText = 0;
    document.getElementById("eventTitle").innerText = currentMode.name;

    const input = document.getElementById("hiddenInput");
    input.disabled = false;
    input.value = "";
    input.focus();

    startTimer();

    startNextWord();
}

/* ================= TYPING ================= */
function handleTyping() {

    const inputEl = document.getElementById("hiddenInput");
    const input = inputEl.value;
    const spans = document.querySelectorAll("#textDisplay span");

    if (!currentWord) return;

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

    /* ================= WORD COMPLETE ================= */
    if (input === currentWord && currentWord.length > 0) {

        // score logic
        eventScore += (currentModeKey === "fire") ? 2 : 1;

        document.getElementById("eventScore").innerText = eventScore;

        // move to next word immediately but KEEP timing clean
        clearTimeout(wordTimeout);
        startNextWord();
    }
}

/* ================= STOP ================= */
function stopEventMode(auto = false) {

    clearTimeout(wordTimeout);
    clearInterval(countdownTimer);

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

/* ================= FOCUS ================= */
/* ================= FOCUS ================= */
/* ================= FOCUS ================= */
function focusInput() {
    document.getElementById("hiddenInput").focus();
}

/* ================= INSTRUCTIONS ================= */
function openInstructions() {
    document
        .getElementById("instructionModal")
        .classList.remove("hidden");
}

function closeInstructions() {
    document
        .getElementById("instructionModal")
        .classList.add("hidden");
}
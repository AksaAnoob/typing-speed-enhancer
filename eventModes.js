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
let backgroundMusic = null;
let currentMode = null;
let currentModeKey = null;
let currentWord = "";
let eventScore = 0;

let wordTimeout = null;
let countdownTimer = null;
let timeLeft = 60;
/* ================= NO REPEAT WORDS ================= */

let availableWords = [];
const currentUser = localStorage.getItem("username");

/* ================= TIMER ================= */
function startTimer() {

    timeLeft = 60;

    const timer = document.getElementById("eventTimer");

    timer.innerText = timeLeft;

    timer.classList.remove("timer-danger");   // Reset color when a new game starts

    countdownTimer = setInterval(() => {

        timeLeft--;

        timer.innerText = timeLeft;

        if (timeLeft <= 5) {
            timer.classList.add("timer-danger");
        }

        if (timeLeft <= 0) {
            stopEventMode(true);
        }

    }, 1000);
}
/* ================= GET UNIQUE WORD ================= */

function getUniqueWord() {

    if (availableWords.length === 0) {

        // Copy all medium words
        availableWords = [...WORD_BANK.medium];

        // Shuffle them
        for (let i = availableWords.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [availableWords[i], availableWords[j]] =
            [availableWords[j], availableWords[i]];
        }
    }

    return availableWords.pop();
}
/* ================= LOAD WORD ================= */
function loadText() {

    currentWord = getUniqueWord();

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
function playBackgroundMusic() {

    stopBackgroundMusic();

    backgroundMusic = new Audio("sounds/stress.mp3");

    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.25;

    backgroundMusic.play();
}

function stopBackgroundMusic() {

    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        backgroundMusic = null;
    }

}
/* ================= START MODE ================= */
function startEventMode(modeKey) {

    currentMode = EVENT_MODES[modeKey];
    currentModeKey = modeKey;

    playBackgroundMusic();
    eventScore = 0;
    availableWords = [];
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

        eventScore += (currentModeKey === "fire") ? 2 : 1;

        document.getElementById("eventScore").innerText = eventScore;

        clearTimeout(wordTimeout);
        startNextWord();
    }
}

/* ================= STOP ================= */
function stopEventMode(auto = false) {
stopBackgroundMusic();
    clearTimeout(wordTimeout);
    clearInterval(countdownTimer);

    document.getElementById("hiddenInput").disabled = true;

    document.getElementById("eventTitle").innerText =
        auto ? "Time Up!" : "Stopped";

    // save score first
    saveEventScore();

    // 🔥 SHOW RESULT POPUP (from HTML)
    if (typeof showResult === "function") {
        showResult(eventScore);
    }
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
function focusInput() {
    document.getElementById("hiddenInput").focus();
}

/* ================= INSTRUCTIONS ================= */
function openInstructions() {
    document.getElementById("instructionModal")
        .classList.remove("hidden");
}

function closeInstructions() {
    document.getElementById("instructionModal")
        .classList.add("hidden");
}
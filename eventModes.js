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

/* TIMER */
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

/* START MODE */
function startEventMode(modeKey) {

    currentMode = EVENT_MODES[modeKey];
    currentModeKey = modeKey; // 🔥 IMPORTANT FIX
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

/* LOAD WORD */
function loadText() {
    const pool = WORD_BANK.easy;
    currentWord = pool[Math.floor(Math.random() * pool.length)];

    document.getElementById("textDisplay").innerHTML =
        currentWord
            .split("")
            .map(c => `<span>${c}</span>`)
            .join("");
}

/* TYPING */
function handleTyping() {
    const inputEl = document.getElementById("hiddenInput");
    const input = inputEl.value;
    const spans = document.querySelectorAll("#textDisplay span");

    let correct = true;

    spans.forEach((span, i) => {
        const typed = input[i];

        span.classList.remove("correct", "wrong");

        if (!typed) return;

        if (typed === span.innerText) {
            span.classList.add("correct");
        } else {
            span.classList.add("wrong");
            correct = false;
        }
    });

    if (input === currentWord && currentWord.length > 0) {
        eventScore++;
        document.getElementById("eventScore").innerText = eventScore;

        inputEl.value = "";
        loadText();
    }
}

/* STOP */
function stopEventMode(auto = false) {
    clearInterval(eventInterval);
    clearInterval(eventTimer);

    document.getElementById("hiddenInput").disabled = true;

    document.getElementById("eventTitle").innerText =
        auto ? "Time Up!" : "Stopped";

    saveEventScore();
}

/* SAVE SCORE */
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
            mode: currentModeKey // 🔥 FIXED HERE
        })
    })
    .then(res => res.json())
    .then(data => console.log("Saved:", data.message))
    .catch(err => console.error("SAVE ERROR:", err));
}

/* FOCUS */
function focusInput() {
    document.getElementById("hiddenInput").focus();
}
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
let currentWord = "";
let eventScore = 0;

let eventInterval = null;
let eventTimer = null;
let timeLeft = 60;

/* ---------------- TIMER ---------------- */
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

/* ---------------- START MODE ---------------- */
function startEventMode(modeKey) {

    currentMode = EVENT_MODES[modeKey];
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

        // ❗ IMPORTANT FIX:
        // If user is typing and word changes → clear input
        input.value = "";

    }, currentMode.speed);
}

/* ---------------- LOAD WORD ---------------- */
function loadText() {

    const pool = WORD_BANK.easy;
    currentWord = pool[Math.floor(Math.random() * pool.length)];

    document.getElementById("textDisplay").innerHTML =
        currentWord
            .split("")
            .map(c => `<span>${c}</span>`)
            .join("");
}

/* ---------------- INPUT HANDLER ---------------- */
function handleTyping() {

    const input = document.getElementById("hiddenInput").value;
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

    // ✅ WORD COMPLETED
    if (input === currentWord && currentWord.length > 0) {

        eventScore++;
        document.getElementById("eventScore").innerText = eventScore;

        document.getElementById("hiddenInput").value = "";
        loadText();
    }
}

/* ---------------- STOP MODE ---------------- */
function stopEventMode(auto = false) {

    clearInterval(eventInterval);
    clearInterval(eventTimer);

    document.getElementById("hiddenInput").disabled = true;

    document.getElementById("eventTitle").innerText =
        auto ? "Time Up!" : "Stopped";

    saveEventScore();
}

/* ---------------- SAVE TO DB ---------------- */
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
            mode: currentMode?.name || "event"
        })
    })
    .then(res => res.json())
    .then(data => console.log("Saved:", data.message))
    .catch(err => console.error(err));
}

/* ---------------- FOCUS ---------------- */
function focusInput() {
    document.getElementById("hiddenInput").focus();
}
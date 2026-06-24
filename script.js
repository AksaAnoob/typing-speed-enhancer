let time = 60;
let interval = null;
let isRunning = false;
let currentText = "";
let resultCalculated = false;
let startTime = null;

const username = localStorage.getItem("username");

if (username) {
    document.getElementById("welcomeUser").innerText =
        `Welcome, ${username}!`;
}

/* ---------- LOAD TEXT ---------- */
function loadRandomText() {

    const difficulty = document.getElementById("difficulty").value;
    const selected = SENTENCE_BANK[difficulty];

    currentText = selected[Math.floor(Math.random() * selected.length)];

    const container = document.getElementById("textDisplay");
    container.innerHTML = "";

    currentText.split("").forEach(char => {
        const span = document.createElement("span");
        span.textContent = char;
        container.appendChild(span);
    });
}

/* ---------- FOCUS ---------- */
function focusInput() {
    document.getElementById("hiddenInput").focus();
}

/* ---------- START ---------- */
function startTest() {

    clearInterval(interval);

    isRunning = true;
    resultCalculated = false;
    time = 60;
    startTime = Date.now();

    document.getElementById("hiddenInput").value = "";
    document.getElementById("hiddenInput").disabled = false;

    document.getElementById("result").style.display = "none";

    loadRandomText();
    focusInput();

    document.getElementById("timer").innerText = time;
    document.getElementById("liveWpm").innerText = 0;
    document.getElementById("liveAccuracy").innerText = "100%";

    interval = setInterval(() => {

        if (!isRunning) return;

        time--;
        document.getElementById("timer").innerText = time;

        if (time <= 0) {
            finishTest();
        }

    }, 1000);
}

/* ---------- HANDLE TYPING ---------- */
function handleTyping() {

    if (!isRunning) return;

    const input = document.getElementById("hiddenInput").value;
    const spans = document.querySelectorAll("#textDisplay span");

    let correctChars = 0;

    spans.forEach((span, i) => {

        span.classList.remove("correct", "incorrect");

        if (!input[i]) return;

        if (input[i] === span.innerText) {
            span.classList.add("correct");
            correctChars++;
        } else {
            span.classList.add("incorrect");
        }
    });

    /* LIVE STATS */
    const timeTaken = (Date.now() - startTime) / 60000 || 1 / 60;

    const wpm = Math.round(correctChars / 5 / timeTaken);
    const accuracy = input.length
        ? Math.round((correctChars / input.length) * 100)
        : 100;

    document.getElementById("liveWpm").innerText = wpm;
    document.getElementById("liveAccuracy").innerText = accuracy + "%";

    /* AUTO FINISH */
    if (input.length >= currentText.length) {
        finishTest();
    }
}

/* ---------- FINISH ---------- */
function finishTest() {

    if (!isRunning || resultCalculated) return;

    isRunning = false;
    resultCalculated = true;

    clearInterval(interval);
    document.getElementById("hiddenInput").disabled = true;

    calculateResult();
}

/* ---------- RESULT ---------- */
function calculateResult() {

    const input = document.getElementById("hiddenInput").value;

    let correct = 0;
    let mistakes = {};

    for (let i = 0; i < currentText.length; i++) {

        if (input[i] === currentText[i]) {
            correct++;
        } else {
            let key = currentText[i] === " " ? "[space]" : currentText[i];
            mistakes[key] = (mistakes[key] || 0) + 1;
        }
    }

    const timeTaken = (Date.now() - startTime) / 60000 || 1 / 60;

    let wpm = Math.round(correct / 5 / timeTaken);
    if (input.length < 5) wpm = 0;

    let accuracy = Math.round((correct / currentText.length) * 100);

    /* SAVE */
    if (username) {
        fetch("https://typing-speed-enhancer-1.onrender.com/save-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, wpm, accuracy })
        });
    }

    let mistakeText = "Mistakes:\n";
    for (let k in mistakes) {
        mistakeText += `${k} → ${mistakes[k]} times\n`;
    }

    document.getElementById("liveWpm").innerText = wpm;
    document.getElementById("liveAccuracy").innerText = accuracy + "%";

    document.getElementById("wpmResult").innerText = "WPM: " + wpm;
    document.getElementById("accuracyResult").innerText = "Accuracy: " + accuracy + "%";
    document.getElementById("mistakeResult").innerText = mistakeText;

    document.getElementById("result").style.display = "block";
}

/* ---------- RESTART ---------- */
function restartTest() {
    startTest();
}
function openInstructions() {
    console.log("Button Clicked");

    const modal = document.getElementById("instructionModal");

    modal.classList.remove("hidden");
    modal.style.display = "flex";
}

function closeInstructions() {

    const modal = document.getElementById("instructionModal");

    modal.classList.add("hidden");
    modal.style.display = "none";
}
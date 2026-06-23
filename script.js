let time = 60;
let interval = null;
let isRunning = false;
let currentText = "";
let resultCalculated = false;

const username = localStorage.getItem("username");

if (username) {
    document.getElementById("welcomeUser").innerText =
        `Welcome, ${username}!`;
}

/* ---------- LOAD RANDOM TEXT (UPDATED) ---------- */
function loadRandomText() {

    const difficulty =
        document.getElementById("difficulty").value;

    let selectedPassages = SENTENCE_BANK[difficulty];

    let index =
        Math.floor(Math.random() * selectedPassages.length);

    currentText = selectedPassages[index];

    let container =
        document.getElementById("textToType");

    container.innerHTML = "";

    for (let i = 0; i < currentText.length; i++) {

        let span = document.createElement("span");

        span.textContent = currentText[i];
        span.dataset.char = currentText[i];

        container.appendChild(span);
    }
}

/* ---------- AUTO SCROLL ---------- */
function autoScrollText() {

    let container = document.getElementById("textToType");
    let inputLength = document.getElementById("inputBox").value.length;

    let spans = container.querySelectorAll("span");

    if (!spans[inputLength]) return;

    let target = spans[inputLength];

    container.scrollTo({
        top: target.offsetTop - container.clientHeight / 2,
        behavior: "smooth"
    });
}

/* ---------- HIGHLIGHT ---------- */
function updateHighlight() {

    let input = document.getElementById("inputBox").value;
    let spans = document.getElementById("textToType").querySelectorAll("span");

    spans.forEach((span, idx) => {

        span.classList.remove("correct", "wrong", "typed");

        if (idx < input.length) {

            let typedChar = input[idx];
            let originalChar = span.dataset.char;

            span.classList.add("typed");

            if (typedChar === originalChar) {
                span.classList.add("correct");
            } else {
                span.classList.add("wrong");
            }
        }
    });

    if (input === currentText) {
        finishTest();
        return;
    }

    updateLiveStats();
}

/* ---------- LIVE STATS ---------- */
function calculateMonkeyWPM(input) {

    let correctChars = 0;

    for (let i = 0; i < input.length; i++) {
        if (input[i] === currentText[i]) {
            correctChars++;
        }
    }

    let timeTaken = (60 - time) / 60;
    if (timeTaken <= 0) timeTaken = 1 / 60;

    let wpm = Math.round(correctChars / 5 / timeTaken);

    return {
        wpm,
        accuracy: input.length > 0
            ? Math.round((correctChars / input.length) * 100)
            : 100
    };
}

function updateLiveStats() {

    let input = document.getElementById("inputBox").value;

    let result = calculateMonkeyWPM(input);

    document.getElementById("liveWpm").innerText = result.wpm;
    document.getElementById("liveAccuracy").innerText = result.accuracy + "%";
}

/* ---------- INPUT EVENT ---------- */
document.getElementById("inputBox").addEventListener("input", () => {
    updateHighlight();
    autoScrollText();
});

/* ---------- START TEST ---------- */
function startTest() {

    resultCalculated = false;

    if (interval !== null) {
        clearInterval(interval);
    }

    isRunning = true;
    time = 60;

    document.getElementById("liveWpm").innerText = "0";
    document.getElementById("liveAccuracy").innerText = "100%";

    const inputBox = document.getElementById("inputBox");

    document.getElementById("result").style.display = "none";

    loadRandomText();

    inputBox.value = "";
    inputBox.disabled = false;
    inputBox.focus();

    updateHighlight();

    document.getElementById("timer").innerText = time;

    interval = setInterval(() => {

        if (!isRunning) return;

        time--;
        document.getElementById("timer").innerText = time;

        if (time <= 0) {

            isRunning = false;
            clearInterval(interval);

            inputBox.disabled = true;

            calculateResult();
        }

    }, 1000);
}

/* ---------- FINISH TEST ---------- */
function finishTest() {

    if (resultCalculated) return;

    isRunning = false;
    clearInterval(interval);
    interval = null;

    document.getElementById("inputBox").disabled = true;

    calculateResult();
}

/* ---------- RESULT ---------- */
function calculateResult() {

    if (resultCalculated) return;

    resultCalculated = true;

    isRunning = false;
    clearInterval(interval);
    interval = null;

    let input = document.getElementById("inputBox").value.trim();

    let timeTaken = (60 - time) / 60;
    if (timeTaken <= 0) timeTaken = 1 / 60;

    let wpm = Math.round((input.length / 5) / timeTaken);

    if (input.length < 5) wpm = 0;

    let correctChars = 0;
    let mistakes = {};

    for (let i = 0; i < currentText.length; i++) {

        let originalChar = currentText[i];
        let typedChar = input[i];

        if (typedChar === originalChar) {
            correctChars++;
        } else {

            let wrongChar = originalChar;
            if (wrongChar === " ") wrongChar = "[space]";

            mistakes[wrongChar] = (mistakes[wrongChar] || 0) + 1;
        }
    }

    let accuracy = Math.round((correctChars / currentText.length) * 100);

    const username = localStorage.getItem("username");

    if (username) {

        fetch("https://typing-speed-enhancer-1.onrender.com/save-score", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                wpm,
                accuracy
            })
        })
        .then(res => res.json())
        .then(data => console.log(data.message))
        .catch(err => console.error(err));
    }

    let mistakeText = "Mistaken Letters:\n";

    for (let char in mistakes) {
        mistakeText += `${char} → ${mistakes[char]} times\n`;
    }

    document.getElementById("liveWpm").innerText = wpm;
    document.getElementById("liveAccuracy").innerText = accuracy + "%";

    document.getElementById("wpmResult").innerText =
        "WPM: " + wpm;

    document.getElementById("accuracyResult").innerText =
        "Accuracy: " + accuracy + "%";

    document.getElementById("mistakeResult").innerText =
        mistakeText;

    document.getElementById("result").style.display = "block";
}

/* ---------- RESTART ---------- */
function restartTest() {
    startTest();
}

/* ---------- EXTRA SAFETY ---------- */
document.getElementById("inputBox").addEventListener("input", updateHighlight);
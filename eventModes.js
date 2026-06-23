const EVENT_MODES = {
    rain: {
        name: "Rain Mode",
        speed: 3000,
        mix: "words"
    },

    fire: {
        name: "Fire Mode",
        speed: 2000,
        mix: "words"
    },

    chaos: {
        name: "Chaos Mode",
        speed: 2500,
        mix: "mixed"
    }
};

let currentMode = null;
let currentWord = "";
let eventScore = 0;
let eventInterval = null;

/* ---------------- GET WORD ---------------- */
function getEventWord(mode) {

    let pool;

    if (mode.mix === "words") {
        pool = WORD_BANK.easy;
    }

    else if (mode.mix === "sentences") {
        pool = SENTENCE_BANK.easy;
    }

    else {
        pool = [
            ...WORD_BANK.easy,
            ...SENTENCE_BANK.easy
        ];
    }

    return pool[Math.floor(Math.random() * pool.length)];
}

/* ---------------- START MODE ---------------- */
function startEventMode(modeKey) {

    currentMode = EVENT_MODES[modeKey];
    eventScore = 0;

    clearInterval(eventInterval);

    document.getElementById("eventTitle").innerText =
        currentMode.name;

    document.getElementById("eventInput").disabled = false;
    document.getElementById("eventInput").value = "";
    document.getElementById("eventInput").focus();

    loadNewWord();

    document.getElementById("eventScore").innerText =
        "Score: 0";

    // ONLY refresh word slowly (NOT fast chaos)
    eventInterval = setInterval(() => {
        loadNewWord();
    }, currentMode.speed);
}

/* ---------------- LOAD WORD ---------------- */
function loadNewWord() {

    currentWord = getEventWord(currentMode);

    document.getElementById("eventBox").innerText =
        currentWord;

    document.getElementById("eventInput").value = "";
}

/* ---------------- INPUT CHECK ---------------- */
document.getElementById("eventInput")
.addEventListener("input", function () {

    let typed = this.value.trim();

    if (typed === currentWord) {

        eventScore++;
        document.getElementById("eventScore").innerText =
            "Score: " + eventScore;

        loadNewWord();
    }

    // wrong handling (optional feedback)
    else if (typed.length >= currentWord.length) {
        this.value = "";
    }
});
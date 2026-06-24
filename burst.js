let score = 0;
let combo = 0;
let time = 60;
let interval = null;
let currentWord = "";
let level = "easy";
let feverMode = false;

/* ---------- RANDOM WORD ---------- */
function getRandomWord() {
    return WORD_BANK[level][Math.floor(Math.random() * WORD_BANK[level].length)];
}

/* ---------- LOAD WORD ---------- */
function loadWord() {
    currentWord = getRandomWord();
    document.getElementById("wordBox").innerText = currentWord;
}

/* ---------- START GAME ---------- */
function startBurst() {

    score = 0;
    combo = 0;
    time = 60;
    level = "easy";
    feverMode = false;

    document.getElementById("score").innerText = 0;
    document.getElementById("combo").innerText = 0;
    document.getElementById("timer").innerText = 60;
    document.getElementById("comboStatus").innerText = "Start Typing...";

    document.body.style.boxShadow = "none";

    const input = document.getElementById("wordInput");
    input.value = "";
    input.disabled = false;
    input.focus();

    loadWord();

    clearInterval(interval);

    interval = setInterval(() => {

        time--;
        document.getElementById("timer").innerText = time;

        if (time <= 0) {
            finishBurst();
        }

    }, 1000);
}

/* ---------- END GAME ---------- */
function finishBurst() {

    clearInterval(interval);

    document.getElementById("wordInput").disabled = true;
    document.getElementById("comboStatus").innerText = "Game Over";

    const username = localStorage.getItem("username");

    if (username) {
        fetch("https://typing-speed-enhancer-1.onrender.com/save-burst-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, score })
        });
    }

    /* ❌ removed alert (your suggestion) */
    document.getElementById("comboStatus").innerText =
        `Game Over! Final Score: ${score}`;
}

/* ---------- INPUT HANDLER ---------- */
document.getElementById("wordInput").addEventListener("input", function () {

    let typed = this.value.trim();

    if (typed === currentWord) {

        combo++;

        if (combo > 10) combo = 10;

        /* SCORE SYSTEM */
        if (combo >= 7) score += 3;
        else if (combo >= 4) score += 2;
        else score += 1;

        /* TIME BONUS */
        if (combo % 3 === 0) time++;

        /* FEVER MODE */
        if (combo === 10) {
            feverMode = true;
            document.body.style.boxShadow = "0 0 50px gold";
        }

        /* LEVEL SYSTEM */
        if (score >= 20) level = "hard";
        else if (score >= 10) level = "medium";
        else level = "easy";

        /* UI */
        document.getElementById("score").innerText = score;
        document.getElementById("combo").innerText = combo;

        /* STATUS */
        if (combo === 10) {
            document.getElementById("comboStatus").innerText = "⚡ FEVER MODE!";
        } else if (combo >= 7) {
            document.getElementById("comboStatus").innerText = "🔥 GOD STREAK!";
        } else if (combo >= 4) {
            document.getElementById("comboStatus").innerText = "🔥 Streak Active";
        } else {
            document.getElementById("comboStatus").innerText = "👍 Keep Going";
        }

        this.value = "";
        loadWord();
    }

    else if (
        typed.length >= currentWord.length &&
        typed !== currentWord
    ) {
        combo = 0;
        feverMode = false;

        document.body.style.boxShadow = "none";

        document.getElementById("combo").innerText = 0;
        document.getElementById("comboStatus").innerText = "💔 Reset!";
        this.value = "";
    }
});
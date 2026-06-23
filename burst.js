let score = 0;
let combo = 0;
const words = [
    "apple", "computer", "keyboard", "monitor", "internet",
    "python", "javascript", "mongodb", "database", "project",
    "student", "science", "technology", "developer", "challenge",
    "practice", "accuracy", "speed", "coding", "software"
];

let time = 60;
let interval = null;
let currentWord = "";

let feverMode = false;

/* ---------- LOAD WORD ---------- */
function loadWord() {
    let index = Math.floor(Math.random() * words.length);
    currentWord = words[index];
    document.getElementById("wordBox").innerText = currentWord;
}

/* ---------- START GAME ---------- */
function startBurst() {

    score = 0;
    combo = 0;
    time = 60;
    feverMode = false;

    document.body.style.boxShadow = "none";

    document.getElementById("score").innerText = score;
    document.getElementById("combo").innerText = combo;
    document.getElementById("timer").innerText = time;

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

    const username = localStorage.getItem("username");

    if (username) {
        fetch("https://typing-speed-enhancer-1.onrender.com/save-burst-score", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                score
            })
        })
        .then(res => res.json())
        .then(data => console.log(data.message))
        .catch(err => console.error(err));
    }

    alert("Time Up! Score: " + score);
}

/* ---------- INPUT HANDLER ---------- */
document.getElementById("wordInput")
.addEventListener("input", function () {

    let typed = this.value.trim();

    /* ---------- CORRECT WORD ---------- */
    if (typed === currentWord) {

        combo++;

        if (combo > 10) combo = 10;

        /* ---------- MULTIPLIER ---------- */
        let multiplier = 1;

        if (combo >= 7) multiplier = 2;
        else if (combo >= 4) multiplier = 1.5;
        else multiplier = 1;

        score += 1 * multiplier;

        /* ---------- TIME BONUS ---------- */
        if (combo % 3 === 0) {
            time += 1;
        }

        /* ---------- FEVER MODE ---------- */
        if (combo === 10) {
            feverMode = true;
            document.body.style.boxShadow = "0 0 50px gold";
        }

        /* ---------- UI UPDATE ---------- */
        document.getElementById("score").innerText = Math.floor(score);
        document.getElementById("combo").innerText = combo;

        this.value = "";
        loadWord();
    }

    /* ---------- WRONG WORD ---------- */
    else if (
        typed.length >= currentWord.length &&
        typed !== currentWord
    ) {

        combo = 0;
        feverMode = false;
        document.body.style.boxShadow = "none";

        document.getElementById("combo").innerText = combo;

        this.value = "";
    }
});
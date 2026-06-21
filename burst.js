let score = 0;
let combo = 0;
const words = [
    "apple",
    "computer",
    "keyboard",
    "monitor",
    "internet",
    "python",
    "javascript",
    "mongodb",
    "database",
    "project",
    "student",
    "science",
    "technology",
    "developer",
    "challenge",
    "practice",
    "accuracy",
    "speed",
    "coding",
    "software"
];

let time = 60;
let interval = null;
let currentWord = "";

function loadWord() {

    let index = Math.floor(Math.random() * words.length);

    currentWord = words[index];

    document.getElementById("wordBox").innerText = currentWord;
}

function startBurst() {

    score = 0;
combo = 0;
time = 60;

    document.getElementById("score").innerText = score;
    document.getElementById("combo").innerText = 0;
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

function finishBurst() {

    clearInterval(interval);

    document.getElementById("wordInput").disabled = true;

    const username = localStorage.getItem("username");

    if (username) {

        fetch("http://localhost:5000/save-burst-score", {
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

document.getElementById("wordInput")
.addEventListener("input", function() {

    let typed = this.value.trim();

    // Correct word
    if (typed === currentWord) {

        score++;
        combo++;

        document.getElementById("score").innerText = score;

        if (combo >= 5) {
            document.getElementById("combo").innerText =
                "🔥 x" + combo;
        } else {
            document.getElementById("combo").innerText =
                combo;
        }

        this.value = "";

        loadWord();
    }

    // Wrong word (user typed a space after wrong word)
    else if (
        typed.length >= currentWord.length &&
        typed !== currentWord
    ) {

        combo = 0;

        document.getElementById("combo").innerText =
            combo;

        this.value = "";
    }
});

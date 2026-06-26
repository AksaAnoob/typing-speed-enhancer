let score = 0;
let combo = 0;
let time = 60;
let interval = null;
let currentWord = "";
let level = "easy";
let feverMode = false;
let availableWords = [];
let previousLevel = "";
let feverAnimationPlayed = false;

/* ---------- RANDOM WORD ---------- */
function getRandomWord() {

    // Refill the list if level changes or all words are used
    if (level !== previousLevel || availableWords.length === 0) {

        previousLevel = level;

        // Make a copy of the words
        availableWords = [...WORD_BANK[level]];

        // Shuffle them
        for (let i = availableWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableWords[i], availableWords[j]] =
            [availableWords[j], availableWords[i]];
        }
    }

    // Take one word and remove it
    return availableWords.pop();
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
    
feverAnimationPlayed = false;
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
    document.getElementById("comboStatus").innerText =
        `Game Over! Final Score: ${score}`;

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
        });
    }
}

/* ---------- INSTRUCTIONS ---------- */
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
function createParticles() {
    const colors = ["#00f7ff", "#ff00ff", "#00ff6a", "#ffffff", "#ff3d00"];

    for (let i = 0; i < 40; i++) {
        const particle = document.createElement("div");

        particle.style.position = "fixed";
        particle.style.width = "6px";
        particle.style.height = "6px";
        particle.style.borderRadius = "50%";
        particle.style.left = "50%";
        particle.style.top = "50%";
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "9999";

        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;

        document.body.appendChild(particle);

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 200 + 50;

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        particle.animate([
            { transform: "translate(0,0)", opacity: 1 },
            { transform: `translate(${x}px, ${y}px)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: "cubic-bezier(.17,.67,.83,.67)"
        });

        setTimeout(() => particle.remove(), 1000);
    }
}

/* ---------- INPUT HANDLER ---------- */
window.onload = function () {

    document.getElementById("wordInput").addEventListener("input", function () {

        const typed = this.value.trim();

        if (typed === currentWord) {

            combo++;

            if (combo > 10) combo = 10;

            if (combo >= 7) score += 3;
            else if (combo >= 4) score += 2;
            else score += 1;

            if (combo % 3 === 0) {
                time++;
                document.getElementById("timer").innerText = time;
            }

            if (combo === 10 && !feverAnimationPlayed) {

    feverMode = true;
    feverAnimationPlayed = true;

    createParticles();
// 🔥 particle burst
}

            if (score >= 20) level = "hard";
            else if (score >= 10) level = "medium";
            else level = "easy";

            document.getElementById("score").innerText = score;
            document.getElementById("combo").innerText = combo;

            if (combo === 10) {
                document.getElementById("comboStatus").innerText = "⚡ FEVER MODE!";
            }
            else if (combo >= 7) {
                document.getElementById("comboStatus").innerText = "🔥 GOD STREAK!";
            }
            else if (combo >= 4) {
                document.getElementById("comboStatus").innerText = "🔥 Streak Active";
            }
            else {
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
feverAnimationPlayed = false;

            document.body.style.boxShadow = "none";

            document.getElementById("combo").innerText = 0;
            document.getElementById("comboStatus").innerText = "💔 Combo Reset!";

            this.value = "";
        }
    });
};
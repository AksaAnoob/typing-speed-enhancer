/* ================= SOUND SYSTEM ================= */

const sounds = {
    click: new Audio("sounds/click.mp3"),
    combo: new Audio("sounds/combo.mp3"),
    reset: new Audio("sounds/reset.mp3")
};

/* optional: improve performance */
Object.values(sounds).forEach(sound => {
    sound.preload = "auto";
    sound.volume = 1;
});

/* ================= STATE ================= */

let soundEnabled = true;

/* load saved preference */
if (localStorage.getItem("soundEnabled") !== null) {
    soundEnabled = JSON.parse(localStorage.getItem("soundEnabled"));
}

/* ================= PLAY SOUND ================= */

function playSound(name) {
    if (!soundEnabled) return;

    const sound = sounds[name];
    if (!sound) return;

    try {
        sound.currentTime = 0;
        sound.play();
    } catch (err) {
        console.log("Sound blocked:", err);
    }
}

/* ================= TOGGLE SOUND ================= */

function toggleSound() {
    soundEnabled = !soundEnabled;

    localStorage.setItem("soundEnabled", soundEnabled);

    updateSoundButton();
}

/* ================= UI UPDATE ================= */

function updateSoundButton() {
    const btn = document.getElementById("soundBtn");

    if (!btn) return;

    btn.innerText = soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF";
}

/* ================= NAVIGATION HELPER ================= */

function goToPage(page) {
    playSound("click");

    setTimeout(() => {
        window.location.href = page;
    }, 100);
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
    updateSoundButton();
});
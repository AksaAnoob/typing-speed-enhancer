const sounds = {
    click: new Audio("sounds/click.mp3"),
    combo: new Audio("sounds/combo.mp3"),
    reset: new Audio("sounds/reset.mp3")
};

let soundEnabled = true;

function playSound(name) {

    if (!soundEnabled) return;

    const sound = sounds[name];

    if (!sound) return;

    sound.currentTime = 0;
    sound.play();
}

function goToPage(page) {
    playSound("click");

    setTimeout(() => {
        window.location.href = page;
    }, 100);
}
let selectedAvatar = null;

const backendURL = "https://typing-speed-enhancer-1.onrender.com";
const username = localStorage.getItem("username");

document.getElementById("username").innerText =
    username || "Guest";

/* ---------------- AVATAR MAPPER ---------------- */

function getAvatarUrl(seed) {
    return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`;
}

/* ---------------- PROFILE LOAD ---------------- */

fetch(`${backendURL}/profile/${username}`)
.then(res => res.json())
.then(data => {

    document.getElementById("bestWpm").innerText = data.wpm;
    document.getElementById("bestAccuracy").innerText = data.accuracy + "%";
    document.getElementById("bestBurst").innerText = data.burstScore;

    document.getElementById("avatar").src =
        getAvatarUrl(data.avatar || username);

})
.catch(err => console.error("Profile load error:", err));

/* ---------------- MODAL CONTROL ---------------- */

function openAvatarPicker() {
    selectedAvatar = null;

    document.getElementById("avatarModal")
        .classList.remove("hidden");
}

function closeAvatarPicker() {
    document.getElementById("avatarModal")
        .classList.add("hidden");
}

/* ---------------- AVATAR SELECT ---------------- */

function selectAvatar(id, event) {

    selectedAvatar = id;

    document.getElementById("avatar").src =
        getAvatarUrl(id);

    // remove previous highlight
    document.querySelectorAll(".avatar-grid img")
        .forEach(img => img.style.outline = "none");

    // highlight selected
    if (event && event.target) {
        event.target.style.outline = "3px solid #00ffcc";
    }
}

/* ---------------- SAVE AVATAR ---------------- */

function saveAvatar() {

    if (!selectedAvatar) {
        alert("Please select an avatar first!");
        return;
    }

    fetch(`${backendURL}/updateAvatar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            avatar: selectedAvatar
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Avatar updated!");
        closeAvatarPicker();
    })
    .catch(err => console.error("Avatar save error:", err));
}
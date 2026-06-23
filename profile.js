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

function selectAvatar(id) {

    selectedAvatar = id;

    const avatarUrl =
        `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${id}`;

    document.getElementById("avatar").src = avatarUrl;
}

/* ---------------- SAVE AVATAR ---------------- */

function saveAvatar() {

    if (!selectedAvatar) return;

    const avatarUrl =
        `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${selectedAvatar}`;

    fetch(`${backendURL}/updateAvatar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            avatar: avatarUrl   // 🔥 STORE FULL URL
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Avatar updated!");
        closeAvatarPicker();
    });
}
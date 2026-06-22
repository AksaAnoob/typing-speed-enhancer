let selectedAvatar = null;

const backendURL = "https://typing-speed-enhancer-1.onrender.com";
const username = localStorage.getItem("username");

document.getElementById("username").innerText =
    username || "Guest";

/* ---------------- AVATAR MAPPER ---------------- */

function getAvatarUrl(seed) {

    if (!seed) {
        return `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;
    }

    if (seed.startsWith("animal")) {
        return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`;
    }

    if (seed.startsWith("flower")) {
        return `https://api.dicebear.com/7.x/icons/svg?seed=${seed}`;
    }

    if (seed.startsWith("fruit")) {
        return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
    }

    return `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;
}

/* ---------------- PROFILE LOAD ---------------- */

fetch(`${backendURL}/profile/${username}`)
.then(res => res.json())
.then(data => {

    document.getElementById("bestWpm").innerText = data.wpm;
    document.getElementById("bestAccuracy").innerText = data.accuracy + "%";
    document.getElementById("bestBurst").innerText = data.burstScore;

    // avatar load
    document.getElementById("avatar").src =
        getAvatarUrl(data.avatar || username);

})
.catch(err => console.error("Profile load error:", err));

/* ---------------- AVATAR UI ---------------- */

function openAvatarPicker() {
    document.getElementById("avatarModal").classList.remove("hidden");
}

function closeAvatarPicker() {
    document.getElementById("avatarModal").classList.add("hidden");
}

function selectAvatar(id) {
    selectedAvatar = id;

    document.getElementById("avatar").src =
        getAvatarUrl(id);
}

/* ---------------- SAVE AVATAR ---------------- */

function saveAvatar() {

    if (!selectedAvatar) return;

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
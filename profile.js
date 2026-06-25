let selectedAvatar = null;

const backendURL = "https://typing-speed-enhancer-1.onrender.com";
const username = localStorage.getItem("username");

/* ---------------- USERNAME ---------------- */

document.getElementById("username").innerText =
    username || "Guest";

/* ---------------- AVATAR MAPPER ---------------- */

function getAvatarUrl(seed) {
    return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`;
}

/* ---------------- PROFILE LOAD ---------------- */
if (username) {
    fetch(`${backendURL}/profile/${username}`)
        .then(res => res.json())
        .then(data => {

    console.log("PROFILE DATA:", data); // ✅ ADD THIS

    document.getElementById("bestWpm").innerText = data.wpm ?? 0;
    document.getElementById("bestAccuracy").innerText = (data.accuracy ?? 0) + "%";
    document.getElementById("bestBurst").innerText = data.burstScore ?? 0;

    document.getElementById("avatar").src = data.avatar;
})
        .catch(err => console.error(err));
}
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
        getAvatarUrl(id);

    document.getElementById("avatar").src = avatarUrl;
}

/* ---------------- CUSTOM MODAL (REPLACES ALERT) ---------------- */

function showModal(title, message) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalMessage").innerText = message;
    document.getElementById("customModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("customModal").classList.add("hidden");
}

/* ---------------- SAVE AVATAR ---------------- */

function saveAvatar() {

    if (!selectedAvatar) {
        showModal("Oops", "Please select an avatar first!");
        return;
    }

    const avatarUrl = getAvatarUrl(selectedAvatar);

    fetch(`${backendURL}/updateAvatar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            avatar: avatarUrl
        })
    })
    .then(res => res.json())
    .then(() => {
        showModal("Success", "Avatar updated!");
        closeAvatarPicker();
    })
    .catch(() => {
        showModal("Error", "Failed to update avatar. Try again.");
    });
}
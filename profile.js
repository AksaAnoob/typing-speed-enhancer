
let selectedAvatar = null;

const backendURL = "https://typing-speed-enhancer-1.onrender.com";
const username = localStorage.getItem("username");
console.log("CURRENT USERNAME:", localStorage.getItem("username"));
console.log("FETCHING:", `${backendURL}/profile/${username}`);
/* ---------------- USERNAME ---------------- */

document.getElementById("username").innerText =
    username || "Guest";

/* ---------------- PROFILE LOAD ---------------- */

if (username) {

    // ✅ ADD THIS LINE HERE (before fetch result loads)
    document.getElementById("avatar").src =
        "https://api.dicebear.com/7.x/fun-emoji/svg?seed=loading";

    fetch(`${backendURL}/profile/${username}`)
        .then(res => res.json())
        .then(data => {

            console.log("PROFILE DATA:", data);

            document.getElementById("bestWpm").innerText = data.wpm ?? 0;
            document.getElementById("bestAccuracy").innerText = (data.accuracy ?? 0) + "%";
            document.getElementById("bestBurst").innerText = data.burstScore ?? 0;

            // FINAL REAL AVATAR
            document.getElementById("avatar").src =
    data.avatar || getAvatarUrl(username);

        })
        .catch(err => console.error("Profile load error:", err));
}
/* ---------------- MODAL CONTROL ---------------- */

function openAvatarPicker() {
    selectedAvatar = null;
    document.getElementById("avatarModal").classList.remove("hidden");
}

function closeAvatarPicker() {
    document.getElementById("avatarModal").classList.add("hidden");
}

/* ---------------- AVATAR SELECT ---------------- */

function selectAvatar(id) {
    selectedAvatar = id;

    /* preview only */
    document.getElementById("avatar").src =
        `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${id}`;
}

/* ---------------- SAVE AVATAR ---------------- */

function saveAvatar() {

    if (!selectedAvatar) {
        showModal("Oops", "Please select an avatar first!");
        return;
    }

    const avatarUrl =
        `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${selectedAvatar}`;

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

        /* ✅ instantly reflect saved avatar */
        document.getElementById("avatar").src = avatarUrl;
    })
    .catch(() => {
        showModal("Error", "Failed to update avatar. Try again.");
    });
}

/* ---------------- CUSTOM MODAL ---------------- */

function showModal(title, message) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalMessage").innerText = message;
    document.getElementById("customModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("customModal").classList.add("hidden");
}
let selectedAvatar = null;

const backendURL = "https://typing-speed-enhancer-1.onrender.com/profile/${username}";

const username = localStorage.getItem("username");

document.getElementById("username").innerText =
    username || "Guest";

/* ---------------- PROFILE LOAD ---------------- */

fetch(`${backendURL}/profile/${username}`)
.then(res => res.json())
.then(data => {

    document.getElementById("bestWpm").innerText = data.wpm;
    document.getElementById("bestAccuracy").innerText = data.accuracy + "%";
    document.getElementById("bestBurst").innerText = data.burstScore;

    // avatar load
    if (data.avatar) {
        document.getElementById("avatar").src =
            `https://api.dicebear.com/7.x/initials/svg?seed=${data.avatar}`;
    } else {
        document.getElementById("avatar").src =
            `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;
    }

})
.catch(err => console.error(err));

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
        `https://api.dicebear.com/7.x/identicon/svg?seed=${id}`;
}

/* ---------------- SAVE TO BACKEND ---------------- */

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
    .catch(err => console.error(err));
}
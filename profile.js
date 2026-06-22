let selectedAvatar = null;

const username = localStorage.getItem("username");

document.getElementById("username").innerText =
    username || "Guest";

// load profile data
fetch(`http://localhost:5000/profile/${username}`)
.then(res => res.json())
.then(data => {

    document.getElementById("bestWpm").innerText = data.wpm;
    document.getElementById("bestAccuracy").innerText = data.accuracy + "%";
    document.getElementById("bestBurst").innerText = data.burstScore;

    // load avatar if exists
    if (data.avatar) {
        document.getElementById("avatar").src = "avatars/" + data.avatar;
    }

})
.catch(err => console.error(err));

/* AVATAR FUNCTIONS */

function openAvatarPicker() {
    document.getElementById("avatarModal").classList.remove("hidden");
}

function closeAvatarPicker() {
    document.getElementById("avatarModal").classList.add("hidden");
}

function selectAvatar(img) {
    selectedAvatar = img;
    document.getElementById("avatar").src = "avatars/" + img;
}

function saveAvatar() {

    if (!selectedAvatar) return;

    fetch("http://localhost:5000/updateAvatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            avatar: selectedAvatar
        })
    })
    .then(res => res.text())
    .then(msg => {
        alert("Avatar updated!");
        closeAvatarPicker();
    })
    .catch(err => console.error(err));
}
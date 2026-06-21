const username = localStorage.getItem("username");

document.getElementById("username").innerText =
    username || "Guest";

fetch(`http://localhost:5000/profile/${username}`)
.then(res => res.json())
.then(data => {

    document.getElementById("bestWpm").innerText =
        data.wpm;

    document.getElementById("bestAccuracy").innerText =
        data.accuracy + "%";

    document.getElementById("bestBurst").innerText =
        data.burstScore;
})
.catch(err => console.error(err));
const currentUser =
    localStorage.getItem("username");

fetch("http://localhost:5000/burst-leaderboard")
.then(res => res.json())
.then(data => {

    let html = `
        <table>
            <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
            </tr>
    `;

    data.forEach((player, index) => {

        let rank;

        if (index === 0) rank = "🥇";
        else if (index === 1) rank = "🥈";
        else if (index === 2) rank = "🥉";
        else rank = index + 1;

        let rowClass = "";

        if (player.username === currentUser) {
            rowClass = "current-user";
        }

        html += `
            <tr class="${rowClass}">
                <td>${rank}</td>
                <td>${player.username}</td>
                <td>${player.score}</td>
            </tr>
        `;
    });

    html += "</table>";

    document.getElementById("leaderboard").innerHTML = html;
})
.catch(err => console.error(err));
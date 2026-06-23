const currentUser =
    localStorage.getItem("username");

/* ---------- AVATAR URL HELPER ---------- */


/* ---------- LOAD LEADERBOARD ---------- */

fetch("https://typing-speed-enhancer-1.onrender.com/burst-leaderboard")
.then(res => res.json())
.then(data => {

    let html = `
        <table>
            <tr>
                <th>Rank</th>
                <th>Player</th>
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

                <td style="display:flex;align-items:center;gap:10px;">

    <img
        src="${player.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=guest'}"
        width="40"
        height="40"
        style="border-radius:50%"
    >

    ${player.username}
</td>

                <td>${player.score}</td>
            </tr>
        `;
    });

    html += "</table>";

    document.getElementById("leaderboard").innerHTML = html;
})
.catch(err => console.error(err));
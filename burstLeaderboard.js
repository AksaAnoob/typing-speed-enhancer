const currentUser = localStorage.getItem("username");

/* ---------- LOAD LEADERBOARD ---------- */

fetch("https://typing-speed-enhancer-1.onrender.com/burst-leaderboard")
.then(res => res.json())
.then(data => {

    const container = document.getElementById("leaderboard");

    /* ---------- FIX: TIE SAFE RANKING ---------- */
    let rank = 1;

    for (let i = 0; i < data.length; i++) {

        if (i > 0 && data[i].score < data[i - 1].score) {
            rank = i + 1;
        }

        data[i].rank = rank;
    }

    /* ---------- BUILD TABLE ---------- */

    let html = `
        <table>
            <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
            </tr>
    `;

    data.forEach(player => {

        let rowClass = "";

        if (player.username === currentUser) {
            rowClass = "current-user";
        }

        let displayRank =
            player.rank === 1 ? "🥇" :
            player.rank === 2 ? "🥈" :
            player.rank === 3 ? "🥉" :
            player.rank;

        html += `
            <tr class="${rowClass}">
                <td>${displayRank}</td>

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

    container.innerHTML = html;
})
.catch(err => console.error(err));
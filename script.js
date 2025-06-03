const clickBtn = document.getElementById("clickBtn");
const startBtn = document.getElementById("startBtn");
const timer = document.getElementById("timer");
const clicks = document.getElementById("clicks");
const usernameInput = document.getElementById("username");
const timeSelect = document.getElementById("timeSelect");
const rankingList = document.getElementById("ranking");
const rankTime = document.getElementById("rankTime");

let clickCount = 0;
let timeLeft = 0;
let timerInterval;
let currentTime = 5;
let isTimerRunning = false;

function getRankingKey() {
    return `ranking-${currentTime}`;
}

function loadRanking() {
    const ranking = JSON.parse(localStorage.getItem(getRankingKey())) || [];
    rankingList.innerHTML = '';
    ranking.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name}: ${item.score} cliques`;
        rankingList.appendChild(li);
    });
}

function saveRanking(name, score) {
    const key = getRankingKey();
    const ranking = JSON.parse(localStorage.getItem(key)) || [];
    
    const existing = ranking.find(player => player.name.toLowerCase() === name.toLowerCase());

    if (existing) {
        if (score > existing.score) {
            existing.score = score;
        }
    } else {
        ranking.push({ name, score });
    }

    ranking.sort((a, b) => b.score - a.score);
    const top5 = ranking.slice(0, 5);
    localStorage.setItem(key, JSON.stringify(top5));
}

startBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    currentTime = parseInt(timeSelect.value);
    rankTime.textContent = currentTime;

    if (username === "") {
        alert("Digite seu nome!");
        return;
    }

    clickCount = 0;
    timeLeft = currentTime;
    isTimerRunning = false;

    clicks.textContent = `Cliques: ${clickCount}`;
    timer.textContent = `Tempo: ${timeLeft}s`;

    clickBtn.disabled = false;
    startBtn.disabled = true;
    usernameInput.disabled = true;
    timeSelect.disabled = true;
});

function startTimer() {
    isTimerRunning = true;
    timerInterval = setInterval(() => {
        timeLeft--;
        timer.textContent = `Tempo: ${timeLeft}s`;

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            clickBtn.disabled = true;
            startBtn.disabled = false;
            usernameInput.disabled = false;
            timeSelect.disabled = false;

            const username = usernameInput.value.trim();
            saveRanking(username, clickCount);
            loadRanking();
            alert(`⏱️ Tempo esgotado!\nVocê fez ${clickCount} cliques.`);
        }
    }, 1000);
}

clickBtn.addEventListener("click", () => {
    if (!isTimerRunning) {
        startTimer();
    }
    clickCount++;
    clicks.textContent = `Cliques: ${clickCount}`;
});

timeSelect.addEventListener('change', () => {
    currentTime = parseInt(timeSelect.value);
    rankTime.textContent = currentTime;
    loadRanking();
});

window.addEventListener("load", () => {
    currentTime = parseInt(timeSelect.value);
    rankTime.textContent = currentTime;
    loadRanking();
});

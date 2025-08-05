const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

let startTime, timerInterval;

function generateCode() {
    let code = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
}

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    let countdown = 3;
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = countdown;

    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            startChallenge();
        }
    }, 1000);
}

function startChallenge() {
    const code = generateCode();
    document.getElementById('code-display').textContent = code;
    document.getElementById('code-input').value = '';
    document.getElementById('code-input').focus();

    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        document.getElementById('timer').textContent = `Time: ${elapsed.toFixed(2)}s`;
    }, 100);

    document.getElementById('code-input').addEventListener('input', function (e) {
        this.value = this.value.toUpperCase();
    });

    document.getElementById('code-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitCode();
    });
    document.getElementById('submit-button').addEventListener('click', submitCode);
}

function submitCode() {
    const userInput = document.getElementById('code-input').value.toUpperCase();
    const codeDisplay = document.getElementById('code-display').textContent;

    if (userInput === codeDisplay) {
        clearInterval(timerInterval);
        const elapsedTime = (Date.now() - startTime) / 1000;
        showResult(elapsedTime);
    } else {
        alert('Incorrect code! Try again.');
    }
}

function showResult(time) {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('result-time').textContent = time.toFixed(2);

    let times = JSON.parse(localStorage.getItem('bestTimes')) || [];
    times.push(time.toFixed(2));
    times.sort((a, b) => a - b);
    times = times.slice(0, 5);
    localStorage.setItem('bestTimes', JSON.stringify(times));
    updateRanking();

    document.getElementById('share-button').onclick = () => {
        const tweetText = `I just typed the code in ${time.toFixed(2)}s on the EthOS Training Game! Try to beat me 👇 #EthOS`;
        const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent('https://ethereum-os-game.vercel.app')}`;
        window.open(tweetUrl, '_blank');
    };
}

function updateRanking() {
    const times = JSON.parse(localStorage.getItem('bestTimes')) || [];
    const rankingElement = document.getElementById('ranking');
    rankingElement.innerHTML = '<h3>Top 5 Times:</h3>';
    times.forEach((time, index) => {
        if (index < 5) {
            rankingElement.innerHTML += `<p>${index + 1}. ${time}s</p>`;
        }
    });
}

function tryAgain() {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    updateRanking();
}

document.getElementById('start-mini-game-button').addEventListener('click', startGame);
document.getElementById('try-again-button').addEventListener('click', tryAgain);
document.getElementById('share-button').addEventListener('click', () => {
    document.getElementById('share-button').onclick();
});

updateRanking();

// Função para criar a chuva de logos
function createFallingLogo() {
    const logo = document.createElement('img');
    logo.src = 'assets/logo.png';
    logo.className = 'falling-logo';
    logo.style.left = Math.random() * 100 + 'vw';
    logo.style.animationDuration = (Math.random() * 5 + 5) + 's';
    document.body.appendChild(logo);

    logo.addEventListener('animationend', () => {
        logo.remove();
    });
}

setInterval(createFallingLogo, 500);
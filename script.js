document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusDiv = document.querySelector('.status');
    const resetButton = document.querySelector('.reset-button');
    const homeButtons = document.querySelectorAll('.home-button');
    const modeButtons = document.querySelectorAll('.mode-button');
    const playerButtons = document.querySelectorAll('.player-button');
    const setupScreen = document.querySelector('.setup-screen');
    const playerSelection = document.querySelector('.player-selection');
    const gameScreen = document.querySelector('.game-screen');
    
    let currentPlayer = 'x';
    let board = Array(9).fill(null);
    let gameActive = false;
    let playerMode = '';
    let playerChoice = 'x';
    let computerPlayer = 'o';

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    function checkWinner() {
        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return board.every(cell => cell !== null) ? 'draw' : null;
    }

    function handleClick(event) {
        const index = event.target.dataset.index;

        if (board[index] || !gameActive) return;

        board[index] = currentPlayer;
        event.target.classList.add(currentPlayer);
        event.target.textContent = currentPlayer.toUpperCase();

        const result = checkWinner();
        if (result) {
            endGame(result);
        } else {
            switchPlayer();
            if (playerMode === 'player-vs-computer' && currentPlayer === computerPlayer) {
                setTimeout(computerPlay, 500);
            }
        }
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    }

    function endGame(result) {
        gameActive = false;
        statusDiv.textContent = result === 'draw' ? "It's a draw!" : `${result.toUpperCase()} wins!`;
    }

    function computerPlay() {
        const availableMoves = board.map((value, index) => value === null ? index : null).filter(value => value !== null);
        if (availableMoves.length > 0) {
            const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            board[randomIndex] = computerPlayer;
            const cell = cells[randomIndex];
            cell.classList.add(computerPlayer);
            cell.textContent = computerPlayer.toUpperCase();

            const result = checkWinner();
            if (result) {
                endGame(result);
            } else {
                switchPlayer();
            }
        }
    }

    function resetGame() {
        board = Array(9).fill(null);
        cells.forEach(cell => {
            cell.classList.remove('x', 'o');
            cell.textContent = '';
            cell.addEventListener('click', handleClick, { once: true });
        });
        gameActive = true;
        currentPlayer = playerChoice;
        statusDiv.textContent = `${currentPlayer.toUpperCase()}'s turn`;
    }

    function startGame() {
        resetGame();
        setupScreen.classList.add('hidden');
        playerSelection.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    }

    function setPlayerChoice(event) {
        playerChoice = event.target.dataset.player;
        computerPlayer = playerChoice === 'x' ? 'o' : 'x';
        currentPlayer = playerChoice;
        startGame();
    }

    function setGameMode(event) {
        playerMode = event.target.dataset.mode;
        setupScreen.classList.add('hidden');
        playerSelection.classList.remove('hidden');
    }

    function goHome() {
        setupScreen.classList.remove('hidden');
        playerSelection.classList.add('hidden');
        gameScreen.classList.add('hidden');
    }

    cells.forEach(cell => cell.addEventListener('click', handleClick, { once: true }));
    resetButton.addEventListener('click', resetGame);
    playerButtons.forEach(button => button.addEventListener('click', setPlayerChoice));
    modeButtons.forEach(button => button.addEventListener('click', setGameMode));
    homeButtons.forEach(button => button.addEventListener('click', goHome));
});

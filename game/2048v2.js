import { formatNumber } from '../clicker.js';

export function startGame(container) {
  container.innerHTML = `
    <div id="score">Счёт: 0</div>
    <div id="game-field"></div>
    <button id="restart-btn">Заново</button><br />
  `;
let bankMultiplier = Number(localStorage.getItem('bankMultiplier')) || 1;
  const fieldSize = 4;
  let gameField = Array(fieldSize * fieldSize).fill(null);
  let selectedCellIndex = null;
  let moveCount = 0;

  const scoreElem = container.querySelector("#score");
  const gameFieldElem = container.querySelector("#game-field");
  const restartBtn = container.querySelector("#restart-btn");

  function renderField() {
    gameFieldElem.innerHTML = "";
    gameField.forEach((value, i) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("data-index", i);
      if (value !== null) {
        cell.setAttribute("data-value", value);
        cell.textContent = value;
      }
      gameFieldElem.appendChild(cell);
    });
  }

  function spawnRandomBlock() {
    const emptyCells = gameField.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
    if (emptyCells.length > 0) {
      const index = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      gameField[index] = 2;
      renderField();
    }
  }

  let maxTile = 0;

function updateScore() {
  const currentMax = Math.max(...gameField.filter(Boolean));
  if (currentMax > maxTile) {
    const delta = currentMax - maxTile;
    localStorage.setItem('bl2048', (Number(localStorage.getItem('bl2048')) || 0) + delta *bankMultiplier);
    maxTile = currentMax;
  }
  scoreElem.textContent = `Счёт: ${formatNumber(currentMax *bankMultiplier)}`;
}

  gameFieldElem.addEventListener("click", (e) => {
    const index = parseInt(e.target.getAttribute("data-index"));
    if (isNaN(index)) return;

    if (selectedCellIndex === null) {
      if (gameField[index] !== null) {
        selectedCellIndex = index;
        e.target.classList.add("selected");
      }
    } else {
      const from = selectedCellIndex;
      const to = index;
      const fromValue = gameField[from];
      const toValue = gameField[to];

      container.querySelector(`[data-index="${from}"]`).classList.remove("selected");

      if (from !== to) {
        if (toValue === null) {
          gameField[to] = fromValue;
          gameField[from] = null;
          moveCount++;
        } else if (fromValue === toValue) {
          gameField[to] *= 2;
          gameField[from] = null;
          moveCount++;
        }
      }

      selectedCellIndex = null;
      renderField();
      updateScore();

      if (moveCount % 2 === 0) {
        spawnRandomBlock();
        updateScore();
      }
    }
  });

  restartBtn.addEventListener("click", () => {
    initGame();
  });

  function initGame() {
    gameField.fill(null);
    moveCount = 0;
    selectedCellIndex = null;
    for (let i = 0; i < 4; i++) {
      spawnRandomBlock();
    }
    renderField();
    updateScore();
  }

  initGame();
}

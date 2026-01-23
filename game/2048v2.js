import { formatNumber } from '../clicker.js';

export function startGame(container) {
  container.innerHTML = `
    <div id="score">Счёт: 0</div>
    <div id="game-field"></div>
    <button id="restart-btn">Заново</button>
  `;
  
  let bankMultiplier = Number(localStorage.getItem('bankMultiplier')) || 1;

  const fieldSize = 4;
  let gameField = Array(fieldSize * fieldSize).fill(null);
  let selectedCellIndex = null;
  let moveCount = 0;

  const scoreElem = container.querySelector("#score");
  const gameFieldElem = container.querySelector("#game-field");
  const restartBtn = container.querySelector("#restart-btn");

  let restartClickCount = 0;
  let restartClickTimer = null;
  let autoPlayInterval = null;

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
    const emptyCells = gameField
      .map((v, i) => (v === null ? i : -1))
      .filter(i => i !== -1);

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
      localStorage.setItem(
        'bl2048',
        (Number(localStorage.getItem('bl2048')) || 0) + delta * bankMultiplier
      );
      maxTile = currentMax;
    }
    scoreElem.textContent = `Счёт: ${formatNumber(currentMax * bankMultiplier)}`;
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

      container
        .querySelector(`[data-index="${from}"]`)
        .classList.remove("selected");

      if (from !== to) {
        let moved = false;

        if (toValue === null) {
          gameField[to] = fromValue;
          gameField[from] = null;
          moved = true;
        } else if (fromValue === toValue) {
          gameField[to] *= 2;
          gameField[from] = null;
          moved = true;
        }

        if (moved) {
          renderField();
          updateScore();
          ensureTwoTwos();
          renderField();
          updateScore();
        }
      }

      selectedCellIndex = null;
    }
  });

  function ensureTwoTwos() {
    let twos = gameField.filter(v => v === 2).length;
    if (twos >= 2) return;

    let needToAdd = 2 - twos;

    const emptyCells = gameField
      .map((v, i) => (v === null ? i : null))
      .filter(i => i !== null);

    needToAdd = Math.min(needToAdd, emptyCells.length);

    for (let i = 0; i < needToAdd; i++) {
      const randomIndex =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      gameField[randomIndex] = 2;
      emptyCells.splice(emptyCells.indexOf(randomIndex), 1);
    }
  }

  function startAutoPlay() {
  stopAutoPlay();
  initGame();

  const snakePath = [
    12,13,14,15,11,10,9,8,4,5,6,7,3,2,1,0
  ];

  autoPlayInterval = setInterval(() => {

if (!container.querySelector('#game-field')) {
  stopAutoPlay();
  return;
}

    let moved = false;
    let mergedThisTurn = new Array(gameField.length).fill(false);

    for (let targetIndex of snakePath) {
      if (gameField[targetIndex] === null) continue;

      for (let i = 0; i < gameField.length; i++) {
        if (i === targetIndex || gameField[i] === null) continue;

        if (gameField[targetIndex] === null) {
          gameField[targetIndex] = gameField[i];
          gameField[i] = null;
          moved = true;
          break;
        }

        if (
          gameField[i] === gameField[targetIndex] &&
          !mergedThisTurn[targetIndex] &&
          !mergedThisTurn[i] &&
          gameField[targetIndex] < 256
        ) {
          const newValue = gameField[targetIndex] * 2;
          if (newValue <= 256) {
            gameField[targetIndex] = newValue;
            gameField[i] = null;
            mergedThisTurn[targetIndex] = true;
            moved = true;
          }
          break;
        }
      }
    }

    ensureTwoTwos();       
    renderField();          
    updateScore();          

    const hasEmpty = gameField.includes(null);
    if (!moved && !hasEmpty) {
      return;
    }

  }, 512);
}




  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  restartBtn.addEventListener("click", () => {
    restartClickCount++;

    if (restartClickTimer) clearTimeout(restartClickTimer);

    restartClickTimer = setTimeout(() => {
      restartClickCount = 0;
    }, 1500);

    if (restartClickCount >= 3) {
      restartClickCount = 0;
      startAutoPlay();
      return;
    }

    stopAutoPlay();
    initGame();
  });

  function initGame() {
    gameField.fill(null);
    moveCount = 0;
    selectedCellIndex = null;
    maxTile = 0;

    for (let i = 0; i < 2; i++) {
      spawnRandomBlock();
    }

    renderField();
    updateScore();
  }

  initGame();
}
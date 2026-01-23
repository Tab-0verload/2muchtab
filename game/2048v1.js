// Этот модуль экспортирует функцию startGame(gameContent)
import { formatNumber } from '../clicker.js';

export function startGame(container) {
  container.innerHTML = `
    <div class="board" id="board"></div>
    <div class="info" id="move-info">Возможных ходов: 0</div>
    <div class="info" id="score-info">Очки: 0</div>
    <button class="button" id="new-game-btn">Новая игра</button>
  `;

let bankMultiplier = Number(localStorage.getItem('bankMultiplier')) || 1;

const strategyBtn = document.createElement('button');
strategyBtn.textContent = 'Улучшить';
strategyBtn.className = 'button';
container.appendChild(strategyBtn);

let currentPathLength = 0;

strategyBtn.addEventListener('click', () => {
    currentPathLength++;

    if (currentPathLength >= 9) {
        strategyBtn.textContent = `Улучшено x0`;
        currentPathLength-= 9;
    } else {
        strategyBtn.textContent = `Улучшено x${currentPathLength}`;
    }
});


  
  const board = container.querySelector('#board');
  const newGameBtn = container.querySelector('#new-game-btn');
  const moveInfo = container.querySelector('#move-info');
  const scoreInfo = container.querySelector('#score-info');
  let tiles = [];
  const size = 4;
  let score = 0;

  function createTiles() {
    tiles = Array(16).fill(2);
    score = 0;
    render();
    updateMoveInfo();
    updateScoreInfo();
  }

  function render() {
    board.innerHTML = '';
    tiles.forEach((n, i) => {
      const tile = document.createElement('div');
      tile.className = 'tile';
      if (n !== 0) tile.textContent = n;
      tile.classList.add(`tile-${n}`);
      tile.addEventListener('click', () => selectTile(i));
      board.appendChild(tile);
    });
  }

  function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / size);
    const col = index % size;
    if (col > 0) neighbors.push(index - 1);
    if (col < size - 1) neighbors.push(index + 1);
    if (row > 0) neighbors.push(index - size);
    if (row < size - 1) neighbors.push(index + size);
    return neighbors;
  }

  function selectTile(index) {
    
    const neighbors = getNeighbors(index);
    const selectedValue = tiles[index];
    const match = neighbors.find(i => tiles[i] === selectedValue);

    if (match !== undefined) {
  tiles[match] *= 2;
  tiles[index] = 2;

  const highestTile = Math.max(...tiles);
  score = highestTile * bankMultiplier;

  const delta = score - (window.prevScore || 0);
  if (delta > 0) {
    localStorage.setItem('bl15', (Number(localStorage.getItem('bl15')) || 0) + delta);
  }

  window.prevScore = score;
      render();
      updateMoveInfo();
      updateScoreInfo();
    }
  }

  function countPossibleMoves() {
    let possibleMoves = 0;
    for (let i = 0; i < tiles.length; i++) {
      const neighbors = getNeighbors(i);
      const value = tiles[i];
      for (const n of neighbors) {
        if (tiles[n] === value) {
          possibleMoves++;
          break;
        }
      }
    }
    return possibleMoves;
  }

  function updateMoveInfo() {
    moveInfo.textContent = `Возможных ходов: ${countPossibleMoves()}`;
  }

  function updateScoreInfo() {
    scoreInfo.textContent = `Очки: ${formatNumber(score)}`;
  }

  newGameBtn.addEventListener('click', createTiles);


const pathSteps = [12,8,4,0,1,5,9,13];

function autoPlay() {
  const path = pathSteps.slice(0, currentPathLength);
  let moved = false;

  for (const target of path) {
    const neighbors = getNeighbors(target);

    for (const neighbor of neighbors) {
      if (tiles[neighbor] === tiles[target]) {
        selectTile(neighbor);
        moved = true;
        break;
      }
    }

    if (moved) break;
  }

  if (board.isConnected) {
  setTimeout(autoPlay, 256);
}
}


  
  createTiles();
  autoPlay();
}

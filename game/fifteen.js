export function startGame(container) {
  container.innerHTML = `
    <div class="board15" id="board15"></div>
    <button class="btn15" id="new-game-btn">Новая игра</button>
    <div class="result15" id="game-message"></div>
  `;

let bankMultiplier = Number(localStorage.getItem('bankMultiplier')) || 1;

  const board = document.getElementById('board15');
const newGameBtn = document.getElementById('new-game-btn');
const gameMessage = document.getElementById('game-message');
let gameStarted = false;
let tiles = [];
const size = 6;

// Создаём решённое поле
function createSolvedTiles() {
  return [...Array(15).keys()].map(n => n + 1).concat(0);
}

// Перемешиваем поле честными ходами
function shuffleTiles(steps = 200) {
  let emptyIndex = tiles.indexOf(0);

  for (let i = 0; i < steps; i++) {
    const [er, ec] = [Math.floor(emptyIndex / size), emptyIndex % size];
    const neighbors = [];

    if (er > 0) neighbors.push(emptyIndex - size);
    if (er < size - 1) neighbors.push(emptyIndex + size);
    if (ec > 0) neighbors.push(emptyIndex - 1);
    if (ec < size - 1) neighbors.push(emptyIndex + 1);

    const moveTo = neighbors[Math.floor(Math.random() * neighbors.length)];
    [tiles[emptyIndex], tiles[moveTo]] = [tiles[moveTo], tiles[emptyIndex]];
    emptyIndex = moveTo;
  }
}

// Отрисовка
function render() {
  board.innerHTML = '';
  tiles.forEach((n, i) => {
    const tile = document.createElement('div');
    tile.className = 'tile15' + (n === 0 ? ' empty15' : '');
    if (n !== 0) tile.textContent = n;
    tile.addEventListener('click', () => move(i));
    board.appendChild(tile);
  });
}

// Двигаем плитку, если она рядом с пустой
function move(index) {
  const emptyIndex = tiles.indexOf(0);
  const [er, ec] = [Math.floor(emptyIndex / size), emptyIndex % size];
  const [r, c] = [Math.floor(index / size), index % size];

  if (Math.abs(er - r) + Math.abs(ec - c) === 1) {
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    render();
    if (isSolved() && gameStarted) {
  gameMessage.textContent = "Поздравляем, вы победили!";
  gameStarted = false; // блокируем повторную победу
  localStorage.setItem('bl15', (Number(localStorage.getItem('bl15')) || 0) + 2048* bankMultiplier);
}
  }
}

// Проверка на победу
function isSolved() {
  for (let i = 0; i < 15; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[15] === 0;
}

// Инициализация
function startGame() {
  tiles = createSolvedTiles();
  render();
}

// Перемешивание по нажатию
newGameBtn.addEventListener('click', () => {
  tiles = createSolvedTiles();
  shuffleTiles();
  render();
  gameMessage.textContent = "";
  gameStarted = true; // игра началась
});

// Запуск при загрузке
startGame();
        }

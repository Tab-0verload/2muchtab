import { formatNumber } from '../clicker.js';

export function startGame(container) {
  const size = 6;
  let types = ["₿", "$", "€", "¥", "£", "₹"];
  const board = [];
  let score = 0;
  let first = null;

  container.innerHTML = `
    <div id="score3">Очки: 0</div>
    <div id="board3"></div>
    <button id="resetBtn3a">Сменить пак</button>
    <button id="resetBtn3">Перезапустить поле</button>
  `;
const emojiPacks = [
      types, // твой начальный набор
      ["\u{1F345}", "\u{1F336}", "\u{1F966}", "\u{1F33D}", "\u{1F952}", "\u{1F344}"], // овощи
      ["\u{1F697}", "\u{1F695}", "\u{1F68C}", "\u{1F6F5}", "\u{1F6B2}", "\u{1F3CD}"],  // транспорт
      ["\u{1F98A}", "\u{1F42F}", "\u{1F436}", "\u{1F431}", "\u{1F981}", "\u{1F99C}"], // животные
      ["\u{26BD}", "\u{1F3C0}", "\u{1F3BE}", "\u{1F3D0}", "\u{1F3C8}", "\u{1F94A}"],  // спорт
      ["\u{1F347}", "\u{1F34D}", "\u{1F34E}", "\u{1F34F}", "\u{1F965}", "\u{1F95D}"] // фрукты
      ]
      
    let packIndex = 0;


  
  let bankMultiplier = Number(localStorage.getItem('bankMultiplier')) || 1;

  const boardDiv = container.querySelector("#board3");
  const scoreDiv = container.querySelector("#score3");
  const resetBtn = container.querySelector("#resetBtn3");

  function randFruit() {
    return types[Math.floor(Math.random() * types.length)];
  }

  function createBoard() {
    for (let y = 0; y < size; y++) {
      board[y] = [];
      for (let x = 0; x < size; x++) {
        let fruit;
        do {
          fruit = randFruit();
        } while (createsMatch(x, y, fruit));
        board[y][x] = fruit;
      }
    }
  }

  function createsMatch(x, y, fruit) {
    return (
      x >= 2 && board[y][x - 1] === fruit && board[y][x - 2] === fruit
    ) || (
      y >= 2 && board[y - 1][x] === fruit && board[y - 2][x] === fruit
    );
  }

  function drawBoard() {
    boardDiv.innerHTML = "";
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const fruit = board[y][x];
        const cell = document.createElement("div");
        cell.className = "cell3";
        cell.textContent = fruit;
        cell.dataset.x = x;
        cell.dataset.y = y;
        cell.classList.add(fruit);
        cell.addEventListener("click", onClick);
        addSwipeEvents(cell);
        boardDiv.appendChild(cell);
      }
    }
  }

  function onClick(e) {
    const x = +e.target.dataset.x;
    const y = +e.target.dataset.y;
    if (!first) {
      first = { x, y };
      e.target.classList.add("selected");
    } else {
      const dx = Math.abs(first.x - x);
      const dy = Math.abs(first.y - y);
      const prev = boardDiv.querySelector(".selected");
      if (prev) prev.classList.remove("selected");
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        swap(first.x, first.y, x, y);
        if (checkMatches().length === 0) {
          swap(first.x, first.y, x, y);
        } else {
          runMatches();
        }
      }
      first = null;
    }
  }

  function swap(x1, y1, x2, y2) {
    [board[y1][x1], board[y2][x2]] = [board[y2][x2], board[y1][x1]];
    drawBoard();
  }

  function checkMatches() {
    const matches = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size - 2; x++) {
        const f = board[y][x];
        if (f && f === board[y][x + 1] && f === board[y][x + 2]) {
          matches.push([x, y], [x + 1, y], [x + 2, y]);
        }
      }
    }
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size - 2; y++) {
        const f = board[y][x];
        if (f && f === board[y + 1][x] && f === board[y + 2][x]) {
          matches.push([x, y], [x, y + 1], [x, y + 2]);
        }
      }
    }
    return Array.from(new Set(matches.map(JSON.stringify))).map(JSON.parse);
  }

  function runMatches() {
    const matches = checkMatches();
    if (matches.length === 0) return;
    matches.forEach(([x, y]) => (board[y][x] = null));
    score += matches.length *bankMultiplier;
    localStorage.setItem('blm3', (Number(localStorage.getItem('blm3')) || 0) + matches.length *bankMultiplier);
    scoreDiv.textContent = `Очки: ${formatNumber(score)}`;
    collapseBoard();
    setTimeout(() => {
      refillBoard();
      drawBoard();
      runMatches();
    }, 300);
  }

  function collapseBoard() {
    for (let x = 0; x < size; x++) {
      for (let y = size - 1; y >= 0; y--) {
        if (!board[y][x]) {
          for (let k = y - 1; k >= 0; k--) {
            if (board[k][x]) {
              board[y][x] = board[k][x];
              board[k][x] = null;
              break;
            }
          }
        }
      }
    }
  }

  function refillBoard() {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!board[y][x]) {
          board[y][x] = randFruit();
        }
      }
    }
  }

  function addSwipeEvents(cell) {
    let startX, startY;
    cell.addEventListener("touchstart", e => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    });

    cell.addEventListener("touchend", e => {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (Math.max(absX, absY) < 20) return;

      const x = +cell.dataset.x;
      const y = +cell.dataset.y;

      let nx = x, ny = y;
      if (absX > absY) {
        nx += dx > 0 ? 1 : -1;
      } else {
        ny += dy > 0 ? 1 : -1;
      }

      if (nx >= 0 && ny >= 0 && nx < size && ny < size) {
        swap(x, y, nx, ny);
        if (checkMatches().length === 0) {
          setTimeout(() => swap(x, y, nx, ny), 300);
        } else {
          runMatches();
        }
      }
    });
  }

  resetBtn.addEventListener("click", () => {
    createBoard();
    drawBoard();
    runMatches();
  });

  resetBtn3a.addEventListener("click", () => {
  packIndex = (packIndex + 1) % emojiPacks.length;
  types = emojiPacks[packIndex];
  createBoard();
  drawBoard();
  runMatches();
});

  createBoard();
  drawBoard();
  runMatches();
}

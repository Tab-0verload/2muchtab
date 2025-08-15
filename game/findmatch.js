import {formatNumber} from '../clicker.js';

export function startGame(container) {
  container.innerHTML = `
    <div class="mg-wrapper">
      <div class="mg-grid" id="mg-grid"></div>
      <div class="mg-buttons">
        <button id="mg-newGame">Новая игра</button>
        <button id="mg-changeTheme">Сменить тему</button>
      </div>
      <div>Очки: <span id="mg-score">0</span></div>
      <div id="mg-message"></div>
    </div>
  `;

  initFirstView();
}

// ===== Темы смайлов =====
const themes = [
  [ "\u{1F436}", "\u{1F431}", "\u{1F42D}", "\u{1F42F}", "\u{1F43B}", "\u{1F418}", "\u{1F43A}", "\u{1F989}" ],
  [ "\u{1F34E}", "\u{1F353}", "\u{1F352}", "\u{1F34A}", "\u{1F347}", "\u{1F349}", "\u{1F34D}", "\u{1F96D}" ],
  [ "\u{2600}", "\u{2601}", "\u{2744}", "\u{1F327}", "\u{1F30A}", 
    "\u{1F32C}", "\u{1F525}", "\u{1F4A7}" ]
];

let currentThemeIndex = 0;
let cards = [];
let firstCard = null;
let lockBoard = false;
let score = 0;

// Функция для добавления очков в localStorage
function addScoreToLocalStorage(newPoints) {
  const key = "bl15"; // ключ, который ты используешь для всех игр
  let current = parseInt(localStorage.getItem(key)) || 0; // берём текущие очки или 0
  current += newPoints; // прибавляем новые очки
  localStorage.setItem(key, current); // записываем обратно
}

// ===== Логика =====
function createCards(shuffle = false, faceUp = false) {
  const theme = themes[currentThemeIndex];
  const doubled = [...theme, ...theme];

  if (shuffle) {
    for (let i = doubled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
    }
  }

  cards = doubled.map((emoji, index) => ({
    id: index,
    emoji,
    matched: false,
    flipped: faceUp
  }));
}

function renderCards() {
  const grid = document.querySelector("#mg-grid");
  grid.innerHTML = "";
  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = `mg-card ${card.flipped ? "mg-flipped" : ""} ${card.matched ? "mg-matched" : ""}`;
    div.textContent = card.flipped || card.matched ? card.emoji : "";
    div.addEventListener("click", () => flipCard(card));
    grid.appendChild(div);
  });
}

function flipCard(card) {
  if (lockBoard || card.flipped || card.matched) return;
  card.flipped = true;
  renderCards();

  if (!firstCard) {
    firstCard = card;
  } else {
    lockBoard = true;
    if (firstCard.emoji === card.emoji) {
      firstCard.matched = true;
      card.matched = true;
      score += 1000;
      addScoreToLocalStorage(1000);
      document.querySelector("#mg-score").textContent = formatNumber(score);
      resetTurn();
    } else {
      setTimeout(() => {
        firstCard.flipped = false;
        card.flipped = false;
        resetTurn();
      }, 800);
    }
  }
}

function resetTurn() {
  firstCard = null;
  lockBoard = false;
  renderCards();
}

// ===== Стартовые режимы =====
function initFirstView() {
  score = 0;
  document.querySelector("#mg-score").textContent = score;
  document.querySelector("#mg-message").textContent = "";
  createCards(false, true); // без перемешивания, лицом вверх
  renderCards();
}

function initNewGame() {
  score = 0;
  document.querySelector("#mg-score").textContent = score;
  document.querySelector("#mg-message").textContent = "";
  createCards(true, false); // перемешать, рубашками
  renderCards();
}

function changeTheme() {
  const oldOrder = cards.map(c => c.id); // сохраняем порядок
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  const theme = themes[currentThemeIndex];
  cards.forEach((c, i) => c.emoji = theme[Math.floor(i % (theme.length))]);
  renderCards();
}

// ===== События =====
document.addEventListener("click", (e) => {
  if (e.target.id === "mg-newGame") {
    initNewGame();
  }
  if (e.target.id === "mg-changeTheme") {
    changeTheme();
  }
});

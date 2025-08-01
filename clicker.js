import * as game1 from './2game/game1.js';
import * as game2 from './2game/game2.js';
import * as shop from './2game/shop.js';
import * as bank from './2game/bank.js';


let balance = Number(localStorage.getItem('balance')) || 0;


function updateBalance() {
  document.getElementById('balance').textContent = `Баланс: ${Math.floor(balance)}`;
  localStorage.setItem('balance', balance);
}


export function getBalance() {
  return balance;
}

export function addBalance(amount) {
  balance += amount;
  updateBalance();
}

export function subtractBalance(amount) {
  if (balance >= amount) {
    balance -= amount;
    updateBalance();
    return true;
  }
  return false;
}

const views = {
  game1,
  game2,
  shop,
  bank,
};

export function startGame(container) {
  container.innerHTML = `
   <header class="hlickg">
    <div class="dclickg" id="balance">Баланс: 0</div>
    <nav class="nclickg">
      <button data-view="game1">Кликер</button>
      <button data-view="game2">Лотерея</button>
      <button data-view="shop">Магазин</button>
      <button data-view="bank">Банк</button>
    </nav>
    <main class="mclickg" id="app"></main>
  </header>
  
  `;
  function updateBalance() {
  const balanceEl = document.getElementById('balance');
  if (balanceEl) {
    balanceEl.textContent = `Баланс: ${Math.floor(balance)}`;
  }
  localStorage.setItem('balance', balance);
}
  
  updateBalance();

document.querySelectorAll('button[data-view]').forEach(btn => {
  btn.addEventListener('click', () => {
    const view = btn.dataset.view;
    const app = document.getElementById('app');
    app.innerHTML = '';
    views[view].render(app);
  });
});

// Загружаем первую сцену
views.game1.render(document.getElementById('app'));
}

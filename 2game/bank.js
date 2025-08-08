import { getBalance, subtractBalance, addBalance } from '../clicker.js';
import { formatNumber } from '../clicker.js';

const duration = 1 * 60 *1000; // 2 минуты

let bankMultiplier = Number(localStorage.getItem('bankMultiplier')) || 1;
let depositLevel = Number(localStorage.getItem('depositLevel')) || 1;

function saveTimers(timers) {
  // Сохраняем только незавершённые
  const filtered = timers.filter(t => !t.claimed);
  localStorage.setItem('bankTimers', JSON.stringify(filtered));
}

function loadTimers() {
  // Загружаем и убираем старые завершённые/забранные
  let stored = JSON.parse(localStorage.getItem('bankTimers')) || [];
  return stored.filter(t => !t.claimed && typeof t.start === 'number');
}

function getDepositOptions() {
  const base = depositLevel * 100;
  return [
    { amount: base, rate: 0.25 },
    { amount: base * 2, rate: 0.15 },
    { amount: base * 5, rate: 0.10 },
  ];
}

export function render(container) {
  container.innerHTML = '';
  const info = document.createElement('div');
  container.appendChild(info);

  let timers = loadTimers();

  const depositOptions = getDepositOptions();

  depositOptions.forEach((dep) => {
    const btn = document.createElement('button');
    btn.textContent = `Вложить ${formatNumber(dep.amount)}`;
    btn.classList.add('mclickgs');
    btn.onclick = () => {
      if (!subtractBalance(dep.amount)) {
        info.textContent = 'Недостаточно средств.';
        return;
      }

      const now = Date.now();
const lastTimer = timers.length > 0
  ? timers[timers.length - 1]
  : null;

const lastEnd = lastTimer 
? lastTimer.start + duration 
: 0;

const newStart = lastEnd > now
  ? lastEnd
  : now;

timers.push({
  id: Date.now() + Math.random(),
  start: newStart,
  amount: dep.amount,
  rate: dep.rate,
  claimed: false,
});

      saveTimers(timers);
      render(container); // Перерисуем всё
    };
    container.appendChild(btn);
    container.appendChild(document.createElement('br'));
  });

  const list = document.createElement('ul');
  container.appendChild(list);

  function updateList() {
    list.innerHTML = '';

    // Заново загружаем с учётом возможных изменений
    timers = loadTimers();

    let changed = false;

    const updatedTimers = timers.map(t => {
      const li = document.createElement('li');
      const timePassed = Date.now() - t.start;

      if (timePassed >= duration && !t.claimed) {
        const reward = Math.floor(t.amount * (1 + t.rate * bankMultiplier));
        li.textContent = `Готово: вклад ${formatNumber(t.amount)} | прибыль ${formatNumber(reward)}`;
        const claimBtn = document.createElement('button');
        claimBtn.classList.add('mclickgcl');
        claimBtn.textContent = 'Забрать';
        claimBtn.onclick = () => {
          addBalance(reward);
          t.claimed = true;
          saveTimers(timers);
          updateList();
        };
        li.appendChild(claimBtn);
      } else if (!t.claimed) {
        const timeLeft = Math.ceil((duration - timePassed) / 1000);
        li.textContent = `Вклад ${formatNumber(t.amount)} | осталось: ${timeLeft} сек.`;
      }

      if (!t.claimed) list.appendChild(li);
      return t;
    });

    timers = updatedTimers.filter(t => !t.claimed);
    saveTimers(timers);
  }

  updateList();

  const interval = setInterval(() => {
    if (document.body.contains(container)) {
      updateList();
    } else {
      clearInterval(interval);
    }
  }, 1000);

  window.addEventListener('upgradeUpdated', (e) => {
    depositLevel = e.detail.depositLevel || depositLevel;
    bankMultiplier = e.detail.bankMultiplier || bankMultiplier;
  });
  container.appendChild(info);
}

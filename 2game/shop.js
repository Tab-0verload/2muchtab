import { getBalance, subtractBalance } from '../clicker.js';
import { formatNumber } from '../clicker.js';

// Экономика
let clickLevel = Number(localStorage.getItem('clickLevel')) || 1;
let bankMultiplier = Number(localStorage.getItem('bankMultiplier')) || 1;
let depositLevel = Number(localStorage.getItem('depositLevel')) || 1; // новое

function save() {
  localStorage.setItem('clickLevel', clickLevel);
  localStorage.setItem('clickValue', clickLevel);
  localStorage.setItem('bankMultiplier', bankMultiplier);
  localStorage.setItem('depositLevel', depositLevel);

  window.dispatchEvent(new CustomEvent('upgradeUpdated', {
    detail: { clickLevel, bankMultiplier, depositLevel }
  }));
}

export function render(container) {
  container.innerHTML = '';
  const info = document.createElement('div');

  // Клик улучшение
  const clickCost = clickLevel * 100000;
  const clickBtn = document.createElement('button');
  clickBtn.classList.add('mclickgs');
  clickBtn.innerHTML = `Клик <br> (x${formatNumber(clickLevel)} | ${formatNumber(clickCost)})`;
  clickBtn.onclick = () => {
    if (subtractBalance(clickCost)) {
      clickLevel++;
      save();
      render(container);
    } else {
      info.textContent = 'Недостаточно средств.';
    }
  };

  // Множитель банка
  const bankCost = bankMultiplier * 1000;
  const bankBtn = document.createElement('button');
  bankBtn.classList.add('mclickgs');
  bankBtn.innerHTML = `Множитель<br>3 в ряд, 2048v2<br>(x${formatNumber(bankMultiplier)} | ${formatNumber(bankCost)})`;
  bankBtn.onclick = () => {
    if (subtractBalance(bankCost)) {
      bankMultiplier++;
      save();
      render(container);
    } else {
      info.textContent = 'Недостаточно средств.';
    }
  };

  // Улучшение депозитов
  const depositCost = depositLevel * 500;
  const depositBtn = document.createElement('button');
  depositBtn.classList.add('mclickgs');
  depositBtn.innerHTML = `Вклады <br> (уровень ${formatNumber(depositLevel)} | ${formatNumber(depositCost)})`;
  depositBtn.onclick = () => {
    if (subtractBalance(depositCost)) {
      depositLevel++;
      save();
      render(container);
    } else {
      info.textContent = 'Недостаточно средств.';
    }
  };

  container.appendChild(clickBtn);
  container.appendChild(document.createElement('br'));
  container.appendChild(bankBtn);
  container.appendChild(document.createElement('br'));
  container.appendChild(depositBtn);
  container.appendChild(document.createElement('br'));
  container.appendChild(info);
}

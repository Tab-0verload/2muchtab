import { getBalance, subtractBalance } from '../clicker.js';
import { formatNumber } from '../clicker.js';

// Экономика
let clickLevel = Number(localStorage.getItem('clickLevel')) || 1;
let bankMultiplier = Number(localStorage.getItem('bankMultiplier')) || 1;

function save() {
  localStorage.setItem('clickLevel', clickLevel);
  localStorage.setItem('clickValue', clickLevel);
  localStorage.setItem('bankMultiplier', bankMultiplier);

  window.dispatchEvent(new CustomEvent('upgradeUpdated', {
    detail: { clickLevel, bankMultiplier }
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

  

  container.appendChild(clickBtn);
  container.appendChild(document.createElement('br'));
  container.appendChild(bankBtn);
  container.appendChild(document.createElement('br'));
  container.appendChild(info);
}

/*import { addBalance } from '../clicker.js';

let clickValue = Number(localStorage.getItem('clickValue')) || 1;

export function render(container) {
  container.innerHTML = '';

  const btn = document.createElement('button');
  btn.textContent = `Кликнуть (+${clickValue})`;
  btn.onclick = () => addBalance(clickValue);
  btn.classList.add('mclickgb');

  container.appendChild(btn);

  // Подписка на обновление при улучшении
  window.addEventListener('upgradeUpdated', (e) => {
    clickValue = e.detail.clickLevel;
    btn.textContent = `Кликнуть (+${clickValue})`;
  });
}*/

import { addBalance } from '../clicker.js';

let clickValue = Number(localStorage.getItem('clickValue')) || 1;

export function render(container) {
  container.innerHTML = '';

  const btn = document.createElement('button');
  btn.textContent = `Кликнуть (+${clickValue})`;
  btn.onclick = () => addBalance(clickValue);
  btn.classList.add('mclickgb');
  container.appendChild(btn);

  //  Новая кнопка "Собрать баланс из игр"
  const from2048 = Number(localStorage.getItem('bl2048')) || 0;
const fromM3 = Number(localStorage.getItem('blm3')) || 0;
const frombl15 = Number(localStorage.getItem('bl15')) || 0;
let total = from2048 + fromM3 + frombl15;

const collectBtn = document.createElement('button');
collectBtn.textContent = `Собрать (+${total})`;
collectBtn.classList.add('mclickgs');

collectBtn.onclick = () => {
  if (total <= 0) return; // ничего не собирать если 0

  addBalance(total);

  // Обнуляем источники
  localStorage.setItem('bl2048', 0);
  localStorage.setItem('blm3', 0);
  localStorage.setItem('bl15', 0);

  collectBtn.textContent = 'Собрано';
};

container.appendChild(collectBtn);

  // Подписка на обновление при улучшении
  window.addEventListener('upgradeUpdated', (e) => {
    clickValue = e.detail.clickLevel;
    btn.textContent = `Кликнуть (+${clickValue})`;
  });
}
import { getBalance, subtractBalance, addBalance } from '../clicker.js';
import { formatNumber } from '../clicker.js';

// Массив билетов
const tickets = [
  {
    label: 'Обычный билет',
    price: 120,
    chances: [
      { prize: 0, chance: 0.6 },
      { prize: 50, chance: 0.2 },
      { prize: 100, chance: 0.1 },
      { prize: 200, chance: 0.05 },
      { prize: 500, chance: 0.03 },
      { prize: 1000, chance: 0.015 },
      { prize: 2000, chance: 0.005 }
    ]
  },
  {
    label: 'Золотой билет',
    price: 3000,
    chances: [
      { prize: 0, chance: 0.5 },
      { prize: 200, chance: 0.25 },
      { prize: 500, chance: 0.15 },
      { prize: 3100, chance: 0.06 },
      { prize: 9000, chance: 0.04 }
    ]
  },
  {
    label: 'Супер билет',
    price: 100000,
    chances: [
      { prize: 0, chance: 0.6 },
      { prize: 100001, chance: 0.2 },
      { prize: 150000, chance: 0.09 },
      { prize: 500000, chance: 0.01 }
    ]
  }
];

export function render(container) {
  container.innerHTML = ''; // очищаем контейнер перед отрисовкой

  const info = document.createElement('div');
  info.style.marginTop = '10px';
  container.appendChild(info);

  tickets.forEach(ticket => {
    const btn = document.createElement('button');
    btn.classList.add('mclickgm');
    btn.textContent = `${formatNumber(ticket.label)} (${formatNumber(ticket.price)})`;

btn.addEventListener('click', () => {
  btn.style.backgroundColor = '#1d2327';
  setTimeout(() => {
    btn.style.backgroundColor = '#495057';
  }, 80);
});
    
    btn.onclick = () => {
      if (!subtractBalance(ticket.price)) {
        info.textContent = 'Недостаточно средств.';
        return;
      }

      const rnd = Math.random();
      let total = 0;
      for (const { prize, chance } of ticket.chances) {
        total += chance;
        if (rnd <= total) {
          addBalance(prize);
          info.innerHTML = `Выигрыш: ${formatNumber(prize)} (${chance * 100}%)`;
          return;
        }
      }

      // Если ничего не выпало (например, сумма шансов < 1)
      info.textContent = 'Вы ничего не выиграли.';
    };

    container.appendChild(btn);
  });
  container.appendChild(info);
}

import { formatNumber } from '../clicker.js';
import { getBalance, addBalance, subtractBalance } from '../clicker.js';


export function render(container) {
  container.innerHTML = '';

  const payDebtBtn = document.createElement('button');
  payDebtBtn.classList.add('mclickgs');
  container.appendChild(payDebtBtn);

  const withdrawBtn = document.createElement('button');
  withdrawBtn.classList.add('mclickgs');
  container.appendChild(withdrawBtn);
  
  const info = document.createElement('div');
  container.appendChild(info);

  function updateUI() {
    const blpk = Number(localStorage.getItem('blpk')) || 0;

    const payment = Math.abs(blpk) * 1;
    payDebtBtn.textContent = `Погасить ${formatNumber(Math.round(payment))}`;
    payDebtBtn.disabled = blpk >= 0;

    payDebtBtn.onclick = () => {
      const blpkCurrent = Number(localStorage.getItem('blpk')) || 0;
      const totalBalance = getBalance();
      const paymentCurrent = Math.abs(blpkCurrent) * 1;

      if (totalBalance >= paymentCurrent && blpkCurrent < 0) {
        subtractBalance(paymentCurrent);
        localStorage.setItem('blpk', 0);
        info.textContent = `Списано ${formatNumber(Math.round(paymentCurrent))}`;
      } else {
        info.textContent = 'Недостаточно средств для погашения';
      }

      updateUI();
    };

    withdrawBtn.textContent = `Забрать ${formatNumber(Math.round(blpk))}`;
    withdrawBtn.disabled = blpk <= 0;

    withdrawBtn.onclick = () => {
      const blpkCurrent = Number(localStorage.getItem('blpk')) || 0;
      if (blpkCurrent > 0) {
        addBalance(blpkCurrent);
        localStorage.setItem('blpk', 0);
        info.textContent = `Выведено ${formatNumber(Math.round(blpkCurrent))}`;
      }
      updateUI();
    };
  }

  updateUI();
    }

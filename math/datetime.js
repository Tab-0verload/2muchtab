export function startGame(container) {
  container.innerHTML = `
    <div class="datetime-container">
      <h2>Дата</h2>
      <label>Часы:</label>
      <input type="number" id="timeHours" placeholder="например, 5" />
      <label>Минуты:</label>
      <input type="number" id="timeMinutes" placeholder="например, 30" />
      <div class="result" id="timeResult">Введите данные</div>

      <h2>Время в пути</h2>
      <label>Скорость (км/ч):</label>
      <input type="number" id="speed" placeholder="например, 60" />
      <label>Расстояние (км):</label>
      <input type="number" id="distance" placeholder="например, 100" />
      <div class="result" id="result">Введите данные</div>
    </div>
  `;

  function calculateTime() {
    let hours = parseInt(document.getElementById("timeHours").value) || 0;
    let minutes = parseInt(document.getElementById("timeMinutes").value) || 0;
    let totalMinutes = hours * 60 + minutes;
    let days = Math.floor(totalMinutes / 1440);
    let remainingHours = Math.floor((totalMinutes % 1440) / 60);
    let remainingMinutes = totalMinutes % 60;
    let now = new Date();
    now.setMinutes(now.getMinutes() + totalMinutes);
    let futureTime = now.toLocaleString();

    document.getElementById("timeResult").innerHTML =
      `Перевод: <b>${days}</b> д. <b>${remainingHours}</b> ч. <b>${remainingMinutes}</b> м.<br>` +
      `Будет: <b>${futureTime}</b>`;
  }

  function calculateTravelTime() {
    const speed = parseFloat(document.getElementById('speed').value);
    const distance = parseFloat(document.getElementById('distance').value);
    const resultDiv = document.getElementById('result');

    if (speed > 0 && distance > 0) {
      const time = distance / speed;
      const hours = Math.floor(time);
      const minutes = Math.round((time - hours) * 60);
      resultDiv.innerText = `Время в пути: ${hours} ч ${minutes} мин`;
    } else {
      resultDiv.innerText = 'Введите корректные значения скорости и расстояния.';
    }
  }

  document.getElementById("timeHours").addEventListener("input", calculateTime);
  document.getElementById("timeMinutes").addEventListener("input", calculateTime);
  document.getElementById("speed").addEventListener("input", calculateTravelTime);
  document.getElementById("distance").addEventListener("input", calculateTravelTime);
}
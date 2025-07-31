const statusBar = document.getElementById('status-bar');
const gameContent = document.getElementById('game-content');

// Переключение категорий
document.querySelectorAll('#category-nav button').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;

    document.querySelectorAll('.category').forEach(cat => {
      cat.style.display = cat.dataset.category === category ? 'block' : 'none';
    });

    gameContent.innerHTML = '';
    statusBar.textContent = '';
  });
});

// Запуск игры (или интерактива)
document.querySelectorAll('.launch-game').forEach(button => {
  button.addEventListener('click', async () => {
    const gameName = button.dataset.game;
    statusBar.textContent = `Загрузка: ${gameName}...`;

    try {
      const module = await import(`./${gameName}.js`);
      if (typeof module.startGame === 'function') {
        module.startGame(gameContent); // передаём DOM-элемент, не canvas
        statusBar.textContent = `Модуль "${gameName}" загружен`;
      } else {
        statusBar.textContent = `Ошибка: функция startGame не найдена`;
      }
    } catch (e) {
      console.error(e);
      statusBar.textContent = `Ошибка при загрузке модуля "${gameName}"`;
    }
  });
});
const statusBar = document.getElementById('status-bar');
const gameContent = document.getElementById('game-content');

// Переключение категорий
document.querySelectorAll('#category-nav button').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;

    document.querySelectorAll('.category').forEach(cat => {
      cat.style.display = cat.dataset.category === category ? 'block' : 'none';
    });

    document.querySelectorAll('.category').forEach(cat => {
      if (cat.dataset.category === category) {
        cat.style.display = 'block';
      }
    });

    gameContent.innerHTML = '';
    statusBar.textContent = '';
  });
});

// Запуск игры (или интерактива)
document.querySelectorAll('.launch-game').forEach(button => {
  button.addEventListener('click', async () => {
    const gameName = button.dataset.game;
    const shortName = gameName.split('/').pop();
    statusBar.textContent = `Загрузка: ${shortName}...`;

    
    document.querySelectorAll('.category').forEach(cat => {
      cat.style.display = 'none';
    });
    
 

try {
  const module = await import(`./${gameName}.js`);
  if (typeof module.startGame === 'function') {
    module.startGame(gameContent);
    statusBar.textContent = `Модуль "${shortName}" загружен`; // только имя
  } else {
    statusBar.textContent = `Ошибка: функция startGame не найдена`;
  }
} catch (e) {
  console.error(e);
  statusBar.textContent = `Ошибка при загрузке модуля "${shortName}"`;
}
  });
});

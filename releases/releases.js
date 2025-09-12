export function startGame(container) {
  container.innerHTML = `
    <div class="timer-container"></div>
  `;

  const timerContainer = container.querySelector('.timer-container');

  const releases = [
    {
      title: 'Grand Theft Auto VI <br> May 26, 2026',
      date: '2026-05-26T00:00:00',
      class: 'gta6',
    },
    {
      title: 'Tron: Ares <br> October 10, 2025',
      date: '2025-10-10T00:00:00',
      class: 'tron',
    },
    {
      title: 'Mortal II Kombat <br> October 24, 2025',
      date: '2026-05-15T00:00:00',
      class: 'mk2',
    },
    {
      title: 'Avatar: Fire and Ash <br> December 19, 2025',
      date: '2025-12-19T00:00:00',
      class: 'avatar',
    },
  ];

  function formatTime(diff) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  function createTimer({ title, date, class: cssClass }, target) {
    const wrapper = document.createElement('div');
    wrapper.className = `timer ${cssClass}`;

    const heading = document.createElement('h2');
    heading.innerHTML = title;

    const timeEl = document.createElement('div');
    timeEl.className = 'time';
    timeEl.textContent = '...';

    wrapper.appendChild(heading);
    wrapper.appendChild(timeEl);
    target.appendChild(wrapper);

    function update() {
      const now = new Date();
      const targetDate = new Date(date);
      const diff = targetDate - now;
      timeEl.textContent = diff > 0 ? formatTime(diff) : 'Released!';
    }

    update();
    setInterval(update, 1000);
  }

  releases.forEach(release => createTimer(release, timerContainer));
}

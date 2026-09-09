document.addEventListener('DOMContentLoaded', () => {
  const gate = document.getElementById('gate');
  const sealBtn = document.getElementById('sealBtn');
  const bgm = document.getElementById('bgm');
  const musicToggle = document.getElementById('musicToggle');
  const musicHint = document.getElementById('musicHint');

  function showHint(text, duration = 3500) {
    if (!musicHint) return;
    musicHint.textContent = text;
    musicHint.classList.add('show');
    clearTimeout(showHint._t);
    showHint._t = setTimeout(() => musicHint.classList.remove('show'), duration);
  }

  function tryPlayMusic() {
    if (!bgm) return;
    bgm.play()
      .then(() => {
        musicToggle.classList.add('playing');
        musicToggle.setAttribute('aria-pressed', 'true');
      })
      .catch(() => {
        // autoplay diblokir browser, biarkan user menekan tombol musik manual
        showHint('Ketuk ikon musik untuk memutar lagu');
      });
  }

  sealBtn.addEventListener('click', () => {
    sealBtn.classList.add('cracked');
    setTimeout(() => {
      gate.classList.add('open');
      musicToggle.classList.add('visible');
    }, 550);
    tryPlayMusic();
  });

  musicToggle.addEventListener('click', () => {
    if (bgm.paused) {
      bgm.play()
        .then(() => {
          musicToggle.classList.add('playing');
          musicToggle.setAttribute('aria-pressed', 'true');
        })
        .catch(() => showHint('Lagu belum ditemukan di assets/musik.mp3'));
    } else {
      bgm.pause();
      musicToggle.classList.remove('playing');
      musicToggle.setAttribute('aria-pressed', 'false');
    }
  });

  const toastBtn = document.getElementById('toastBtn');
  const toastNote = document.getElementById('toastNote');

  toastBtn.addEventListener('click', () => {
    toastNote.classList.add('show');
    const rect = toastBtn.getBoundingClientRect();
    const sparkCount = 18;

    for (let i = 0; i < sparkCount; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      const x = rect.left + rect.width / 2 + (Math.random() * 160 - 80);
      s.style.left = `${x}px`;
      s.style.top = `${rect.top + window.scrollY}px`;
      const dur = 1 + Math.random() * 0.8;
      const delay = Math.random() * 0.3;
      s.style.animation = `spark-rise ${dur}s ease-out forwards`;
      s.style.animationDelay = `${delay}s`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), (dur + delay) * 1000 + 100);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById('scrollProgress');
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = `${scrolled}%`;
  }
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- Ambient floating particles ---------- */
  if (!prefersReducedMotion) {
    const layer = document.getElementById('particles');
    const count = window.innerWidth < 640 ? 14 : 26;
    for (let i = 0; i < count; i++) {
      const m = document.createElement('span');
      m.className = 'mote';
      const size = 2 + Math.random() * 3;
      m.style.width = `${size}px`;
      m.style.height = `${size}px`;
      m.style.left = `${Math.random() * 100}%`;
      m.style.setProperty('--drift-x', `${(Math.random() * 80 - 40)}px`);
      m.style.animationDuration = `${14 + Math.random() * 14}s`;
      m.style.animationDelay = `${Math.random() * 18}s`;
      layer.appendChild(m);
    }
  }

  /* ---------- Custom cursor (fine pointer only) ---------- */
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover && !prefersReducedMotion) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    });
    function animateRing() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      requestAnimationFrame(animateRing);
    }
    animateRing();
    document.querySelectorAll('button, a, .gframe').forEach(el => {
      el.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.6)');
      el.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
    });
  } else {
    document.getElementById('cursorDot')?.remove();
    document.getElementById('cursorRing')?.remove();
  }

  /* ---------- Hero title, letter by letter ---------- */
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.innerHTML = '';
    let delay = 0;
    text.split('').forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = `${0.25 + delay}s`;
      heroTitle.appendChild(span);
      delay += ch === ' ' ? 0 : 0.035;
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale, .gframe, .ornament');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Gate / seal ---------- */
  const gate = document.getElementById('gate');
  const sealBtn = document.getElementById('sealBtn');
  const sealWrap = document.getElementById('sealWrap');
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
      .catch(() => showHint('Tap the music icon to play the song'));
  }

  sealBtn.addEventListener('click', () => {
    sealWrap.classList.add('crackle');
    setTimeout(() => sealBtn.classList.add('cracked'), 220);
    setTimeout(() => {
      gate.classList.add('open');
      musicToggle.classList.add('visible');
    }, 700);
    tryPlayMusic();
  });

  musicToggle.addEventListener('click', () => {
    if (bgm.paused) {
      bgm.play()
        .then(() => {
          musicToggle.classList.add('playing');
          musicToggle.setAttribute('aria-pressed', 'true');
        })
        .catch(() => showHint('Song not found in assets/musik.mp3'));
    } else {
      bgm.pause();
      musicToggle.classList.remove('playing');
      musicToggle.setAttribute('aria-pressed', 'false');
    }
  });

  /* ---------- Toast button: ripple + sparkles ---------- */
  const toastBtn = document.getElementById('toastBtn');
  const toastNote = document.getElementById('toastNote');

  toastBtn.addEventListener('click', (e) => {
    toastNote.classList.add('show');

    const rect = toastBtn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    toastBtn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);

    const sparkCount = 22;
    for (let i = 0; i < sparkCount; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      const x = rect.left + rect.width / 2 + (Math.random() * 180 - 90);
      s.style.left = `${x}px`;
      s.style.top = `${rect.top + window.scrollY}px`;
      const dur = 1 + Math.random() * 0.9;
      const delay = Math.random() * 0.35;
      s.style.animation = `spark-rise ${dur}s ease-out forwards`;
      s.style.animationDelay = `${delay}s`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), (dur + delay) * 1000 + 100);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll progress bar ---------- */
  try {
    const progress = document.getElementById('scrollProgress');
    function updateProgress() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const scrolled = max > 0 ? (h.scrollTop / max) * 100 : 0;
      progress.style.width = `${scrolled}%`;
    }
    document.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  } catch (err) { console.error('progress bar error', err); }

  /* ---------- Ambient floating particles ---------- */
  try {
    if (!prefersReducedMotion) {
      const layer = document.getElementById('particles');
      if (layer) {
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
    }
  } catch (err) { console.error('particles error', err); }

  /* ---------- Custom cursor (fine pointer only) ---------- */
  try {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (canHover && !prefersReducedMotion && dot && ring) {
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
      dot?.remove();
      ring?.remove();
    }
  } catch (err) { console.error('cursor error', err); }

  /* ---------- Hero title, letter by letter ---------- */
  try {
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
  } catch (err) { console.error('hero title error', err); }

  /* ---------- Scroll reveal (with guaranteed fallback) ---------- */
  try {
    const revealEls = document.querySelectorAll('.reveal, .reveal-scale, .gframe, .ornament');

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
      revealEls.forEach(el => io.observe(el));
    } else {
      // Browser tidak mendukung IntersectionObserver: langsung tampilkan semua.
      revealEls.forEach(el => el.classList.add('in-view'));
    }

    // Jaring pengaman: kalau karena alasan apapun animasi gagal terpicu
    // (elemen terlalu tinggi, timing browser tertentu, dll), paksa tampil
    // setelah beberapa detik supaya konten TIDAK PERNAH tersembunyi permanen.
    setTimeout(() => {
      revealEls.forEach(el => el.classList.add('in-view'));
    }, 2500);
  } catch (err) {
    console.error('reveal error', err);
    // Kalau ada error sama sekali, langsung tampilkan semua elemen supaya
    // konten tetap terlihat walau animasinya tidak jalan.
    document.querySelectorAll('.reveal, .reveal-scale, .gframe, .ornament')
      .forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Gate / seal ---------- */
  try {
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

    if (sealBtn && gate && sealWrap) {
      sealBtn.addEventListener('click', () => {
        sealWrap.classList.add('crackle');
        setTimeout(() => sealBtn.classList.add('cracked'), 220);
        setTimeout(() => {
          gate.classList.add('open');
          musicToggle?.classList.add('visible');
        }, 700);
        tryPlayMusic();
      });
    }

    if (musicToggle && bgm) {
      musicToggle.addEventListener('click', () => {
        if (bgm.paused) {
          bgm.play()
            .then(() => {
              musicToggle.classList.add('playing');
              musicToggle.setAttribute('aria-pressed', 'true');
            })
            .catch(() => showHint('Song not found: musik.mp3'));
        } else {
          bgm.pause();
          musicToggle.classList.remove('playing');
          musicToggle.setAttribute('aria-pressed', 'false');
        }
      });
    }
  } catch (err) { console.error('gate/music error', err); }

  /* ---------- Toast button: ripple + sparkles + full celebration ---------- */
  try {
    const toastBtn = document.getElementById('toastBtn');
    const toastNote = document.getElementById('toastNote');
    const celebrateColors = ['#C9A24B', '#E4C888', '#F4EEE1', '#5C1F2B'];

    function launchConfetti(originX) {
      const count = window.innerWidth < 640 ? 45 : 80;
      for (let i = 0; i < count; i++) {
        const c = document.createElement('span');
        c.className = 'confetti';
        const size = 6 + Math.random() * 6;
        const isRound = Math.random() > 0.5;
        c.style.width = `${size}px`;
        c.style.height = `${isRound ? size : size * 1.6}px`;
        c.style.borderRadius = isRound ? '50%' : '2px';
        c.style.background = celebrateColors[Math.floor(Math.random() * celebrateColors.length)];
        // Bias spread around the button but let it cover most of the width
        const spread = window.innerWidth * 0.85;
        const x = Math.min(
          window.innerWidth - 10,
          Math.max(10, originX + (Math.random() * spread - spread / 2))
        );
        c.style.left = `${x}px`;
        c.style.setProperty('--spin', `${Math.random() > 0.5 ? '' : '-'}${540 + Math.random() * 540}deg`);
        const dur = 2.4 + Math.random() * 2;
        const delay = Math.random() * 0.7;
        c.style.animation = `confetti-fall ${dur}s ease-in forwards`;
        c.style.animationDelay = `${delay}s`;
        document.body.appendChild(c);
        setTimeout(() => c.remove(), (dur + delay) * 1000 + 150);
      }
    }

    function launchRings(cx, cy) {
      [0, 0.15, 0.3].forEach((delay) => {
        const ring = document.createElement('span');
        ring.className = 'celebrate-ring';
        const size = 40 + Math.random() * 20;
        ring.style.width = `${size}px`;
        ring.style.height = `${size}px`;
        ring.style.left = `${cx}px`;
        ring.style.top = `${cy}px`;
        ring.style.animationDelay = `${delay}s`;
        document.body.appendChild(ring);
        setTimeout(() => ring.remove(), 1600 + delay * 1000);
      });
    }

    function launchGlow(cx, cy) {
      const glow = document.createElement('div');
      glow.className = 'celebrate-glow';
      glow.style.setProperty('--cx', `${cx}px`);
      glow.style.setProperty('--cy', `${cy}px`);
      document.body.appendChild(glow);
      setTimeout(() => glow.remove(), 1600);
    }

    function launchBurstMotes() {
      if (prefersReducedMotion) return;
      const count = window.innerWidth < 640 ? 16 : 30;
      for (let i = 0; i < count; i++) {
        const m = document.createElement('span');
        m.className = 'burst-mote';
        const size = 3 + Math.random() * 4;
        m.style.width = `${size}px`;
        m.style.height = `${size}px`;
        m.style.left = `${Math.random() * 100}%`;
        m.style.setProperty('--drift-x', `${(Math.random() * 140 - 70)}px`);
        const dur = 1.8 + Math.random() * 1.6;
        const delay = Math.random() * 0.5;
        m.style.animationDuration = `${dur}s`;
        m.style.animationDelay = `${delay}s`;
        document.body.appendChild(m);
        setTimeout(() => m.remove(), (dur + delay) * 1000 + 150);
      }
    }

    if (toastBtn && toastNote) {
      toastBtn.addEventListener('click', (e) => {
        toastNote.classList.add('show');

        const rect = toastBtn.getBoundingClientRect();
        const cx = e.clientX || rect.left + rect.width / 2;
        const cy = e.clientY || rect.top + rect.height / 2;

        // Button-level ripple
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${cx - rect.left - size / 2}px`;
        ripple.style.top = `${cy - rect.top - size / 2}px`;
        toastBtn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);

        // Local sparkles rising from the button
        const sparkCount = 26;
        for (let i = 0; i < sparkCount; i++) {
          const s = document.createElement('span');
          s.className = 'spark';
          const x = rect.left + rect.width / 2 + (Math.random() * 200 - 100);
          s.style.left = `${x}px`;
          s.style.top = `${rect.top + window.scrollY}px`;
          const dur = 1 + Math.random() * 0.9;
          const delay = Math.random() * 0.35;
          s.style.animation = `spark-rise ${dur}s ease-out forwards`;
          s.style.animationDelay = `${delay}s`;
          document.body.appendChild(s);
          setTimeout(() => s.remove(), (dur + delay) * 1000 + 100);
        }

        // Full-screen celebration: confetti, rings, glow, and a burst of motes
        launchGlow(cx, cy);
        launchRings(cx, cy);
        launchConfetti(cx);
        launchBurstMotes();
      });
    }
  } catch (err) { console.error('toast error', err); }
});

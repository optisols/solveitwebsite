// Incremental counter that runs when the Trusted section enters the viewport
(function () {
  const el = document.getElementById('trusted-count');
  if (!el) return;
  const target = parseInt(el.dataset.target, 10) || 0;
  const duration = 1600; // total animation time in ms
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  let started = false;
  function animateCount() {
    if (started) return;
    started = true;
    const start = performance.now();
    function frame(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const value = Math.floor(easeOutCubic(progress) * target);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = target; // ensure exact final value
      }
    }
    requestAnimationFrame(frame);
  }

  // Use IntersectionObserver so animation triggers when visible
  const section = el.closest('.trusted-section') || document.querySelector('.trusted-section');
  if ('IntersectionObserver' in window && section) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount();
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(section);
  } else {
    // fallback: run on load
    window.addEventListener('load', animateCount);
  }
})();
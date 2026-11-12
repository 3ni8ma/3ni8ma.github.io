(() => {
  const root = document.documentElement;
  const storageKey = "aarush-theme";
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const toggle = document.querySelector("[data-theme-toggle]");

  function saveTheme(theme) {
    try {
      if (theme === null) localStorage.removeItem(storageKey);
      else localStorage.setItem(storageKey, theme);
    } catch (error) {
      /* Private mode can block storage; the theme still changes for this page. */
    }
  }

  function currentTheme() {
    return root.dataset.theme || (media.matches ? "dark" : "light");
  }

  function updateToggle(theme) {
    if (!toggle) return;

    const next = theme === "dark" ? "light" : "dark";
    const label = toggle.querySelector("[data-theme-label]");
    const sun = toggle.querySelector(".icon-sun");
    const moon = toggle.querySelector(".icon-moon");

    if (label) label.textContent = next;
    if (sun) sun.style.display = theme === "dark" ? "block" : "none";
    if (moon) moon.style.display = theme === "dark" ? "none" : "block";

    toggle.setAttribute("aria-label", "Switch to " + next + " theme");
    toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  if (toggle) {
    updateToggle(currentTheme());

    toggle.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      saveTheme(next);
      updateToggle(next);
    });
  }

  function onMediaChange() {
    if (!root.dataset.theme) updateToggle(media.matches ? "dark" : "light");
  }

  if (media.addEventListener) media.addEventListener("change", onMediaChange);
  else if (media.addListener) media.addListener(onMediaChange);

  function burstConfetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.className = "confetti-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const styles = getComputedStyle(root);
    const palette = [
      styles.getPropertyValue("--accent").trim() || "#a13318",
      styles.getPropertyValue("--link").trim() || "#1d4f91",
      styles.getPropertyValue("--ink").trim() || "#1a1917",
      styles.getPropertyValue("--muted").trim() || "#6b655a"
    ];

    const pieces = Array.from({ length: 70 }, () => ({
      x: width / 2 + (Math.random() - 0.5) * 180,
      y: height * 0.36 + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 9,
      vy: -6 - Math.random() * 7,
      size: 4 + Math.random() * 5,
      color: palette[Math.floor(Math.random() * palette.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 1
    }));

    let frame = 0;

    function tick() {
      ctx.clearRect(0, 0, width, height);

      let alive = false;

      for (const piece of pieces) {
        piece.vy += 0.28;
        piece.vx *= 0.995;
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rot += piece.vr;
        piece.life -= 0.008;

        if (piece.life > 0 && piece.y < height + 30) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, piece.life);
          ctx.translate(piece.x, piece.y);
          ctx.rotate(piece.rot);
          ctx.fillStyle = piece.color;
          ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.62);
          ctx.restore();
        }
      }

      frame += 1;

      if (alive && frame < 240) requestAnimationFrame(tick);
      else canvas.remove();
    }

    requestAnimationFrame(tick);
  }

  window.burstConfetti = burstConfetti;

  const confettiTrigger = document.querySelector("[data-confetti]");

  if (confettiTrigger) {
    confettiTrigger.addEventListener("click", (event) => {
      event.preventDefault();
      burstConfetti();
    });
  }
})();

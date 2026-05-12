const canvas = document.querySelector("#field");
const ctx = canvas.getContext("2d");
const pointer = { x: 0.5, y: 0.5 };
let particles = [];

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.max(48, Math.floor((window.innerWidth * window.innerHeight) / 21000));
  particles = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 1.2 + Math.random() * 2.8,
    vx: -0.14 + Math.random() * 0.28,
    vy: -0.12 + Math.random() * 0.24,
    hue: index % 3,
  }));
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach((p) => {
    p.x += p.vx + (pointer.x - 0.5) * 0.16;
    p.y += p.vy + (pointer.y - 0.5) * 0.16;

    if (p.x < -20) p.x = window.innerWidth + 20;
    if (p.x > window.innerWidth + 20) p.x = -20;
    if (p.y < -20) p.y = window.innerHeight + 20;
    if (p.y > window.innerHeight + 20) p.y = -20;

    const colors = ["rgba(94,230,184,0.36)", "rgba(97,198,255,0.3)", "rgba(255,123,101,0.24)"];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = colors[p.hue];
    ctx.fill();
  });

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 135) {
        ctx.strokeStyle = `rgba(7, 16, 20, ${0.08 * (1 - distance / 135)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX / window.innerWidth;
  pointer.y = event.clientY / window.innerHeight;
});

resize();
draw();

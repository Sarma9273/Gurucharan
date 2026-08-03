(() => {
  const canvas = document.querySelector('[data-security-core]');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const container = canvas.parentElement;
  let width = 1, height = 1, dpr = Math.min(devicePixelRatio || 1, 1.7);
  let rotX = 0.2, rotY = 0, targetX = 0.2, targetY = 0;
  let active = true;
  let colour = '#38bdf8';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nodes = Array.from({ length: 150 }, (_, i) => {
    const phi = Math.acos(1 - 2 * (i + 0.5) / 150);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    return { x: Math.cos(theta) * Math.sin(phi), y: Math.cos(phi), z: Math.sin(theta) * Math.sin(phi) };
  });

  const resize = () => {
    const rect = container.getBoundingClientRect();
    width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  new ResizeObserver(resize).observe(container);

  container.addEventListener('pointermove', (event) => {
    const rect = container.getBoundingClientRect();
    targetY = ((event.clientX - rect.left) / rect.width - 0.5) * 0.8;
    targetX = ((event.clientY - rect.top) / rect.height - 0.5) * 0.5;
  }, { passive: true });
  new IntersectionObserver(([entry]) => active = entry.isIntersecting, { threshold: 0.02 }).observe(container);
  addEventListener('gc-focus-change', (event) => {
    colour = event.detail?.color || colour;
    const mode = document.querySelector('[data-core-mode]');
    if (mode) mode.textContent = event.detail?.id === 'ai-security' ? 'AI SAFETY MODE' : event.detail?.id === 'applied-ai' ? 'DATA REASONING MODE' : 'SOC SIGNAL MODE';
  });

  function rotatePoint(point, rx, ry) {
    const cosY = Math.cos(ry), sinY = Math.sin(ry), cosX = Math.cos(rx), sinX = Math.sin(rx);
    const x1 = point.x * cosY - point.z * sinY;
    const z1 = point.x * sinY + point.z * cosY;
    const y1 = point.y * cosX - z1 * sinX;
    const z2 = point.y * sinX + z1 * cosX;
    return { x: x1, y: y1, z: z2 };
  }

  function frame(time) {
    requestAnimationFrame(frame);
    if (!active) return;
    rotX += (targetX - rotX) * 0.025;
    rotY += (targetY - rotY) * 0.025;
    if (!reduce) rotY += 0.0016;
    ctx.clearRect(0, 0, width, height);
    const radius = Math.min(width, height) * 0.31;
    const cx = width / 2, cy = height / 2;
    const projected = nodes.map((node) => {
      const p = rotatePoint(node, rotX, rotY);
      const perspective = 1 / (2.25 - p.z * 0.55);
      return { x: cx + p.x * radius * perspective * 1.9, y: cy + p.y * radius * perspective * 1.9, z: p.z, alpha: 0.25 + (p.z + 1) * 0.35 };
    });

    ctx.strokeStyle = colour + '28';
    ctx.lineWidth = 1;
    for (let i = 0; i < projected.length; i += 5) {
      const a = projected[i], b = projected[(i + 17) % projected.length];
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    projected.sort((a,b) => a.z - b.z).forEach((p) => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = colour;
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.1 + (p.z + 1) * 1.2, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    const pulse = 0.92 + Math.sin(time * 0.002) * 0.04;
    ctx.strokeStyle = colour + 'aa';
    [0.42,0.56,0.7].forEach((scale, i) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rotY * (i + 1) * 0.25); ctx.scale(1, 0.42 + i * 0.12);
      ctx.beginPath(); ctx.arc(0,0,radius * scale * pulse,0,Math.PI*2); ctx.stroke(); ctx.restore();
    });
    ctx.fillStyle = colour + '22'; ctx.beginPath(); ctx.arc(cx,cy,radius * 0.24 * pulse,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = colour; ctx.beginPath(); ctx.arc(cx,cy,radius * 0.25 * pulse,0,Math.PI*2); ctx.stroke();
  }
  requestAnimationFrame(frame);
})();

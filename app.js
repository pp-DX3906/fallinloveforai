/* 如梦之梦 · 封面动效：星星闪烁 / 流星 / 素材漂浮 / 床缓缓旋转 */
(() => {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, DPR = 1;

  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  addEventListener('resize', () => { resize(); seedStars(); });
  resize();

  /* ---------- 星星：缓慢闪烁 ---------- */
  const TINTS = ['248,246,238', '240,208,138', '158,196,222', '226,178,196'];
  let stars = [];
  function seedStars() {
    const n = Math.round(W * H / 11000);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: .4 + Math.random() * 1.5,
      base: .25 + Math.random() * .5,
      amp: .15 + Math.random() * .45,
      spd: .25 + Math.random() * .7,          // 弧度/秒，很慢
      ph: Math.random() * Math.PI * 2,
      tint: TINTS[(Math.random() * TINTS.length) | 0],
      sparkle: Math.random() < .06
    }));
  }
  seedStars();

  /* ---------- 流星 ---------- */
  let meteors = [], nextMeteor = 1.2;
  function spawnMeteor() {
    const fromLeft = Math.random() < .5;
    meteors.push({
      x: W * (.12 + Math.random() * .76),
      y: H * (.02 + Math.random() * .3),
      vx: (fromLeft ? 1 : -1) * (340 + Math.random() * 260),
      vy: 170 + Math.random() * 130,
      len: 110 + Math.random() * 120,
      life: 0, ttl: .9 + Math.random() * .5
    });
  }

  /* ---------- 漂浮素材 ---------- */
  const drifts = [...document.querySelectorAll('.floater, .entry')].map((el, i) => ({
    el,
    ax: 10 + Math.random() * 16,              // 水平漂移幅度 px
    ay: 14 + Math.random() * 20,              // 垂直漂移幅度 px
    spd: .1 + Math.random() * .12,            // 漂浮频率
    rot: 2.5 + Math.random() * 3,             // 摇摆角度
    ph: Math.random() * Math.PI * 2,
    depth: .35 + Math.random() * .8,          // 视差深度
    w: el.classList.contains('entry') ? el.querySelector('img') : el
  }));

  /* ---------- 床：保持水平、缓缓自旋（Bed Vortex 式） ---------- */
  const bed = document.querySelector('.bed');
  const bedShadow = document.querySelector('.bed-shadow');
  let bedAngle = Math.PI / 5;
  const BED_SPD = .4;                          // 弧度/秒，约 16 秒一圈

  /* ---------- 鼠标视差 ---------- */
  let mx = 0, my = 0, smx = 0, smy = 0;
  addEventListener('pointermove', e => {
    mx = (e.clientX / W - .5) * 2; my = (e.clientY / H - .5) * 2;
  });

  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, .05); last = now;
    const t = now / 1000;

    /* 星星 */
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      const a = Math.max(0, s.base + Math.sin(t * s.spd + s.ph) * s.amp);
      ctx.fillStyle = `rgba(${s.tint},${a})`;
      if (s.sparkle) {
        const r = s.r * 3.2, g = r * .28;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y - r); ctx.quadraticCurveTo(s.x + g, s.y - g, s.x + r, s.y);
        ctx.quadraticCurveTo(s.x + g, s.y + g, s.x, s.y + r);
        ctx.quadraticCurveTo(s.x - g, s.y + g, s.x - r, s.y);
        ctx.quadraticCurveTo(s.x - g, s.y - g, s.x, s.y - r);
        ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
      }
    }

    /* 流星 */
    nextMeteor -= dt;
    if (nextMeteor <= 0) { spawnMeteor(); if (Math.random() < .3) spawnMeteor(); nextMeteor = 2.4 + Math.random() * 4.2; }
    meteors = meteors.filter(m => m.life < m.ttl);
    for (const m of meteors) {
      m.life += dt; m.x += m.vx * dt; m.y += m.vy * dt;
      const sp = Math.hypot(m.vx, m.vy), ux = m.vx / sp, uy = m.vy / sp;
      const fade = Math.min(1, m.life * 3) * Math.max(0, 1 - m.life / m.ttl);
      const grad = ctx.createLinearGradient(m.x, m.y, m.x - ux * m.len, m.y - uy * m.len);
      grad.addColorStop(0, `rgba(252,248,236,${.9 * fade})`);
      grad.addColorStop(.35, `rgba(226,206,160,${.45 * fade})`);
      grad.addColorStop(1, 'rgba(226,206,160,0)');
      ctx.strokeStyle = grad; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - ux * m.len, m.y - uy * m.len); ctx.stroke();
      ctx.fillStyle = `rgba(252,250,242,${.95 * fade})`;
      ctx.beginPath(); ctx.arc(m.x, m.y, 1.6, 0, 7); ctx.fill();
    }

    if (!reduce) {
      /* 漂浮素材 + 视差 */
      smx += (mx - smx) * .04; smy += (my - smy) * .04;
      for (const d of drifts) {
        const px = smx * 22 * d.depth, py = smy * 14 * d.depth;
        d.el.style.transform =
          `translate(-50%,-50%) translate(${px + Math.sin(t * d.spd + d.ph) * d.ax}px,${py + Math.cos(t * d.spd * .8 + d.ph) * d.ay}px)` +
          ` rotate(${Math.sin(t * d.spd * .6 + d.ph) * d.rot}deg)`;
      }
      /* 床：水平自旋 + 轻微起伏 */
      bedAngle += dt * BED_SPD;
      const face = Math.abs(Math.cos(bedAngle));            // 1→0→1，正面—侧棱—正面
      const flip = Math.cos(bedAngle) >= 0 ? 1 : -1;
      bed.style.transform =
        `perspective(950px) rotateX(7deg) rotate(${Math.sin(bedAngle * .5) * 2.2}deg) scaleX(${Math.max(.06, face) * flip}) translateY(${Math.sin(bedAngle * .7) * 9}px)`;
      bedShadow.style.transform = `scaleX(${.55 + face * .45})`;
      bedShadow.style.opacity = .55 + face * .45;
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

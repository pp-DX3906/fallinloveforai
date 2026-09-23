(() => {
  const canvas = document.querySelector('#stars');
  const ctx = canvas.getContext('2d');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const floating = [...document.querySelectorAll('.dream-object, .decor, .picture-star')];
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let lights = [];

  function resize() {
    width = innerWidth;
    height = innerHeight;
    pixelRatio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const count = Math.max(55, Math.round((width * height) / 10500));
    lights = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * .83,
      radius: .5 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
      speed: .45 + Math.random() * .9,
      alpha: .25 + Math.random() * .5,
      cross: Math.random() < .13
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    const t = time / 1000;

    for (const light of lights) {
      const alpha = light.alpha * (.58 + Math.sin(t * light.speed + light.phase) * .42);
      ctx.fillStyle = `rgba(255, 251, 236, ${Math.max(.08, alpha)})`;
      if (light.cross) {
        const long = light.radius * 4.2;
        const short = light.radius * .8;
        ctx.beginPath();
        ctx.moveTo(light.x, light.y - long);
        ctx.quadraticCurveTo(light.x + short, light.y - short, light.x + long, light.y);
        ctx.quadraticCurveTo(light.x + short, light.y + short, light.x, light.y + long);
        ctx.quadraticCurveTo(light.x - short, light.y + short, light.x - long, light.y);
        ctx.quadraticCurveTo(light.x - short, light.y - short, light.x, light.y - long);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (!reduceMotion) {
      floating.forEach((element, index) => {
        const isBed = element.classList.contains('bed-link');
        const distance = isBed ? 5 : 8 + (index % 3) * 2;
        const speed = isBed ? .55 : .35 + (index % 4) * .07;
        const x = Math.sin(t * speed + index * 1.7) * distance * .35;
        const y = Math.cos(t * speed * .82 + index) * distance;
        const rotation = isBed ? Math.sin(t * .26) * 1.1 : Math.sin(t * speed * .6 + index) * 2.2;
        element.style.setProperty('--drift-x', `${x}px`);
        element.style.setProperty('--drift-y', `${y}px`);
        element.style.setProperty('--drift-r', `${rotation}deg`);
      });
    }

    requestAnimationFrame(draw);
  }

  const style = document.createElement('style');
  style.textContent = '.dream-object,.decor,.picture-star{translate:var(--drift-x,0) var(--drift-y,0);rotate:var(--drift-r,0deg)}';
  document.head.append(style);

  addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(draw);
})();

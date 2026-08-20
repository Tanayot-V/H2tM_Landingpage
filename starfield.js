(async function initStarfield(){
  "use strict";
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;

  const staticLayer = document.querySelector('.stars-layer');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let THREE;
  try {
    THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
  } catch (e) {
    return; // CDN unreachable (offline/blocked) — CSS starfield stays as the fallback
  }

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 8;

  const STAR_COUNT = 2200;
  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);

  // matches the site's palette: mostly white, occasional blue/purple/cyan flecks
  const palette = [
    [0.94, 0.96, 1.00],
    [0.49, 0.56, 1.00],
    [0.75, 0.52, 0.98],
    [0.13, 0.83, 0.93]
  ];

  for (let i = 0; i < STAR_COUNT; i++){
    const r = 6 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    positions[i*3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3 + 2] = r * Math.cos(phi);

    const c = palette[Math.random() < 0.75 ? 0 : 1 + Math.floor(Math.random() * (palette.length - 1))];
    const flicker = 0.7 + Math.random() * 0.3;
    colors[i*3]     = c[0] * flicker;
    colors[i*3 + 1] = c[1] * flicker;
    colors[i*3 + 2] = c[2] * flicker;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.09,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const stars = new THREE.Points(geometry, material);
  scene.add(stars);

  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running && !reduceMotion) requestAnimationFrame(animate);
  });

  function animate(){
    if (!running) return;
    curX += (targetX - curX) * 0.02;
    curY += (targetY - curY) * 0.02;
    stars.rotation.y += 0.0006;
    stars.rotation.x = curY * 0.15;
    camera.position.x = curX * 0.6;
    camera.position.y = -curY * 0.6;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    if (!reduceMotion) requestAnimationFrame(animate);
  }

  renderer.render(scene, camera);
  if (!reduceMotion) requestAnimationFrame(animate);

  // real 3D field is live — drop the flat CSS dots underneath it
  if (staticLayer) staticLayer.style.display = 'none';
})();

/* VORTEXA 2 — THREE.JS ATMOSPHERIC */
(function(){
  const canvas = document.getElementById('hero-canvas') || document.getElementById('three-canvas');
  if(!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(canvas.clientWidth||innerWidth, canvas.clientHeight||innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, (canvas.clientWidth||innerWidth)/(canvas.clientHeight||innerHeight), .1, 1000);
  camera.position.z = 90;

  /* ── GOLD DUST PARTICLES ── */
  const COUNT = 2200;
  const geo   = new THREE.BufferGeometry();
  const pos   = new Float32Array(COUNT*3);
  const col   = new Float32Array(COUNT*3);

  for(let i=0;i<COUNT;i++){
    // Spread in a wide flat ellipse (atmospheric feel)
    const theta = Math.random()*Math.PI*2;
    const phi   = Math.acos(2*Math.random()-1);
    const r     = Math.cbrt(Math.random())*140;
    pos[i*3]   = r*Math.sin(phi)*Math.cos(theta);
    pos[i*3+1] = r*Math.sin(phi)*Math.sin(theta)*.4; // flatten vertically
    pos[i*3+2] = r*Math.cos(phi);

    const t = Math.random();
    if(t < .55){
      // gold
      col[i*3]=0.83; col[i*3+1]=0.67; col[i*3+2]=0.24;
    } else if(t < .80){
      // dim white
      col[i*3]=0.4; col[i*3+1]=0.4; col[i*3+2]=0.45;
    } else {
      // bright gold accent
      col[i*3]=0.95; col[i*3+1]=0.78; col[i*3+2]=0.28;
    }
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col,3));

  const mat = new THREE.PointsMaterial({
    size: 0.55, vertexColors: true,
    transparent:true, opacity:.65,
    blending:THREE.AdditiveBlending,
    depthWrite:false, sizeAttenuation:true
  });
  const points = new THREE.Points(geo,mat);
  scene.add(points);

  /* ── THIN RING LINES ── */
  const rings = new THREE.Group();
  scene.add(rings);
  [50,72,92].forEach((r,i)=>{
    const rg = new THREE.BufferGeometry();
    const segs=96; const rp=[];
    for(let j=0;j<=segs;j++){
      const a=j/segs*Math.PI*2;
      rp.push(Math.cos(a)*r, Math.sin(a)*r, 0);
    }
    rg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(rp),3));
    const rm = new THREE.LineBasicMaterial({
      color: i%2===0 ? 0xd4aa3c : 0x4a4a55,
      transparent:true, opacity: .04-i*.008,
      blending:THREE.AdditiveBlending
    });
    const ring = new THREE.Line(rg,rm);
    ring.rotation.x = Math.PI/2 + i*.2;
    rings.add(ring);
  });

  /* ── MOUSE ── */
  let tx=0,ty=0,cx=0,cy=0;
  document.addEventListener('mousemove',e=>{
    tx=(e.clientX/innerWidth-.5)*.5;
    ty=(e.clientY/innerHeight-.5)*.25;
  });

  window.addEventListener('resize',()=>{
    const w=canvas.clientWidth||innerWidth;
    const h=canvas.clientHeight||innerHeight;
    camera.aspect=w/h; camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  });

  let t=0, scrollY=0;
  window.addEventListener('scroll',()=>scrollY=window.scrollY,{passive:true});

  function tick(){
    requestAnimationFrame(tick);
    t+=.003;
    cx+=(tx-cx)*.04; cy+=(ty-cy)*.04;
    points.rotation.y = t*.08 + cx;
    points.rotation.x = t*.03 + cy;
    rings.rotation.z  = t*.05;
    rings.rotation.y  = cx*.3;
    mat.opacity = .5 + Math.sin(t*1.1)*.12;
    camera.position.z = 90 + scrollY*.02;
    renderer.render(scene,camera);
  }
  tick();
})();

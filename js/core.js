/* VORTEXA 2 — CORE JS */
document.addEventListener('DOMContentLoaded', () => {

  /* ── CURSOR ── */
  const dot   = document.getElementById('cur-dot');
  const ring  = document.getElementById('cur-ring');
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => {
    mx=e.clientX; my=e.clientY;
    if(dot){ dot.style.left=mx+'px'; dot.style.top=my+'px'; }
  });
  function lerpCursor(){
    if(!ring) return;
    rx+=(mx-rx)*.1; ry+=(my-ry)*.1;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(lerpCursor);
  }
  lerpCursor();
  document.querySelectorAll('a,button,[data-hover]').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('hov'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('hov'));
  });

  /* ── LOADER ── */
  const loader = document.getElementById('loader');
  if(loader){
    const pctEl = loader.querySelector('.loader-pct');
    let n=0;
    const t = setInterval(()=>{
      n = Math.min(n+Math.floor(Math.random()*8)+3,100);
      if(pctEl) pctEl.textContent=n+'%';
      if(n>=100) clearInterval(t);
    },55);
    setTimeout(()=>{
      loader.classList.add('loader-exit');
      setTimeout(()=>loader.remove(),900);
    },3000);
  }

  /* ── NAV SOLID ── */
  const nav = document.getElementById('nav');
  if(nav){
    const fn = ()=>nav.classList.toggle('solid',window.scrollY>20);
    window.addEventListener('scroll',fn,{passive:true}); fn();
  }
  // active link
  const page = location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    if(a.getAttribute('href')===page||(page===''&&a.getAttribute('href')==='index.html'))
      a.classList.add('act');
  });

  /* ── TICKER DUPLICATE ── */
  const tt = document.querySelector('.ticker-track');
  if(tt) tt.innerHTML+=tt.innerHTML;

  /* ── SCROLL REVEAL ── */
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const delay=+(e.target.dataset.delay||0);
        setTimeout(()=>e.target.classList.add('vis'),delay);
        io.unobserve(e.target);
      }
    });
  },{threshold:.1});
  document.querySelectorAll('[data-r]').forEach(el=>io.observe(el));

  /* ── COUNTER ── */
  function runCounter(el){
    const target=+el.dataset.target||0;
    const pre=el.dataset.pre||'';
    const suf=el.dataset.suf||'';
    const dur=1800; const s=performance.now();
    const step=now=>{
      const p=Math.min((now-s)/dur,1);
      const ease=1-Math.pow(1-p,3);
      el.textContent=pre+Math.floor(ease*target).toLocaleString()+suf;
      if(p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const cio=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){runCounter(e.target);cio.unobserve(e.target);}
    });
  },{threshold:.5});
  document.querySelectorAll('[data-counter]').forEach(el=>cio.observe(el));

  /* ── CARD TILT ── */
  document.querySelectorAll('[data-tilt]').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(700px) rotateX(${-y*7}deg) rotateY(${x*7}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });

  /* ── DRAG SCROLL ── */
  document.querySelectorAll('.drag-scroll').forEach(el=>{
    let down=false,startX,sl;
    el.addEventListener('mousedown',e=>{down=true;startX=e.pageX-el.offsetLeft;sl=el.scrollLeft;});
    el.addEventListener('mouseleave',()=>down=false);
    el.addEventListener('mouseup',()=>down=false);
    el.addEventListener('mousemove',e=>{
      if(!down)return; e.preventDefault();
      el.scrollLeft=sl-(e.pageX-el.offsetLeft-startX)*1.5;
    });
  });

  /* ── BARCODE BARS ── */
  document.querySelectorAll('.barcode').forEach(bc=>{
    for(let i=0;i<30;i++){
      const b=document.createElement('div');
      b.style.cssText=`width:2px;background:var(--muted);opacity:${Math.random()*.4+.1};height:${Math.random()*60+30}%;display:inline-block;margin-right:2px;`;
      bc.appendChild(b);
    }
  });

  /* ── HERO WORDS IN ── */
  setTimeout(()=>{
    document.querySelectorAll('.hero-title-top,.hero-title-bottom').forEach(w=>w.classList.add('in'));
  },2800);

  /* ── SMOKE PARTICLES ── */
  const smokeWrap = document.querySelector('.hero-smoke-particles');
  if(smokeWrap){
    for(let i=0;i<8;i++){
      const p=document.createElement('div');
      p.className='smoke-particle';
      const s=40+Math.random()*80;
      p.style.cssText=`
        width:${s}px;height:${s}px;
        left:${10+Math.random()*80}%;
        bottom:${Math.random()*30}%;
        animation-delay:${Math.random()*4}s;
        animation-duration:${3+Math.random()*3}s;
      `;
      smokeWrap.appendChild(p);
    }
  }
});

// ===============================
// REFERENCIAS
// ===============================
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const dateLine = document.getElementById("dateLine");

const petalsBtn = document.getElementById("petalsBtn");
const shineBtn = document.getElementById("shineBtn");

// Videos
const v1 = document.getElementById("v1");
const v2 = document.getElementById("v2");

// Controles individuales
const audio1Btn = document.getElementById("audio1");
const audio2Btn = document.getElementById("audio2");
const pause1Btn = document.getElementById("pause1");
const pause2Btn = document.getElementById("pause2");

// Canvas efectos
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");

let W, H, dpr;

// ===============================
// RESIZE CANVAS
// ===============================
function resize(){
  dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  W = canvas.width;
  H = canvas.height;
}
window.addEventListener("resize", resize);
resize();

// ===============================
// FECHA BONITA
// ===============================
(function(){
  if(!dateLine) return;
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("es-PE", { day:"2-digit", month:"long", year:"numeric" });
  dateLine.textContent = fmt.format(now);
})();

// ===============================
// EFECTOS ROMÁNTICOS (PÉTALOS)
// ===============================
const particles = [];
const rand = (min,max) => Math.random()*(max-min)+min;

function spawnPetals(amount=40){
  for(let i=0;i<amount;i++){
    particles.push({
      type:"petal",
      x: rand(0, innerWidth) * dpr,
      y: rand(-40, -10) * dpr,
      vx: rand(-0.3, 0.3) * dpr,
      vy: rand(1.3, 2.2) * dpr,
      rot: rand(0, Math.PI*2),
      vr: rand(-0.03, 0.03),
      size: rand(8, 13) * dpr,
      life: rand(220, 380),
      sway: rand(0, Math.PI*2)
    });
  }
}

function burstShine(x, y, amount=60){
  for(let i=0;i<amount;i++){
    const a = Math.random()*Math.PI*2;
    const s = rand(3, 7) * dpr;
    particles.push({
      type:"shine",
      x: x*dpr,
      y: y*dpr,
      vx: Math.cos(a)*s,
      vy: Math.sin(a)*s,
      rot: rand(0, Math.PI*2),
      vr: rand(-0.1, 0.1),
      size: rand(3, 6) * dpr,
      life: rand(50, 90)
    });
  }
}

function drawPetal(p){
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);

  const g = ctx.createLinearGradient(0, -p.size, 0, p.size);
  g.addColorStop(0, "rgba(255,77,125,0.9)");
  g.addColorStop(1, "rgba(255,160,190,0.7)");

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, -p.size);
  ctx.bezierCurveTo(p.size, -p.size/4, p.size/2, p.size, 0, p.size);
  ctx.bezierCurveTo(-p.size/2, p.size, -p.size, -p.size/4, 0, -p.size);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawShine(p){
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = Math.max(0, p.life/90);

  ctx.fillStyle = "white";
  ctx.beginPath();
  const r = p.size;
  for(let i=0;i<8;i++){
    const ang = (Math.PI*2/8)*i;
    const rr = (i%2===0) ? r : r*0.4;
    ctx.lineTo(Math.cos(ang)*rr, Math.sin(ang)*rr);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function tick(){
  ctx.clearRect(0,0,W,H);

  for(let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.life--;

    if(p.type==="petal"){
      p.sway+=0.03;
      p.vx+=Math.sin(p.sway)*0.01*dpr;
      p.x+=p.vx;
      p.y+=p.vy;
      p.rot+=p.vr;

      if(p.y>H+50*dpr) p.life=0;
      drawPetal(p);
    } else {
      p.vy+=0.05*dpr;
      p.x+=p.vx;
      p.y+=p.vy;
      p.rot+=p.vr;
      drawShine(p);
    }

    if(p.life<=0) particles.splice(i,1);
  }

  requestAnimationFrame(tick);
}
tick();

// ===============================
// VIDEO HELPERS
// ===============================
function playVideos(){
  [v1,v2].forEach(v=>v?.play().catch(()=>{}));
}
function pauseVideos(){
  [v1,v2].forEach(v=>v?.pause());
}

function updateAudioButton(btn,on,label){
  if(!btn) return;
  btn.textContent = on ? `🔊 ${label}` : `🔇 ${label}`;
  btn.setAttribute("aria-pressed",on);
}

function enableAudio(video){
  if(video===v1){
    v1.muted=false;
    v2.muted=true;
    updateAudioButton(audio1Btn,true,"Audio 1");
    updateAudioButton(audio2Btn,false,"Audio 2");
  } else {
    v2.muted=false;
    v1.muted=true;
    updateAudioButton(audio2Btn,true,"Audio 2");
    updateAudioButton(audio1Btn,false,"Audio 1");
  }
}

function muteAll(){
  v1.muted=true;
  v2.muted=true;
  updateAudioButton(audio1Btn,false,"Audio 1");
  updateAudioButton(audio2Btn,false,"Audio 2");
}

// ===============================
// ABRIR / CERRAR CARTA
// ===============================
function openLetter(){
  modal.classList.add("show");
  playVideos();
  spawnPetals(30);
  burstShine(innerWidth/2,innerHeight*0.2,60);
}

function closeLetter(){
  modal.classList.remove("show");
  pauseVideos();
  muteAll();
}

openBtn?.addEventListener("click",openLetter);
closeBtn?.addEventListener("click",closeLetter);
overlay?.addEventListener("click",closeLetter);

window.addEventListener("keydown",(e)=>{
  if(e.key==="Enter" && !modal.classList.contains("show")) openLetter();
  if(e.key==="Escape" && modal.classList.contains("show")) closeLetter();
});

// ===============================
// BOTONES FX
// ===============================
petalsBtn?.addEventListener("click",()=>spawnPetals(50));

shineBtn?.addEventListener("click",(e)=>{
  const r=e.target.getBoundingClientRect();
  burstShine(r.left+r.width/2,r.top+r.height/2,80);
});

// ===============================
// AUDIO INDIVIDUAL
// ===============================
audio1Btn?.addEventListener("click",()=>{
  if(v1.muted) enableAudio(v1);
  else { v1.muted=true; updateAudioButton(audio1Btn,false,"Audio 1"); }
});

audio2Btn?.addEventListener("click",()=>{
  if(v2.muted) enableAudio(v2);
  else { v2.muted=true; updateAudioButton(audio2Btn,false,"Audio 2"); }
});

// ===============================
// PAUSA / PLAY
// ===============================
pause1Btn?.addEventListener("click",()=>{
  if(v1.paused){
    v1.play();
    pause1Btn.textContent="⏸ Pausa";
  } else {
    v1.pause();
    pause1Btn.textContent="▶️ Play";
  }
});

pause2Btn?.addEventListener("click",()=>{
  if(v2.paused){
    v2.play();
    pause2Btn.textContent="⏸ Pausa";
  } else {
    v2.pause();
    pause2Btn.textContent="▶️ Play";
  }
});

// Estado inicial
muteAll();
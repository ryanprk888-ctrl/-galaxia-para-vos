const intro=document.getElementById('intro');
const letter=document.getElementById('letter');
const cosmos=document.getElementById('cosmos');
const start=document.getElementById('start');
const open=document.getElementById('open');
const music=document.getElementById('music');
const song=document.getElementById('song');
const canvas=document.getElementById('space');
const ctx=canvas.getContext('2d');

const MUSIC_FILE='[Lv.04] Yellow - Cold Play  (★★☆☆☆)  Drum Cover, Score, Sheet Music, Lessons, Tutorial  DRUMMATE_1790044583659.mp3';
song.src=MUSIC_FILE;

function go(page){
  [intro,letter,cosmos].forEach(p=>p.classList.remove('active'));
  page.classList.add('active');
}
function playMusic(){
  song.play().then(()=>music.classList.add('on')).catch(()=>{});
}
start.addEventListener('click',()=>{go(letter);playMusic();});
open.addEventListener('click',()=>{go(cosmos);playMusic();});
music.addEventListener('click',e=>{
  e.stopPropagation();
  if(song.paused) playMusic();
  else {song.pause();music.classList.remove('on');}
});

let W=0,H=0,dpr=1,stars=[],dust=[],heart=[],time=0;
const rand=(a,b)=>a+Math.random()*(b-a);

function resize(){
  dpr=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  canvas.width=W*dpr;canvas.height=H*dpr;
  canvas.style.width=W+'px';canvas.style.height=H+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  stars=Array.from({length:Math.min(420,Math.floor(W*H/3000))},()=>({
    x:Math.random()*W,y:Math.random()*H,r:rand(.2,1.35),a:rand(.15,.9),tw:rand(.5,2)
  }));
  dust=Array.from({length:180},()=>({
    a:Math.random()*Math.PI*2,r:rand(70,Math.min(W,H)*.55),speed:rand(.0008,.003),size:rand(.3,1.3),phase:Math.random()*6
  }));
  heart=Array.from({length:1500},(_,i)=>({
    u:Math.random()*Math.PI*2,
    fill:Math.sqrt(Math.random()),
    jitter:rand(-1,1),
    phase:Math.random()*Math.PI*2,
    seed:i
  }));
}
addEventListener('resize',resize);resize();

function heartPoint(u){
  return {
    x:16*Math.sin(u)**3,
    y:-(13*Math.cos(u)-5*Math.cos(2*u)-2*Math.cos(3*u)-Math.cos(4*u))
  };
}

function draw(){
  time+=.008;
  ctx.fillStyle='rgba(2,2,7,.24)';
  ctx.fillRect(0,0,W,H);

  for(const s of stars){
    const tw=.55+.45*Math.sin(time*s.tw*7+s.x);
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${s.a*tw})`;ctx.fill();
    if(s.r>1.05){
      ctx.beginPath();ctx.arc(s.x,s.y,s.r*2.7,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,220,150,${.025*tw})`;ctx.fill();
    }
  }

  const cx=W/2,cy=H*.40;
  const scale=Math.min(W,H)/34;

  // Golden cosmic dust spiraling around the heart.
  for(const p of dust){
    p.a+=p.speed;
    const rr=p.r+Math.sin(time*2+p.phase)*5;
    const x=cx+Math.cos(p.a)*rr;
    const y=cy+Math.sin(p.a)*rr*.48;
    ctx.beginPath();ctx.arc(x,y,p.size,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,205,107,${.12+.18*(.5+.5*Math.sin(p.phase+time*3))})`;ctx.fill();
  }

  // The luminous yellow heart made from particles.
  for(const p of heart){
    const hp=heartPoint(p.u);
    const x=cx+hp.x*scale*p.fill;
    const y=cy+hp.y*scale*p.fill;
    const wob=Math.sin(time*2+p.phase)*p.jitter;
    const tw=.45+.55*(.5+.5*Math.sin(time*4+p.phase));
    const size=.45+(1.05*(1-p.fill))+.35*tw;
    ctx.beginPath();ctx.arc(x+wob,y+wob,size,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,${185+Math.floor(58*tw)},${65+Math.floor(105*tw)},${.12+.52*tw})`;
    ctx.shadowBlur=9;ctx.shadowColor='rgba(255,193,57,.8)';ctx.fill();ctx.shadowBlur=0;
  }

  // A thin bright heart outline for definition.
  ctx.beginPath();
  for(let i=0;i<=180;i++){
    const u=i/180*Math.PI*2,hp=heartPoint(u);
    const x=cx+hp.x*scale,y=cy+hp.y*scale;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.closePath();
  ctx.strokeStyle='rgba(255,220,125,.13)';
  ctx.lineWidth=1;
  ctx.shadowBlur=15;ctx.shadowColor='rgba(255,190,60,.45)';ctx.stroke();ctx.shadowBlur=0;

  requestAnimationFrame(draw);
}
draw();

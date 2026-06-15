const canvas=document.getElementById('c'),ctx=canvas.getContext('2d');
let W,H;
function resize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight}
resize();window.onresize=resize;

const flowers=[],particles=[],fireflies=[];

// Flower types with their colors
const flowerTypes=[
  {type:'rose',colors:['#ff4d6d','#ff7eb3','#c9184a','#ff8fa3','#e63971']},
  {type:'tulip',colors:['#ff6b6b','#ff91a4','#ffaa5c','#ff8c42','#d4a5ff','#ffffff','#ffdb58']},
  {type:'sunflower',colors:['#ffdb58','#ffd700','#ffee88']},
  {type:'daisy',colors:['#ffffff','#f5f5f5','#ffe8f0','#fff5ba']},
  {type:'cherry',colors:['#ffb7c5','#ff91a4','#ffc1cc','#ffe0e6','#ffffff']},
];

function drawRose(bloom,scale,color,t,phase){
  const layers=3;
  const petalsPerLayer=[8,6,4];
  for(let l=0;l<layers;l++){
    const layerBloom=Math.max(0,Math.min(1,(bloom-l*0.2)/0.6));
    if(layerBloom<=0)continue;
    const count=petalsPerLayer[l];
    const radius=(22-l*6)*scale*layerBloom;
    const w=(12-l*2)*scale*layerBloom;
    const rotOffset=l*0.3+Math.sin(t*0.8+phase)*0.03;
    for(let i=0;i<count;i++){
      const angle=(Math.PI*2/count)*i+rotOffset;
      ctx.save();ctx.rotate(angle);
      ctx.beginPath();ctx.moveTo(0,0);
      ctx.bezierCurveTo(w,radius*-0.4,w*0.6,radius*-0.8,0,-radius);
      ctx.bezierCurveTo(-w*0.6,radius*-0.8,-w,radius*-0.4,0,0);
      ctx.globalAlpha=0.75+l*0.08;
      ctx.fillStyle=l===0?color:l===1?lighten(color,20):lighten(color,40);
      ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=0.3;ctx.stroke();
      ctx.globalAlpha=1;ctx.restore();
    }
  }

  const cr=4*scale*bloom;
  ctx.beginPath();ctx.arc(0,0,cr,0,Math.PI*2);
  ctx.fillStyle=darken(color,30);ctx.fill();
}

function drawTulip(bloom,scale,color,t,phase){
  const petals=5;
  const h=30*scale*bloom;
  const w=12*scale*bloom;
  const sway=Math.sin(t*1.2+phase)*0.03;
  for(let i=0;i<petals;i++){
    const angle=(Math.PI*2/petals)*i+sway;
    ctx.save();ctx.rotate(angle);
    ctx.beginPath();ctx.moveTo(0,2*scale);

    ctx.bezierCurveTo(w*0.8,-h*0.2,w*1.1,-h*0.6,w*0.3,-h);
    ctx.bezierCurveTo(0,-h*1.05,0,-h*1.05,-w*0.3,-h);
    ctx.bezierCurveTo(-w*1.1,-h*0.6,-w*0.8,-h*0.2,0,2*scale);
    ctx.fillStyle=color;ctx.globalAlpha=0.85;ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.12)';ctx.lineWidth=0.5;ctx.stroke();
    ctx.globalAlpha=1;ctx.restore();
  }

  const cr=3*scale*bloom;
  ctx.beginPath();ctx.arc(0,-h*0.3,cr,0,Math.PI*2);
  ctx.fillStyle='rgba(255,255,200,0.3)';ctx.fill();
}

function drawSunflower(bloom,scale,color,t,phase){

  const count=16;
  const len=24*scale*bloom;
  const w=5*scale*bloom;
  const rot=Math.sin(t*0.5+phase)*0.02;
  for(let i=0;i<count;i++){
    const angle=(Math.PI*2/count)*i+rot;
    ctx.save();ctx.rotate(angle);
    ctx.beginPath();ctx.moveTo(0,-6*scale);
    ctx.bezierCurveTo(w,-len*0.4,w*0.8,-len*0.8,0,-len-6*scale);
    ctx.bezierCurveTo(-w*0.8,-len*0.8,-w,-len*0.4,0,-6*scale);
    ctx.fillStyle=color;ctx.globalAlpha=0.9;ctx.fill();
    ctx.globalAlpha=1;ctx.restore();
  }

  const cr=10*scale*bloom;
  const cGrad=ctx.createRadialGradient(0,0,0,0,0,cr);
  cGrad.addColorStop(0,'#5c3317');cGrad.addColorStop(0.7,'#3d200b');cGrad.addColorStop(1,'#2a1506');
  ctx.beginPath();ctx.arc(0,0,cr,0,Math.PI*2);
  ctx.fillStyle=cGrad;ctx.fill();

  for(let i=0;i<20;i++){
    const a=i*2.4;const r=cr*0.3*(i/20)+cr*0.2;
    const dx=Math.cos(a)*r*bloom;const dy=Math.sin(a)*r*bloom;
    ctx.beginPath();ctx.arc(dx,dy,1.2*scale,0,Math.PI*2);
    ctx.fillStyle='#8B5E3C';ctx.fill();
  }
}

function drawDaisy(bloom,scale,color,t,phase){
  const count=12;
  const len=20*scale*bloom;
  const w=5*scale*bloom;
  const rot=Math.sin(t*0.7+phase)*0.02;
  for(let i=0;i<count;i++){
    const angle=(Math.PI*2/count)*i+rot;
    ctx.save();ctx.rotate(angle);
    ctx.beginPath();ctx.moveTo(0,0);

    ctx.bezierCurveTo(w*0.7,-len*0.3,w,-len*0.7,0,-len);
    ctx.bezierCurveTo(-w,-len*0.7,-w*0.7,-len*0.3,0,0);
    ctx.fillStyle=color;ctx.globalAlpha=0.9;ctx.fill();
    ctx.strokeStyle='rgba(200,200,200,0.2)';ctx.lineWidth=0.3;ctx.stroke();
    ctx.globalAlpha=1;ctx.restore();
  }

  const cr=6*scale*bloom;
  const cGrad=ctx.createRadialGradient(0,0,0,0,0,cr);
  cGrad.addColorStop(0,'#fff176');cGrad.addColorStop(0.7,'#ffdb58');cGrad.addColorStop(1,'#f9a825');
  ctx.beginPath();ctx.arc(0,0,cr,0,Math.PI*2);
  ctx.fillStyle=cGrad;ctx.fill();
}

function drawCherry(bloom,scale,color,t,phase){
  const count=5;
  const len=16*scale*bloom;
  const w=10*scale*bloom;
  const rot=Math.sin(t*1+phase)*0.03;
  for(let i=0;i<count;i++){
    const angle=(Math.PI*2/count)*i+rot;
    ctx.save();ctx.rotate(angle);
    ctx.beginPath();ctx.moveTo(0,0);

    ctx.bezierCurveTo(w,-len*0.3,w*1.2,-len*0.8,w*0.3,-len);
    ctx.lineTo(0,-len*0.85);
    ctx.lineTo(-w*0.3,-len);
    ctx.bezierCurveTo(-w*1.2,-len*0.8,-w,-len*0.3,0,0);
    ctx.fillStyle=color;ctx.globalAlpha=0.8;ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=0.4;ctx.stroke();
    ctx.globalAlpha=1;ctx.restore();
  }

  const cr=3*scale*bloom;
  ctx.beginPath();ctx.arc(0,0,cr,0,Math.PI*2);
  ctx.fillStyle='#fff176';ctx.fill();

  for(let i=0;i<5;i++){
    const a=(Math.PI*2/5)*i;
    ctx.beginPath();ctx.arc(Math.cos(a)*cr*1.5,Math.sin(a)*cr*1.5,1*scale*bloom,0,Math.PI*2);
    ctx.fillStyle='#ff6b9d';ctx.fill();
  }
}

function lighten(hex,pct){
  let r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  r=Math.min(255,r+pct);g=Math.min(255,g+pct);b=Math.min(255,b+pct);
  return `rgb(${r},${g},${b})`;
}
function darken(hex,pct){
  let r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  r=Math.max(0,r-pct);g=Math.max(0,g-pct);b=Math.max(0,b-pct);
  return `rgb(${r},${g},${b})`;
}

class Flower{
  constructor(x,stemH,flowerType,colorIdx,delay,scale){
    this.x=x;this.baseY=H;this.stemH=stemH;
    this.type=flowerType.type;
    this.color=flowerType.colors[colorIdx%flowerType.colors.length];
    this.glowColor=this.color.replace(')',',0.3)').replace('rgb','rgba').replace('#','');
    this.delay=delay;this.scale=scale||1;
    this.bloom=0;this.bloomSpeed=0.025+Math.random()*0.015;
    this.growProgress=0;this.growSpeed=0.012+Math.random()*0.008;
    this.phase=Math.random()*Math.PI*2;
    this.swayAmp=6+Math.random()*5;
    this.swaySpeed=0.6+Math.random()*0.4;
    this.curve1=(Math.random()-0.5)*30;
    this.curve2=(Math.random()-0.5)*25;
    this.leaves=[];
    const leafCount=1+Math.floor(Math.random()*3);
    for(let i=0;i<leafCount;i++){
      this.leaves.push({t:0.25+Math.random()*0.5,side:i%2===0?1:-1,size:(14+Math.random()*12)*this.scale});
    }
  }
  easeOut(t){return 1-Math.pow(1-t,3)}
  update(t){
    if(t<this.delay)return;
    if(this.growProgress<1)this.growProgress=Math.min(1,this.growProgress+this.growSpeed);
    else if(this.bloom<1)this.bloom=Math.min(1,this.bloom+this.bloomSpeed);
    this.sway=Math.sin((t-this.delay)*this.swaySpeed+this.phase)*this.swayAmp*this.growProgress;
  }
  draw(t){
    if(this.growProgress<=0)return;
    const sway=this.sway||0;
    const currentH=this.stemH*this.easeOut(this.growProgress);
    const tipX=this.x+sway;
    const tipY=this.baseY-currentH;

    ctx.beginPath();ctx.moveTo(this.x,this.baseY);
    const cp1x=this.x+this.curve1*this.growProgress+sway*0.2;
    const cp1y=this.baseY-currentH*0.33;
    const cp2x=this.x+this.curve2*this.growProgress+sway*0.6;
    const cp2y=this.baseY-currentH*0.66;
    ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,tipX,tipY);
    ctx.strokeStyle='#2d8a2d';ctx.lineWidth=3*this.scale;ctx.stroke();

    for(const leaf of this.leaves){
      if(this.growProgress<leaf.t)continue;
      const leafScale=Math.min(1,(this.growProgress-leaf.t)*5);
      const t2=leaf.t,mt=1-t2;
      const lx=mt*mt*mt*this.x+3*mt*mt*t2*cp1x+3*mt*t2*t2*cp2x+t2*t2*t2*tipX;
      const ly=mt*mt*mt*this.baseY+3*mt*mt*t2*cp1y+3*mt*t2*t2*cp2y+t2*t2*t2*tipY;
      ctx.save();ctx.translate(lx,ly);
      ctx.rotate(leaf.side*0.4+sway*0.01);
      ctx.beginPath();ctx.moveTo(0,0);
      const ls=leaf.size*leafScale;
      ctx.quadraticCurveTo(ls*leaf.side,ls*-0.5,ls*1.5*leaf.side,-2);
      ctx.quadraticCurveTo(ls*leaf.side,ls*0.3,0,0);
      ctx.fillStyle='#1a7a1a';ctx.fill();ctx.restore();
    }
    if(this.bloom<=0)return;

    const glowSize=30*this.scale*this.bloom;
    const grad=ctx.createRadialGradient(tipX,tipY,0,tipX,tipY,glowSize);
    const gc=this.color;
    grad.addColorStop(0,gc+'66');grad.addColorStop(1,'transparent');
    ctx.fillStyle=grad;ctx.fillRect(tipX-glowSize,tipY-glowSize,glowSize*2,glowSize*2);

    ctx.save();ctx.translate(tipX,tipY);
    switch(this.type){
      case'rose':drawRose(this.bloom,this.scale,this.color,t,this.phase);break;
      case'tulip':drawTulip(this.bloom,this.scale,this.color,t,this.phase);break;
      case'sunflower':drawSunflower(this.bloom,this.scale,this.color,t,this.phase);break;
      case'daisy':drawDaisy(this.bloom,this.scale,this.color,t,this.phase);break;
      case'cherry':drawCherry(this.bloom,this.scale,this.color,t,this.phase);break;
    }
    ctx.restore();

    if(this.bloom>=1&&Math.random()<0.004){
      particles.push(new Particle(tipX,tipY,this.color));
    }
  }
}

class Particle{
  constructor(x,y,color){
    this.x=x;this.y=y;this.color=color;
    this.vx=(Math.random()-0.5)*1.5;
    this.vy=-Math.random()*1-0.5;
    this.life=1;this.decay=0.008+Math.random()*0.008;
    this.size=3+Math.random()*5;this.rot=Math.random()*Math.PI*2;
    this.rotSpeed=(Math.random()-0.5)*0.05;
  }
  update(){this.x+=this.vx;this.y+=this.vy;this.vy+=0.02;this.vx*=0.99;this.life-=this.decay;this.rot+=this.rotSpeed}
  draw(){
    if(this.life<=0)return;
    ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rot);
    ctx.globalAlpha=this.life*0.7;
    ctx.beginPath();ctx.ellipse(0,0,this.size,this.size*0.6,0,0,Math.PI*2);
    ctx.fillStyle=this.color;ctx.fill();
    ctx.restore();ctx.globalAlpha=1;
  }
}

class Firefly{
  constructor(){this.reset()}
  reset(){
    this.x=Math.random()*W;this.y=Math.random()*H*0.6;
    this.size=2+Math.random()*3;this.phase=Math.random()*Math.PI*2;
    this.speedX=(Math.random()-0.5)*0.5;this.speedY=(Math.random()-0.5)*0.3;
  }
  update(t){
    this.x+=this.speedX+Math.sin(t+this.phase)*0.3;
    this.y+=this.speedY+Math.cos(t*0.7+this.phase)*0.2;
    if(this.x<0||this.x>W||this.y<0||this.y>H)this.reset();
    this.glow=(Math.sin(t*2+this.phase)+1)/2;
  }
  draw(){
    ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.size*3);
    g.addColorStop(0,`rgba(255,255,150,${this.glow*0.9})`);
    g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.fill();
  }
}


let rows;
if(W<600){
  rows=[
    {count:12,stemMin:120,stemMax:200,scaleMin:1.2,scaleMax:1.6,yOffset:0},
    {count:10,stemMin:80,stemMax:140,scaleMin:1.0,scaleMax:1.3,yOffset:30},
    {count:8,stemMin:60,stemMax:110,scaleMin:0.9,scaleMax:1.1,yOffset:55},
  ];
}else if(W<1024){
  rows=[
    {count:14,stemMin:150,stemMax:250,scaleMin:1.3,scaleMax:1.7,yOffset:0},
    {count:12,stemMin:110,stemMax:180,scaleMin:1.1,scaleMax:1.4,yOffset:35},
    {count:8,stemMin:70,stemMax:130,scaleMin:0.9,scaleMax:1.2,yOffset:60},
  ];
}else{
  rows=[
    {count:28,stemMin:180,stemMax:300,scaleMin:1.4,scaleMax:2.0,yOffset:0},
    {count:24,stemMin:140,stemMax:230,scaleMin:1.2,scaleMax:1.7,yOffset:30},
    {count:20,stemMin:100,stemMax:170,scaleMin:1.0,scaleMax:1.4,yOffset:60},
    {count:16,stemMin:70,stemMax:130,scaleMin:0.8,scaleMax:1.2,yOffset:85},
  ];
}
let delayIdx=0;
for(const row of rows){
  for(let i=0;i<row.count;i++){
    const x=W*(0.02+i*(0.96/(row.count-1)))+(Math.random()-0.5)*15;
    const stemH=row.stemMin+Math.random()*(row.stemMax-row.stemMin);
    const scale=row.scaleMin+Math.random()*(row.scaleMax-row.scaleMin);
    const ft=flowerTypes[Math.floor(Math.random()*flowerTypes.length)];
    const colorIdx=Math.floor(Math.random()*ft.colors.length);
    const f=new Flower(x,stemH,ft,colorIdx,delayIdx*0.15,scale);
    f.baseY=H-row.yOffset;
    flowers.push(f);
    delayIdx++;
  }
}

for(let i=0;i<20;i++)fireflies.push(new Firefly());

const grassBlades=[];
for(let i=0;i<200;i++){
  grassBlades.push({x:W*Math.random(),h:40+Math.random()*80,phase:Math.random()*Math.PI*2,width:1.5+Math.random()*2.5});
}

let startTime=null;
let gardenStarted=false;

const envelope=document.getElementById('envelope');
const envelopeWrapper=document.getElementById('envelopeWrapper');
const tapHint=document.getElementById('tapHint');

function revealLetterContent(){
  const items=document.querySelectorAll('.fade-in');
  items.forEach((el,i)=>{
    setTimeout(()=>el.classList.add('visible'),i*200);
  });
}

envelope.addEventListener('click',()=>{
  envelope.classList.add('opened');
  tapHint.style.display='none';
  gardenStarted=true;
  startTime=null;
  setTimeout(()=>{
    envelopeWrapper.classList.add('opened');
    setTimeout(revealLetterContent,900);
  },1600);
});

function animate(ts){
  if(!gardenStarted){requestAnimationFrame(animate);drawBg();return;}
  if(!startTime)startTime=ts;
  const t=(ts-startTime)/1000;
  ctx.clearRect(0,0,W,H);
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#0a0e2a');bg.addColorStop(0.5,'#0c1a2e');bg.addColorStop(1,'#0a2a2a');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  for(const g of grassBlades){
    if(g.h<60)continue;
    const sway=Math.sin(t*1.2+g.phase)*4;
    ctx.beginPath();ctx.moveTo(g.x,H);
    ctx.quadraticCurveTo(g.x+sway,H-g.h*0.6,g.x+sway*1.5,H-g.h);
    ctx.strokeStyle=`hsl(${118+Math.random()*8},55%,${14+Math.random()*8}%)`;
    ctx.lineWidth=g.width;ctx.stroke();
  }
  for(const f of flowers){f.update(t);f.draw(t)}

  for(const g of grassBlades){
    if(g.h>=60)continue;
    const sway=Math.sin(t*1.2+g.phase)*3;
    ctx.beginPath();ctx.moveTo(g.x,H);
    ctx.quadraticCurveTo(g.x+sway,H-g.h*0.6,g.x+sway*1.2,H-g.h);
    ctx.strokeStyle=`hsl(${120+Math.random()*6},60%,${16+Math.random()*10}%)`;
    ctx.lineWidth=g.width;ctx.stroke();
  }
  for(let i=particles.length-1;i>=0;i--){
    particles[i].update();particles[i].draw();
    if(particles[i].life<=0)particles.splice(i,1);
  }
  for(const ff of fireflies){ff.update(t);ff.draw()}
  requestAnimationFrame(animate);
}

function drawBg(){
  ctx.clearRect(0,0,W,H);
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#0a0e2a');bg.addColorStop(0.5,'#0c1a2e');bg.addColorStop(1,'#0a2a2a');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
}

requestAnimationFrame(animate);

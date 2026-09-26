const $ = (s) => document.querySelector(s);

let gender = null;
let image = null;

const steps = [$('#stepGender'), $('#stepUpload'), $('#stepResult')];

function show(n){
  steps.forEach((s,i)=>s.classList.toggle('active',i===n));
  window.scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('.gender-card').forEach(btn => {
  btn.addEventListener('click', () => {
    gender = btn.dataset.gender;
    $('#selectedBadge').textContent = gender === 'boy'
      ? '👦🏻 پڕۆمۆتی کوڕان'
      : '👧🏻 پڕۆمۆتی کچان';
    show(1);
  });
});

$('#backBtn').onclick = () => show(0);

$('#startOverBtn').onclick = () => {
  gender = null;
  image = null;
  $('#preview').src = '';
  $('#photoInput').value = '';
  $('#dropzone').classList.remove('has-image');
  $('#generateBtn').disabled = true;
  show(0);
};

$('#photoInput').onchange = e => loadFile(e.target.files[0]);

['dragenter','dragover'].forEach(ev => $('#dropzone').addEventListener(ev,e => {
  e.preventDefault();
  $('#dropzone').classList.add('drag');
}));

['dragleave','drop'].forEach(ev => $('#dropzone').addEventListener(ev,e => {
  e.preventDefault();
  $('#dropzone').classList.remove('drag');
}));

$('#dropzone').addEventListener('drop', e => loadFile(e.dataTransfer.files[0]));

function loadFile(file){
  if(!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = () => {
    image = new Image();
    image.onload = () => {
      $('#preview').src = reader.result;
      $('#dropzone').classList.add('has-image');
      $('#generateBtn').disabled = false;
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

const boys = [
  {name:'کوردی', base:'#d9f0ff', edge:'#2587c1', dark:'#12659f', deco:'books'},
  {name:'ئینگلیزی', base:'#dce7ff', edge:'#405bb2', dark:'#25418f', deco:'london'},
  {name:'بیرکاری', base:'#e0f6c9', edge:'#49a145', dark:'#218033', deco:'math'},
  {name:'زانست', base:'#d8f3ee', edge:'#15928d', dark:'#08716d', deco:'science'},
  {name:'کۆمەڵایەتی', base:'#f1dfc5', edge:'#a36d3d', dark:'#805128', deco:'social'},
  {name:'پەروەردەی ئیسلامی', base:'#e1f0db', edge:'#4a8a57', dark:'#23643a', deco:'islam'},
  {name:'وەرزش', base:'#ffdcd0', edge:'#e34d37', dark:'#c53725', deco:'sport'},
  {name:'هونەر', base:'#fff0b8', edge:'#e0921e', dark:'#c26b09', deco:'art'}
];

const girls = [
  {name:'کوردی', base:'#ffe2ef', edge:'#df7aa8', dark:'#b94b7c', deco:'books'},
  {name:'ئینگلیزی', base:'#eee3ff', edge:'#9270c4', dark:'#65419d', deco:'london'},
  {name:'بیرکاری', base:'#dff5e4', edge:'#65ad85', dark:'#3d8a63', deco:'math'},
  {name:'زانست', base:'#e7def9', edge:'#8b76bb', dark:'#665099', deco:'science'},
  {name:'کۆمەڵایەتی', base:'#f8e4d5', edge:'#c28f69', dark:'#98613f', deco:'social'},
  {name:'پەروەردەی ئیسلامی', base:'#f5efdd', edge:'#8eac80', dark:'#60785b', deco:'islam'},
  {name:'وەرزش', base:'#dceeff', edge:'#6ca3d8', dark:'#3c76ae', deco:'sport'},
  {name:'هونەر', base:'#ffdcd5', edge:'#e88c7e', dark:'#cc6357', deco:'art'}
];

function rr(c,x,y,w,h,r){
  c.beginPath();
  c.roundRect(x,y,w,h,r);
}

function blob(c,x,y,rx,ry,fill,alpha=.18,rot=0){
  c.save();
  c.translate(x,y);
  c.rotate(rot);
  c.globalAlpha=alpha;
  c.fillStyle=fill;
  c.beginPath();
  for(let i=0;i<18;i++){
    const a=(Math.PI*2*i)/18;
    const wob=0.88 + (i%4)*0.035;
    const px=Math.cos(a)*rx*wob;
    const py=Math.sin(a)*ry*(1+((i%3)-1)*.04);
    if(i===0)c.moveTo(px,py); else c.lineTo(px,py);
  }
  c.closePath();
  c.fill();
  c.restore();
}

function watercolorBg(c,x,y,w,h,pal,idx){
  c.save();
  rr(c,x,y,w,h,34);
  c.clip();
  c.fillStyle=pal.base;
  c.fillRect(x,y,w,h);

  const seeds=[
    [x+w*.10,y+h*.12,w*.20,h*.16,-.3],
    [x+w*.38,y+h*.14,w*.25,h*.13,.2],
    [x+w*.78,y+h*.10,w*.24,h*.16,-.2],
    [x+w*.24,y+h*.56,w*.32,h*.20,.1],
    [x+w*.73,y+h*.70,w*.34,h*.21,-.3],
    [x+w*.50,y+h*.93,w*.38,h*.12,.0]
  ];
  seeds.forEach((s,i)=>blob(c,s[0],s[1],s[2],s[3],pal.edge,.10 + (i%3)*.025,s[4]));

  c.globalAlpha=.15;
  c.fillStyle=pal.edge;
  for(let i=0;i<34;i++){
    const px=x+((i*73+idx*31)%(w-30))+15;
    const py=y+((i*47+idx*17)%(h-30))+15;
    const r=2+(i%4);
    c.beginPath();
    c.arc(px,py,r,0,Math.PI*2);
    c.fill();
  }
  c.restore();

  c.strokeStyle=pal.edge;
  c.lineWidth=7;
  c.globalAlpha=.9;
  rr(c,x,y,w,h,34);
  c.stroke();
  c.globalAlpha=1;
}

function coverImage(c,img,x,y,w,h){
  const ar=img.width/img.height;
  const br=w/h;
  let sw=w,sh=h;
  if(ar>br) sh=w/ar; else sw=h*ar;
  c.drawImage(img,x+(w-sw)/2,y+(h-sh)/2,sw,sh);
}

function drawPortrait(c,img,x,y,w,h,pal){
  c.save();
  // soft watercolor halo
  blob(c,x+w*.50,y+h*.50,w*.54,h*.53,pal.edge,.13,-.08);
  blob(c,x+w*.45,y+h*.50,w*.48,h*.50,'#ffffff',.32,.08);

  // decorative rounded character frame
  rr(c,x+10,y+8,w-20,h-18,42);
  c.fillStyle='#ffffff';
  c.globalAlpha=.9;
  c.fill();
  c.globalAlpha=1;

  rr(c,x+18,y+16,w-36,h-34,36);
  c.clip();
  coverImage(c,img,x+18,y+16,w-36,h-34);

  // soft fade over lower edge
  const fade=c.createLinearGradient(0,y+h*.68,0,y+h);
  fade.addColorStop(0,'rgba(255,255,255,0)');
  fade.addColorStop(1,'rgba(255,255,255,.38)');
  c.fillStyle=fade;
  c.fillRect(x,y+h*.62,w,h*.38);
  c.restore();

  c.strokeStyle='#ffffff';
  c.lineWidth=8;
  rr(c,x+18,y+16,w-36,h-34,36);
  c.stroke();

  // little leaf accents beside the portrait
  c.strokeStyle=pal.dark;
  c.lineWidth=4;
  c.globalAlpha=.65;
  c.beginPath();
  c.moveTo(x+w-4,y+h*.78);
  c.quadraticCurveTo(x+w*.92,y+h*.67,x+w*.98,y+h*.57);
  c.stroke();
  for(let i=0;i<3;i++){
    blob(c,x+w*(.91+i*.035),y+h*(.64-i*.08),13,8,pal.dark,.4,-.4);
  }
  c.globalAlpha=1;
}

function titleRibbon(c,text,x,y,w,pal){
  c.save();
  c.translate(x,y);
  c.rotate(-.015);

  // painted-looking underlay
  blob(c,w*.5,31,w*.55,34,pal.dark,.82,-.015);
  blob(c,w*.48,27,w*.50,29,pal.edge,.88,.01);

  c.fillStyle='#fff';
  c.font='900 60px "Noto Sans Arabic", Tahoma, Arial';
  c.textAlign='center';
  c.textBaseline='middle';
  c.shadowColor='rgba(0,0,0,.12)';
  c.shadowBlur=4;
  c.fillText(text,w*.5,30);
  c.shadowBlur=0;
  c.restore();
}

function panel(c,x,y,w,h,pal){
  c.save();
  rr(c,x,y,w,h,30);
  c.fillStyle='rgba(255,255,255,.88)';
  c.fill();
  c.strokeStyle='#ffffff';
  c.lineWidth=5;
  c.stroke();

  // subtle inner frame
  rr(c,x+16,y+16,w-32,h-32,23);
  c.strokeStyle=pal.edge;
  c.globalAlpha=.22;
  c.lineWidth=3;
  c.stroke();
  c.globalAlpha=1;
  c.restore();
}

function dottedLine(c,x1,x2,y,pal){
  c.save();
  c.strokeStyle=pal.edge;
  c.globalAlpha=.62;
  c.lineWidth=3;
  c.setLineDash([5,8]);
  c.beginPath();
  c.moveTo(x1,y); c.lineTo(x2,y); c.stroke();
  c.setLineDash([]);
  c.restore();
}

function drawBooks(c,x,y,scale,pal){
  c.save(); c.translate(x,y); c.scale(scale,scale);
  const colors=[pal.dark,pal.edge,'#d95a51'];
  for(let i=0;i<3;i++){
    const yy=i*34;
    c.fillStyle=colors[i];
    c.beginPath(); c.roundRect(-120,yy,210,38,8); c.fill();
    c.fillStyle='#fff'; c.globalAlpha=.85;
    c.fillRect(-85,yy+7,135,5); c.globalAlpha=1;
  }
  c.strokeStyle=pal.dark; c.lineWidth=7;
  c.beginPath(); c.moveTo(92,-8); c.quadraticCurveTo(120,30,108,75); c.stroke();
  c.fillStyle=pal.dark;
  c.beginPath(); c.ellipse(106,2,14,7,-.4,0,Math.PI*2); c.fill();
  c.restore();
}

function drawLondon(c,x,y,scale,pal){
  c.save(); c.translate(x,y); c.scale(scale,scale);
  c.fillStyle=pal.dark;
  c.fillRect(-115,0,230,118);
  c.fillRect(-34,-92,68,210);
  c.fillStyle='#fff';
  c.globalAlpha=.9;
  for(let i=-84;i<=84;i+=42)c.fillRect(i,24,22,28);
  c.fillRect(-24,-52,48,36);
  c.globalAlpha=1;
  c.strokeStyle=pal.dark;c.lineWidth=6;
  c.beginPath();c.moveTo(-56,-92);c.lineTo(0,-145);c.lineTo(56,-92);c.stroke();
  c.fillStyle=pal.edge;c.beginPath();c.arc(0,-30,18,0,Math.PI*2);c.fill();
  // small flag
  c.fillStyle='#e34d48'; c.fillRect(0,-170,54,31);
  c.fillStyle='#fff';c.fillRect(22,-170,10,31);c.fillRect(0,-160,54,10);
  c.restore();
}

function drawCalculator(c,x,y,scale,pal){
  c.save();c.translate(x,y);c.scale(scale,scale);
  rr(c,-86,-108,172,218,20);c.fillStyle='#fff';c.fill();c.strokeStyle=pal.dark;c.lineWidth=9;c.stroke();
  rr(c,-58,-78,116,46,9);c.fillStyle=pal.base;c.fill();c.strokeStyle=pal.edge;c.lineWidth=5;c.stroke();
  for(let r=0;r<4;r++)for(let col=0;col<3;col++){
    c.fillStyle=pal.dark;c.globalAlpha=.85;
    c.beginPath();c.arc(-43+43*col,-5+43*r,10,0,Math.PI*2);c.fill();c.globalAlpha=1;
  }
  c.restore();
}

function drawScience(c,x,y,scale,pal){
  c.save();c.translate(x,y);c.scale(scale,scale);
  c.strokeStyle=pal.dark;c.lineWidth=9;c.lineCap='round';
  c.beginPath();c.moveTo(-15,-125);c.lineTo(-15,-40);c.lineTo(-52,58);c.quadraticCurveTo(-58,88,0,88);c.quadraticCurveTo(58,88,52,58);c.lineTo(15,-40);c.lineTo(15,-125);c.stroke();
  c.fillStyle=pal.base;c.globalAlpha=.9;
  c.beginPath();c.moveTo(-50,28);c.lineTo(50,28);c.lineTo(43,65);c.quadraticCurveTo(0,88,-43,65);c.closePath();c.fill();c.globalAlpha=1;
  c.strokeStyle=pal.edge;c.lineWidth=6;c.beginPath();c.arc(-84,-10,28,0,Math.PI*2);c.stroke();
  c.beginPath();c.arc(-84,-10,10,0,Math.PI*2);c.stroke();
  c.restore();
}

function drawSocial(c,x,y,scale,pal){
  c.save();c.translate(x,y);c.scale(scale,scale);
  c.fillStyle=pal.base;c.beginPath();c.ellipse(0,0,120,80,-.15,0,Math.PI*2);c.fill();
  c.strokeStyle=pal.dark;c.lineWidth=6;c.stroke();
  c.strokeStyle=pal.edge;c.lineWidth=4;
  c.beginPath();c.arc(0,0,64,0,Math.PI*2);c.stroke();
  c.beginPath();c.moveTo(-64,0);c.lineTo(64,0);c.stroke();
  c.beginPath();c.ellipse(0,0,26,64,0,0,Math.PI*2);c.stroke();
  // compass
  c.strokeStyle=pal.dark;c.lineWidth=8;
  c.beginPath();c.moveTo(90,75);c.lineTo(132,110);c.moveTo(132,75);c.lineTo(90,110);c.stroke();
  c.restore();
}

function drawIslam(c,x,y,scale,pal){
  c.save();c.translate(x,y);c.scale(scale,scale);
  // Quran
  c.fillStyle='#244f3c';rr(c,-112,-80,105,150,15);c.fill();
  c.strokeStyle='#d8b65b';c.lineWidth=5;c.stroke();
  c.strokeStyle='#d8b65b';c.lineWidth=4;c.beginPath();c.moveTo(-92,-25);c.lineTo(-22,-25);c.moveTo(-92,0);c.lineTo(-22,0);c.stroke();
  // lantern
  c.fillStyle='#e0a74a';c.fillRect(35,-35,58,95);
  c.strokeStyle='#8b5d28';c.lineWidth=6;c.strokeRect(35,-35,58,95);
  c.beginPath();c.moveTo(45,-35);c.lineTo(45,-65);c.lineTo(83,-65);c.lineTo(83,-35);c.stroke();
  c.restore();
}

function drawSport(c,x,y,scale,pal){
  c.save();c.translate(x,y);c.scale(scale,scale);
  // ball
  c.fillStyle='#fff';c.beginPath();c.arc(60,25,62,0,Math.PI*2);c.fill();c.strokeStyle=pal.dark;c.lineWidth=7;c.stroke();
  c.fillStyle=pal.dark;c.beginPath();c.moveTo(60,-4);c.lineTo(82,12);c.lineTo(73,38);c.lineTo(45,38);c.lineTo(36,12);c.closePath();c.fill();
  // shoe
  c.fillStyle=pal.edge;c.beginPath();c.roundRect(-126,28,155,48,20);c.fill();
  c.fillStyle='#fff';c.fillRect(-96,36,89,6);
  c.strokeStyle=pal.dark;c.lineWidth=7;c.beginPath();c.moveTo(-118,78);c.lineTo(25,78);c.stroke();
  c.restore();
}

function drawArt(c,x,y,scale,pal){
  c.save();c.translate(x,y);c.scale(scale,scale);
  c.fillStyle='#e8a83f';c.beginPath();c.ellipse(-55,25,105,62,-.2,0,Math.PI*2);c.fill();
  c.fillStyle='#fff';c.beginPath();c.arc(-88,18,12,0,Math.PI*2);c.fill();
  c.fillStyle='#e85c54';c.beginPath();c.arc(-43,4,13,0,Math.PI*2);c.fill();
  c.fillStyle='#64a86f';c.beginPath();c.arc(0,18,13,0,Math.PI*2);c.fill();
  c.fillStyle='#658bd0';c.beginPath();c.arc(38,40,13,0,Math.PI*2);c.fill();
  // brushes
  c.strokeStyle=pal.dark;c.lineWidth=12;c.lineCap='round';
  c.beginPath();c.moveTo(45,-82);c.lineTo(115,-10);c.moveTo(76,-96);c.lineTo(132,-45);c.stroke();
  c.restore();
}

function drawDecoration(c,type,x,y,scale,pal){
  switch(type){
    case 'books': drawBooks(c,x,y,scale,pal); break;
    case 'london': drawLondon(c,x,y,scale,pal); break;
    case 'math': drawCalculator(c,x,y,scale,pal); break;
    case 'science': drawScience(c,x,y,scale,pal); break;
    case 'social': drawSocial(c,x,y,scale,pal); break;
    case 'islam': drawIslam(c,x,y,scale,pal); break;
    case 'sport': drawSport(c,x,y,scale,pal); break;
    case 'art': drawArt(c,x,y,scale,pal); break;
  }
}

const fields = ['ناو:','پۆل:','قوتابخانە:','بابەت:'];

function drawSticker(c,x,y,w,h,s,idx){
  const pal=s;
  watercolorBg(c,x,y,w,h,pal,idx);

  // corner brush flecks
  c.save();
  c.globalAlpha=.18;
  c.fillStyle=pal.dark;
  for(let i=0;i<7;i++){
    c.fillRect(x+20+i*24,y+h-38-(i%3)*8,12+(i%4)*8,4);
  }
  c.restore();

  const portraitW=w*.38;
  const portraitX=x+22;
  const portraitY=y+84;
  const portraitH=h-105;
  drawPortrait(c,image,portraitX,portraitY,portraitW,portraitH,pal);

  const panelX=x+w*.39;
  const panelY=y+104;
  const panelW=w*.575;
  const panelH=h-128;
  panel(c,panelX,panelY,panelW,panelH,pal);

  titleRibbon(c, s.name, panelX+12, y+18, panelW-24, pal);

  // subject decoration inside the lower left of the panel
  drawDecoration(c,s.deco,panelX+panelW*.21,panelY+panelH*.76,Math.min(panelW/480,.72),pal);

  c.fillStyle=pal.dark;
  c.globalAlpha=.9;
  c.font='800 27px "Noto Sans Arabic", Tahoma, Arial';
  c.textAlign='right';
  c.fillText(gender==='boy'?'لیبڵی خوێندنگەی کوڕان':'لیبڵی خوێندنگەی کچان',panelX+panelW-28,panelY+panelH-20);
  c.globalAlpha=1;

  // Writable area
  const fx=panelX+panelW*.38;
  const right=panelX+panelW-28;
  const firstY=panelY+72;
  c.font='800 27px "Noto Sans Arabic", Tahoma, Arial';
  fields.forEach((label,j)=>{
    const yy=firstY+j*92;
    c.fillStyle=pal.dark;
    c.textAlign='right';
    c.fillText(label,right,yy);
    dottedLine(c,fx,right-3,yy+22,pal);
  });

  // small subject dots / stars
  c.fillStyle=pal.dark;
  for(let k=0;k<4;k++){
    c.globalAlpha=.55;
    c.beginPath(); c.arc(panelX+panelW*(.77+k*.055),panelY+panelH*.18+(k%2)*16,4+k%2,0,Math.PI*2); c.fill();
  }
  c.globalAlpha=1;
}

async function drawSheet(){
  await document.fonts.ready;
  const canvas=$('#sheet');
  const c=canvas.getContext('2d');
  const W=2480,H=3508;
  c.clearRect(0,0,W,H);
  c.fillStyle='#ffffff';
  c.fillRect(0,0,W,H);

  const gap=28, margin=42;
  const cw=(W-margin*2-gap)/2;
  const ch=(H-margin*2-gap*3)/4;
  const list=gender==='boy'?boys:girls;

  list.forEach((s,i)=>{
    const col=i%2,row=Math.floor(i/2);
    const x=margin+col*(cw+gap);
    const y=margin+row*(ch+gap);
    drawSticker(c,x,y,cw,ch,s,i);
  });
}

$('#generateBtn').onclick = async () => {
  if(!image) return;
  $('#generateBtn').disabled=true;
  $('#generateBtn').textContent='خەریکە دروست دەکرێت... ✨';
  await drawSheet();
  $('#generateBtn').disabled=false;
  $('#generateBtn').textContent='دروستکردنی لیبڵەکان ✨';
  show(2);
};

$('#downloadBtn').onclick = () => {
  const a=document.createElement('a');
  a.download=`kurdish-school-labels-${gender}.png`;
  a.href=$('#sheet').toDataURL('image/png');
  a.click();
};

$('#printBtn').onclick = () => {
  const data=$('#sheet').toDataURL('image/png');
  const w=window.open('','_blank');
  if(!w) return;
  w.document.write(`<!doctype html><html><head><title>A4 Labels</title><style>@page{size:A4 portrait;margin:0}html,body{margin:0;padding:0;background:#fff}img{width:210mm;height:297mm;display:block}</style></head><body><img src="${data}"></body></html>`);
  w.document.close();
  w.onload=()=>w.print();
};
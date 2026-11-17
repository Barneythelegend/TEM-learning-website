(() => {
'use strict';
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const stateKey='tem-insight-lab-v1';
let state={modules:{},questions:{},drafts:{}};
try{const v=JSON.parse(localStorage.getItem(stateKey)||'{}'); if(v&&typeof v==='object')state={modules:v.modules||{},questions:v.questions||{},drafts:v.drafts||{}}}catch(e){}
const save=()=>{try{localStorage.setItem(stateKey,JSON.stringify(state))}catch(e){}};
const toast=(t)=>{let el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2600)};
const htmlEscape=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const btnGroup=(sel,attr,val)=>{$$(sel+' [data-'+attr+']').forEach(b=>b.classList.toggle('active',b.dataset[attr]===val))};
const norm=(x,a,b)=>Math.max(0,Math.min(1,(x-a)/(b-a)));
const addSvg=(parent,name,attrs)=>{const el=document.createElementNS('http://www.w3.org/2000/svg',name);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));parent.appendChild(el);return el;};
function updateProgress(){const n=Object.values(state.modules).filter(Boolean).length;const mastered=Object.values(state.questions).filter(x=>x==='mastered').length;$('#progressText').textContent=`${n} / 8`;$('#progressFill').style.width=(n/8*100)+'%';$('#learnedCount').textContent=`${mastered} / 62`;}$$('.module-check').forEach(input=>{input.checked=!!state.modules[input.dataset.module];input.addEventListener('change',()=>{state.modules[input.dataset.module]=input.checked;save();updateProgress();toast(input.checked?'章節完成，進度已儲存':'章節已標為待複習')})});updateProgress();
const partInfo={
 gun:'電子槍（Electron gun）提供電子，常見 W/LaB₆ 熱發射與 FEG 場發射。FEG 可提供較高亮度、較小虛擬源尺寸，利於高解析與光譜；能量散布也會影響色差與 EELS 解析。',
 condenser:'Condenser lenses 與 condenser aperture 控制照明大小、束流與會聚角。TEM 的近平行照明與 STEM 的會聚探針需要不同設定。越大束流不等於永遠越好，還須平衡樣品受損與訊噪比。',
 sample:'高能電子穿透很薄的試片，可能產生彈性繞射、非彈性能量損失及特徵 X-ray。電子散射訊號會沿厚度投影，這就是為什麼製樣厚度、取向和污染非常重要。',
 objective:'Objective lens 的 Back Focal Plane 具有繞射圖樣，Image Plane 對應實空間影像。物鏡的像差、離焦與穩定度控制了高解析成像品質。',
 aperture:'Condenser aperture 選入射角；Objective aperture 選透射或繞射束，決定 BF/DF；Selected-area aperture 以實空間選定 SADP 的區域。這是口試最常混淆的三個光闌。',
 projector:'Intermediate／Projector lenses 切換並放大物鏡形成的「像平面」或「後焦平面」到相機，因此同一台 TEM 可以切換影像與電子繞射圖樣。'
};
function setPart(v){btnGroup('#partBtns','part',v);$('#partExplain').textContent=partInfo[v]}$$('#partBtns [data-part]').forEach(b=>b.addEventListener('click',()=>setPart(b.dataset.part)));setPart('gun');
function lambdaPm(kV){const v=kV*1000;return 1226.0/Math.sqrt(v*(1+0.978e-6*v));}
function updateVoltage(){const v=+$('#voltage').value,lambda=lambdaPm(v);$('#voltageOut').textContent=v+' kV';$('#wavelength').textContent=lambda.toFixed(2)+' pm';$('#lambdaRatio').textContent='1/'+Math.round(500000/lambda).toLocaleString('en-US');$('#energyKV').textContent=v+' keV';}$('#voltage').addEventListener('input',updateVoltage);updateVoltage();
const prepTexts={
 fib:{caption:'FIB 截面薄片：選定位點，鍍保護層，離子銑削，lift-out，再低能量清理。',expl:'特別適合晶片、金屬接觸、異質整合與局部失效位置。可保留指定截面，但可能產生 Ga 植入、非晶層、curtaining 與 redeposition。',label:'FIB Ga+ ion beam'},
 pips:{caption:'PIPS／Ar ion milling：把機械薄化後的薄片進一步以低角度離子研磨至電子透明。',expl:'適合較大範圍的平面或截面薄片，可避開 FIB 的特定 Ga 植入，但仍須注意表面損傷、差異研磨與局部薄化不均。',label:'Ar+ low-angle milling'},
 drop:{caption:'Dispersion / drop-cast：將奈米顆粒、奈米線等稀釋分散後滴到有支撐膜的 TEM grid。',expl:'製備簡單且不必切片，但乾燥過程容易讓顆粒聚集或選擇性沉積；影像可能含有多顆粒重疊，不能直接代表原溶液的均勻分布。',label:'Dispersed particles'},
 micro:{caption:'Ultramicrotomy：包埋後用超薄切片機取得柔軟材料、聚合物或生物樣品薄片。',expl:'可取得厚度相對均勻的薄片，卻可能帶來切割壓縮、刀痕、包埋劑背景、界面拉扯與染色對比假象。',label:'Ultrathin section'}
};
function setPrep(key){btnGroup('#prepModes','prep',key);$('#prepCaption').textContent=prepTexts[key].caption;$('#prepExplain').textContent=prepTexts[key].expl;const svg=$('#prepSVG');if(key==='fib')svg.innerHTML='<rect width="500" height="260" fill="#102337"/><rect x="55" y="147" width="385" height="28" fill="#899eaa"/><rect x="55" y="122" width="385" height="25" fill="#dfb780"/><rect x="55" y="108" width="385" height="14" fill="#79b1d7"/><rect x="180" y="90" width="128" height="18" fill="#a5e4d2"/><path d="M116 35 L240 107" stroke="#63e7d0" stroke-width="9" opacity=".75"/><path d="M237 108 V175 M261 108 V175" stroke="#fff" stroke-width="3" stroke-dasharray="5 4"/><text x="118" y="27" font-size="17" fill="#aafce4">Ga+ FIB beam</text><text x="167" y="219" font-size="15" fill="#d7e7ee">site-specific cross-section</text>';else if(key==='pips')svg.innerHTML='<rect width="500" height="260" fill="#102337"/><path d="M55 154 Q250 130 445 154 L445 188 Q250 182 55 188Z" fill="#91adc0"/><path d="M75 60 L228 144 M426 60 L271 144" stroke="#5ef3df" stroke-width="8" stroke-linecap="round" opacity=".7"/><path d="M220 141 L280 141 L280 178 L220 178Z" fill="#d9c18b"/><text x="250" y="35" font-size="16" fill="#b4f4e7" text-anchor="middle">Low-angle ion milling</text><text x="250" y="227" font-size="14" fill="#d0e8f4" text-anchor="middle">electron-transparent centre</text>';else if(key==='drop')svg.innerHTML='<rect width="500" height="260" fill="#102337"/><ellipse cx="250" cy="163" rx="183" ry="50" fill="#173a4e" stroke="#6c9db5" stroke-width="4"/><path d="M82 145 H417 M98 170 H402 M127 191 H370 M140 125 L175 204 M205 117 L230 211 M270 116 L296 211 M335 121 L359 202" stroke="#7bafc1" stroke-width="1.2" opacity=".6"/>'+Array.from({length:23},(_,i)=>{const x=110+(i*41)%270,y=139+(i*19)%47;return `<circle cx="${x}" cy="${y}" r="${3+(i%3)}" fill="#ffe0a9"/>`}).join('')+'<text x="250" y="52" font-size="16" text-anchor="middle" fill="#aafce5">Nanocrystals on carbon support grid</text>';else svg.innerHTML='<rect width="500" height="260" fill="#102337"/><rect x="72" y="93" width="350" height="86" rx="8" fill="#94abc4"/><path d="M72 122 H422 M72 149 H422" stroke="#ffe3ac" stroke-width="5"/><path d="M384 55 L322 94 L322 178 L389 201" fill="none" stroke="#72f3d1" stroke-width="10"/><text x="250" y="37" font-size="16" text-anchor="middle" fill="#aafce5">Ultramicrotome & diamond knife</text><text x="250" y="228" font-size="13" text-anchor="middle" fill="#d9e7f0">Thin section peeled from embedded block</text>';}$$('#prepModes [data-prep]').forEach(b=>b.addEventListener('click',()=>setPrep(b.dataset.prep)));setPrep('fib');
const real=$('#realDots'),recip=$('#recipDots'),diffSpacing=$('#diffSpacing');
function drawDiffSpacing(){
  const d=Number(diffSpacing.value), g=1/d;
  $('#diffSpacingOut').textContent=d.toFixed(2)+' nm';
  $('#diffSpacingReadout').textContent=`d = ${d.toFixed(2)} nm　→　g = ${g.toFixed(2)} nm⁻¹`;
  real.replaceChildren();recip.replaceChildren();
  const realPitch=24+20*(d-0.2)/0.3;
  const reciprocalPitch=18+25*(0.5-d)/0.3;
  for(let i=0;i<5;i++)for(let j=0;j<3;j++){
    addSvg(real,'circle',{cx:(132+(i-2)*realPitch).toFixed(2),cy:42+j*50,r:5,fill:i===2&&j===1?'#f9ca8c':'#94d6e5'});
    addSvg(recip,'circle',{cx:(399+(i-2)*reciprocalPitch).toFixed(2),cy:42+j*50,r:i===2&&j===1?5:3.2,fill:i===2&&j===1?'#fff':'#a1f8df'});
  }
  addSvg(real,'line',{x1:132,x2:132+realPitch,y1:175,y2:175,stroke:'#ffcf86','stroke-width':2.3});
  addSvg(recip,'line',{x1:399,x2:399+reciprocalPitch,y1:175,y2:175,stroke:'#ffcf86','stroke-width':2.3});
}
// Keep both section controls in sync. Do not call the formation redraw before its listener is registered.
diffSpacing.addEventListener('input',()=>{
  drawDiffSpacing();
  const other=$('#formationSpacing');
  if(other){other.value=diffSpacing.value;other.dispatchEvent(new Event('input',{bubbles:true}));}
});
const formationSlider=$('#formationSpacing');
if(formationSlider) formationSlider.addEventListener('input',()=>{diffSpacing.value=formationSlider.value;drawDiffSpacing()});
drawDiffSpacing();
const crystalDefs={si110:{a:.5431,type:'diamond',zone:'110',name:'Silicon (diamond) [110]'},cu001:{a:.3615,type:'fcc',zone:'001',name:'Copper (FCC) [001]'},fe001:{a:.2866,type:'bcc',zone:'001',name:'Iron (BCC) [001]'},si001:{a:.5431,type:'diamond',zone:'001',name:'Silicon (diamond) [001]'}};
let spots=[],selSpot=null;
function allowed(h,k,l,type){if(type==='bcc')return (h+k+l)%2===0;if(type==='fcc')return (Math.abs(h%2)===Math.abs(k%2)&&Math.abs(k%2)===Math.abs(l%2));if(type==='diamond'){const odds=[h,k,l].map(x=>Math.abs(x)%2);if(odds.every(x=>x===1))return true;if(odds.every(x=>x===0))return ((h+k+l)%4+4)%4===0;return false;}return true;}
const hkl=(p)=>`(${[p.h,p.k,p.l].map(v=>v===0?'0':v<0?String(v):String(v)).join(' ')})`;
function updateSpot(p){if(!p)return;selSpot=p;$('#spotIndex').textContent=hkl(p);$('#spotD').textContent=p.r0? p.d.toFixed(4)+' nm' : '—';$('#spotR').textContent=p.r0?p.R.toFixed(2)+' mm':'0 mm';$('#diffExplain').textContent=p.r0?(p.virtual?`這是 ${hkl(p)}，理想運動學禁制點。真實 Si [110] TEM 因多重散射有機會看到禁制位置的訊號；這裡只示意可能出現，不代表強度可由本模型預測。`:`${crystalDefs[$('#crystal').value].name}：${hkl(p)}，d = ${p.d.toFixed(4)} nm，R ≈ Lλ/d = ${p.R.toFixed(2)} mm。改 Camera Length 看圖樣間距；晶體本身 d 不會變。`):'中央 (000) 是直射束。選取周圍繞射點可以查看 hkl、晶面間距 d 與 R。';}
function drawDiff(){const cv=$('#diffCanvas'),ctx=cv.getContext('2d');const key=$('#crystal').value,def=crystalDefs[key],L=+$('#cameraLength').value,kv=+$('#diffVoltage').value,lam=lambdaPm(kv)*.001,allowVirtual=$('#doubleDiff').checked&&key==='si110';$('#cameraOut').textContent=L+' mm';$('#diffVoltageOut').textContent=kv+' kV';ctx.fillStyle='#091724';ctx.fillRect(0,0,500,500);ctx.strokeStyle='rgba(96,156,175,.1)';for(let v=25;v<500;v+=25){ctx.beginPath();ctx.moveTo(v,0);ctx.lineTo(v,500);ctx.moveTo(0,v);ctx.lineTo(500,v);ctx.stroke();}const center=250,coef=15;ctx.strokeStyle='#4e7590';ctx.beginPath();ctx.moveTo(center,0);ctx.lineTo(center,500);ctx.moveTo(0,center);ctx.lineTo(500,center);ctx.stroke();spots=[];const candidates=[];if(def.zone==='110'){for(let h=-5;h<=5;h++)for(let l=-5;l<=5;l++){const k=-h;if(h===0&&l===0)continue;const good=allowed(h,k,l,def.type);const virt=allowVirtual&&h===0&&Math.abs(l)===2;if(!good&&!virt)continue;candidates.push({h,k,l,good,virtual:virt,xg:Math.SQRT2*h,yg:l});}}else{for(let h=-6;h<=6;h++)for(let k=-6;k<=6;k++){if(!h&&!k)continue;const l=0;const good=allowed(h,k,l,def.type);if(!good)continue;candidates.push({h,k,l,good,virtual:false,xg:h,yg:k});}}spots.push({h:0,k:0,l:0,r0:false,x:center,y:center,d:Infinity,R:0,virtual:false});
for(const c of candidates){const mult=Math.sqrt(c.h*c.h+c.k*c.k+c.l*c.l),d=def.a/mult,R=L*lam/d,x=center+coef*L*lam*c.xg/def.a,y=center-coef*L*lam*c.yg/def.a;if(x<10||x>490||y<10||y>490)continue;spots.push({...c,d,R,r0:true,x,y});}
for(const p of spots){const active=selSpot&&selSpot.h===p.h&&selSpot.k===p.k&&selSpot.l===p.l;if(p.r0){const rad=p.virtual?4:Math.max(2.4,5.7-0.22*Math.sqrt(p.h*p.h+p.k*p.k+p.l*p.l));ctx.fillStyle=p.virtual?'#ffa781':'#b4ffe9';ctx.shadowColor=p.virtual?'#ffbd86':'#65e3d9';ctx.shadowBlur=p.virtual?14:8;ctx.beginPath();ctx.arc(p.x,p.y,rad,0,2*Math.PI);ctx.fill();ctx.shadowBlur=0;}else{ctx.fillStyle='#fff';ctx.shadowColor='#fff';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(p.x,p.y,7,0,2*Math.PI);ctx.fill();ctx.shadowBlur=0;}if(active){ctx.strokeStyle='#ffd290';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,12,0,Math.PI*2);ctx.stroke();ctx.lineWidth=1;}}
$('#diffMaterialName').textContent=def.name;
const chosen=selSpot&&spots.find(p=>p.h===selSpot.h&&p.k===selSpot.k&&p.l===selSpot.l);if(chosen)updateSpot(chosen);else updateSpot(spots[0]);}
['#cameraLength','#diffVoltage','#crystal','#doubleDiff'].forEach(s=>$(s).addEventListener(s==='#doubleDiff'||s==='#crystal'?'change':'input',drawDiff));$('#diffCanvas').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)*500/r.width,y=(e.clientY-r.top)*500/r.height;let best=null,bd=22;for(const p of spots){const d=Math.hypot(p.x-x,p.y-y);if(d<bd){best=p;bd=d}}if(best){updateSpot(best);drawDiff();}});drawDiff();
let imageMode='bf';function drawBFDF(){const t=+$('#tilt').value;$('#tiltOut').textContent=t+'°';const excA=Math.exp(-Math.pow((t+3)/4.5,2)),excB=Math.exp(-Math.pow((t-4)/4.5,2));const brightness=(exc)=>imageMode==='bf'?.83-.65*exc:imageMode==='df'?.12+.79*exc:.58-.12*exc;const valA=brightness(excA),valB=brightness(excB);$('#grainA').textContent=Math.round(valA*100)+' %';$('#grainB').textContent=Math.round(valB*100)+' %';const canvas=$('#bfdfCanvas'),w=canvas.width,h=canvas.height,ctx=canvas.getContext('2d'),im=ctx.createImageData(w,h),pix=im.data;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const xcut=w/2+22*Math.sin(y/38),idx=(y*w+x)*4,left=x<xcut,v=left?valA:valB;const noise=((x*7+y*19+x*y*3)%67)/67-.5;const lattice=Math.sin((left?x+y*.28:x-y*.34)/4.3);const bound=Math.abs(x-xcut)<3?-.18:0;const level=Math.max(0,Math.min(255,(v+noise*.11+lattice*.055+bound)*245));pix[idx]=level*.89;pix[idx+1]=level*.99;pix[idx+2]=level*1.04;pix[idx+3]=255;}ctx.putImageData(im,0,0);ctx.strokeStyle='#56ead1';ctx.setLineDash([4,6]);ctx.lineWidth=2;ctx.beginPath();for(let y=0;y<h;y+=5){let xc=w/2+22*Math.sin(y/38);if(y===0)ctx.moveTo(xc,y);else ctx.lineTo(xc,y);}ctx.stroke();ctx.setLineDash([]);$('#bfdfExplain').textContent=imageMode==='bf'?`明場成像（Bright-Field，BF）：物鏡光闌主要讓直射束 (000) 通過；符合繞射條件的晶粒把部分電子分配到繞射方向，因此在明場中可能變暗。傾角 ${t}° 時 A ≈ ${Math.round(valA*100)}%、B ≈ ${Math.round(valB*100)}%（僅相對模擬）。`:imageMode==='df'?`暗場成像（Dark-Field，DF）：物鏡光闌選擇一個指定繞射束 g，對此繞射條件有較強訊號的晶粒可能變亮。轉動樣品角度，亮暗可交換；不能因此說亮的一定比較厚或元素較重。`:'較大的物鏡光闌（Objective Aperture）同時收進多個束，對比可能降低，但資訊也可能更豐富；不能把這理解成所有模式都必須有單一束。';const ar=$('#apertureRing');ar.setAttribute('cx',imageMode==='df'?'290':'220');ar.setAttribute('r',imageMode==='noap'?'90':'21');}
$$('#imageModes [data-imgmode]').forEach(b=>b.addEventListener('click',()=>{imageMode=b.dataset.imgmode;btnGroup('#imageModes','imgmode',imageMode);drawBFDF()}));$('#tilt').addEventListener('input',drawBFDF);drawBFDF();
function drawHRTEM(){const def=+$('#defocus').value,t=+$('#thickness').value,masked=$('#maskFFT').checked;$('#defocusOut').textContent=(def>=0?'+':'')+def+' nm';$('#thicknessOut').textContent=t+' nm';const c=$('#hrCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height,img=ctx.createImageData(w,h);const contrast=Math.sin(def*Math.PI/100)*.34*Math.exp(-Math.pow((t-28)/65,2));for(let y=0;y<h;y++)for(let x=0;x<w;x++){const phase1=Math.cos(2*Math.PI*(x+y*.29)/17),phase2=Math.cos(2*Math.PI*(x*.21-y)/20),noise=(((x*53+y*17+x*y*11)%97)/97-.5)*.09;let value=.47+contrast*(masked?0:phase1)*.55+contrast*phase2*.58+noise;value=Math.max(0,Math.min(1,value));const k=(y*w+x)*4;img.data[k]=value*219;img.data[k+1]=value*238;img.data[k+2]=value*245;img.data[k+3]=255;}ctx.putImageData(img,0,0);const cv=$('#fftCanvas'),f=cv.getContext('2d');f.fillStyle='#081827';f.fillRect(0,0,cv.width,cv.height);const glow=(x,y,r,col)=>{f.fillStyle=col;f.shadowColor=col;f.shadowBlur=12;f.beginPath();f.arc(x,y,r,0,Math.PI*2);f.fill();f.shadowBlur=0;};glow(160,140,7,'#fff');const strength=Math.abs(contrast);if(!masked&&strength>.055){glow(95,119,3+strength*9,'#aef5d9');glow(225,161,3+strength*9,'#aef5d9');}if(strength>.055){glow(130,82,3+strength*8,'#88aaff');glow(190,198,3+strength*8,'#88aaff');}f.strokeStyle='#38566e';f.beginPath();f.moveTo(0,140);f.lineTo(320,140);f.moveTo(160,0);f.lineTo(160,280);f.stroke();$('#hrExplain').textContent=`離焦 ${def} nm、厚度 ${t} nm：影像中的明暗條紋會改變，甚至反轉；FFT 斑點也取決於影像是否呈現可辨識的週期訊號。${masked?'你把一組頻率從影像中移除，是在做影像處理，不代表原本晶格真的消失。':''}`;}
['#defocus','#thickness','#maskFFT'].forEach(s=>$(s).addEventListener(s==='#maskFFT'?'change':'input',drawHRTEM));drawHRTEM();
const defectDescriptions={perfect:['完美 FCC 堆疊：ABCABCABC…','晶面以 ABC 重複排列；此圖是概念示意，不代表特定晶向的原子解析影像。'],sf:['Stacking fault：局部堆疊次序被中斷','例如 ABCABC 變成 ABCABABC…；可形成薄層狀缺陷和特定的衍射／DF 對比。'],twin:['Twin：界面兩側具有鏡像取向關係','FCC 常見的雙晶界會在界面兩側形成對稱的堆疊關係，SAED 可能產生額外取向的繞射點。'],dislocation:['Dislocation：晶體中多出／缺少半平面','位錯周圍的應變會造成 BF/DF 對比，並可利用多個 g 的消光條件推估 Burgers vector。']};
function setDefect(type){btnGroup('#defectBtns','defect',type);const svg=$('#defectSVG');svg.innerHTML='';addSvg(svg,'rect',{width:500,height:250,fill:'#0e2032'});const idx=type==='twin'?[0,1,2,1,0,2,1]:type==='sf'?[0,1,2,0,1,0,1]:[0,1,2,0,1,2,0];for(let row=0;row<7;row++){const off=idx[row]*14;let n=11;for(let col=0;col<n;col++){if(type==='dislocation'&&row<3&&col===5)continue;const x=49+col*39+off,y=34+row*30;if(x>475)continue;addSvg(svg,'circle',{cx:x,cy:y,r:9,fill:type==='twin'&&row===3?'#f8c58e':'#8cdbed',stroke:'#163b50','stroke-width':2});}}if(type==='sf'||type==='twin')addSvg(svg,'line',{x1:22,x2:476,y1:126,y2:126,stroke:'#f0af7e','stroke-width':2,'stroke-dasharray':'8 6'});if(type==='dislocation'){addSvg(svg,'line',{x1:246,x2:246,y1:15,y2:117,stroke:'#ffbf8d','stroke-width':3});}$('#defectCaption').textContent=defectDescriptions[type][0];$('#defectExplain').textContent=defectDescriptions[type][1];}
$$('#defectBtns [data-defect]').forEach(b=>b.addEventListener('click',()=>setDefect(b.dataset.defect)));setDefect('perfect');
let stemMode='haadf';function drawStem(){const ang=+$('#collectionAngle').value,t=+$('#stemThick').value;$('#angleOut').textContent=ang+' mrad';$('#stemThickOut').textContent=t+' nm';let low,high;if(stemMode==='bf'){low=(.8+.04*(30-t)/30)*100;high=(.28+.14*(30-t)/30)*100;}else if(stemMode==='adf'){low=(.29+.03*t/60)*100;high=(.70+.1*t/60)*100;}else{low=(.10+.12*(120-ang)/100)*100;high=(.61+.22*(120-ang)/100)*100;}low=Math.max(4,Math.min(95,low));high=Math.max(5,Math.min(96,high));$('#lightBar').style.width=low.toFixed(0)+'%';$('#heavyBar').style.width=high.toFixed(0)+'%';$('#stemRing').setAttribute('r',stemMode==='bf'?12:stemMode==='adf'?51:77);$('#stemRing').setAttribute('stroke',stemMode==='bf'?'#61f6d7':stemMode==='adf'?'#8bb8ff':'#ffdd94');$('#stemRing').setAttribute('stroke-width',stemMode==='bf'?'12':stemMode==='adf'?'14':'14');$('#stemExplain').textContent=stemMode==='bf'?'STEM-BF 偵測低角度、近直射束電子。質量厚度、繞射與相位條件都可能影響對比，與「TEM-BF」的照明／成像方式不同。':stemMode==='adf'?'ADF 接收環形的散射電子，與 BF 互補；低／中角 ADF 的繞射和晶向敏感性通常較顯著。':'HAADF 收取較高角度的散射電子。在相同厚度與條件下常呈高 Z 原子柱較亮的 Z contrast；但若厚度不同或晶向/channeling 改變，亮度不一定只代表 Z。';}['#collectionAngle','#stemThick'].forEach(s=>$(s).addEventListener('input',drawStem));$$('#stemModes [data-stem]').forEach(b=>b.addEventListener('click',()=>{stemMode=b.dataset.stem;btnGroup('#stemModes','stem',stemMode);drawStem()}));drawStem();
let spectrum='eds';function drawSpectrum(){const cv=$('#spectrumCanvas'),ctx=cv.getContext('2d'),w=cv.width,h=cv.height;ctx.fillStyle='#0a1a2a';ctx.fillRect(0,0,w,h);const margin={l:51,r:18,t:26,b:45},axW=w-margin.l-margin.r,axH=h-margin.t-margin.b;ctx.strokeStyle='#628093';ctx.beginPath();ctx.moveTo(margin.l,margin.t);ctx.lineTo(margin.l,h-margin.b);ctx.lineTo(w-margin.r,h-margin.b);ctx.stroke();ctx.fillStyle='#b6d6e2';ctx.font='13px sans-serif';ctx.fillText('Signal',8,20);ctx.fillText(spectrum==='eds'?'X-ray energy (keV)':'Electron energy loss (eV)',w-185,h-11);ctx.strokeStyle='rgba(133,166,187,.13)';for(let i=1;i<=4;i++){const y=margin.t+axH/5*i;ctx.beginPath();ctx.moveTo(margin.l,y);ctx.lineTo(w-margin.r,y);ctx.stroke();}
let peaks=spectrum==='eds'?[{x:1.74,a:.86,s:.055,label:'Si Kα'},{x:4.51,a:.72,s:.075,label:'Ti Kα'},{x:10.55,a:.95,s:.09,label:'Pb Lα'}]:[{x:0,a:1,s:9,label:'ZLP'},{x:22,a:.46,s:17,label:'plasmon'},{x:99,a:.23,s:19,label:'Si L'},{x:456,a:.38,s:27,label:'Ti L'},{x:532,a:.48,s:30,label:'O K'}];const xmax=spectrum==='eds'?12:700;
ctx.beginPath();for(let i=0;i<=axW;i++){const xx=i/axW*xmax;let v=spectrum==='eds'?.10*Math.exp(-xx*.2):.12*Math.exp(-xx/120);peaks.forEach(p=>{if(spectrum==='eds')v+=p.a*Math.exp(-.5*((xx-p.x)/p.s)**2);else if(p.x===0||p.x===22)v+=p.a*Math.exp(-.5*((xx-p.x)/p.s)**2);else v+=p.a*.42/(1+Math.exp(-(xx-p.x)/(p.s*.17)))*Math.exp(-Math.max(0,xx-p.x)/(p.s*1.2));});const y=margin.t+axH- Math.min(1.04,v)*axH*.94;if(i===0)ctx.moveTo(margin.l+i,y);else ctx.lineTo(margin.l+i,y);}ctx.strokeStyle='#85f6db';ctx.lineWidth=2.5;ctx.stroke();ctx.lineWidth=1;$('#spectrumPeakLegend').replaceChildren(...peaks.map(p=>{const span=document.createElement('span');span.textContent=p.label+' · '+p.x+(spectrum==='eds'?' keV':' eV');return span}));ctx.fillStyle='#a8c1cf';ctx.fillText('0',margin.l-8,h-margin.b+18);ctx.fillText(String(xmax),w-margin.r-22,h-margin.b+18);}
function setSpec(type){spectrum=type;$$('[data-spec]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.spec===type)));if(type==='eds'){$('#spectrumTitle').textContent='EDS：特徵 X-ray';$('#spectrumText').textContent='電子束激發內殼層電離，電子遷移填空後釋放元素特徵 X 光。適合元素種類／分布，但重疊峰、薄片厚度、探測立體角與 X 光吸收影響判讀。';$('#spectrumCaption').textContent='EDS 概念譜：Si Kα、Ti Kα、Pb Lα 位置為常見代表線，並不代表這些元素真的存在同一個樣品。'}else{$('#spectrumTitle').textContent='EELS：電子損失能譜';$('#spectrumText').textContent='量測電子通過樣品時損失的能量，包括零損峰、低損／電漿子以及 core-loss。ELNES（edge near-edge fine structure）可協助研究鍵結與氧化態，但要有參考譜和適當能量解析。';$('#spectrumCaption').textContent='EELS 概念譜：ZLP、plasmon、Si L、Ti L、O K 等特徵僅用來展示訊號類型，非真實擬合。'}drawSpectrum();}$$('[data-spec]').forEach(b=>b.addEventListener('click',()=>setSpec(b.dataset.spec)));setSpec('eds');
// Human-written PBL questions. Each entry: category, difficulty, slide reference, title, prompt, answer, follow-up, pitfall.
const rawQ=[
['basics',1,'slide 1–6','TEM 和 SEM 最根本的不同？','兩者都是電子顯微鏡，請從電子束、試片與訊號來源比較。','TEM 讓高能電子穿過電子透明薄片，利用透射／繞射電子形成影像與晶體訊息；SEM 用聚焦電子束掃描塊材表面，通常收集 SE、BSE 或 X 光。TEM 資料沿厚度投影，SEM 也有交互作用體積。','如果只能選 TEM 或 SEM 觀察 5 nm 界面原子排列？為什麼？','不要說 TEM「一定看到原子」，仍取決於解析度、厚度與對比。'],
['basics',1,'slide 3–6','TEM 可以量到哪三大類資訊？','請從成像、繞射與光譜各舉一例。','成像如 BF/DF/HRTEM 呈現微結構；SAED/NBD/CBED 提供晶體取向與晶面間距；EDS/EELS 提供元素分布、化學態等。不能把任何一張灰階圖都看成元素分布圖。','如果想判斷界面是否化學擴散，要補哪一種？','先說訊號的物理來源，再說能回答的問題。'],
['basics',1,'slide 15–17','為什麼 TEM 試片要很薄？','電子束能量那麼高，難道不能穿透厚一點的材料嗎？','太厚會使電子發生更多彈性與非彈性、甚至多重散射，影像和繞射變得複雜，光譜背景也增加。課堂以小於約 100 nm 作常見目標，但實際最佳厚度依材料與技術而變。','HAADF、EELS、HRTEM 對厚度的敏感性會相同嗎？','不要把 100 nm 講成跨材料的絕對規定。'],
['basics',2,'slide 31–34','W、LaB₆、FEG 電子槍如何比較？','為什麼高階 TEM 喜歡場發射槍？','熱發射槍依升溫克服功函數釋出電子；FEG 利用強電場促進發射，可有更高亮度與較小虛擬源。冷場發射與 Schottky FEG 在能量分布、穩定性、真空要求與操作維護上有取捨。','能量分布變窄，對色差與 EELS 有什麼好處？','FEG 並非保證所有條件都優於所有熱發射系統。'],
['basics',1,'slide 6–14','為什麼電子顯微鏡必須在真空操作？','真空除了避免電子撞空氣之外還有什麼意義？','避免電子束被氣體分子強烈散射，減少電子槍污染與不穩定並維持可控的光學路徑。不同部位可能採差動抽氣；電子本身不是「絕對不能存在於空氣中」。','為何某些低真空 SEM 存在，但一般高解析 TEM 仍需要高真空？','避免把真空需求與樣品材料本身的真空穩定性混為一談。'],
['basics',2,'slide 5、58–59','200 kV 電子的 de Broglie 波長約多少？','請講出物質波與電子加速的關係。','相對論修正後，200 kV 電子波長約 0.00251 nm，也就是 2.51 pm。加速電壓增加通常縮短波長，但成像解析度並不直接等於電子波長。','為什麼 2.51 pm 的電子不保證 2.51 pm 的實際解析度？','波長是電子波的週期，不是顯微鏡性能保證值。'],
['basics',2,'slide 31–46','Condenser Lens 和 Objective Lens 做什麼？','若想增加束流，應該先想到哪個系統？','聚光鏡控制照明束流、照明區域與會聚角；物鏡對通過試片的電子做初級成像與繞射空間形成。改變 condenser 設定可調 probe current，但仍要考慮亮度與束損傷。','STEM 為什麼需要強會聚探針？','Objective 不只是負責放大倍數。'],
['basics',2,'slide 7–8、45–46','BFP 與 Image Plane 有何差別？','為何切換 intermediate lens 就能改變觀察到的內容？','物鏡 Back Focal Plane 按散射角排列電子，對應倒空間繞射；物鏡像平面按樣品位置排列強度，對應實空間影像。中間／投影透鏡把其中一個平面放大投影到相機。','為何 Objective aperture 要在 BFP 附近？','BFP 不是樣品表面的照片。'],
['basics',3,'slide 37–43、87','球面像差、色差與散光怎麼區分？','請從形成原因與校正方式比較。','球面像差來自不同孔徑角電子聚焦位置不一；色差來自電子能量分布與透鏡聚焦差異；散光來自透鏡場不具理想旋轉對稱。Cs corrector、單色器／能量濾鏡及 stigmator 分別能改善相關限制。','為什麼即使 Cs 校正後仍可能有像差或漂移？','不是所有像差都能用調整 focus 直接消掉。'],
['basics',2,'slide 45–46','Image Mode 與 Diffraction Mode 怎麼切？','同樣一片樣品，為何能看到實空間照片或 SADP？','物鏡同時形成後焦平面與像平面，調整 intermediate/projector lens，使相機共軛於其中一個平面，就會呈現不同訊號。不是先拍一張 TEM 再用電腦變成真正 SAED。','FFT 跟真實 diffraction mode 又差在哪裡？','若答「放大倍率不同」仍不夠，需要說是哪個平面。'],
['prep',1,'slide 15–30','FIB、PIPS、滴樣各用於什麼材料？','要分析半導體層間界面，你會選哪一種？','指定微小位置截面可用 FIB；較廣範圍晶體薄片可機械薄化搭配 PIPS；奈米顆粒／奈米線可分散滴到 grid。每種方法都可能造成特定假象與取樣偏差。','FIB 為何適合失效分析，卻不是絕對無損？','不要把 TEM 薄片的製備方式當作通用單一 SOP。'],
['prep',2,'slide 23–30','為何 FIB 會造成非晶層？','如果 HRTEM 看到界面 amorphous layer，你怎麼排除製樣假象？','高能離子撞擊使晶格位移、混合與非晶化，Ga-FIB 也可能植入 Ga。比較不同區域／清理條件、使用低能量最後研磨，以及其他製樣法對照，才能判斷是否本來就存在。','為什麼低 kV final polish 仍不是絕對零損傷？','不要直接將所有界面非晶層歸因於元件製程。'],
['prep',2,'slide 23–30','FIB 製樣為何先鍍 Pt 或其他保護層？','保護層能解決所有問題嗎？','保護層可減少離子直接打到目標表面、改善幾何與抑制 curtaining。它不能完全避免側壁損傷、植入或再沉積，還要注意成分分析時外加元素的來源。','EDS 量到 Pt 可以直接說原本元件含 Pt 嗎？','當保護層成分與樣品元素重疊時更需留意。'],
['prep',2,'slide 21–30','PIPS 和 FIB 最值得比較什麼？','若樣品是大範圍多晶金屬，選擇考量是什麼？','PIPS 通常用離子研磨進一步薄化已磨薄的試片，適合較大區域；FIB 可以定點製作小薄片。PIPS 仍可能造成離子損傷、表面重沉積與不同相的差異研磨。','為什麼 TEM 製樣品質會改變 diffraction 的解讀？','不要說 PIPS 一定不會造成離子損傷。'],
['prep',3,'slide 15–30、115','鈣鈦礦影像拍久了，晶格消失代表什麼？','你會如何設計控制實驗？','可能有 radiolysis、原子位移、熱效應、真空/環境作用等，而不是直接代表原始樣品本身的變化。做 fresh-area 及不同累積劑量對照，記錄電壓、電流、曝光與低劑量策略。','高加速電壓就一定減少束損傷嗎？','高電壓對不同損傷機制的影響可能相反。'],
['prep',2,'slide 15–17、120','試片厚度會影響哪些 TEM 結果？','除了影像變暗，還有什麼後果？','厚度改變多重散射、繞射對比、HAADF 訊號與 EELS plural scattering，也影響 EDS 吸收與 X 光定量。單張 HAADF 亮度不能在厚度未知時直接定 Z。','如何透過 low-loss EELS 的 log-ratio 估計相對厚度？','厚度依賴不同於所有訊號都只會單調變暗。'],
['prep',3,'slide 6、17','TEM 顯示 2D 影像，為何不能直接下 3D 結論？','兩個重疊晶粒會讓你誤判什麼？','TEM 是沿束方向的投影，厚度中多個區域可能重疊，造成額外 FFT 斑點、Moiré 花紋與元素 mapping 混合。要做 tilt series、electron tomography 或截面／多方位樣本確認。','如何判斷某個 Moiré 是兩片晶體重疊造成？','不能把 TEM 影像中的亮點高度直接看成表面起伏。'],
['diff',1,'slide 48、57–60','Bragg’s law 的物理意義是什麼？','為什麼特定角度有強繞射？','相鄰晶面散射波的路徑差 2d sinθ 若為整數倍波長，會建設性干涉。TEM 的 θ 很小，因此繞射點角度也很小；電子繞射實際還受動力學散射影響。','200 kV Si(111) 的散射角 2θ 大約多大？','不要把 Bragg θ 和螢幕中心到點的總散射角 2θ 混為一談。'],
['diff',2,'slide 61–65','Rd≈Lλ 的公式怎麼推？','為何斑點距離 R 能求晶面距離 d？','對小角度，繞射束與直射束的夾角 2θ≈λ/d；樣品到有效投影平面的相機長度 L 給出 R≈L tan(2θ)≈Lλ/d。L 是經鏡筒校正的有效 camera length，不必等於實際管身長度。','若 L 增加一倍，d 與 R 如何變化？','必須確認 L、λ 校正與單位一致。'],
['diff',1,'slide 71–74','單晶、多晶與非晶 SAED 的圖樣？','斑點、同心環、暈環各代表什麼？','單晶通常呈規則離散反射；大量近隨機取向小晶粒會使同一 d-spacing 形成環；非晶短程有序導致寬 diffuse halo。強烈織構多晶可能成為離散弧段。','若某個環只出現 1/4，是否表示一定只有少量晶粒？','圖樣形狀也受選區大小、織構與晶粒數影響。'],
['diff',2,'slide 51–53、65','立方晶系如何從 hkl 算 d？','給定晶格常數 a，如何比較 (111)、(200)、(220)？','立方晶系 d_hkl=a/√(h²+k²+l²)。例如同一材料，(111) 的 d 大於 (200)，(220) 的 d 更小；因此同 L、λ 下 (220) 的 R 更遠。','若 a=0.543 nm，Si(111) 約多少 nm？','這個簡式只適用立方晶系。'],
['diff',2,'slide 66–68','BCC 的 selection rule 是什麼？','為何 (100) 禁制而 (110) 可允許？','理想 BCC 晶胞兩個等效散射中心造成結構因子 F∝1+exp[iπ(h+k+l)]，因此 h+k+l 為偶數的反射可允許、奇數禁制。','為何理想消光不代表所有真實 TEM 圖都不能有該位置的強度？','消光規則需區分運動學近似與動力學繞射。'],
['diff',2,'slide 61、66','FCC selection rule 為何是全奇或全偶？','要用它辨識晶相，應如何避免混淆？','FCC 四個等價晶格點的相位和使混合奇偶指數的反射消失，理想允許條件為 h、k、l 全奇或全偶；還須考慮原子基底，不能直接把 FCC 規則套到 diamond 而忽略額外消光。','為什麼 diamond Si 的 (200) 不允許，雖然全偶？','FCC selection rule 是必要但未必充分條件。'],
['diff',3,'slide 66–70','Si(002) 為何在理想繞射中 forbidden？','老師如果指出 TEM 圖上出現 (002)，你怎麼答？','Si diamond cubic 的基底結構因子使全偶反射還需 h+k+l 可被 4 整除。(002) 的指數和為 2，因此理想運動學消光；真實較厚或特定取向的 TEM 薄片可能因 double/multiple diffraction 在相同位置出現強度。','如何用 tilt／厚度系列區分禁制反射與新晶相？','「禁制」不是指絕對任何實驗都不可能看到該點。'],
['diff',3,'slide 66–70','Dynamic diffraction 為何讓分析複雜？','一次散射與多次散射差別在哪裡？','運動學近似把訊號視為近似單次散射；電子與物質作用強，較厚晶體可能經多條反射路徑反覆繞射，使斑點強度甚至禁制位置強度與單次散射預測不同。','為何以 TEM 斑點強度直接反推元素比例較危險？','不要用簡單亮度比例套用 XRD kinematical interpretation。'],
['diff',2,'slide 64、68','Zone-axis condition hu+kv+lw=0 是什麼？','如果電子束沿 [001]，哪些晶面滿足 zone law？','區軸 [uvw] 與可見反射 (hkl) 的幾何條件為 hu+kv+lw=0。例如 [001] 需 l=0，但反射是否真的出現還需同時滿足晶體結構因子與 Ewald 球／激發誤差。','有哪幾個反射可用來定義特定 zone axis？','滿足 zone law 不等於反射必然有訊號。'],
['diff',2,'slide 61–64','Camera Length 調大，繞射點發生什麼事？','是晶面間距變大，還是顯示的圖樣變大？','R≈Lλ/d，材料與加速電壓不變時，L 越大，繞射點離中心越遠。晶體 d 值不因此改變；實驗使用有效相機長度並以標準樣品校正。','如果你誤把舊 L 值帶進計算，d 會怎樣錯？','不能從顯示器像素距離直接推 d 而不校正。'],
['diff',3,'slide 69–78、131','未知相只用一個 d 值可以定相嗎？','你如何向老師證明一個材料的新晶相？','不夠。許多晶體可具有相近 d 值，還要比對多個反射及相對夾角、區軸、系統消光與元素組成；課堂建議取得至少三個不同 SADP 並對照資料庫與模擬。','若 EDS 顯示元素吻合、但消光不符，可能有哪些原因？','EDS 不能直接證明某個特定晶體結構。'],
['diff',2,'slide 3、45、57','SAED、NBD 與 CBED 有何不同？','三種方式的照明與選區方式不同在哪裡？','SAED 用相對平行照明及 selected-area aperture 限定實空間區域；NBD 用小束斑探測局部；CBED 用會聚束形成繞射 disks，可分析對稱性、厚度等。空間區域與束會聚角都會影響 pattern。','CBED 為什麼是 disk 而不是單純 spot？','不要說所有「小區域繞射」都等於 SAED。'],
['diff',3,'slide 59–62','200 kV Si(111) 的 2θ 大概多大？','以 d=0.314 nm、λ=0.00251 nm 估算。','小角度下 2θ≈λ/d≈0.00799 rad，即約 8 mrad 或 0.458°。若 L=600 mm，理想 R≈4.80 mm；真正測量仍須校正 camera constant。','1 mrad 是多少度？','Bragg 式中的 θ 是反射角的一半，別把 8 mrad 當 θ。'],
['imaging',1,'slide 87–93','BF-TEM 影像怎麼形成？','為什麼某些晶粒比較暗？','典型 BF-TEM 用 objective aperture 選直射 (000) 束，排除較大角度繞射束。當某區域因符合 Bragg 條件把更多電子繞射出去，直射束強度變弱，因此在 BF 中常顯暗；質量厚度也會影響。','轉動樣品後暗的晶粒變亮代表什麼？','BF 暗不一定代表材料比較厚。'],
['imaging',1,'slide 87–93','DF-TEM 為何暗背景中晶粒發亮？','怎麼選擇指定的繞射束？','典型 DF 以 objective aperture 選定特定 g 繞射束，只有滿足該反射條件的區域對影像有強貢獻而顯亮。中心 DF 可傾斜束使 g 落在光軸附近，以減少離軸像差。','如果換選另一個 g，同一顆晶粒一定還會亮嗎？','DF 亮不代表它的元素原子序比較高。'],
['imaging',2,'slide 87–94','Objective aperture vs selected-area aperture？','兩個光闌放置的平面、功能完全不同，請說清楚。','Objective aperture 在物鏡後焦平面附近選束，影響 BF/DF 的散射角對比；Selected-area aperture 在與像平面共軛的位置選實空間區域，限制 SAED 所收的樣品範圍。','如果想分析某個小晶粒的 SAED，應用哪個光闌？','只說「光闌越小解析度越高」不夠且可能錯。'],
['imaging',2,'slide 89–96','為什麼轉動試片後晶粒會亮暗反轉？','晶體本身沒有改變成分，為何影像改變？','傾角會改變不同晶面對入射電子的 Bragg excitation error，導致直射束與所選繞射束強度分配變化，因此 BF/DF 對比可反轉。','如何用 tilt series 區分 diffraction contrast 與 composition contrast？','不能直接把亮暗差異當元素濃度差異。'],
['imaging',3,'slide 91–98','兩束條件與 Weak-beam DF 用來做什麼？','為什麼它能讓位錯輪廓更容易定位？','兩束條件讓主要繞射束較少，能簡化位錯繞射對比分析；weak-beam DF 在較弱激發條件下有較局部的應變對比，利於分辨相鄰位錯。需要控制 g 與激發誤差。','如何排除厚度條紋或彎曲對比？','Weak beam 不是將束流調低就自動形成的模式。'],
['imaging',3,'slide 91–99','g·b=0 的位錯不可見判準是什麼？','這條規則的物理含意與限制？','在適當兩束繞射條件下，若反射向量 g 與 Burgers vector b 的內積為零，該反射對位錯位移場的相位變化可能不敏感，使位錯對比降低或消失。完整對比也受線方向與其他條件影響。','為何單一 g 的不可見性不足以唯一判定 b？','這是有條件的近似，而不是所有圖像中的絕對定律。'],
['imaging',2,'slide 81–88、98–99','HRTEM 是 phase contrast 還是直接拍原子？','請說明為什麼需要考慮 defocus 和 Cs。','HRTEM 多束電子波經試片與物鏡相位轉移後產生干涉強度圖；條紋或亮點受樣品位勢、厚度、晶向、離焦與像差共同影響。原子位置分析往往需要模擬、校正與其他模式交叉驗證。','為何同一晶格換 defocus 可以亮暗反轉？','不能把每個 HRTEM 亮點當成一顆單獨原子。'],
['imaging',2,'slide 86–88','Scherzer defocus 是什麼？','為何在傳統非像差校正 HRTEM 常談這個值？','對具有球面像差的傳統 HRTEM，適當欠焦可改善一定空間頻率範圍的相位傳遞，使晶格資訊較容易觀察。最佳條件與 Cs、λ 及儀器設定相關，不保證所有原子都呈相同亮暗。','像差校正系統的最佳離焦還一樣嗎？','它不是「所有模式通用的最佳對焦數字」。'],
['imaging',2,'slide 82、105–108','FFT 與 SAED 相同嗎？','兩者都出現點狀圖形，根本差異在哪裡？','FFT 是對實空間影像強度做數學傅立葉轉換，顯示影像所含週期頻率；SAED 是電子束在樣品中形成的實際繞射強度分布。FFT 受 HRTEM CTF、取樣、窗函數、雜訊與遮罩影響，不能完全等同 SAED。','為何 HRTEM FFT 裡某一 g 消失不一定代表禁制反射？','不能省略影像形成與頻率傳遞這一步。'],
['imaging',3,'slide 105–108','IFFT 遮罩去掉斑點，就能證明缺陷消失？','說明影像處理與材料改變的差別。','FFT mask/IFFT 只是選擇保留影像中的部分空間頻率，使某些條紋變得較明顯或被濾除，不代表真實晶體晶面被移除。遮罩選擇甚至可能創造看似整齊的局部結構，必須保存原始影像及參數。','如何判斷 IFFT 結果是不是處理假象？','不能只發表 IFFT 圖而不提供原始圖及 mask。'],
['imaging',2,'slide 99–103','Stacking fault 與 Twin 有什麼差？','用 FCC 堆疊次序解釋，不要只說兩者都是缺陷。','Stacking fault 是 ABCABC… 堆疊序列局部失序、缺層或多層；Twin 則是晶格在界面兩側具有特定鏡像取向關係，常見於密排材料。它們可能呈現不同反射與條紋，需要 HRTEM 或 DF/SAED 判斷。','怎麼從 twin 的 diffraction pattern 看取向關係？','不能把所有平行亮暗條紋都說成 stacking fault。'],
['imaging',2,'slide 103–104','Moiré fringes 是新晶面嗎？','兩片晶體重疊為何會產生更長週期條紋？','兩組週期相近、角度略偏的晶格投影重疊，會形成拍頻式長周期 Moiré 對比。這反映重疊或相對旋轉，不一定是新的晶格常數。','如何利用局部 FFT 區分兩組晶格？','不要把 Moiré 間距直接當成真實原子間距。'],
['imaging',3,'slide 87–100','Mass-thickness contrast 與 diffraction contrast 如何分開？','兩塊厚度不同的晶粒和兩塊取向不同的晶粒，都可能有 BF 明暗。','質量厚度對比來自電子散射強度與樣品厚度／平均原子序；繞射對比則對晶體取向、激發條件敏感。可透過 tilt series、不同 aperture、HAADF 與 EELS 厚度估計區分。','改成 HAADF 後是否完全消除晶向影響？','HAADF 仍可能有 channeling 與厚度對比。'],
['stem',1,'slide 108–111','CTEM 和 STEM 是同一台機器嗎？','從照明模式與成像訊號說明。','CTEM 典型以近平行束照明視野，透鏡成像；STEM 以細聚焦探針逐點掃描並用不同角度探測器記錄訊號。同一台 (S)TEM 常可切換這兩種模式。','STEM 為何容易結合 EDS、EELS mapping？','STEM 不等於 SEM；STEM 是穿透薄片。'],
['stem',2,'slide 109–113','STEM-BF 和 TEM-BF 名字相同，是否相同原理？','它們都收低角度電子，差別在哪？','兩者都可偏重直射／低角電子，但 CTEM 以平行束及透鏡將整個視野成像，STEM 以會聚細探針掃描後由探測器逐像素積分訊號。對比轉移及成像參數不同。','哪一個模式容易串接像素位置與 EDS 訊號？','兩者不能只用相同縮寫就當成完全等價。'],
['stem',1,'slide 111–114','ADF 和 HAADF 的偵測角有何意義？','為什麼 HAADF 常用在重元素原子柱？','ADF 收取環形散射角的電子，HAADF 選擇較大的散射角，常使高角度非相干散射貢獻更大，提供較強的 Z 對比；但具體角度取決於儀器設計。','若內角從 50 mrad 改到 100 mrad，訊號量可能如何改變？','不能把 HAADF 解釋為「收全部背向散射電子」。'],
['stem',2,'slide 111–114','為什麼 HAADF 常說 I∝Z^1.7？','這個關係什麼時候不可靠？','在某些條件下 HAADF 強度與原子序呈近似次方依賴，較高 Z 的原子柱通常較亮；但厚度、晶向、探測角、channeling 和雜訊都影響亮度。這是經驗性近似，不能作直接元素含量的通用換算。','如果兩個柱子厚度不同，能只用亮度比判元素種類嗎？','Z^1.7 並非普適精確定律。'],
['stem',2,'slide 112–114','HAADF 亮區能直接證明是 Pb、Au 或 W？','為何仍要 EDS 或 EELS？','不能。亮度也會受厚度與多種原子投影混合影響；HAADF 提供的是散射對比。若要判定具體元素，需要 STEM-EDS 特徵 X 光或 EELS core-loss，並綜合結構與樣品幾何。','若 EDS 譜峰重疊，還能做什麼？','高 Z 只代表大致趨勢，不是唯一化學辨識。'],
['stem',3,'slide 111–115','Electron channeling 對 HAADF 有什麼影響？','晶體 zone axis 不同會影響亮度嗎？','電子束沿晶體原子柱方向可發生 channeling，改變波場在樣品內傳播與散射機率。於是厚度與取向可能顯著改變原子柱強度，即使組成不變。','如何利用 tilt 或 multislice simulation 幫助解讀？','不要宣稱 HAADF 完全不受 diffraction 或 phase effects 影響。'],
['stem',3,'slide 111–115','一個 HAADF 亮點就是一顆原子？','對厚薄片、異質界面，如何解釋原子柱？','常見 zone-axis HAADF 亮點是多個原子沿電子束方向的投影柱，不必然是一顆原子。即使具原子級橫向解析度，也不意味直接得到完整三維原子座標。','要估佔位比例或單原子缺陷需要什麼校正？','原子柱與單一原子不可混淆。'],
['stem',3,'slide 108–116 補充延伸','4D-STEM 是什麼？','為什麼每一個掃描點還要記錄一張 diffraction pattern？','4D-STEM 在兩維掃描位置逐點取得兩維繞射圖，形成 2D position × 2D diffraction 的資料。可研究局部應變、晶向與電場等；它是課堂 STEM 原理的進一步延伸，不是這份講義的主要必考內容。','4D-STEM 和傳統 STEM-HAADF 有什麼資料量差異？','這題標記為外部延伸，不應假稱原課堂已深入講解。'],
['chem',1,'slide 117–125','EDS 的訊號到底從哪裡來？','不是直接偵測元素原子，請講內殼層過程。','入射電子電離內殼層，外層電子躍遷填補空位時釋放特徵能量 X 光。偵測器記錄能譜峰，用於元素辨識與 mapping；強度也受吸收、幾何與定量校正影響。','Kα、Kβ 為何屬於相同元素不同轉移？','EDS 是 X 光能譜，不是電子能量損失譜。'],
['chem',1,'slide 121–130','EELS 與 EDS 哪裡不同？','為什麼 EELS 有時能研究氧化態？','EELS 量測出射電子損失能量，含零損峰、低損/電漿子與 core-loss 邊；邊的近邊精細結構與局部電子結構、化學鍵和氧化態有關。EDS 量特徵 X 光，主要提供元素成分。','測 Fe²⁺／Fe³⁺ 變化，優先考慮哪種光譜？','EELS 不是所有材料都能直接量出唯一氧化態。'],
['chem',3,'slide 126–130','ELNES 的 chemical shift 代表什麼？','為什麼光譜峰位與邊緣形狀能反映化學狀態？','化學鍵、價態、配位與局部未佔據態密度改變會影響核心能級激發閾值與近邊細結構。要與可信 reference spectrum 並在相同能量校正與厚度條件下比較。','不同配位是否可能產生類似的 edge shift？','一個小峰位位移不等於絕對定量的價態結論。'],
['chem',2,'slide 121–123','Characteristic X-ray 與 Bremsstrahlung？','EDS 光譜為什麼除了峰還有背景？','Characteristic X-ray 來自原子內殼層空位的躍遷，能量有元素特徵；Bremsstrahlung 是高速電子減速時的連續輻射，形成背景。定量時必須正確處理背景與峰重疊。','為什麼低濃度元素會被背景淹沒？','並非所有 X 光都能唯一對應一個元素。'],
['chem',2,'slide 121–125','EDS 沒測到元素，能證明樣品完全沒有嗎？','該怎麼報告陰性結果？','不能。偵測下限、譜峰重疊、照射劑量、X 光吸收、厚度及 detector geometry 都可能造成低訊號。較適當說「在本測試條件與偵測限下未偵測到」。','如何提高對輕元素或微量元素的可信度？','不能用單次 mapping 的黑點宣稱零含量。'],
['chem',2,'slide 119–126','為何 TEM-EDS 也不一定是單原子尺寸分析？','探針小，不代表 X-ray 產生體積一定同樣小。','TEM 薄片通常讓分析體積比塊材 SEM-EDS 小很多，但電子束仍可在厚度中擴展、散射，X 光訊號沿厚度整合且含背景與相鄰區域貢獻。解析度需依材料、厚度、束流與計數評估。','什麼情況下 STEM-EELS 可能比 EDS 更適合界面化學態分析？','不要說探針直徑就完全等於元素 mapping 解析度。'],
['chem',2,'slide 127–130','EFTEM 是什麼？','Energy filter 為什麼能形成某種元素或能量的影像？','EFTEM 透過能量濾鏡選取一定能量損失範圍的透射電子形成影像，可取得特定能量對比或元素映射。但背景扣除、多重散射與樣品厚度校正很重要。','若要在 2D 導出某元素 map，為何需要 pre-edge 背景資訊？','單一能量窗影像未必就是乾淨的元素分布。'],
['case',3,'slide 90、113–125','半導體截面有一條暗層，如何驗證是擴散？','請用五步證據鏈而不是只講儀器名稱。','先確認是 BF、DF 還是 HAADF，了解對比來源；排除厚度、製樣與取向差異，再用 STEM-EDS/EELS 線掃驗證元素在界面跨越，必要時 HRTEM/SAED 判相、比較 FIB 控制樣本。','若 HAADF 亮度漸層，但 EDS 沒明顯擴散，怎麼辦？','影像對比≠直接的化學擴散證據。'],
['case',3,'slide 66–78、131','陌生顆粒「可能是新相」，你怎麼鑑定？','老師要求有邏輯又不過度宣稱。','先確定樣品有無重疊與受束損傷，做 EDS 找候選元素，收集多個區軸 SADP，計算 d 與角度並檢查消光，再與晶體結構資料及 HRTEM/FFT、必要時 EELS/XRD 比對。課堂 slide 131 建議至少三組 SADP。','如果元素相同但是結構不同，哪個技術才有關鍵證據？','單一 d 值不足以定相。'],
['case',3,'slide 15–30、115–116','敏感薄膜高解析 TEM 拍到新缺陷，是真的嗎？','你會要求哪一些成像與樣品資訊？','先請對方提供加速電壓、劑量率、累積劑量、曝光時間、樣品厚度、製樣方式與 fresh-area 對照。對有機／鹵化物鈣鈦礦等材料，需特別評估輻解、原子位移與真空改變組成的影響。','低劑量實驗需要區分瞬時劑量率與總劑量嗎？','電子顯微鏡不是完全非破壞性的觀察。'],
['case',3,'slide 6、99–108、131','TEM 看似三維的圖片，怎麼證明實際 3D 缺陷？','結合投影與可選的進階方法。','常規 TEM 是三維薄片沿束方向的二維投影，重疊、厚度與 tilt 都可能造成歧義。可以做 tilt series、electron tomography、不同切面比較，並將繞射、HAADF、EDS/EELS 證據互相驗證。','為什麼 tomography 需要多角度而不是單張超高解析圖？','解析度很高與三維資訊完整是不同概念。']
];
const catLabels={basics:'儀器／電子光學',prep:'製樣／束損傷',diff:'晶體繞射',imaging:'BF／DF／HRTEM',stem:'STEM／HAADF',chem:'EDS／EELS',case:'PBL 情境題'};
const questions=rawQ.map((q,i)=>({id:i+1,cat:q[0],level:q[1],slide:q[2],title:q[3],prompt:q[4],answer:q[5],follow:q[6],pitfall:q[7]}));
if(questions.length!==62)console.warn('PBL questions:',questions.length);
let currentQuestion=1;
const filteredQs=()=>{const cat=$('#quizFilter').value,level=$('#quizLevel').value,search=$('#questionSearch').value.trim().toLocaleLowerCase();return questions.filter(q=>(cat==='all'||(cat==='review'?state.questions[q.id]==='review':q.cat===cat))&&(level==='all'||q.level===+level)&&(!search||(q.title+' '+q.prompt+' '+q.answer+' '+q.slide+' '+catLabels[q.cat]).toLowerCase().includes(search)))};
function renderList(){const filtered=filteredQs();$('#bankCount').textContent=filtered.length+' 題';const el=$('#questionList');el.innerHTML='';if(!filtered.length){el.textContent='目前沒有符合條件的題目。試試別的分類或搜尋字。';return;}filtered.forEach(q=>{const status=state.questions[q.id]==='mastered'?' ✓':state.questions[q.id]==='review'?' ↻':'';const btn=document.createElement('button');btn.type='button';btn.className='question-row';btn.innerHTML=`<span class="pill-num">${String(q.id).padStart(2,'0')}</span> <span class="level">${'★'.repeat(q.level)} ${catLabels[q.cat]}</span><br>${htmlEscape(q.title)}${status}`;btn.addEventListener('click',()=>{selectQ(q.id);$('#quizTitle').scrollIntoView({behavior:'smooth',block:'center'})});el.appendChild(btn);});}
function selectQ(id){const q=questions.find(q=>q.id===id)||questions[0];if(currentQuestion&&$('#selfAnswer'))state.drafts[currentQuestion]=$('#selfAnswer').value;currentQuestion=q.id;$('#quizTitle').textContent=q.title;$('#quizPrompt').textContent=q.prompt;$('#quizCategory').textContent=catLabels[q.cat]+' · '+'★'.repeat(q.level);$('#quizCounter').textContent=String(q.id).padStart(2,'0')+' / '+questions.length;$('#quizAnswerText').textContent=q.answer;$('#quizFollow').textContent='▸ 延伸追問：'+q.follow;$('#quizPitfall').textContent='⚠ 常見誤區：'+q.pitfall;$('#quizSource').textContent='對應：'+q.slide;$('#quizAnswer').hidden=true;$('#showAnswer').textContent='顯示標準回答與追問';$('#selfAnswer').value=state.drafts[q.id]||'';$('#quizStatus').textContent=state.questions[q.id]==='mastered'?'已掌握 ✓':state.questions[q.id]==='review'?'需要複習 ↻':'尚未標記';save();}
$('#showAnswer').addEventListener('click',()=>{const el=$('#quizAnswer');el.hidden=!el.hidden;$('#showAnswer').textContent=el.hidden?'顯示標準回答與追問':'收起標準回答';});
function markQ(status){state.questions[currentQuestion]=status;state.drafts[currentQuestion]=$('#selfAnswer').value;save();updateProgress();renderList();$('#quizStatus').textContent=status==='mastered'?'已掌握 ✓':'需要複習 ↻';toast(status==='mastered'?'已標記掌握':'已加入複習清單');}
$('#markReview').addEventListener('click',()=>markQ('review'));$('#markMastered').addEventListener('click',()=>markQ('mastered'));
const moveQ=dir=>{const ids=filteredQs().map(q=>q.id);const items=ids.length?ids:questions.map(q=>q.id);const i=items.indexOf(currentQuestion);selectQ(items[((i<0?0:i)+dir+items.length)%items.length]);};
$('#nextQuestion').addEventListener('click',()=>moveQ(1));$('#prevQuestion').addEventListener('click',()=>moveQ(-1));$('#randomQuestion').addEventListener('click',()=>{const items=filteredQs();if(!items.length){toast('請先調整篩選條件');return;}selectQ(items[Math.floor(Math.random()*items.length)].id);});
['#quizFilter','#quizLevel'].forEach(s=>$(s).addEventListener('change',()=>{renderList();const f=filteredQs();if(f.length)selectQ(f[0].id)}));$('#questionSearch').addEventListener('input',renderList);$('#selfAnswer').addEventListener('input',()=>{state.drafts[currentQuestion]=$('#selfAnswer').value;save()});
const copyText=async(text)=>{try{await navigator.clipboard.writeText(text);toast('已複製到剪貼簿');return;}catch(e){const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();try{document.execCommand('copy');toast('已複製到剪貼簿')}catch(e){toast('複製失敗，可手動選取文字')}t.remove();}};
$('#copyPrompt').addEventListener('click',()=>{const q=questions[currentQuestion-1];copyText(`你是我的奈米光電檢測技術 PBL 老師，現在針對 TEM 考我。請先問這題，不要直接給答案，依照我的回答嚴格追問，指出觀念漏洞，一次只考一題。\n題目：${q.title}\n情境：${q.prompt}\n完成我的回答後，請針對物理原理、觀測證據、儀器限制與替代解釋評分。`)});
$('#clearProgress').addEventListener('click',()=>{if(confirm('確定重置全部章節完成狀態、題目熟悉度與作答草稿？此動作無法還原。')){state={modules:{},questions:{},drafts:{}};$$('.module-check').forEach(i=>i.checked=false);save();updateProgress();selectQ(1);renderList();toast('進度已重置')}});
renderList();selectQ(1);
const glossary=[
['TEM','Transmission Electron Microscopy','穿透式電子顯微術，利用穿透薄片電子成像或繞射'],['STEM','Scanning Transmission Electron Microscopy','聚焦細束逐點掃描薄片、用偵測器收訊號'],['CTEM','Conventional TEM','近似平行照明、透鏡投影影像'],['BF','Bright-Field Imaging','明場成像；主要收集直射電子，較強繞射的區域可能比較暗'],['DF','Dark-Field Imaging','暗場成像；選特定繞射束，符合繞射條件的晶粒可能較亮'],['HRTEM','High-resolution TEM','以高空間頻率與相位對比觀察晶格'],['SAED / SADP','Selected-area Electron Diffraction / Pattern','藉選區光闌取得特定區域繞射圖'],['NBD','Nanobeam Diffraction','以小探針取得局部繞射'],['CBED','Convergent Beam Electron Diffraction','會聚束形成繞射圓盤'],['BFP','Back Focal Plane','按散射角排列的物鏡後焦平面'],['FIP','First Image Plane','物鏡初級成像平面'],['Objective aperture','物鏡光闌','在後焦平面附近控制選束 BF/DF'],['SA aperture','Selected-area aperture','在像平面共軛位置選定繞射區域'],['Camera length','有效相機長度 L','將散射角映射成繞射斑點半徑的校正常數'],['d-spacing','晶面間距','晶面 hkl 相鄰平面間的距離'],['Miller index','米勒指數 (hkl)','描述晶面的倒空間方向'],['Zone axis','區軸 [uvw]','與電子束方向關聯的晶體方向'],['Reciprocal lattice','倒晶格','晶格週期的空間頻率表示法'],['Bragg condition','布拉格條件','2d sinθ=nλ 的建設性干涉幾何'],['Kinematical diffraction','運動學繞射','以近似一次散射描述繞射'],['Dynamical diffraction','動力學繞射','考慮多重散射與電子束間耦合'],['Forbidden reflection','禁制反射','理想結構因子消光的反射'],['Double diffraction','雙重繞射','電子依序經不同 g 繞射，可能出現額外反射'],['Structure factor','結構因子','晶胞內散射波的相位總和'],['Cs','Spherical aberration coefficient','球面像差係數'],['Scherzer defocus','Scherzer 欠焦','傳統 HRTEM 優化相位傳遞的特定欠焦條件'],['CTF','Contrast Transfer Function','像差／離焦控制的空間頻率傳遞函數'],['Astigmatism','散光','透鏡不同方位聚焦不一致'],['Stigmator','散光校正器','校正透鏡非對稱聚焦'],['Phase contrast','相位對比','電子波干涉／相位傳遞產生的影像對比'],['Mass-thickness contrast','質量厚度對比','散射強度受質量密度與厚度影響'],['Diffraction contrast','繞射對比','晶向／晶體缺陷引起的繞射條件差異'],['FFT','Fast Fourier Transform','將影像轉成空間頻率表示'],['IFFT','Inverse FFT','將選擇的頻率重新變回影像'],['Stacking fault','堆疊錯誤','晶面堆疊次序局部改變'],['Twin','雙晶','晶格兩側具有鏡像取向關係'],['Dislocation','位錯','晶格線缺陷與局部應變場'],['Burgers vector','柏格斯向量 b','描述位錯引起晶格平移失配'],['Weak-beam DF','弱束暗場','使用弱激發繞射條件凸顯局部位錯對比'],['Moiré fringes','莫爾條紋','兩組晶格週期重疊形成的長週期對比'],['FIB','Focused Ion Beam','聚焦離子束定點薄片製備'],['PIPS','Precision Ion Polishing System','離子研磨薄化系統'],['Curtaining','窗簾效應','離子研磨不均留下的條紋'],['Redeposition','再沉積','被移除的材料沉積到其他位置'],['HAADF','High-angle Annular Dark Field','高角度環形暗場，常具 Z 對比'],['ADF','Annular Dark Field','收取環形散射角電子的 STEM 影像'],['Z contrast','原子序對比','同條件下高 Z 柱常更亮的趨勢'],['Channeling','電子通道效應','電子沿原子柱傳播造成訊號與取向耦合'],['EDS / EDX','Energy-Dispersive X-ray Spectroscopy','量測特徵 X-ray 的元素分析'],['EELS','Electron Energy-Loss Spectroscopy','量測電子能量損失的分析'],['ELNES','Energy-loss Near-edge Structure','EELS 邊緣精細結構，反映電子態／鍵結'],['ZLP','Zero-loss Peak','EELS 無明顯能量損失的主峰'],['EFTEM','Energy-filtered TEM','用能量濾鏡選定出射電子形成影像'],['Electron dose','電子劑量','單位面積累積電子數，與束損傷風險相關'],['Knock-on damage','原子位移損傷','電子傳遞動能使原子偏離位置'],['Radiolysis','輻解','電子束造成化學鍵與材料成分變化']
];
function renderGlossary(){const q=$('#glossarySearch').value.trim().toLowerCase();const matches=glossary.filter(g=>g.join(' ').toLowerCase().includes(q));const cont=$('#glossaryList');cont.innerHTML='';matches.forEach(g=>{const e=document.createElement('div');e.className='gloss';e.innerHTML=`<b>${htmlEscape(g[0])}</b><small>${htmlEscape(g[1])}</small><span class="small">${htmlEscape(g[2])}</span>`;cont.appendChild(e)});if(!matches.length)cont.textContent='找不到符合術語，試試英文縮寫或中文關鍵字。';}$('#glossarySearch').addEventListener('input',renderGlossary);renderGlossary();
function exportNotes(){state.drafts[currentQuestion]=$('#selfAnswer').value;save();const date=new Date().toISOString().slice(0,10);let s=`TEM Insight Lab｜我的光電檢測 PBL 複習筆記\n輸出日期：${date}\n來源：2026 NCHU (S)TEM course outline\n\n`;s+='【已完成章節】\n'+Object.keys(state.modules).filter(k=>state.modules[k]).join(' / ')+'\n\n';const mastered=questions.filter(q=>state.questions[q.id]==='mastered'),review=questions.filter(q=>state.questions[q.id]==='review');s+=`【掌握題目】${mastered.length} / ${questions.length}\n`+mastered.map(q=>`#${q.id} ${q.title}`).join('\n')+'\n\n';s+=`【需複習】${review.length} 題\n`+review.map(q=>`#${q.id} ${q.title}\n原理：${q.answer}\n追問：${q.follow}`).join('\n\n')+'\n\n';s+='【我的作答】\n'+questions.filter(q=>state.drafts[q.id]?.trim()).map(q=>`#${q.id} ${q.title}\n${state.drafts[q.id].trim()}`).join('\n\n');const blob=new Blob(['\ufeff'+s],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`TEM_PBL_我的複習筆記_${date}.txt`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),6000);toast('已匯出筆記（TXT）');}['#exportNotes','#exportNotesBottom'].forEach(sel=>$(sel).addEventListener('click',exportNotes));
$('#copyLink').addEventListener('click',()=>{if(location.protocol==='file:'){toast('離線版：直接傳送 HTML；要分享網址請部署 GitHub Pages');return;}copyText(location.href);});$('#printChecklist').addEventListener('click',()=>window.print());
const observer=new IntersectionObserver(entries=>{const visible=entries.filter(x=>x.isIntersecting);if(!visible.length)return;const target=visible.sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0].target.id;$$('.nav-link').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+target));},{rootMargin:'-20% 0px -55% 0px',threshold:[0,.05,.2,.4]});$$('.side-nav a[href^="#"]').forEach(a=>{const el=$(a.getAttribute('href'));if(el)observer.observe(el);});
})();


// Interactive spherical-aberration schematic and simplified educational estimates.
(function initSphericalAberration(){
  const angle=document.getElementById('csAngle');
  const coeff=document.getElementById('csValue');
  const diagram=document.getElementById('csRayDiagram');
  if(!angle || !coeff || !diagram)return;
  const byId=id=>document.getElementById(id);
  // Schematic ray positions are deliberately exaggerated (NOT an optical ray tracer).
  const lensX=166, axisY=132, paraxialX=450, rayEnd=538;
  function rayPath(offset,focusX,above){
    const sign=above?-1:1;
    const inletY=axisY+sign*offset;
    const targetY=axisY+(axisY-inletY)*(rayEnd-lensX)/(focusX-lensX)+sign*offset;
    return `M24 ${inletY.toFixed(2)} H${lensX} L${focusX.toFixed(2)} ${axisY} L${rayEnd} ${targetY.toFixed(2)}`;
  }
  function render(){
    const alphaMrad=Number(angle.value), alpha=alphaMrad/1000;
    const csMm=Number(coeff.value), lambdaNm=0.00251;
    const diffractionNm=0.61*lambdaNm/alpha;
    const sphericalNm=csMm*1e6*alpha**3;
    byId('csAngleOut').textContent=alphaMrad+' mrad';
    byId('csValueOut').textContent=csMm.toFixed(1)+' mm';
    byId('csDiffraction').textContent=diffractionNm.toFixed(2)+' nm';
    byId('csSpherical').textContent=sphericalNm.toFixed(2)+' nm';
    const interp=byId('csInterpretation');
    interp.textContent=sphericalNm>diffractionNm*1.5
      ? '球面像差模糊較大：減小孔徑角可降低此項，但衍射模糊會增加。'
      : diffractionNm>sphericalNm*1.5
      ? '衍射模糊較大：增加孔徑角可降低此項，但球面像差會快速增加。'
      : '兩項量級接近，表示孔徑角與球面像差之間存在取捨。';

    // Axial displacement tracks Cs * alpha² qualitatively; visual coordinates are not physical units.
    const focusShift=Math.min(145, 76*(csMm/1.2)*(alphaMrad/6)**2);
    const farX=paraxialX-focusShift;
    const outerOffset=42+2.8*alphaMrad;
    const innerOffset=22;
    byId('csNearTop').setAttribute('d',rayPath(innerOffset,paraxialX,true));
    byId('csNearBottom').setAttribute('d',rayPath(innerOffset,paraxialX,false));
    byId('csFarTop').setAttribute('d',rayPath(outerOffset,farX,true));
    byId('csFarBottom').setAttribute('d',rayPath(outerOffset,farX,false));
    byId('csFarPoint').setAttribute('cx',farX.toFixed(2));
    byId('csFarGuide').setAttribute('x1',farX.toFixed(2));
    byId('csFarGuide').setAttribute('x2',farX.toFixed(2));
    byId('csFarLabel').setAttribute('x',Math.min(farX,paraxialX-45).toFixed(2));
    // Illustrate spread of marginal rays at the paraxial focal plane.
    const blurRadius=Math.min(93,Math.abs(outerOffset*(paraxialX-farX)/(farX-lensX)));
    const blur=byId('csBlurPlane');
    blur.setAttribute('y',(axisY-blurRadius).toFixed(2));
    blur.setAttribute('height',(2*blurRadius).toFixed(2));
  }
  angle.addEventListener('input',render);
  angle.addEventListener('change',render);
  coeff.addEventListener('input',render);
  coeff.addEventListener('change',render);
  render();
})();

// Integrated explanatory model: crystal position -> diffraction directions -> selected beams -> camera.
(() => {
  'use strict';
  const root=document.getElementById('beam-story-simulator');
  if(!root)return;
  const el=(id)=>document.getElementById(id);
  const modeBox=el('formationModes');
  const tilt=el('formationTilt');
  const dSlider=el('formationSpacing');
  let mode='bf';
  const svgNS='http://www.w3.org/2000/svg';
  const add=(parent,tag,attrs)=>{const n=document.createElementNS(svgNS,tag);for(const [key,value] of Object.entries(attrs))n.setAttribute(key,String(value));parent.appendChild(n);return n;};
  const lighten=(val)=>{
    const v=Math.round(23+Math.max(0,Math.min(1,val))*215);
    return `rgb(${v},${Math.min(255,v+11)},${Math.min(255,v+20)})`;
  };
  const updateSpot=(node,energy)=>{
    node.style.opacity=String((.23+energy*.77).toFixed(3));
    node.setAttribute('r',(4.5+7*energy).toFixed(2));
  };
  function rerender(){
    const aTilt=Number(tilt.value);
    const ag1=.76*Math.exp(-Math.pow(aTilt/4.5,2));
    const ag2=.05;
    const bg1=.07;
    const bg2=.55;
    const a0=Math.max(.04,1-ag1-ag2-.05);
    const b0=1-bg1-bg2-.06;
    el('formationTiltOut').textContent=aTilt+'°';
    el('formA0').style.width=(a0*100).toFixed(0)+'%';
    el('formAg1').style.width=(ag1*100).toFixed(0)+'%';
    el('formBg2').style.width=(bg2*100).toFixed(0)+'%';
    updateSpot(el('formSpot000'),(a0+b0)/2);
    updateSpot(el('formSpotG1'),(ag1+bg1)/2);
    updateSpot(el('formSpotG2'),(ag2+bg2)/2);
    updateSpot(el('formCamera000'),(a0+b0)/2);
    updateSpot(el('formCameraG1'),(ag1+bg1)/2);
    updateSpot(el('formCameraG2'),(ag2+bg2)/2);
    const ring=el('formApertureRing');
    const isDP=mode==='dp';
    ring.style.display=isDP?'none':'';
    const spots={bf:[120,104],df1:[181,77],df2:[63,65]};
    if(!isDP){ring.setAttribute('cx',spots[mode][0]);ring.setAttribute('cy',spots[mode][1]);}
    el('formationImagePixels').style.display=isDP?'none':'';
    el('formationPatternPixels').style.display=isDP?'':'none';
    const title=el('formationCameraKind'), caption=el('formationCameraCaption'), explain=el('formationExplanation');
    if(isDP){
      title.textContent='後焦平面 → 繞射圖';
      caption.textContent='相機橫縱位置對應散射角度，亮度代表該方向的電子訊號；不是樣品顆粒的位置照片。';
      explain.textContent='繞射模式：把物鏡後焦平面經中間／投影透鏡放大到相機。中心的 000 代表近直行電子，g₁ 和 g₂ 代表不同散射方向；斑點位置與晶格週期、取向相關。這裡不使用物鏡光闌挑單一方向。';
    }else{
      const a={bf:a0,df1:ag1,df2:ag2}[mode];
      const b={bf:b0,df1:bg1,df2:bg2}[mode];
      el('formGrainA').setAttribute('fill',lighten(a));
      el('formGrainB').setAttribute('fill',lighten(b));
      title.textContent='像平面 → '+({bf:'明場影像',df1:'g₁ 暗場影像',df2:'g₂ 暗場影像'}[mode]);
      caption.textContent=`相機保留晶粒 A（左）和晶粒 B（右）的位置；目前亮度分別代表通過所選光闌的理想化強度。`;
      if(mode==='bf')explain.textContent='明場：物鏡光闌只讓中央直射束（000）參與成像。若晶粒 A 正在強烈繞射到 g₁，它剩下的直射電子較少，所以 A 在明場圖變暗。晶粒並不是本身「變黑」了。';
      else if(mode==='df1')explain.textContent='暗場 g₁：光闌只放行第一個繞射方向 g₁，其餘包含直射束大多被阻擋。晶粒 A 符合 g₁ 條件，往此方向的電子較多，所以它在原來的左側位置呈亮色；B 較暗。';
      else explain.textContent='暗場 g₂：光闌改選另一個出射方向 g₂。現在晶粒 B 對這一道束貢獻較大，所以右側 B 變亮、A 變暗。同一束入射電子、同一塊樣品，只是「挑選不同方向的電子」形成不同影像。';
      if(Math.abs(aTilt)>=6)explain.textContent+=' 現在把晶粒 A 傾斜，g₁ 繞射條件變差，所以 A 的 g₁ 訊號減弱。';
    }
    [...modeBox.querySelectorAll('[data-formmode]')].forEach(btn=>{const active=btn.dataset.formmode===mode;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));});
  }
  modeBox.addEventListener('click',e=>{const btn=e.target.closest('[data-formmode]');if(!btn)return;mode=btn.dataset.formmode;rerender()});
  tilt.addEventListener('input',rerender);
  tilt.addEventListener('change',rerender);
  function rerenderSpacing(){
    const d=Number(dSlider.value);
    el('formationSpacingOut').textContent=d.toFixed(2)+' nm';
    const real=el('formRealSpace'),recip=el('formRecipSpace');
    real.replaceChildren();recip.replaceChildren();
    add(real,'rect',{x:0,y:0,width:320,height:112,fill:'#14283b'});
    add(recip,'rect',{x:0,y:0,width:320,height:112,fill:'#14283b'});
    const s=d*138; const n=Math.floor(270/s);
    for(let i=0;i<=n;i++){
      let x=25+i*s;
      for(let y of [29,55,81])add(real,'circle',{cx:x.toFixed(1),cy:y,r:5,fill:'#91d6e8'});
    }
    add(real,'line',{x1:25,y1:104,x2:25+s,y2:104,stroke:'#ffd08b','stroke-width':2});
    add(real,'path',{d:`M25 100 V108 M${(25+s).toFixed(1)} 100 V108`,stroke:'#ffd08b','stroke-width':1.5});
    const r=27/d;
    add(recip,'path',{d:'M18 56 H302 M160 12 V100',stroke:'#4d6b80','stroke-width':1,'stroke-dasharray':'4 5'});
    for(let side of [-1,1])add(recip,'circle',{cx:160+side*r,cy:56,r:6,fill:'#93efdc'});
    add(recip,'circle',{cx:160,cy:56,r:6,fill:'#f4f9ff'});
    add(recip,'line',{x1:160,y1:89,x2:160+r,y2:89,stroke:'#ffcf86','stroke-width':2});
    add(recip,'path',{d:`M160 85 V93 M${(160+r).toFixed(1)} 85 V93`,stroke:'#ffcf86','stroke-width':1.4});
    const g=1/d;
    el('formationSpacingExplain').textContent=`目前 d = ${d.toFixed(2)} nm；空間頻率 g = 1/d = ${g.toFixed(2)} nm⁻¹。d 變小，g 變大，因此在固定電子波長和有效相機長度下，對應繞射點距中心更遠。兩側共用的尺度僅是示意。`;
  }
  dSlider.addEventListener('input',rerenderSpacing);
  dSlider.addEventListener('change',rerenderSpacing);
  rerender();rerenderSpacing();
})();

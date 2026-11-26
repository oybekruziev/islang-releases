// the whole island: scale the replica to fit, live clock/date, small loops, theme picker
(()=>{
  const ix=document.getElementById('ix'),st=document.getElementById('ixStage');if(!ix)return;
  const fit=()=>{const n=ix.clientWidth<640,W=n?712:900,s=ix.clientWidth/W;st.style.transform='scale('+s+')'+(n?' translateX(-94px)':'');ix.style.height=(st.offsetHeight*s)+'px'};
  new ResizeObserver(fit).observe(ix);fit();
  const d=new Date(),wd=d.toLocaleDateString('en-US',{weekday:'short'}),mo=d.toLocaleDateString('en-US',{month:'short'});
  ix.querySelector('[data-ix-date]').textContent=(wd+', '+mo+' '+d.getDate()).toUpperCase();
  const clk=ix.querySelector('[data-ix-clock]');
  const hm=x=>String(x.getHours()).padStart(2,'0')+':'+String(x.getMinutes()).padStart(2,'0');
  const tick=()=>{const n=new Date();clk.innerHTML=n.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}).replace(',','')+'&nbsp;&nbsp;'+hm(n)};tick();
  const ev=new Date(d.getTime()+4*60000);ev.setSeconds(0);
  const when=ix.querySelector('[data-ix-when]'),evt=ix.querySelector('.ix-evt');
  const evDraw=()=>{const m=Math.max(0,Math.ceil((ev-new Date())/60000));when.textContent=hm(ev)+(m>0?', in '+m+' min':', now');evt.classList.toggle('soon',m<=1)};evDraw();
  // themes
  const glow={space:['#8E6CFF','#2BD4C6'],candy:['#FF8FC7','#C79BFF'],supercar:['#3C7BFF','#FF3B30'],ocean:['#3FD0E8','#1E6FD9'],neon:['#FF3FA4','#22D3EE'],forest:['#F2C14E','#4E9F5B']};
  const bg=ix.querySelector('[data-ix-bg]'),bgw=ix.querySelector('.ix-bg');
  const setTheme=t=>{document.querySelectorAll('.ix-themes button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.th===t));
    if(t==='none'){bg.style.opacity=0;bgw.style.setProperty('--g1','transparent');bgw.style.setProperty('--g2','transparent');return}
    bgw.style.setProperty('--g1',glow[t][0]);bgw.style.setProperty('--g2',glow[t][1]);
    bg.style.opacity=0;setTimeout(()=>{bg.src='/img/themes/'+t+'.webp';bg.onload=()=>bg.style.opacity=.8},180)};
  document.querySelectorAll('.ix-themes button').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.th)));
  bgw.style.setProperty('--g1',glow.space[0]);bgw.style.setProperty('--g2',glow.space[1]);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let t=72,id=0;const L=204,bar=ix.querySelector('[data-ix-bar]'),cur=ix.querySelector('[data-ix-cur]'),cpu=ix.querySelector('[data-ix-cpu]');
  const mmss=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
  const step=()=>{t=t>=L?0:t+1;cur.textContent=mmss(t);bar.style.width=(t/L*100)+'%';
    if(t%3===0)cpu.textContent='CPU '+(12+Math.round(Math.random()*14))+'%';if(t%10===0){tick();evDraw()}};
  new IntersectionObserver(([e])=>{ix.classList.toggle('fx-on',e.isIntersecting);
    if(e.isIntersecting&&!id)id=setInterval(step,1000);else if(!e.isIntersecting&&id){clearInterval(id);id=0}},{threshold:.15}).observe(ix);
})();

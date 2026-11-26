// live feature cards: small loops drawn from the real app (paused off-screen, off with Reduce Motion)
(()=>{
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mmss=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
  // calendar: this week, today highlighted
  const wk=document.querySelector('[data-week]');
  if(wk){const d=new Date(),dow=(d.getDay()+6)%7,mon=new Date(d);mon.setDate(d.getDate()-dow);
    [...wk.querySelectorAll('b')].forEach((b,i)=>{const x=new Date(mon);x.setDate(mon.getDate()+i);b.textContent=x.getDate();b.classList.toggle('today',i===dow)})}
  const loops={
    music(el){let t=72;const L=204,bar=el.querySelector('.fm-bar b'),cur=el.querySelector('[data-cur]');
      return()=>{t=t>=L?0:t+1;cur.textContent=mmss(t);bar.style.width=(t/L*100)+'%';
        if(t===80)el.classList.add('loved');if(t===0)el.classList.remove('loved')}},
    cal(el){let m=4,hold=0;const w=el.querySelector('[data-when]');
      const draw=()=>{w.textContent=m>0?'10:30, in '+m+' min':'Now, 10:30';el.classList.toggle('soon',m<=1);el.classList.toggle('now',m===0)};
      return(n)=>{if(n%2)return;if(m===0){if(++hold>3){hold=0;m=4}}else m--;draw()}},
    focus(el){let s=24*60+12;const T=25*60,t=el.querySelector('[data-timer]'),r=el.querySelector('.ff-ring');
      return()=>{s=s<=0?T:s-1;t.textContent=mmss(s);r.style.setProperty('--p',((T-s)/T).toFixed(4))}},
    clip(el){const pool=[['Aa','Invoice for November'],['{}','npm run build'],['↗','figma.com/design/islang'],['▣','Screenshot 9.41'],['Aa','Call Aziz at 6'],['↗','polar.sh/islang']];let i=0;
      return(n)=>{if(n%3)return;const [ic,tx]=pool[i++%pool.length];const c=document.createElement('div');c.className='clip in';
        c.innerHTML='<span class="ic"></span><span class="ct"></span>';c.children[0].textContent=ic;c.children[1].textContent=tx;
        const rows=el.querySelectorAll('.clip');const keep=rows[0].querySelector('.open')?1:0;
        el.insertBefore(c,rows[keep]||null);const all=el.querySelectorAll('.clip');if(all.length>3)all[all.length-1].remove()}},
    pets(el){return(n)=>{if(n%9===4){el.classList.remove('party');void el.offsetWidth;el.classList.add('party')}}},
    hud(el){const v=el.querySelector('[data-vol]'),vn=el.querySelector('[data-voln]'),b=el.querySelector('[data-bri]'),bn=el.querySelector('[data-brin]');
      const seq=[62,68,75,81,75,56,44,50,62],bri=[80,80,74,66,58,66,74,80,80];let k=0;
      return()=>{k=(k+1)%seq.length;v.style.width=seq[k]+'%';vn.textContent=seq[k];b.style.width=bri[k]+'%';bn.textContent=bri[k]}}
  };
  document.querySelectorAll('[data-fx]').forEach(el=>{
    if(still)return;
    const step=loops[el.dataset.fx](el);let id=0,n=0;
    new IntersectionObserver(([e])=>{
      el.classList.toggle('fx-on',e.isIntersecting);
      if(e.isIntersecting&&!id)id=setInterval(()=>step(++n),1000);
      else if(!e.isIntersecting&&id){clearInterval(id);id=0}
    },{threshold:.2}).observe(el);
  });
})();

/* Presentation state only: existing basic lookup and submission own all requests. */
(()=>{
  function progress(step){
    document.querySelectorAll('.ti-progress li').forEach((item,i)=>{
      item.dataset.state=i+1<step||step===3?'complete':i+1===step?'current':'pending';
      if(i+1===step)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');
    });
    const current=['Find your profile','Complete your application','Application received'][step-1];
    KSPreferences.setText(document.getElementById('application-progress-status'),'Step {number} of 3: {step}',{number:step,step:KSPreferences.message(current)});
  }
  function profile(player){
    const avatar=document.getElementById('governor-avatar');avatar.replaceChildren();
    const initials=document.createElement('span');initials.textContent=Array.from(String(player.name||player.player_id||'?').trim()).slice(0,2).join('');initials.setAttribute('aria-hidden','true');avatar.append(initials);
    try{
      const url=new URL(player.avatar_url);if(url.protocol!=='https:'||url.username||url.password)return;
      const image=document.createElement('img');image.width=80;image.height=80;image.alt='';image.referrerPolicy='no-referrer';image.decoding='async';
      image.onload=()=>{initials.hidden=true};image.onerror=()=>{image.remove();initials.hidden=false};image.src=url.href;avatar.append(image);
    }catch{/* The returned avatar is optional; initials remain visible. */}
  }
  window.KSApplication={progress,profile};progress(1);
})();

/* Lightweight Compare-only barrier; not ownership verification or backend auth. */
(()=>{
 const TTL=30*60*1000, STORAGE='ks169-compare-access-v1';
 const input=$('visitor-id'),button=$('check-player'),form=$('access-form'),profile=$('access-profile'),next=$('access-continue'),message=$('access-message');
 let record=null,lease=null,candidate=null,sequence=0,pending=false,request=null,expiry=null;
 let adminMode='checking',adminLease=null,adminExpires=0;
 const text=(key,error=false)=>{KSPreferences.setText(message,key);message.className='msg'+(error?' error':'')};
 const validPlayer=(p,id)=>p&&typeof p==='object'&&!Array.isArray(p)&&typeof p.player_id==='string'&&/^\d{4,20}$/.test(p.player_id)&&(!id||p.player_id===id)&&typeof p.name==='string'&&p.name.trim().length>0&&(p.kingdom===169||p.kingdom==='169');
 const fresh=r=>r&&r.approved===true&&validPlayer(r.player)&&Number.isFinite(r.issued)&&Number.isFinite(r.expires)&&r.issued<=Date.now()&&r.expires>Date.now()&&r.expires-r.issued>0&&r.expires-r.issued<=TTL;
 function forget(){try{sessionStorage.removeItem(STORAGE)}catch{}}
 function clear(note=''){
  sequence++;request?.abort();request=null;pending=false;clearTimeout(expiry);lease?.abort();lease=null;record=null;candidate=null;forget();
  form.hidden=false;profile.hidden=true;input.disabled=false;button.disabled=false;KSPreferences.setText(button,'Check player');
  $('comparison-controls').hidden=true;$('compare').disabled=true;$('results').classList.add('hidden');
  for(const id of ['strength','activity','breakdown'])$(id).replaceChildren();KSPreferences.setText($('msg'),'');
  text(note);next.hidden=false;
 }
 function allowed(){if(adminMode==='admin'){if(Date.now()<adminExpires)return true;setAdminState('visitor')}if(adminMode!=='visitor')return false;if(record&&!fresh(record))clear('Access expired. Check your player again.');return !!record}
 function show(p){form.hidden=true;profile.hidden=false;KSPreferences.setRawText($('visitor-name'),p.name);KSPreferences.setText($('visitor-meta'),'Player ID {id}',{id:p.player_id});KSPreferences.setText($('visitor-state'),'State {state}',{state:169})}
 function approve(r,focus=false){
  if(!fresh(r)){clear('Access expired. Check your player again.');return}
  record=r;lease=new AbortController();show(r.player);next.hidden=true;$('comparison-controls').hidden=false;$('compare').disabled=false;text('');
  try{sessionStorage.setItem(STORAGE,JSON.stringify(r))}catch{/* Current-tab memory still works when storage is unavailable. */}
  expiry=setTimeout(()=>{if(!allowed())input.focus()},Math.max(0,r.expires-Date.now()));if(focus)$('opponent').focus();
 }
 async function lookup(event){
  event.preventDefault();if(pending||adminMode!=='visitor')return;
  const id=input.value.trim();input.value=id;clear();
  if(!/^\d{4,20}$/.test(id)){text('Enter a valid numeric Player ID.',true);return}
  pending=true;button.disabled=true;KSPreferences.setText(button,'Finding…');const own=++sequence;request=new AbortController();const controller=request;
  const timeout=setTimeout(()=>controller.abort(),10000);
  try{
   const response=await fetch(API.replace('kingdom-compare','player-lookup'),{method:'POST',headers:{'Content-Type':'application/json',apikey:KEY,Authorization:'Bearer '+KEY},body:JSON.stringify({player_id:id}),signal:controller.signal});
   if(own!==sequence)return;
   if(response.status===429){text('Too many lookups. Please wait before trying again.',true);return}
   if(!response.ok){text('Player lookup failed. Please try again.',true);return}
   const body=await response.json();if(own!==sequence)return;
   const p=body?.player;
   if(body?.ok!==true||!p||typeof p!=='object'||Array.isArray(p)||typeof p.player_id!=='string'||p.player_id!==id||typeof p.name!=='string'||!p.name.trim()){text('Player information could not be confirmed.',true);return}
   if(!validPlayer(p,id)){
    const kingdom=p.kingdom;
    text((typeof kingdom==='number'&&Number.isInteger(kingdom)&&kingdom>0)||(typeof kingdom==='string'&&/^[1-9]\d*$/.test(kingdom))?'Kingdom Compare is currently available to State 169 players.':'Player information could not be confirmed.',true);return;
   }
   const issued=Date.now();candidate={player:{player_id:id,name:p.name,kingdom:169},issued,expires:issued+TTL,approved:true};show(candidate.player);text('Profile found');next.focus();
   expiry=setTimeout(()=>{clear('Access expired. Check your player again.');input.focus()},TTL);
  }catch(error){if(own===sequence)text(controller.signal.aborted?'Player lookup timed out. Please try again.':'Player lookup failed. Please try again.',true)}
  finally{clearTimeout(timeout);if(own===sequence){pending=false;request=null;button.disabled=false;KSPreferences.setText(button,'Check player')}}
 }
 form.addEventListener('submit',lookup);
 input.addEventListener('input',()=>clear());
 $('access-change').onclick=()=>{clear();input.value='';input.focus()};
 next.onclick=()=>{if(candidate){clearTimeout(expiry);approve(candidate,true)}};
 window.addEventListener('focus',allowed);window.addEventListener('pageshow',allowed);document.addEventListener('visibilitychange',allowed);
 function setAdminState(mode,expires=0){
  if(candidate&&!record){clearTimeout(expiry);candidate=null;profile.hidden=true;form.hidden=false}
  sequence++;request?.abort();request=null;pending=false;button.disabled=false;KSPreferences.setText(button,'Check player');
  adminLease?.abort();lease?.abort();adminLease=null;lease=null;adminMode=mode;adminExpires=expires;
  $('results').classList.add('hidden');for(const id of ['strength','activity','breakdown'])$(id).replaceChildren();KSPreferences.setText($('msg'),'');
  $('player-access').hidden=mode!=='visitor';
  if(mode==='admin')adminLease=new AbortController();
  else if(mode==='visitor'&&fresh(record))lease=new AbortController();
  $('comparison-controls').hidden=!allowed();$('compare').disabled=!allowed();
 }
 const ticket=()=>allowed()?(adminMode==='admin'?adminLease:lease):null;
 window.CompareAccess={ticket,valid:value=>!!value&&value===ticket(),setAdminState};
 let stored=null;try{stored=JSON.parse(sessionStorage.getItem(STORAGE))}catch{}
 clear();if(fresh(stored)){input.value=stored.player.player_id;approve(stored)}$('comparison-controls').hidden=true;$('compare').disabled=true;
})();

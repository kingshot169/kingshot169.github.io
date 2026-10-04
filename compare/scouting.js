/* KvK scouting uses only the existing public Supabase boundaries and current access lease. */
(()=>{
 const root=$('kvk-report'),list=$('kvk-summary'),cards=$('kvk-cards'),button=$('kvk-scout'),status=$('kvk-status');
 const slots=['helmet','gloves','armour','boots'],titles=['Helmet','Gloves','Armour','Boots'];
 const profiles=new Map(),reports=new Map();let opponent=null,active=null,generation=0,blockedUntil=0;
 const record=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:null;
 const validNumber=value=>typeof value==='number'&&Number.isFinite(value)&&value>=0;
 const text=value=>typeof value==='string'||typeof value==='number'?String(value).replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g,' ').trim().slice(0,200):'';
 const numeric=value=>typeof value==='number'&&Number.isSafeInteger(value)&&value>=0?String(value):typeof value==='string'&&/^\d{1,6}$/.test(value)?value:'—';
 const tr=(node,key,params={})=>KSPreferences.setText(node,key,params);
 const raw=(node,value)=>KSPreferences.setRawText(node,text(value));
 const el=(tag,className='',value)=>{const node=document.createElement(tag);node.className=className;if(value!==undefined)raw(node,value);return node};
 const label=(tag,key,className='',params={})=>{const node=el(tag,className);tr(node,key,params);return node};
 function location(profile){const p=record(profile?.details?.location);return p&&Number.isSafeInteger(p.x)&&p.x>=0&&Number.isSafeInteger(p.y)&&p.y>=0?`K${text(profile.player.kingdom)||'—'} · X ${p.x} · Y ${p.y}`:null}
 function trial(profile){const value=profile?.details?.ranks?.mystic_trial;return validNumber(value)||typeof value==='string'&&value.trim()&&!/^(unknown|unavailable|null)$/i.test(value.trim())?text(value):null}
 function validTimestamp(value){return value===null||typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)&&Number.isFinite(Date.parse(value))}
 function ranking(data,kid){
  if(!record(data)||data.ok!==true||data.version!==1||data.kid!==kid||data.board!=='personal_power'||data.source!=='MightPulse'||data.coverage!=='unknown'||data.complete!==true||data.order!=='power-desc'||data.tie_policy!=='source-order'||typeof data.retrieved_at!=='string'||!validTimestamp(data.retrieved_at)||!validTimestamp(data.source_timestamp)||typeof data.cached!=='boolean'||!Array.isArray(data.players)||!data.players.length||data.players.length>100)throw Error('unverified');
  const seen=new Set();let previous=Infinity;
  for(const [i,row]of data.players.entries()){
   if(!record(row)||row.position!==i+1||typeof row.governor_id!=='string'||!/^\d{4,20}$/.test(row.governor_id)||seen.has(row.governor_id)||!validNumber(row.power)||row.power>previous||!(row.nick_name===null||typeof row.nick_name==='string'&&row.nick_name.length<=200))throw Error('unverified');
   previous=row.power;seen.add(row.governor_id);
  }
  return data.players.slice(0,10);
 }
 function slotMetadata(item){
  const named=value=>typeof value==='string'?[...new Set([...value.matchAll(/\b(helmet|gloves|armou?r|boots)\b/gi)].map(match=>match[1].toLowerCase().replace('armor','armour')))]:[];
  const declared=named(item.slot),described=named(item.name),mentioned=[...new Set([...declared,...described])];
  const explicit=item.slot!==undefined&&item.slot!==null&&(typeof item.slot!=='string'||item.slot.trim()!=='');
  // There is no documented precedence for contradictory or unknown slot metadata.
  if(mentioned.length!==1||explicit&&declared.length!==1)return {slot:null,ambiguous:mentioned};
  return {slot:mentioned[0],ambiguous:[]};
 }
 function equipmentIdentity(item){
  // Compare the public projection, independently of JSON key order and null padding.
  const fields=['eid','sid','name','enhancement_level','refine_level','gear_level','quality','quality_key','quality_label','red','troop','troop_label'];
  return JSON.stringify(fields.map(key=>item[key]??null));
 }
 function gearTiles(hero){
  const gear=hero?.gear,placed=new Map(),ambiguous=new Set();
  for(const value of Array.isArray(gear)?gear:[]){
   const item=record(value);if(!item)continue;
   const metadata=slotMetadata(item);for(const slot of metadata.ambiguous)ambiguous.add(slot);
   const slot=metadata.slot;if(!slot)continue;
   const previous=placed.get(slot);
   if(previous&&equipmentIdentity(previous)!==equipmentIdentity(item))ambiguous.add(slot);
   else if(!previous)placed.set(slot,item);
  }
  return slots.map((slot,i)=>{
   const item=ambiguous.has(slot)?null:placed.get(slot),quality=text(item?.quality_key??item?.quality_label).toLowerCase();
   const red=item?.red===true,gold=!red&&['gold','mythic','legendary'].includes(quality);let enhancement=numeric(item?.enhancement_level);
   if(red&&enhancement!=='—')enhancement=Number(enhancement)>=101?String(Number(enhancement)-100):'—';
   const state=record(gear)?.hidden===true?'Hidden':Array.isArray(gear)&&!gear.length?'No record':item?'available':'Unavailable';
   const troops=new Set([item?.troop_label,item?.troop,item?.name].flatMap(v=>text(v).toLowerCase().match(/\b(infantry|cavalry|archer)\b/g)||[]));
   const artwork=state==='available'&&(red||gold)&&troops.size===1?`./scouting-assets/cutouts/${[...troops][0]}-${{helmet:'helm',gloves:'gloves',armour:'chest',boots:'boots'}[slot]}.png`:null;
   return {slot,title:titles[i],tier:red?'Red':gold?'Gold':null,state,enhancement,mastery:numeric(item?.refine_level),artwork};
  });
 }
 function portrait(url,className){
  const placeholder=el('span',className);placeholder.setAttribute('aria-hidden','true');placeholder.textContent='◈';
  if(typeof url!=='string'||url.length>500||/\s|\\/.test(url))return placeholder;
  try{const target=new URL(url,'https://mightpulse.com');if(!['https://mightpulse.com','https://api.mightpulse.com','https://got-global-avatar.akamaized.net'].includes(target.origin)||target.username||target.password||target.hash)return placeholder;
   const img=el('img',className);img.src=target.href;img.alt='';img.loading='lazy';img.referrerPolicy='no-referrer';img.addEventListener('error',()=>img.replaceWith(placeholder),{once:true});return img;
  }catch{return placeholder}
 }
 function valueNode(key,value){const node=el('span');tr(node,key,{value:value??KSPreferences.message('Unavailable')});return node}
 function heroCard(value){
  const hero=record(value),row=el('div','kvk-hero-row'),identity=el('div','kvk-hero-identity');identity.append(portrait(hero?.icon,'kvk-hero-portrait'));
  const info=el('div');info.append(el('strong','',text(hero?.name)||'—'),valueNode('Level {value}',numeric(hero?.level)),el('span','',text(hero?.star_label??hero?.stars??hero?.star)||'—'));
  const widget=record(hero?.exclusive_gear);info.append(valueNode('Widget {value}',widget?.hidden===true?KSPreferences.message('Hidden'):numeric(widget?.level??hero?.exclusive_gear_level)));identity.append(info);row.append(identity);
  const equipment=el('div','kvk-gear-line');
  for(const tile of gearTiles(hero)){
   const cell=el('div','kvk-gear '+(tile.tier==='Red'?'is-red':tile.tier==='Gold'?'is-gold':''));cell.append(tile.title==='Unknown slot'?label('span',tile.title,'kvk-slot'):slots.some((s,i)=>titles[i]===tile.title)?label('span',tile.title,'kvk-slot'):el('span','kvk-slot',tile.title));
   if(tile.state!=='available'){cell.append(label('span',tile.state,'kvk-gear-state'));equipment.append(cell);continue}
   if(tile.tier)cell.append(label('span',tile.tier,'kvk-tier'));else cell.append(label('span','Rarity unavailable','kvk-tier'));
   if(tile.artwork){const image=el('img','kvk-equipment-art');image.src=tile.artwork;image.alt='';image.loading='lazy';image.addEventListener('error',()=>image.remove(),{once:true});cell.append(image)}
   cell.append(el('strong','kvk-enhancement',tile.enhancement==='—'?'—':`+${tile.enhancement}`),valueNode('Mastery {value}',tile.mastery));equipment.append(cell);
  }
  row.append(equipment);return row;
 }
 function summaryRow(row,index){
  const li=el('li','kvk-summary-row');li.dataset.playerId=row.governor_id;
  const name=el('a','kvk-ranking-name',`#${row.position} ${text(row.nick_name)||'—'}`);name.href=`#kvk-player-${index}`;name.addEventListener('click',()=>{const card=$(`kvk-player-${index}`);if(card)card.open=true});
  li.append(name,valueNode('Ranking power: {value}',compact(row.power)),valueNode('Alliance: {value}',null),valueNode('Mystic Trial: {value}',KSPreferences.message('Pending')),valueNode('Last known: {value}',KSPreferences.message('Pending')));return li;
 }
 function renderPlayer(row,index,profile){
  const item=list.children[index];if(!item)return;
  tr(item.children[2],'Alliance: {value}',{value:text(profile?.player?.alliance_abbr??profile?.player?.alliance_name)||KSPreferences.message('Unavailable')});
  tr(item.children[3],'Mystic Trial: {value}',{value:trial(profile)??KSPreferences.message('Unavailable')});
  tr(item.children[4],'Last known: {value}',{value:location(profile)??KSPreferences.message('Unavailable')});
  const card=el('details','kvk-player-card');card.id=`kvk-player-${index}`;card.open=index===0;
  const heading=el('summary','kvk-player-heading');heading.append(portrait(profile?.player?.avatar_url,'kvk-player-portrait'));
  const info=el('div');info.append(el('h3','',`#${row.position} ${text(row.nick_name??profile?.player?.name)||'—'}`),label('span','Player ID {id}','',{id:row.governor_id}));
  heading.append(info,label('span','View hero gear','kvk-card-action'));card.append(heading);
  const body=el('div','kvk-player-body'),stats=el('div','kvk-player-stats');stats.append(valueNode('Ranking power: {value}',compact(row.power)),valueNode('Mystic Trial: {value}',trial(profile)),valueNode('Last known: {value}',location(profile)));body.append(stats,label('p','Locations are last known, not live.','kvk-note'));
  if(!profile)body.append(label('p','Profile unavailable; ranking retained.'));
  else{
   const heroes=profile.details?.heroes;
   if(Array.isArray(heroes)&&heroes.length){for(const hero of heroes.slice(0,100))body.append(heroCard(hero));body.append(label('p','Returned arena heroes, not all heroes owned.','kvk-note'))}
   else body.append(label('p','No hero data returned.'));
   const age=profile.details?.source?.age_seconds;body.append(valueNode('Source age at lookup: {value}',validNumber(age)?KSPreferences.message('{count} minutes',{count:Math.floor(age/60)}):null));
  }
  card.append(body);cards.append(card);
 }
 function clear(){generation++;active?.abort();active=null;opponent=null;root.hidden=true;list.replaceChildren();cards.replaceChildren();button.disabled=true;tr(button,'Scout opponent’s top 10');tr(status,'');$('kvk-hero').hidden=true}
 function comparison(a,b){
  clear();const kid=Number(b?.kid);if(!record(a)||!record(b)||Number(a.kid)!==169||!Number.isSafeInteger(kid)||kid<1||kid>999999||kid===169)return;
  opponent=kid;$('kvk-hero').hidden=false;button.disabled=false;tr($('kvk-matchup'),'State 169 vs State {state}',{state:kid});
  for(const [side,kingdom]of [['left',a],['right',b]]){tr($(`kvk-${side}-state`),'State {state}',{state:kingdom.kid});raw($(`kvk-${side}-power`),validNumber(kingdom.power)?compact(kingdom.power):'—');raw($(`kvk-${side}-players`),validNumber(kingdom.player_count)?plain(kingdom.player_count):'—');raw($(`kvk-${side}-active`),validNumber(kingdom.active_7d)?plain(kingdom.active_7d):'—')}
 }
 async function post(name,body,signal,timeoutMs){
  const controller=new AbortController(),abort=()=>controller.abort();signal.addEventListener('abort',abort,{once:true});if(signal.aborted)abort();const timer=setTimeout(abort,timeoutMs);
  try{
   const response=await fetch(API.replace('kingdom-compare',name),{method:'POST',headers:{'Content-Type':'application/json',apikey:KEY},body:JSON.stringify(body),signal:controller.signal,redirect:'error'});
   if(response.status===429)throw Error('rate_limited');
   let data;try{data=await response.json()}catch{throw Error('unavailable')}
   if(!response.ok||data?.ok!==true){const error=Error(response.status===429||/rate limit/i.test(String(data?.error??''))?'rate_limited':'unavailable');error.status=response.status;throw error}return data;
  }finally{clearTimeout(timer);signal.removeEventListener('abort',abort)}
 }
 async function start(){
  const approval=window.CompareAccess?.ticket();if(!approval||active||!opponent||$('results').classList.contains('hidden'))return;
  const kid=opponent,own=++generation,controller=new AbortController();active=controller;
  const abort=()=>controller.abort();approval.signal.addEventListener('abort',abort,{once:true});
  const current=()=>own===generation&&!controller.signal.aborted&&CompareAccess.valid(approval)&&opponent===kid;
  let count=0,incomplete=false,rows=[],cached=false,stop=null;
  const deadline=setTimeout(()=>controller.abort(),12*60*1000);button.disabled=true;root.hidden=false;tr(button,'Scouting…');tr(status,'Loading opponent rankings…');tr($('kvk-summary-title'),'State {state} · returned top 10',{state:kid});list.replaceChildren();cards.replaceChildren();
  try{
   const saved=reports.get(kid);cached=!!saved&&Date.now()-saved.time<5*60*1000;
   if(!cached&&Date.now()<blockedUntil)throw Error('rate_limited');
   rows=cached?saved.rows:ranking(await post('kingdom-rankings',{opponent:kid},controller.signal,22000),kid);if(!current())return;
   for(const [i,row]of rows.entries())list.append(summaryRow(row,i));
   if(rows.length<10)incomplete=true;
   for(const [index,row]of rows.entries()){
    if(!current())return;let profile=null;
    const hit=profiles.get(row.governor_id);
    if(hit&&Date.now()-hit.time<5*60*1000)profile=hit.value;
    else if(!stop&&!cached){
     try{
      const response=await post('player-lookup',{player_id:row.governor_id,details:true},controller.signal,105000);
      if(!current())return;
      if(!record(response.player)||response.player.player_id!==row.governor_id)throw Error('identity_mismatch');
      profile={player:response.player,details:response.details?.version===1?record(response.details):null};
      if(profiles.size>=100)profiles.delete(profiles.keys().next().value);profiles.set(row.governor_id,{time:Date.now(),value:profile});
     }catch(error){if(!current())return;if(error.message==='rate_limited'){blockedUntil=Date.now()+10*60*1000;stop='rate_limited'}else if(error.name==='AbortError')stop='timeout'}
    }
    if(profile)count++;
    if(!profile||profile.details?.version!==1||!location(profile)||trial(profile)===null||!Array.isArray(profile.details?.heroes)||profile.details.heroes.some(hero=>!record(hero)||!Array.isArray(hero.gear)))incomplete=true;
    renderPlayer(row,index,profile);tr(status,'Scouting {done}/{total} profiles…',{done:index+1,total:rows.length});
   }
   if(!current())return;
   if(!cached){if(reports.size>=20)reports.delete(reports.keys().next().value);reports.set(kid,{rows,time:Date.now()});}
   tr(status,stop==='rate_limited'?'Rate limited; remaining lookups stopped.':stop==='timeout'?'Lookup timed out; remaining lookups stopped.':incomplete?'Scouting incomplete · {count}/{total} profiles.':'Scouting complete · {count}/{total} profiles.',{count,total:rows.length});
   if(cached)status.append(label('span',' · Browser cache ≤5m'));
  }catch(error){if(current()){if(error.message==='rate_limited'){blockedUntil=Date.now()+10*60*1000;tr(status,'Rate limited; remaining lookups stopped.')}else tr(status,'Opponent scouting unavailable.')}}
  finally{clearTimeout(deadline);approval.signal.removeEventListener('abort',abort);if(own===generation){active=null;button.disabled=false;tr(button,'Scout opponent’s top 10');if(controller.signal.aborted&&CompareAccess.valid(approval)){for(let i=cards.children.length;i<rows.length;i++)renderPlayer(rows[i],i,null);tr(status,'Scouting stopped; available results retained.')}}}
 }
 window.KvkScouting={clear,comparison,start,ranking,gearTiles};button.addEventListener('click',start);
})();

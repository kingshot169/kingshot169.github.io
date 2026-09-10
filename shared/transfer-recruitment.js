/* Shared safe renderer for public published content and private admin previews. */
(()=>{
  const fields=[
    ['headline','Recruitment headline','text',160],['strapline','Introduction','text',300],
    ['recruitment_message','Recruitment message','textarea',10000],['state_note','Current state / rebuild note','textarea',2000],
    ['rules','Rules and expectations','textarea',2000],['contact_message','Talk to State 169','textarea',2000],
    ['event_name','Event name','text',160],['source_url','Source announcement URL','url',500],
    ['starts_at','Event starts (UTC)','datetime-local'],['ends_at','Event ends (UTC)','datetime-local'],
    ['pre_transfer_starts_at','Pre-transfer starts (UTC)','datetime-local'],['invitational_starts_at','Invitational phase starts (UTC)','datetime-local'],
    ['open_transfer_starts_at','Open-transfer phase starts (UTC)','datetime-local'],['details_confirmed_at','Last confirmed (UTC)','datetime-local'],
    ['group_number','Transfer group','number'],['kingdom_from','First eligible kingdom','number'],['kingdom_to','Last eligible kingdom','number'],
    ['entry_power_cap','Entry Power Cap (in-game)','number'],['cap_note','Cap explanation / special invitation exceptions','textarea',1000],
    ['ordinary_capacity','Confirmed ordinary transfer capacity','number'],['ordinary_places_remaining','Ordinary places remaining','number'],
    ['special_invites_remaining','Special invitations remaining','number'],['alliance_places_remaining','Alliance places remaining','number'],
    ['event_notice','Public event notice','textarea',1000],['pass_guidance','Transfer Pass / ticket guidance','textarea',4000],
    ['preparedness_note','Local preparedness recommendation (optional)','textarea',500],['discord_url','State Discord invite (optional)','url',500],
  ];
  const contactFields=[['name','Contact name',100],['player_id','Player ID',20],['alliance','Alliance tag',20],['role','Role / description',200],['languages','Languages',100],['availability','Usual availability (include timezone)',200]];
  const node=(tag,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;return e};
  const label=(tag,key,params={})=>{const e=node(tag);KSPreferences.setText(e,key,params);return e};
  function raw(tag,value,lang){const e=node(tag,'tr-custom');e.setAttribute('translate','no');e.lang=lang||'en';e.dir=lang==='ar'?'rtl':'auto';e.textContent=String(value??'');return e}
  function link(value,discord=false){try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.port||u.hash||/\s|\\/.test(value)||/\/(?:\.|%2e){1,2}(?:\/|$)/i.test(value))return null;
    if(discord&&(u.search||!((u.hostname==='discord.gg'&&/^\/[A-Za-z0-9-]{2,100}\/?$/.test(u.pathname))||(u.hostname==='discord.com'&&/^\/invite\/[A-Za-z0-9-]{2,100}\/?$/.test(u.pathname)))))return null;return u.href}catch{return null}}
  function external(value,key,discord=false){const href=link(value,discord);if(!href)return null;const a=label('a',key);a.href=href;a.target='_blank';a.rel='noopener noreferrer';return a}
  function empty(){const c={source_language:'en',classification:'awaiting_confirmation',contacts:[]};for(const [key,,type]of fields)c[key]=['number','datetime-local'].includes(type)?null:'';c.source_url=null;c.discord_url=null;return c}
  function render(host,data,{preview=false}={}){
    host.replaceChildren();host.classList.add('tr-recruitment');
    if(!data){const notice=label('p','Recruitment information is currently unavailable. You can still apply.');if(!preview)notice.id='transfer-contacts';host.append(notice);return}
    const lang=data.source_language||'en';
    host.append(label('p','Administrator-written content ({language}); shown in its original language.',{language:lang}));
    const message=node('section','tr-section');message.append(raw('h2',data.headline,lang));
    for(const key of ['strapline','recruitment_message','state_note','rules'])if(data[key])message.append(raw('p',data[key],lang));
    host.append(message);
    const event=node('section','tr-section');event.append(label('h2','Event information'));
    if(data.event_name)event.append(raw('h3',data.event_name,lang));
    event.append(label('p','Administrator-reported information. Confirm requirements in-game before planning a move.'));
    const dl=node('dl','tr-facts');
    const classifications={awaiting_confirmation:'Awaiting confirmation',ordinary:'Ordinary kingdom',leading:'Leading kingdom'};
    dl.append(label('dt','Kingdom classification'),label('dd',classifications[data.classification]||'Awaiting confirmation'));
    for(const [key,title,type]of fields.filter(x=>['number','datetime-local'].includes(x[2]))){
      dl.append(label('dt',title));const dd=node('dd');
      if(data[key]===null||data[key]===undefined)KSPreferences.setText(dd,'Awaiting confirmation');
      else{dd.setAttribute('translate','no');dd.dir='ltr';dd.textContent=type==='number'?String(data[key]):String(data[key]).replace('T',' ').replace('Z',' UTC')}
      dl.append(dd);
    }event.append(dl);
    for(const [key,title]of [['cap_note','Cap explanation / special invitation exceptions'],['event_notice','Public event notice'],['pass_guidance','Transfer Pass / ticket guidance'],['preparedness_note','Local preparedness recommendation (optional)']])if(data[key])event.append(label('h3',title),raw('p',data[key],lang));
    event.append(label('p','Pass costs vary with your in-game Transfer Score. Account power alone does not determine eligibility.'));
    const source=external(data.source_url,'Source announcement');if(source)event.append(source);host.append(event);
    const contacts=node('section','tr-section');if(!preview)contacts.id='transfer-contacts';contacts.append(label('h2','Talk to State 169'));
    if(data.contact_message)contacts.append(raw('p',data.contact_message,lang));
    contacts.append(label('p','Contacting the team is encouraged, but is not required to submit an application.'));
    const discord=external(data.discord_url,'Join State Discord',true);if(discord)contacts.append(discord);
    const grid=node('div','tr-contact-grid');
    for(const contact of (data.contacts||[]).filter(c=>c.visible!==false)){
      const card=node('article','tr-contact');card.append(raw('h3',contact.name,lang));
      card.append(label('p',contact.is_transfer_manager?'Current in-game Transfer Manager':'State contact (not necessarily an invitation issuer)'));
      for(const key of ['alliance','role','languages','availability'])if(contact[key])card.append(raw('p',contact[key],lang));
      const id=raw('p',contact.player_id,'en');id.classList.add('tr-player-id');id.dir='ltr';card.append(label('span','Player ID'),id);
      const copy=label('button','Copy Player ID');copy.type='button';const feedback=node('p','tr-feedback');feedback.setAttribute('role','status');
      copy.addEventListener('click',async()=>{copy.disabled=true;try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(String(contact.player_id));KSPreferences.setText(feedback,'Player ID copied.')}catch{KSPreferences.setText(feedback,'Copy failed. Select and copy the Player ID above.');const range=document.createRange();range.selectNodeContents(id);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range)}finally{copy.disabled=false}});
      card.append(copy,feedback);grid.append(card);
    }
    contacts.append(grid,label('p','An enquiry or application is not an in-game invitation or a reserved alliance place.'));host.append(contacts);
  }
  window.KSRecruitment={fields,contactFields,node,label,raw,empty,render,link};
})();

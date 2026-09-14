/* Public Transfer presentation only. Admin previews retain KSRecruitment.render. */
(()=>{
  const {node,label,raw,link}=KSRecruitment;
  const phaseFields=['pre_transfer_starts_at','invitational_starts_at','open_transfer_starts_at'];
  const phaseNames=['Pre-transfer','Invitational','Open Transfer'];
  let timer;
  function refreshDates(){
    document.querySelectorAll("time[data-compact-date]").forEach(el=>{
      const language=KSPreferences.getLanguage(),date=new Date(el.dateTime);
      const day=new Intl.DateTimeFormat(language,{day:"numeric",month:"short",timeZone:"UTC"}).format(date);
      const clock=new Intl.DateTimeFormat(language,{hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:"UTC"}).format(date);
      const full=new Intl.DateTimeFormat(language,{dateStyle:"full",timeStyle:"long",timeZone:"UTC"}).format(date);
      KSPreferences.setRawText(el,day+" · "+clock);el.lang=language;el.title=full;el.setAttribute("aria-label",full);
    });
  }
  window.addEventListener("ks-language-rendered",refreshDates);
  function timestamp(value){
    if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value))return null;
    const [year,month,day]=value.slice(0,10).split('-').map(Number);
    if(month<1||month>12||day<1||day>new Date(Date.UTC(year,month,0)).getUTCDate())return null;
    const result=Date.parse(value);return Number.isFinite(result)?result:null;
  }
  // Intervals are [start, end). Never infer an absent phase boundary.
  function timeline(data,now=Date.now()){
    if(timestamp(data.details_confirmed_at)===null||timestamp(data.details_confirmed_at)>now)return {state:"unconfirmed",current:-1,phases:phaseFields.map(()=>"unconfirmed")};
    const start=timestamp(data.starts_at),end=timestamp(data.ends_at);
    const phases=phaseFields.map(key=>timestamp(data[key]));
    const supplied=[data.starts_at,...phaseFields.map(key=>data[key]),data.ends_at];
    const parsed=[start,...phases,end];
    let invalid=supplied.some((value,i)=>value!=null&&value!==''&&parsed[i]===null);
    const known=phases.filter(value=>value!==null);
    invalid ||= known.some((value,i)=>i>0&&value<=known[i-1]);
    invalid ||= start!==null&&end!==null&&start>=end;
    invalid ||= known.some(value=>(start!==null&&value<start)||(end!==null&&value>=end));
    if(invalid)return {state:'unconfirmed',current:-1,phases:phases.map(()=> 'unconfirmed')};
    const states=phases.map((value,i)=>{
      const next=i===2?end:phases[i+1];
      if(value===null)return 'unconfirmed';
      if(now<value)return 'upcoming';
      if(next===null)return 'unconfirmed';
      return now<next?'active':'ended';
    });
    const current=states.indexOf('active');
    const state=end!==null&&now>=end?'ended':start!==null&&now<start?'upcoming':current!==-1?'active':start!==null&&end!==null&&now>=start&&now<end?'phase-unconfirmed':'unconfirmed';
    return {state,current,phases:states};
  }
  function icon(name){
    const paths={shield:'M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6z M9 12l2 2 4-4',range:'M4 8h16M4 16h16M7 5 4 8l3 3m10 2 3 3-3 3',power:'m13 2-8 12h6l-1 8 9-12h-6z',people:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M17 4a4 4 0 0 1 0 8m5 9v-2a4 4 0 0 0-3-4M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',calendar:'M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2zm2-2v4m10-4v4M3 10h18',notice:'m12 3 10 18H2zM12 9v5m0 3v1'};
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.5');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('aria-hidden','true');svg.classList.add('ti-icon');
    const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[name]||paths.shield);svg.append(path);return svg;
  }
  function time(value){
    if(timestamp(value)===null)return label('span','Awaiting confirmation');
    const el=node('time');el.dateTime=value;el.dataset.compactDate='';el.setAttribute('translate','no');el.dir='auto';return el;
  }
  function disclosure(title,content){const el=node('details','ti-details');el.append(label('summary',title),content);return el}
  function paragraphs(value,lang){const wrap=node('div','ti-prose');for(const p of String(value||'').split(/\n\s*\n/))if(p.trim())wrap.append(raw('p',p,lang));return wrap}
  function fact(title,value,symbol){
    const wrap=node('div','ti-fact'),dt=node('dt'),dd=node('dd');dt.append(icon(symbol),label('span',title));
    if(value===null||value===undefined||value==='')dd.append(label('span','Awaiting confirmation'));
    else if(value instanceof Node)dd.append(value);
    else{dd.textContent=String(value);dd.setAttribute('translate','no');dd.dir='ltr'}
    wrap.append(dt,dd);return wrap;
  }
  function eventOverview(data,lang){
    const event=node('section','ti-event');event.id='transfer-event';event.setAttribute('aria-labelledby','transfer-event-title');
    const heading=node('div','ti-section-heading'),title=node('div');const eyebrow=label('p','Event information');eyebrow.className='ti-eyebrow';
    const name=data.event_name?raw('h2',data.event_name,lang):label('h2','Event information');name.id='transfer-event-title';
    title.append(eyebrow,name);const badge=node('span','ti-status');badge.setAttribute('role','status');heading.append(title,badge);event.append(heading);
    const schedule=node('div','ti-schedule-note');schedule.append(icon('calendar'),label('span','Published schedule · all times UTC'));event.append(schedule);
    const list=node('ol','ti-timeline'),steps=[];
    phaseFields.forEach((key,i)=>{
      const li=node('li'),number=node('span','ti-step-number');number.textContent=String(i+1).padStart(2,'0');number.setAttribute('aria-hidden','true');
      const info=node('div','ti-step-info'),name=label('h3',phaseNames[i]),status=node('span','ti-phase-status');
      info.append(name,time(data[key]),status);li.append(number,info);list.append(li);steps.push({li,status});
    });event.append(list);
    const closing=node('div','ti-event-end');closing.append(label('span','Event ends (UTC)'),time(data.ends_at));event.append(closing);
    if(data.event_notice){const notice=node('aside','ti-notice');notice.append(icon('notice'));const content=node('div');content.append(label('strong','Public event notice'),raw('p',data.event_notice,lang));notice.append(content);event.append(notice)}
    const facts=node('dl','ti-fact-grid');
    const classifications={ordinary:'Ordinary kingdom',leading:'Leading kingdom'};
    facts.append(fact('Kingdom classification',label('span',classifications[data.classification]||'Awaiting confirmation'),'shield'));
    const range=node('span');
    if(data.kingdom_from!=null&&data.kingdom_to!=null){range.textContent=String(data.kingdom_from)+' – '+String(data.kingdom_to);range.setAttribute('translate','no');range.dir='ltr'}
    else range.append(label('span','Awaiting confirmation'));
    const rangeFact=fact('Transfer range',range,'range');
    if(data.group_number!=null){const group=label('small','Group {number}',{number:data.group_number});rangeFact.append(group)}
    facts.append(rangeFact,fact('Entry Power Cap (in-game)',data.entry_power_cap,'power'));
    const places=fact('Ordinary places remaining',data.ordinary_places_remaining,'people');
    if(data.ordinary_capacity!=null)places.append(label('small','Confirmed capacity: {count}',{count:data.ordinary_capacity}));facts.append(places);
    for(const [key,title]of [['special_invites_remaining','Special invitations remaining'],['alliance_places_remaining','Alliance places remaining']])if(data[key]!=null)facts.append(fact(title,data[key],'people'));
    event.append(facts);
    const guidance=node('div','ti-event-disclosures');
    const passes=node('div','ti-prose');
    passes.append(label('p','Pass costs vary with your in-game Transfer Score. Account power alone does not determine eligibility.'));
    if(data.pass_guidance)passes.append(raw('p',data.pass_guidance,lang));
    if(data.preparedness_note)passes.append(label('h3','Local preparedness recommendation (optional)'),raw('p',data.preparedness_note,lang));
    guidance.append(disclosure('Transfer Pass / ticket guidance',passes));
    const details=node('div','ti-prose');details.append(label('p','Administrator-reported information. Confirm requirements in-game before planning a move.'));
    const extra=node('dl','ti-supporting-facts');for(const [key,title]of [['starts_at','Event starts (UTC)'],['kingdom_from','First eligible kingdom'],['kingdom_to','Last eligible kingdom']]){extra.append(label('dt',title));const dd=node('dd');dd.append(key==='starts_at'?time(data[key]):data[key]!=null?raw('span',data[key],'en'):label('span','Awaiting confirmation'));extra.append(dd)}details.append(extra);
    if(data.cap_note)details.append(label('h3','Cap explanation / special invitation exceptions'),raw('p',data.cap_note,lang));
    guidance.append(disclosure('Requirements & exceptions',details));event.append(guidance);
    const footer=node('div','ti-source');const href=link(data.source_url);
    if(href){const a=label('a','Source announcement');a.href=href;a.target='_blank';a.rel='noopener noreferrer';footer.append(a)}
    const confirmed=node('span');confirmed.append(label('span','Last confirmed (UTC)'),document.createTextNode(' · '),time(data.details_confirmed_at));footer.append(confirmed);event.append(footer);
    const update=()=>{
      const result=timeline(data);
      const names={upcoming:'Upcoming',ended:'Event ended',unconfirmed:'Schedule unconfirmed','phase-unconfirmed':'Event active · phase unconfirmed',active:phaseNames[result.current]};
      badge.dataset.state=result.state;KSPreferences.setText(badge,names[result.state]);
      steps.forEach(({li,status},i)=>{const state=result.phases[i];li.dataset.state=state;if(state==='active')li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');KSPreferences.setText(status,({active:'Current phase',upcoming:'Upcoming',ended:'Ended',unconfirmed:'Awaiting confirmation'})[state])});
    };update();timer=setInterval(update,1000);return event;
  }
  function setHero(data){
    const title=document.getElementById('transfer-headline'),intro=document.getElementById('transfer-introduction');
    for(const [el,value,fallback]of [[title,data?.headline,'Transfer to State 169'],[intro,data?.strapline,'Verify your Kingshot profile, then complete the short application.']]){
      if(value){KSPreferences.setRawText(el,value);el.setAttribute('translate','no');el.lang=data.source_language||'en';el.dir=el.lang==='ar'?'rtl':'auto'}
      else{el.removeAttribute('translate');el.removeAttribute('lang');el.dir='auto';KSPreferences.setText(el,fallback)}
    }
  }
  function benefits(data){
    const group=node('div','ti-benefits');
    const lang=data?.source_language||'en',copy=String(data?.recruitment_message||'');
    const quotes=['Some play to build, collect heroes or spend time with friends.','Contribute where you can; a good teammate brings more than a power number.'];
    const themes=[['Play your way','In their own words','shield'],['Find your people','Meet the team','people']];
    themes.forEach(([title,fallback,symbol],i)=>{
      const card=node('article','ti-benefit');card.append(icon(symbol));
      const supported=copy.includes(quotes[i]);card.append(label('h2',supported?title:fallback));
      card.append(supported?raw('p',quotes[i],lang):label('p',i===0?(copy?'Read the published recruitment message.':'Recruitment information is currently unavailable. You can still apply.'):(data?.contacts?.some(c=>c.visible!==false)?'Get to know the published state contacts before your move.':'Published contacts are unavailable.')));
      group.append(card);
    });
    const tools=node('article','ti-benefit');tools.append(icon('calendar'),label('h2','Tools for your next chapter'),label('p',"Explore rally timing and King's Buffs booking tools."));
    const links=node('div','ti-tool-links');for(const [title,href]of [['Rally Sync','../rally/'],["King's Buffs",'../kings-buffs/']]){const a=label('a',title);a.href=href;links.append(a)}tools.append(links);group.append(tools);return group;
  }
  function render(host,data){
    const navigation=document.querySelector('.ti-page-nav');if(navigation)host.before(navigation);
    clearInterval(timer);KSRecruitment.render(host,data);host.classList.add('ti-recruitment');setHero(data);
    document.querySelector('.ti-page-nav a[href="#transfer-event"]').hidden=!data;
    document.querySelector('.ti-page-nav a[href="#transfer-community"]').hidden=!data;
    const cards=benefits(data);host.prepend(cards);cards.after(document.querySelector('.ti-page-nav'));
    if(!data){const notice=host.querySelector(':scope>p');notice.classList.add('ti-unavailable');notice.setAttribute('role','status');return}
    const lang=data.source_language||'en';const [message,event,contacts]=host.querySelectorAll(':scope > .tr-section');
    host.querySelector(':scope>p')?.remove(); // Public UI omits internal source-language metadata.
    message.replaceChildren();message.classList.add('ti-community');message.id='transfer-community';
    if(data.recruitment_message)message.append(disclosure('Read the full recruitment message',paragraphs(data.recruitment_message,lang)));
    else message.append(label('p','Recruitment information is currently unavailable. You can still apply.'));
    const notes=node('div','ti-community-notes');for(const [key,title]of [['state_note','Current state / rebuild note'],['rules','Rules and expectations']])if(data[key]){const section=node('section');section.append(label('h3',title),paragraphs(data[key],lang));notes.append(section)}if(notes.childElementCount)message.append(notes);
    const overview=eventOverview(data,lang);event.remove();
    contacts.classList.add('ti-contacts');KSPreferences.setText(contacts.querySelector('h2'),'Meet the people of 169');
    const contactIntro=contacts.querySelector(':scope > .tr-custom');
    if(contactIntro)contactIntro.replaceWith(disclosure('Before you contact the team',paragraphs(data.contact_message,lang)));
    for(const key of ['Contacting the team is encouraged, but is not required to submit an application.','An enquiry or application is not an in-game invitation or a reserved alliance place.'])contacts.querySelector(':scope > [data-ks-text="'+key+'"]')?.remove();
    contacts.querySelectorAll('.tr-contact').forEach((card,index)=>{
      const contact=(data.contacts||[]).filter(c=>c.visible!==false)[index];
      const name=card.querySelector('h3'),monogram=node('span','ti-monogram');
      monogram.textContent=Array.from(name.textContent.trim())[0]||'169';monogram.setAttribute('aria-hidden','true');name.before(monogram);
      card.querySelector('p:not(.tr-custom)').classList.add('ti-contact-type');card.dataset.manager=String(contact?.is_transfer_manager===true);
      const alliance=contact?.alliance?Array.from(card.querySelectorAll('.tr-custom')).find(el=>el.tagName==='P'&&el.textContent===contact.alliance):null;if(alliance)alliance.classList.add('ti-alliance');
      const actions=node('div','ti-contact-actions');actions.append(card.querySelector('.tr-player-id'),card.querySelector('button'));card.append(actions,card.querySelector('.tr-feedback'));
    });
    // Put the people first; all administrator-written guidance remains available.
    const contactDetails=contacts.querySelector(':scope>.ti-details');if(contactDetails)contacts.append(contactDetails);
    host.append(contacts,overview);refreshDates();
  }
  window.KSTransferOverview={render,timeline,timestamp};
})();

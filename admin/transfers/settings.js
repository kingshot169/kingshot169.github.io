(()=>{
  const R=KSRecruitment,host=document.getElementById('recruitment-manager');
  const endpoint=SUPABASE_URL+'/functions/v1/admin-transfer-settings';
  let revision=null,saved=null,dirty=false,busy=false,loaded=false,contacts=[],published=false;
  const inputs=new Map();
  const errors={stale_revision:'Another admin changed these settings. Your edits are preserved; reload before saving again.',
    access_denied:'Transfer admin access denied',not_authenticated:'Not authenticated',password_change_required:'Password change required before using admin tools',
    invalid_url:'Use a valid HTTPS announcement URL or a discord.gg/code or discord.com/invite/code invite.',
    invalid_dates:'Check the UTC dates and phase order.',invalid_timezone:'Include a timezone in contact availability.',
    invalid_settings:'Check all settings, text lengths and contact Player IDs.',body_too_large:'The settings are too large. Shorten the text.',
    rate_limited:'Too many settings changes. Wait a minute and try again.',no_draft:'Save a draft before publishing.'};
  const status=R.node('p','tr-manager-status');status.setAttribute('role','status');
  const publication=R.node('p');const form=R.node('form','tr-settings-form');
  const fields=R.node('fieldset','tr-settings-fields');fields.disabled=true;
  const grid=R.node('div','tr-settings-grid');
  function control(key,title,type='text',max){
    const wrap=R.node('label');wrap.append(R.label('span',title));
    const input=R.node(type==='textarea'?'textarea':'input');if(type!=='textarea')input.type=type;
    input.id='tr-'+key;input.name=key;
    if(max)input.maxLength=max;
    if(type==='number'){input.min='0';input.max=key==='entry_power_cap'?String(Number.MAX_SAFE_INTEGER):'100000';input.step='1'}
    if(type==='datetime-local')input.step='1';
    if(type==='textarea'){input.rows=key==='recruitment_message'?14:4;wrap.className='tr-wide'}
    wrap.append(input);inputs.set(key,input);grid.append(wrap);
    return input;
  }
  function select(key,title,options){const wrap=R.node('label');wrap.append(R.label('span',title));const input=R.node('select');input.id='tr-'+key;input.name=key;for(const [value,title]of options){const o=key==='source_language'?R.raw('option',title,value):R.label('option',title);o.value=value;input.append(o)}wrap.append(input);grid.append(wrap);inputs.set(key,input)}
  select('source_language','Content language',[['en','English'],['ko','한국어'],['es','Español'],['pt','Português'],['fr','Français'],['ar','العربية']]);
  select('classification','Kingdom classification',[['awaiting_confirmation','Awaiting confirmation'],['ordinary','Ordinary kingdom'],['leading','Leading kingdom']]);
  for(const [key,title,type,max]of R.fields)control(key,title,type,max);
  const count=R.node('p');count.setAttribute('aria-live','polite');inputs.get('recruitment_message').after(count);
  const contactList=R.node('div','tr-editor-contacts');
  const add=R.label('button','Add contact');add.type='button';
  const save=R.label('button','Save Draft');save.type='submit';
  const preview=R.label('button','Preview saved draft');preview.type='button';
  const unpublish=R.label('button','Unpublish');unpublish.type='button';
  const suggested=R.label('button','Load suggested wording');suggested.type='button';
  const reload=R.label('button','Reload saved draft');reload.type='button';
  const actions=R.node('div','tr-settings-actions');actions.append(save,preview,unpublish,suggested,reload);
  fields.append(grid,R.label('h3','State contacts'),R.label('p','Only publish contacts who consent. Mark the in-game Transfer Manager explicitly.'),contactList,add,actions);
  form.append(fields);host.append(R.label('h2','Event & Recruitment'),
    R.label('p','These are website recruitment details, not game transfer settings. Approvals do not reserve or decrement places.'),
    R.label('p','Leave unknown numbers empty. Zero means none. All event times are UTC.'),publication,status,form);
  const retry=R.label('button','Try Again');retry.type='button';retry.hidden=true;host.append(retry);
  const dialog=R.node('dialog','tr-preview-dialog');dialog.setAttribute('aria-labelledby','tr-preview-title');
  const heading=R.label('h2','Review saved draft');heading.id='tr-preview-title';
  const previewBody=R.node('div');const confirm=R.label('button','Publish this revision');confirm.type='button';
  const close=R.label('button','Close');close.type='button';
  dialog.append(heading,R.label('p','Publishing replaces the public recruitment information with this exact saved revision.'),previewBody,confirm,close);host.append(dialog);
  let reviewedRevision=null;
  function message(key){KSPreferences.setText(status,key)}
  function update(){
    fields.disabled=busy||!loaded;preview.disabled=busy||dirty||!saved;unpublish.disabled=busy||!published;
    add.disabled=busy||contacts.length>=8;save.disabled=busy||!dirty;confirm.disabled=busy;close.disabled=busy;
    KSPreferences.setText(count,'{count} / 10000 characters',{count:inputs.get('recruitment_message').value.length});
    KSPreferences.setText(publication,published?'Published content is live. Saving a draft does not change it.':'No recruitment content is published. Applications remain available.');
  }
  function changed(){dirty=true;update()}
  form.addEventListener('input',changed);form.addEventListener('change',changed);
  function contactEditors(){
    contactList.replaceChildren();
    contacts.forEach((c,index)=>{
      const box=R.node('fieldset','tr-contact-editor');box.append(R.label('legend','Contact {number}',{number:index+1}));
      for(const [key,title,max]of R.contactFields){const wrap=R.node('label');wrap.append(R.label('span',title));const input=R.node('input');input.value=c[key]||'';input.maxLength=max;
        if(key==='name'||key==='player_id')input.required=true;
        if(key==='player_id'){input.inputMode='numeric';input.pattern='[0-9]{1,20}'}
        input.addEventListener('input',()=>{c[key]=input.value});wrap.append(input);box.append(wrap)}
      for(const [key,title]of [['visible','Public contact'],['is_transfer_manager','Current in-game Transfer Manager']]){const wrap=R.node('label','tr-check');const input=R.node('input');input.type='checkbox';input.checked=c[key]===true;input.addEventListener('change',()=>{c[key]=input.checked});wrap.append(input,R.label('span',title));box.append(wrap)}
      for(const [title,delta]of [['Move up',-1],['Move down',1],['Remove contact',0]]){const button=R.label('button',title);button.type='button';button.disabled=delta!==0&&(index+delta<0||index+delta>=contacts.length);button.addEventListener('click',()=>{
        if(delta===0){if(!window.confirm(KSPreferences.text('Remove this contact from the draft?')))return;contacts.splice(index,1)}else [contacts[index],contacts[index+delta]]=[contacts[index+delta],contacts[index]];
        contactEditors();changed();add.focus();
      });box.append(button)}contactList.append(box);
    });
  }
  function fill(data){const content=data||R.empty();for(const [key,input]of inputs){const value=content[key];input.value=value==null?'':input.type==='datetime-local'?value.replace(/Z$/,''):String(value)}contacts=structuredClone(content.contacts||[]);contactEditors();dirty=false;update()}
  function read(){const value={};for(const [key,input]of inputs)value[key]=input.type==='number'?(input.value===''?null:Number(input.value)):input.type==='datetime-local'?(input.value?input.value+(input.value.length===16?':00Z':'Z'):null):input.value;
    value.source_url=value.source_url||null;value.discord_url=value.discord_url||null;value.contacts=structuredClone(contacts);return value}
  async function request(action,content,expected=revision,suggestion=false){
    const s=await session();if(!s)throw Error('not_authenticated');
    const response=await fetch(endpoint+(suggestion?'?suggested=1':''),{method:action?'POST':'GET',headers:{'Content-Type':'application/json',apikey:SUPABASE_PUBLISHABLE_KEY,Authorization:'Bearer '+s.access_token},
      body:action?JSON.stringify({action,revision:expected,...(action==='save'?{content}:{})}):undefined,signal:AbortSignal.timeout(15000)});
    let body={};try{body=await response.json()}catch{}
    if(!response.ok||!body.ok)throw Error(body.code||'settings_unavailable');return body;
  }
  function accept(body){revision=body.revision;saved=body.draft;published=body.is_published;loaded=true}
  function failure(error){message(errors[error.message]||'Recruitment settings could not be loaded or saved. Your edits are preserved.')}
  async function load(){
    if(busy)return;
    if(dirty&&!window.confirm(KSPreferences.text('Discard unsaved recruitment edits?')))return;
    busy=true;retry.hidden=true;update();message('Loading…');
    try{accept(await request());fill(saved);message('Draft loaded.')}catch(error){failure(error);retry.hidden=false}finally{busy=false;update()}
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(busy||!loaded||!form.reportValidity())return;busy=true;update();
    try{accept(await request('save',read()));dirty=false;message('Draft saved. Public content is unchanged.')}catch(error){failure(error)}finally{busy=false;update()}
  });
  preview.addEventListener('click',()=>{if(dirty||!saved||busy)return;reviewedRevision=revision;R.render(previewBody,saved,{preview:true});dialog.showModal();close.focus()});
  confirm.addEventListener('click',async()=>{if(busy||reviewedRevision!==revision)return;busy=true;update();try{accept(await request('publish',null,reviewedRevision));dialog.close();message('Recruitment information published.')}catch(error){dialog.close();failure(error)}finally{busy=false;update()}});
  close.addEventListener('click',()=>dialog.close());dialog.addEventListener('cancel',event=>{if(busy)event.preventDefault()});
  unpublish.addEventListener('click',async()=>{if(busy||!window.confirm(KSPreferences.text('Remove the public recruitment information? Applications and in-game transfers are unchanged.')))return;
    busy=true;update();try{accept(await request('unpublish'));message('Recruitment information unpublished.')}catch(error){failure(error)}finally{busy=false;update()}});
  add.addEventListener('click',()=>{if(contacts.length>=8)return;contacts.push(Object.fromEntries([...R.contactFields.map(([key])=>[key,'']),['visible',false],['is_transfer_manager',false]]));contactEditors();changed();contactList.lastElementChild.querySelector('input').focus()});
  suggested.addEventListener('click',async()=>{
    if(busy||!window.confirm(KSPreferences.text('Replace these draft inputs with suggested wording? Nothing will be saved or published.')))return;
    busy=true;update();try{const data=await request(null,null,revision,true);fill(data.suggested);dirty=true;message('Suggested values loaded. Review the event details in-game before saving.')}catch{message('Suggested wording could not be loaded.')}finally{busy=false;update()}
  });
  reload.addEventListener('click',load);retry.addEventListener('click',load);
  function view(settings){
    if(busy)return;
    // Both views stay mounted, preserving drafts, filters and application controls.
    document.getElementById('transfer-applications-view').hidden=settings;host.hidden=!settings;
    document.getElementById('applicationsViewButton').setAttribute('aria-pressed',String(!settings));document.getElementById('recruitmentViewButton').setAttribute('aria-pressed',String(settings));
    if(settings&&!loaded)load();
  }
  document.getElementById('applicationsViewButton').addEventListener('click',()=>view(false));document.getElementById('recruitmentViewButton').addEventListener('click',()=>view(true));
  window.addEventListener('beforeunload',event=>{if(dirty||busy){event.preventDefault();event.returnValue=''}});
  document.addEventListener('click',event=>{if((dirty||busy)&&event.target.closest('a[href],#signOut')&&!window.confirm(KSPreferences.text('Discard unsaved recruitment edits?'))){event.preventDefault();event.stopImmediatePropagation()}},true);
  fill(null);
})();

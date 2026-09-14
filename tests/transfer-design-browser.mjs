// Run with Deno: deno run -A tests/transfer-design-browser.mjs
// Every non-local browser request is intercepted; submissions never reach production.
import { chromium } from 'npm:playwright@1.55.1';
import { strict as assert } from 'node:assert';
import { fileURLToPath } from 'node:url';
const repo=fileURLToPath(new URL('../',import.meta.url)).replaceAll('\\','/').replace(/\/$/,'');
const artifacts=Deno.env.get('TRANSFER_TEST_ARTIFACTS')||await Deno.makeTempDir({prefix:'transfer-browser-'});
await Deno.mkdir(artifacts,{recursive:true});
console.log('Browser artifacts: '+artifacts);
const published=JSON.parse(await Deno.readTextFile(repo+'/tests/fixtures/transfer-published-settings.json'));
const snapshot=published.settings;
const results=[];const failures=[];
const server=Deno.serve({hostname:'127.0.0.1',port:8769,onListen(){}},async req=>{
 let path=decodeURIComponent(new URL(req.url).pathname);if(path.endsWith('/'))path+='index.html';
 if(path.includes('..'))return new Response('',{status:403});
 try{const data=await Deno.readFile(repo+path);return new Response(data,{headers:{'Content-Type':({html:'text/html',js:'text/javascript',css:'text/css',svg:'image/svg+xml',webp:'image/webp',json:'application/json'})[path.split('.').pop()]||'application/octet-stream'}})}catch{return new Response('',{status:404})}
});
const browser=await chromium.launch({executablePath:Deno.env.get('CHROME_PATH')||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
async function test(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS',name)}catch(error){failures.push(name);results.push({name,passed:false,error:String(error.stack)});console.log('FAIL',name,String(error.stack))}}
async function pageFor({data=snapshot,width=390,lang='en',theme='dark',status=200,image=true,admin=false,submitFailures=0}={}){
 const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
 await context.addInitScript(({lang,theme})=>{
  if(!localStorage.getItem('ks-language'))localStorage.setItem('ks-language',lang);
  if(!localStorage.getItem('ks-theme'))localStorage.setItem('ks-theme',theme);
  window.scrollChoices=[];const scroll=Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView=function(options){window.scrollChoices.push(options?.behavior);return scroll.call(this,options)};
 },{lang,theme});
 const calls=[],errors=[];const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.clock.setFixedTime(new Date('2026-09-14T12:00:00Z'));
 await context.route('**/*',async route=>{
  const url=route.request().url();
  if(url.startsWith('http://127.0.0.1:8769/')){if(!image&&/\.(svg|webp)$/.test(url))return route.abort();return route.continue()}
  calls.push({url,method:route.request().method(),body:route.request().postData()});
  if(url.startsWith('https://images.example.test/'))return url.includes('broken')?route.abort():route.fulfill({status:200,contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#d7bc83"/><circle cx="40" cy="30" r="15" fill="#243950"/><path d="M12 80v-12a28 28 0 0 1 56 0v12" fill="#243950"/></svg>'});
  if(url.includes('supabase-js'))return route.fulfill({contentType:'text/javascript',body:'window.supabase={createClient(){return {auth:{async getSession(){return {data:{session:{access_token:"mock-token",user:{id:"test-admin"}}}}},onAuthStateChange(){return {data:{subscription:{unsubscribe(){}}}}},async signOut(){return {}}}}}};'});
  if(url.endsWith('/transfer-settings'))return route.fulfill({status,json:status===200?{ok:true,settings:data}:{ok:false}});
  if(url.endsWith('/admin-transfer-settings'))return route.fulfill({json:{ok:true,revision:1,draft:data,is_published:true}});
  if(url.endsWith('/admin-transfers'))return route.fulfill({json:{ok:true,applications:[],admin:{display_name:'Fixture admin'}}});
  if(url.endsWith('/player-lookup')){
   const body=JSON.parse(route.request().postData());
   if(body.player_id==='404404')return route.fulfill({status:404,json:{error:'Fixture player not found'}});
   return route.fulfill({json:{ok:true,player:{player_id:body.player_id,name:'Fixture visitor <safe>',kingdom:body.player_id==='169169'?169:82,power:0,town_center_level:30,alliance_abbr:'TEST',alliance_name:'Fixture alliance',avatar_url:'https://images.example.test/'+(body.player_id==='77777777'?'broken.svg':'avatar.svg')}}});
  }
  if(url.endsWith('/submit-transfer')){if(submitFailures-->0)return route.fulfill({status:503,json:{error:'Fixture submission error'}});return route.fulfill({json:{ok:true,reference:'MOCK-169-REVIEW'}})}
  throw Error('Unexpected external request: '+url);
 });
 await page.goto('http://127.0.0.1:8769/'+(admin?'admin/transfers/':'transfer/'));
 if(!admin)await page.waitForFunction(()=>document.querySelector('.ti-recruitment'));
 return {page,context,calls,errors};
}
async function noOverflow(page){const dimensions=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(dimensions.scroll<=dimensions.width,JSON.stringify(dimensions))}
try{
 await test('Published desktop/mobile: real artwork, original copy, compact event, UTC, contact semantics and screenshots',async()=>{
  for(const width of [390,1440]){
   const {page,context,errors}=await pageFor({width});
   assert.equal(await page.locator('#transfer-headline').textContent(),snapshot.headline);
   assert.equal(await page.locator('#transfer-introduction').textContent(),snapshot.strapline);
   assert.equal(await page.locator('.ti-hero-art').evaluate(img=>img.complete&&[1600,840].includes(img.naturalWidth)),true);
   assert.equal(await page.locator('.ti-notice .tr-custom').textContent(),snapshot.event_notice);
   assert.equal(await page.locator('.ti-timeline [aria-current="step"]').count(),0);
   assert.equal(await page.locator('.ti-status').textContent(),'Schedule unconfirmed');
   assert.equal(await page.locator('.tr-contact[data-manager="true"]').count(),1);
   assert.equal(await page.locator('.tr-contact[data-manager="false"]').count(),1);
   assert.equal(await page.locator('.ti-community .ti-prose p').allTextContents().then(a=>a.join('\n\n').trim()),snapshot.recruitment_message.trim());
   const bounds=await page.locator('.ti-event').boundingBox();assert.ok(bounds.height<(width===390?1200:850));
   assert.ok((await page.locator('.ti-timeline time').allTextContents()).every(t=>t.includes(' · ')));assert.match(await page.locator('.ti-schedule-note').textContent(),/UTC/);assert.equal(await page.locator('.ti-timeline time').first().getAttribute('datetime'),snapshot.pre_transfer_starts_at);
   for(const href of await page.locator('a[href^="#"]:visible').evaluateAll(a=>a.map(n=>n.getAttribute('href'))))assert.equal(await page.locator(href).count(),1,href);
   await noOverflow(page);assert.deepEqual(errors,[]);
   await page.screenshot({path:artifacts+'/after-'+width+'.png',fullPage:true});
   await page.screenshot({path:artifacts+'/after-'+width+'-viewport.png'});
   results.push({layout:width,pageHeight:await page.evaluate(()=>document.documentElement.scrollHeight),eventHeight:bounds.height});
   await context.close();
  }
 });
 await test('All languages/themes at 320, 390 and 1440px; text, preferences and form values survive',async()=>{
  for(const width of [320,390,1440]){
   const {page,context,errors,calls}=await pageFor({width});
   await page.locator('#fid').fill('12345678');
   for(const lang of ['en','ko','es','pt','fr','ar'])for(const theme of ['dark','light']){
    await page.evaluate(({lang,theme})=>{KSPreferences.setLanguage(lang);document.documentElement.dataset.theme=theme},{lang,theme});
    await noOverflow(page);
    assert.equal(await page.locator('#fid').inputValue(),'12345678');
    assert.equal(await page.locator('#transfer-headline').textContent(),snapshot.headline);
    assert.deepEqual(await page.evaluate(()=>KSPreferences.getMissing()),[]);
    assert.equal(await page.locator('.ti-fact dt .ti-icon').count(),4);
   }
   assert.equal(calls.filter(c=>c.url.endsWith('/transfer-settings')).length,1);
   assert.deepEqual(errors,[]);
   if(width===390)await page.screenshot({path:artifacts+'/after-390-ar-light.png',fullPage:true});
   await context.close();
  }
  const {page,context}=await pageFor();
  await page.locator('.site-language-select').selectOption('fr');await page.locator('.site-theme-toggle').click();
  await page.reload();await page.waitForSelector('.ti-event');
  assert.equal(await page.locator('html').getAttribute('lang'),'fr');assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  await context.close();
 });
 await test('Boundary timestamps: upcoming, phase starts, phase ends, ended, missing and contradictory schedules',async()=>{
  const {page,context}=await pageFor();
  const cases=[
   ['2026-09-12T23:59:59Z','upcoming',-1],['2026-09-13T00:00:00Z','active',0],
   ['2026-09-15T23:59:59Z','active',0],['2026-09-16T00:00:00Z','active',1],
   ['2026-09-18T00:00:00Z','active',2],['2026-09-19T23:59:58Z','active',2],['2026-09-19T23:59:59Z','ended',-1],
  ];
  for(const [now,state,current]of cases){const r=await page.evaluate(({data,now})=>KSTransferOverview.timeline(data,Date.parse(now)),{data:{...snapshot,details_confirmed_at:'2026-09-12T00:00:00Z'},now});assert.equal(r.state,state);assert.equal(r.current,current)}
  for(const [patch,state,current]of [
   [{starts_at:null,ends_at:null,pre_transfer_starts_at:null,invitational_starts_at:null,open_transfer_starts_at:null},'unconfirmed',-1],
   [{invitational_starts_at:null},'phase-unconfirmed',-1],
   [{ends_at:'2026-09-12T00:00:00Z'},'unconfirmed',-1],
   [{invitational_starts_at:'2026-09-12T00:00:00Z'},'unconfirmed',-1],
   [{pre_transfer_starts_at:'2026-09-13T00:00:00'},'unconfirmed',-1],
   [{open_transfer_starts_at:'invalid'},'unconfirmed',-1],
   [{starts_at:'2026-02-30T00:00:00Z'},'unconfirmed',-1],
  ]){const r=await page.evaluate(data=>KSTransferOverview.timeline(data,Date.parse('2026-09-14T12:00:00Z')),{...snapshot,details_confirmed_at:'2026-09-12T00:00:00Z',...patch});assert.equal(r.state,state);assert.equal(r.current,current)}
  await page.evaluate(data=>KSTransferOverview.render(document.getElementById('transfer-recruitment'),data),{...snapshot,details_confirmed_at:'2026-09-12T00:00:00Z'});
  await page.clock.setFixedTime(new Date('2026-09-18T00:00:00Z'));await page.waitForTimeout(1150);
  assert.equal(await page.locator('.ti-status').textContent(),'Open Transfer');
  await page.clock.setFixedTime(new Date('2026-09-20T00:00:00Z'));await page.waitForTimeout(1150);
  assert.equal(await page.locator('.ti-status').textContent(),'Event ended');assert.equal(await page.locator('.ti-timeline [aria-current="step"]').count(),0);
  await context.close();
 });
 await test('Zero capacity remains zero, missing fields remain unconfirmed, long IDs and original RTL content do not overflow',async()=>{
  const data={...snapshot,entry_power_cap:0,ordinary_capacity:0,ordinary_places_remaining:0,special_invites_remaining:0,alliance_places_remaining:0,headline:'دعوة إلى الولاية 169 — '+('مجتمع يجمع الأصدقاء '.repeat(7)),strapline:'مقدمة أصلية للمجتمع',source_language:'ar',state_note:'ملاحظة أصلية عن الولاية',rules:'القواعد الأصلية',contacts:[{...snapshot.contacts[0],name:'A very long contact name with many words '.repeat(3),player_id:'12345678901234567890',role:'A long administrator-written role description '.repeat(6),alliance:'LONG-ALLIANCE-TAG'}]};
  const {page,context,errors}=await pageFor({data,width:320});
  for(const key of ['Entry Power Cap (in-game)','Ordinary places remaining','Special invitations remaining','Alliance places remaining'])assert.equal(await page.locator('.ti-fact').filter({has:page.locator('[data-ks-text="'+key+'"]')}).locator('dd').textContent(),'0');
  assert.equal(await page.locator('.ti-fact small[data-ks-text="Confirmed capacity: {count}"]').textContent(),'Confirmed capacity: 0');
  assert.equal(await page.locator('#transfer-headline').getAttribute('lang'),'ar');
  assert.equal(await page.locator('#transfer-headline').evaluate(el=>getComputedStyle(el).direction),'rtl');
  await page.evaluate(()=>{KSTranslations.fr['Requirements & exceptions']='Conditions, exigences supplémentaires et exceptions particulières à vérifier avant tout transfert';KSPreferences.setLanguage('fr')});
  await noOverflow(page);assert.deepEqual(errors,[]);
  await page.screenshot({path:artifacts+'/stress-320-zero-long-text.png',fullPage:true});
  await context.close();
 });
 await test('Keyboard expanders, focus, safe contact/source links and copy success/failure',async()=>{
  const data={...snapshot,discord_url:'https://discord.gg/Test169',contacts:[...snapshot.contacts,{name:'Hidden contact',visible:false,player_id:'999999'}]};
  const {page,context}=await pageFor({data});
  assert.equal(await page.locator('.tr-contact').count(),2);
  const source=page.locator('.ti-source a');assert.equal(await source.getAttribute('href'),snapshot.source_url);assert.equal(await source.getAttribute('rel'),'noopener noreferrer');
  assert.equal(await page.locator('.ti-contacts>a').getAttribute('href'),'https://discord.gg/Test169');
  const summary=page.locator('.ti-event summary').first();await summary.focus();await page.keyboard.press('Enter');
  assert.equal(await summary.evaluate(el=>el.parentElement.open),true);
  assert.equal(await summary.evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
  await page.keyboard.press('Enter');assert.equal(await summary.evaluate(el=>el.parentElement.open),false);
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.copied=text}}}));
  await page.locator('.tr-contact button').first().click();assert.equal(await page.evaluate(()=>window.copied),snapshot.contacts[0].player_id);
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied')}}}));
  await page.locator('.tr-contact button').last().click();assert.equal(await page.evaluate(()=>getSelection().toString()),snapshot.contacts[1].player_id);
  assert.match(await page.locator('.tr-contact .tr-feedback').last().textContent(),/Copy failed/);
  await page.evaluate(data=>KSTransferOverview.render(document.getElementById('transfer-recruitment'),data),{...snapshot,source_url:'javascript:alert(1)',discord_url:'https://example.com/fake'});
  assert.equal(await page.locator('.ti-source a,.ti-contacts>a').count(),0);
  await context.close();
 });
 await test('Images blocked and missing/failed settings: readable hero, honest notice, usable anchors and application',async()=>{
  for(const status of [200,503]){
   const {page,context,errors}=await pageFor({data:null,status,image:false});
   assert.match(await page.locator('.ti-unavailable').textContent(),/unavailable.*still apply/);
   assert.equal(await page.locator('#find').isEnabled(),true);
   assert.equal(await page.locator('#transfer-headline').textContent(),'Transfer to State 169');
   for(const href of await page.locator('a[href^="#"]:visible').evaluateAll(a=>a.map(n=>n.getAttribute('href'))))assert.equal(await page.locator(href).count(),1);
   await noOverflow(page);assert.deepEqual(errors,[]);
   if(status===503)await page.screenshot({path:artifacts+'/missing-settings-and-image-390.png',fullPage:true});
   await context.close();
  }
 });
 await test('Complete mocked application from another state, consent, all fields, reference and success; optional contact; own-state restriction',async()=>{
  for(const missing of [false,true]){
   const {page,context,calls,errors}=await pageFor({data:missing?null:snapshot,status:missing?503:200});
   await page.locator('.ti-primary').first().click();await page.locator('#fid').fill('169169');await page.locator('#find').click();
   await page.waitForFunction(()=>document.querySelector('#lookupMsg').textContent.includes('already in State 169'));
   assert.equal(await page.locator('#continue').isVisible(),false);
   await page.locator('#change').click();await page.locator('#fid').fill('12345678');await page.locator('#find').click();
   await page.waitForFunction(()=>document.querySelector('#lookupMsg').textContent.includes('Profile found'));
   assert.deepEqual(JSON.parse(calls.filter(c=>c.url.endsWith('/player-lookup')).at(-1).body),{player_id:'12345678'});
   await page.locator('#continue').click();assert.equal(await page.locator('#application').isVisible(),true);assert.deepEqual(await page.locator('.ti-progress li').evaluateAll(nodes=>nodes.map(n=>n.dataset.state)),['complete','current','pending']);
   await page.locator('[name="passes"]').fill('0');await page.locator('[name="preferred"]').selectOption('KRZ');await page.locator('[name="friends"]').fill('Fixture friend');await page.locator('[name="reason"]').fill('Fixture reason');await page.locator('[name="notes"]').fill('Fixture notes');
   await page.locator('#submitBtn').click();assert.equal(calls.filter(c=>c.url.endsWith('/submit-transfer')).length,0);
   await page.locator('#consent').check();await page.evaluate(()=>KSPreferences.setLanguage('fr'));
   assert.equal(await page.locator('[name="reason"]').inputValue(),'Fixture reason');await page.locator('#submitBtn').click();
   await page.waitForFunction(()=>document.querySelector('#successRef').textContent==='MOCK-169-REVIEW');
   assert.deepEqual(JSON.parse(calls.find(c=>c.url.endsWith('/submit-transfer')).body),{player_id:'12345678',transfer_passes:'0',preferred_alliance:'KRZ',referrer_or_friends:'Fixture friend',reason:'Fixture reason',notes:'Fixture notes'});
   assert.equal(await page.locator('#successCard').isVisible(),true);assert.deepEqual(errors,[]);
   assert.deepEqual(await page.evaluate(()=>window.scrollChoices),['auto','auto']);
   if(!missing)await page.screenshot({path:artifacts+'/mock-application-success-390.png',fullPage:true});
   await context.close();
  }
 });
 await test('Actual administration preview retains shared layout, editable draft, keyboard close and unsaved values',async()=>{
  const {page,context,calls,errors}=await pageFor({admin:true,width:1440});
  await page.locator('#recruitmentViewButton').click();await page.waitForFunction(()=>!document.querySelector('.tr-settings-fields').disabled);
  assert.equal(await page.locator('#tr-headline').inputValue(),snapshot.headline);
  await page.getByRole('button',{name:'Preview saved draft',exact:true}).click();
  assert.equal(await page.locator('dialog').evaluate(el=>el.open),true);
  assert.equal(await page.locator('dialog .tr-facts').count(),1);assert.equal(await page.locator('dialog .ti-event').count(),0);
  await page.screenshot({path:artifacts+'/admin-preview-unchanged-1440.png'});
  await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').evaluate(el=>el.open),false);
  await page.locator('#tr-headline').fill('Unsaved original text');await page.evaluate(()=>KSPreferences.setLanguage('ar'));
  assert.equal(await page.locator('#tr-headline').inputValue(),'Unsaved original text');
  await page.locator('#applicationsViewButton').click();await page.locator('#recruitmentViewButton').click();assert.equal(await page.locator('#tr-headline').inputValue(),'Unsaved original text');
  assert.equal(calls.filter(c=>c.url.includes('admin-transfer-settings')&&c.method!=='GET').length,0);
  assert.deepEqual(errors,[]);await context.close();
 });
 await test('Community cards follow published copy, contacts precede event, notices are deduplicated, metadata is hidden',async()=>{
  const {page,context}=await pageFor();
  assert.equal(await page.locator('.ti-benefit').count(),3);
  const positions=await page.evaluate(()=>['.ti-hero','.ti-benefits','#transfer-community','#transfer-contacts','#transfer-event','#transfer-application'].map(s=>document.querySelector(s).getBoundingClientRect().top));
  assert.deepEqual(positions,[...positions].sort((a,b)=>a-b));
  assert.equal(await page.locator('.ti-primary').first().textContent(),'Start my application');
  assert.equal(await page.locator('.ti-secondary').textContent(),'Meet the team');
  for(const text of ['Contacting the team is encouraged, but is not required to submit an application.','An enquiry or application is not an in-game invitation or a reserved alliance place.'])assert.equal(await page.locator('[data-ks-text="'+text+'"]').count(),1);
  assert.equal(await page.locator('.ti-attribution').count(),0);
  assert.equal(await page.getByText('Administrator-written content (en); shown in its original language.',{exact:true}).count(),0);
  assert.equal(await page.locator('.ti-tool-links a[href="../rally/"]').count(),1);assert.equal(await page.locator('.ti-tool-links a[href="../kings-buffs/"]').count(),1);
  await page.evaluate(data=>KSTransferOverview.render(document.getElementById('transfer-recruitment'),data),{...snapshot,headline:'New administrator headline',strapline:'A new introduction',recruitment_message:'New original message. No previous claims.',contacts:[]});
  assert.equal(await page.locator('#transfer-headline').textContent(),'New administrator headline');
  assert.equal(await page.locator('.ti-benefits').textContent().then(s=>s.includes('Some play to build')),false);
  assert.equal(await page.locator('.ti-benefits').textContent().then(s=>s.includes('a good teammate')),false);
  assert.match(await page.locator('.ti-community').textContent(),/New original message/);
  await context.close();
 });
 await test('Lookup errors, governor avatar fallback and application errors retain user input and honest progress',async()=>{
  const {page,context,calls,errors}=await pageFor({submitFailures:1});
  assert.deepEqual(await page.locator('.ti-progress li').evaluateAll(nodes=>nodes.map(n=>n.dataset.state)),['current','pending','pending']);
  await page.locator('#fid').fill('404404');await page.locator('#find').click();await page.waitForFunction(()=>document.querySelector('#lookupMsg').textContent.includes('Fixture player not found'));
  assert.equal(await page.locator('#fid').inputValue(),'404404');assert.equal(await page.locator('#find').isEnabled(),true);assert.equal(await page.locator('#playerCard').isVisible(),false);
  await page.locator('#fid').fill('12345678');await page.locator('#find').click();await page.waitForFunction(()=>document.querySelector('#lookupMsg').textContent==='Profile found');
  assert.equal(await page.locator('#governor-avatar img').count(),1);
  assert.equal(await page.locator('#governor-avatar img').evaluate(el=>el.complete&&el.naturalWidth>0),true);
  assert.equal(await page.locator('.ti-profile-explanation').textContent().then(s=>s.includes('does not prove ownership, eligibility or acceptance')),true);
  await page.screenshot({path:artifacts+'/profile-found-390.png',fullPage:true});
  await page.locator('#continue').click();assert.deepEqual(await page.locator('.ti-progress li').evaluateAll(nodes=>nodes.map(n=>n.dataset.state)),['complete','current','pending']);
  await page.locator('[name="passes"]').fill('12');await page.locator('[name="reason"]').fill('Keep this application after a failure.');await page.locator('#consent').check();
  await page.locator('#submitBtn').click();await page.waitForFunction(()=>document.querySelector('#submitMsg').textContent.includes('Fixture submission error'));
  assert.equal(await page.locator('[name="reason"]').inputValue(),'Keep this application after a failure.');assert.equal(await page.locator('#consent').isChecked(),true);assert.equal(await page.locator('#submitBtn').isEnabled(),true);
  assert.deepEqual(await page.locator('.ti-progress li').evaluateAll(nodes=>nodes.map(n=>n.dataset.state)),['complete','current','pending']);
  await page.screenshot({path:artifacts+'/application-error-390.png',fullPage:true});
  await page.locator('#submitBtn').click();await page.waitForFunction(()=>document.querySelector('#successRef').textContent==='MOCK-169-REVIEW');
  assert.deepEqual(await page.locator('.ti-progress li').evaluateAll(nodes=>nodes.map(n=>n.dataset.state)),['complete','complete','complete']);
  assert.equal(await page.locator('#application-received').evaluate(el=>el===document.activeElement),true);
  await page.locator('#change').click();assert.deepEqual(await page.locator('.ti-progress li').evaluateAll(nodes=>nodes.map(n=>n.dataset.state)),['current','pending','pending']);
  await page.locator('#fid').fill('77777777');await page.locator('#find').click();await page.waitForFunction(()=>document.querySelector('#lookupMsg').textContent==='Profile found');await page.waitForFunction(()=>!document.querySelector('#governor-avatar img'));
  assert.equal(await page.locator('#governor-avatar span').isVisible(),true);
  assert.equal(calls.filter(c=>c.url.endsWith('/submit-transfer')).length,2);assert.deepEqual(errors,[]);await context.close();
 });

}finally{
 await Deno.writeTextFile(artifacts+'/validation-results.json',JSON.stringify({generated:new Date().toISOString(),browser:browser.version(),results,failures},null,2));
 await browser.close();await server.shutdown();
}
if(failures.length)throw Error('Failed checks: '+failures.join(', '));
console.log('All Transfer design checks passed. All application submissions were intercepted.');

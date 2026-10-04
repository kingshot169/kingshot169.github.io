import {chromium} from 'npm:playwright@1.55.1';
import {strict as assert} from 'node:assert';
import {fileURLToPath} from 'node:url';
const repo=fileURLToPath(new URL('../',import.meta.url)).replaceAll('\\','/').replace(/\/$/,''),artifacts=await Deno.makeTempDir({prefix:'compare-scouting-tests-'}),results=[],unexpectedRemote=[];
const gearFixtures=JSON.parse(await Deno.readTextFile(repo+'/tests/fixtures/compare-gear-slots.json')).cases;
const gearFixtureById=new Map(gearFixtures.map(value=>[value.id,value]));
const gearSlots=['helmet','gloves','armour','boots'],gearTitles=['Helmet','Gloves','Armour','Boots'];
const testFilter=Deno.env.get('SCOUTING_TEST_FILTER');
function expectedGear(value){const entries={...(value.expectedFrom?gearFixtureById.get(value.expectedFrom).expected:{}),...value.expected};return gearSlots.map((slot,i)=>({slot,title:gearTitles[i],state:value.defaultState||'Unavailable',tier:null,enhancement:'—',mastery:'—',artwork:null,...entries[slot]}))}
const server=Deno.serve({hostname:'127.0.0.1',port:8772,onListen(){}},async req=>{let path=new URL(req.url).pathname;if(path.includes('..'))return new Response('',{status:403});if(path.endsWith('/'))path+='index.html';try{return new Response(await Deno.readFile(repo+path),{headers:{'Content-Type':path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':path.endsWith('.png')?'image/png':'text/html'}})}catch{return new Response('',{status:404})}});
const browser=await chromium.launch({executablePath:Deno.env.get('CHROME_PATH')||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const rank=(kid=203)=>({ok:true,version:1,kid,board:'personal_power',source:'MightPulse',coverage:'unknown',complete:true,order:'power-desc',tie_policy:'source-order',retrieved_at:'2026-10-03T16:30:00Z',source_timestamp:null,cached:false,players:Array.from({length:10},(_,i)=>({position:i+1,governor_id:i===0?'00001234567890123456':String(80000000+i),nick_name:i===0?'<img src=x onerror=alert(1)>':'Sample player '+(i+1),power:100000000-i*1000000}))});
const profile=id=>({ok:true,player:{player_id:id,name:'Sample player',kingdom:203,alliance_abbr:'TEST',avatar_url:'https://evil.invalid/a.png'},details:{version:1,location:{x:0,y:0},ranks:{mystic_trial:0},source:{age_seconds:120},heroes:[{name:'Sample arena hero',level:80,stars:5,exclusive_gear:{level:10},icon:'https://evil.invalid/hero.png',gear:structuredClone(gearFixtureById.get('ordinary-four-slots').hero.gear)},{name:'Unavailable public equipment',gear:null},{name:'No equipment record',gear:[]}]}});
async function setup({width=390,rankingPatch,rankingResponse,profilePatch,rateAt=0,malformedRate=false}={}){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage(),calls=[],errors=[];let busy=0,maxBusy=0,lookups=0;
 page.on('pageerror',e=>errors.push(e.message));await page.clock.install({time:new Date('2026-10-03T16:30:00Z')});
 await context.route('**/*',async route=>{const url=route.request().url();if(url.startsWith('http://127.0.0.1:8772/'))return route.continue();
  if(url.includes('supabase-js'))return route.fulfill({contentType:'text/javascript',body:'window.supabase={createClient(){return {auth:{async getSession(){return {data:{session:null}}},onAuthStateChange(){return {data:{subscription:{unsubscribe(){}}}}}}}}}'});
  if(!url.startsWith('https://iqjvzhgodwufvepegwyj.supabase.co/functions/v1/')||route.request().method()!=='POST'){unexpectedRemote.push(url);return route.abort('blockedbyclient')}
  const body=JSON.parse(route.request().postData()||'{}');calls.push({url,body,headers:route.request().headers()});
  if(url.endsWith('/kingdom-compare'))return route.fulfill({json:{ok:true,left:{kid:169,power:1200000000,player_count:400,active_7d:220},right:{kid:body.opponent,power:1100000000,player_count:350,active_7d:200}}});
  if(url.endsWith('/kingdom-rankings')){if(rankingResponse)return route.fulfill(rankingResponse);const data=rank(body.opponent);rankingPatch?.(data);return route.fulfill({json:data})}
  if(url.endsWith('/player-lookup')&&!body.details)return route.fulfill({json:{ok:true,player:{player_id:body.player_id,name:'Visitor',kingdom:169}}});
  if(url.endsWith('/player-lookup')){lookups++;busy++;maxBusy=Math.max(maxBusy,busy);await new Promise(r=>setTimeout(r,5));busy--;
   if(rateAt&&lookups===rateAt)return route.fulfill({status:429,...(malformedRate?{body:'not json'}:{json:{ok:false,error:'limited'}})});
   const data=profile(body.player_id);profilePatch?.(data,lookups);return route.fulfill({json:data});}
  unexpectedRemote.push(url);return route.abort('blockedbyclient');
 });
 await page.goto('http://127.0.0.1:8772/compare/?state=203');await page.waitForSelector('#player-access:visible');
 return {context,page,calls,errors,maxBusy:()=>maxBusy};
}
async function compare(page){await page.locator('#visitor-id').fill('12345678');await page.locator('#check-player').click();await page.waitForSelector('#access-profile:visible');await page.locator('#access-continue').click();await page.locator('#compare').click();await page.waitForSelector('#kvk-hero:visible')}
async function scout(page){await page.locator('#kvk-scout').click();await page.waitForFunction(()=>!document.querySelector('#kvk-scout').disabled)}
const detailed=calls=>calls.filter(c=>c.body.details===true);
async function assertGearRow(row,fixture){
 const expected=expectedGear(fixture),tiles=row.locator('.kvk-gear');assert.equal(await tiles.count(),4,fixture.id);
 for(const [i,value]of expected.entries()){
  const tile=tiles.nth(i);assert.equal(await tile.locator('.kvk-slot').textContent(),value.title,fixture.id+' slot '+i);
  assert.equal(await tile.evaluate(n=>n.classList.contains('is-red')),value.state==='available'&&value.tier==='Red',fixture.id+' red '+i);
  assert.equal(await tile.evaluate(n=>n.classList.contains('is-gold')),value.state==='available'&&value.tier==='Gold',fixture.id+' gold '+i);
  if(value.state!=='available'){
   assert.equal(await tile.locator('.kvk-gear-state').textContent(),value.state,fixture.id+' state '+i);
   assert.equal(await tile.locator('.kvk-enhancement,.kvk-tier,.kvk-equipment-art').count(),0,fixture.id+' unavailable values/artwork '+i);
  }else{
   assert.equal(await tile.locator('.kvk-enhancement').textContent(),value.enhancement==='—'?'—':'+'+value.enhancement,fixture.id+' enhancement '+i);
   assert.match(await tile.textContent(),new RegExp('Mastery '+value.mastery.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')),fixture.id+' mastery '+i);
   assert.equal(await tile.locator('.kvk-equipment-art').count(),value.artwork?1:0,fixture.id+' artwork '+i);
   if(value.artwork)assert.equal(await tile.locator('.kvk-equipment-art').getAttribute('src'),value.artwork,fixture.id+' artwork identity '+i);
  }
 }
}
async function test(name,fn){if(testFilter&&!name.includes(testFilter))return;await fn();assert.deepEqual(unexpectedRemote,[],'Unexpected remote requests were aborted');results.push({name,passed:true});console.log('PASS '+name)}
try{
 await test('Access gate, explicit action, exact ranking IDs, serial profiles and hero-first report',async()=>{
  const browserGearCases=gearFixtures.filter(value=>value.id!=='legacy-explicit-hidden-gear');
  const {page,context,calls,errors,maxBusy}=await setup({profilePatch:p=>p.details.heroes.push(...browserGearCases.map(value=>({name:value.id,...structuredClone(value.hero)})))});await page.evaluate(()=>KvkScouting.start());assert.equal(calls.length,0);await compare(page);assert.equal(detailed(calls).length,0);assert.equal(calls.filter(c=>c.url.endsWith('/kingdom-rankings')).length,0);
  await page.locator('#kvk-scout').click();await page.locator('#kvk-scout').dispatchEvent('click');await page.waitForFunction(()=>!document.querySelector('#kvk-scout').disabled);
  assert.equal(detailed(calls).length,10);assert.deepEqual(detailed(calls).map(c=>c.body.player_id),rank().players.map(p=>p.governor_id));assert.equal(maxBusy(),1);assert.ok(detailed(calls).every(c=>c.headers.authorization===undefined));
  assert.equal(await page.locator('#kvk-summary>li').count(),10);assert.equal(await page.locator('.kvk-player-card').count(),10);assert.match(await page.locator('#kvk-status').textContent(),/incomplete/);assert.match(await page.locator('#kvk-summary>li').first().textContent(),/Mystic Trial: 0.*K203 · X 0 · Y 0/s);
  assert.equal(await page.locator('.kvk-ranking-name img').count(),0);assert.equal(await page.locator('.kvk-gear.is-red').first().locator('.kvk-enhancement').textContent(),'+51');assert.equal(await page.locator('.kvk-gear.is-gold').first().locator('.kvk-enhancement').textContent(),'+100');assert.equal(await page.locator('.kvk-gear.is-red').nth(1).locator('.kvk-enhancement').textContent(),'—');assert.equal(await page.locator('.kvk-hero-row').nth(1).locator('.kvk-gear-state').first().textContent(),'Unavailable');
  for(const [i,value]of browserGearCases.entries())await assertGearRow(page.locator('#kvk-player-0 .kvk-hero-row').nth(i+3),value);
  const duplicate=page.locator('#kvk-player-0 .kvk-hero-row').nth(3+browserGearCases.findIndex(value=>value.id==='conflicting-fifth-duplicate-cannot-be-truncated-or-restored'));
  for(const theme of ['dark','light']){await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);await duplicate.screenshot({path:artifacts+'/conflicting-duplicate-390-'+theme+'.png'})}
  await page.evaluate(()=>document.documentElement.dataset.theme='dark');
  const y=await page.evaluate(()=>['kvk-hero','kvk-summary','kvk-cards'].map(id=>document.getElementById(id).getBoundingClientRect().top));assert.ok(y[0]<y[1]&&y[1]<y[2]);assert.deepEqual(errors,[]);await context.close();
 });
 await test('Complete profiles and five-minute cache reuse; expired reports are freshly requested',async()=>{
  const {page,context,calls}=await setup({profilePatch:p=>p.details.heroes=p.details.heroes.slice(0,1)});await compare(page);await scout(page);assert.match(await page.locator('#kvk-status').textContent(),/Scouting complete · 10\/10/);const count=calls.length;await page.clock.fastForward(240000);await scout(page);assert.equal(calls.length,count);await page.clock.fastForward(60001);await scout(page);assert.equal(detailed(calls).length,20);assert.equal(calls.filter(c=>c.url.endsWith('/kingdom-rankings')).length,2);await context.close();
 });
 await test('Reject unverifiable or unavailable rankings; preserve usable kingdom comparison',async()=>{
  for(const patch of [r=>r.players[1].governor_id=r.players[0].governor_id,r=>r.players[0].power=-1,r=>r.players[1].power=r.players[0].power+1,r=>r.kid=82,r=>r.players[0].governor_id=12345678,r=>r.complete=false,r=>delete r.players[0].governor_id]){
   const {page,context,calls}=await setup({rankingPatch:patch});await compare(page);await scout(page);assert.equal(detailed(calls).length,0);assert.match(await page.locator('#kvk-status').textContent(),/unavailable/);assert.equal(await page.locator('#results').isVisible(),true);assert.equal(await page.locator('#compare').isEnabled(),true);await context.close();}
  for(const rankingResponse of [{json:{ok:false,error:'unavailable'}},{status:503,json:{ok:false,error:'unavailable'}},{status:200,contentType:'application/json',body:'not valid json'}]){
   const {page,context,calls,errors}=await setup({rankingResponse});await compare(page);
   const original=await page.locator('#strength,#activity,#breakdown').allTextContents();await scout(page);
   assert.equal(detailed(calls).length,0);assert.match(await page.locator('#kvk-status').textContent(),/unavailable/);
   assert.equal(await page.locator('#results').isVisible(),true);assert.equal(await page.locator('#kvk-hero').isVisible(),true);assert.equal(await page.locator('#comparison-controls').isVisible(),true);
   assert.deepEqual(await page.locator('#strength,#activity,#breakdown').allTextContents(),original);assert.equal(await page.locator('#kvk-summary>li,.kvk-player-card').count(),0);
   assert.equal(await page.locator('#compare').isEnabled(),true);assert.equal(await page.locator('#kvk-scout').isEnabled(),true);
   await page.locator('#opponent').fill('82');await page.locator('#compare').click();await page.waitForFunction(()=>document.querySelector('#kvk-matchup').textContent.includes('82'));
   assert.equal(calls.filter(c=>c.url.endsWith('/kingdom-compare')).length,2);assert.equal(detailed(calls).length,0);assert.equal(await page.locator('#results').isVisible(),true);assert.deepEqual(errors,[]);await context.close();
  }
 });
 await test('Missing location and mismatched player identity remain unavailable without changing ranks',async()=>{
  const {page,context}=await setup({profilePatch:(p,i)=>{if(i===1)p.player.player_id='99999999';if(i===2)p.details.location=null;if(i===3)p.details.version=2}});await compare(page);await scout(page);
  assert.match(await page.locator('#kvk-summary>li').nth(0).textContent(),/Mystic Trial: Unavailable/);assert.match(await page.locator('#kvk-summary>li').nth(1).textContent(),/Mystic Trial: 0.*Last known: Unavailable/s);assert.match(await page.locator('#kvk-summary>li').nth(2).textContent(),/Mystic Trial: Unavailable/);assert.match(await page.locator('#kvk-status').textContent(),/incomplete/);await context.close();
 });
 await test('Malformed 429 stops remaining lookups; cached repeat neither retries nor extends expiry',async()=>{
  const {page,context,calls}=await setup({rateAt:3,malformedRate:true});await compare(page);await scout(page);assert.equal(detailed(calls).length,3);assert.equal(await page.locator('.kvk-player-card').count(),10);assert.match(await page.locator('#kvk-status').textContent(),/Rate limited/);
  const count=calls.length;await page.clock.fastForward(4*60000);await scout(page);assert.equal(calls.length,count);assert.match(await page.locator('#kvk-status').textContent(),/Browser cache/);
  await page.clock.fastForward(60001);await scout(page);assert.equal(calls.length,count);assert.match(await page.locator('#kvk-status').textContent(),/Rate limited/);await context.close();
 });
 await test('Timeout and access revocation cancel pending scouting and suppress late writes',async()=>{
  const {page,context}=await setup();await compare(page);
  await page.evaluate(()=>{const original=fetch;window.fetch=(url,options)=>url.endsWith('/player-lookup')?new Promise((resolve,reject)=>{window.resolveLate=resolve;options.signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')))}):original(url,options)});
  await page.locator('#kvk-scout').click();await page.waitForFunction(()=>typeof resolveLate==='function');await page.clock.fastForward(105001);await page.waitForFunction(()=>!document.getElementById('kvk-scout').disabled);assert.match(await page.locator('#kvk-status').textContent(),/timed out/);assert.equal(await page.locator('.kvk-player-card').count(),10);
  await page.locator('#opponent').fill('82');await page.locator('#compare').click();await page.waitForSelector('#kvk-hero:visible');await page.locator('#kvk-scout').click();await page.waitForFunction(()=>document.getElementById('kvk-status').textContent.includes('Loading')||document.getElementById('kvk-summary').children.length>0);await page.locator('#access-change').click();await page.evaluate(()=>resolveLate(Response.json({ok:true,player:{player_id:'80000000'},details:{version:1}})));assert.equal(await page.locator('#results').isVisible(),false);assert.equal(await page.locator('.kvk-player-card').count(),0);await context.close();
 });
 await test('Four gear tiles stay in one row at 320/390/1440, all languages/themes and keyboard expansion',async()=>{
  for(const width of [320,390,1440]){const {page,context,errors}=await setup({width});await compare(page);await scout(page);
   for(const lang of ['en','ko','es','pt','fr','ar'])for(const theme of ['dark','light']){await page.evaluate(({lang,theme})=>{KSPreferences.setLanguage(lang);document.documentElement.dataset.theme=theme},{lang,theme});assert.deepEqual(await page.evaluate(()=>KSPreferences.getMissing()),[]);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width+' '+lang);const tops=await page.locator('.kvk-gear-line').first().locator('.kvk-gear').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().top));assert.ok(tops.every(y=>Math.abs(y-tops[0])<1));}
   await page.evaluate(()=>KSPreferences.setLanguage('en'));await page.locator('#kvk-player-1 summary').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#kvk-player-1').evaluate(n=>n.open),true);await page.evaluate(()=>document.documentElement.dataset.theme='dark');await page.locator('#kvk-player-0').scrollIntoViewIfNeeded();await page.screenshot({path:artifacts+'/gear-'+width+'.png'});await page.locator('#kvk-hero').screenshot({path:artifacts+'/hero-'+width+'.png'});assert.deepEqual(errors,[]);await context.close();}
 });
}finally{await Deno.writeTextFile(artifacts+'/results.json',JSON.stringify(results,null,2));await browser.close();await server.shutdown();console.log('Artifacts: '+artifacts)}
assert.ok(results.length,'Scouting test filter must select at least one test');
console.log('All '+results.length+' selected scouting checks passed; external requests mocked.');

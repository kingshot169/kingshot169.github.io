import {chromium} from 'npm:playwright@1.55.1';
import {strict as assert} from 'node:assert';
import {fileURLToPath} from 'node:url';
const repo=fileURLToPath(new URL('../',import.meta.url)).replaceAll('\\','/').replace(/\/$/,'');
const artifacts=await Deno.makeTempDir({prefix:'compare-access-tests-'}),results=[];
const server=Deno.serve({hostname:'127.0.0.1',port:8770,onListen(){}},async req=>{
 let path=decodeURIComponent(new URL(req.url).pathname);if(path.includes('..'))return new Response('',{status:403});if(path.endsWith('/'))path+='index.html';
 try{return new Response(await Deno.readFile(repo+path),{headers:{'Content-Type':path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':'text/html'}})}catch{return new Response('',{status:404})}
});
const browser=await chromium.launch({executablePath:Deno.env.get('CHROME_PATH')||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
async function setup({kingdom=169,status=200,playerPatch={},bodyPatch={},storage=true,width=390}={}){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 if(!storage)await context.addInitScript(()=>{Object.defineProperty(window,'sessionStorage',{get(){throw Error('disabled')}})});
 const page=await context.newPage(),calls=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.clock.install({time:new Date('2026-09-14T12:00:00Z')});
 await context.route('**/*',async route=>{
  const url=route.request().url();if(url.startsWith('http://127.0.0.1:8770/'))return route.continue();
  if(url.includes('supabase-js'))return route.fulfill({contentType:'text/javascript',body:'window.supabase={createClient(){return {auth:{async getSession(){return {data:{session:null}}},onAuthStateChange(){return {data:{subscription:{unsubscribe(){}}}}}}}}}'});
  const body=JSON.parse(route.request().postData()||'{}');calls.push({url,body,headers:route.request().headers()});
  if(url.endsWith('/player-lookup'))return route.fulfill({status,json:{ok:true,player:{player_id:body.player_id,name:'Visitor <safe>',kingdom,...playerPatch},...bodyPatch}});
  if(url.endsWith('/kingdom-compare'))return route.fulfill({json:{ok:true,left:{kid:169,power:123456,health:'stable'},right:{kid:body.opponent,power:987654,health:'stable'}}});
  throw Error('Unexpected remote request '+url);
 });
 await page.goto('http://127.0.0.1:8770/compare/?state=82');
 await page.waitForSelector('#player-access:visible');return {context,page,calls,errors};
}
async function check(page,id='12345678') {await page.locator('#visitor-id').fill(id);await page.locator('#check-player').click();await page.waitForFunction(()=>!document.querySelector('#check-player').disabled)}
async function unlock(page){await check(page);await page.locator('#access-continue').click()}
async function locked(page,calls){assert.equal(await page.locator('#comparison-controls').isVisible(),false);assert.equal(await page.locator('#results').isVisible(),false);await page.evaluate(()=>run());await page.locator('#opponent').dispatchEvent('keydown',{key:'Enter'});assert.equal(calls.filter(c=>c.url.endsWith('/kingdom-compare')).length,0)}
async function test(name,fn){await fn();results.push({name,passed:true});console.log('PASS '+name)}
try{
 await test('Initial lock covers preset, button, Enter and direct requests; invalid IDs cause no lookup',async()=>{
  const {page,context,calls}=await setup();await locked(page,calls);await page.locator('#compare').dispatchEvent('click');assert.equal(calls.length,0);
  for(const id of ['123','123456789012345678901','12 3456','1e10','']){await check(page,id);assert.equal(calls.length,0)}await context.close();
 });
 await test('Numeric and string State 169: explicit confirmation, basic string ID payload, safe name and unrestricted opponent',async()=>{
  for(const kingdom of [169,'169']){const {page,context,calls,errors}=await setup({kingdom});await check(page,' 12345678 ');await locked(page,calls);
   assert.deepEqual(calls[0].body,{player_id:'12345678'});assert.equal(calls[0].headers.authorization,'Bearer '+calls[0].headers.apikey);
   assert.equal(await page.locator('#visitor-name').textContent(),'Visitor <safe>');assert.equal(await page.locator('#visitor-name img').count(),0);
   await page.locator('#access-continue').click();assert.equal(await page.locator('#opponent').evaluate(el=>el===document.activeElement),true);
   await page.locator('#opponent').fill('82');await page.locator('#opponent').press('Enter');await page.waitForSelector('#results:not(.hidden)');assert.deepEqual(calls.at(-1).body,{opponent:82});assert.equal(await page.locator('#rightTitle').textContent(),'State 82');assert.equal(await page.locator('#strength tr').count(),7);
   const expiry=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('ks169-compare-access-v1')).expires);await page.reload();assert.equal(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('ks169-compare-access-v1')).expires),expiry);assert.equal(await page.locator('#comparison-controls').isVisible(),true);assert.equal(calls.filter(c=>c.url.endsWith('/player-lookup')).length,1);
   await page.locator('#access-change').click();assert.equal(await page.locator('#comparison-controls').isVisible(),false);assert.equal(await page.locator('#strength tr').count(),0);assert.equal(await page.evaluate(()=>sessionStorage.getItem('ks169-compare-access-v1')),null);
   assert.deepEqual(errors,[]);await context.close();}
 });
 await test('Twenty-digit player IDs remain exact strings',async()=>{const {page,context,calls}=await setup();await check(page,'12345678901234567890');assert.deepEqual(calls[0].body,{player_id:'12345678901234567890'});assert.match(await page.locator('#visitor-meta').textContent(),/12345678901234567890/);await context.close()});
 await test('Other states, missing/malformed kingdom, invalid player and unsuccessful envelope stay locked',async()=>{
  const cases=[{kingdom:82},{kingdom:'82'},{kingdom:null},{kingdom:''},{kingdom:'169.0'},{kingdom:' 169 '},{kingdom:[169]},{kingdom:true},{kingdom:{}},{playerPatch:{kingdom:undefined}},{playerPatch:{name:null}},{playerPatch:{player_id:12345678}},{playerPatch:{player_id:'99999999'}},{bodyPatch:{ok:false}},{bodyPatch:{player:null}}];
  for(const fixture of cases){const {page,context,calls}=await setup(fixture);await check(page);await locked(page,calls);assert.equal(await page.locator('#access-profile').isVisible(),false);await context.close()}
 });
 await test('Failure, rate limit, malformed JSON and timeout show inline errors without automatic retry',async()=>{
  for(const status of [500,429]){const {page,context,calls}=await setup({status});await check(page);assert.match(await page.locator('#access-message').textContent(),status===429?/Too many lookups/:/lookup failed/);await locked(page,calls);assert.equal(calls.length,1);await context.close()}
  const {page,context,calls}=await setup();await page.evaluate(()=>{window.fetch=(_url,options)=>new Promise((_resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError'))))});
  await page.locator('#visitor-id').fill('12345678');await page.locator('#check-player').click();await page.clock.fastForward(10001);assert.match(await page.locator('#access-message').textContent(),/timed out/);await locked(page,calls);
  await page.evaluate(()=>{window.fetch=async()=>new Response('{invalid',{status:200})});await check(page);assert.match(await page.locator('#access-message').textContent(),/lookup failed/);await context.close();
 });
 await test('Duplicate lookup suppression and stale responses after input change cannot unlock or replace a newer player',async()=>{
  const {page,context,calls}=await setup();await page.evaluate(()=>{window.queued=[];window.fetch=(url,options)=>new Promise(resolve=>window.queued.push({resolve,body:JSON.parse(options.body)}))});
  await page.locator('#visitor-id').fill('12345678');await page.locator('#check-player').click();await page.locator('#access-form').dispatchEvent('submit');assert.equal(await page.evaluate(()=>queued.length),1);
  await page.locator('#visitor-id').fill('87654321');await page.locator('#check-player').click();
  await page.evaluate(()=>queued[1].resolve(Response.json({ok:true,player:{player_id:'87654321',name:'New player',kingdom:169}})));await page.waitForSelector('#access-profile:visible');
  await page.evaluate(()=>queued[0].resolve(Response.json({ok:true,player:{player_id:'12345678',name:'Old player',kingdom:169}})));assert.equal(await page.locator('#visitor-name').textContent(),'New player');await locked(page,calls);await context.close();
 });
 await test('Expiry clears approval/results, session lifetime is bounded and blocked storage has memory fallback',async()=>{
  for(const storage of [true,false]){const {page,context,calls}=await setup({storage});await unlock(page);await page.locator('#compare').click();await page.waitForSelector('#results:not(.hidden)');await page.clock.fastForward(30*60*1000+1);assert.equal(await page.locator('#comparison-controls').isVisible(),false);assert.equal(await page.locator('#results').isVisible(),false);assert.equal(await page.locator('#strength tr').count(),0);const count=calls.length;await page.evaluate(()=>run());assert.equal(calls.length,count);assert.match(await page.locator('#access-message').textContent(),/expired/);await context.close()}
  const {page,context,calls}=await setup();await unlock(page);await page.evaluate(()=>{const key='ks169-compare-access-v1',record=JSON.parse(sessionStorage.getItem(key));record.expires+=60000;sessionStorage.setItem(key,JSON.stringify(record))});await page.reload();await locked(page,[]);assert.equal(await page.evaluate(()=>sessionStorage.getItem('ks169-compare-access-v1')),null);await context.close();
 });
 await test('Pending comparison is cancelled and cannot restore results after changing player',async()=>{
  const {page,context}=await setup();await unlock(page);await page.evaluate(()=>{window.fetch=()=>new Promise(resolve=>window.finishCompare=resolve)});await page.locator('#compare').click();await page.locator('#access-change').click();await page.evaluate(()=>finishCompare(Response.json({ok:true,left:{kid:169},right:{kid:82}})));assert.equal(await page.locator('#results').isVisible(),false);assert.equal(await page.locator('#compare').isDisabled(),true);await context.close();
 });
 await test('Keyboard lookup, six languages, both themes and 320/390/1440 widths',async()=>{
  for(const width of [320,390,1440]){const {page,context,errors}=await setup({width});
   for(const lang of ['en','ko','es','pt','fr','ar'])for(const theme of ['dark','light']){await page.evaluate(({lang,theme})=>{KSPreferences.setLanguage(lang);document.documentElement.dataset.theme=theme},{lang,theme});assert.deepEqual(await page.evaluate(()=>KSPreferences.getMissing()),[]);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))}
   await page.evaluate(()=>KSPreferences.setLanguage('en'));await page.locator('#visitor-id').fill('12345678');await page.locator('#visitor-id').press('Enter');await page.waitForSelector('#access-profile:visible');assert.equal(await page.locator('#access-continue').evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Enter');assert.equal(await page.locator('#comparison-controls').isVisible(),true);
   await page.locator('#access-change').click();await page.screenshot({path:artifacts+'/gate-'+width+'.png',fullPage:true});assert.deepEqual(errors,[]);await context.close();}
 });
}finally{await Deno.writeTextFile(artifacts+'/results.json',JSON.stringify(results,null,2));await browser.close();await server.shutdown();console.log('Artifacts: '+artifacts)}
console.log('All Compare access checks passed; all remote requests mocked.');
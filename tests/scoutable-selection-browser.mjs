// Synthetic opt-in responses exercise controlled skipping. These are not Kingdom145 captures.
import { chromium } from 'npm:playwright@1.55.1';
import { strict as assert } from 'node:assert';
import { fileURLToPath } from 'node:url';
const website=fileURLToPath(new URL('../',import.meta.url)).replaceAll('\\','/').replace(/\/$/,''),output=await Deno.makeTempDir({prefix:'scoutable-selection-tests-'});
const origin='http://127.0.0.1:8784',endpoint='https://iqjvzhgodwufvepegwyj.supabase.co/functions/v1/';
const results=[],unexpected=[],errors=[];
const response=(positions,source,eligible,skipped)=>({ok:true,version:2,projection:'scoutable-v1',kid:145,board:'personal_power',source:'MightPulse',coverage:'unknown',complete:true,order:'power-desc',tie_policy:'source-order',retrieved_at:'2026-10-04T00:00:00Z',source_timestamp:null,cached:false,selection:{kind:'highest-ranked-scoutable',limit:10,source_row_count:source,eligible_entry_count:eligible,skipped_entry_count:skipped,selected_entry_count:positions.length,skipped_before_selection_count:positions.length<10?skipped:positions.at(-1)-positions.length,partial:positions.length<10},players:positions.map(position=>({position,governor_id:String(71010000+position),nick_name:'Synthetic player '+position,power:100000000-position*100000}))});
const profile=id=>({ok:true,player:{player_id:id,name:'Synthetic player',kingdom:145},details:{version:1,location:{x:0,y:0},ranks:{mystic_trial:0},source:{age_seconds:120},heroes:[{name:'Synthetic hero',level:80,gear:[{slot:'helmet',name:'Infantry Helmet',quality_key:'red',red:true,enhancement_level:151,refine_level:10,troop:'infantry'},{slot:'gloves',name:'Infantry Gloves',quality_key:'gold',enhancement_level:100,refine_level:5,troop:'infantry'},{slot:'armour',name:'Infantry Armour',quality_key:'gold',enhancement_level:100,refine_level:5,troop:'infantry'},{slot:'boots',name:'Infantry Boots',quality_key:'gold',enhancement_level:100,refine_level:5,troop:'infantry'}]}]}});
const server=Deno.serve({hostname:'127.0.0.1',port:8784,onListen(){}},async request=>{
 let path=new URL(request.url).pathname;if(path.includes('..')||path.includes('\\'))return new Response('',{status:403});if(path.endsWith('/'))path+='index.html';
 try{return new Response(await Deno.readFile(website+path),{headers:{'Content-Type':path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':path.endsWith('.png')?'image/png':'text/html'}})}catch{return new Response('',{status:404})}
});
let browser;
async function setup(data,{failDetailAt=0}={}){
 const context=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'}),page=await context.newPage(),requests=[];let detailCount=0;
 page.on('pageerror',error=>errors.push(error.message));
 await context.route('**/*',async route=>{
  const request=route.request(),url=request.url();if(url.startsWith(origin+'/'))return route.continue();
  if(url.includes('supabase-js'))return route.fulfill({contentType:'text/javascript',body:'window.supabase={createClient(){return {auth:{async getSession(){return {data:{session:null}}},onAuthStateChange(){return {data:{subscription:{unsubscribe(){}}}}}}}}}'});
  if(!url.startsWith(endpoint)||request.method()!=='POST'){unexpected.push(url);return route.abort('blockedbyclient')}
  const body=JSON.parse(request.postData()||'{}'),name=url.slice(endpoint.length);requests.push({name,body});
  if(name==='player-lookup'&&!body.details)return route.fulfill({json:{ok:true,player:{player_id:body.player_id,name:'Synthetic visitor',kingdom:169}}});
  if(name==='kingdom-compare')return route.fulfill({json:{ok:true,left:{kid:169,power:1200000000,player_count:400,active_7d:220},right:{kid:body.opponent,power:1100000000,player_count:350,active_7d:200}}});
  if(name==='kingdom-rankings'){assert.deepEqual(body,{opponent:145,projection:'scoutable-v1'});return route.fulfill({json:structuredClone(data)})}
  if(name==='player-lookup'&&body.details){detailCount++;if(detailCount===failDetailAt)return route.fulfill({status:503,json:{ok:false,error:'unavailable'}});return route.fulfill({json:profile(body.player_id)})}
  unexpected.push(url);return route.abort('blockedbyclient');
 });
 await page.goto(origin+'/compare/?state=145');await page.waitForSelector('#player-access:visible');await page.locator('#visitor-id').fill('71009999');await page.locator('#check-player').click();await page.waitForSelector('#access-profile:visible');await page.locator('#access-continue').click();await page.locator('#compare').click();await page.waitForSelector('#kvk-hero:visible');
 assert.equal(requests.filter(value=>value.name==='kingdom-rankings').length,0,'Scouting requires its explicit button');
 const normalBefore=await page.locator('#strength,#activity,#breakdown').allTextContents();
 await page.locator('#kvk-scout').click();await page.waitForFunction(()=>!document.getElementById('kvk-scout').disabled);
 assert.deepEqual(await page.locator('#strength,#activity,#breakdown').allTextContents(),normalBefore);
 return {context,page,requests};
}
async function run(name,fn){await fn();assert.deepEqual(unexpected,[]);assert.deepEqual(errors,[]);results.push({name,passed:true});console.log('PASS '+name)}
try{
 browser=await chromium.launch({executablePath:Deno.env.get('CHROME_PATH')||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 await run('Unavailable ID below first ten does not alter selected positions or show selection-skip notice',async()=>{
  const {context,page,requests}=await setup(response(Array.from({length:10},(_,i)=>i+1),100,99,1));
  assert.equal(await page.locator('#kvk-skipped-notice').isVisible(),false);assert.equal(await page.locator('#kvk-partial-notice').isVisible(),false);assert.match(await page.locator('#kvk-selection-counts').textContent(),/Returned entries: 100 · available IDs: 99 · unavailable IDs: 1/);
  assert.deepEqual(await page.locator('.kvk-ranking-name').allTextContents(),Array.from({length:10},(_,i)=>`#${i+1} Synthetic player ${i+1}`));assert.equal(requests.filter(value=>value.body.details).length,10);await context.close();
 });
 await run('Selection preserves source positions, retains failed details, translates notices, and caches metadata without retry/backfill',async()=>{
  const positions=[2,3,5,6,7,8,10,11,12,13],{context,page,requests}=await setup(response(positions,100,97,3),{failDetailAt:2});
  assert.deepEqual(await page.locator('.kvk-ranking-name').allTextContents(),positions.map(value=>`#${value} Synthetic player ${value}`));assert.equal(await page.locator('.kvk-player-card').count(),10);assert.equal(await page.locator('.kvk-hero-row').count(),9);
  assert.match(await page.locator('#kvk-player-1').textContent(),/#3 Synthetic player 3.*Profile unavailable; ranking retained\./s);assert.match(await page.locator('#kvk-skipped-notice').textContent(),/^3 entries skipped/);assert.equal(await page.locator('#kvk-partial-notice').isVisible(),false);assert.match(await page.locator('#kvk-status').textContent(),/Scouting incomplete · 9\/10/);
  assert.deepEqual(requests.filter(value=>value.body.details).map(value=>value.body.player_id),positions.map(value=>String(71010000+value)));assert.equal(requests.filter(value=>value.name==='kingdom-rankings').length,1);
  for(const width of [320,390,1440]){await page.setViewportSize({width,height:900});for(const lang of ['en','ko','es','pt','fr','ar'])for(const theme of ['dark','light']){
   await page.evaluate(({lang,theme})=>{KSPreferences.setLanguage(lang);document.documentElement.dataset.theme=theme},{lang,theme});assert.deepEqual(await page.evaluate(()=>KSPreferences.getMissing()),[]);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width+' '+lang+' '+theme);
   assert.ok((await page.locator('#kvk-skipped-notice').textContent()).includes('3'));assert.equal(await page.locator('#kvk-report-title').textContent(),await page.evaluate(()=>KSPreferences.text('Opponent scouting — up to 10 highest-ranked players with available IDs')));
   const tops=await page.locator('.kvk-gear-line').first().locator('.kvk-gear').evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().top));assert.ok(tops.every(value=>Math.abs(value-tops[0])<1));
  }}
  await page.evaluate(()=>KSPreferences.setLanguage('en'));await page.setViewportSize({width:390,height:900});await page.locator('#kvk-report').screenshot({path:output+'/scoutable-selection-390.png'});
  const count=requests.length;await page.locator('#kvk-scout').click();await page.waitForFunction(()=>!document.getElementById('kvk-scout').disabled);assert.equal(requests.length,count,'Cached failed profile must not retry or backfill');assert.match(await page.locator('#kvk-skipped-notice').textContent(),/^3 entries skipped/);assert.match(await page.locator('#kvk-status').textContent(),/Browser cache/);assert.equal(await page.locator('.kvk-player-card').count(),10);await context.close();
 });
 await run('Fewer than ten usable IDs is an explicit unpadded partial selection',async()=>{
  const positions=[1,3,4,5,8,10,12],{context,page,requests}=await setup(response(positions,12,7,5));assert.equal(await page.locator('.kvk-player-card').count(),7);assert.equal(await page.locator('#kvk-summary>li').count(),7);assert.match(await page.locator('#kvk-partial-notice').textContent(),/^Partial selection: 7 of up to 10/);assert.match(await page.locator('#kvk-skipped-notice').textContent(),/^5 entries skipped/);assert.equal(requests.filter(value=>value.body.details).length,7);await context.close();
 });
 await run('All IDs unavailable returns a truthful zero-entry partial report with no player-detail calls',async()=>{
  const {context,page,requests}=await setup(response([],100,0,100));assert.equal(await page.locator('.kvk-player-card,#kvk-summary>li').count(),0);assert.equal(await page.locator('#kvk-report').isVisible(),true);assert.match(await page.locator('#kvk-partial-notice').textContent(),/^Partial selection: 0 of up to 10/);assert.match(await page.locator('#kvk-skipped-notice').textContent(),/^100 entries skipped/);assert.match(await page.locator('#kvk-status').textContent(),/Scouting incomplete · 0\/0/);assert.equal(requests.filter(value=>value.body.details).length,0);
  for(const lang of ['en','ko','es','pt','fr','ar']){await page.evaluate(lang=>KSPreferences.setLanguage(lang),lang);assert.deepEqual(await page.evaluate(()=>KSPreferences.getMissing()),[]);assert.equal(await page.locator('#kvk-partial-notice').textContent(),await page.evaluate(()=>KSPreferences.text('Partial selection: {count} of up to 10 scoutable entries.',{count:0})));}
  await context.close();
 });
}finally{
 await browser?.close();await server.shutdown();await Deno.writeTextFile(output+'/scoutable-selection-browser-results.json',JSON.stringify({results,unexpected_remote_count:unexpected.length,browser_errors:errors,services_mocked:true,synthetic_fixtures:true,viewport_widths:[320,390,1440],languages:['en','ko','es','pt','fr','ar'],themes:['dark','light']},null,2)+'\n');
}
console.log('Artifacts: '+output);assert.equal(results.length,4);console.log('PASS 4 focused mocked scoutable-selection browser groups.');

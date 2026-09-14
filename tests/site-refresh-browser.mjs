// Local visual review only. All external requests are mocked; no production writes.
import {chromium} from 'npm:playwright@1.55.1';
import {strict as assert} from 'node:assert';
import {fileURLToPath} from 'node:url';
const repo=fileURLToPath(new URL('../',import.meta.url)).replaceAll('\\','/').replace(/\/$/,'');
const phase=Deno.env.get('REFRESH_PHASE')||'after',artifacts=repo+'/tests/site-refresh-artifacts',folder=artifacts+'/'+phase;await Deno.mkdir(folder,{recursive:true});
const baseline=JSON.parse(await Deno.readTextFile(repo+'/tests/fixtures/site-refresh-routes.json')),published=JSON.parse(await Deno.readTextFile(repo+'/tests/fixtures/transfer-published-settings.json')).settings;
const selectedRoutes=Deno.env.get('REFRESH_ROUTES')?.split(','),sourceRoot=Deno.env.get('REFRESH_SOURCE_ROOT')||repo;
const routes=baseline.routes.filter(r=>!r.redirect&&(!selectedRoutes||selectedRoutes.includes(r.route))),results=[],failures=[];
const includeRoute=route=>!selectedRoutes||selectedRoutes.includes(route);
const server=Deno.serve({hostname:'127.0.0.1',port:8772,onListen(){}},async req=>{let p=decodeURIComponent(new URL(req.url).pathname);if(p.includes('..'))return new Response('',{status:403});if(p.endsWith('/'))p+='index.html';try{return new Response(await Deno.readFile(sourceRoot+p),{headers:{'Content-Type':({html:'text/html',css:'text/css',js:'text/javascript',webp:'image/webp',svg:'image/svg+xml'})[p.split('.').at(-1)]||'application/octet-stream'}})}catch{return new Response('',{status:404})}});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
export async function setup(route,{width=390,theme='dark',lang='en',state='populated',longNames=false,imagesUnavailable=false,assigned=false,signedIn=route.startsWith('/admin/')||route==='/compare/'}={}){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage(),errors=[],calls=[];
 await context.addInitScript(({lang,theme})=>{localStorage.setItem('ks-language',lang);localStorage.setItem('ks-theme',theme)},{lang,theme});
 await page.clock.setFixedTime(new Date('2026-09-14T12:00:00Z'));page.on('pageerror',e=>errors.push(e.message));
 const days=[{id:'day-1',buff_type:'construction',label:'Construction',prep_day:1,buff_date:'2026-09-15'},{id:'day-2',buff_type:'research',label:'Research',prep_day:2,buff_date:'2026-09-16'},{id:'day-3',buff_type:'training',label:'Training',prep_day:3,buff_date:'2026-09-17'}];
 const displayName=longNames?'Sample governor with a very long multilingual name — قائد من المملكة 169 — Gouverneur de la communauté'.repeat(2):'Sample governor';
 const admin={user_id:'mock-admin',display_name:'Sample administrator',username:'sample-admin',player_id:null,is_active:true,must_change_password:false,can_manage_transfers:true,can_manage_users:true,can_manage_buffs:true,can_search_players:true};
 const player={player_id:'24649596',name:displayName,player_name:displayName,kingdom:169,alliance_abbr:'KRZ',alliance_name:'Sample alliance',power:123456789,town_center_level:30};
 await context.route('**/*',async route=>{
  const url=route.request().url();if(imagesUnavailable&&/\.(webp|png|svg|jpg)(?:\?|$)/.test(url))return route.abort();if(url.startsWith('http://127.0.0.1:8772/'))return route.continue();
  if(url.includes('supabase-js'))return route.fulfill({contentType:'text/javascript',body:`window.supabase={createClient(){return {auth:{async getSession(){return {data:{session:${signedIn?JSON.stringify({access_token:'mock-token',user:{id:'mock-admin'},expires_at:Date.parse('2026-09-14T13:00:00Z')/1000}):'null'}}}},onAuthStateChange(){return {data:{subscription:{unsubscribe(){}}}}},async signOut(){return {}},async updateUser(){return {data:{},error:null}}}}}};`});
  calls.push({url,method:route.request().method(),body:route.request().postData()});
  if(url.includes('/functions/v1/')){
   if(state==='loading')return new Promise(()=>{});
   if(state==='error')return route.fulfill({status:503,json:{ok:false,error:'Mock service temporarily unavailable'}});
   let body={};try{body=JSON.parse(route.request().postData()||'{}')}catch{}
   const application={id:'mock-application',player_id:player.player_id,player_name:player.name,alliance_abbr:'KRZ',kingdom:82,status:'submitted',power:player.power,town_center_level:30,transfer_passes:'12',reason:'Looking for a welcoming community and shared adventures.',notes:'Mock review data only.',submitted_at:'2026-09-14T01:00:00Z',reference:'MOCK-169-REVIEW'};
   let data={ok:true,profile:admin,player:{...player,player_id:body.player_id||player.player_id},admin:{display_name:admin.display_name,can_delete:true},event:{id:'event-1',name:'Mock KVK preparation',prep_code_enabled:true,prep_code:'MOCK-CODE'},days,access_code_valid:true,requests:[],applications:state==='empty'?[]:[application],admins:state==='empty'?[]:[{...admin,login_mode:'legacy_email',legacy_email:'review@example.invalid'}],events:state==='empty'?[]:[{action:'transfer.update',actor_display_name:admin.display_name,actor_player_id:player.player_id,created_at:'2026-09-14T01:00:00Z',target_type:'transfer',target_id:application.reference,details:{notes:'Sample review note'}}],summary:{events_today:12,events_7d:85,events_30d:240,unique_today:8,unique_7d:32,unique_30d:60,by_tool:state==='empty'?[]:[{tool:'player_search',count:85},{tool:'kingdom_compare',count:42}],by_action:[{action:'transfer.update',count:12}],daily:[{day:'2026-09-12',count:20},{day:'2026-09-13',count:35},{day:'2026-09-14',count:12}],recent:state==='empty'?[]:[{tool:'player_search',action:'search',created_at:'2026-09-14T01:00:00Z'}]},left:{kid:169,power:123456789,avg_power:123456,player_count:125,power_rank:20,alliance_count:6,age_days:350,health:'stable'},right:{kid:body.opponent||82,power:153456789,avg_power:153456,player_count:145,power_rank:18,alliance_count:8,age_days:370,health:'stable'},codes:state==='empty'?[]:[{code:'MOCKGIFT169'},{code:'MOCKTHANKYOU'}],redeemed:true,reference:'MOCK-169-REVIEW'};
   if(url.endsWith('/transfer-settings'))data={ok:true,settings:state==='empty'?null:published};
   if(url.endsWith('/admin-transfer-settings'))data={ok:true,draft:published,revision:1,is_published:true};
   if(url.endsWith('/admin-kings-buffs'))data.requests=state==='empty'?[]:[{id:'mock-request',buff_day_id:'day-1',player_name:player.name,player_id:player.player_id,alliance_abbr:'KRZ',status:assigned?'scheduled':'requested',assigned_time:assigned?'00:00':null,availability:['00:00','00:30','12:00'],town_center_level:30}];
   if(url.endsWith('/admin-player-search'))data={ok:true,player:{...player,alliance:{abbr:'KRZ',name:'Sample alliance'},online:true},gov_gear:{items:[{name:'Sample governor gear',quality:'Gold'}]},heroes:[{name:'Sample hero',level:30,stars:2,power:500000,gear:[{slot:'boots',enhancement_level:1,refine_level:2}]}],ranks:[{name:'Sample ranking',rank:12,value:12345}]};
   return route.fulfill({json:data});
  }
  // Optional image returned by a fixture: never fetch external decoration.
  return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="15" fill="#29425c"/><circle cx="40" cy="30" r="14" fill="#e8c57f"/><path d="M12 80V65a28 28 0 0 1 56 0v15" fill="#e8c57f"/></svg>'});
 });
 await page.goto('http://127.0.0.1:8772'+route,{waitUntil:'domcontentloaded'});await page.waitForSelector('.site-language-select');await page.waitForTimeout(state==='loading'?150:300);
 if(state==='populated'){
  if(route==='/compare/'){await page.waitForSelector('#comparison-controls:visible');await page.locator('#opponent').fill('82');await page.locator('#compare').click();await page.waitForSelector('#results:not(.hidden)')}
  if(route==='/gift-codes/'){await page.locator('#playerId').fill(player.player_id);await page.locator('#verify').click();await page.waitForSelector('#codesCard:not(.hidden)')}
  if(route==='/kings-buffs/'){await page.locator('#fid').fill(player.player_id);await page.locator('#find').click();await page.waitForSelector('#playerCard:visible');await page.locator('#continue').click();await page.locator('#accessCode').fill('MOCK-CODE');await page.locator('#saveCode').click();await page.waitForSelector('[data-slot]');await page.locator('[data-slot]').first().click()}
  if(route==='/rally/'){await page.locator('#rallyBody tr .name').first().fill('Sample rally leader');await page.locator('#rallyBody tr .march').first().fill('90');await page.locator('#rallyBody tr .name').nth(1).fill('Second rally leader');await page.locator('#rallyBody tr .march').nth(1).fill('60');await page.locator('#calcBtn').click();await page.waitForSelector('#resultCard:visible')}
  if(route==='/admin/player-search/'){await page.evaluate(p=>{renderPlayer(p);document.querySelector('#results').style.display='block'},{player:{...player,alliance:{abbr:'KRZ',name:'Sample alliance'},online:true},gov_gear:{items:[{name:'Sample governor gear',quality:'Gold'}]},heroes:[{name:'Sample hero',level:30,stars:2,power:500000,gear:[{slot:'boots',enhancement_level:1,refine_level:2}]}],ranks:[{name:'Sample ranking',rank:12,value:12345}]})}
 }
 return {page,context,errors,calls};
}
async function capture(route,options){const {page,context,errors,calls}=await setup(route,options);const key=(route==='/'?'home':route.slice(1,-1).replaceAll('/','-'))+'-'+(options.state||'populated')+'-'+options.width+'-'+(options.theme||'dark')+'-'+(options.lang||'en')+(options.signedIn===false?'-guest':'');
 const metrics=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,missing:KSPreferences.getMissing()}));
 if(phase==='after'&&metrics.scroll>metrics.width){failures.push(key+': overflow '+metrics.scroll);}
 if(errors.length)failures.push(key+': '+errors.join(', '));if(metrics.missing.length)failures.push(key+': missing translations '+metrics.missing.join(', '));
 await page.screenshot({path:folder+'/'+key+'.png',fullPage:true});results.push({key,route,...options,...metrics,errors,mockedRequests:calls.length});await context.close();console.log(phase+' '+key+' '+metrics.scroll+'/'+metrics.width);
}
export async function finish(){await browser.close();await server.shutdown()}
if(import.meta.main){
try{
 for(const {route} of routes)for(const width of [390,1440])await capture(route,{width});
 for(const route of ['/','/admin/','/compare/'].filter(includeRoute))for(const width of [390,1440])await capture(route,{width,state:'initial',signedIn:false});
 if(phase==='after'){
  for(const {route} of routes)for(const theme of ['dark','light'])await capture(route,{width:320,theme,lang:'ar'});
  for(const {route} of routes)await capture(route,{width:390,theme:'light',lang:'fr'});
  for(const route of ['/admin/','/admin/kings-buffs/','/admin/transfers/','/admin/usage/','/compare/','/transfer/'].filter(includeRoute))for(const state of ['empty','error','loading'])await capture(route,{width:390,state,theme:'light'});
 }
}finally{await browser.close();await server.shutdown();if(selectedRoutes){try{const previous=JSON.parse(await Deno.readTextFile(folder+'/results.json'));const retained=previous.results.filter(r=>!selectedRoutes.includes(r.route));results.unshift(...retained);failures.unshift(...previous.failures.filter(f=>retained.some(r=>f.startsWith(r.key+':'))))}catch(error){if(!(error instanceof Deno.errors.NotFound))throw error}}await Deno.writeTextFile(folder+'/results.json',JSON.stringify({phase,results,failures},null,2))}
if(failures.length)throw Error(failures.join('\n'));
console.log('Completed '+results.length+' local screenshots with mocked requests.');
}

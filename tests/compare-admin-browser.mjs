import {chromium} from 'npm:playwright@1.55.1';
import {strict as assert} from 'node:assert';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),results=[],artifacts=await Deno.makeTempDir({prefix:'compare-admin-tests-'});
const server=Deno.serve({hostname:'127.0.0.1',port:8771,onListen(){}},async req=>{let p=new URL(req.url).pathname;if(p.includes('..'))return new Response('',{status:403});if(p.endsWith('/'))p+='index.html';try{return new Response(await Deno.readFile(root+p),{headers:{'Content-Type':p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':'text/html'}})}catch{return new Response('',{status:404})}});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const session=(id='admin-a')=>({user:{id},access_token:'mock-'+id,expires_at:Date.parse('2026-09-14T13:00:00Z')/1000});
async function setup({signedIn=session(),profile={},status=200,authError=false,defer=false,width=390}={}){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage(),calls=[],errors=[];
 await page.clock.install({time:new Date('2026-09-14T12:00:00Z')});
 await context.addInitScript(({signedIn,authError})=>{window.mockSession=signedIn;window.mockAuthError=authError;window.signOutCalls=0},{signedIn,authError});
 page.on('pageerror',e=>errors.push(e.message));
 let resolveProfile;const wait=new Promise(r=>resolveProfile=r);
 await context.route('**/*',async route=>{
  const url=route.request().url();if(url.startsWith('http://127.0.0.1:8771/'))return route.continue();
  if(url.includes('supabase-js'))return route.fulfill({contentType:'text/javascript',body:`window.supabase={createClient(){return {auth:{async getSession(){return {data:{session:window.mockSession},error:window.mockAuthError?Error('network'):null}},onAuthStateChange(fn){window.authChange=(event,session)=>{window.mockSession=session;fn(event,session)};return {data:{subscription:{unsubscribe(){}}}}},async signOut(){window.signOutCalls++}}}}};`});
  calls.push({url,headers:route.request().headers(),body:route.request().postData()});
  if(url.endsWith('/admin-profile')){if(defer)await wait;const id=route.request().headers().authorization.replace('Bearer mock-','');return route.fulfill({status,json:{ok:true,profile:{user_id:id,is_active:true,must_change_password:false,player_id:null,can_manage_users:false,can_manage_transfers:false,can_manage_buffs:false,can_search_players:false,...profile}}})}
  if(url.endsWith('/kingdom-compare'))return route.fulfill({json:{ok:true,left:{kid:169},right:{kid:82}}});
  if(url.endsWith('/player-lookup'))return route.fulfill({json:{ok:true,player:{player_id:'12345678',name:'Visitor',kingdom:169}}});
  throw Error('Unexpected request '+url);
 });
 await page.goto('http://127.0.0.1:8771/compare/?state=82');return {page,context,calls,errors,resolveProfile};
}
async function open(page){await page.waitForSelector('#comparison-controls:visible');assert.equal(await page.locator('#player-access').isVisible(),false);assert.equal(await page.locator('#access-continue').isVisible(),false)}
async function guest(page){await page.waitForSelector('#player-access:visible');assert.equal(await page.locator('#comparison-controls').isVisible(),false)}
async function test(name,fn){await fn();results.push({name,passed:true});console.log('PASS '+name)}
try{
 await test('Legacy super-admin without ID, admin with ID, and admin without tool flags open directly',async()=>{
  for(const profile of [{can_manage_users:true},{player_id:'24649596'},{player_id:''}]){const {page,context,calls,errors}=await setup({profile});await open(page);await page.locator('#compare').click();await page.waitForSelector('#results:not(.hidden)');assert.equal(calls.filter(c=>c.url.endsWith('/player-lookup')).length,0);assert.equal(calls[0].headers.authorization,'Bearer mock-admin-a');assert.equal(await page.evaluate(()=>sessionStorage.getItem('ks169-compare-access-v1')),null);assert.deepEqual(errors,[]);await context.close()}
 });
 await test('Checking state hides the player form and request guards stay locked before backend validation',async()=>{
  const {page,context,calls,resolveProfile}=await setup({defer:true});assert.equal(await page.locator('#compare-auth').isVisible(),true);assert.equal(await page.locator('#player-access').isVisible(),false);await page.evaluate(()=>run());assert.equal(calls.filter(c=>c.url.endsWith('/kingdom-compare')).length,0);resolveProfile();await open(page);await context.close();
 });
 await test('Rejected, disabled, mismatched and malformed profiles cannot grant administrator access',async()=>{
  for(const fixture of [{status:403},{status:401},{profile:{is_active:false}},{profile:{user_id:'another-user'}},{profile:{must_change_password:null}}]){const {page,context}=await setup(fixture);await guest(page);assert.equal(await page.evaluate(()=>signOutCalls),0);await context.close()}
 });
 await test('Mandatory password change redirects to existing account flow without unlocking',async()=>{
  const {page,context,calls}=await setup({profile:{must_change_password:true}});await page.waitForURL('**/admin/account/?required=1');assert.equal(calls.filter(c=>c.url.endsWith('/player-lookup')).length,0);await context.close();
 });
 await test('Session expiry and sign-out revoke access, clear results and retain no admin storage approval',async()=>{
  for(const signOut of [true,false]){const {page,context,calls}=await setup();await open(page);await page.locator('#compare').click();await page.waitForSelector('#results:not(.hidden)');if(signOut){await page.evaluate(()=>authChange('SIGNED_OUT',null));await page.clock.runFor(1)}else await page.clock.fastForward(60*60*1000+1);await guest(page);assert.equal(await page.locator('#strength tr').count(),0);const count=calls.length;await page.evaluate(()=>run());assert.equal(calls.length,count);assert.equal(await page.evaluate(()=>sessionStorage.getItem('ks169-compare-access-v1')),null);await context.close()}
 });
 await test('Account switching and late authentication responses cannot resurrect old approval',async()=>{
  const {page,context}=await setup();await open(page);
  await page.evaluate(()=>{window.pendingAuth=[];window.fetch=(_url,options)=>new Promise(resolve=>pendingAuth.push({resolve,token:options.headers.Authorization}))});
  await page.evaluate(s=>authChange('SIGNED_IN',s),session('admin-b'));await page.clock.runFor(1);await guestHidden();
  await page.evaluate(()=>authChange('SIGNED_OUT',null));await page.clock.runFor(1);await guest(page);
  await page.evaluate(()=>pendingAuth[0].resolve(Response.json({ok:true,profile:{user_id:'admin-b',is_active:true,must_change_password:false}})));await guest(page);
  await page.evaluate(s=>authChange('SIGNED_IN',s),session('admin-c'));await page.clock.runFor(1);
  await page.evaluate(()=>pendingAuth[1].resolve(Response.json({ok:true,profile:{user_id:'admin-c',is_active:true,must_change_password:false}})));await open(page);await context.close();
  async function guestHidden(){assert.equal(await page.locator('#comparison-controls').isVisible(),false)}
 });
 await test('Authentication failure provides retry and visitor gate without global sign-out',async()=>{
  const {page,context}=await setup({authError:true});await guest(page);assert.equal(await page.locator('#compare-auth-retry').isVisible(),true);assert.equal(await page.evaluate(()=>signOutCalls),0);await page.evaluate(()=>window.mockAuthError=false);await page.locator('#compare-auth-retry').click();await open(page);await context.close();
  const failed=await setup({status:503});await guest(failed.page);assert.equal(await failed.page.locator('#compare-auth-retry').isVisible(),true);assert.equal(await failed.page.evaluate(()=>signOutCalls),0);await failed.context.close();
 });
 await test('Page restoration revalidates permissions and preserves independent guest approvals',async()=>{
  const {page,context}=await setup();await open(page);await page.evaluate(()=>{window.mockSession=null;window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))});await guest(page);
  await page.locator('#visitor-id').fill('12345678');await page.locator('#check-player').click();await page.waitForSelector('#access-profile:visible');await page.locator('#access-continue').click();const saved=await page.evaluate(()=>sessionStorage.getItem('ks169-compare-access-v1'));
  await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));await page.waitForSelector('#comparison-controls:visible');assert.equal(await page.evaluate(()=>sessionStorage.getItem('ks169-compare-access-v1')),saved);await context.close();
 });
 await test('Timed-out profile validation stays locked and late completion cannot grant access',async()=>{
  const {page,context,resolveProfile}=await setup({defer:true});await page.clock.fastForward(10001);await guest(page);assert.equal(await page.locator('#compare-auth-retry').isVisible(),true);resolveProfile();assert.equal(await page.locator('#comparison-controls').isVisible(),false);assert.equal(await page.evaluate(()=>signOutCalls),0);await context.close();
 });
 await test('Pending administrator comparison cannot restore results after sign-out',async()=>{
  const {page,context}=await setup();await open(page);await page.evaluate(()=>{window.fetch=()=>new Promise(resolve=>window.finishComparison=resolve)});await page.locator('#compare').click();await page.evaluate(()=>authChange('SIGNED_OUT',null));await page.clock.runFor(1);await guest(page);await page.evaluate(()=>finishComparison(Response.json({ok:true,left:{kid:169},right:{kid:82}})));assert.equal(await page.locator('#results').isVisible(),false);await context.close();
 });
 await test('Admin presentation works in six languages, both themes and mobile/desktop widths',async()=>{
  for(const width of [320,390,1440]){const {page,context,errors}=await setup({width});await open(page);for(const lang of ['en','ko','es','pt','fr','ar'])for(const theme of ['dark','light']){await page.evaluate(({lang,theme})=>{KSPreferences.setLanguage(lang);document.documentElement.dataset.theme=theme},{lang,theme});assert.deepEqual(await page.evaluate(()=>KSPreferences.getMissing()),[]);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))}await page.screenshot({path:artifacts+'/admin-'+width+'.png'});assert.deepEqual(errors,[]);await context.close()}
 });
}finally{await browser.close();await server.shutdown();await Deno.writeTextFile(artifacts+'/results.json',JSON.stringify(results,null,2));console.log('Artifacts: '+artifacts)}
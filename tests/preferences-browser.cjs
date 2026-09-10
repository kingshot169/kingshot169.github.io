const fs=require('fs'),http=require('http'),{spawn}=require('child_process'),path=require('path');
const root=process.cwd();
const server=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';p=path.resolve(root,'.'+p);if(!p.startsWith(root+path.sep)){res.writeHead(403).end();return}fs.readFile(p,(err,data)=>{res.writeHead(err?404:200,{'Content-Type':p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':'text/html'});res.end(err?'Not found':data)})});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await new Promise(r=>server.listen(8766,'127.0.0.1',r));
 const profile=path.join(process.env.TEMP,'ks-preferences-browser-'+Date.now());
 const chrome=spawn(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=9228','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:'ignore'});
 try{
 let targets;for(let i=0;i<30;i++){try{targets=await(await fetch('http://127.0.0.1:9228/json',{signal:AbortSignal.timeout(500)})).json();break}catch{await sleep(200)}}
 if(!targets)throw Error('Chrome debugging endpoint unavailable');
 const ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();
 function call(method,params={}){return new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))})}
 let signedIn=false,mustChange=false,missingDictionary=false,transferJourney=false,bookingRequests=[],requests=[];const errors=[];
 ws.addEventListener('message',async e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}
 if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);
 if(m.method==='Fetch.requestPaused'){
 const {requestId,request}=m.params;
 if(missingDictionary&&request.url.endsWith('/shared/translations.js'))await call('Fetch.fulfillRequest',{requestId,responseCode:404,body:''});
 else if(request.url.startsWith('http://127.0.0.1:8766/'))await call('Fetch.continueRequest',{requestId});
 else if(request.url.includes('supabase-js')){
 const sdk=`window.__loginFlashes=0;setInterval(()=>{const e=document.querySelector('#loginView');if(e&&getComputedStyle(e).display!=='none')window.__loginFlashes++},10);
 window.supabase={createClient(){return {auth:{
 async getSession(){await new Promise(r=>setTimeout(r,300));return {data:{session:${signedIn?'{access_token:"mock-token",user:{id:"mock-user"}}':'null'}}};},
 onAuthStateChange(){return {data:{subscription:{unsubscribe(){}}}};},
 async signOut(){return {};}
 }}}};`;
 new (require('vm').Script)(sdk);
 await call('Fetch.fulfillRequest',{requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'text/javascript'}],body:Buffer.from(sdk).toString('base64')});
 }
 else {
 requests.push({url:request.url,method:request.method,body:request.postData});
 await sleep(200);
 let payload={ok:true,event:{name:'Mock KVK'},days:[{id:'day-1',buff_type:'construction',label:'Construction',prep_day:1,buff_date:'2026-09-15'}],requests:[],applications:[],admins:[],events:[],rows:[],summary:{},access_code_valid:true,player:{name:'Admin',player_name:'Admin',player_id:'24649596',kingdom:169,alliance_abbr:'Save',alliance_name:'Search',power:12345,town_center_level:30},profile:{display_name:'Admin',must_change_password:mustChange,can_manage_transfers:true,can_search_players:true,can_manage_buffs:true,can_manage_users:true},left:{kid:169,power:1000},right:{kid:82,power:800}};
 payload.codes=[{code:'Admin'}];payload.redeemed=true;
 if(transferJourney)payload.player.kingdom=82;
 payload.reference='REF-Admin-169';
 if(signedIn){
   payload.admin={display_name:'Admin',can_delete:true};
   payload.admins=[{user_id:'mock-admin',display_name:'Admin',player_id:'24649596',alliance_abbr:'Save',login_mode:'legacy_email',legacy_email:'admin@example.invalid',is_active:true,can_search_players:true}];
   payload.events=[{action:'transfer.update',actor_display_name:'Admin',actor_player_id:'24649596',created_at:'2026-09-15T01:00:00Z',target_type:'transfer',target_id:'REF-Admin-169',details:{notes:'Save <Admin>'}}];
   payload.applications=[{id:'mock-application',player_name:'Admin',player_id:'24649596',alliance_abbr:'Save',alliance_name:'Search',kingdom:82,status:'submitted',power:12345,town_center_level:30,transfer_passes:'12',reason:'Save <Admin>',submitted_at:'2026-09-15T01:00:00Z',reference:'REF-Admin-169'}];
   payload.summary={by_tool:[{tool:'player_search',count:1}],by_action:[{action:'transfer.update',count:1}],recent:[{tool:'player_search',action:'transfer.update',created_at:'2026-09-15T01:00:00Z'}]};
   if(request.url.endsWith('/admin-kings-buffs'))payload.requests=[{id:'mock-request',buff_day_id:'day-1',player_name:'Admin',player_id:'24649596',status:'requested',availability:['00:00','00:30'],town_center_level:30}];
 }
 if(request.url.endsWith('/kings-buffs')){
   const body=JSON.parse(request.postData||'{}');
   if(body.buff_day_id)bookingRequests=[{id:'mock-booking',buff_day_id:body.buff_day_id,status:'requested',availability:body.availability}];
   payload.requests=bookingRequests;
 }
 await call('Fetch.fulfillRequest',{requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'application/json'},{name:'Access-Control-Allow-Origin',value:'*'},{name:'Access-Control-Allow-Headers',value:'*'},{name:'Access-Control-Allow-Methods',value:'GET,POST,OPTIONS'}],body:Buffer.from(JSON.stringify(payload)).toString('base64')});
 }
 }
 });
 await call('Page.enable');await call('Runtime.enable');await call('Fetch.enable',{patterns:[{urlPattern:'*'}]});
 async function evaluate(expression){const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value}
 async function navigate(url){const nav=await call('Page.navigate',{url:'http://127.0.0.1:8766'+url});for(let n=0;n<30;n++){await sleep(100);if(await evaluate('Boolean(window.KSPreferences && document.querySelector(".site-language-select"))'))return}throw Error(JSON.stringify({nav,page:await evaluate('({url:location.href,text:document.body?.innerText})')}))}
 const results=[];
 async function headerCheck(){
   const row=await evaluate(`(()=>{const h=document.querySelector('.site-preferences-header'),n=h.querySelector('[data-site-nav]'),c=h.querySelector('.site-controls');const r=h.getBoundingClientRect();return {path:location.pathname,count:document.querySelectorAll('[data-site-nav]').length,styled:h.querySelectorAll('.site-header-nav-link').length,first:h.firstElementChild===n,href:n.getAttribute('href'),unblocked:[n,...c.querySelectorAll('select,button')].every(e=>{const b=e.getBoundingClientRect();return e.contains(document.elementFromPoint(b.x+b.width/2,b.y+b.height/2))}),contained:[n,c].every(e=>{const b=e.getBoundingClientRect();return b.left>=r.left-1&&b.right<=r.right+1&&b.bottom<=r.bottom+1}),titleClear:[...document.querySelectorAll('h1')].filter(e=>e.getClientRects().length).every(e=>e.getBoundingClientRect().top>=r.bottom-1),legacy:!!document.querySelector('#dashboard a[href="../"]')}})()`);
   const source=fs.readFileSync(path.join(root,row.path,'index.html'),'utf8');
   const expected=source.match(/<a\b[^>]*data-site-nav[^>]*>/)[0].match(/href="([^"]+)"/)[1];
   require('assert/strict').deepEqual(row,{path:row.path,count:1,styled:1,first:true,href:expected,unblocked:true,contained:true,titleClear:true,legacy:false});
   return row;
 }
 async function homepageCheck(authenticated){
   await navigate('/');await sleep(650);
   require('assert/strict').equal(await evaluate(`(()=>{const n=document.querySelector('#adminLink');for(const language of ['en','fr','ar']){KSPreferences.setLanguage(language);KSPreferences.mount();if(n!==document.querySelector('#adminLink')||n.textContent!==KSPreferences.text('${authenticated?'Admin':'Admin Login'}'))return false}return n.getAttribute('aria-busy')!=='true'&&n.getAttribute('aria-label')===KSPreferences.text('Open admin area')})()`),true,'Session-aware homepage navigation');
   await headerCheck();
 }
 await homepageCheck(false);
 await navigate('/');await evaluate(`localStorage.setItem('ks-language','es');KSPreferences.setLanguage('es')`);
 const routes=['/','/rally/','/transfer/','/kings-buffs/','/compare/','/gift-codes/','/admin/','/admin/account/','/admin/audit/','/admin/kings-buffs/','/admin/player-search/','/admin/transfers/','/admin/usage/','/admin/users/','/transfer/admin/'];
 for(const route of routes){await navigate(route);results.push({route,...await evaluate(`({url:location.pathname,language:document.documentElement.lang,selector:document.querySelector('.site-language-select')?.value,headers:document.querySelectorAll('.site-preferences-header').length,nav:document.querySelector('[data-site-nav]')?.getAttribute('href'),missing:KSPreferences.getMissing(),unmarked:[...document.querySelectorAll('body *')].filter(e=>!e.closest('script,style,[translate="no"],[data-ks-text],.site-controls,[data-i18n]')).flatMap(e=>[...e.childNodes].filter(n=>n.nodeType===3&&/[A-Za-z]{2}/.test(n.textContent)).map(n=>n.textContent.trim()))})`)})}
 await navigate('/transfer/');
 results.push({state:await evaluate(`(()=>{const input=document.querySelector('#fid');input.value='12345678';const ref=input;for(let i=0;i<20;i++){KSPreferences.setLanguage(i%2?'ar':'fr');KSPreferences.setLanguage(KSPreferences.getLanguage());document.querySelector('.site-theme-toggle').click()}KSPreferences.setLanguage('es');return {value:input.value,sameNode:ref===document.querySelector('#fid'),lang:document.documentElement.lang,theme:document.documentElement.dataset.theme}})()`)});
 results.push({dynamic:await evaluate(`(()=>{const host=document.createElement('div');document.body.append(host);host.innerHTML='<strong translate="no">Admin</strong><span data-ks-text="Loading…">Loading…</span>';return new Promise(resolve=>setTimeout(()=>{const first=host.querySelector('span').textContent;KSPreferences.setLanguage('fr');resolve({first,second:host.querySelector('span').textContent,name:host.querySelector('strong').textContent})},50))})()`)});
 results.push({messages:await evaluate(`(()=>{
   const host=document.createElement('div');document.body.append(host);
   const own=document.createElement('p'),unknown=document.createElement('p'),input=document.createElement('input');host.append(own,unknown,input);input.required=true;
   KSPreferences.setError(own,KSPreferences.apiError(null,'Player lookup failed'));
   const raw='<img src=x onerror=alert(1)> Admin';KSPreferences.setError(unknown,KSPreferences.apiError(raw,'Player lookup failed'));
   const rows=[];for(const language of ['ko','es','pt','fr','ar']){KSPreferences.setLanguage(language);input.checkValidity();rows.push({language,error:own.textContent,expected:KSPreferences.text('Player lookup failed'),validation:input.validationMessage,validationExpected:KSPreferences.text('Please complete this field.'),one:KSPreferences.text('{count} days',{count:1}),two:KSPreferences.text('{count} days',{count:2}),unknown:unknown.textContent,safe:unknown.children.length===0})}
   KSPreferences.setLanguage('en');const english=[KSPreferences.text('{count} days',{count:1}),KSPreferences.text('{count} days',{count:2})];input.value='Admin';input.dispatchEvent(new Event('input',{bubbles:true}));const valid=input.checkValidity();host.remove();return {rows,english,valid,raw};
 })()`)});
 transferJourney=true;await navigate('/transfer/');await evaluate(`KSPreferences.setLanguage('es');document.querySelector('#fid').value='24649596';document.querySelector('#find').click()`);await sleep(800);
 results.push({transferForm:await evaluate(`(()=>{document.querySelector('#continue').click();const f=document.querySelector('#form');for(const e of f.elements){if(e.type==='checkbox')e.checked=true;else if(e.name)e.value=e.name==='passes'?'12':'Admin <Save>'}const original=[...f.elements].map(e=>[e.name,e.value,e.checked]);KSPreferences.setLanguage('fr');return {same:original.every((v,i)=>v[1]===f.elements[i].value&&v[2]===f.elements[i].checked),name:document.querySelector('#pName').textContent}})()`)});
 await evaluate(`document.querySelector('#form').requestSubmit()`);await sleep(800);
 results.push({transferSuccess:await evaluate(`(()=>{const e=document.querySelector('#successMessage');KSPreferences.setLanguage('es');const es=e.textContent;KSPreferences.setLanguage('ar');return {es,ar:e.textContent,name:e.textContent.includes('Admin'),reference:document.querySelector('#successRef').textContent,visible:getComputedStyle(document.querySelector('#successCard')).display!=='none',same:e===document.querySelector('#successMessage')}})()`)});transferJourney=false;
 const layouts=[];for(const width of [1280,375,188])for(const theme of ['light','dark']){await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});await evaluate(`document.documentElement.dataset.theme='${theme}';KSPreferences.setLanguage('fr')`);layouts.push({width,theme,...await evaluate(`(()=>{const c=document.querySelector('.site-controls').getBoundingClientRect(),n=document.querySelector('.site-header-nav-link').getBoundingClientRect();return {balanced:Math.abs(n.left-document.querySelector(".site-preferences-header").getBoundingClientRect().left)<1&&Math.abs(c.right-document.querySelector(".site-preferences-header").getBoundingClientRect().right)<1&&(n.right<=c.left||n.bottom<=c.top)&&n.top<=c.top,right:n.right<=innerWidth,scrollWidth:document.documentElement.scrollWidth}})()`)})}
 results.push({layouts});
 await call('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
 await navigate('/kings-buffs/');
 await evaluate(`document.querySelector('#fid').value='24649596';document.querySelector('#find').click()`);await sleep(800);
 await evaluate(`document.querySelector('#continue').click();document.querySelector('#accessCode').value='MOCK-CODE';document.querySelector('#saveCode').click()`);await sleep(1000);
 results.push({booking:await evaluate(`(()=>{const slot=document.querySelector('[data-slot]');if(!slot)return {error:document.body.innerText};slot.click();const first=document.querySelector('#buffPanel'),value=document.querySelector('#accessCode').value;KSPreferences.setLanguage('es');const es=document.querySelector('#currentCount').textContent;KSPreferences.setLanguage('fr');document.querySelector('.site-theme-toggle').click();return {samePanel:first===document.querySelector('#buffPanel'),selected:document.querySelectorAll('.time.selected').length,code:document.querySelector('#accessCode').value===value,name:document.querySelector('#pName').textContent,es,fr:document.querySelector('#currentCount').textContent,utc:document.querySelector('#buffPanel').textContent.includes('UTC')}})()`)});
 await evaluate(`document.querySelector('#applyCurrent').click()`);await sleep(900);
 results.push({bookingSubmitted:await evaluate(`(()=>{KSPreferences.setLanguage('es');return {feedback:document.querySelector('#submitMsg').textContent,editable:!!document.querySelector('#editAvailability'),utc:document.querySelector('#buffPanel').textContent.includes('UTC')}})()`)});
 results.push({bookingEdit:await evaluate(`(()=>{document.querySelector('#editAvailability').click();const button=document.querySelector('#applyCurrent'),slots=[...document.querySelectorAll('[data-slot]')];slots.find(e=>!e.classList.contains('selected')).click();const selected=slots.filter(e=>e.classList.contains('selected')).map(e=>e.dataset.slot);KSPreferences.setLanguage('ko');return {sameButton:button===document.querySelector('#applyCurrent'),sameSelection:JSON.stringify(selected)===JSON.stringify([...document.querySelectorAll('.time.selected')].map(e=>e.dataset.slot)),count:selected.length,label:button.textContent}})()`)});
 await evaluate(`document.querySelector('#applyCurrent').click()`);await sleep(900);
 results.push({bookingUpdated:await evaluate(`(()=>{KSPreferences.setLanguage('fr');return {feedback:document.querySelector('#submitMsg').textContent,editable:!!document.querySelector('#editAvailability'),utc:document.querySelector('#buffPanel').textContent.includes('UTC')}})()`)});
 await navigate('/compare/');await evaluate(`document.querySelector('#opponent').value='82';document.querySelector('#compare').click()`);await sleep(800);
 results.push({comparison:await evaluate(`(()=>{const cell=document.querySelector('#strength th'),before=cell?.textContent;KSPreferences.setLanguage('es');return {before,after:cell?.textContent,sameCell:cell===document.querySelector('#strength th'),value:document.querySelector('#opponent').value}})()`)});
 await navigate('/rally/');await evaluate(`(()=>{const rows=document.querySelectorAll('#rallyBody tr');rows[0].querySelector('.name').value='Admin';rows[0].querySelector('.march').value='90';rows[1].querySelector('.name').value='Search';rows[1].querySelector('.march').value='30';document.querySelector('#calcBtn').click();document.querySelector('#startBtn').click()})()`);await sleep(250);
 results.push({timer:await evaluate(`(async()=>{const before=document.querySelector('#hudTime').textContent;KSPreferences.setLanguage('ar');document.querySelector('.site-theme-toggle').click();await new Promise(r=>setTimeout(r,250));return {live:document.body.classList.contains('live-mode'),before,after:document.querySelector('#hudTime').textContent,headerHidden:getComputedStyle(document.querySelector('.site-preferences-header')).display==='none',name:document.querySelector('#hudName').textContent}})()`)});
 results.push({rallySummary:await evaluate(`(()=>{const preview=document.querySelector('#orderPreview'),before=preview.textContent;KSPreferences.setLanguage('fr');return {before,after:preview.textContent,same:preview===document.querySelector('#orderPreview'),names:preview.textContent.includes('Admin')&&preview.textContent.includes('Search'),live:document.body.classList.contains('live-mode')}})()`)});
 signedIn=true;await homepageCheck(true);await navigate('/admin/');await sleep(900);
 results.push({admin:await evaluate(`({loginFlashes:window.__loginFlashes,dashboard:getComputedStyle(document.querySelector('#dashboard')).display,cards:document.querySelectorAll('#tools a').length,name:document.querySelector('#identity').textContent})`)});
 const adminLayouts=[];for(const route of routes.filter(x=>x.startsWith('/admin/'))){await navigate(route);await sleep(600);for(const width of [1280,375,188]){await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});adminLayouts.push({route,width,...await evaluate(`(()=>{const c=document.querySelector('.site-controls').getBoundingClientRect(),n=document.querySelector('.site-header-nav-link').getBoundingClientRect();return {balanced:Math.abs(n.left-document.querySelector(".site-preferences-header").getBoundingClientRect().left)<1&&Math.abs(c.right-document.querySelector(".site-preferences-header").getBoundingClientRect().right)<1&&(n.right<=c.left||n.bottom<=c.top)&&n.top<=c.top,right:n.right<=innerWidth,language:document.documentElement.lang}})()`)})}}results.push({adminLayouts});
 const adminMessages=[];
 for(const route of ['/admin/users/','/admin/transfers/','/admin/kings-buffs/','/admin/audit/','/admin/usage/','/admin/player-search/']){
   await navigate(route);await sleep(650);
   if(route==='/admin/player-search/')await evaluate(`renderPlayer({player:{name:'Admin',player_id:'24649596',kingdom:169,alliance:{abbr:'Save',name:'Search'},online:true},gov_gear:{items:[{name:'Admin',quality:'Gold'}]},heroes:[{name:'Search',level:1,stars:2,power:500,gear:[{slot:'boots',enhancement_level:1,refine_level:2}]}],ranks:[{name:'Save',rank:1}]});document.querySelector('#results').style.display='block'`);
   adminMessages.push({route,...await evaluate(`(()=>{const controls=[...document.querySelectorAll('input,select,button')],values=controls.map(e=>[e.value,e.checked,e.onclick]);const text=document.querySelector('[data-perm]')||document.querySelector('[data-status-id]')||document.querySelector('[data-status]');if(text){if(text.type==='checkbox')text.checked=!text.checked;else text.value='reviewing'}const edited=text?.type==='checkbox'?text.checked:text?.value;const languages=[];for(const language of ['ko','es','pt','fr','ar']){KSPreferences.setLanguage(language);languages.push({language,missing:KSPreferences.getMissing()})}return {sameControls:controls.every(e=>e.isConnected),sameHandlers:controls.every((e,i)=>e.onclick===values[i][2]),editedPreserved:!text||(text.type==='checkbox'?text.checked:text.value)===edited,languages,rawNames:document.body.textContent.includes('Admin'),utc:document.body.textContent.includes('UTC'),unmarked:[...document.querySelectorAll('body *')].filter(e=>!e.closest('script,style,[translate="no"],[data-ks-text],.site-controls,[data-i18n]')).flatMap(e=>[...e.childNodes].filter(n=>n.nodeType===3&&/[A-Za-z]{2}/.test(n.textContent)).map(n=>n.textContent.trim()))}})()`)});
 }results.push({adminMessages});
 mustChange=true;await navigate('/admin/');await sleep(900);results.push({mandatoryPassword:await evaluate('location.pathname+location.search')});mustChange=false;
 await navigate('/transfer/');await evaluate(`KSPreferences.setLanguage('pt')`);await call('Page.reload');await sleep(600);results.push({reload:await evaluate(`({lang:document.documentElement.lang,selector:document.querySelector('.site-language-select').value})`)});
 await navigate('/compare/');await evaluate(`KSPreferences.setLanguage('ko')`);await evaluate('history.back()');await sleep(600);results.push({back:await evaluate(`({path:location.pathname,lang:document.documentElement.lang,selector:document.querySelector('.site-language-select').value})`)});
 await headerCheck();await evaluate('history.forward()');await sleep(600);results.push({forward:await evaluate(`({path:location.pathname,lang:document.documentElement.lang,selector:document.querySelector('.site-language-select').value})`)});
 await headerCheck();results.push({errors,requests});
 const allLayouts=[];
 for(const route of routes){await navigate(route);for(const theme of ['light','dark'])for(const width of [1280,375])for(const zoom of [1,2])for(const language of ['fr','ar']){
 await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
 allLayouts.push({route,theme,width,zoom,language,...await evaluate(`(()=>{document.documentElement.style.zoom='${zoom}';document.documentElement.dataset.theme='${theme}';KSPreferences.setLanguage('${language}');const c=document.querySelector('.site-controls').getBoundingClientRect(),n=document.querySelector('.site-header-nav-link').getBoundingClientRect();return {balanced:Math.abs(n.left-document.querySelector(".site-preferences-header").getBoundingClientRect().left)<1&&Math.abs(c.right-document.querySelector(".site-preferences-header").getBoundingClientRect().right)<1&&(n.right<=c.left||n.bottom<=c.top)&&n.top<=c.top,right:n.right<=innerWidth+1}})()`)});
 await headerCheck();}}results.push({allLayouts});
 await navigate('/gift-codes/');await evaluate(`KSPreferences.setLanguage('es');document.querySelector('#playerId').value='24649596';document.querySelector('#verify').click()`);await sleep(1200);await evaluate(`document.querySelector('[data-code]').click()`);await sleep(600);results.push({redemption:await evaluate(`(()=>{KSPreferences.setLanguage('fr');const b=document.querySelector('[data-code]');return {disabled:b.disabled,label:b.textContent,code:b.dataset.code,name:document.querySelector('#playerName').textContent}})()`)});
 await navigate('/transfer/');await evaluate(`document.documentElement.style.zoom='1'`);
 for(let i=0;i<10;i++){const rect=await evaluate(`(()=>{const r=document.querySelector('.site-language-select').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...rect});await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...rect});await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27})}
 results.push({menu:await evaluate(`(()=>{document.querySelector('#fid').focus();return {focused:document.activeElement.id,bodyOverflow:getComputedStyle(document.body).overflow,headers:document.querySelectorAll('.site-preferences-header').length}})()`)});
 missingDictionary=true;await navigate('/compare/');results.push({fallback:await evaluate(`(()=>{KSPreferences.setLanguage('ar');document.querySelector('#opponent').value='82';return {label:document.querySelector('#compare').textContent,value:document.querySelector('#opponent').value,lang:document.documentElement.lang,englishFallback:[...document.querySelectorAll('.section-title')].some(e=>e.textContent==='Kingdom Strength')}})()`)});
 fs.writeFileSync('tests/preferences-results.json',JSON.stringify(results,null,2));
 const assert=require('assert/strict'),get=key=>results.find(x=>Object.hasOwn(x,key))[key];
 assert.equal(errors.length,0,'Browser exceptions');
 assert.equal(allLayouts.filter(x=>!x.balanced||!x.right).length,0,'Header layout');
 assert.equal(get('booking').selected,1);assert.equal(get('booking').samePanel,true);assert.equal(get('booking').name,'Admin');
 assert.equal(get('comparison').sameCell,true);assert.equal(get('timer').live,true);assert.equal(get('timer').headerHidden,true);
 assert.equal(get('admin').loginFlashes,0);assert.equal(get('admin').cards,6);assert.equal(get('mandatoryPassword'),'/admin/account/?required=1');
 assert.equal(get('redemption').disabled,true);assert.equal(get('redemption').code,'Admin');assert.equal(get('menu').focused,'fid');
 assert.equal(get('back').lang,'ko');assert.equal(get('forward').lang,'ko');assert.equal(get('reload').lang,'pt');
 assert.equal(get('fallback').englishFallback,true);
 for(const row of get('messages').rows){assert.equal(row.error,row.expected);assert.equal(row.validation,row.validationExpected);assert.equal(row.unknown,get('messages').raw);assert.equal(row.safe,true);assert(!/[{}]/.test(row.one+row.two));assert.notEqual(row.error,'Player lookup failed')}
 assert.deepEqual(get('messages').english,['1 day','2 days']);assert.equal(get('messages').valid,true);
 assert.equal(get('transferForm').same,true);assert.equal(get('transferSuccess').visible,true);assert.equal(get('transferSuccess').same,true);assert.equal(get('transferSuccess').reference,'REF-Admin-169');assert.equal(get('transferSuccess').name,true);assert.notEqual(get('transferSuccess').es,get('transferSuccess').ar);
 assert.equal(get('bookingSubmitted').editable,true);assert.equal(get('bookingEdit').sameButton,true);assert.equal(get('bookingEdit').sameSelection,true);assert.equal(get('bookingEdit').count,2);assert.equal(get('bookingUpdated').editable,true);assert.equal(get('bookingUpdated').utc,true);
 assert.equal(get('rallySummary').same,true);assert.equal(get('rallySummary').names,true);assert.equal(get('rallySummary').live,true);assert.notEqual(get('rallySummary').before,get('rallySummary').after);
 const transferPayload=JSON.parse(requests.find(r=>r.url.endsWith('/submit-transfer')&&r.body)?.body||'null');assert.equal(transferPayload.reason,'Admin <Save>');assert.equal(transferPayload.player_id,'24649596');assert.equal(transferPayload.transfer_passes,'12');
 const updatePayload=requests.map(r=>{try{return JSON.parse(r.body)}catch{return null}}).find(r=>r?.action==='update_availability');assert.equal(updatePayload.access_code,'MOCK-CODE');assert.equal(updatePayload.availability.length,2);
 for(const row of adminMessages){assert.equal(row.sameControls,true,row.route);assert.equal(row.sameHandlers,true,row.route);assert.equal(row.editedPreserved,true,row.route);if(row.route==='/admin/usage/')assert(row.unmarked.includes('transfer.update'),'API action preserved');else assert.equal(row.rawNames,true,row.route);for(const language of row.languages)assert.deepEqual(language.missing,[],row.route+': '+language.language)}
 assert(get('transferSuccess').es.startsWith('Gracias, Admin.'));assert(get('bookingUpdated').feedback.includes('Disponibilités pour Construction mises à jour.'));assert(get('rallySummary').after.includes('Marche la plus lente : 90s'));
 for(const row of results.filter(x=>x.route)){assert.equal(row.headers,1);assert.equal(row.language,'es');assert.equal(row.selector,'es')}
 console.log(JSON.stringify({routes:routes.length,errors:errors.length,layoutFailures:allLayouts.filter(x=>!x.balanced||!x.right),checks:results.filter(x=>!x.route&&!x.layouts&&!x.adminLayouts&&!x.allLayouts&&!x.errors)}));ws.close();
 }finally{chrome.kill();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});

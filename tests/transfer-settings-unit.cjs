const assert=require('assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const {validateContent,publicContent,boundedJSON,fixture,empty,database,ts,source}=require('./transfer-settings-fixture.cjs');
const plain=v=>JSON.parse(JSON.stringify(v));
const auth={authorization:'Bearer mock','content-type':'application/json',origin:'https://kingshot169.github.io'};
const request=(body,headers=auth)=>new Request('https://example.invalid/admin-transfer-settings',{method:'POST',headers,body:JSON.stringify(body)});
(async()=>{
 const program=ts.createProgram([source],{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,noEmit:true,strict:true,lib:['lib.es2022.d.ts','lib.dom.d.ts','lib.dom.iterable.d.ts']});
 const diagnostics=ts.getPreEmitDiagnostics(program);assert.equal(diagnostics.length,0,ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCurrentDirectory:()=>process.cwd(),getCanonicalFileName:x=>x,getNewLine:()=> '\n'}));
 const content=fixture();assert.deepEqual(plain(validateContent(content)),content);
 const visible=publicContent({...content,updater_user_id:'private',private_notes:'never public'});assert.equal(visible.contacts.length,1);assert(!JSON.stringify(visible).includes('private'));assert.equal(visible.ordinary_places_remaining,0);assert.equal(visible.entry_power_cap,null);
 assert.equal(visible.recruitment_message,content.recruitment_message);
 for(const value of ['javascript:alert(1)','http://discord.gg/test','https://discord.gg.evil.test/test','https://user:pass@discord.gg/test','https://discord.com/channels/123','https://discord.gg/test?redirect=evil','https://discord.gg/../test','https://discord.gg\\@evil.test/test']){
   assert.throws(()=>validateContent({...content,discord_url:value}),value);
 }
 for(const discord_url of ['https://discord.gg/state169','https://discord.com/invite/state169'])assert.equal(validateContent({...content,discord_url}).discord_url,discord_url);
 for(const patch of [{entry_power_cap:-1},{ordinary_places_remaining:''},{contacts:Array(9).fill(content.contacts[0])},{recruitment_message:'a'.repeat(10001)},{kingdom_from:235,kingdom_to:116},{ordinary_capacity:1,ordinary_places_remaining:2},{contacts:[{...content.contacts[0],player_id:'1e8'}]},{contacts:[{...content.contacts[0],availability:'evenings'}]},{starts_at:'2026-02-30T00:00:00Z'},{starts_at:'2026-09-19T00:00:00Z',ends_at:'2026-09-13T00:00:00Z'}])assert.throws(()=>validateContent({...content,...patch}));
 assert.equal(validateContent({...content,starts_at:'2026-09-13T00:00:00Z',pre_transfer_starts_at:'2026-09-13T00:00:00Z',invitational_starts_at:'2026-09-16T00:00:00Z',open_transfer_starts_at:'2026-09-18T00:00:00Z',ends_at:'2026-09-19T23:59:59Z'}).ends_at,'2026-09-19T23:59:59Z');
 await assert.rejects(()=>boundedJSON(new Request('https://example.invalid',{method:'POST',headers:{'content-type':'application/json','content-length':'1'},body:'a'.repeat(131073)})),e=>e.status===413);
 const db=database();
 for(const condition of ['anonymous','authenticated','active','permitted','mustChange']){
   db.state.authenticated=true;db.state.active=true;db.state.permitted=true;db.state.mustChange=false;
   if(condition==='authenticated')db.state.authenticated=false;
   if(condition==='active')db.state.active=false;if(condition==='permitted')db.state.permitted=false;if(condition==='mustChange')db.state.mustChange=true;
   for(const action of ['save','publish','unpublish']){const response=await db.admin(request({action,revision:0,...(action==='save'?{content}:{})},condition==='anonymous'?{'content-type':'application/json'}:auth));assert([401,403].includes(response.status),condition+action)}
   for(const suffix of ['','?suggested=1']){const read=await db.admin(new Request('https://example.invalid'+suffix,{headers:condition==='anonymous'?{}:auth}));assert([401,403].includes(read.status));}
 }Object.assign(db.state,{authenticated:true,active:true,permitted:true,mustChange:false});
 assert.equal((await db.admin(new Request('https://example.invalid?suggested=1',{headers:auth}))).status,200);assert.equal(db.state.revision,0);assert.equal(db.state.draft,null);
 assert.equal((await db.admin(request({action:'save',revision:0,content}))).status,200);
 assert.equal((await (await db.public(new Request('https://example.invalid'))).json()).settings,null);
 assert.equal((await db.admin(request({action:'publish',revision:1}))).status,200);
 assert.equal((await (await db.public(new Request('https://example.invalid'))).json()).settings.contacts.length,1);
 assert.equal((await db.admin(request({action:'save',revision:2,content:{...content,headline:'New draft'}}))).status,200);
 assert.equal((await (await db.public(new Request('https://example.invalid'))).json()).settings.headline,content.headline);
 for(const action of ['save','publish','unpublish'])assert.equal((await db.admin(request({action,revision:1,...(action==='save'?{content}:{})}))).status,409);
 assert.equal((await db.admin(request({action:'unpublish',revision:3}))).status,200);
 assert.equal((await (await db.public(new Request('https://example.invalid'))).json()).settings,null);
 assert.equal(db.state.audits.length,4);assert(!JSON.stringify(db.state.audits).includes(content.recruitment_message));
 assert.equal((await db.admin(request({action:'delete',revision:4}))).status,400);
 assert.equal((await db.public(request({action:'save',revision:4,content}))).status,405);
 assert.equal((await db.admin(request({action:'save',revision:4,content},{...auth,origin:'https://evil.test'}))).status,403);
 db.state.rateAllowed=false;assert.equal((await db.admin(request({action:'save',revision:4,content}))).status,429);
 db.state.rpcError=true;assert.equal((await db.admin(new Request('https://example.invalid',{headers:auth}))).status,503);
 const dictionaries={window:{dispatchEvent(){}},Event:function(){}};vm.runInNewContext(fs.readFileSync('shared/translations.js','utf8'),dictionaries);
 const customContext={window:{}};vm.runInNewContext(fs.readFileSync('shared/transfer-recruitment.js','utf8'),customContext);
 const keys=[...customContext.window.KSRecruitment.fields,...customContext.window.KSRecruitment.contactFields].map(row=>row[1]);
 for(const language of ['ko','es','pt','fr','ar'])for(const key of keys)assert(dictionaries.window.KSTranslations[language][key],language+': '+key);
 console.log('PASS: strict TypeScript check; bounded JSON, URL/date/number/contact validation; auth/permission/password/CORS/method checks; draft isolation, public allowlist, revision conflicts and rate limits using mocked RPCs. PostgreSQL execution is not covered by this mock.');
})().catch(error=>{console.error(error);process.exitCode=1});

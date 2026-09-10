const fs=require('fs'),vm=require('vm'),path=require('path');
function typescript(){if(process.env.TYPESCRIPT_PATH)return require(process.env.TYPESCRIPT_PATH);try{return require('typescript')}catch{}
 const root=path.join(process.env.LOCALAPPDATA||'','Programs/Microsoft VS Code');for(const dir of ['',...fs.readdirSync(root)]){const file=path.join(root,dir,'resources/app/extensions/node_modules/typescript/lib/typescript.js');if(fs.existsSync(file))return require(file)}throw Error('Set TYPESCRIPT_PATH');}
const ts=typescript();
const source=path.resolve('../kingshot169-backend/supabase/functions/_shared/transfer-settings.ts');
const exportsObject={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(source,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText,{exports:exportsObject,URL,Response,Request,TextDecoder,TextEncoder,crypto,Uint8Array});
const context={window:{}};vm.runInNewContext(fs.readFileSync('shared/transfer-recruitment.js','utf8'),context);
function empty(){return JSON.parse(JSON.stringify(context.window.KSRecruitment.empty()))}
function fixture(){
 const content=empty();content.headline='Recruitment <Admin>';content.recruitment_message='English draft <img src=x onerror=alert(1)>\n\nSecond paragraph';
 content.contact_message='Talk to the team.';content.ordinary_places_remaining=0;
 content.contacts=[{name:'Contact <Admin>',player_id:'12345678901234567890',alliance:'KRZ',role:'State contact',languages:'English',availability:'18:00–22:00 UTC',visible:true,is_transfer_manager:false},
 {name:'Private contact',player_id:'12345678',alliance:'',role:'',languages:'',availability:'',visible:false,is_transfer_manager:false}];return content;
}
function database(){
 const state={revision:0,draft:null,published:null,active:true,permitted:true,mustChange:false,authenticated:true,rateAllowed:true,rpcError:false,audits:[],publicReads:0,adminReads:0};
 const admin={from(table){let userId;return {select(){return this},eq(k,v){userId=v;return this},async single(){
   if(table==='admin_profiles')return {data:state.active===null?null:{is_active:state.active,can_manage_transfers:state.permitted,must_change_password:state.mustChange}};
   state.publicReads++;return {data:{published:state.published}};
 }}},async rpc(name,args){
   if(state.rpcError)return {error:{message:'database unavailable'}};
   if(name==='check_public_rate_limit')return {data:[{allowed:state.rateAllowed}]};
   if(!state.active||!state.permitted||state.mustChange)return {data:{code:'access_denied',status:403}};
   if(args.p_action==='read')state.adminReads++;
   else{
     if(args.p_revision!==state.revision)return {data:{code:'stale_revision',status:409}};
     if(args.p_action==='save')state.draft=structuredClone(args.p_content);
     if(args.p_action==='publish'){if(!state.draft)return {data:{code:'no_draft',status:400}};state.published=structuredClone(state.draft)}
     if(args.p_action==='unpublish')state.published=null;
     state.revision++;state.audits.push({actor:args.p_actor,action:args.p_action,revision:state.revision});
   }
   return {data:{revision:state.revision,draft:structuredClone(state.draft),is_published:state.published!==null}};
 }};
 const createClient=(_url,key)=>key==='service'?admin:{auth:{getUser:async()=>({data:{user:state.authenticated?{id:'mock-admin'}:null}})}};
 const env={url:'https://example.invalid',anon:'anon',service:'service',salt:'unit-test-only-salt',suggested:{...empty(),headline:'Suggested fixture'}};
 return {state,admin:exportsObject.settingsHandler(createClient,env),public:exportsObject.settingsHandler(createClient,env,true)};
}
module.exports={...exportsObject,empty,fixture,database,ts,source};

// Translation structure and explicitly marked/static-call key coverage; no linguistic claims.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
function typescript(){if(process.env.TYPESCRIPT_PATH)return require(process.env.TYPESCRIPT_PATH);try{return require('typescript')}catch{}
 const root=path.join(process.env.LOCALAPPDATA||'','Programs/Microsoft VS Code');
 if(fs.existsSync(root))for(const dir of ['',...fs.readdirSync(root)]){const candidate=path.join(root,dir,'resources/app/extensions/node_modules/typescript/lib/typescript.js');if(fs.existsSync(candidate))return require(candidate)}
 throw Error('Install TypeScript or set TYPESCRIPT_PATH to typescript/lib/typescript.js');
}
const ts=typescript();
const context={window:{dispatchEvent(){}},Event:function(){}};vm.createContext(context);
const runtime=fs.readFileSync('shared/site-preferences.js','utf8');
vm.runInContext(runtime.slice(0,runtime.indexOf('if(window.KSPreferences)return;'))+'window.base=phraseTranslations;})();',context);
vm.runInContext(fs.readFileSync('shared/translations.js','utf8'),context);
vm.runInContext(runtime.match(/const aliases=([^;]+);/)[0]+'window.aliases=aliases;',context);
const normalize=s=>s.replace(/\s+/g,' ').trim(),decode=s=>s.replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const sources=new Map(),pages=[];
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(e.name.startsWith('.')||e.name==='tests')continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.name==='index.html')pages.push(p)}}walk('.');
function add(key,file){key=normalize(key);if(!key)return;if(!sources.has(key))sources.set(key,new Set());sources.get(key).add(file)}
const positions={text:0,html:0,message:0,error:0,node:0,setText:1,apiError:1,setError:2,setResponse:2,fallbackHTML:1,attribute:1};
function markers(s,file){for(const m of s.matchAll(/data-ks-(?:text|placeholder|title|aria-label|alt)="([^"]+)"/g))if(!m[1].includes('${'))add(decode(m[1]),file)}
for(const file of pages){const s=fs.readFileSync(file,'utf8');markers(s,file);for(const part of (s.match(/<title>(.*?)<\/title>/)?.[1]||'').split(' · '))add(decode(part),file);
for(const m of s.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)){const ast=ts.createSourceFile(file,m[1],ts.ScriptTarget.Latest,true);
const variables=new Map();function collect(n){if(ts.isVariableDeclaration(n)&&ts.isIdentifier(n.name)&&n.initializer)variables.set(n.name.text,n.initializer);ts.forEachChild(n,collect)}collect(ast);
function literal(n,seen=new Set()){if(!n)return;if(ts.isStringLiteralLike(n))add(n.text,file);else if(ts.isConditionalExpression(n)){literal(n.whenTrue,seen);literal(n.whenFalse,seen)}else if(ts.isIdentifier(n)&&!seen.has(n.text)){seen.add(n.text);literal(variables.get(n.text),seen)}}
function visit(n){if(ts.isStringLiteralLike(n))markers(n.text,file);if(ts.isCallExpression(n)){if(ts.isPropertyAccessExpression(n.expression)&&n.expression.expression.getText(ast)==='KSPreferences'){const pos=positions[n.expression.name.text];if(pos!==undefined)literal(n.arguments[pos])}else if(ts.isIdentifier(n.expression)){const name=n.expression.text;if(name==='tool'&&file.replaceAll('\\','/')==='admin/index.html')for(const i of [2,3,4])literal(n.arguments[i]);if(name==='badge'||name==='setHud'||(name==='row'&&file.startsWith('compare')))literal(n.arguments[0])}}ts.forEachChild(n,visit)}visit(ast)}}
// External recruitment modules use the same translator through small DOM helpers.
const recruitmentContext={window:{}};vm.runInNewContext(fs.readFileSync('shared/transfer-recruitment.js','utf8'),recruitmentContext);
for(const row of [...recruitmentContext.window.KSRecruitment.fields,...recruitmentContext.window.KSRecruitment.contactFields])add(row[1],'shared/transfer-recruitment.js');
for(const file of ['shared/transfer-recruitment.js','admin/transfers/settings.js','transfer/recruitment.js']){
 const ast=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);
 function literal(n){if(!n)return;if(ts.isStringLiteralLike(n))add(n.text,file);else if(ts.isConditionalExpression(n)){literal(n.whenTrue);literal(n.whenFalse)}}
 function visit(n){
   if(ts.isCallExpression(n)){
     const name=n.expression.getText(ast);
     if(name==='label'||name==='R.label'||name==='external'||name==='select')literal(n.arguments[1]);
     if(name==='message')literal(n.arguments[0]);
     if(ts.isPropertyAccessExpression(n.expression)&&n.expression.expression.getText(ast)==='KSPreferences'){const pos=positions[n.expression.name.text];if(pos!==undefined)literal(n.arguments[pos])}
   }
   if(ts.isVariableDeclaration(n)&&['errors','classifications'].includes(n.name.getText(ast))&&n.initializer&&ts.isObjectLiteralExpression(n.initializer))for(const property of n.initializer.properties)if(ts.isPropertyAssignment(property))literal(property.initializer);
   ts.forEachChild(n,visit);
 }visit(ast);
}
// Shared validation/error keys have no page-owned call site.
const sharedAst=ts.createSourceFile('shared',runtime,ts.ScriptTarget.Latest,true);function sharedVisit(n){if(ts.isBinaryExpression(n)&&n.left.getText(sharedAst)==='key'&&n.operatorToken.kind===ts.SyntaxKind.EqualsToken){const visitKey=k=>{if(ts.isStringLiteralLike(k))add(k.text,'shared/site-preferences.js');else if(ts.isConditionalExpression(k)){visitKey(k.whenTrue);visitKey(k.whenFalse)}};visitKey(n.right)}if(ts.isCallExpression(n)&&ts.isIdentifier(n.expression)&&['setText','error','message'].includes(n.expression.text)){const a=n.arguments[n.expression.text==='setText'?1:0];if(a&&ts.isStringLiteralLike(a))add(a.text,'shared/site-preferences.js')}ts.forEachChild(n,sharedVisit)}sharedVisit(sharedAst);
const languages=['ko','es','pt','fr','ar'],missing=[],invariantKeys=['{name}','{time}','{status}','{date} · KINGSHOT UTC','+{delay} {name}','{troop} {gear}','VS','—'];
const placeholders=s=>[...new Set([...s.matchAll(/\{(\w+)\}/g)].map(x=>x[1]))].sort();
const dictionaries=Object.fromEntries(languages.map(lang=>[lang,{...context.window.base[lang],...context.window.KSTranslations[lang]}]));
const dictionaryKeys=[...new Set(Object.values(dictionaries).flatMap(Object.keys))].sort();
for(const lang of languages){const dict=dictionaries[lang];for(const key of dictionaryKeys)assert(Object.hasOwn(dict,key),lang+': dictionary parity '+key);for(const [key,files]of sources){const value=dict[context.window.aliases[key]||key];if(!value&&!invariantKeys.includes(key))missing.push({language:lang,key,files:[...files]})}
for(const [key,value]of Object.entries(dict)){const forms=typeof value==='string'?[value]:Object.entries(value).filter(([k])=>k!=='plural').map(([,v])=>v);for(const form of forms)assert.deepEqual(placeholders(form),placeholders(key),lang+': placeholders '+key)}}
const report={markedAndCalledKeys:sources.size,languages,missing,intentionallyUntranslated:{templates:invariantKeys,data:['Player/alliance names and tags','Player IDs, application references, codes and contact details','User-authored notes, reasons and custom event names','API actions, database values and unrecognized server messages','Numeric UTC time ranges and SI units']},limitations:['Static markers and literal/conditional translation calls are checked; arbitrary runtime strings require browser fixtures or review.','Key coverage does not establish linguistic accuracy.']};
fs.writeFileSync('shared/translation-coverage.json',JSON.stringify(report,null,2)+'\n');
if(missing.length){console.log([...new Set(missing.map(x=>x.key))].join('\n'));process.exitCode=1}else console.log(`PASS: ${sources.size} marked/called keys in five dictionaries; named placeholders preserved.`);

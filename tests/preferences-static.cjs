// Run from the frontend repository root: node tests/preferences-static.cjs
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const pages=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.name.startsWith('.'))continue;const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(entry.name==='index.html')pages.push(file)}}
walk('.');
for(const file of pages){
  const html=fs.readFileSync(file,'utf8');
  let scripts=0;
  for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(match[1],{filename:file+':script-'+(++scripts)});
  for(const match of html.matchAll(/(?:src|href)="([^"#]*shared\/[^"#]+)"/g))assert(fs.existsSync(path.resolve(path.dirname(file),match[1])),file+': missing '+match[1]);
  assert.equal((html.match(/ data-site-nav\b/g)||[]).length,1,file+': ambiguous header navigation');
  assert.equal((html.match(/src="[^"\n]*site-preferences.js"/g)||[]).length,1,file+': preferences must load once');
}
for(const file of ['shared/site-preferences.js','shared/translations.js'])new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
const context={window:{dispatchEvent(){}},Event:function(){}};
vm.createContext(context);vm.runInContext(fs.readFileSync('shared/translations.js','utf8'),context);
for(const language of ['ko','es','pt','fr','ar'])assert(Object.keys(context.window.KSTranslations[language]).length>300,language+': dictionary incomplete or failed to load');
console.log(`PASS: ${pages.length} pages, inline/shared JavaScript syntax, nested asset paths, navigation markers, dictionary loading.`);

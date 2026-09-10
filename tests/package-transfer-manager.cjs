// Builds a review package only. Never commits, pushes, runs SQL or deploys.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process');
const root=process.cwd(),backend=path.resolve('../kingshot169-backend');
const target=path.join(root,'.release','transfer-manager-20260910');
if(fs.existsSync(target))throw Error('Release folder already exists; preserve it and choose a new review folder.');
const frontend=['admin/transfers/index.html','admin/transfers/transfers.css','admin/transfers/settings.js','transfer/index.html','transfer/recruitment.js','shared/translations.js','shared/transfer-recruitment.js','shared/transfer-recruitment.css'];
const backendFiles=['supabase/functions/transfer-settings/index.ts','supabase/functions/admin-transfer-settings/index.ts','supabase/functions/_shared/transfer-settings.ts','supabase/functions/_shared/transfer-recruitment-suggested.ts','migrations/20260910_transfer_recruitment.sql'];
const tests=['tests/preferences-static.cjs','tests/preferences-coverage.cjs','tests/preferences-browser.cjs','tests/transfer-settings-fixture.cjs','tests/transfer-settings-unit.cjs','tests/transfer-settings-browser.cjs','tests/package-transfer-manager.cjs'];
const draftFiles=['RECRUITMENT-DRAFT.txt','CONTACT-CALLOUT.txt','SUGGESTED-DRAFT-VALUES.json'];
const manifest={baseFrontendCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),backendGitRepository:false,files:[]};
let patch='';
function add(source,destination,kind,base=root){
 const input=path.join(base,source),output=path.join(target,destination);const bytes=fs.readFileSync(input);fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,bytes);
 manifest.files.push({source:(base===backend?'kingshot169-backend/':'kingshot169.github.io/')+source,destination,kind,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
}
const tracked=execFileSync('git',['ls-files'],{encoding:'utf8'}).trim().split(/\r?\n/);
for(const file of frontend)add(file,'frontend/'+file,tracked.includes(file)?'full replacement':'new');
for(const file of backendFiles)add(file,'backend/'+file,'new',backend);
for(const file of tests)add(file,'validation/'+file,tracked.includes(file)?'full replacement':'new');
for(const file of draftFiles)add('ks169-transfer-manager-implementation-brief/'+file,'draft-copy/'+file,'review only - do not deploy');
add('TRANSFER_MANAGER_REVIEW.md','README.md','deployment and review instructions');
const related=[...frontend,...tests,'TRANSFER_MANAGER_REVIEW.md'];
patch=execFileSync('git',['diff','HEAD','--',...related.filter(f=>tracked.includes(f))],{encoding:'utf8'});
// New files are represented explicitly, including sources from the non-Git backend folder.
for(const [prefix,base,files]of [['',root,related.filter(f=>!tracked.includes(f))],['backend/',backend,backendFiles]])for(const file of files){
 const text=fs.readFileSync(path.join(base,file),'utf8').replaceAll('\r\n','\n').replace(/\n$/,'');const lines=text.split('\n');
 patch+=`diff --git a/${prefix}${file} b/${prefix}${file}\nnew file mode 100644\n--- /dev/null\n+++ b/${prefix}${file}\n@@ -0,0 +1,${lines.length} @@\n`+lines.map(line=>'+'+line).join('\n')+'\n';
}
fs.writeFileSync(path.join(target,'changes.patch'),patch);
fs.writeFileSync(path.join(target,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
for(const file of manifest.files){const bytes=fs.readFileSync(path.join(target,file.destination));if(crypto.createHash('sha256').update(bytes).digest('hex')!==file.sha256)throw Error('Package hash mismatch: '+file.destination)}
console.log(`PASS: ${manifest.files.length} package files verified: ${target}`);

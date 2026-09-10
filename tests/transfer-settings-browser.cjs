const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const {fixture}=require('./transfer-settings-fixture.cjs');
module.exports=async({call,evaluate,navigate,sleep,db,errors,setSignedIn,setFailure,setTransferJourney})=>{
 async function until(expression){for(let i=0;i<60;i++){if(await evaluate(expression))return;await sleep(100)}throw Error('Timed out: '+expression+' '+await evaluate('document.querySelector(".tr-manager-status")?.textContent'))}
 async function click(selector){await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`)}
 await call('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
 setSignedIn(true);await navigate('/admin/transfers/');await until('Boolean(document.querySelector("[data-status-id]"))');
 await click('#recruitmentViewButton');await until('!document.querySelector(".tr-settings-fields").disabled');
  assert.equal(db.state.draft,null);
 await evaluate('window.confirm=()=>true');await click('.tr-settings-actions button:nth-child(4)');await until('!document.querySelector(".tr-settings-fields").disabled');
 assert.equal(db.state.draft,null);assert.equal(db.state.revision,0);
 const content=fixture();content.contacts=[];
 await evaluate(`(()=>{const content=${JSON.stringify(content)};for(const [key,value]of Object.entries(content)){const e=document.getElementById('tr-'+key);if(e){e.value=value??'';e.dispatchEvent(new Event('input',{bubbles:true}))}}})()`);
 await evaluate(`document.querySelector('#tr-headline').focus()`);await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 assert.equal(await evaluate('document.activeElement.id'),'tr-strapline');
 await evaluate(`(()=>{const add=document.querySelector('.tr-settings-fields > button');for(let i=0;i<9;i++)add.click();const boxes=[...document.querySelectorAll('.tr-contact-editor')];boxes.forEach((box,i)=>{const inputs=box.querySelectorAll('input');inputs[0].value='Contact '+i;inputs[1].value=String(10000000+i);for(const input of inputs)input.dispatchEvent(new Event('input',{bubbles:true}));if(i===0){inputs[6].checked=true;inputs[6].dispatchEvent(new Event('change',{bubbles:true}))}})})();`);
 assert.equal(await evaluate('document.querySelectorAll(".tr-contact-editor").length'),8);
 await evaluate(`document.querySelector('.tr-contact-editor').querySelectorAll(':scope > button')[1].click()`);
 assert.equal(await evaluate('document.querySelectorAll(".tr-contact-editor")[1].querySelectorAll("input")[1].value'),'10000000');
 await evaluate(`document.querySelector('.tr-contact-editor').querySelectorAll(':scope > button')[2].click()`);
 assert.equal(await evaluate('document.querySelectorAll(".tr-contact-editor").length'),7);
 await evaluate(`document.querySelector('#filter').value='submitted'`);await click('#applicationsViewButton');await click('#recruitmentViewButton');
 assert.equal(await evaluate(`document.querySelector('#filter').value`),'submitted');
 await evaluate(`(()=>{window.__trInput=document.querySelector('#tr-recruitment_message');for(const lang of ['ko','es','pt','fr','ar'])KSPreferences.setLanguage(lang);document.querySelector('.site-theme-toggle').click()})()`);
 assert.equal(await evaluate(`window.__trInput===document.querySelector('#tr-recruitment_message')&&window.__trInput.value.includes('<img')`),true);
 assert.deepEqual(await evaluate('KSPreferences.getMissing()'),[]);
 await click('.tr-settings-actions button[type="submit"]');await until('!document.querySelector(".tr-settings-fields").disabled');assert.equal(db.state.revision,1);assert.equal(db.state.published,null);
 await click('.tr-settings-actions button:nth-child(2)');await until('document.querySelector("dialog").open');
 assert.equal(await evaluate('document.querySelector("dialog img")===null'),true);
 assert.equal(await evaluate('document.activeElement.textContent===KSPreferences.text("Close")'),true);
 await click('dialog > button');await until('!document.querySelector("dialog").open');assert.equal(db.state.revision,2);assert.equal(db.state.published.recruitment_message,content.recruitment_message);
 // A concurrent save after preview invalidates publication. Edits remain in the form.
 await click('.tr-settings-actions button:nth-child(2)');db.state.revision++;
 await click('dialog > button');await until('!document.querySelector("dialog").open');
 assert.equal(await evaluate('document.querySelector(".tr-manager-status").textContent===KSPreferences.text("Another admin changed these settings. Your edits are preserved; reload before saving again.")'),true);
 assert.equal(await evaluate('document.querySelector("#tr-recruitment_message").value'),content.recruitment_message);
 // Public published output uses the same renderer and excludes private contact cards.
 db.state.published=fixture();await navigate('/transfer/');await until('Boolean(document.querySelector(".tr-contact"))');
 assert.equal(await evaluate('document.querySelectorAll(".tr-contact").length'),1);
 assert.equal(await evaluate('document.querySelector("#transfer-recruitment img")===null'),true);
 const reads=db.state.publicReads;
 await evaluate(`document.querySelector('#fid').value='987654321';KSPreferences.setLanguage('fr');KSPreferences.setLanguage('ar');document.querySelector('.site-theme-toggle').click()`);
 assert.equal(db.state.publicReads,reads);assert.equal(await evaluate('document.querySelector("#fid").value'),'987654321');
 assert.equal(await evaluate('document.querySelector("#transfer-recruitment").textContent.includes("English draft <img")'),true);
 await evaluate(`Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copied=text}}})`);await click('.tr-contact button');await sleep(50);
 assert.equal(await evaluate('window.__copied'),'12345678901234567890');
 await evaluate(`Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied')}}})`);await click('.tr-contact button');await sleep(50);
 assert.equal(await evaluate('window.getSelection().toString()'),'12345678901234567890');
 const artifacts=process.env.TRANSFER_ARTIFACTS||path.join(process.env.TEMP,'ks-transfer-manager-review');fs.mkdirSync(artifacts,{recursive:true});
 for(const route of ['/transfer/','/admin/transfers/']){await navigate(route);if(route.startsWith('/admin')){await click('#recruitmentViewButton');await until('!document.querySelector(".tr-settings-fields").disabled')}
  for(const width of [1280,375])for(const theme of ['dark','light'])for(const lang of ['fr','ar']){
    await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});await evaluate(`KSPreferences.setLanguage('${lang}');if(document.documentElement.dataset.theme!=='${theme}')document.querySelector('.site-theme-toggle').click();window.scrollTo(0,0)`);
    assert.equal(await evaluate('document.documentElement.dataset.theme'),theme,route+' screenshot theme');
    await sleep(100);
    assert.deepEqual(await evaluate('KSPreferences.getMissing()'),[],route+lang);
    assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,route+width);
    const screenshot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(artifacts,route.replaceAll('/','-')+theme+width+lang+'.png'),Buffer.from(screenshot.data,'base64'));
  }
 }
 await call('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
 // Error recovery retains form inputs; native confirmation cancellation preserves unsaved edits.
 await evaluate(`document.querySelector('#tr-headline').value='Unsaved edit';document.querySelector('#tr-headline').dispatchEvent(new Event('input',{bubbles:true}));window.confirm=()=>false`);
 await click('.tr-settings-actions button:last-child');assert.equal(await evaluate('document.querySelector("#tr-headline").value'),'Unsaved edit');
 setFailure(true);await click('.tr-settings-actions button[type="submit"]');await until('!document.querySelector(".tr-settings-fields").disabled');assert.equal(await evaluate('document.querySelector("#tr-headline").value'),'Unsaved edit');
 // Unpublish must leave applications intact.
 setFailure(false);await evaluate('window.confirm=()=>true');await click('.tr-settings-actions button:last-child');await until('!document.querySelector(".tr-settings-fields").disabled');
 await click('.tr-settings-actions button:nth-child(3)');await until('!document.querySelector(".tr-settings-fields").disabled');assert.equal(db.state.published,null);
 await click('#applicationsViewButton');assert.equal(await evaluate('Boolean(document.querySelector("[data-status-id]"))'),true);
 await evaluate(`document.querySelector('[data-status-id]').value='reviewing';document.querySelector('[data-status-id]').dispatchEvent(new Event('change',{bubbles:true}))`);
 await until('document.querySelector("#msg").textContent===KSPreferences.text("Status updated.")');
 assert.equal(await evaluate('document.querySelector("[data-status-id]").value'),'reviewing');
 // Settings failure does not prevent lookup, form completion or actual mocked success.
 setFailure(true);setTransferJourney(false);await navigate('/transfer/');await evaluate(`document.querySelector('#fid').value='24649596';document.querySelector('#find').click()`);
 await until('getComputedStyle(document.querySelector("#playerCard")).display!=="none"');
 assert.equal(await evaluate('getComputedStyle(document.querySelector("#continue")).display'),'none','State 169 exclusion');
 assert.equal(await evaluate('getComputedStyle(document.querySelector("#application")).display'),'none');
 setFailure(true);setTransferJourney(true);await navigate('/transfer/');await until('document.querySelector("#transfer-recruitment").textContent.length>0');
 assert.equal(await evaluate('getComputedStyle(document.querySelector("#successCard")).display'),'none');
 await evaluate(`document.querySelector('#fid').value='24649596';document.querySelector('#find').click()`);await until('getComputedStyle(document.querySelector("#playerCard")).display!=="none"');
 await click('#continue');await evaluate(`(()=>{const f=document.querySelector('#form');for(const e of f.elements){if(e.type==='checkbox')e.checked=true;else if(e.name)e.value=e.name==='passes'?'12':'Mock application'}f.requestSubmit()})()`);
 await until('getComputedStyle(document.querySelector("#successCard")).display!=="none"');
 assert.equal(await evaluate('document.querySelector("#successCard").textContent.includes(KSPreferences.text("Contact the team and quote your application reference."))'),true);
 assert.equal(errors.length,0,JSON.stringify(errors));
 console.log('PASS: Transfer Manager browser fixtures: draft/save/preview/publish/conflict/unpublish; XSS-safe original copy; public allowlist; copy success/failure; form/filter preservation; API-failure submission; 16 theme/language/width screenshots. '+artifacts);
};

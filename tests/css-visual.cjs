// Reuse the regression server and API fixtures. No production requests are sent.
// CSS_SNAPSHOT=before|after CSS_ARTIFACTS=<absolute folder> node tests/preferences-browser.cjs
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
module.exports=async({call,evaluate,navigate,sleep,routes,setSignedIn})=>{
 const phase=process.env.CSS_SNAPSHOT,root=process.env.CSS_ARTIFACTS;
 assert(['before','after'].includes(phase)&&root,'Set CSS_SNAPSHOT and CSS_ARTIFACTS');
 const folder=path.join(root,phase);fs.mkdirSync(folder,{recursive:true});
 await call('Page.addScriptToEvaluateOnNewDocument',{source:`{const NativeDate=Date;window.Date=class extends NativeDate{constructor(...args){super(...(args.length?args:['2026-09-10T03:00:00Z']))}static now(){return 1789009200000}}}`});
 const rows=[];
 for(const signedIn of [true,false]){
 setSignedIn(signedIn);
 for(const route of signedIn?routes:['/','/admin/'])for(const theme of ['dark','light'])for(const width of [1280,375])for(const language of ['fr','ar']){
   await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
   await evaluate(`localStorage.setItem('ks-theme','${theme}');localStorage.setItem('ks-language','${language}')`);
   await navigate(route);await sleep(800);
   await evaluate(`document.documentElement.style.zoom='1';document.activeElement?.blur();document.fonts.ready`);
   const key=(route==='/'?'home':route.slice(1,-1).replaceAll('/','-'))+'-'+(signedIn?'session':'guest')+'-'+theme+'-'+width+'-'+language;
   const metrics=await evaluate(`(()=>{const h=document.querySelector('.site-preferences-header'),r=h.getBoundingClientRect();return {path:location.pathname,theme:document.documentElement.dataset.theme,language:document.documentElement.lang,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,header:{x:r.x,y:r.y,width:r.width,height:r.height},sheets:[...document.styleSheets].map(s=>({href:s.href,rules:s.cssRules.length})),elements:[...document.querySelectorAll('body *')].filter(e=>!e.matches('script,style,link')).map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return [e.tagName,e.id,r.x,r.y,r.width,r.height,s.display,s.color,s.backgroundColor,s.font,s.padding,s.margin,s.border,s.gridTemplateColumns,s.flexDirection]})}})()`);
   assert.equal(metrics.theme,theme);assert.equal(metrics.language,language);
   for(const sheet of metrics.sheets)if(sheet.href)assert(sheet.rules>0,sheet.href);
   const screenshot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:metrics.width,height:Math.max(900,metrics.height),scale:1}});
   fs.writeFileSync(path.join(folder,key+'.png'),Buffer.from(screenshot.data,'base64'));
   const row={key,...metrics};
   if(phase==='after'){
     assert.equal(await evaluate(`Boolean([...document.querySelectorAll('link[rel="stylesheet"]')].every(link=>link.sheet&&link.sheet.cssRules.length))`),true,key+': stylesheet failed to load');
     const before=JSON.parse(fs.readFileSync(path.join(root,'before',key+'.json'),'utf8'));
     assert.deepEqual({...row,sheets:[]},{...before,sheets:[]},key+': computed appearance/overflow changed');
     const baseline=fs.readFileSync(path.join(root,'before',key+'.png')).toString('base64');
     const pixels=await evaluate(`(async()=>{const images=await Promise.all(['${baseline}','${screenshot.data}'].map(data=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src='data:image/png;base64,'+data})));const canvas=document.createElement('canvas');canvas.width=images[0].width;canvas.height=images[0].height;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(images[0],0,0);const a=ctx.getImageData(0,0,canvas.width,canvas.height).data;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(images[1],0,0);const b=ctx.getImageData(0,0,canvas.width,canvas.height).data;let changed=0;for(let i=0;i<a.length;i+=4)if(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2]||a[i+3]!==b[i+3])changed++;return {changed,width:canvas.width,height:canvas.height}})()`);
     assert.equal(pixels.changed,0,key+': screenshot pixels changed');
   }
   fs.writeFileSync(path.join(folder,key+'.json'),JSON.stringify(row,null,2));rows.push({key,width:metrics.width,scrollWidth:metrics.scrollWidth,height:metrics.height});
 }
 }
 fs.writeFileSync(path.join(folder,'summary.json'),JSON.stringify(rows,null,2));
 console.log(`PASS: ${phase}: ${rows.length} full-page screenshots and computed-layout records${phase==='after'?', zero changed pixels or geometry differences':''}. Artifacts: ${folder}`);
};

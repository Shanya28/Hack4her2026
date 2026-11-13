const {chromium}=require('/home/chelsea/.cache/ms-playwright-go/1.57.0/package');
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const names=['01-Fiche-technique-et-risques-Ayidote','02-Support-de-pitch-Ayidote','03-Demonstration-et-tests-Ayidote'];
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
 const diagnostics=[];
 try{for(const name of names){
  const page=await browser.newPage({viewport:{width:1360,height:1200},deviceScaleFactor:1});
  await page.goto('file://'+path.join(__dirname,name+'.html'),{waitUntil:'load'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
  const sizes=await page.locator('.body').evaluateAll(es=>es.map((e,i)=>({page:i+1,height:e.clientHeight,scroll:e.scrollHeight,width:e.clientWidth,scrollWidth:e.scrollWidth})));
  const overflow=sizes.filter(s=>s.scroll>s.height+2||s.scrollWidth>s.width+2);
  await page.pdf({path:path.join(ROOT,name+'.pdf'),printBackground:true,preferCSSPageSize:true,tagged:true,outline:true});
  await page.locator(name.startsWith('02')?'.slide':'.page').first().screenshot({path:path.join(ROOT,'preuves',name+'-couverture.png')});
  diagnostics.push({name,pages:sizes.length,overflow,sizes});
  console.log(JSON.stringify({name,pages:sizes.length,overflow}));await page.close();
 }}finally{await browser.close();fs.writeFileSync(path.join(ROOT,'preuves/verification-mise-en-page.json'),JSON.stringify(diagnostics,null,2))}
 if(diagnostics.some(d=>d.overflow.length))process.exitCode=2;
})().catch(e=>{console.error(e);process.exitCode=1});

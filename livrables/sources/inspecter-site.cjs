const {chromium}=require('/home/chelsea/.cache/ms-playwright-go/1.57.0/package');
const fs=require('node:fs');const path=require('node:path');
(async()=>{
const root=path.resolve(__dirname,'../preuves');fs.mkdirSync(root,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
try{
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const page=await context.newPage();
const errors=[],requests=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push({url:r.url(),method:r.method(),type:r.resourceType()}));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
const response=await page.goto('https://shanya28.github.io/Hack4her2026/',{waitUntil:'networkidle',timeout:60000});
await page.screenshot({path:path.join(root,'01-accueil.png'),fullPage:true});
const result={url:page.url(),status:response.status(),headers:response.headers(),title:await page.title(),body:await page.locator('body').innerText(),buttons:await page.getByRole('button').allTextContents(),errors,failed,requests,sw:await page.evaluate(async()=>({controller:navigator.serviceWorker?.controller?.scriptURL,registrations:await navigator.serviceWorker?.getRegistrations().then(rs=>rs.map(r=>({scope:r.scope,active:r.active?.scriptURL}))),cacheNames:await caches.keys(),localStorage:{...localStorage}}))};
fs.writeFileSync(path.join(root,'inspection-initiale.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

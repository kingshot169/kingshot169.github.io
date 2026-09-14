/* Uses the same Supabase session and admin-profile contract as admin/index.html.
   Active admin_profiles membership grants access; tool flags and player_id do not. */
(()=>{
 const panel=$('compare-auth'),status=$('compare-auth-status'),retry=$('compare-auth-retry');
 let client=null,generation=0,controller=null,expiration=null;
 function invalidate(){generation++;controller?.abort();clearTimeout(expiration);CompareAccess.setAdminState('checking');panel.hidden=false;retry.hidden=true;KSPreferences.setText(status,'Checking your session…');return generation}
 function visitor(failed=false){CompareAccess.setAdminState('visitor');panel.hidden=!failed;retry.hidden=!failed;if(failed)KSPreferences.setText(status,'Unable to check your session. Please try again.')}
 function connect(){
  if(client)return;
  client=window.supabase.createClient(new URL(API).origin,KEY);
  client.auth.onAuthStateChange((event,session)=>{
   if(event==='INITIAL_SESSION')return;
   const own=invalidate();
   // Never await another Supabase auth call from within its callback.
   setTimeout(()=>validate(own,session),0);
  });
 }
 async function validate(own,supplied){
  if(own!==generation)return;
  controller=new AbortController();const active=controller;
  let timeout;
  try{
   const deadline=new Promise((_,reject)=>{timeout=setTimeout(()=>{active.abort();reject(Error('Session check timed out'))},10000)});
   await Promise.race([(async()=>{
    let session=supplied;
    if(session===undefined){connect();const result=await client.auth.getSession();if(result.error)throw result.error;session=result.data?.session}
    if(own!==generation||active.signal.aborted)return;
    if(!session){visitor();return}
    const expires=session.expires_at*1000;
    if(typeof session.expires_at!=='number'||!Number.isFinite(expires)||expires<=Date.now()||typeof session.access_token!=='string'||!session.access_token||typeof session.user?.id!=='string'){visitor();return}
    const response=await fetch(API.replace('kingdom-compare','admin-profile'),{headers:{apikey:KEY,Authorization:'Bearer '+session.access_token},signal:active.signal,cache:'no-store'});
    if(own!==generation||active.signal.aborted)return;
    if(!response.ok){visitor(true);return}
    const body=await response.json();if(own!==generation||active.signal.aborted)return;
    const profile=body?.profile;
    if(body?.ok!==true||!profile||profile.user_id!==session.user.id||profile.is_active!==true){visitor(true);return}
    if(profile.must_change_password===true){CompareAccess.setAdminState('password');location.assign('../admin/account/?required=1');return}
    if(profile.must_change_password!==false){visitor(true);return}
    if(expires<=Date.now()){visitor();return}
    CompareAccess.setAdminState('admin',expires);panel.hidden=true;
    expiration=setTimeout(check,Math.max(0,expires-Date.now()));
   })(),deadline]);
  }catch{if(own===generation)visitor(true)}finally{clearTimeout(timeout)}
 }
 function check(){const own=invalidate();validate(own)}
 retry.onclick=check;
 window.addEventListener('pageshow',event=>{if(event.persisted)check()});
 window.addEventListener('focus',check);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()});
 check();
})();

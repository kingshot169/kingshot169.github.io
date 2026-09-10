(()=>{
  // Once per document. Preference changes translate owned labels without re-fetching custom text.
  const host=document.getElementById('transfer-recruitment');
  fetch('https://iqjvzhgodwufvepegwyj.supabase.co/functions/v1/transfer-settings',{
    headers:authHeaders(),signal:AbortSignal.timeout(10000),
  }).then(async response=>{if(!response.ok)throw Error();const body=await response.json();if(!body.ok)throw Error();KSRecruitment.render(host,body.settings||null)})
    .catch(()=>KSRecruitment.render(host,null));
})();

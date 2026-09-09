(()=>{
  const languages={
    en:{name:"English",dir:"ltr",labels:{theme:"Switch theme",language:"Language",home:"169 Kingshot Tools",back:"Back to 169 Kingshot Tools",statement:"One kingdom, many cultures. We keep geopolitics and religion out of the game so everyone can escape, connect and have fun.",open:"Open tool",application:"Open application",enrolment:"Open enrolment",compare:"Compare kingdoms",codes:"View gift codes"}},
    ko:{name:"한국어",dir:"ltr",labels:{theme:"테마 전환",language:"언어",home:"169 킹스샷 도구",back:"169 킹스샷 도구로",statement:"하나의 왕국, 다양한 문화. 모두가 게임에서 현실을 잠시 내려놓고 함께 즐길 수 있도록 정치와 종교는 게임 밖에 둡니다.",open:"도구 열기",application:"신청서 열기",enrolment:"등록 열기",compare:"왕국 비교",codes:"선물 코드 보기"}},
    es:{name:"Español",dir:"ltr",labels:{theme:"Cambiar tema",language:"Idioma",home:"Herramientas Kingshot 169",back:"Volver a Herramientas Kingshot 169",statement:"Un reino, muchas culturas. Dejamos la geopolítica y la religión fuera del juego para que todos puedan desconectar, conectar y divertirse.",open:"Abrir herramienta",application:"Abrir solicitud",enrolment:"Abrir inscripción",compare:"Comparar reinos",codes:"Ver códigos de regalo"}},
    pt:{name:"Português",dir:"ltr",labels:{theme:"Mudar tema",language:"Idioma",home:"Ferramentas Kingshot 169",back:"Voltar às Ferramentas Kingshot 169",statement:"Um reino, muitas culturas. Mantemos a geopolítica e a religião fora do jogo para que todos possam desligar, conviver e divertir-se.",open:"Abrir ferramenta",application:"Abrir candidatura",enrolment:"Abrir inscrição",compare:"Comparar reinos",codes:"Ver códigos-presente"}},
    fr:{name:"Français",dir:"ltr",labels:{theme:"Changer de thème",language:"Langue",home:"Outils Kingshot 169",back:"Retour aux outils Kingshot 169",statement:"Un royaume, de nombreuses cultures. Nous laissons la géopolitique et la religion en dehors du jeu afin que chacun puisse s'évader, se retrouver et s'amuser.",open:"Ouvrir l'outil",application:"Ouvrir la demande",enrolment:"Ouvrir les inscriptions",compare:"Comparer les royaumes",codes:"Voir les codes cadeaux"}},
    ar:{name:"العربية",dir:"rtl",labels:{theme:"تبديل المظهر",language:"اللغة",home:"أدوات كينغشوت 169",back:"العودة إلى أدوات كينغشوت 169",statement:"مملكة واحدة وثقافات كثيرة. نبقي الجغرافيا السياسية والدين خارج اللعبة حتى يتمكن الجميع من الهروب من الواقع والتواصل والاستمتاع.",open:"فتح الأداة",application:"فتح الطلب",enrolment:"فتح التسجيل",compare:"مقارنة الممالك",codes:"عرض رموز الهدايا"}}
  };
  const phraseTranslations={
    ko:{"State 169":"스테이트 169","169 Kingshot Tools":"169 킹스샷 도구","← 169 Kingshot Tools":"← 169 킹스샷 도구","Kingshot Tools":"킹스샷 도구","Community tools for rallies, transfers, King's Buffs, kingdom scouting and gift codes.":"랠리, 이전, 킹스 버프, 왕국 정찰 및 선물 코드를 위한 커뮤니티 도구","Rally Sync":"랠리 동기화","Calculate launch delays and run a silent visual timer so multiple rallies land together.":"출발 지연을 계산하고 여러 랠리가 동시에 도착하도록 시각 타이머를 실행합니다.","Transfer Application":"이전 신청","Apply to transfer into State 169 with one clean, consistent application form.":"간단하고 일관된 신청서로 스테이트 169 이전을 신청하세요.","King's Buffs":"킹스 버프","Register for KVK King's Buff appointments and keep requests organised in one place.":"KVK 킹스 버프 일정을 신청하고 요청을 한곳에서 관리하세요.","Kingdom Compare":"왕국 비교","Compare State 169 with another kingdom using current kingdom strength and activity data.":"현재 왕국 전투력과 활동 데이터를 사용해 스테이트 169를 다른 왕국과 비교하세요.","Compare State 169 with another kingdom using current MightPulse kingdom statistics.":"현재 MightPulse 왕국 통계를 사용해 스테이트 169를 다른 왕국과 비교하세요.","Our Kingdom":"우리 왕국","Opponent":"상대 왕국","Compare Kingdoms":"왕국 비교","Gift Codes":"선물 코드","Verify your State 169 Player ID and redeem current Kingshot gift codes.":"스테이트 169 플레이어 ID를 인증하고 현재 킹스샷 선물 코드를 사용하세요.","Admin":"관리자","Admin Login":"관리자 로그인","Admin Access":"관리자 접근","Refresh":"새로고침","Clear":"지우기","Search":"검색","Sign In":"로그인","Sign Out":"로그아웃","Try Again":"다시 시도","Submit":"제출","Continue":"계속","Back":"뒤로","Save":"저장","Cancel":"취소"},
    es:{"State 169":"Estado 169","169 Kingshot Tools":"Herramientas Kingshot 169","← 169 Kingshot Tools":"← Herramientas Kingshot 169","Kingshot Tools":"Herramientas Kingshot","Community tools for rallies, transfers, King's Buffs, kingdom scouting and gift codes.":"Herramientas comunitarias para rallies, transferencias, King's Buffs, exploración del reino y códigos de regalo","Rally Sync":"Sincronización de rallies","Calculate launch delays and run a silent visual timer so multiple rallies land together.":"Calcula los retrasos de lanzamiento y usa un temporizador visual para que varios rallies lleguen juntos.","Transfer Application":"Solicitud de transferencia","Apply to transfer into State 169 with one clean, consistent application form.":"Solicita transferirte al Estado 169 con un formulario claro y sencillo.","King's Buffs":"King's Buffs","Register for KVK King's Buff appointments and keep requests organised in one place.":"Regístrate para las citas de King's Buffs de KVK y organiza tus solicitudes en un solo lugar.","Kingdom Compare":"Comparar reinos","Compare State 169 with another kingdom using current kingdom strength and activity data.":"Compara el Estado 169 con otro reino usando datos actuales de fuerza y actividad.","Compare State 169 with another kingdom using current MightPulse kingdom statistics.":"Compara el Estado 169 con otro reino usando las estadísticas actuales de MightPulse.","Our Kingdom":"Nuestro reino","Opponent":"Oponente","Compare Kingdoms":"Comparar reinos","Gift Codes":"Códigos de regalo","Verify your State 169 Player ID and redeem current Kingshot gift codes.":"Verifica tu ID de jugador del Estado 169 y canjea códigos de regalo de Kingshot.","Admin":"Administrador","Admin Login":"Inicio de administrador","Admin Access":"Acceso de administrador","Refresh":"Actualizar","Clear":"Limpiar","Search":"Buscar","Sign In":"Iniciar sesión","Sign Out":"Cerrar sesión","Try Again":"Intentar de nuevo","Submit":"Enviar","Continue":"Continuar","Back":"Atrás","Save":"Guardar","Cancel":"Cancelar"},
    pt:{"State 169":"Estado 169","169 Kingshot Tools":"Ferramentas Kingshot 169","← 169 Kingshot Tools":"← Ferramentas Kingshot 169","Kingshot Tools":"Ferramentas Kingshot","Community tools for rallies, transfers, King's Buffs, kingdom scouting and gift codes.":"Ferramentas da comunidade para rallies, transferências, King's Buffs, reconhecimento do reino e códigos-presente","Rally Sync":"Sincronização de rallies","Transfer Application":"Candidatura de transferência","Kingdom Compare":"Comparar reinos","Compare State 169 with another kingdom using current MightPulse kingdom statistics.":"Compare o Estado 169 com outro reino usando as estatísticas atuais da MightPulse.","Our Kingdom":"O nosso reino","Opponent":"Oponente","Compare Kingdoms":"Comparar reinos","Gift Codes":"Códigos-presente","Admin":"Administrador","Admin Login":"Login de administrador","Admin Access":"Acesso de administrador","Refresh":"Atualizar","Clear":"Limpar","Search":"Pesquisar","Sign In":"Entrar","Sign Out":"Sair","Try Again":"Tentar novamente","Submit":"Enviar","Continue":"Continuar","Back":"Voltar","Save":"Guardar","Cancel":"Cancelar"},
    fr:{"State 169":"État 169","169 Kingshot Tools":"Outils Kingshot 169","← 169 Kingshot Tools":"← Outils Kingshot 169","Kingshot Tools":"Outils Kingshot","Community tools for rallies, transfers, King's Buffs, kingdom scouting and gift codes.":"Outils communautaires pour les rallies, les transferts, les King's Buffs, l'exploration du royaume et les codes cadeaux","Rally Sync":"Synchronisation des rallies","Calculate launch delays and run a silent visual timer so multiple rallies land together.":"Calculez les délais de lancement et utilisez un minuteur visuel pour synchroniser plusieurs rallies.","Transfer Application":"Demande de transfert","Apply to transfer into State 169 with one clean, consistent application form.":"Demandez votre transfert vers l'État 169 avec un formulaire simple et cohérent.","King's Buffs":"King's Buffs","Register for KVK King's Buff appointments and keep requests organised in one place.":"Inscrivez-vous aux rendez-vous King's Buffs de la KVK et centralisez les demandes.","Kingdom Compare":"Comparer les royaumes","Compare State 169 with another kingdom using current kingdom strength and activity data.":"Comparez l'État 169 à un autre royaume avec les données actuelles de puissance et d'activité.","Compare State 169 with another kingdom using current MightPulse kingdom statistics.":"Comparez l'État 169 à un autre royaume avec les statistiques actuelles de MightPulse.","Our Kingdom":"Notre royaume","Opponent":"Royaume adverse","Compare Kingdoms":"Comparer les royaumes","Gift Codes":"Codes cadeaux","Verify your State 169 Player ID and redeem current Kingshot gift codes.":"Vérifiez votre identifiant joueur de l'État 169 et utilisez les codes cadeaux Kingshot.","Admin":"Administration","Admin Login":"Connexion administrateur","Admin Access":"Accès administrateur","Refresh":"Actualiser","Clear":"Effacer","Search":"Rechercher","Sign In":"Se connecter","Sign Out":"Se déconnecter","Try Again":"Réessayer","Submit":"Envoyer","Continue":"Continuer","Back":"Retour","Save":"Enregistrer","Cancel":"Annuler"},
    ar:{"State 169":"الولاية 169","169 Kingshot Tools":"أدوات كينغشوت 169","← 169 Kingshot Tools":"← أدوات كينغشوت 169","Kingshot Tools":"أدوات كينغشوت","Community tools for rallies, transfers, King's Buffs, kingdom scouting and gift codes.":"أدوات مجتمعية للتجمعات والانتقالات وتعزيزات الملك واستكشاف الممالك ورموز الهدايا","Rally Sync":"مزامنة التجمعات","Transfer Application":"طلب انتقال","Kingdom Compare":"مقارنة الممالك","Compare State 169 with another kingdom using current MightPulse kingdom statistics.":"قارن الولاية 169 مع مملكة أخرى باستخدام إحصاءات MightPulse الحالية.","Our Kingdom":"مملكتنا","Opponent":"المنافس","Compare Kingdoms":"مقارنة الممالك","Gift Codes":"رموز الهدايا","Admin":"الإدارة","Admin Login":"تسجيل دخول الإدارة","Admin Access":"دخول الإدارة","Refresh":"تحديث","Clear":"مسح","Search":"بحث","Sign In":"تسجيل الدخول","Sign Out":"تسجيل الخروج","Try Again":"حاول مرة أخرى","Submit":"إرسال","Continue":"متابعة","Back":"رجوع","Save":"حفظ","Cancel":"إلغاء"}
  };
  if(window.KSPreferences)return;
  const root=document.documentElement;
  const read=key=>{try{return localStorage.getItem(key)}catch{return null}};
  const save=(key,value)=>{try{localStorage.setItem(key,value)}catch{}};
  const state={language:Object.hasOwn(languages,read('ks-language'))?read('ks-language'):'en',theme:read('ks-theme')==='light'?'light':read('ks-theme')==='dark'?'dark':window.matchMedia?.('(prefers-color-scheme: light)').matches?'light':'dark'};
  const bindings=new Map();
  const missing=new Set();
  const applicationErrors=new WeakMap();
  const validationMessages=new Map();
  const originalTitle=document.title;
  const getLabels=()=>languages[state.language].labels;
  const normalize=value=>String(value).replace(/\s+/g,' ').trim();
  const aliases={'Kingshot tools':'Kingshot Tools','STATE 169':'State 169','ADMIN':'Admin','TRANSFER':'Transfer Application','PLAYER_SEARCH':'Player Search','BUFF':"King's Buffs",'🏰 Kingdom Compare':'Kingdom Compare','🎁 Gift Codes':'Gift Codes'};
  const translatePhrase=(value,params={})=>{
    const source=normalize(value), key=aliases[source]||source, dictionary=phraseTranslations[state.language]||{};
    let translated=dictionary[key]||window.KSTranslations?.[state.language]?.[key];
    const english=window.KSTranslations?.en?.[key];
    const choose=entry=>{
      if(!entry||typeof entry!=='object')return entry;
      const category=new Intl.PluralRules(state.language).select(Number(params[entry.plural||'count']));
      return entry[category]||entry.other;
    };
    translated=choose(translated);
    if(state.language!=='en'&&!translated&&/[A-Za-z]/.test(source))missing.add(source);
    const prefix=/^(🏰|🎁) /.exec(source)?.[0]||'';
    return (translated?prefix+translated:choose(english)||source).replace(/\{(\w+)\}/g,(match,key)=>Object.hasOwn(params,key)?parameter(params[key]):match);
  };
  function message(source,params={}){return {$ksMessage:source,params}}
  function parameter(value){
    if(value&&typeof value==='object'&&Object.hasOwn(value,'$ksMessage'))return translatePhrase(value.$ksMessage,value.params);
    if(value&&typeof value==='object'&&Object.hasOwn(value,'$ksDate')){
      const date=new Date(value.$ksDate);
      return Number.isNaN(date.getTime())?String(value.$ksDate):date.toLocaleDateString(state.language,{weekday:'long',day:'numeric',month:'short',timeZone:'UTC'});
    }
    if(value&&typeof value==='object'&&Object.hasOwn(value,'$ksDateTime')){
      const date=new Date(value.$ksDateTime);
      return Number.isNaN(date.getTime())?String(value.$ksDateTime):date.toLocaleString(state.language,{timeZone:'UTC'})+' UTC';
    }
    return String(value??'');
  }
  const date=value=>({$ksDate:value});
  const dateTime=value=>({$ksDateTime:value});
  const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Only message markup is generated here. Parameters are escaped as data, never HTML.
  function html(source,params={}){return `<span data-ks-text="${escapeHTML(source)}" data-ks-params="${escapeHTML(JSON.stringify(params))}">${escapeHTML(translatePhrase(source,params))}</span>`}
  function fallbackHTML(raw,source,params={}){return raw?escapeHTML(raw):html(source,params)}
  function attribute(name,source,params={}){
    if(!['placeholder','title','aria-label','alt'].includes(name))throw new Error('Unsupported translation attribute');
    return `${name}="${escapeHTML(translatePhrase(source,params))}" data-ks-${name}="${escapeHTML(source)}" data-ks-params="${escapeHTML(JSON.stringify(params))}"`;
  }
  function node(source,params={}){const element=document.createElement('span');setText(element,source,params);return element}
  function error(source,params={}){const result=new Error(source);applicationErrors.set(result,{source,params});return result}
  function apiError(raw,source,params={}){return raw?new Error(String(raw)):error(source,params)}
  function setError(element,err,fallback='An unexpected error occurred.'){
    const own=err&&applicationErrors.get(err);
    if(own)setText(element,own.source,own.params);
    else if(err?.message)setRawText(element,err.message);
    else setText(element,fallback);
  }
  function setResponse(element,raw,fallback,params={}){if(raw)setRawText(element,raw);else setText(element,fallback,params)}
  function errorMessage(err,fallback='An unexpected error occurred.'){
    const own=err&&applicationErrors.get(err);return own?message(own.source,own.params):err?.message||message(fallback);
  }
  function setValue(element,value){if(value&&typeof value==='object'&&Object.hasOwn(value,'$ksMessage'))setText(element,value.$ksMessage,value.params);else setRawText(element,value)}
  function validationMessage(element){
    if(!element?.validity||typeof element.setCustomValidity!=='function')return;
    // Leave independently owned custom validation alone; only localize native constraints.
    if(element.validity.customError&&!validationMessages.has(element))return;
    element.setCustomValidity('');
    const v=element.validity;
    let key='',params={};
    if(v.valueMissing)key=element.type==='checkbox'?'Please check this box to continue.':'Please complete this field.';
    else if(v.typeMismatch)key='Please enter a valid value.';
    else if(v.patternMismatch)key='Please use the requested format.';
    else if(v.tooShort){key='Use at least {count} characters.';params={count:element.minLength}}
    else if(v.tooLong){key='Use no more than {count} characters.';params={count:element.maxLength}}
    else if(v.rangeUnderflow){key='Enter a value of at least {value}.';params={value:element.min}}
    else if(v.rangeOverflow){key='Enter a value no greater than {value}.';params={value:element.max}}
    else if(v.badInput||v.stepMismatch)key='Please enter a valid value.';
    if(key){validationMessages.set(element,{key,params});element.setCustomValidity(translatePhrase(key,params))}
    else validationMessages.delete(element);
  }
  function setText(element,source,params={}){
    if(!element)return;
    const rendered=translatePhrase(source,params);
    bindings.set(element,{source,params,rendered});
    element.setAttribute('data-ks-text',source);
    element.setAttribute('data-ks-params',JSON.stringify(params));
    if(element.textContent!==rendered)element.textContent=rendered;
  }
  function setRawText(element,value){
    if(!element)return;
    bindings.delete(element);element.removeAttribute('data-ks-text');element.removeAttribute('data-ks-params');
    element.textContent=value;
  }
  function translateTree(tree){
    if(!tree||tree.nodeType!==1)return;
    const elements=[tree,...tree.querySelectorAll('[data-ks-text],[data-i18n],[data-ks-placeholder],[data-ks-title],[data-ks-aria-label],[data-ks-alt]')];
    for(const element of elements){
      if(element.closest('[translate="no"],.site-controls'))continue;
      if(element.hasAttribute('data-ks-text')){
        let params=bindings.get(element)?.params;
        if(!params){try{params=JSON.parse(element.getAttribute('data-ks-params')||'{}')}catch{params={}}}
        setText(element,element.getAttribute('data-ks-text'),params);
      }
      if(element.dataset.i18n){
        const value=getLabels()[element.dataset.i18n]||languages.en.labels[element.dataset.i18n];
        if(value&&element.textContent!==value)element.textContent=value;
      }
      for(const attribute of ['placeholder','title','aria-label','alt']){
        const source=element.getAttribute('data-ks-'+attribute);
        if(source!==null){let params={};try{params=JSON.parse(element.getAttribute('data-ks-params')||'{}')}catch{}const value=translatePhrase(source,params);if(element.getAttribute(attribute)!==value)element.setAttribute(attribute,value)}
      }
    }
  }
  function setTheme(theme,persist=true){
    state.theme=theme==='light'?'light':'dark';root.dataset.theme=state.theme;
    if(persist)save('ks-theme',state.theme);
    const button=document.querySelector('.site-theme-toggle');
    if(button){button.textContent=state.theme==='light'?'🌙':'☀️';button.title=getLabels().theme;button.setAttribute('aria-label',getLabels().theme)}
  }
  function translate(){
    root.lang=state.language;root.dir=languages[state.language].dir;
    document.title=originalTitle.split(' · ').map(part=>translatePhrase(part)).join(' · ');
    missing.clear();
    for(const [element,binding]of bindings){
      if(!element.isConnected){bindings.delete(element);continue}
      // A renderer replaced the label with raw data: never restore a stale binding.
      if(element.textContent!==binding.rendered){bindings.delete(element);element.removeAttribute('data-ks-text');continue}
      setText(element,binding.source,binding.params);
    }
    translateTree(document.body);
    document.querySelectorAll('.site-language-select').forEach(select=>{select.value=state.language;select.setAttribute('aria-label',getLabels().language)});
    const label=document.querySelector('.site-control-label');if(label)label.textContent=getLabels().language;
    setTheme(state.theme,false);
    for(const element of validationMessages.keys()){if(element.isConnected)validationMessage(element);else validationMessages.delete(element)}
    window.dispatchEvent(new Event('ks-language-rendered'));
  }
  function setLanguage(language,persist=true){
    state.language=Object.hasOwn(languages,language)?language:'en';
    if(persist)save('ks-language',state.language);
    translate();
  }
  function restore(){setTheme(read('ks-theme')||state.theme,false);setLanguage(read('ks-language')||'en',false)}
  function mount(){
    if(document.querySelector('.site-preferences-header'))return;
    const header=document.createElement('header');header.className='site-preferences-header';
    const controls=document.createElement('div');controls.className='site-controls';
    controls.innerHTML='<label class="site-control-label" for="site-language">Language</label><select class="site-language-select" id="site-language"></select><button class="site-control-button site-theme-toggle" type="button"></button>';
    const select=controls.querySelector('select');
    for(const [code,language]of Object.entries(languages)){const option=document.createElement('option');option.value=code;option.textContent=language.name;select.append(option)}
    select.addEventListener('change',()=>setLanguage(select.value));
    controls.querySelector('button').addEventListener('click',()=>setTheme(state.theme==='light'?'dark':'light'));
    header.append(controls);
    const navigation=document.querySelector('[data-site-nav]');
    if(navigation){navigation.classList.add('site-header-nav-link');navigation.style.removeProperty('color');header.append(navigation)}
    document.body.prepend(header);
    translate();
    // Compatibility for template renderers: only explicitly marked application text.
    // No character/attribute observation, and disconnect during writes to avoid feedback.
    const options={childList:true,subtree:true};
    const observer=new MutationObserver(records=>{
      observer.disconnect();
      try{for(const record of records){
        for(const node of record.removedNodes)if(node.nodeType===1&&!node.isConnected){bindings.delete(node);node.querySelectorAll('[data-ks-text]').forEach(element=>bindings.delete(element))}
        for(const node of record.addedNodes)translateTree(node);
      }}
      finally{observer.observe(document.body,options)}
    });
    observer.observe(document.body,options);
  }
  window.KSPreferences={getLanguage:()=>state.language,translate,text:translatePhrase,setText,setRawText,setLanguage,translateTree,mount,message,date,dateTime,html,node,attribute,fallbackHTML,error,apiError,setError,setResponse,errorMessage,setValue,getMissing:()=>[...missing]};
  root.lang=state.language;root.dir=languages[state.language].dir;root.dataset.theme=state.theme;
  window.addEventListener('pageshow',restore);
  window.addEventListener('ks-translations-ready',translate);
  document.addEventListener('invalid',event=>validationMessage(event.target),true);
  document.addEventListener('input',event=>{if(validationMessages.has(event.target))validationMessage(event.target)});
  document.addEventListener('change',event=>{if(validationMessages.has(event.target))validationMessage(event.target)});
  window.addEventListener('storage',event=>{if(event.key==='ks-language'||event.key==='ks-theme'||event.key===null)restore()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();

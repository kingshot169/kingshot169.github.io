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
    ko:{"State 169":"스테이트 169","169 Kingshot Tools":"169 킹스샷 도구","Kingshot Tools":"킹스샷 도구","Community tools for rallies, transfers, King's Buffs, kingdom scouting and gift codes.":"랠리, 이전, 킹스 버프, 왕국 정찰 및 선물 코드를 위한 커뮤니티 도구","Rally Sync":"랠리 동기화","Calculate launch delays and run a silent visual timer so multiple rallies land together.":"출발 지연을 계산하고 여러 랠리가 동시에 도착하도록 시각 타이머를 실행합니다.","Transfer Application":"이전 신청","Apply to transfer into State 169 with one clean, consistent application form.":"간단하고 일관된 신청서로 스테이트 169 이전을 신청하세요.","King's Buffs":"킹스 버프","Register for KVK King's Buff appointments and keep requests organised in one place.":"KVK 킹스 버프 일정을 신청하고 요청을 한곳에서 관리하세요.","Kingdom Compare":"왕국 비교","Compare State 169 with another kingdom using current kingdom strength and activity data.":"현재 왕국 전투력과 활동 데이터를 사용해 스테이트 169를 다른 왕국과 비교하세요.","Gift Codes":"선물 코드","Verify your State 169 Player ID and redeem current Kingshot gift codes.":"스테이트 169 플레이어 ID를 인증하고 현재 킹스샷 선물 코드를 사용하세요.","Admin":"관리자","Admin Login":"관리자 로그인","Admin Access":"관리자 접근","Refresh":"새로고침","Clear":"지우기","Search":"검색","Sign In":"로그인","Sign Out":"로그아웃","Try Again":"다시 시도","Submit":"제출","Continue":"계속","Back":"뒤로","Save":"저장","Cancel":"취소"},
    es:{"State 169":"Estado 169","169 Kingshot Tools":"Herramientas Kingshot 169","Kingshot Tools":"Herramientas Kingshot","Community tools for rallies, transfers, King's Buffs, kingdom scouting and gift codes.":"Herramientas comunitarias para rallies, transferencias, King's Buffs, exploración del reino y códigos de regalo","Rally Sync":"Sincronización de rallies","Calculate launch delays and run a silent visual timer so multiple rallies land together.":"Calcula los retrasos de lanzamiento y usa un temporizador visual para que varios rallies lleguen juntos.","Transfer Application":"Solicitud de transferencia","Apply to transfer into State 169 with one clean, consistent application form.":"Solicita transferirte al Estado 169 con un formulario claro y sencillo.","King's Buffs":"King's Buffs","Register for KVK King's Buff appointments and keep requests organised in one place.":"Regístrate para las citas de King's Buffs de KVK y organiza tus solicitudes en un solo lugar.","Kingdom Compare":"Comparar reinos","Compare State 169 with another kingdom using current kingdom strength and activity data.":"Compara el Estado 169 con otro reino usando datos actuales de fuerza y actividad.","Gift Codes":"Códigos de regalo","Verify your State 169 Player ID and redeem current Kingshot gift codes.":"Verifica tu ID de jugador del Estado 169 y canjea códigos de regalo de Kingshot.","Admin":"Administrador","Admin Login":"Inicio de administrador","Admin Access":"Acceso de administrador","Refresh":"Actualizar","Clear":"Limpiar","Search":"Buscar","Sign In":"Iniciar sesión","Sign Out":"Cerrar sesión","Try Again":"Intentar de nuevo","Submit":"Enviar","Continue":"Continuar","Back":"Atrás","Save":"Guardar","Cancel":"Cancelar"},
    pt:{"State 169":"Estado 169","169 Kingshot Tools":"Ferramentas Kingshot 169","Kingshot Tools":"Ferramentas Kingshot","Community tools for rallies, transfers, King's Buffs, kingdom scouting and gift codes.":"Ferramentas da comunidade para rallies, transferências, King's Buffs, reconhecimento do reino e códigos-presente","Rally Sync":"Sincronização de rallies","Transfer Application":"Candidatura de transferência","Kingdom Compare":"Comparar reinos","Gift Codes":"Códigos-presente","Admin":"Administrador","Admin Login":"Login de administrador","Admin Access":"Acesso de administrador","Refresh":"Atualizar","Clear":"Limpar","Search":"Pesquisar","Sign In":"Entrar","Sign Out":"Sair","Try Again":"Tentar novamente","Submit":"Enviar","Continue":"Continuar","Back":"Voltar","Save":"Guardar","Cancel":"Cancelar"},
    fr:{"State 169":"État 169","169 Kingshot Tools":"Outils Kingshot 169","Kingshot Tools":"Outils Kingshot","Community tools for rallies, transfers, King's Buffs, kingdom scouting and gift codes.":"Outils communautaires pour les rallies, les transferts, les King's Buffs, l'exploration du royaume et les codes cadeaux","Rally Sync":"Synchronisation des rallies","Calculate launch delays and run a silent visual timer so multiple rallies land together.":"Calculez les délais de lancement et utilisez un minuteur visuel pour synchroniser plusieurs rallies.","Transfer Application":"Demande de transfert","Apply to transfer into State 169 with one clean, consistent application form.":"Demandez votre transfert vers l'État 169 avec un formulaire simple et cohérent.","King's Buffs":"King's Buffs","Register for KVK King's Buff appointments and keep requests organised in one place.":"Inscrivez-vous aux rendez-vous King's Buffs de la KVK et centralisez les demandes.","Kingdom Compare":"Comparer les royaumes","Compare State 169 with another kingdom using current kingdom strength and activity data.":"Comparez l'État 169 à un autre royaume avec les données actuelles de puissance et d'activité.","Gift Codes":"Codes cadeaux","Verify your State 169 Player ID and redeem current Kingshot gift codes.":"Vérifiez votre identifiant joueur de l'État 169 et utilisez les codes cadeaux Kingshot.","Admin":"Administration","Admin Login":"Connexion administrateur","Admin Access":"Accès administrateur","Refresh":"Actualiser","Clear":"Effacer","Search":"Rechercher","Sign In":"Se connecter","Sign Out":"Se déconnecter","Try Again":"Réessayer","Submit":"Envoyer","Continue":"Continuer","Back":"Retour","Save":"Enregistrer","Cancel":"Annuler"},
    ar:{"State 169":"الولاية 169","169 Kingshot Tools":"أدوات كينغشوت 169","Kingshot Tools":"أدوات كينغشوت","Community tools for rallies, transfers, King's Buffs, kingdom scouting and gift codes.":"أدوات مجتمعية للتجمعات والانتقالات وتعزيزات الملك واستكشاف الممالك ورموز الهدايا","Rally Sync":"مزامنة التجمعات","Transfer Application":"طلب انتقال","Kingdom Compare":"مقارنة الممالك","Gift Codes":"رموز الهدايا","Admin":"الإدارة","Admin Login":"تسجيل دخول الإدارة","Admin Access":"دخول الإدارة","Refresh":"تحديث","Clear":"مسح","Search":"بحث","Sign In":"تسجيل الدخول","Sign Out":"تسجيل الخروج","Try Again":"حاول مرة أخرى","Submit":"إرسال","Continue":"متابعة","Back":"رجوع","Save":"حفظ","Cancel":"إلغاء"}
  };
  const savedLanguage=localStorage.getItem("ks-language")||"en";
  const savedTheme=localStorage.getItem("ks-theme");
  const prefersLight=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches;
  const state={language:languages[savedLanguage]?savedLanguage:"en",theme:savedTheme|| (prefersLight?"light":"dark")};
  const root=document.documentElement;
  const originalText=new WeakMap();
  const originalPlaceholders=new WeakMap();
  const originalAttributes=new WeakMap();
  let originalTitle=document.title;
  const getLabels=()=>languages[state.language].labels;
  const translatePhrase=value=>{
    const dictionary=phraseTranslations[state.language]||{};
    return dictionary[value]||value;
  };
  function setTheme(theme){
    state.theme=theme;
    root.dataset.theme=theme;
    localStorage.setItem("ks-theme",theme);
    const button=document.querySelector(".site-theme-toggle");
    if(button){button.textContent=theme==="light"?"🌙":"☀️";button.title=getLabels().theme;button.setAttribute("aria-label",getLabels().theme)}
  }
  function translate(){
    const labels=getLabels();
    root.lang=state.language;
    root.dir=languages[state.language].dir;
    const translatedTitle=translatePhrase(originalTitle);
    if(document.title!==translatedTitle)document.title=translatedTitle;
    document.querySelectorAll("[data-i18n]").forEach(element=>{
      const key=element.dataset.i18n;
      if(!element.dataset.i18nSource)element.dataset.i18nSource=element.textContent;
      if(labels[key]&&element.textContent!==labels[key])element.textContent=labels[key];
    });
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const textNodes=[];
    while(walker.nextNode())textNodes.push(walker.currentNode);
    textNodes.forEach(node=>{
      if(node.parentElement.closest(".site-controls,script,style"))return;
      const current=node.nodeValue;
      const previous=originalText.get(node);
      const source=previous&&current===previous.rendered?previous.source:current;
      const value=source.trim();
      const translated=translatePhrase(value);
      if(value&&translated!==value){
        node.nodeValue=source.replace(value,translated);
        originalText.set(node,{source,rendered:node.nodeValue});
      }else if(value){
        originalText.set(node,{source,rendered:current});
      }
    });
    document.querySelectorAll("input[placeholder],textarea[placeholder]").forEach(element=>{
      const source=originalPlaceholders.get(element)||element.placeholder;
      const translated=translatePhrase(source);
      if(element.placeholder!==translated)element.placeholder=translated;
      originalPlaceholders.set(element,source);
    });
    document.querySelectorAll("[aria-label],[title]").forEach(element=>{
      const saved=originalAttributes.get(element)||{};
      ["aria-label","title"].forEach(attribute=>{
        if(!element.hasAttribute(attribute))return;
        const source=saved[attribute]||element.getAttribute(attribute);
        const translated=translatePhrase(source);
        if(element.getAttribute(attribute)!==translated)element.setAttribute(attribute,translated);
        saved[attribute]=source;
      });
      originalAttributes.set(element,saved);
    });
    const button=document.querySelector(".site-theme-toggle");
    if(button){button.title=labels.theme;button.setAttribute("aria-label",labels.theme)}
    const select=document.querySelector(".site-language-select");
    if(select){select.setAttribute("aria-label",labels.language)}
  }
  function mount(){
    const controls=document.createElement("div");
    controls.className="site-controls";
    controls.innerHTML='<button class="site-control-button site-theme-toggle" type="button"></button><label class="site-control-label" for="site-language">Language</label><select class="site-language-select" id="site-language"></select>';
    const select=controls.querySelector("select");
    Object.entries(languages).forEach(([code,language])=>{
      const option=document.createElement("option");
      option.value=code;option.textContent=language.name;select.appendChild(option);
    });
    select.value=state.language;
    select.addEventListener("change",()=>{state.language=select.value;localStorage.setItem("ks-language",state.language);translate()});
    controls.querySelector("button").addEventListener("click",()=>setTheme(state.theme==="light"?"dark":"light"));
    document.body.appendChild(controls);
    const observer=new MutationObserver(()=>translate());
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});
    setTheme(state.theme);translate();
  }
  root.dataset.theme=state.theme;
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();

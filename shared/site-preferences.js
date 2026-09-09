(()=>{
  const languages={
    en:{name:"English",dir:"ltr",labels:{theme:"Switch theme",language:"Language",home:"169 Kingshot Tools",back:"Back to 169 Kingshot Tools",statement:"One kingdom, many cultures. We keep geopolitics and religion out of the game so everyone can escape, connect and have fun.",open:"Open tool",application:"Open application",enrolment:"Open enrolment",compare:"Compare kingdoms",codes:"View gift codes"}},
    ko:{name:"한국어",dir:"ltr",labels:{theme:"테마 전환",language:"언어",home:"169 킹스샷 도구",back:"169 킹스샷 도구로",statement:"하나의 왕국, 다양한 문화. 모두가 게임에서 현실을 잠시 내려놓고 함께 즐길 수 있도록 정치와 종교는 게임 밖에 둡니다.",open:"도구 열기",application:"신청서 열기",enrolment:"등록 열기",compare:"왕국 비교",codes:"선물 코드 보기"}},
    es:{name:"Español",dir:"ltr",labels:{theme:"Cambiar tema",language:"Idioma",home:"Herramientas Kingshot 169",back:"Volver a Herramientas Kingshot 169",statement:"Un reino, muchas culturas. Dejamos la geopolítica y la religión fuera del juego para que todos puedan desconectar, conectar y divertirse.",open:"Abrir herramienta",application:"Abrir solicitud",enrolment:"Abrir inscripción",compare:"Comparar reinos",codes:"Ver códigos de regalo"}},
    pt:{name:"Português",dir:"ltr",labels:{theme:"Mudar tema",language:"Idioma",home:"Ferramentas Kingshot 169",back:"Voltar às Ferramentas Kingshot 169",statement:"Um reino, muitas culturas. Mantemos a geopolítica e a religião fora do jogo para que todos possam desligar, conviver e divertir-se.",open:"Abrir ferramenta",application:"Abrir candidatura",enrolment:"Abrir inscrição",compare:"Comparar reinos",codes:"Ver códigos-presente"}},
    fr:{name:"Français",dir:"ltr",labels:{theme:"Changer de thème",language:"Langue",home:"Outils Kingshot 169",back:"Retour aux outils Kingshot 169",statement:"Un royaume, de nombreuses cultures. Nous laissons la géopolitique et la religion en dehors du jeu afin que chacun puisse s'évader, se retrouver et s'amuser.",open:"Ouvrir l'outil",application:"Ouvrir la demande",enrolment:"Ouvrir les inscriptions",compare:"Comparer les royaumes",codes:"Voir les codes cadeaux"}},
    ar:{name:"العربية",dir:"rtl",labels:{theme:"تبديل المظهر",language:"اللغة",home:"أدوات كينغشوت 169",back:"العودة إلى أدوات كينغشوت 169",statement:"مملكة واحدة وثقافات كثيرة. نبقي الجغرافيا السياسية والدين خارج اللعبة حتى يتمكن الجميع من الهروب من الواقع والتواصل والاستمتاع.",open:"فتح الأداة",application:"فتح الطلب",enrolment:"فتح التسجيل",compare:"مقارنة الممالك",codes:"عرض رموز الهدايا"}}
  };
  const savedLanguage=localStorage.getItem("ks-language")||"en";
  const savedTheme=localStorage.getItem("ks-theme");
  const prefersLight=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches;
  const state={language:languages[savedLanguage]?savedLanguage:"en",theme:savedTheme|| (prefersLight?"light":"dark")};
  const root=document.documentElement;
  const getLabels=()=>languages[state.language].labels;
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
    document.querySelectorAll("[data-i18n]").forEach(element=>{
      const key=element.dataset.i18n;
      if(labels[key])element.textContent=labels[key];
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
    setTheme(state.theme);translate();
  }
  root.dataset.theme=state.theme;
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();

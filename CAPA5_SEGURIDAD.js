/* ══════════════════════════════════════════════════════
   CAPA 5 — SISTEMA DE SEGURIDAD ∆°
   Creaxion Papiro © 2026 · X-7777777-LC7°
   
   SILENCIOSO · INVISIBLE · SIEMPRE ACTIVO
   El intruso nunca sabe que fue detectado.
   ══════════════════════════════════════════════════════ */

(function CAPA5_SEGURIDAD(){

  // ══ CONFIGURACIÓN ══
  var SUPABASE_URL = 'https://vdtdrijfcmttssfdtgva.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_PwlfxDM8vqAB_-LsJVMouw_Arg6epEB';
  var PAPIROS_VALIDOS = [
    'splash.html','portada_es.html','papiro2_marble.html',
    'salon_verde_clean.html','papiro_corazon.html',
    'papiro_5capas.html','salon.html','login.html','ceo_panel.html'
  ];

  // ══ HUELLA DIGITAL DEL DISPOSITIVO ══
  function huellaDispositivo(){
    return [
      screen.width, screen.height,
      navigator.language,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.hardwareConcurrency || 0,
      navigator.platform
    ].join('|');
  }

  // ══ REGISTRAR AMENAZA EN SUPABASE ══
  function registrarAmenaza(tipo, detalle){
    try{
      var sesion = localStorage.getItem('papiro_usuario');
      var usuario = sesion ? JSON.parse(sesion).codigo : 'sin-sesion';
      fetch(SUPABASE_URL + '/rest/v1/amenazas', {
        method: 'POST',
        headers:{
          'Content-Type':'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY
        },
        body: JSON.stringify({
          tipo:      tipo,
          detalle:   detalle,
          usuario:   usuario,
          huella:    huellaDispositivo(),
          pagina:    window.location.pathname.split('/').pop(),
          timestamp: new Date().toISOString(),
          referrer:  document.referrer || 'directo'
        })
      }).catch(function(){});
    } catch(e){}
  }

  // ══ BLOQUEAR SILENCIOSAMENTE ══
  function bloquear(razon){
    registrarAmenaza('BLOQUEO', razon);
    // No muestra error — solo redirige al cosmos
    setTimeout(function(){
      document.body.innerHTML = '';
      document.body.style.background = '#000000';
      window.location.href = 'splash.html';
    }, 800);
  }

  // ══ DETECTOR 1 — INYECCIÓN EN URL ══
  (function detectarInyeccion(){
    var url = window.location.href + window.location.search;
    var patrones = [
      /<script/i, /javascript:/i, /eval\(/i,
      /document\./i, /window\./i, /%3C/i,
      /union.*select/i, /drop.*table/i,
      /insert.*into/i, /--/i, /\/\*/i
    ];
    for(var i=0; i<patrones.length; i++){
      if(patrones[i].test(url)){
        registrarAmenaza('INYECCION_URL', url.substring(0,100));
        bloquear('inyeccion_url');
        return;
      }
    }
  })();

  // ══ DETECTOR 2 — ORIGEN VÁLIDO ══
  (function detectarOrigen(){
    var referrer = document.referrer;
    // Si viene de afuera y no tiene sesión válida
    if(referrer && referrer.indexOf(window.location.hostname) < 0){
      var sesion = localStorage.getItem('papiro_usuario');
      if(!sesion){
        registrarAmenaza('ORIGEN_EXTERNO', referrer.substring(0,100));
        // No bloqueamos — solo registramos
        // El usuario legítimo puede llegar desde Google
      }
    }
  })();

  // ══ DETECTOR 3 — VELOCIDAD DE NAVEGACIÓN (anti-bot) ══
  (function detectarBot(){
    var llegada = Date.now();
    var TIEMPO_MINIMO = 800; // ms — humano mínimo

    // Guardamos el tiempo de llegada
    var ultimaVisita = parseInt(localStorage.getItem('_pp_last') || '0');
    var ahora = Date.now();
    localStorage.setItem('_pp_last', ahora);

    // Si el intervalo entre páginas es menor a 800ms = bot
    if(ultimaVisita > 0 && (ahora - ultimaVisita) < TIEMPO_MINIMO){
      registrarAmenaza('VELOCIDAD_BOT', 'intervalo:' + (ahora - ultimaVisita) + 'ms');
      // Incrementar contador
      var contador = parseInt(localStorage.getItem('_pp_bot') || '0') + 1;
      localStorage.setItem('_pp_bot', contador);
      if(contador >= 5) bloquear('bot_detectado');
    } else {
      // Reset contador si navega normal
      localStorage.setItem('_pp_bot', '0');
    }
  })();

  // ══ DETECTOR 4 — DEVTOOLS ABIERTO ══
  (function detectarDevTools(){
    var umbral = 160;
    var devtools = false;

    function chequear(){
      var ancho = window.outerWidth - window.innerWidth;
      var alto  = window.outerHeight - window.innerHeight;
      if((ancho > umbral || alto > umbral) && !devtools){
        devtools = true;
        var sesion = localStorage.getItem('papiro_usuario');
        var usuario = sesion ? JSON.parse(sesion || '{}').codigo : null;
        // Solo registramos — no bloqueamos a usuarios válidos
        // CEO puede tener DevTools abierto
        if(!usuario || usuario !== 'Creax@P∆p.LuisAlfonsoCastillejoVentura'){
          registrarAmenaza('DEVTOOLS_ABIERTO', 'ancho:'+ancho+'px');
        }
      }
      if(ancho <= umbral && alto <= umbral) devtools = false;
    }
    setInterval(chequear, 3000);
  })();

  // ══ DETECTOR 5 — INTEGRIDAD DEL PAPIRO ══
  (function detectarManipulacion(){
    // Verifica que las 5 capas existen
    var capas = ['cosmos','capa2-cuero','capa3-pano','capa4-interaccion','capa5-sistema'];
    var faltantes = [];
    capas.forEach(function(id){
      if(!document.getElementById(id)) faltantes.push(id);
    });
    if(faltantes.length > 0){
      registrarAmenaza('CAPAS_FALTANTES', faltantes.join(','));
    }

    // Verifica que los márgenes no fueron removidos
    var margenes = document.querySelectorAll('.margin-line');
    if(margenes.length !== 2){
      registrarAmenaza('MARGENES_ALTERADOS', 'cantidad:' + margenes.length);
    }
  })();

  // ══ DETECTOR 6 — CONSOLA EXTERNA ══
  // Si alguien intenta ejecutar código desde la consola
  (function protegerConsola(){
    var _log = console.log;
    var intentos = 0;
    // Dejamos la consola funcionar para el CEO
    // Solo monitoreamos frecuencia anormal
    var ultimo = Date.now();
    console.log = function(){
      var ahora = Date.now();
      if(ahora - ultimo < 50){ // 50ms entre logs = automatizado
        intentos++;
        if(intentos > 10){
          registrarAmenaza('CONSOLA_AUTOMATIZADA', 'intentos:'+intentos);
        }
      } else {
        intentos = 0;
      }
      ultimo = ahora;
      return _log.apply(console, arguments);
    };
  })();

  // ══ VERIFICACIÓN DE SESIÓN ══
  (function verificarSesion(){
    var pagina = window.location.pathname.split('/').pop();
    var paginasLibres = ['splash.html','login.html','portada_es.html'];
    var sesion = localStorage.getItem('papiro_usuario');

    // Páginas que requieren sesión
    if(paginasLibres.indexOf(pagina) < 0 && !sesion){
      // No bloqueamos — pero registramos el acceso sin sesión
      registrarAmenaza('ACCESO_SIN_SESION', pagina);
    }

    // CEO — verificar pixel
    var CEO = 'Creax@P∆p.LuisAlfonsoCastillejoVentura';
    var pixel = localStorage.getItem('papiro_pixel');
    if(sesion){
      try{
        var u = JSON.parse(sesion);
        var esCEO = (u.codigo === CEO || pixel === 'LC7-7777777');
        if(esCEO){
          var btnCEO = document.getElementById('btnCEO');
          if(btnCEO) btnCEO.style.display = 'flex';
          console.log('∆° Capa 5 · LC7° identificado · Sistema activo');
        }
      } catch(e){}
    }
  })();

  console.log('∆° Capa 5 activa · ' + new Date().toISOString().split('T')[0]);

})(); /* fin CAPA5_SEGURIDAD */

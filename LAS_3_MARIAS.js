/* ══════════════════════════════════════════════════════════
   LAS 3 MARÍAS — SISTEMA DE TRIPLE CONFIRMACIÓN
   Creaxion Papiro © 2026 · X-7777777-LC7°

   Como las 3 estrellas del Cinturón de Orión:
   Alineadas · Distintas · Inseparables

   MARÍA 1 — Habla con ° (Grado)
             Canal de comunicación usuario→sistema
             Lleva: identidad + token + solicitud

   MARÍA 2 — Lleva las 2 líneas de vida (PAR 1 + PAR 2)
             Canal de verificación de existencia real
             Lleva: pixel + coords cósmicas + sesión

   MARÍA 3 — Posición digital de refuerzo
             Canal de posición y contexto
             Lleva: PAR 3 + ubicación + huella + timestamp

   Las 3 viajan por canales distintos.
   Las 3 deben confirmar.
   ∆ recibe las 3 · las compara · decide.
   Si 2 de 3 confirman = acceso.
   Si las 3 confirman = acceso total.
   Si solo 1 confirma = alerta · investigar.
   Si ninguna confirma = bloqueo total.
   ══════════════════════════════════════════════════════════ */

var TRES_MARIAS = (function(){

  var SUPABASE_URL = 'https://vdtdrijfcmttssfdtgva.supabase.co';
  var KEY_GRADO    = 'sb_publishable_PwlfxDM8vqAB_-LsJVMouw_Arg6epEB';

  /* ══════════════════════════════════════
     MARÍA 1 — Canal de Comunicación
     Habla con ° (Grado)
     Lleva: identidad · token · solicitud
     ══════════════════════════════════════ */
  function MARIA1_comunicacion(solicitud){
    return new Promise(function(resolve){

      var sesion = localStorage.getItem('papiro_usuario');
      var token  = localStorage.getItem('papiro_token_delta');

      if(!sesion || !token){
        resolve({
          maria: 1,
          confirma: false,
          razon: 'sin_sesion_o_token',
          datos: null
        });
        return;
      }

      try{
        var u = JSON.parse(sesion);

        // María 1 construye su paquete para °
        var paquete_m1 = {
          canal:      'MARIA_1',
          codigo:     u.codigo,
          nombre:     u.nombre,
          token:      token,
          accion:     solicitud.accion,
          timestamp:  Date.now(),
          // María 1 verifica que el token no ha expirado
          // (en prod: verificar contra Supabase tokens_delta)
          token_ok:   token.startsWith('delta_')
        };

        // ° recibe el paquete de María 1
        // y verifica que el usuario existe
        GRADO.verificarUsuario(u.codigo, function(resultado){
          paquete_m1.usuario_existe = resultado.existe;
          paquete_m1.usuario_activo = resultado.existe && resultado.tipo !== 'bloqueado';

          resolve({
            maria:    1,
            confirma: paquete_m1.token_ok && paquete_m1.usuario_activo,
            razon:    paquete_m1.usuario_activo ? 'usuario_verificado' : 'usuario_no_activo',
            datos:    paquete_m1
          });
        });

      } catch(e){
        resolve({ maria: 1, confirma: false, razon: 'error_parseo', datos: null });
      }
    });
  }

  /* ══════════════════════════════════════
     MARÍA 2 — Canal de Líneas de Vida
     Lleva PAR 1 (identidad) + PAR 2 (pixel)
     Verifica la existencia real del usuario
     en las 6 líneas de vida del 30×40
     ══════════════════════════════════════ */
  function MARIA2_lineasVida(solicitud){
    return new Promise(function(resolve){

      var lineas = localStorage.getItem('papiro_lineas_vida');
      var coords = localStorage.getItem('papiro_cosmos_coords');

      if(!lineas){
        resolve({
          maria: 2,
          confirma: false,
          razon: 'sin_lineas_de_vida',
          datos: null
        });
        return;
      }

      try{
        var lv = JSON.parse(lineas);
        var cc = coords ? JSON.parse(coords) : null;

        // María 2 verifica PAR 1 (identidad + seña)
        var par1_ok = lv.par1 &&
                      lv.par1.identidad &&
                      lv.par1.sena &&
                      lv.par1.timestamp;

        // María 2 verifica PAR 1 RÉPLICA
        var par1_replica_ok = lv.par1_replica &&
                              lv.par1_replica.identidad === lv.par1.identidad;

        // María 2 verifica PAR 2 (pixel + dispositivo)
        var par2_ok = lv.par2 &&
                      lv.par2.pixel;

        // María 2 verifica PAR 2 RÉPLICA
        var par2_replica_ok = lv.par2_replica &&
                              lv.par2_replica.pixel === lv.par2.pixel;

        // María 2 verifica coordenadas cósmicas
        var coords_ok = cc &&
                        cc.mundo && cc.mundo.id &&
                        cc.continente && cc.continente.id &&
                        cc.pais && cc.pais.id;

        var paquete_m2 = {
          canal:            'MARIA_2',
          par1_ok:          par1_ok,
          par1_replica_ok:  par1_replica_ok,
          par2_ok:          par2_ok,
          par2_replica_ok:  par2_replica_ok,
          coords_ok:        coords_ok,
          pixel_mundo:      cc ? cc.mundo.id : null,
          pixel_continente: cc ? cc.continente.id : null,
          pixel_pais:       cc ? cc.pais.id : null,
          timestamp:        Date.now()
        };

        // María 2 confirma si los 2 pares y sus réplicas están OK
        var confirma = par1_ok && par1_replica_ok &&
                       par2_ok && par2_replica_ok;

        resolve({
          maria:    2,
          confirma: confirma,
          razon:    confirma ? 'lineas_vida_verificadas' : 'lineas_vida_incompletas',
          datos:    paquete_m2
        });

      } catch(e){
        resolve({ maria: 2, confirma: false, razon: 'error_lineas', datos: null });
      }
    });
  }

  /* ══════════════════════════════════════
     MARÍA 3 — Canal de Posición Digital
     Refuerza a María 1 y María 2
     Lleva PAR 3 + ubicación + huella + contexto
     ══════════════════════════════════════ */
  function MARIA3_posicionDigital(solicitud){
    return new Promise(function(resolve){

      var lineas = localStorage.getItem('papiro_lineas_vida');
      var escolta = localStorage.getItem('papiro_escolta_activo');
      var pases_ok = localStorage.getItem('papiro_3pases_ok');

      // María 3 construye la huella digital del dispositivo
      var huella = [
        screen.width + 'x' + screen.height,
        navigator.language,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        navigator.hardwareConcurrency || 0
      ].join('|');

      var paquete_m3 = {
        canal:     'MARIA_3',
        huella:    huella,
        escolta:   escolta === 'true',
        pases_ok:  !!pases_ok,
        pagina:    window.location.pathname.split('/').pop(),
        timestamp: Date.now(),
        par3_ok:   false,
        par3_replica_ok: false
      };

      // María 3 verifica PAR 3 (contenido + comunidad)
      if(lineas){
        try{
          var lv = JSON.parse(lineas);
          paquete_m3.par3_ok = lv.par3 && lv.par3.sesion_activa;
          paquete_m3.par3_replica_ok = lv.par3_replica &&
            lv.par3_replica.sesion_activa === lv.par3.sesion_activa;
        } catch(e){}
      }

      // María 3 verifica que el escolta ∆° está activo
      // y que los 3 pases fueron completados
      var confirma = paquete_m3.escolta &&
                     paquete_m3.pases_ok &&
                     paquete_m3.par3_ok;

      resolve({
        maria:    3,
        confirma: confirma,
        razon:    confirma ? 'posicion_digital_verificada' : 'posicion_digital_incompleta',
        datos:    paquete_m3
      });
    });
  }

  /* ══════════════════════════════════════════════
     ∆ RECIBE LAS 3 MARÍAS Y DECIDE
     Esta es la función central de Las 3 Marías
     Las 3 viajan · ∆ las compara · ∆ decide
     ══════════════════════════════════════════════ */
  function activar(solicitud, callback){

    console.log('Las 3 Marías viajando · ' + solicitud.accion);

    // Las 3 Marías salen al mismo tiempo
    // por canales distintos
    Promise.all([
      MARIA1_comunicacion(solicitud),
      MARIA2_lineasVida(solicitud),
      MARIA3_posicionDigital(solicitud)
    ]).then(function(resultados){

      var m1 = resultados[0];
      var m2 = resultados[1];
      var m3 = resultados[2];

      // Contar cuántas confirman
      var confirmaciones = [m1.confirma, m2.confirma, m3.confirma]
        .filter(Boolean).length;

      console.log('∆ recibió las 3 Marías:',
        'M1:' + (m1.confirma?'✅':'❌'),
        'M2:' + (m2.confirma?'✅':'❌'),
        'M3:' + (m3.confirma?'✅':'❌'),
        '· ' + confirmaciones + '/3'
      );

      /* ∆ DECIDE */
      var decision;

      if(confirmaciones === 3){
        // Las 3 alineadas = acceso total
        decision = {
          acceso:        'total',
          aprobado:      true,
          confirmaciones: 3,
          mensaje:       '∆ · Las 3 Marías alineadas · Acceso total',
          nivel:         'PLENO'
        };

      } else if(confirmaciones === 2){
        // 2 de 3 = acceso normal
        var maria_fallo = [m1,m2,m3].find(function(m){ return !m.confirma; });
        decision = {
          acceso:        'normal',
          aprobado:      true,
          confirmaciones: 2,
          mensaje:       '∆ · 2 Marías confirmaron · Acceso permitido · investigando María ' + maria_fallo.maria,
          nivel:         'NORMAL',
          maria_fallo:   maria_fallo.maria,
          razon_fallo:   maria_fallo.razon
        };
        // ∆ registra la María que falló para investigar
        _registrarFallo(maria_fallo);

      } else if(confirmaciones === 1){
        // Solo 1 = alerta · acceso limitado
        decision = {
          acceso:        'limitado',
          aprobado:      false,
          confirmaciones: 1,
          mensaje:       '∆ · Alerta · Solo 1 María confirmó · Investigando',
          nivel:         'ALERTA',
          marías_fallo:  [m1,m2,m3].filter(function(m){ return !m.confirma; }).map(function(m){ return m.maria; })
        };
        _registrarFallo({ maria: 'multiple', razon: 'solo_1_confirmo', datos: resultados });
        _notificarCEO('ALERTA_1_MARIA', resultados);

      } else {
        // Ninguna = bloqueo total
        decision = {
          acceso:        'bloqueado',
          aprobado:      false,
          confirmaciones: 0,
          mensaje:       '∆ · Bloqueo total · Las 3 Marías fallaron',
          nivel:         'BLOQUEO'
        };
        _registrarFallo({ maria: 'todas', razon: 'bloqueo_total', datos: resultados });
        _notificarCEO('BLOQUEO_TOTAL', resultados);
      }

      // ∆ envía su decisión final
      decision.marías = { m1: m1, m2: m2, m3: m3 };
      decision.timestamp = Date.now();

      callback(decision);
    });
  }

  /* ══ FUNCIONES INTERNAS DE ∆ ══ */
  function _registrarFallo(info){
    var fallos = JSON.parse(localStorage.getItem('marias_fallos') || '[]');
    fallos.push({ info: info, timestamp: Date.now() });
    if(fallos.length > 20) fallos = fallos.slice(-20);
    localStorage.setItem('marias_fallos', JSON.stringify(fallos));
  }

  function _notificarCEO(tipo, datos){
    // En producción: Supabase INSERT en tabla alertas_ceo
    console.warn('∆ → CEO · ALERTA: ' + tipo);
    var alertas = JSON.parse(localStorage.getItem('alertas_ceo') || '[]');
    alertas.push({ tipo: tipo, timestamp: Date.now() });
    localStorage.setItem('alertas_ceo', JSON.stringify(alertas));
  }

  /* ══ API PÚBLICA ══ */
  return {
    activar:              activar,
    MARIA1_comunicacion:  MARIA1_comunicacion,
    MARIA2_lineasVida:    MARIA2_lineasVida,
    MARIA3_posicionDigital: MARIA3_posicionDigital
  };

})();

/* ══ CÓMO PROTEGER UN HTML CON LAS 3 MARÍAS ══

Al inicio de cualquier papiro protegido:

TRES_MARIAS.activar(
  { accion: 'acceder_papiro', papiro: 'salon.html' },
  function(decision){
    if(!decision.aprobado){
      // Las Marías dijeron no
      document.body.innerHTML = '';
      window.location.href = 'login.html';
      return;
    }
    // Las Marías dijeron sí
    // Mostrar el contenido del papiro
    document.body.style.opacity = '1';
    console.log('∆ · ' + decision.mensaje);
  }
);

══ */

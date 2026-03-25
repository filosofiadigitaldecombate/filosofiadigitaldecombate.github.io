/* ══════════════════════════════════════════════════════════
   GRADO ° — MÓDULO DE ACCESO
   Creaxion Papiro © 2026 · X-7777777-LC7°

   ° ES EL ÚNICO QUE HABLA CON EL USUARIO.
   ° ES EL ÚNICO QUE PUEDE LLAMAR A ∆.
   ∆ NUNCA es accesible directamente.
   ∆ NUNCA habla con el usuario.
   ∆ NUNCA aparece en el frontend.

   REGLA DE ORO:
   Usuario → ° → ∆ → ° → Usuario
   ══════════════════════════════════════════════════════════ */

var GRADO = (function(){

  /* ══ CONFIGURACIÓN ══
     KEY_GRADO: solo lectura · va en el frontend
     KEY_DELTA: escritura total · NUNCA en frontend
     ∆ opera desde el servidor / Panel 48 / CEO ══ */

  var SUPABASE_URL = 'https://vdtdrijfcmttssfdtgva.supabase.co';
  var KEY_GRADO    = 'sb_publishable_PwlfxDM8vqAB_-LsJVMouw_Arg6epEB';
  // KEY_DELTA → NUNCA aquí · solo en Panel 48

  /* ══ CANAL PRIVADO HACIA ∆ ══
     ° guarda las solicitudes en una cola
     ∆ las procesa desde el servidor
     El usuario NUNCA ve esta cola ══ */
  var _colaSolicitudes = [];
  var _callbacksDelta  = {};

  /* ══════════════════════════════
     FUNCIONES PÚBLICAS DE °
     Solo lectura · Solo observación
     ══════════════════════════════ */

  /* ° VERIFICAR SI EL USUARIO EXISTE */
  function verificarUsuario(codigo, callback){
    _consultarSupabase(
      '/rest/v1/usuarios?codigo=eq.' + encodeURIComponent(codigo) + '&select=id,nombre,codigo,pixel_id,tipo,activo',
      function(data){
        if(!data || !data.length){
          callback({ existe: false, razon: 'no_encontrado' });
          return;
        }
        var u = data[0];
        if(!u.activo){
          callback({ existe: false, razon: 'bloqueado' });
          return;
        }
        // ° solo devuelve lo mínimo necesario
        callback({
          existe:   true,
          nombre:   u.nombre,
          codigo:   u.codigo,
          pixel_id: u.pixel_id,
          tipo:     u.tipo
          // ° NO devuelve: hash_sena · password · tokens · coords privadas
        });
      }
    );
  }

  /* ° VER CONTENIDO PÚBLICO DE UN PAPIRO */
  function verContenido(papiro_id, callback){
    _consultarSupabase(
      '/rest/v1/papiros?id=eq.' + papiro_id + '&select=titulo,contenido,autor_codigo,publico,fecha',
      function(data){
        if(!data || !data.length){
          callback({ ok: false, razon: 'no_encontrado' });
          return;
        }
        var p = data[0];
        if(!p.publico){
          callback({ ok: false, razon: 'privado' });
          return;
        }
        callback({ ok: true, papiro: p });
      }
    );
  }

  /* ° VER PIXEL ASIGNADO */
  function verPixel(pixel_id, callback){
    _consultarSupabase(
      '/rest/v1/pixels_cosmos?id=eq.' + pixel_id + '&select=mundo_id,cont_id,pais_id,tipo,activo',
      function(data){
        if(!data || !data.length){
          callback({ ok: false });
          return;
        }
        callback({ ok: true, pixel: data[0] });
      }
    );
  }

  /* ══════════════════════════════════
     ° SOLICITAR CAMBIO A ∆
     ° NUNCA ejecuta cambios directo
     ° solo empaqueta y pide permiso a ∆
     ∆ decide · ejecuta · confirma a °
     ══════════════════════════════════ */

  function pedirCambioA_Delta(tipo, datos, callback){
    var solicitud = {
      id:        'sol_' + Date.now(),
      tipo:      tipo,       // 'publicar_papiro' · 'cambiar_nombre' · etc
      datos:     datos,
      solicitante: localStorage.getItem('papiro_usuario') ?
        JSON.parse(localStorage.getItem('papiro_usuario')).codigo : 'desconocido',
      token_delta: localStorage.getItem('papiro_token_delta') || null,
      timestamp:   new Date().toISOString(),
      estado:      'pendiente'
    };

    // Guardar en cola local
    _colaSolicitudes.push(solicitud);
    _callbacksDelta[solicitud.id] = callback;

    /* En producción: enviar a Supabase tabla 'solicitudes_delta'
       ∆ las procesa desde el servidor
       ∆ actualiza el estado
       ° hace polling y llama al callback */
    _guardarSolicitudParaDelta(solicitud, callback);
  }

  /* ° CONFIRMAR RESULTADO de una acción */
  function confirmarAccion(solicitud_id, callback){
    _consultarSupabase(
      '/rest/v1/solicitudes_delta?id=eq.' + solicitud_id + '&select=estado,resultado,mensaje',
      function(data){
        if(!data || !data.length){
          callback({ ok: false, mensaje: 'Solicitud no encontrada' });
          return;
        }
        var s = data[0];
        callback({
          ok:       s.estado === 'aprobada',
          estado:   s.estado,
          mensaje:  s.mensaje || (s.estado === 'aprobada' ? '✦ Listo' : 'No fue posible')
        });
      }
    );
  }

  /* ══════════════════════════════
     FUNCIONES INTERNAS DE °
     No accesibles desde el exterior
     ══════════════════════════════ */

  function _consultarSupabase(endpoint, callback){
    fetch(SUPABASE_URL + endpoint, {
      method: 'GET',
      headers:{
        'apikey':        KEY_GRADO,
        'Authorization': 'Bearer ' + KEY_GRADO,
        'Content-Type':  'application/json'
      }
    })
    .then(function(r){ return r.json(); })
    .then(function(data){ callback(data); })
    .catch(function(e){
      console.log('° consulta fallida · ' + e.message);
      callback(null);
    });
  }

  function _guardarSolicitudParaDelta(solicitud, callback){
    /* ° guarda la solicitud para que ∆ la procese
       ∆ tiene su propia llave y procesa desde el servidor */
    fetch(SUPABASE_URL + '/rest/v1/solicitudes_delta', {
      method: 'POST',
      headers:{
        'apikey':        KEY_GRADO,
        'Authorization': 'Bearer ' + KEY_GRADO,
        'Content-Type':  'application/json',
        'Prefer':        'return=representation'
      },
      body: JSON.stringify(solicitud)
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      if(data && data[0]){
        // Confirmar que ∆ recibió la solicitud
        callback({
          ok:           false, // aún no ejecutado
          pendiente:    true,
          solicitud_id: data[0].id,
          mensaje:      '∆ procesando tu solicitud...'
        });
      }
    })
    .catch(function(e){
      // Sin internet · guardar localmente
      var pendientes = JSON.parse(localStorage.getItem('grado_pendientes') || '[]');
      pendientes.push(solicitud);
      localStorage.setItem('grado_pendientes', JSON.stringify(pendientes));
      callback({ ok: false, pendiente: true, offline: true, mensaje: 'Sin conexión · guardado localmente' });
    });
  }

  /* ══ API PÚBLICA DE ° ══ */
  return {
    verificarUsuario:    verificarUsuario,
    verContenido:        verContenido,
    verPixel:            verPixel,
    pedirCambioA_Delta:  pedirCambioA_Delta,
    confirmarAccion:     confirmarAccion
  };

  /* ∆ NO está en este objeto.
     ∆ NO es accesible desde el exterior.
     ∆ opera en silencio desde el servidor.
     Solo el Panel 48 y el CEO pueden invocarlo. */

})();

/* ══ USO EN EL LOGIN ══

// PASO 1 — ° verifica si el usuario existe
GRADO.verificarUsuario(codigo_ingresado, function(resultado){
  if(!resultado.existe){
    mostrarError('Usuario no encontrado');
    return;
  }
  // PASO 2 — ° pide a ∆ que valide la seña
  GRADO.pedirCambioA_Delta('validar_sena', {
    codigo: codigo_ingresado,
    hash_sena: hash(sena_ingresada)
  }, function(respuesta){
    if(!respuesta.ok && !respuesta.pendiente){
      mostrarError('Seña incorrecta');
      return;
    }
    // ∆ validó · ° activa la sesión
    activarSesion(resultado);
  });
});

══ */


/* ══════════════════════════════════════════════════════════
   PROTOCOLO DE DOS VIAJES — ° y ∆
   
   Cada acción del usuario requiere DOS viajes:
   VIAJE 1: ° pregunta a ∆ si puede hacerlo
   VIAJE 2: ° trae el resultado · ∆ lo inspecciona
   ══════════════════════════════════════════════════════════ */

var PROTOCOLO = (function(){

  /* ══ VIAJE 1 — ° PREGUNTA A ∆ ══
     "¿Puede este usuario hacer esta acción?" */
  function viaje1_puedeHacerlo(usuario_codigo, accion, contexto, callback){
    console.log('° → ∆ · VIAJE 1 · ' + accion + ' · ' + usuario_codigo);

    /* ° empaqueta la consulta */
    var consulta = {
      viaje:    1,
      usuario:  usuario_codigo,
      accion:   accion,    // 'cambiar_imagen' · 'publicar_papiro' · etc
      contexto: contexto,  // datos adicionales de contexto
      token:    localStorage.getItem('papiro_token_delta'),
      timestamp: Date.now()
    };

    /* ∆ responde (simulado · en prod: Supabase Edge Function) */
    _simularRespuestaDelta_v1(consulta, function(respuesta_delta){
      if(respuesta_delta.aprobado){
        console.log('∆ → ° · VIAJE 1 APROBADO · ' + respuesta_delta.instruccion);
        callback({
          aprobado:    true,
          instruccion: respuesta_delta.instruccion, // "envíalo al papiro X"
          papiro_destino: respuesta_delta.papiro_destino,
          id_solicitud: respuesta_delta.id_solicitud
        });
      } else {
        console.log('∆ → ° · VIAJE 1 DENEGADO · ' + respuesta_delta.razon);
        callback({
          aprobado: false,
          razon:    respuesta_delta.razon
        });
      }
    });
  }

  /* ══ VIAJE 2 — ° REGRESA CON EL RESULTADO ══
     "Aquí está lo que el usuario trajo · ∆ inspecciona" */
  function viaje2_inspeccionaDelta(id_solicitud, resultado_usuario, callback){
    console.log('° → ∆ · VIAJE 2 · inspeccionando · id: ' + id_solicitud);

    /* ° trae el resultado del usuario para que ∆ lo revise */
    var inspeccion = {
      viaje:         2,
      id_solicitud:  id_solicitud,
      resultado:     resultado_usuario,
      token:         localStorage.getItem('papiro_token_delta'),
      timestamp:     Date.now()
    };

    /* ∆ inspecciona (simulado · en prod: Supabase Edge Function) */
    _simularRespuestaDelta_v2(inspeccion, function(veredicto){
      console.log('∆ → ° · VIAJE 2 · veredicto: ' + veredicto.estado);
      callback(veredicto);
    });
  }

  /* ══ SIMULACIÓN DE ∆ — VIAJE 1 ══
     En producción: Supabase Edge Function con KEY_DELTA
     ∆ verifica contra la BD real ══ */
  function _simularRespuestaDelta_v1(consulta, callback){
    var sesion = localStorage.getItem('papiro_usuario');
    var u = sesion ? JSON.parse(sesion) : null;

    // ∆ verifica: ¿existe el usuario?
    if(!u || u.codigo !== consulta.usuario){
      callback({ aprobado: false, razon: 'usuario_no_encontrado' });
      return;
    }

    // ∆ verifica: ¿tiene token válido?
    if(!consulta.token){
      callback({ aprobado: false, razon: 'sin_token_delta' });
      return;
    }

    // ∆ decide según la acción solicitada
    var respuestas = {
      'cambiar_imagen_perfil': {
        aprobado: true,
        instruccion: 'Envíalo al papiro de subida de imagen · válido por 5 minutos',
        papiro_destino: 'subir_imagen.html',
        id_solicitud: 'sol_' + Date.now()
      },
      'publicar_papiro': {
        aprobado: true,
        instruccion: 'Envíalo al editor · válido por 30 minutos',
        papiro_destino: 'editor_papiro.html',
        id_solicitud: 'sol_' + Date.now()
      },
      'cambiar_nombre': {
        aprobado: true,
        instruccion: 'Muéstrale el formulario de nombre · una sola vez',
        papiro_destino: 'editar_perfil.html',
        id_solicitud: 'sol_' + Date.now()
      },
    };

    var resp = respuestas[consulta.accion] || {
      aprobado: false, razon: 'accion_no_reconocida'
    };

    setTimeout(function(){ callback(resp); }, 300);
  }

  /* ══ SIMULACIÓN DE ∆ — VIAJE 2 ══
     ∆ inspecciona lo que el usuario trajo ══ */
  function _simularRespuestaDelta_v2(inspeccion, callback){
    var resultado = inspeccion.resultado;
    var problemas = [];

    // ∆ INSPECCIÓN 1 — ¿Es una imagen real?
    if(resultado.tipo === 'imagen'){
      var tipos_validos = ['image/jpeg','image/png','image/webp','image/svg+xml'];
      if(tipos_validos.indexOf(resultado.mime) < 0){
        problemas.push('formato_invalido');
      }
      if(resultado.tamano > 2 * 1024 * 1024){
        problemas.push('tamano_excedido');
      }
    }

    // ∆ INSPECCIÓN 2 — ¿El título es normal?
    if(resultado.titulo){
      var titulo = resultado.titulo;
      var patrones_malos = [/<script/i, /javascript:/i, /onclick/i, /onerror/i, /eval\(/i];
      patrones_malos.forEach(function(p){
        if(p.test(titulo)) problemas.push('titulo_sospechoso');
      });
      if(titulo.length > 120) problemas.push('titulo_muy_largo');
    }

    // ∆ INSPECCIÓN 3 — ¿Viene por canales regulares de Papiro?
    if(!inspeccion.token){
      problemas.push('sin_token_delta');
    }
    if(!inspeccion.id_solicitud || !inspeccion.id_solicitud.startsWith('sol_')){
      problemas.push('solicitud_invalida');
    }

    // ∆ INSPECCIÓN 4 — ¿Tiene malas intenciones?
    // Verificar que no es un bot (velocidad de respuesta)
    var tiempo_transcurrido = Date.now() - parseInt(inspeccion.id_solicitud.replace('sol_',''));
    if(tiempo_transcurrido < 500){ // menos de 0.5s = bot
      problemas.push('velocidad_sospechosa');
    }

    // ∆ DA SU VEREDICTO
    setTimeout(function(){
      if(problemas.length === 0){
        callback({
          estado:   'aprobado',
          mensaje:  '∆ dice: siii · todo está bien · cargando...',
          ejecutar: true
        });
      } else {
        // Registrar en amenazas
        var amenazas = JSON.parse(localStorage.getItem('papiro_amenazas_local') || '[]');
        amenazas.push({ problemas: problemas, timestamp: Date.now() });
        localStorage.setItem('papiro_amenazas_local', JSON.stringify(amenazas));

        callback({
          estado:   'denegado',
          mensaje:  '∆ encontró problemas · no se puede procesar',
          problemas: problemas,
          ejecutar:  false
        });
      }
    }, 300);
  }

  /* ══ API PÚBLICA DEL PROTOCOLO ══ */
  return {
    viaje1_puedeHacerlo:    viaje1_puedeHacerlo,
    viaje2_inspeccionaDelta: viaje2_inspeccionaDelta
  };

})();

/* ══ EJEMPLO DE USO EN LA APP ══

// Usuario quiere cambiar su imagen de perfil:

// VIAJE 1 — ¿puede?
PROTOCOLO.viaje1_puedeHacerlo(
  usuario.codigo,
  'cambiar_imagen_perfil',
  { desde: 'perfil' },
  function(respuesta){
    if(!respuesta.aprobado){
      mostrar('No tienes permiso'); return;
    }
    // ∆ aprobó · enviar al papiro de subida
    abrirPapiroSubida(respuesta.papiro_destino, respuesta.id_solicitud);
  }
);

// Cuando el usuario sube la imagen:
// VIAJE 2 — ∆ inspecciona
PROTOCOLO.viaje2_inspeccionaDelta(
  id_solicitud,
  {
    tipo:   'imagen',
    mime:   archivo.type,
    tamano: archivo.size,
    titulo: nombre_del_archivo
  },
  function(veredicto){
    if(veredicto.ejecutar){
      // ∆ aprobó · subir la imagen
      subirImagen(archivo);
      mostrar('✦ Imagen cargando...');
    } else {
      mostrar('No fue posible · intenta de nuevo');
    }
  }
);

══ */

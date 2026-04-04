// ═══════════════════════════════════════════════════════════════
// P∆PIR° · SISTEMA MAESTRO DE IDIOMAS
// Para agregar un nuevo idioma: agrega una entrada a este objeto
// Eso es todo. El sistema hace el resto automáticamente.
// ═══════════════════════════════════════════════════════════════

const PAPIRO_IDIOMAS = {

  // ── ESPAÑOL ──────────────────────────────────────────────────
  es: {
    codigo: 'es',
    nombre: 'Español',
    bandera: '🇪🇸',     // ESPAÑA — fundadora del español
    siglas: 'ES',
    dir: 'ltr',

    // RECEPCIÓN
    rec_sub: 'CREAXION PAPIRO',
    rec_slogan: 'Digitalidad Sana y Segura',
    rec_visitante: 'VISITANTE',
    rec_sesion: 'INICIAR SESIÓN',

    // VISITANTE
    vis_modo: 'Modo Visitante · Digitalidad Sana y Segura',
    vis_video_titulo: 'La Batalla Actual',
    vis_video_desc: 'Luis Alfonso Castillejo · Venezuela · La verdad que no se puede silenciar · ∆° · LC7°',
    vis_mision_titulo: 'P∆PIR° · Tu espacio real',
    vis_mision: [
      'Aquí puedes hacer <em>reclamos públicos reales</em>. Donde si tienes la razón y tus videos o pruebas lo confirman, <strong>no te juzgaremos, no te polarizaremos</strong> y mucho menos maquillaremos tu mensaje para evitar que tenga el impacto que necesitas transmitir.',
      'Sabemos que las redes sociales son algo importante y crucial en el día a día. Y para los asuntos de vital importancia, mucho más todavía — porque muchas veces la vida, las vidas, o el mundo depende de <em>una buena y verdadera información bien proyectada al mundo entero</em> para que tenga el impacto necesario.',
      'Recuerda: <strong>por la Verdad murió Cristo.</strong> Esperamos hayas comprendido nuestra prioridad — que tu espacio sea real y sobre todo <em>realmente tuyo</em>, donde tu verdad no sea silenciada.',
      'Así como aquí lo comprueba nuestro CEO Luis Alfonso Castillejo — venezolano, exiliado, candidato presidencial, militar retirado — que desde el exilio en Brasil sigue alzando la voz por Venezuela y por el mundo.',
    ],
    vis_firma: '— ∆° · Creaxion Papiro · X-7777777-LC7° · SI° · En el nombre de Jesús',
    vis_final: 'P∆PIR° no es otra red social. Es tu lienzo digital — limpio, tuyo, seguro. Cada papiro es un espacio de expresión donde tu verdad tiene el formato, el peso y el alcance que merece.',
    vis_cta: 'Regístrate. Tu voz importa.',
    btn_registro: '✦ REGISTRARME EN P∆PIR°',
    btn_volver: '← VOLVER A LA RECEPCIÓN',
    codigo_honor: 'CÓDIGO DE HONOR IM. #7 — Así lo he hecho',
    fundador: 'Fundador · Creaxion Papiro © 2026',
    fe: 'En el nombre de Jesús · SI° · 🙏',

    // CONTADOR
    contador_label: 'visitantes',
  },

  // ── INGLÉS ────────────────────────────────────────────────────
  en: {
    codigo: 'en',
    nombre: 'English',
    bandera: '🇬🇧',     // INGLATERRA — fundadora del inglés
    siglas: 'EN',
    dir: 'ltr',

    rec_sub: 'CREAXION PAPIRO',
    rec_slogan: 'Healthy & Safe Digitality',
    rec_visitante: 'VISITOR',
    rec_sesion: 'SIGN IN',

    vis_modo: 'Visitor Mode · Healthy & Safe Digitality',
    vis_video_titulo: 'The Current Battle',
    vis_video_desc: 'Luis Alfonso Castillejo · Venezuela · The truth that cannot be silenced · ∆° · LC7°',
    vis_mision_titulo: 'P∆PIR° · Your Real Space',
    vis_mision: [
      'Here you can make <em>real public claims</em>. If you are right and your videos or evidence confirm it, <strong>we will not judge you, we will not polarize you</strong> and we will certainly not sugarcoat your message to reduce the impact it needs to have.',
      'We know that social media is something important and crucial in everyday life. And for matters of vital importance, even more so — because many times life, lives, or the world depends on <em>good, true information well projected to the entire world</em> to have the necessary impact.',
      'Remember: <strong>Christ died for the Truth.</strong> We hope you understand our priority — that your space is real and above all <em>truly yours</em>, where your truth is not silenced.',
      'Just as our CEO Luis Alfonso Castillejo demonstrates here — Venezuelan, in exile, presidential candidate, retired military officer — who from exile in Brazil continues to raise his voice for Venezuela and the world.',
    ],
    vis_firma: '— ∆° · Creaxion Papiro · X-7777777-LC7° · SI° · In the name of Jesus',
    vis_final: 'P∆PIR° is not another social network. It is your digital canvas — clean, yours, safe. Each papiro is a space where your truth has the format, weight, and reach it deserves.',
    vis_cta: 'Sign up. Your voice matters.',
    btn_registro: '✦ JOIN P∆PIR°',
    btn_volver: '← BACK TO RECEPTION',
    codigo_honor: 'CODE OF HONOR IM. #7 — So I have done it',
    fundador: 'Founder · Creaxion Papiro © 2026',
    fe: 'In the name of Jesus · SI° · 🙏',
    contador_label: 'visitors',
  },

  // ── PORTUGUÊS ────────────────────────────────────────────────
  pt: {
    codigo: 'pt',
    nombre: 'Português',
    bandera: '🇵🇹',     // PORTUGAL — fundadora do português
    siglas: 'PT',
    dir: 'ltr',

    rec_sub: 'CREAXION PAPIRO',
    rec_slogan: 'Digitalidade Saudável e Segura',
    rec_visitante: 'VISITANTE',
    rec_sesion: 'ENTRAR',

    vis_modo: 'Modo Visitante · Digitalidade Saudável e Segura',
    vis_video_titulo: 'A Batalha Atual',
    vis_video_desc: 'Luis Alfonso Castillejo · Venezuela · A verdade que não pode ser silenciada · ∆° · LC7°',
    vis_mision_titulo: 'P∆PIR° · O teu espaço real',
    vis_mision: [
      'Aqui podes fazer <em>reclamações públicas reais</em>. Se tens razão e os teus vídeos ou provas o confirmam, <strong>não te julgamos, não te polarizamos</strong> e muito menos disfarçamos a tua mensagem para evitar que tenha o impacto que precisas transmitir.',
      'Sabemos que as redes sociais são algo importante e crucial no dia a dia. E para assuntos de vital importância, muito mais ainda — porque muitas vezes a vida, as vidas ou o mundo depende de <em>uma boa e verdadeira informação bem projetada para o mundo inteiro</em> para ter o impacto necessário.',
      'Lembra-te: <strong>Cristo morreu pela Verdade.</strong> Esperamos que tenhas compreendido a nossa prioridade — que o teu espaço seja real e sobretudo <em>verdadeiramente teu</em>, onde a tua verdade não seja silenciada.',
      'Assim como aqui o comprova o nosso CEO Luis Alfonso Castillejo — venezuelano, no exílio, candidato presidencial, militar reformado — que desde o exílio no Brasil continua a levantar a voz pela Venezuela e pelo mundo.',
    ],
    vis_firma: '— ∆° · Creaxion Papiro · X-7777777-LC7° · SI° · Em nome de Jesus',
    vis_final: 'P∆PIR° não é mais uma rede social. É a tua tela digital — limpa, tua, segura. Cada papiro é um espaço onde a tua verdade tem o formato, o peso e o alcance que merece.',
    vis_cta: 'Regista-te. A tua voz importa.',
    btn_registro: '✦ REGISTAR EM P∆PIR°',
    btn_volver: '← VOLTAR À RECEPÇÃO',
    codigo_honor: 'CÓDIGO DE HONRA IM. #7 — Assim o fiz',
    fundador: 'Fundador · Creaxion Papiro © 2026',
    fe: 'Em nome de Jesus · SI° · 🙏',
    contador_label: 'visitantes',
  },

  // ── ΕΛΛΗΝΙΚΆ (GRIEGO) ──────────────────────────────────────────
  el: {
    codigo: 'el',
    nombre: 'Ελληνικά',
    bandera: '🇬🇷',     // GRECIA
    siglas: 'EL',
    dir: 'ltr',

    rec_sub: 'CREAXION PAPIRO',
    rec_slogan: 'Υγιής & Ασφαλής Ψηφιακότητα',
    rec_visitante: 'ΕΠΙΣΚΕΠΤΗΣ',
    rec_sesion: 'ΣΥΝΔΕΣΗ',

    vis_modo: 'Λειτουργία Επισκέπτη · Υγιής & Ασφαλής Ψηφιακότητα',
    vis_video_titulo: 'Η Τρέχουσα Μάχη',
    vis_video_desc: 'Luis Alfonso Castillejo · Βενεζουέλα · Η αλήθεια που δεν μπορεί να αποσιωπηθεί · ∆° · LC7°',
    vis_mision_titulo: 'P∆PIR° · Ο χώρος σου',
    vis_mision: [
      'Εδώ μπορείς να κάνεις <em>δημόσιες καταγγελίες</em>. Αν έχεις δίκιο και τα βίντεό σου το επιβεβαιώνουν, <strong>δεν θα σε κρίνουμε, δεν θα σε πολώσουμε</strong> και σίγουρα δεν θα χρωματίσουμε το μήνυμά σου.',
      'Γνωρίζουμε ότι τα κοινωνικά δίκτυα είναι κάτι σημαντικό στην καθημερινή ζωή. Και για ζητήματα ζωτικής σημασίας, ακόμη περισσότερο — γιατί πολλές φορές η ζωή εξαρτάται από <em>μια καλή και αληθινή πληροφορία</em> που προβάλλεται σωστά σε όλο τον κόσμο.',
      'Θυμήσου: <strong>ο Χριστός πέθανε για την Αλήθεια.</strong> Ελπίζουμε να έχεις καταλάβει την προτεραιότητά μας — ότι ο χώρος σου είναι πραγματικός και <em>πραγματικά δικός σου</em>.',
      'Όπως το αποδεικνύει εδώ ο CEO μας Luis Alfonso Castillejo — Βενεζουελάνος, εξόριστος, υποψήφιος Πρόεδρος, στρατιωτικός — που από την εξορία στη Βραζιλία συνεχίζει να μιλά για τη Βενεζουέλα και τον κόσμο.',
    ],
    vis_firma: '— ∆° · Creaxion Papiro · X-7777777-LC7° · SI° · Στο όνομα του Ιησού',
    vis_final: 'P∆PIR° δεν είναι ένα άλλο κοινωνικό δίκτυο. Είναι ο ψηφιακός καμβάς σου — καθαρός, δικός σου, ασφαλής.',
    vis_cta: 'Εγγράψου. Η φωνή σου μετράει.',
    btn_registro: '✦ ΕΓΓΡΑΦΗ ΣΤΟ P∆PIR°',
    btn_volver: '← ΕΠΙΣΤΡΟΦΗ ΣΤΗ ΡΕΣΕΨΙΟΝ',
    codigo_honor: 'ΚΩΔΙΚΑΣ ΤΙΜΗΣ IM. #7 — Έτσι το έπραξα',
    fundador: 'Ιδρυτής · Creaxion Papiro © 2026',
    fe: 'Στο όνομα του Ιησού · SI° · 🙏',
    contador_label: 'επισκέπτες',
  },

  // ═══════════════════════════════════════════════════════════════
  // PARA AGREGAR UN NUEVO IDIOMA (ejemplo: Chino):
  // zh: {
  //   codigo: 'zh', nombre: '中文', bandera: '🇨🇳', siglas: 'ZH',
  //   rec_slogan: '健康安全的数字化', rec_visitante: '访客', rec_sesion: '登录',
  //   ... etc ...
  // }
  // Luego Claude genera el ZIP con ese idioma y lo subes.
  // El sistema lo integra automáticamente. Sin borrar nada.
  // ═══════════════════════════════════════════════════════════════

};

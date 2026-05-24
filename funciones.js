/* Variables principales del desbloqueo
  pinCorrecto es el PIN de demostración
  pinIngresado guarda lo que el usuario va escribiendo.*/

let pinCorrecto = "1234";
let pinIngresado = "";

/*Variables para seguridad.
  intentosFallidos cuenta cuántas veces se equivocó el usuario.
  celularBloqueado indica si el celular está bloqueado temporalmente.
*/
let intentosFallidos = 0;
/* guarda los fallos que se muestran en la app Seguridad. */
let intentosSeguridad = 0;
let celularBloqueado = false;
let tiempoBloqueo = 0;
let alertasSeguridad = [];
let usuarioActivo = "Admin";
let usuarioLogin = "Admin";
let mensajeLogin = "Inicia sesion para cambiar los permisos.";

/* usuarios y claves guardadas con cifrado simple educativo. */
const usuariosSeguridad = {
  Admin: cifrarContrasena("admin123"),
  Invitado: cifrarContrasena("invitado123")
};

/* guardamos elementos del html para usarlos fácilmente en JavaScript. */
const horaBarra = document.getElementById("horaBarra");
const horaBloqueo = document.getElementById("horaBloqueo");
const fechaBloqueo = document.getElementById("fechaBloqueo");

const mensajeDesbloqueo = document.getElementById("mensajeDesbloqueo");
const mensajeBloqueoTemporal = document.getElementById("mensajeBloqueoTemporal");

const botonesTeclado = document.querySelectorAll(".teclado-pin button");
const puntosPin = document.querySelectorAll(".puntos-pin span");

//bloquea el celular otra vez
const botonBloquear = document.getElementById("botonBloquear");
const botonesApps = document.querySelectorAll(".icono-app");
const botonVolverInicio = document.getElementById("botonVolverInicio");
const botonCerrarApp = document.getElementById("botonCerrarApp");
const tituloApp = document.getElementById("tituloApp");
const subtituloApp = document.getElementById("subtituloApp");
const contenidoApp = document.getElementById("contenidoApp");
const appsInstaladasInicio = document.getElementById("appsInstaladasInicio");
const usuarioInicio = document.getElementById("usuarioInicio");
const alertaSistema = document.getElementById("alertaSistema");
const tituloAlertaSistema = document.getElementById("tituloAlertaSistema");
const textoAlertaSistema = document.getElementById("textoAlertaSistema");
const cerrarAlertaSistema = document.getElementById("cerrarAlertaSistema");

/* procesos simulados que siempre están activos en el iPhone. */
const procesosSistema = [
  { nombre: "securityd", descripcion: "Seguridad y permisos", memoria: 45, prioridad: 2, estado: "Ejecucion" },
  { nombre: "mediaserverd", descripcion: "Audio, video y camara", memoria: 85, prioridad: 3, estado: "Ejecucion" },
  { nombre: "wifid", descripcion: "Conexion WiFi", memoria: 50, prioridad: 3, estado: "Ejecucion" },
  { nombre: "powerd", descripcion: "Bateria y energia", memoria: 35, prioridad: 2, estado: "Ejecucion" },
  { nombre: "notifyd", descripcion: "Notificaciones del sistema", memoria: 30, prioridad: 3, estado: "Listo" },
  { nombre: "backboardd", descripcion: "Toque, botones y pantalla", memoria: 65, prioridad: 1, estado: "Ejecucion" },
  { nombre: "bluetoothd", descripcion: "Conexion Bluetooth", memoria: 42, prioridad: 3, estado: "Listo" },
  { nombre: "locationd", descripcion: "Ubicacion GPS", memoria: 55, prioridad: 3, estado: "Ejecucion" }
];

let intervaloProcesos = null;
let turnoPlanificador = 0;
let procesoEnCpu = "Preparando CPU";
let cicloProcesoTemporal = 0;
let prioridadCpuActual = 1;
let explicacionPlanificador = "Prioridad 1 tiene mas turnos por ser del sistema.";
let turnosCpuProcesos = {};

/* proceso temporal para mostrar todos los estados del ciclo de vida. */
const procesoTemporal = { nombre: "installd", descripcion: "Instalacion del sistema", memoria: 18, prioridad: 2, estado: "Nuevo" };

/* subtareas de la Camara que trabajan como hilos. */
const subtareasCamara = [
  { nombre: "Capturar imagen", descripcion: "Recibe datos del sensor", estado: "Listo", turnos: 0 },
  { nombre: "Procesar color", descripcion: "Ajusta luz y color", estado: "Listo", turnos: 0 },
  { nombre: "Guardar archivo", descripcion: "Escribe la foto en Archivos", estado: "Listo", turnos: 0 }
];

/* dispositivos para simular conexiones del iPhone. */
const dispositivosEntradaSalida = [
  { id: "audifonos", icono: "🎧", nombre: "AirPods", tipo: "Salida de audio", proceso: "bluetoothd", conectado: false },
  { id: "controlXbox", icono: "🎮", nombre: "Control de Xbox", tipo: "Control inalambrico", proceso: "bluetoothd", conectado: false },
  { id: "impresora", icono: "🖨️", nombre: "Impresora", tipo: "Impresion por WiFi", proceso: "wifid", conectado: false },
  { id: "smartwatch", icono: "⌚", nombre: "Smartwatch", tipo: "Accesorio Bluetooth", proceso: "bluetoothd", conectado: false }
];

/* guarda el ultimo cambio mostrado en dispositivos. */
let mensajeEntradaSalida = "Selecciona un dispositivo para conectarlo.";

/* fotos tomadas con la camara y carpeta que se esta viendo. */
let fotosCamara = [];
let fotosEliminadas = [];
let numeroFoto = 0;
let carpetaArchivosActual = "inicio";
let mensajeCamara = "Apunta y toca el boton para tomar una foto.";
let mensajeArchivos = "";
let albumFotosActual = "biblioteca";
let modoSeleccionFotos = false;
let fotosSeleccionadas = [];
let mensajeFotos = "";

/* notas guardadas en iCloud o localmente en el iPhone. */
let notasGuardadas = {
  icloud: [],
  iphone: []
};
let carpetaNotasActual = "inicio";
let notaActual = -1;
let mensajeNotas = "";

/* documentos creados en la app descargada. */
let documentosGuardados = [];
let documentosEliminados = [];
let documentoActual = -1;
let vistaDocumentos = "lista";
let mensajeDocumentos = "";
let etiquetaArchivosActual = "";
let menuEtiquetaDocumento = -1;

/* etiquetas de color disponibles para clasificar documentos. */
const etiquetasDocumentos = [
  { id: "rojo", nombre: "Rojo" },
  { id: "naranja", nombre: "Naranja" },
  { id: "amarillo", nombre: "Amarillo" },
  { id: "verde", nombre: "Verde" },
  { id: "azul", nombre: "Azul" },
  { id: "morado", nombre: "Morado" },
  { id: "gris", nombre: "Gris" }
];

/* estados simples para apps descargables agregadas al simulador. */
let seccionInstagram = "inicio";
let publicacionesInstagram = [
  { usuario: "diego.rojas", texto: "Probando el simulador de iOS desde Instagram.", likes: 18 }
];
let mensajesInstagram = [
  { autor: "Ricardo", texto: "¿Ya terminaste el simulador?" }
];
let mensajeInstagram = "";

let mensajesWhatsApp = [
  { autor: "Ricardo", texto: "Hola Diego, mándame el avance cuando puedas." }
];
let mensajeWhatsApp = "Chat protegido con cifrado de extremo a extremo.";
let fotosRecibidasWhatsApp = 0;

let seccionTeams = "chat";
let mensajesTeams = [
  { autor: "Equipo SO", texto: "Suban evidencia del simulador antes de la clase." }
];
let tareasTeams = [
  { titulo: "Mejorar interfaz del simulador", completada: false },
  { titulo: "Explicar instalación segura desde App Store", completada: false }
];
let eventosTeams = [
  { titulo: "Revisión del proyecto", hora: "10:00" }
];
let notificacionesTeams = true;
let mensajeTeams = "Teams sincronizado con el equipo Sistemas Operativos.";

let urlSafari = "teams.microsoft.com/download";
/* controla si Safari ya intento instalar una app externa. */
let intentoInstalacionSafari = false;
/* guarda el aviso de seguridad que aparece despues de intentar instalar desde Safari. */
let mensajeSafari = "";
let historialSafari = ["teams.microsoft.com/download", "apple.com", "support.apple.com"];

/* apps simuladas disponibles en la App Store. */
const appsTienda = [
  { id: "instagram", nombre: "Instagram", gb: 3.5, ram: 480, color: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)", categoria: "Red social" },
  { id: "whatsapp", nombre: "WhatsApp", gb: 1.4, ram: 360, color: "#25d366", categoria: "Mensajeria" },
  { id: "teams", nombre: "Microsoft Teams", gb: 2.6, ram: 430, color: "#6264a7", categoria: "Productividad" },
  { id: "notas", nombre: "Notas", gb: 0.7, ram: 180, color: "linear-gradient(180deg, #fffdf8 0 36%, #ffd60a 37% 100%)", categoria: "Productividad" },
  { id: "documentos", nombre: "Documentos", gb: 0.9, ram: 220, color: "#ff9500", categoria: "Archivos" }
];

/* arreglo donde se guardan las apps instaladas. */
let appsInstaladas = [];

/* guarda el proceso visual de instalar, eliminar o actualizar. */
let appsCargando = {};

/* Mensaje mostrado cuando se intenta instalar una app fuera de App Store. */
let mensajeInstalacionExterna = "Instala apps desde App Store. Safari o archivos externos no pueden agregar apps al iPhone.";

/* historial de apps que se han abierto. */
let appsRecientes = [];

/* guarda la app activa y las que pasan a memoria virtual. */
let appActual = null;
let appsEnMemoriaVirtual = [];
const marcosRamApps = 3;
let eventoLru = "Abre cuatro apps para activar la paginacion.";

/* memoria usada por cada app del simulador. */
const memoriaApps = {
  appstore: 420,
  procesos: 260,
  memoria: 300,
  archivos: 210,
  camara: 360,
  fotos: 240,
  notas: 180,
  documentos: 220,
  seguridad: 230,
  ajustes: 250,
  instagram: 480,
  whatsapp: 360,
  teams: 430,
  safari: 310
};

/* datos base del almacenamiento del iPhone. */
const almacenamientoBase = [
  { nombre: "Fotos", gb: 32, color: "#ff375f" },
  { nombre: "Sistema iOS", gb: 12, color: "#8e8e93" },
  { nombre: "Multimedia", gb: 9, color: "#ff9f0a" },
  { nombre: "Documentos", gb: 6, color: "#30d158" }
];

/* capacidad total y espacio usado por apps base del sistema. */
const capacidadTotal = 128;
const appsBaseGb = 24;

/* funcion que obtiene el nombre visible de una app. */
function obtenerNombreApp(idApp) {
  const nombresApps = {
    appstore: "App Store",
    safari: "Safari",
    procesos: "Procesos",
    memoria: "Diagnostico",
    archivos: "Archivos",
    camara: "Camara",
    fotos: "Fotos",
    notas: "Notas",
    documentos: "Documentos",
    seguridad: "Seguridad",
    ajustes: "Ajustes",
    recientes: "Recientes",
    whatsapp: "WhatsApp",
    teams: "Microsoft Teams",
    instagram: "Instagram"
  };

  const appInstalada = appsTienda.find(function (app) {
    return app.id === idApp;
  });

  if (appInstalada) {
    return appInstalada.nombre;
  }

  return nombresApps[idApp] || "App";
}

/* devuelve las clases para dibujar iconos sin usar iniciales. */
function obtenerClaseIconoApp(idApp) {
  const clases = {
    appstore: "appstore",
    safari: "safari",
    procesos: "procesos",
    memoria: "memoria",
    archivos: "archivos",
    camara: "camara",
    fotos: "fotos",
    notas: "notas",
    documentos: "documentos",
    seguridad: "seguridad",
    ajustes: "ajustes",
    recientes: "recientes",
    instagram: "instagram",
    whatsapp: "whatsapp",
    teams: "teams"
  };

  return clases[idApp] || "app-generica";
}

/* devuelve el dibujo interno del icono. */
function obtenerLogoApp(idApp) {
  const logos = {
    appstore: "logo-appstore",
    safari: "logo-safari",
    procesos: "logo-procesos",
    memoria: "logo-diagnostico",
    archivos: "logo-archivos",
    camara: "logo-camara",
    fotos: "logo-fotos",
    notas: "logo-notas",
    documentos: "logo-documentos",
    seguridad: "logo-seguridad",
    ajustes: "logo-ajustes",
    recientes: "logo-recientes",
    instagram: "logo-instagram",
    whatsapp: "logo-whatsapp",
    teams: "logo-teams"
  };

  return logos[idApp] || "logo-generico";
}

/* arma el icono completo para el inicio y el dock. */
function crearIconoApp(idApp, claseExtra) {
  const clase = obtenerClaseIconoApp(idApp);
  const logo = obtenerLogoApp(idApp);
  const extra = claseExtra ? " " + claseExtra : "";

  return "<span class='burbuja-app " + clase + extra + "'><span class='sim-logo " + logo + "'></span></span>";
}

/* arma el icono pequeño usado dentro de App Store. */
function crearIconoTienda(idApp) {
  return "<span class='icono-tienda " + obtenerClaseIconoApp(idApp) + "'><span class='sim-logo " + obtenerLogoApp(idApp) + "'></span></span>";
}


/* funcion que pone las apps descargadas en el inicio. */
function dibujarAppsInstaladasInicio() {
  let appsHtml = "";

  appsInstaladas.forEach(function (idApp) {
    const app = appsTienda.find(function (appTienda) {
      return appTienda.id === idApp;
    });

    if (app) {
      appsHtml += "<button class='icono-app' data-app-instalada='" + app.id + "'>" +
        crearIconoApp(app.id, 'app-descargada') +
        "<span>" + app.nombre + "</span>" +
      "</button>";
    }
  });

  appsInstaladasInicio.innerHTML = appsHtml;

  document.querySelectorAll("[data-app-instalada]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      abrirApp(boton.dataset.appInstalada);
    });
  });
}

/* funcion que guarda la app abierta en recientes. */
function registrarAppReciente(idApp) {
  appActual = idApp;
  appsRecientes = appsRecientes.filter(function (app) {
    return app !== idApp;
  });

  /* coloca primero la ultima app abierta. */
  appsRecientes.unshift(idApp);

  if (appsRecientes.length > 6) {
    appsRecientes.pop();
  }

  actualizarMemoriaVirtual();
}

/* funcion que decide que apps pasan a memoria virtual. */
function actualizarMemoriaVirtual() {
  const virtualAnterior = appsEnMemoriaVirtual.slice();
  appsEnMemoriaVirtual = [];

  /* solo tres apps quedan en RAM; desde la cuarta pasan a virtual. */
  if (appsRecientes.length > marcosRamApps) {
    appsEnMemoriaVirtual = appsRecientes.slice(marcosRamApps);
  }

  const appMovida = appsEnMemoriaVirtual.find(function (idApp) {
    return !virtualAnterior.includes(idApp);
  });

  if (appMovida) {
    eventoLru = obtenerNombreApp(appMovida) + " era la menos usada y paso a memoria virtual.";
  } else if (appsEnMemoriaVirtual.length === 0) {
    eventoLru = "Abre cuatro apps para activar la paginacion.";
  }
}

/* funcion que devuelve el estado de una app reciente. */
function obtenerEstadoApp(idApp) {
  if (idApp === appActual) {
    return "Ejecucion";
  }

  if (appsEnMemoriaVirtual.includes(idApp)) {
    return "Memoria virtual";
  }

  return "Segundo plano";
}

/* funcion que calcula la memoria de una app segun su estado. */
function obtenerMemoriaApp(idApp, estado) {
  const memoriaBase = memoriaApps[idApp] || 180;

  if (estado === "Ejecucion" || estado === "Memoria virtual") {
    return memoriaBase;
  }

  return Math.round(memoriaBase * 0.55);
}

/* funcion que actualiza la hora y fecha usando el dispositivo. */
function actualizarReloj() {
  const ahora = new Date();
  const hora = ahora.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  const fecha = ahora.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });

  horaBarra.textContent = hora;
  horaBloqueo.textContent = hora;
  fechaBloqueo.textContent = fecha;
}

/* funcion que cambia los procesos usando prioridades. */
function actualizarProcesosSistema() {
  const ordenPrioridades = [1, 1, 2, 1, 2, 3];
  const prioridadCpu = ordenPrioridades[turnoPlanificador % ordenPrioridades.length];
  prioridadCpuActual = prioridadCpu;
  turnoPlanificador++;

  procesosSistema.forEach(function (proceso) {
    proceso.estado = "Listo";

    /* WiFi se bloquea cuando espera datos de entrada o salida. */
    if (proceso.nombre === "wifid" && turnoPlanificador % 6 === 0) {
      proceso.estado = "Bloqueado";
    }

    proceso.memoria = proceso.memoria + Math.floor(Math.random() * 7) - 3;
    proceso.memoria = Math.max(25, Math.min(95, proceso.memoria));
  });

  /* los procesos de dispositivos conectados reciben actividad. */
  dispositivosEntradaSalida.forEach(function (dispositivo) {
    const proceso = procesosSistema.find(function (servicio) {
      return servicio.nombre === dispositivo.proceso;
    });

    if (dispositivo.conectado && proceso) {
      proceso.estado = "Ejecucion";
    }
  });

  const candidatos = procesosSistema.filter(function (proceso) {
    return proceso.prioridad === prioridadCpu && proceso.estado === "Listo";
  });
  const procesoElegido = candidatos[turnoPlanificador % candidatos.length] || procesosSistema[5];

  procesoElegido.estado = "Ejecucion";
  procesoEnCpu = procesoElegido.nombre + " - Prioridad " + procesoElegido.prioridad;
  turnosCpuProcesos[procesoElegido.nombre] = (turnosCpuProcesos[procesoElegido.nombre] || 0) + 1;
  explicacionPlanificador = "Se eligio prioridad " + prioridadCpu +
    " porque los procesos importantes reciben mas turnos.";
  actualizarProcesoTemporal();
  actualizarSubtareasCamara();
}
/* funcion que cambia el estado del proceso temporal. */
function actualizarProcesoTemporal() {
  const estados = ["Nuevo", "Listo", "Ejecucion", "Bloqueado", "Listo", "Ejecucion", "Terminado"];
  procesoTemporal.estado = estados[cicloProcesoTemporal % estados.length];
  cicloProcesoTemporal++;
}

/* funcion que simula las subtareas de la app Camara. */
function actualizarSubtareasCamara() {
  const indiceActivo = (turnoPlanificador - 1) % subtareasCamara.length;

  subtareasCamara.forEach(function (subtarea, indice) {
    subtarea.estado = indice === indiceActivo ? "Ejecucion" : "Listo";
  });

  subtareasCamara[indiceActivo].turnos++;
}

/* funcion que pone color diferente a cada estado. */
function claseEstadoProceso(estado) {
  return estado.toLowerCase().replace(" ", "-");
}

/* Esta funcion pinta los puntos del PIN escrito. */
function actualizarPuntosPin() {
  puntosPin.forEach(function (punto, indice) {
    punto.classList.toggle("relleno", indice < pinIngresado.length);
  });
}

/* funcion que maneja cada tecla del PIN. */
function manejarTeclaPin(tecla) {
  if (celularBloqueado) {
    return;
  }

  if (tecla === "limpiar") {
    pinIngresado = "";
  } else if (tecla === "borrar") {
    pinIngresado = pinIngresado.slice(0, -1);
  } else if (pinIngresado.length < 4) {
    pinIngresado += tecla;
  }

  actualizarPuntosPin();

  if (pinIngresado.length === 4) {
    validarPin();
  }
}

/* funcion que revisa si el PIN ingresado es correcto. */
function validarPin() {
  if (pinIngresado === pinCorrecto) {
    mensajeDesbloqueo.textContent = "PIN correcto. Celular desbloqueado.";
    desbloquearCelular();
  } else {
    mensajeDesbloqueo.textContent = "PIN incorrecto.";
    pinIngresado = "";
    actualizarPuntosPin();
    registrarIntentoFallido();
  }
}

/* funcion que cambia de bloqueo a pantalla de inicio. */
function desbloquearCelular() {
  document.getElementById("pantallaBloqueo").classList.remove("pantalla-activa");
  document.getElementById("pantallaInicio").classList.add("pantalla-activa");
  pinIngresado = "";
  actualizarPuntosPin();
  intentosFallidos = 0;
  celularBloqueado = false;
  tiempoBloqueo = 0;
  mensajeDesbloqueo.textContent = "PIN demo: 1234";
  mensajeBloqueoTemporal.textContent = "";
}

/* funcion que suma intentos y aplica bloqueo temporal. */
function registrarIntentoFallido() {
  intentosFallidos++;
  intentosSeguridad++;
  registrarAlertaSeguridad("Intento fallido de PIN");
  mensajeBloqueoTemporal.textContent = "Intentos fallidos: " + intentosFallidos;

  if (intentosFallidos === 3) {
    bloquearCelularTemporalmente(15);
  } else if (intentosFallidos === 5) {
    bloquearCelularTemporalmente(30);
  } else if (intentosFallidos === 7) {
    bloquearCelularTemporalmente(60);
  }
}

/* funcion que bloquea el celular y muestra el contador. */
function bloquearCelularTemporalmente(segundos) {
  celularBloqueado = true;
  tiempoBloqueo = segundos;
  mensajeDesbloqueo.textContent = "iPhone bloqueado temporalmente.";
  mensajeBloqueoTemporal.textContent = "Intenta de nuevo en " + tiempoBloqueo + " segundos.";
  registrarAlertaSeguridad("iPhone bloqueado por seguridad");

  const intervaloBloqueo = setInterval(function () {
    tiempoBloqueo--;
    mensajeBloqueoTemporal.textContent = "Intenta de nuevo en " + tiempoBloqueo + " segundos.";

    if (tiempoBloqueo <= 0) {
      clearInterval(intervaloBloqueo);
      celularBloqueado = false;
      pinIngresado = "";
      actualizarPuntosPin();
      mensajeDesbloqueo.textContent = "PIN demo: 1234";
      mensajeBloqueoTemporal.textContent = "Puedes intentar de nuevo.";
    }
  }, 1000);
}

/* cambia la barra de estado para pantallas blancas. */
function barraEstadoOscura() {
  document.querySelector(".barra-estado").classList.add("oscura");
}

/* cambia la barra de estado para el fondo del inicio. */
function barraEstadoClara() {
  document.querySelector(".barra-estado").classList.remove("oscura");
}

/* funcion que guarda alertas de seguridad recientes. */
function registrarAlertaSeguridad(mensaje) {
  const ahora = new Date();
  const horaAlerta = ahora.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit"
  });

  alertasSeguridad.unshift({
    mensaje: mensaje,
    hora: horaAlerta
  });
  alertasSeguridad = alertasSeguridad.slice(0, 5);
}

/* muestra una alerta dentro de la pantalla del iPhone. */
function mostrarAlertaSistema(mensaje, titulo) {
  tituloAlertaSistema.textContent = titulo || "Permiso denegado";
  textoAlertaSistema.textContent = mensaje;
  alertaSistema.classList.add("visible");
}

/* muestra una alerta cuando Invitado intenta modificar el telefono. */
function validarPermisoAdministrador(accion) {
  if (usuarioActivo === "Admin") {
    return true;
  }

  const mensaje = "No tienes permisos para " + accion + " porque estas en Invitado.";
  registrarAlertaSeguridad(mensaje);
  mostrarAlertaSistema(mensaje);

  return false;
}

/* cambia el usuario que se muestra junto al titulo Inicio. */
function actualizarUsuarioInicio() {
  const esAdministrador = usuarioActivo === "Admin";
  usuarioInicio.textContent = esAdministrador ? "Administrador" : "Invitado";
  usuarioInicio.classList.toggle("invitado", !esAdministrador);
}

/* funcion que transforma una contraseña para no compararla directa. */
function cifrarContrasena(contrasena) {
  let resultado = 0;

  for (let indice = 0; indice < contrasena.length; indice++) {
    resultado = (resultado * 31 + contrasena.charCodeAt(indice)) % 1000000;
  }

  return "C-" + String(resultado).padStart(6, "0");
}

/* funcion que valida el usuario y su contraseña cifrada. */
function iniciarSesionSeguridad() {
  const contrasena = document.getElementById("contrasenaSeguridad").value;
  const claveCifrada = cifrarContrasena(contrasena);

  if (claveCifrada === usuariosSeguridad[usuarioLogin]) {
    usuarioActivo = usuarioLogin;
    mensajeLogin = "Sesion iniciada como " + usuarioActivo + ". Clave verificada: " + claveCifrada + ".";
    actualizarUsuarioInicio();

    /* avisa dentro del iPhone cuando cambia el tipo de usuario activo. */
    mostrarAlertaSistema("Has entrado como " + (usuarioActivo === "Admin" ? "Administrador" : "Invitado") + ".", "Sesion iniciada");
  } else {
    intentosSeguridad++;
    mensajeLogin = "Contraseña incorrecta. Intento fallido: " + intentosSeguridad + ".";
    registrarAlertaSeguridad("Login incorrecto para " + usuarioLogin + ".");
  }

  abrirAppSeguridad();
}

/* funcion que muestra seguridad y permisos instalados. */
function abrirAppSeguridad() {
  let permisosHtml = "";
  let alertasHtml = "";
  const permisoArchivos = usuarioActivo === "Admin" ? "Permitido" : "Denegado";

  appsInstaladas.forEach(function (idApp) {
    permisosHtml += "<article class='fila-seguridad'><span>" + obtenerNombreApp(idApp) + "</span><strong>Uso permitido</strong></article>";
  });

  alertasSeguridad.forEach(function (alerta) {
    alertasHtml += "<article class='fila-seguridad fila-alerta-seguridad'><div><span>" + alerta.mensaje +
      "</span><small>" + alerta.hora + "</small></div><strong>Alerta</strong></article>";
  });

  tituloApp.textContent = "Seguridad";
  subtituloApp.textContent = "Privacidad";
  contenidoApp.innerHTML =
    "<section class='tarjeta'><h3>Estado de seguridad</h3>" +
      "<article class='fila-seguridad'><span>Usuario activo</span><strong>" + usuarioActivo + "</strong></article>" +
      "<article class='fila-seguridad'><span>Codigo</span><strong>Activo</strong></article>" +
      "<article class='fila-seguridad'><span>Intentos fallidos</span><strong>" + intentosSeguridad + "</strong></article></section>" +
    "<section class='tarjeta login-seguridad'><h3>Inicio de sesion</h3>" +
      "<div class='selector-usuario'>" +
        "<button data-login-usuario='Admin' class='" + (usuarioLogin === "Admin" ? "activo" : "") + "'>Admin</button>" +
        "<button data-login-usuario='Invitado' class='" + (usuarioLogin === "Invitado" ? "activo" : "") + "'>Invitado</button>" +
      "</div>" +
      "<input id='contrasenaSeguridad' type='password' placeholder='Contraseña'>" +
      "<button id='iniciarSesionSeguridad' class='boton-principal'>Iniciar sesion</button>" +
      "<p class='mensaje-login'>" + mensajeLogin + "</p>" +
      "<small>Demo: Admin / admin123 | Invitado / invitado123</small>" +
      "<small>Claves cifradas: Admin " + usuariosSeguridad.Admin + " | Invitado " + usuariosSeguridad.Invitado + "</small>" +
    "</section>" +
    "<section class='tarjeta'><h3>Matriz de acceso</h3>" +
      "<article class='fila-seguridad'><span>Leer fotos</span><strong>Permitido</strong></article>" +
      "<article class='fila-seguridad'><span>Modificar fotos y archivos</span><strong>" + permisoArchivos + "</strong></article>" +
      "<article class='fila-seguridad'><span>Crear notas y documentos</span><strong>" + permisoArchivos + "</strong></article>" +
      "<article class='fila-seguridad'><span>Ajustes e instalaciones</span><strong>" + permisoArchivos + "</strong></article>" +
    "</section>" +
    "<section class='tarjeta'><h3>Permisos de apps</h3>" + (permisosHtml || "<p class='alerta'>No hay apps instaladas.</p>") + "</section>" +
    "<section class='tarjeta'><h3>Alertas</h3>" + (alertasHtml || "<p class='alerta'>No se encontraron amenazas.</p>") + "</section>";

  document.querySelectorAll("[data-login-usuario]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      usuarioLogin = boton.dataset.loginUsuario;
      abrirAppSeguridad();
    });
  });

  document.getElementById("iniciarSesionSeguridad").addEventListener("click", function () {
    iniciarSesionSeguridad();
  });
}

/* funcion que abre una app desde el inicio. */
function abrirApp(nombreApp) {
  if (nombreApp === "ajustes" && !validarPermisoAdministrador("entrar a Ajustes")) {
    return;
  }

  if (nombreApp !== "recientes") {
    registrarAppReciente(nombreApp);
  }

  document.getElementById("pantallaInicio").classList.remove("pantalla-activa");
  document.getElementById("vistaApp").classList.add("pantalla-activa");
  botonVolverInicio.classList.remove("boton-volver-oculto");
  barraEstadoOscura();
  clearInterval(intervaloProcesos);

  if (nombreApp === "recientes") {
    abrirAppsRecientes();
  } else if (nombreApp === "procesos") {
    abrirAppProcesos();
  } else if (nombreApp === "memoria") {
    abrirAppDiagnostico();
  } else if (nombreApp === "archivos") {
    abrirAppArchivos();
  } else if (nombreApp === "camara") {
    abrirAppCamara();
  } else if (nombreApp === "fotos") {
    abrirAppFotos();
  } else if (nombreApp === "notas") {
    abrirAppNotas();
  } else if (nombreApp === "documentos") {
    abrirAppDocumentos();
  } else if (nombreApp === "seguridad") {
    abrirAppSeguridad();
  } else if (nombreApp === "ajustes") {
    abrirAppAjustes();
  } else if (nombreApp === "appstore") {
    abrirAppStore();
  } else if (nombreApp === "safari") {
    abrirAppSafari();
  } else if (nombreApp === "instagram") {
    abrirAppInstagram();
  } else if (nombreApp === "whatsapp") {
    abrirAppWhatsApp();
  } else if (nombreApp === "teams") {
    abrirAppTeams();
  } else {
    tituloApp.textContent = obtenerNombreApp(nombreApp);
    subtituloApp.textContent = "Simulador iOS";
    contenidoApp.innerHTML = "<section class='tarjeta'><h3>" + obtenerNombreApp(nombreApp) + "</h3><p class='alerta'>Esta app esta abierta dentro del simulador.</p></section>";
  }
}

/* funcion que abre la camara del simulador. */
function abrirAppCamara() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Camara";
  subtituloApp.textContent = "Foto";
  dibujarCamara();
}

/* funcion que dibuja el visor y el boton para tomar foto. */
function dibujarCamara() {
  const ultimaFoto = fotosCamara[0];
  const miniatura = ultimaFoto ?
    "<button id='abrirFotoGuardada' class='miniatura-foto foto-" + ultimaFoto.fondo + "'><span>" + ultimaFoto.nombre + "</span></button>" :
    "<div class='miniatura-vacia'></div>";

  contenidoApp.innerHTML =
    "<section class='camara-contenido'>" +
      "<div class='visor-camara'>" +
        "<div class='cielo-camara'></div>" +
        "<div class='sol-camara'></div>" +
        "<div class='montana-camara una'></div>" +
        "<div class='montana-camara dos'></div>" +
        "<div class='piso-camara'></div>" +
        "<div class='enfoque-camara'></div>" +
      "</div>" +
      "<p class='mensaje-camara'>" + mensajeCamara + "</p>" +
      "<div class='controles-camara'>" +
        miniatura +
        "<button id='botonTomarFoto' class='boton-tomar-foto' title='Tomar foto'></button>" +
        "<button class='boton-cambiar-camara' title='Cambiar camara'>↻</button>" +
      "</div>" +
    "</section>";

  document.getElementById("botonTomarFoto").addEventListener("click", function () {
    tomarFoto();
  });

  if (ultimaFoto) {
    document.getElementById("abrirFotoGuardada").addEventListener("click", function () {
      abrirApp("fotos");
    });
  }
}

/* funcion que crea una foto y la guarda dentro de Fotos. */
function tomarFoto() {
  if (!validarPermisoAdministrador("tomar fotos")) {
    mensajeCamara = "Acceso denegado para Invitado.";
    dibujarCamara();
    return;
  }

  const ahora = new Date();
  const numero = String(numeroFoto + 1).padStart(4, "0");
  const fondos = ["amanecer", "azul", "rosa"];

  numeroFoto++;
  fotosCamara.unshift({
    nombre: "IMG_" + numero + ".HEIC",
    fecha: ahora.toLocaleDateString("es-MX", { day: "numeric", month: "short" }),
    hora: ahora.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    tamano: "3.8 MB",
    fondo: fondos[(numeroFoto - 1) % fondos.length]
  });

  mensajeCamara = "Foto guardada en la app Fotos.";
  dibujarCamara();
}

/* funcion que abre la galeria de fotos del iPhone. */
function abrirAppFotos() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Fotos";
  subtituloApp.textContent = "Biblioteca";
  dibujarFotos();
}

/* funcion que dibuja la biblioteca o los eliminados. */
function dibujarFotos() {
  const estaBiblioteca = albumFotosActual === "biblioteca";
  const fotosAlbum = estaBiblioteca ? fotosCamara : fotosEliminadas;
  let fotosHtml = "";
  const haySeleccion = fotosSeleccionadas.length > 0;

  fotosAlbum.forEach(function (foto, indice) {
    const seleccionada = fotosSeleccionadas.includes(indice);

    if (estaBiblioteca) {
      fotosHtml += "<article class='foto-galeria foto-" + foto.fondo + (seleccionada ? " seleccionada" : "") + "' " +
        (modoSeleccionFotos ? "data-seleccionar-foto='" + indice + "'" : "") + ">" +
          (modoSeleccionFotos ? "<span class='marca-seleccion-foto'>" + (seleccionada ? "✓" : "") + "</span>" : "") +
          "<div class='foto-datos'><span>" + foto.nombre + "</span><small>" + foto.fecha + " · " + foto.hora + " · " + foto.tamano + "</small></div>" +
        "</article>";
    } else {
      fotosHtml += "<article class='foto-galeria foto-" + foto.fondo + "'>" +
        "<div class='foto-datos'><span>" + foto.nombre + "</span><small>" + foto.fecha + " · " + foto.hora + " · " + foto.tamano + "</small></div>" +
        "<div class='acciones-foto'>" +
          "<button class='boton-foto' data-restaurar-foto='" + indice + "'>Recuperar</button>" +
          "<button class='boton-foto eliminar' data-borrar-foto='" + indice + "'>Borrar</button>" +
        "</div>" +
      "</article>";
    }
  });

  contenidoApp.innerHTML =
    "<section class='app-fotos'>" +
      "<div class='selector-album'>" +
        "<button data-album='biblioteca' class='" + (estaBiblioteca ? "activo" : "") + "'>Biblioteca</button>" +
        "<button data-album='eliminados' class='" + (!estaBiblioteca ? "activo" : "") + "'>Eliminados</button>" +
      "</div>" +
      "<section class='tarjeta resumen-fotos'>" +
        "<div class='cabecera-fotos'>" +
          "<div><h3>" + (estaBiblioteca ? "Todas las fotos" : "Eliminados hace poco") + "</h3>" +
          "<p>" + fotosAlbum.length + " foto(s)</p></div>" +
          (estaBiblioteca && fotosAlbum.length > 0 ? "<button id='alternarSeleccionFotos' class='boton-gris boton-seleccionar-fotos'>" + (modoSeleccionFotos ? "Cancelar" : "Seleccionar") + "</button>" : "") +
        "</div>" +
        (estaBiblioteca && modoSeleccionFotos ?
          "<div class='barra-acciones-fotos'>" +
            "<span>" + fotosSeleccionadas.length + " seleccionada(s)</span>" +
            "<button id='eliminarSeleccionFotos' class='boton-foto eliminar' " + (haySeleccion ? "" : "disabled") + ">Eliminar seleccionadas</button>" +
          "</div>" : "") +
        (mensajeFotos ? "<p class='mensaje-fotos'>" + mensajeFotos + "</p>" : "") +
      "</section>" +
      "<div class='cuadricula-fotos'>" +
        (fotosHtml || "<section class='tarjeta galeria-vacia'><strong>No hay fotos.</strong><p>Toma una foto desde Camara.</p></section>") +
      "</div>" +
    "</section>";

  document.querySelectorAll("[data-album]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      albumFotosActual = boton.dataset.album;
      subtituloApp.textContent = albumFotosActual === "biblioteca" ? "Biblioteca" : "Eliminados";
      mensajeFotos = "";
      modoSeleccionFotos = false;
      fotosSeleccionadas = [];
      dibujarFotos();
    });
  });

  if (document.getElementById("alternarSeleccionFotos")) {
    document.getElementById("alternarSeleccionFotos").addEventListener("click", alternarModoSeleccionFotos);
  }

  if (document.getElementById("eliminarSeleccionFotos")) {
    document.getElementById("eliminarSeleccionFotos").addEventListener("click", eliminarFotosSeleccionadas);
  }

  document.querySelectorAll("[data-seleccionar-foto]").forEach(function (foto) {
    foto.addEventListener("click", function () {
      alternarFotoSeleccionada(Number(foto.dataset.seleccionarFoto));
    });
  });

  document.querySelectorAll("[data-restaurar-foto]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      restaurarFoto(Number(boton.dataset.restaurarFoto));
    });
  });

  document.querySelectorAll("[data-borrar-foto]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      borrarFotoDefinitiva(Number(boton.dataset.borrarFoto));
    });
  });
}

/* activa o desactiva la seleccion multiple en Fotos. */
function alternarModoSeleccionFotos() {
  modoSeleccionFotos = !modoSeleccionFotos;
  fotosSeleccionadas = [];
  mensajeFotos = modoSeleccionFotos ? "Selecciona una o varias fotos para eliminarlas." : "";
  dibujarFotos();
}

/* marca o desmarca una foto dentro de la biblioteca. */
function alternarFotoSeleccionada(indice) {
  if (!modoSeleccionFotos) {
    return;
  }

  if (fotosSeleccionadas.includes(indice)) {
    fotosSeleccionadas = fotosSeleccionadas.filter(function (fotoIndice) {
      return fotoIndice !== indice;
    });
  } else {
    fotosSeleccionadas.push(indice);
  }

  dibujarFotos();
}

/* mueve las fotos seleccionadas a Eliminados hace poco. */
function eliminarFotosSeleccionadas() {
  if (!validarPermisoAdministrador("eliminar fotos")) {
    mensajeFotos = "Acceso denegado para Invitado.";
    dibujarFotos();
    return;
  }

  if (fotosSeleccionadas.length === 0) {
    mensajeFotos = "Selecciona al menos una foto.";
    dibujarFotos();
    return;
  }

  const indicesOrdenados = fotosSeleccionadas.slice().sort(function (a, b) {
    return b - a;
  });
  let fotosMovidas = [];

  indicesOrdenados.forEach(function (indice) {
    const foto = fotosCamara.splice(indice, 1)[0];
    if (foto) {
      fotosMovidas.unshift(foto);
    }
  });

  fotosEliminadas = fotosMovidas.concat(fotosEliminadas);
  mensajeFotos = fotosMovidas.length + " foto(s) se movieron a Eliminados hace poco.";
  modoSeleccionFotos = false;
  fotosSeleccionadas = [];
  dibujarFotos();
}

/* mueve una foto a eliminados hace poco. Se conserva como respaldo interno. */
function eliminarFoto(indice) {
  fotosSeleccionadas = [indice];
  eliminarFotosSeleccionadas();
}

/* recupera una foto eliminada. */
function restaurarFoto(indice) {
  if (!validarPermisoAdministrador("recuperar fotos eliminadas")) {
    mensajeFotos = "Acceso denegado para Invitado.";
    dibujarFotos();
    return;
  }

  const foto = fotosEliminadas.splice(indice, 1)[0];

  if (foto) {
    fotosCamara.unshift(foto);
    mensajeFotos = foto.nombre + " se recupero en la biblioteca.";
    albumFotosActual = "biblioteca";
    subtituloApp.textContent = "Biblioteca";
    modoSeleccionFotos = false;
    fotosSeleccionadas = [];
  }

  dibujarFotos();
}

/* elimina definitivamente una foto. */
function borrarFotoDefinitiva(indice) {
  if (!validarPermisoAdministrador("borrar fotos definitivamente")) {
    mensajeFotos = "Acceso denegado para Invitado.";
    dibujarFotos();
    return;
  }

  const foto = fotosEliminadas.splice(indice, 1)[0];

  if (foto) {
    mensajeFotos = foto.nombre + " fue borrada definitivamente.";
  }

  dibujarFotos();
}


/* funcion que abre Notas y sus carpetas disponibles. */
function abrirAppNotas() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Notas";
  subtituloApp.textContent = "Carpetas";
  dibujarNotas();
}

/* funcion que evita que el texto escrito cambie el codigo HTML. */
function protegerTexto(texto) {
  return texto.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}

/* funcion que dibuja las carpetas, notas o el editor. */
function dibujarNotas() {
  let contenido = "";

  if (carpetaNotasActual === "inicio") {
    contenido =
      "<section class='tarjeta encabezado-notas'><h3>Carpetas</h3><p>Selecciona una ubicacion</p></section>" +
      "<button class='fila-nota-carpeta' data-notas-carpeta='icloud'><span>☁️</span><div><strong>iCloud</strong><p>Notas sincronizadas</p></div><small>" + notasGuardadas.icloud.length + "</small><b>›</b></button>" +
      "<button class='fila-nota-carpeta' data-notas-carpeta='iphone'><span>📱</span><div><strong>En mi iPhone</strong><p>Notas guardadas localmente</p></div><small>" + notasGuardadas.iphone.length + "</small><b>›</b></button>";
  } else if (carpetaNotasActual === "editor-icloud" || carpetaNotasActual === "editor-iphone") {
    const destino = carpetaNotasActual === "editor-icloud" ? "icloud" : "iphone";
    const tituloDestino = destino === "icloud" ? "iCloud" : "En mi iPhone";
    const nota = notaActual >= 0 ? notasGuardadas[destino][notaActual] : null;

    contenido =
      "<button class='ruta-volver' data-notas-carpeta='" + destino + "'>‹ " + tituloDestino + "</button>" +
      "<section class='editor-nota'>" +
        "<input id='tituloNota' class='titulo-nota' type='text' placeholder='Titulo' maxlength='42' value='" + (nota ? protegerTexto(nota.titulo) : "") + "'>" +
        "<textarea id='contenidoNota' class='contenido-nota' placeholder='Empieza a escribir...' maxlength='260'>" + (nota ? protegerTexto(nota.texto) : "") + "</textarea>" +
        "<button id='guardarNota' class='boton-guardar-nota'>" + (nota ? "Guardar cambios" : "Guardar nota") + "</button>" +
      "</section>";
  } else {
    const destino = carpetaNotasActual;
    const tituloDestino = destino === "icloud" ? "iCloud" : "En mi iPhone";
    let notasHtml = "";

    notasGuardadas[destino].forEach(function (nota, indice) {
      notasHtml += "<article class='tarjeta-nota'><strong>" + protegerTexto(nota.titulo) + "</strong>" +
        "<p>" + protegerTexto(nota.texto) + "</p><small>" + nota.fecha + "</small>" +
        "<div class='acciones-nota'>" +
          "<button data-editar-nota='" + indice + "'>Editar</button>" +
          "<button class='eliminar' data-eliminar-nota='" + indice + "'>Eliminar</button>" +
        "</div></article>";
    });

    contenido =
      "<button class='ruta-volver' data-notas-carpeta='inicio'>‹ Carpetas</button>" +
      "<section class='barra-notas'><div><h3>" + tituloDestino + "</h3><p>Notas</p></div>" +
      "<button class='boton-nueva-nota' data-nueva-nota='" + destino + "'>+</button></section>" +
      (mensajeNotas ? "<p class='mensaje-archivo'>" + mensajeNotas + "</p>" : "") +
      (notasHtml || "<section class='tarjeta nota-vacia'><strong>No hay notas</strong><p>Presiona + para crear una.</p></section>");
  }

  contenidoApp.innerHTML = "<section class='app-notas'>" + contenido + "</section>";

  document.querySelectorAll("[data-notas-carpeta]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      carpetaNotasActual = boton.dataset.notasCarpeta;
      notaActual = -1;
      mensajeNotas = "";
      dibujarNotas();
    });
  });

  document.querySelectorAll("[data-nueva-nota]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      if (!validarPermisoAdministrador("crear notas")) {
        mensajeNotas = "Acceso denegado para Invitado.";
        dibujarNotas();
        return;
      }

      carpetaNotasActual = "editor-" + boton.dataset.nuevaNota;
      notaActual = -1;
      mensajeNotas = "";
      dibujarNotas();
    });
  });

  if (document.getElementById("guardarNota")) {
    document.getElementById("guardarNota").addEventListener("click", function () {
      guardarNota();
    });
  }

  document.querySelectorAll("[data-editar-nota]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      if (!validarPermisoAdministrador("editar notas")) {
        mensajeNotas = "Acceso denegado para Invitado.";
        dibujarNotas();
        return;
      }

      notaActual = Number(boton.dataset.editarNota);
      carpetaNotasActual = "editor-" + carpetaNotasActual;
      dibujarNotas();
    });
  });

  document.querySelectorAll("[data-eliminar-nota]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      eliminarNota(carpetaNotasActual, Number(boton.dataset.eliminarNota));
    });
  });
}

/* funcion que guarda o actualiza una nota en su carpeta. */
function guardarNota() {
  if (!validarPermisoAdministrador("crear o editar notas")) {
    mensajeNotas = "Acceso denegado para Invitado.";
    carpetaNotasActual = carpetaNotasActual === "editor-icloud" ? "icloud" : "iphone";
    dibujarNotas();
    return;
  }

  const destino = carpetaNotasActual === "editor-icloud" ? "icloud" : "iphone";
  const tituloEscrito = document.getElementById("tituloNota").value.trim();
  const textoEscrito = document.getElementById("contenidoNota").value.trim();
  const ahora = new Date();

  if (textoEscrito === "") {
    return;
  }

  const nota = {
    titulo: tituloEscrito || "Nueva nota",
    texto: textoEscrito,
    fecha: ahora.toLocaleDateString("es-MX", { day: "numeric", month: "short" })
  };

  if (notaActual >= 0) {
    notasGuardadas[destino][notaActual] = nota;
    mensajeNotas = "Nota actualizada.";
  } else {
    notasGuardadas[destino].unshift(nota);
    mensajeNotas = "Nota guardada.";
  }

  notaActual = -1;
  carpetaNotasActual = destino;
  dibujarNotas();
}

/* funcion que elimina una nota de su carpeta. */
function eliminarNota(destino, indice) {
  if (!validarPermisoAdministrador("eliminar notas")) {
    mensajeNotas = "Acceso denegado para Invitado.";
    dibujarNotas();
    return;
  }

  notasGuardadas[destino].splice(indice, 1);
  mensajeNotas = "Nota eliminada.";
  dibujarNotas();
}

/* funcion que abre la app Documentos descargada. */
function abrirAppDocumentos() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Documentos";
  subtituloApp.textContent = "En mi iPhone";
  dibujarDocumentos();
}

/* obtiene los datos de una etiqueta de documento. */
function obtenerEtiquetaDocumento(idEtiqueta) {
  if (!idEtiqueta) {
    return null;
  }

  return etiquetasDocumentos.find(function (etiqueta) {
    return etiqueta.id === idEtiqueta;
  }) || etiquetasDocumentos[6];
}

/* crea el menu de colores usado dentro de Archivos. */
function crearOpcionesEtiquetas(indice, etiquetaActual) {
  let opcionesHtml = "<button class='opcion-etiqueta " +
    (!etiquetaActual ? "activa" : "") + "' data-asignar-etiqueta='' data-indice-etiqueta='" + indice + "'>" +
    "<span class='punto-etiqueta personal'></span>Sin etiqueta</button>";

  etiquetasDocumentos.forEach(function (etiqueta) {
    opcionesHtml += "<button class='opcion-etiqueta " +
      (etiqueta.id === etiquetaActual ? "activa" : "") + "' data-asignar-etiqueta='" + etiqueta.id +
      "' data-indice-etiqueta='" + indice + "'><span class='punto-etiqueta " + etiqueta.id + "'></span>" +
      etiqueta.nombre + "</button>";
  });

  return opcionesHtml;
}

/* funcion que muestra la lista o el editor de documentos. */
function dibujarDocumentos() {
  let contenido = "";

  if (vistaDocumentos === "editor") {
    const documento = documentoActual >= 0 ? documentosGuardados[documentoActual] : null;

    contenido =
      "<button id='volverDocumentos' class='ruta-volver'>‹ Documentos</button>" +
      "<section class='editor-documento'>" +
        "<input id='tituloDocumento' class='titulo-nota' type='text' placeholder='Nombre del archivo' maxlength='45' value='" + protegerTexto(documento ? documento.titulo : "") + "'>" +
        "<textarea id='textoDocumento' class='contenido-documento' placeholder='Escribe el contenido del documento...' maxlength='1200'>" + protegerTexto(documento ? documento.texto : "") + "</textarea>" +
        "<button id='guardarDocumento' class='boton-principal'>Guardar documento</button>" +
      "</section>";
  } else {
    let documentosHtml = "";

    documentosGuardados.forEach(function (documento, indice) {
      documentosHtml += "<article class='tarjeta-documento'>" +
        "<div><strong>" + protegerTexto(documento.titulo) + "</strong><p>" + protegerTexto(documento.texto.slice(0, 55)) + "</p><small>" + documento.fecha + " - " + documento.tamano + "</small></div>" +
        "<div class='acciones-documento'>" +
          "<button data-editar-documento='" + indice + "'>Editar</button>" +
          "<button class='eliminar' data-eliminar-documento='" + indice + "'>Eliminar</button>" +
        "</div>" +
      "</article>";
    });

    contenido =
      "<section class='barra-documentos'><div><h3>Documentos</h3><p>Archivos editables</p></div>" +
        "<button id='nuevoDocumento' class='boton-nuevo-documento'>+</button></section>" +
      (mensajeDocumentos ? "<p class='mensaje-archivo'>" + mensajeDocumentos + "</p>" : "") +
      (documentosHtml || "<section class='tarjeta documento-vacio'><strong>No hay documentos.</strong><p>Presiona + para crear uno.</p></section>");
  }

  contenidoApp.innerHTML = "<section class='app-documentos'>" + contenido + "</section>";

  if (document.getElementById("nuevoDocumento")) {
    document.getElementById("nuevoDocumento").addEventListener("click", function () {
      if (!validarPermisoAdministrador("crear documentos")) {
        mensajeDocumentos = "Acceso denegado para Invitado.";
        dibujarDocumentos();
        return;
      }

      documentoActual = -1;
      vistaDocumentos = "editor";
      mensajeDocumentos = "";
      dibujarDocumentos();
    });
  }

  if (document.getElementById("volverDocumentos")) {
    document.getElementById("volverDocumentos").addEventListener("click", function () {
      vistaDocumentos = "lista";
      dibujarDocumentos();
    });
  }

  if (document.getElementById("guardarDocumento")) {
    document.getElementById("guardarDocumento").addEventListener("click", function () {
      guardarDocumento();
    });
  }

  document.querySelectorAll("[data-editar-documento]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      if (!validarPermisoAdministrador("editar documentos")) {
        mensajeDocumentos = "Acceso denegado para Invitado.";
        dibujarDocumentos();
        return;
      }

      documentoActual = Number(boton.dataset.editarDocumento);
      vistaDocumentos = "editor";
      dibujarDocumentos();
    });
  });

  document.querySelectorAll("[data-eliminar-documento]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      eliminarDocumento(Number(boton.dataset.eliminarDocumento));
    });
  });
}

/* funcion que crea o actualiza un documento. */
function guardarDocumento() {
  if (!validarPermisoAdministrador("crear o editar documentos")) {
    mensajeDocumentos = "Acceso denegado para Invitado.";
    vistaDocumentos = "lista";
    dibujarDocumentos();
    return;
  }

  const titulo = document.getElementById("tituloDocumento").value.trim() || "Documento sin titulo";
  const texto = document.getElementById("textoDocumento").value.trim();
  const ahora = new Date();
  const etiqueta = documentoActual >= 0 ? documentosGuardados[documentoActual].etiqueta || "" : "";
  const documento = {
    titulo: titulo,
    texto: texto,
    etiqueta: etiqueta,
    fecha: ahora.toLocaleDateString("es-MX", { day: "numeric", month: "short" }),
    tamano: Math.max(1, Math.ceil((titulo.length + texto.length) / 20)) + " KB"
  };

  if (documentoActual >= 0) {
    documentosGuardados[documentoActual] = documento;
    mensajeDocumentos = "Documento actualizado.";
  } else {
    documentosGuardados.unshift(documento);
    mensajeDocumentos = "Documento guardado en Archivos > En mi iPhone > Documentos.";
  }

  documentoActual = -1;
  vistaDocumentos = "lista";
  dibujarDocumentos();
}

/* funcion que envia un documento a eliminados. */
function eliminarDocumento(indice) {
  if (!validarPermisoAdministrador("eliminar documentos")) {
    mensajeDocumentos = "Acceso denegado. Invitado no puede eliminar documentos.";
    dibujarDocumentos();
    return;
  }

  documentosEliminados.unshift(documentosGuardados.splice(indice, 1)[0]);
  mensajeDocumentos = "Documento enviado a Eliminados hace poco.";
  dibujarDocumentos();
}

/* funcion que elimina un documento desde la app Archivos. */
function eliminarDocumentoDesdeArchivos(indice) {
  if (!validarPermisoAdministrador("eliminar documentos")) {
    mensajeArchivos = "Acceso denegado. Invitado no puede eliminar documentos.";
    dibujarArchivos();
    return;
  }

  documentosEliminados.unshift(documentosGuardados.splice(indice, 1)[0]);
  mensajeArchivos = "Documento enviado a Eliminados hace poco.";
  dibujarArchivos();
}

/* funcion que abre la estructura de carpetas del iPhone. */
function abrirAppArchivos() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Archivos";
  subtituloApp.textContent = "Explorar";
  carpetaArchivosActual = "inicio";
  dibujarArchivos();
}

/* funcion que dibuja los documentos guardados en Archivos. */
function crearListaDocumentosArchivos(filtroEtiqueta) {
  let documentosHtml = "";

  documentosGuardados.forEach(function (documento, indice) {
    const etiqueta = obtenerEtiquetaDocumento(documento.etiqueta);

    if (filtroEtiqueta && (!etiqueta || etiqueta.id !== filtroEtiqueta)) {
      return;
    }

    documentosHtml += "<article class='archivo-documento'>" +
      "<span class='icono-documento'>&#128196;</span>" +
      "<div><strong>" + protegerTexto(documento.titulo) + "</strong><p>" + documento.fecha + "</p>" +
      "<small>" + (etiqueta ? "<span class='etiqueta-documento'><span class='punto-etiqueta " + etiqueta.id + "'></span>" + etiqueta.nombre + "</span> - " : "") + documento.tamano + "</small></div>" +
      "<div class='controles-archivo'>" +
        "<button class='vista-etiqueta-archivo' data-abrir-menu-etiqueta='" + indice + "'>" +
          "<span class='punto-etiqueta " + (etiqueta ? etiqueta.id : "personal") + "'></span>" +
          "<span>" + (etiqueta ? etiqueta.nombre : "Etiqueta") + "</span><strong>⌄</strong>" +
        "</button>" +
        (menuEtiquetaDocumento === indice ? "<div class='opciones-etiqueta-archivo'>" +
          crearOpcionesEtiquetas(indice, documento.etiqueta || "") + "</div>" : "") +
        "<button class='boton-borrar-archivo' data-eliminar-documento-archivos='" + indice + "'>Eliminar</button>" +
      "</div>" +
    "</article>";
  });

  return documentosHtml || "<section class='tarjeta archivo-vacio'><strong>No hay documentos.</strong><p>" +
    (filtroEtiqueta ? "No existen archivos con esta etiqueta." : "Crea uno desde la app Documentos.") +
    "</p></section>";
}

/* funcion que dibuja los colores para filtrar documentos. */
function crearListaEtiquetasArchivos() {
  let etiquetasHtml = "";

  etiquetasDocumentos.forEach(function (etiqueta) {
    etiquetasHtml += "<button class='fila-etiqueta' data-etiqueta='" + etiqueta.id + "'>" +
      "<span class='punto-etiqueta " + etiqueta.id + "'></span><strong>" + etiqueta.nombre +
      "</strong><span>›</span></button>";
  });

  return etiquetasHtml;
}

/* funcion que cambia la etiqueta de un documento desde Archivos. */
function cambiarEtiquetaDocumento(indice, etiquetaNueva) {
  if (!validarPermisoAdministrador("etiquetar documentos")) {
    mensajeArchivos = "Acceso denegado. Invitado no puede etiquetar documentos.";
    dibujarArchivos();
    return;
  }

  documentosGuardados[indice].etiqueta = etiquetaNueva;
  menuEtiquetaDocumento = -1;
  mensajeArchivos = etiquetaNueva ?
    "Documento etiquetado como " + obtenerEtiquetaDocumento(etiquetaNueva).nombre + "." :
    "Etiqueta eliminada del documento.";
  dibujarArchivos();
}

/* funcion que dibuja fotos y documentos enviados a eliminados. */
function crearListaElementosEliminados() {
  let elementosHtml = "";

  documentosEliminados.forEach(function (documento, indice) {
    const etiqueta = obtenerEtiquetaDocumento(documento.etiqueta);

    elementosHtml += "<article class='archivo-eliminado'>" +
      "<div class='archivo-documento sin-borde'>" +
        "<span class='icono-documento'>&#128196;</span>" +
        "<div><strong>" + protegerTexto(documento.titulo) + "</strong><p>" + documento.fecha + "</p>" +
        "<small>" + (etiqueta ? "<span class='etiqueta-documento'><span class='punto-etiqueta " + etiqueta.id + "'></span>" + etiqueta.nombre + "</span> - " : "") + documento.tamano + "</small></div>" +
      "</div>" +
      "<div class='acciones-eliminado'>" +
        "<button data-restaurar-documento='" + indice + "'>Restaurar</button>" +
        "<button class='eliminar' data-borrar-documento='" + indice + "'>Eliminar definitivamente</button>" +
      "</div>" +
    "</article>";
  });

  fotosEliminadas.forEach(function (foto, indice) {
    elementosHtml += "<article class='archivo-eliminado'>" +
      "<div class='archivo-foto'>" +
        "<div class='vista-foto foto-" + foto.fondo + "'></div>" +
        "<div><strong>" + foto.nombre + "</strong><p>" + foto.fecha + " - " + foto.hora + "</p><small>" + foto.tamano + "</small></div>" +
      "</div>" +
      "<div class='acciones-eliminado'>" +
        "<button data-restaurar-foto-archivos='" + indice + "'>Restaurar</button>" +
        "<button class='eliminar' data-borrar-foto-archivos='" + indice + "'>Eliminar definitivamente</button>" +
      "</div>" +
    "</article>";
  });

  return elementosHtml || "<section class='tarjeta archivo-vacio'><strong>No hay elementos.</strong><p>Las fotos y documentos eliminados apareceran aqui.</p></section>";
}

/* funcion que restaura o borra un documento eliminado. */
function manejarDocumentoEliminado(accion, indice) {
  if (!validarPermisoAdministrador("modificar eliminados")) {
    mensajeArchivos = "Acceso denegado. Invitado no puede modificar eliminados.";
    dibujarArchivos();
    return;
  }

  if (accion === "restaurar") {
    documentosGuardados.unshift(documentosEliminados.splice(indice, 1)[0]);
    mensajeArchivos = "Documento restaurado en En mi iPhone.";
  }

  if (accion === "borrar") {
    documentosEliminados.splice(indice, 1);
    mensajeArchivos = "Documento eliminado definitivamente.";
  }

  dibujarArchivos();
}

/* funcion que restaura o borra una foto desde Archivos. */
function manejarFotoEliminadaDesdeArchivos(accion, indice) {
  if (!validarPermisoAdministrador("modificar eliminados")) {
    mensajeArchivos = "Acceso denegado. Invitado no puede modificar eliminados.";
    dibujarArchivos();
    return;
  }

  if (accion === "restaurar") {
    fotosCamara.unshift(fotosEliminadas.splice(indice, 1)[0]);
    mensajeArchivos = "Foto restaurada en Fotos.";
  }

  if (accion === "borrar") {
    fotosEliminadas.splice(indice, 1);
    mensajeArchivos = "Foto eliminada definitivamente.";
  }

  dibujarArchivos();
}

/* funcion que regresa una carpeta desde la flecha superior. */
function volverCarpetaArchivos() {
  if (carpetaArchivosActual === "documentos" || carpetaArchivosActual === "protegidos") {
    carpetaArchivosActual = "iphone";
  } else {
    carpetaArchivosActual = "inicio";
  }

  mensajeArchivos = "";
  menuEtiquetaDocumento = -1;
  dibujarArchivos();
}

/* funcion que dibuja la carpeta en la que se encuentra el usuario. */
function dibujarArchivos() {
  let contenido = "";

  botonVolverInicio.classList.toggle("boton-volver-oculto", carpetaArchivosActual === "inicio");

  if (carpetaArchivosActual === "inicio") {
    contenido =
      "<div class='buscador-archivos'>&#128269; Buscar</div>" +
      "<h3 class='titulo-grupo-archivos'>Favoritos</h3>" +
      "<section class='grupo-archivos'>" +
        "<button class='fila-carpeta' data-carpeta='descargas'><span class='icono-carpeta'>&#11015;</span><div><strong>Descargas</strong><p>0 elementos</p></div><span>›</span></button>" +
      "</section>" +
      "<h3 class='titulo-grupo-archivos'>Ubicaciones</h3>" +
      "<section class='grupo-archivos'>" +
        "<button class='fila-carpeta' data-carpeta='icloud'><span class='icono-carpeta nube'>&#9729;</span><div><strong>iCloud Drive</strong><p>Sin archivos recientes</p></div><span>›</span></button>" +
        "<button class='fila-carpeta' data-carpeta='iphone'><span class='icono-carpeta'>&#128241;</span><div><strong>En mi iPhone</strong><p>Archivos guardados localmente</p></div><span>›</span></button>" +
        "<button class='fila-carpeta' data-carpeta='eliminados'><span class='icono-carpeta protegido'>&#128465;</span><div><strong>Eliminados hace poco</strong><p>" + (documentosEliminados.length + fotosEliminadas.length) + " elemento(s)</p></div><span>›</span></button>" +
      "</section>" +
      "<h3 class='titulo-grupo-archivos'>Etiquetas</h3>" +
      "<section class='grupo-archivos'>" + crearListaEtiquetasArchivos() + "</section>";
  } else if (carpetaArchivosActual === "iphone") {
    contenido =
      "<section class='tarjeta cabecera-archivos'><h3>En mi iPhone</h3><p>Carpetas</p></section>" +
      "<button class='fila-carpeta' data-carpeta='documentos'><span class='icono-carpeta'>&#128193;</span><div><strong>Documentos</strong><p>" + documentosGuardados.length + " archivo(s)</p></div><span>›</span></button>" +
      "<button class='fila-carpeta' data-carpeta='descargas'><span class='icono-carpeta'>&#128193;</span><div><strong>Descargas</strong><p>0 elementos</p></div><span>›</span></button>" +
      "<button class='fila-carpeta' data-carpeta='protegidos'><span class='icono-carpeta protegido'>&#128274;</span><div><strong>Datos de apps protegidos</strong><p>Notas y datos privados</p></div><span>›</span></button>";
  } else if (carpetaArchivosActual === "documentos") {
    contenido =
      "<section class='tarjeta cabecera-archivos'><h3>Documentos</h3><p>Archivos creados desde la app</p></section>" +
      (mensajeArchivos ? "<p class='mensaje-archivo'>" + mensajeArchivos + "</p>" : "") +
      crearListaDocumentosArchivos();
  } else if (carpetaArchivosActual === "etiqueta") {
    const etiqueta = obtenerEtiquetaDocumento(etiquetaArchivosActual);

    contenido =
      "<section class='tarjeta cabecera-archivos'><h3>" + etiqueta.nombre + "</h3><p>Documentos etiquetados</p></section>" +
      (mensajeArchivos ? "<p class='mensaje-archivo'>" + mensajeArchivos + "</p>" : "") +
      crearListaDocumentosArchivos(etiqueta.id);
  } else if (carpetaArchivosActual === "protegidos") {
    contenido =
      "<section class='tarjeta carpeta-protegida'>" +
        "<span>&#128274;</span>" +
        "<h3>Acceso restringido</h3>" +
        "<p>Las notas pertenecen al almacenamiento privado de la app Notas.</p>" +
        "<small>Permiso denegado: Archivos no puede leer estos datos.</small>" +
      "</section>";
  } else if (carpetaArchivosActual === "eliminados") {
    contenido =
      "<section class='tarjeta cabecera-archivos'><h3>Eliminados hace poco</h3><p>Fotos y documentos que puedes recuperar o borrar</p></section>" +
      (mensajeArchivos ? "<p class='mensaje-archivo'>" + mensajeArchivos + "</p>" : "") +
      crearListaElementosEliminados();
  } else {
    const esIcloud = carpetaArchivosActual === "icloud";
    contenido =
      "<section class='tarjeta carpeta-informativa'>" +
        "<span>" + (esIcloud ? "&#9729;" : "&#128193;") + "</span>" +
        "<h3>" + (esIcloud ? "iCloud Drive" : "Descargas") + "</h3>" +
        "<p>No hay archivos en esta ubicacion.</p>" +
        "<small>Permiso: lectura y escritura permitidas.</small>" +
      "</section>";
  }

  contenidoApp.innerHTML = "<section class='explorador-archivos'>" + contenido + "</section>";

  document.querySelectorAll("[data-carpeta]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      carpetaArchivosActual = boton.dataset.carpeta;
      mensajeArchivos = "";
      dibujarArchivos();
    });
  });

  document.querySelectorAll("[data-etiqueta]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      etiquetaArchivosActual = boton.dataset.etiqueta;
      carpetaArchivosActual = "etiqueta";
      mensajeArchivos = "";
      dibujarArchivos();
    });
  });

  document.querySelectorAll("[data-abrir-menu-etiqueta]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      const indice = Number(boton.dataset.abrirMenuEtiqueta);
      menuEtiquetaDocumento = menuEtiquetaDocumento === indice ? -1 : indice;
      dibujarArchivos();
    });
  });

  document.querySelectorAll("[data-asignar-etiqueta]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      cambiarEtiquetaDocumento(Number(boton.dataset.indiceEtiqueta), boton.dataset.asignarEtiqueta);
    });
  });

  document.querySelectorAll("[data-restaurar-documento]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      manejarDocumentoEliminado("restaurar", Number(boton.dataset.restaurarDocumento));
    });
  });

  document.querySelectorAll("[data-borrar-documento]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      manejarDocumentoEliminado("borrar", Number(boton.dataset.borrarDocumento));
    });
  });

  document.querySelectorAll("[data-restaurar-foto-archivos]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      manejarFotoEliminadaDesdeArchivos("restaurar", Number(boton.dataset.restaurarFotoArchivos));
    });
  });

  document.querySelectorAll("[data-borrar-foto-archivos]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      manejarFotoEliminadaDesdeArchivos("borrar", Number(boton.dataset.borrarFotoArchivos));
    });
  });

  document.querySelectorAll("[data-eliminar-documento-archivos]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      eliminarDocumentoDesdeArchivos(Number(boton.dataset.eliminarDocumentoArchivos));
    });
  });
}

/* funcion que abre los accesorios desde la opcion Bluetooth. */
function abrirBluetooth() {
  if (!validarPermisoAdministrador("cambiar conexiones Bluetooth")) {
    return;
  }

  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Bluetooth";
  subtituloApp.textContent = "Ajustes";
  dibujarBluetooth();
}

/* funcion que dibuja cada dispositivo y el proceso que lo atiende. */
function dibujarBluetooth() {
  let dispositivosHtml = "";

  dispositivosEntradaSalida.forEach(function (dispositivo) {
    const estado = dispositivo.conectado ? "Conectado" : "Desconectado";
    const claseEstado = dispositivo.conectado ? "conectado" : "desconectado";
    const accion = dispositivo.conectado ? "Desconectar" : "Conectar";

    dispositivosHtml += "<article class='fila-dispositivo'>" +
      "<span class='icono-dispositivo'>" + dispositivo.icono + "</span>" +
      "<div><strong>" + dispositivo.nombre + "</strong><p>" + dispositivo.tipo + "</p>" +
      "<small>Controlador: " + dispositivo.proceso + "</small></div>" +
      "<span class='estado-dispositivo " + claseEstado + "'>" + estado + "</span>" +
      "<button class='boton-conexion' data-dispositivo='" + dispositivo.id + "'>" + accion + "</button>" +
    "</article>";
  });

  contenidoApp.innerHTML =
    "<button class='ruta-volver' id='volverAjustes'>‹ Ajustes</button>" +
    "<section class='tarjeta'>" +
      "<h3>Bluetooth</h3>" +
      "<p class='alerta'>" + mensajeEntradaSalida + "</p>" +
    "</section>" +
    "<section class='lista-vertical'>" + dispositivosHtml + "</section>" +
    "<section class='tarjeta'>" +
      "<h3>Controladores</h3>" +
      "<p class='texto-dispositivo'>El dispositivo queda conectado hasta que presiones Desconectar. Su controlador aparece en la parte superior de Procesos.</p>" +
    "</section>";

  document.getElementById("volverAjustes").addEventListener("click", function () {
    abrirAppAjustes();
  });

  document.querySelectorAll("[data-dispositivo]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      cambiarConexionDispositivo(boton.dataset.dispositivo);
    });
  });
}

/* funcion que conecta o desconecta un dispositivo simulado. */
function cambiarConexionDispositivo(idDispositivo) {
  if (!validarPermisoAdministrador("conectar o desconectar dispositivos")) {
    mensajeEntradaSalida = "Acceso denegado para Invitado.";
    dibujarBluetooth();
    return;
  }

  const dispositivo = dispositivosEntradaSalida.find(function (item) {
    return item.id === idDispositivo;
  });

  if (!dispositivo) {
    return;
  }

  dispositivo.conectado = !dispositivo.conectado;

  if (dispositivo.conectado) {
    mensajeEntradaSalida = dispositivo.nombre + " conectado. " + dispositivo.proceso + " lo reconocio.";
  } else {
    mensajeEntradaSalida = dispositivo.nombre + " desconectado.";
  }

  dibujarBluetooth();
}

/* funcion que muestra las apps abiertas recientemente. */
function abrirAppsRecientes() {
  tituloApp.textContent = "Recientes";
  subtituloApp.textContent = "Multitarea";
  dibujarAppsRecientes();
}

/* funcion que dibuja y permite cerrar apps recientes. */
function dibujarAppsRecientes() {
  let recientesHtml = "";

  appsRecientes.forEach(function (idApp) {
    const estado = obtenerEstadoApp(idApp);
    const memoria = obtenerMemoriaApp(idApp, estado);

    recientesHtml += "<article class='tarjeta-reciente'><div><strong>" + obtenerNombreApp(idApp) + "</strong><p>" + estado + " - " + memoria + " MB</p></div>" +
      "<button class='boton-cerrar-reciente' data-cerrar-reciente='" + idApp + "'>Cerrar</button></article>";
  });

  contenidoApp.innerHTML = "<section class='tarjeta'><h3>Apps recientes</h3><p class='alerta'>Cierra una app para liberar memoria.</p></section>" +
    "<section class='lista-vertical'>" + (recientesHtml || "<article class='tarjeta'><strong>No hay apps abiertas.</strong></article>") + "</section>";

  document.querySelectorAll("[data-cerrar-reciente]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      cerrarAppReciente(boton.dataset.cerrarReciente);
    });
  });
}

/* funcion que elimina una app del historial reciente. */
function cerrarAppReciente(idApp) {
  appsRecientes = appsRecientes.filter(function (app) {
    return app !== idApp;
  });

  if (appActual === idApp) {
    appActual = null;
  }

  actualizarMemoriaVirtual();
  dibujarAppsRecientes();
}
/* funcion que muestra la app de procesos del sistema. */
function abrirAppProcesos() {
  tituloApp.textContent = "Procesos";
  subtituloApp.textContent = "CPU y planificador";
  cicloProcesoTemporal = 0;
  procesoTemporal.estado = "Nuevo";
  procesoEnCpu = "Preparando CPU";
  turnoPlanificador = 0;
  turnosCpuProcesos = {};
  subtareasCamara.forEach(function (subtarea) {
    subtarea.estado = "Listo";
    subtarea.turnos = 0;
  });
  actualizarProcesosSistema();
  dibujarProcesos();

  clearInterval(intervaloProcesos);
  intervaloProcesos = setInterval(function () {
    actualizarProcesosSistema();
    dibujarProcesos();
  }, 1200);
}

/* funcion que dibuja los procesos en la pantalla. */
function dibujarProcesos() {
  let procesosHtml = "";
  let subtareasHtml = "";
  let dispositivosConectadosHtml = "";

  dispositivosEntradaSalida.forEach(function (dispositivo) {
    if (dispositivo.conectado) {
      dispositivosConectadosHtml += "<article class='fila-dispositivo-proceso'>" +
        "<span>" + dispositivo.icono + "</span>" +
        "<div><strong>" + dispositivo.nombre + "</strong><p>Controlador activo: " + dispositivo.proceso + "</p></div>" +
        "<b>Conectado</b>" +
      "</article>";
    }
  });

  if (dispositivosConectadosHtml === "") {
    dispositivosConectadosHtml = "<p class='texto-dispositivo'>No hay accesorios conectados. Conecta uno desde Ajustes > Bluetooth.</p>";
  }

  procesosSistema.forEach(function (proceso) {
    const dispositivosActivos = dispositivosEntradaSalida.filter(function (dispositivo) {
      return dispositivo.conectado && dispositivo.proceso === proceso.nombre;
    }).map(function (dispositivo) {
      return dispositivo.nombre;
    }).join(", ");

    const informacionDispositivo = dispositivosActivos ? " - Atiende: " + dispositivosActivos : "";

    procesosHtml += "<article class='fila-proceso'>" +
      "<div><strong>" + proceso.nombre + "</strong><p>" + proceso.descripcion + "</p></div>" +
      "<span class='estado-proceso " + claseEstadoProceso(proceso.estado) + "'>" + proceso.estado + "</span>" +
      "<small>Prioridad " + proceso.prioridad + " - " + proceso.memoria + " MB - Turnos CPU " + (turnosCpuProcesos[proceso.nombre] || 0) + informacionDispositivo + "</small>" +
    "</article>";
  });

  subtareasCamara.forEach(function (subtarea) {
    subtareasHtml += "<article class='fila-subtarea'>" +
      "<div><strong>" + subtarea.nombre + "</strong><p>" + subtarea.descripcion + "</p></div>" +
      "<span class='estado-proceso " + claseEstadoProceso(subtarea.estado) + "'>" + subtarea.estado + "</span>" +
      "<small>Turnos de CPU: " + subtarea.turnos + " (veces que pudo trabajar)</small>" +
    "</article>";
  });

  let appsHtml = "";

  appsRecientes.forEach(function (idApp, indice) {
    const estadoApp = obtenerEstadoApp(idApp);
    const memoriaApp = obtenerMemoriaApp(idApp, estadoApp);
    const claseEstado = estadoApp === "Memoria virtual" ? " virtual" : "";

    appsHtml += "<article class='fila-proceso'>" +
      "<div><strong>" + obtenerNombreApp(idApp) + "</strong><p>App reciente del usuario</p></div>" +
      "<span class='estado-proceso" + claseEstado + "'>" + estadoApp + "</span>" +
      "<small>Prioridad " + (indice + 4) + " - " + memoriaApp + " MB</small>" +
    "</article>";
  });

  if (appsHtml === "") {
    appsHtml = "<article class='fila-proceso'><div><strong>Sin apps recientes</strong><p>Abre una app para verla aqui</p></div><span class='estado-proceso listo'>Listo</span></article>";
  }

  contenidoApp.innerHTML =
    "<section class='tarjeta'>" +
      "<p class='alerta'>Esta pantalla se mueve sola para demostrar como el sistema reparte el procesador.</p>" +
      "<div class='cpu-actual'><small>CPU actual</small><strong>" + procesoEnCpu + "</strong></div>" +
      "<div class='dato-planificador'><strong>Algoritmo: Prioridades (iOS)</strong><p>Turno actual: prioridad " + prioridadCpuActual + ". " + explicacionPlanificador + "</p></div>" +
      "<div class='leyenda-estados'><span class='nuevo'>Nuevo</span><span class='listo'>Listo</span><span class='ejecucion'>Ejecucion</span><span class='bloqueado'>Bloqueado</span><span class='terminado'>Terminado</span></div>" +
    "</section>" +
    "<section class='tarjeta dispositivos-procesos'><h3>Dispositivos conectados</h3>" + dispositivosConectadosHtml + "</section>" +
    "<section class='tarjeta'><h3>Procesos del sistema</h3></section>" +
    "<section class='lista-vertical'>" + procesosHtml + "</section>" +
    "<section class='tarjeta'><h3>Subtareas de Camara</h3><p class='alerta'>Camara se divide en tres trabajos. Cada turno significa una oportunidad de usar CPU.</p></section>" +
    "<section class='lista-vertical'>" + subtareasHtml + "</section>" +
    "<section class='tarjeta'><h3>Proceso temporal</h3><p class='alerta'>Este proceso muestra el ciclo completo desde que inicia hasta que termina.</p></section>" +
    "<section class='lista-vertical'><article class='fila-proceso'><div><strong>" + procesoTemporal.nombre + "</strong><p>" + procesoTemporal.descripcion + "</p></div><span class='estado-proceso " + claseEstadoProceso(procesoTemporal.estado) + "'>" + procesoTemporal.estado + "</span><small>Prioridad " + procesoTemporal.prioridad + " - " + procesoTemporal.memoria + " MB</small></article></section>" +
    "<section class='tarjeta'><h3>Apps recientes</h3><p class='alerta'>Las apps abiertas permanecen en segundo plano o memoria virtual.</p></section>" +
    "<section class='lista-vertical'>" + appsHtml + "</section>";
}
/* función que muestra la memoria interna del simulador. */
function abrirAppDiagnostico() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Diagnostico";
  subtituloApp.textContent = "Memoria RAM";

  let ramTotal = 6144;
  let virtualTotal = 2048;
  let ramUsada = 0;
  let virtualUsada = 0;

  /* calcula RAM y memoria virtual con procesos y apps recientes. */
  let procesosHtml = "";
  let marcosHtml = "";
  let paginasHtml = "";
  let ordenLruHtml = "";

  procesosSistema.forEach(function (proceso) {
    ramUsada += proceso.memoria;

    procesosHtml += "<article class='fila-proceso'>" +
      "<div><strong>" + proceso.nombre + "</strong><p>RAM usada por el proceso</p></div>" +
      "<span class='estado-proceso'>" + proceso.memoria + " MB</span>" +
      "<small>Prioridad " + proceso.prioridad + " - Estado " + proceso.estado + "</small>" +
    "</article>";
  });

  /* separa las apps que consumen RAM de las que usan memoria virtual. */
  appsRecientes.forEach(function (idApp) {
    const estado = obtenerEstadoApp(idApp);
    const memoria = obtenerMemoriaApp(idApp, estado);

    if (estado === "Memoria virtual") {
      virtualUsada += memoria;
    } else {
      ramUsada += memoria;
    }

  });

  appsRecientes.forEach(function (idApp, indice) {
    const clase = appsEnMemoriaVirtual.includes(idApp) ? " virtual" : "";
    const texto = indice === 0 ? "Mas reciente" : "Uso " + (indice + 1);

    ordenLruHtml += "<span class='chip-lru" + clase + "'>" + texto + ": " + obtenerNombreApp(idApp) + "</span>";
  });

  for (let marco = 0; marco < marcosRamApps; marco++) {
    const idApp = appsRecientes[marco];

    if (idApp) {
      const estado = obtenerEstadoApp(idApp);
      const memoria = obtenerMemoriaApp(idApp, estado);

      marcosHtml += "<article class='marco-memoria ocupado'>" +
        "<small>Marco RAM " + (marco + 1) + "</small>" +
        "<strong>" + obtenerNombreApp(idApp) + "</strong>" +
        "<p>" + estado + " - " + memoria + " MB</p>" +
      "</article>";
    } else {
      marcosHtml += "<article class='marco-memoria libre'>" +
        "<small>Marco RAM " + (marco + 1) + "</small>" +
        "<strong>Libre</strong>" +
      "</article>";
    }
  }

  appsEnMemoriaVirtual.forEach(function (idApp, indice) {
    const memoria = obtenerMemoriaApp(idApp, "Memoria virtual");

    paginasHtml += "<article class='pagina-virtual'>" +
      "<small>Pagina " + (indice + 1) + "</small>" +
      "<strong>" + obtenerNombreApp(idApp) + "</strong>" +
      "<p>" + memoria + " MB</p>" +
    "</article>";
  });

  contenidoApp.innerHTML =
    "<section class='tarjeta'>" +
      "<h3>Monitor de memoria</h3>" +
      "<p class='texto-memoria'>RAM fisica: " + ramUsada + " MB / " + ramTotal + " MB (6 GB)</p>" +
      "<div class='barra-almacenamiento'><span style='width:" + ((ramUsada / ramTotal) * 100) + "%; background:#0a84ff'></span></div>" +
      "<p class='texto-memoria'>Memoria virtual: " + virtualUsada + " MB / " + virtualTotal + " MB</p>" +
      "<div class='barra-almacenamiento'><span style='width:" + ((virtualUsada / virtualTotal) * 100) + "%; background:#ff9f0a'></span></div>" +
    "</section>" +
    "<section class='tarjeta politica-lru'>" +
      "<h3>Politica LRU</h3>" +
      "<p class='alerta'>La RAM guarda 3 apps recientes. Al abrir otra, la menos usada pasa a memoria virtual.</p>" +
      "<div class='orden-lru'>" + (ordenLruHtml || "<span class='chip-lru'>Sin apps abiertas</span>") + "</div>" +
      "<p class='evento-lru'>" + eventoLru + "</p>" +
    "</section>" +
    "<section class='tarjeta'><h3>Marcos de RAM</h3><div class='mapa-marcos'>" + marcosHtml + "</div></section>" +
    "<section class='tarjeta'><h3>Paginacion</h3><p class='texto-memoria'>Apps movidas desde RAM a almacenamiento virtual.</p>" +
      "<div class='mapa-paginas'>" + (paginasHtml || "<p class='pagina-vacia'>No hay paginas virtuales.</p>") + "</div></section>" +
    "<section class='tarjeta'><h3>Procesos del sistema</h3></section>" +
    "<section class='lista-vertical'>" + procesosHtml + "</section>";
}

/* app Safari instalada por defecto. */
function abrirAppSafari() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Safari";
  subtituloApp.textContent = "Navegador";
  dibujarSafari();
}

/* funcion que dibuja el contenido de Safari. */
function dibujarSafari() {
  let historialHtml = "";

  historialSafari.forEach(function (sitio) {
    historialHtml += "<span class='chip-safari'>" + protegerTexto(sitio) + "</span>";
  });

  /* muestra el aviso de Safari solamente despues de presionar instalar desde el navegador. */
  const avisoSafariHtml = intentoInstalacionSafari ?
    "<section class='tarjeta bloqueo-instalacion-externa aviso-safari-externo'>" +
      "<div class='bloqueo-externo-top'><span class='badge-ios'>iOS</span><strong>Instalacion externa</strong></div>" +
      "<p>Intentaste instalar Teams desde Safari, pero iOS no permite instalar apps desde el navegador.</p>" +
      "<p class='mensaje-externo mensaje-externo-oscuro'>" + mensajeSafari + "</p>" +
    "</section>" : "";

  contenidoApp.innerHTML =
    "<section class='app-safari'>" +
      "<section class='barra-safari'>" +
        "<span class='candado-safari'></span>" +
        "<input id='urlSafari' type='text' value='" + protegerTexto(urlSafari) + "' placeholder='Buscar o ingresar sitio web'>" +
        "<button id='irSafari' class='boton-principal'>Ir</button>" +
      "</section>" +
      "<section class='tarjeta navegador-ios'>" +
        "<h3>Descarga de Microsoft Teams</h3>" +
        avisoSafariHtml +
        "<button id='instalarDesdeSafari' class='boton-bloqueado-ios'>Instalar Teams desde Safari</button>" +
        "<button id='abrirStoreSafari' class='boton-principal'>Ir a App Store</button>" +
      "</section>" +
      "<section class='tarjeta'><h3>Historial</h3><div class='historial-safari'>" + historialHtml + "</div></section>" +
    "</section>";

  document.getElementById("irSafari").addEventListener("click", function () {
    const valor = document.getElementById("urlSafari").value.trim() || "apple.com";
    urlSafari = valor;
    historialSafari.unshift(valor);
    historialSafari = historialSafari.slice(0, 5);
    intentoInstalacionSafari = false;
    mensajeSafari = "";
    dibujarSafari();
  });

  document.getElementById("instalarDesdeSafari").addEventListener("click", function () {
    bloquearInstalacionExternaDesdeSafari();
  });

  document.getElementById("abrirStoreSafari").addEventListener("click", function () {
    abrirApp("appstore");
  });
}

/* funcion que bloquea descargas fuera de App Store. */
function bloquearInstalacionExternaDesdeSafari() {
  /* valida permisos antes de intentar instalar desde Safari. */
  if (!validarPermisoAdministrador("instalar aplicaciones desde Safari")) {
    return;
  }

  intentoInstalacionSafari = true;
  mensajeSafari = "Safari no puede instalar Teams. Si deseas continuar, toca Ir a App Store.";
  registrarAlertaSeguridad("Safari bloqueo una instalacion externa de Teams.");
  dibujarSafari();
}

/* app Instagram descargable con funciones basicas de red social. */
function abrirAppInstagram() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Instagram";
  subtituloApp.textContent = "Red social";
  dibujarInstagram();
}

/* funcion que dibuja las pantallas de Instagram. */
function dibujarInstagram() {
  let contenido = "";

  if (seccionInstagram === "inicio") {
    let publicacionesHtml = "";

    publicacionesInstagram.forEach(function (publicacion) {
      publicacionesHtml += "<article class='post-instagram'><div class='post-top'><span class='avatar-ig'></span><strong>" + protegerTexto(publicacion.usuario) + "</strong></div>" +
        "<div class='imagen-post'></div><p>" + protegerTexto(publicacion.texto) + "</p><small>♥ " + publicacion.likes + " me gusta</small></article>";
    });

    contenido = publicacionesHtml;
  } else if (seccionInstagram === "mensajes") {
    let mensajesHtml = "";

    mensajesInstagram.forEach(function (mensaje) {
      mensajesHtml += "<article class='burbuja-chat " + (mensaje.autor === "Yo" ? "yo" : "") + "'><strong>" + protegerTexto(mensaje.autor) + "</strong><p>" + protegerTexto(mensaje.texto) + "</p></article>";
    });

    contenido = "<section class='chat-app'>" + mensajesHtml + "</section>" +
      "<div class='compositor-chat'><input id='mensajeInstagramTexto' type='text' placeholder='Mensaje para Ricardo'><button id='enviarInstagram' class='boton-principal'>Enviar</button></div>";
  } else if (seccionInstagram === "publicar") {
    contenido = "<section class='tarjeta crear-post'><h3>Nueva publicación</h3>" +
      "<textarea id='textoPublicacionInstagram' placeholder='Escribe un pie de foto...'></textarea>" +
      "<button id='publicarInstagram' class='boton-principal'>Publicar</button></section>";
  } else {
    contenido = "<section class='perfil-instagram'><div class='perfil-top'><span class='avatar-ig grande'></span><div><h3>@diego.rojas</h3><p>Simulador iOS · Proyecto escolar</p></div></div>" +
      "<div class='metricas-ig'><span><strong>" + publicacionesInstagram.length + "</strong><small>posts</small></span><span><strong>248</strong><small>seguidores</small></span><span><strong>301</strong><small>seguidos</small></span></div>" +
      "<button id='editarPerfilInstagram' class='boton-gris'>Editar perfil</button></section>";
  }

  contenidoApp.innerHTML =
    "<section class='app-instagram'>" +
      "<nav class='tabs-app'>" +
        "<button data-instagram-seccion='inicio' class='" + (seccionInstagram === "inicio" ? "activo" : "") + "'>Inicio</button>" +
        "<button data-instagram-seccion='mensajes' class='" + (seccionInstagram === "mensajes" ? "activo" : "") + "'>Mensajes</button>" +
        "<button data-instagram-seccion='publicar' class='" + (seccionInstagram === "publicar" ? "activo" : "") + "'>Publicar</button>" +
        "<button data-instagram-seccion='perfil' class='" + (seccionInstagram === "perfil" ? "activo" : "") + "'>Perfil</button>" +
      "</nav>" +
      (mensajeInstagram ? "<p class='mensaje-app'>" + mensajeInstagram + "</p>" : "") +
      contenido +
    "</section>";

  document.querySelectorAll("[data-instagram-seccion]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      seccionInstagram = boton.dataset.instagramSeccion;
      mensajeInstagram = "";
      dibujarInstagram();
    });
  });

  if (document.getElementById("enviarInstagram")) {
    document.getElementById("enviarInstagram").addEventListener("click", enviarMensajeInstagram);
  }

  if (document.getElementById("publicarInstagram")) {
    document.getElementById("publicarInstagram").addEventListener("click", publicarInstagram);
  }

  if (document.getElementById("editarPerfilInstagram")) {
    document.getElementById("editarPerfilInstagram").addEventListener("click", function () {
      mensajeInstagram = "Perfil actualizado en modo demostracion.";
      dibujarInstagram();
    });
  }
}

/* funcion que envia un mensaje en Instagram. */
function enviarMensajeInstagram() {
  const entrada = document.getElementById("mensajeInstagramTexto");
  const texto = entrada.value.trim();

  if (texto === "") {
    return;
  }

  mensajesInstagram.push({ autor: "Yo", texto: texto });
  mensajesInstagram.push({ autor: "Ricardo", texto: "Recibido, lo reviso." });
  mensajeInstagram = "Mensaje enviado por Direct.";
  dibujarInstagram();
}

/* funcion que publica una imagen en Instagram. */
function publicarInstagram() {
  const texto = document.getElementById("textoPublicacionInstagram").value.trim();

  if (texto === "") {
    return;
  }

  publicacionesInstagram.unshift({ usuario: "diego.rojas", texto: texto, likes: 0 });
  seccionInstagram = "inicio";
  mensajeInstagram = "Publicacion agregada al feed.";
  dibujarInstagram();
}

/* app WhatsApp descargable. */
function abrirAppWhatsApp() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "WhatsApp";
  subtituloApp.textContent = "Ricardo";
  dibujarWhatsApp();
}

/* funcion que dibuja los chats de WhatsApp. */
function dibujarWhatsApp() {
  let mensajesHtml = "";

  mensajesWhatsApp.forEach(function (mensaje) {
    if (mensaje.tipo === "foto") {
      mensajesHtml += "<article class='burbuja-chat foto-chat " + (mensaje.autor === "Yo" ? "yo" : "") + "'>" +
        "<strong>" + protegerTexto(mensaje.autor) + "</strong>" +
        "<div class='preview-perro-whatsapp'></div>" +
        "<p>" + protegerTexto(mensaje.texto) + "</p>" +
      "</article>";
    } else {
      mensajesHtml += "<article class='burbuja-chat " + (mensaje.autor === "Yo" ? "yo" : "") + "'><strong>" + protegerTexto(mensaje.autor) + "</strong><p>" + protegerTexto(mensaje.texto) + "</p></article>";
    }
  });

  contenidoApp.innerHTML =
    "<section class='app-whatsapp'>" +
      "<section class='cabecera-chat'><span class='avatar-wa'></span><div><h3>Ricardo</h3><p>en línea</p></div></section>" +
      "<section class='chat-app'>" + mensajesHtml + "</section>" +
      "<p class='mensaje-app'>" + mensajeWhatsApp + "</p>" +
      "<div class='acciones-whatsapp'>" +
        "<button id='notaVozWhatsApp' class='boton-gris'>Nota de voz</button>" +
        "<button id='archivoWhatsApp' class='boton-gris'>Enviar archivo</button>" +
        "<button id='recibirFotoWhatsApp' class='boton-gris boton-ancho'>Ricardo envía foto</button>" +
      "</div>" +
      "<div class='compositor-chat'><input id='mensajeWhatsAppTexto' type='text' placeholder='Mensaje a Ricardo'><button id='enviarWhatsApp' class='boton-principal'>Enviar</button></div>" +
    "</section>";

  document.getElementById("enviarWhatsApp").addEventListener("click", enviarMensajeWhatsApp);
  document.getElementById("notaVozWhatsApp").addEventListener("click", enviarNotaVozWhatsApp);
  document.getElementById("archivoWhatsApp").addEventListener("click", enviarArchivoWhatsApp);
  document.getElementById("recibirFotoWhatsApp").addEventListener("click", recibirFotoPerroWhatsApp);
}

/* funcion que envia un mensaje en WhatsApp. */
function enviarMensajeWhatsApp() {
  const entrada = document.getElementById("mensajeWhatsAppTexto");
  const texto = entrada.value.trim();

  if (texto === "") {
    return;
  }

  mensajesWhatsApp.push({ autor: "Yo", texto: texto });
  mensajesWhatsApp.push({ autor: "Ricardo", texto: "Va, gracias." });
  mensajeWhatsApp = "Mensaje enviado a Ricardo.";
  dibujarWhatsApp();
}

/* funcion que envia un audio simulado en WhatsApp. */
function enviarNotaVozWhatsApp() {
  mensajesWhatsApp.push({ autor: "Yo", texto: "Nota de voz enviada · 0:08" });
  mensajeWhatsApp = "Nota de voz enviada correctamente.";
  dibujarWhatsApp();
}

/* funcion que comparte un archivo en WhatsApp. */
function enviarArchivoWhatsApp() {
  mensajesWhatsApp.push({ autor: "Yo", texto: "Archivo enviado: avance_simulador_ios.pdf" });
  mensajeWhatsApp = "Archivo compartido con Ricardo.";
  dibujarWhatsApp();
}

/* simula que Ricardo manda una foto y iOS la guarda en Fotos. */
function recibirFotoPerroWhatsApp() {
  const ahora = new Date();
  const numero = String(fotosRecibidasWhatsApp + 1).padStart(4, "0");
  const nombreFoto = "WA_RICARDO_PERRO_" + numero + ".HEIC";

  fotosRecibidasWhatsApp++;

  mensajesWhatsApp.push({
    autor: "Ricardo",
    tipo: "foto",
    texto: "Te mandé una foto de mi perro."
  });

  fotosCamara.unshift({
    nombre: nombreFoto,
    fecha: ahora.toLocaleDateString("es-MX", { day: "numeric", month: "short" }),
    hora: ahora.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    tamano: "2.6 MB",
    fondo: "perro",
    origen: "WhatsApp - Ricardo"
  });

  albumFotosActual = "biblioteca";
  mensajeFotos = nombreFoto + " se descargó desde WhatsApp y ya aparece en Fotos.";
  mensajeWhatsApp = "Foto recibida de Ricardo y guardada automáticamente en Fotos.";
  dibujarWhatsApp();
}

/* app Microsoft Teams descargable. */
function abrirAppTeams() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Teams";
  subtituloApp.textContent = "Trabajo escolar";
  dibujarTeams();
}

/* funcion que dibuja chats, tareas y calendario en Teams. */
function dibujarTeams() {
  let contenido = "";

  if (seccionTeams === "chat") {
    let mensajesHtml = "";

    mensajesTeams.forEach(function (mensaje) {
      mensajesHtml += "<article class='burbuja-chat " + (mensaje.autor === "Yo" ? "yo" : "") + "'><strong>" + protegerTexto(mensaje.autor) + "</strong><p>" + protegerTexto(mensaje.texto) + "</p></article>";
    });

    contenido = "<section class='chat-app'>" + mensajesHtml + "</section>" +
      "<div class='compositor-chat'><input id='mensajeTeamsTexto' type='text' placeholder='Mensaje al equipo'><button id='enviarTeams' class='boton-principal'>Enviar</button></div>";
  } else if (seccionTeams === "tareas") {
    let tareasHtml = "";

    tareasTeams.forEach(function (tarea, indice) {
      tareasHtml += "<article class='fila-team'><div><strong>" + protegerTexto(tarea.titulo) + "</strong><p>" + (tarea.completada ? "Completada" : "Pendiente") + "</p></div>" +
        "<button data-completar-tarea='" + indice + "' class='boton-gris'>" + (tarea.completada ? "Reabrir" : "Completar") + "</button></article>";
    });

    contenido = "<section class='lista-vertical'>" + tareasHtml + "</section>" +
      "<button id='agregarTareaTeams' class='boton-principal boton-ancho'>Agregar tarea demo</button>";
  } else if (seccionTeams === "equipos") {
    contenido = "<section class='tarjeta equipo-teams'><h3>Sistemas Operativos</h3><p>Canales: General, Proyecto iOS, Entregas</p><button id='abrirCanalTeams' class='boton-principal'>Entrar a canal Proyecto iOS</button></section>" +
      "<section class='tarjeta equipo-teams'><h3>Inglés</h3><p>Canal de prácticas y avisos.</p></section>";
  } else if (seccionTeams === "calendario") {
    let eventosHtml = "";

    eventosTeams.forEach(function (evento) {
      eventosHtml += "<article class='fila-team'><div><strong>" + protegerTexto(evento.titulo) + "</strong><p>Hoy · " + protegerTexto(evento.hora) + "</p></div><span class='badge-team'>Meet</span></article>";
    });

    contenido = "<section class='lista-vertical'>" + eventosHtml + "</section><button id='agregarEventoTeams' class='boton-principal boton-ancho'>Agregar reunión</button>";
  } else if (seccionTeams === "configuracion") {
    contenido = "<section class='tarjeta'><h3>Configuración</h3>" +
      "<article class='fila-team'><div><strong>Notificaciones</strong><p>" + (notificacionesTeams ? "Activadas" : "Silenciadas") + "</p></div><button id='toggleTeams' class='boton-gris'>Cambiar</button></article>" +
      "<article class='fila-team'><div><strong>Estado</strong><p>Disponible</p></div><span class='badge-team'>Online</span></article></section>";
  } else {
    contenido = "<section class='tarjeta'><h3>Actividad</h3><p>Último cambio: " + protegerTexto(mensajeTeams) + "</p><p>Sin menciones nuevas.</p></section>";
  }

  contenidoApp.innerHTML =
    "<section class='app-teams'>" +
      "<nav class='tabs-app teams-tabs'>" +
        "<button data-teams-seccion='chat' class='" + (seccionTeams === "chat" ? "activo" : "") + "'>Chat</button>" +
        "<button data-teams-seccion='tareas' class='" + (seccionTeams === "tareas" ? "activo" : "") + "'>Tareas</button>" +
        "<button data-teams-seccion='equipos' class='" + (seccionTeams === "equipos" ? "activo" : "") + "'>Equipos</button>" +
        "<button data-teams-seccion='calendario' class='" + (seccionTeams === "calendario" ? "activo" : "") + "'>Calendario</button>" +
        "<button data-teams-seccion='configuracion' class='" + (seccionTeams === "configuracion" ? "activo" : "") + "'>Config</button>" +
        "<button data-teams-seccion='actividad' class='" + (seccionTeams === "actividad" ? "activo" : "") + "'>Actividad</button>" +
      "</nav>" +
      "<p class='mensaje-app'>" + mensajeTeams + "</p>" +
      contenido +
    "</section>";

  document.querySelectorAll("[data-teams-seccion]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      seccionTeams = boton.dataset.teamsSeccion;
      dibujarTeams();
    });
  });

  if (document.getElementById("enviarTeams")) {
    document.getElementById("enviarTeams").addEventListener("click", enviarMensajeTeams);
  }

  if (document.getElementById("agregarTareaTeams")) {
    document.getElementById("agregarTareaTeams").addEventListener("click", agregarTareaTeams);
  }

  document.querySelectorAll("[data-completar-tarea]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      completarTareaTeams(Number(boton.dataset.completarTarea));
    });
  });

  if (document.getElementById("agregarEventoTeams")) {
    document.getElementById("agregarEventoTeams").addEventListener("click", agregarEventoTeams);
  }

  if (document.getElementById("toggleTeams")) {
    document.getElementById("toggleTeams").addEventListener("click", alternarNotificacionesTeams);
  }

  if (document.getElementById("abrirCanalTeams")) {
    document.getElementById("abrirCanalTeams").addEventListener("click", function () {
      seccionTeams = "chat";
      mensajeTeams = "Canal Proyecto iOS abierto.";
      dibujarTeams();
    });
  }
}

/* funcion que envia un mensaje en Teams. */
function enviarMensajeTeams() {
  const entrada = document.getElementById("mensajeTeamsTexto");
  const texto = entrada.value.trim();

  if (texto === "") {
    return;
  }

  mensajesTeams.push({ autor: "Yo", texto: texto });
  mensajeTeams = "Mensaje publicado en el chat del equipo.";
  dibujarTeams();
}

/* funcion que agrega una tarea en Teams. */
function agregarTareaTeams() {
  tareasTeams.push({ titulo: "Subir capturas del simulador", completada: false });
  mensajeTeams = "Nueva tarea agregada.";
  dibujarTeams();
}

/* funcion que marca una tarea como completada. */
function completarTareaTeams(indice) {
  tareasTeams[indice].completada = !tareasTeams[indice].completada;
  mensajeTeams = tareasTeams[indice].completada ? "Tarea marcada como completada." : "Tarea reabierta.";
  dibujarTeams();
}

/* funcion que agrega un evento en Teams. */
function agregarEventoTeams() {
  eventosTeams.push({ titulo: "Videollamada de seguimiento", hora: "12:30" });
  mensajeTeams = "Reunión agregada al calendario.";
  dibujarTeams();
}

/* funcion que activa o desactiva notificaciones de Teams. */
function alternarNotificacionesTeams() {
  notificacionesTeams = !notificacionesTeams;
  mensajeTeams = notificacionesTeams ? "Notificaciones activadas." : "Notificaciones silenciadas.";
  dibujarTeams();
}

/* función que muestra la tienda para instalar apps. */
function abrirAppStore() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "App Store";
  subtituloApp.textContent = "Instalar apps";
  dibujarAppStore();
}

/* función que dibuja las apps de la tienda. */
function dibujarAppStore() {
  let appsHtml = "";

  appsTienda.forEach(function (app) {
    const instalada = appsInstaladas.includes(app.id);
    const cargando = appsCargando[app.id];
    const progreso = cargando ? "<div class='progreso-tienda'><span></span></div>" : "";
    let botones = "";

    /* cambia los botones segun el estado de la app. */
    if (cargando) {
      botones = "<button class='boton-gris' disabled>" + cargando + "</button>";
    } else if (instalada) {
      botones = "<div class='acciones-tienda'>" +
        "<button class='boton-principal' data-abrir-tienda='" + app.id + "'>Abrir</button>" +
        "<button class='boton-gris' data-actualizar='" + app.id + "'>Actualizar</button>" +
        "<button class='boton-gris' data-instalar='" + app.id + "'>Eliminar</button>" +
      "</div>";
    } else {
      botones = "<button class='boton-principal' data-instalar='" + app.id + "'>Obtener</button>";
    }

    appsHtml += "<article class='fila-tienda'>" +
      crearIconoTienda(app.id) +
      "<div><strong>" + app.nombre + "</strong><p>" + app.categoria + " · App verificada por App Store · " + app.gb + " GB</p>" + progreso + "</div>" +
      botones +
    "</article>";
  });

  contenidoApp.innerHTML =
    "<section class='tarjeta appstore-cabecera'>" +
      "<div class='appstore-logo-contenedor'>" + crearIconoApp("appstore") + "</div>" +
      "<div><h3>App Store</h3><p>Instalacion controlada, firma verificada y permisos administrados por iOS.</p></div>" +
    "</section>" +
    "<section class='lista-vertical lista-appstore'>" + appsHtml + "</section>";

  document.querySelectorAll("[data-instalar]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      iniciarCambioInstalacion(boton.dataset.instalar);
    });
  });

  document.querySelectorAll("[data-actualizar]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      actualizarApp(boton.dataset.actualizar);
    });
  });

  /* abre una app instalada directamente desde App Store. */
  document.querySelectorAll("[data-abrir-tienda]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      abrirApp(boton.dataset.abrirTienda);
    });
  });

}

/* función que bloquea cualquier intento de instalación fuera de App Store. */
function bloquearInstalacionExterna() {
  mensajeInstalacionExterna = "Instalación bloqueada. En este iPhone las apps solo se instalan desde App Store.";
  registrarAlertaSeguridad("Instalacion externa bloqueada por iOS.");
  dibujarAppStore();
}

/* función que simula el proceso de instalar o desinstalar. */
function iniciarCambioInstalacion(idApp) {
  if (!validarPermisoAdministrador("instalar o eliminar aplicaciones")) {
    dibujarAppStore();
    return;
  }

  const appAutorizada = appsTienda.some(function (app) {
    return app.id === idApp;
  });

  if (!appAutorizada) {
    bloquearInstalacionExterna();
    return;
  }

  const instalada = appsInstaladas.includes(idApp);
  appsCargando[idApp] = instalada ? "Eliminando..." : "Instalando...";
  dibujarAppStore();

    /* espera para simular el tiempo de descarga o eliminacion. */
  setTimeout(function () {
    cambiarInstalacionApp(idApp);
    delete appsCargando[idApp];
    dibujarAppsInstaladasInicio();
    dibujarAppStore();
  }, 1400);
}

/* función que simula una actualización de la app. */
function actualizarApp(idApp) {
  if (!validarPermisoAdministrador("actualizar aplicaciones")) {
    dibujarAppStore();
    return;
  }

  appsCargando[idApp] = "Actualizando...";
  dibujarAppStore();

    /* la actualizacion conserva la app instalada. */
  setTimeout(function () {
    delete appsCargando[idApp];
    dibujarAppStore();
  }, 1400);
}

/* función que instala o desinstala una app. */
function cambiarInstalacionApp(idApp) {
  const appAutorizada = appsTienda.some(function (app) {
    return app.id === idApp;
  });

  if (!appAutorizada) {
    bloquearInstalacionExterna();
    return;
  }

  if (appsInstaladas.includes(idApp)) {
    appsInstaladas = appsInstaladas.filter(function (app) {
      return app !== idApp;
    });
    appsRecientes = appsRecientes.filter(function (app) {
      return app !== idApp;
    });
    actualizarMemoriaVirtual();
  } else {
    appsInstaladas.push(idApp);
  }

}
/* función que calcula el almacenamiento actual. */
function calcularAlmacenamiento() {
  let appsGb = appsBaseGb;
  let categorias = [];
  let usado = 0;

    /* suma el espacio de cada app descargada. */
  appsInstaladas.forEach(function (idApp) {
    const app = appsTienda.find(function (appTienda) {
      return appTienda.id === idApp;
    });

    if (app) {
      appsGb += app.gb;
    }
  });

  categorias.push({ nombre: "Apps", gb: appsGb, color: "#0a84ff" });

  almacenamientoBase.forEach(function (categoria) {
    categorias.push(categoria);
  });

  categorias.forEach(function (categoria) {
    usado += categoria.gb;
  });

  categorias.push({ nombre: "Libre", gb: capacidadTotal - usado, color: "#d7dce5" });

  return categorias;
}

/* función que muestra las opciones principales de Ajustes. */
function abrirAppAjustes() {
  if (!validarPermisoAdministrador("entrar a Ajustes")) {
    return;
  }

  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Ajustes";
  subtituloApp.textContent = "iPhone";

  contenidoApp.innerHTML =
    "<section class='lista-ajustes'>" +
      "<article class='fila-ajuste perfil-ajuste'><div><strong>" + usuarioActivo + "</strong><p>Cuenta de Apple, iCloud+ y más.</p></div></article>" +
      "<article class='fila-ajuste'><div><span class='icono-ajuste naranja'>✈️</span>Modo de vuelo</div><strong class='switch-ajuste'></strong></article>" +
      "<article class='fila-ajuste'><div><span class='icono-ajuste azul'>📶</span>WiFi</div><strong>IZZI-C3CE</strong></article>" +
      "<button class='fila-ajuste boton-ajuste' id='abrirBluetooth'><div><span class='icono-ajuste azul'>🔵</span>Bluetooth</div><strong>Activado ›</strong></button>" +
      "<article class='fila-ajuste'><div><span class='icono-ajuste verde'>📡</span>Red celular</div><strong></strong></article>" +
      "<article class='fila-ajuste'><div><span class='icono-ajuste verde'>🔗</span>Compartir Internet</div><strong></strong></article>" +
      "<article class='fila-ajuste'><div><span class='icono-ajuste verde'>🔋</span>Bateria</div><strong></strong></article>" +
      "<button class='fila-ajuste boton-ajuste' id='abrirGeneral'><div><span class='icono-ajuste gris'>⚙️</span>General</div><strong></strong></button>" +
      "<button class='fila-ajuste boton-ajuste' id='abrirSeguridadAjustes'><div><span class='icono-ajuste azul'>🔒</span>Privacidad y seguridad</div><strong>Codigo activo ›</strong></button>" +
    "</section>";

  document.getElementById("abrirBluetooth").addEventListener("click", function () {
    abrirBluetooth();
  });

  document.getElementById("abrirGeneral").addEventListener("click", function () {
    abrirGeneral();
  });

  document.getElementById("abrirSeguridadAjustes").addEventListener("click", function () {
    abrirAppSeguridad();
  });
}


/* función que muestra las opciones de General. */
function abrirGeneral() {
  tituloApp.textContent = "General";
  subtituloApp.textContent = "Configuracion";

  contenidoApp.innerHTML =
    "<section class='lista-ajustes'>" +
      "<button class='fila-ajuste boton-ajuste' id='abrirInformacion'><div><span class='icono-ajuste gris'>ℹ️</span>Informacion</div><strong>›</strong></button>" +
      "<article class='fila-ajuste'><div><span class='icono-ajuste gris'>🔄</span>Actualizacion de hardware</div><strong></strong></article>" +
      "<button class='fila-ajuste boton-ajuste' id='abrirAlmacenamiento'><div><span class='icono-ajuste gris'>💾</span>Almacenamiento del iPhone</div><strong></strong></button>" +
    "</section>";

  document.getElementById("abrirInformacion").addEventListener("click", function () {
    abrirInformacion();
  });

  document.getElementById("abrirAlmacenamiento").addEventListener("click", function () {
    abrirAlmacenamiento();
  });
}

/* funcion que muestra los datos del iPhone simulado. */
function abrirInformacion() {
  tituloApp.textContent = "Informacion";
  subtituloApp.textContent = "General";

  contenidoApp.innerHTML =
    "<section class='lista-ajustes'>" +
      "<article class='fila-ajuste'><div>Nombre</div><strong>iPhone 15</strong></article>" +
      "<article class='fila-ajuste'><div>Modelo</div><strong>iPhone 15</strong></article>" +
      "<article class='fila-ajuste'><div>Numero de modelo</div><strong>A3090</strong></article>" +
      "<article class='fila-ajuste'><div>Capacidad</div><strong>128 GB</strong></article>" +
      "<article class='fila-ajuste'><div>Memoria RAM</div><strong>6 GB</strong></article>" +
    "</section>";
}

/* función que muestra el detalle de almacenamiento. */
function abrirAlmacenamiento() {
  tituloApp.textContent = "Almacenamiento";
  subtituloApp.textContent = "iPhone";

  let total = capacidadTotal;
  let usado = 0;
  let barras = "";
  let detalles = "";
    /* obtiene el espacio actualizado de las apps instaladas. */
  const almacenamientoActual = calcularAlmacenamiento();

  almacenamientoActual.forEach(function (categoria) {
    if (categoria.nombre !== "Libre") {
      usado += categoria.gb;
    }
  });

  almacenamientoActual.forEach(function (categoria) {
    const porcentaje = (categoria.gb / total) * 100;

    barras += "<span style='width:" + porcentaje + "%; background:" + categoria.color + "'></span>";

    detalles += "<article class='fila-almacenamiento'>" +
      "<div><span class='punto-almacenamiento' style='background:" + categoria.color + "'></span>" + categoria.nombre + "</div>" +
      "<strong>" + categoria.gb.toFixed(1) + " GB</strong>" +
    "</article>";
  });

  contenidoApp.innerHTML =
    "<section class='tarjeta'>" +
      "<h3>Almacenamiento del iPhone</h3>" +
      "<p class='alerta'>Capacidad: " + total + " GB. Usado: " + usado.toFixed(1) + " GB. Disponible: " + (total - usado).toFixed(1) + " GB.</p>" +
      "<div class='barra-almacenamiento'>" + barras + "</div>" +
    "</section>" +
    "<section class='lista-vertical'>" + detalles + "</section>";
}

/* función que regresa de una app a la pantalla de inicio. */
function volverInicio() {
  appActual = null;
  document.getElementById("vistaApp").classList.remove("pantalla-activa");
  document.getElementById("pantallaInicio").classList.add("pantalla-activa");
  barraEstadoClara();
  clearInterval(intervaloProcesos);
}

/* función que bloquea nuevamente el celular desde la pantalla de inicio. */
function bloquearCelular() {
  appActual = null;
  clearInterval(intervaloProcesos);
  document.getElementById("pantallaInicio").classList.remove("pantalla-activa");
  document.getElementById("vistaApp").classList.remove("pantalla-activa");
  document.getElementById("pantallaBloqueo").classList.add("pantalla-activa");
  barraEstadoClara();

  pinIngresado = "";
  actualizarPuntosPin();
  celularBloqueado = false;
  tiempoBloqueo = 0;

  mensajeDesbloqueo.textContent = "PIN demo: 1234";
  mensajeBloqueoTemporal.textContent = "";
}

/* 
  Eventos del teclado numérico.
*/
botonesTeclado.forEach(function (boton) {
  boton.addEventListener("click", function () {
    manejarTeclaPin(boton.dataset.tecla);
  });
});

/* Eventos de las apps del inicio. */
botonesApps.forEach(function (boton) {
  boton.addEventListener("click", function () {
    abrirApp(boton.dataset.app);
  });
});

/* Evento para regresar al inicio desde una app. */
botonVolverInicio.addEventListener("click", function () {
  if (appActual === "archivos" && carpetaArchivosActual !== "inicio") {
    volverCarpetaArchivos();
  } else {
    volverInicio();
  }
});

/* Evento para cerrar una app y regresar al inicio. */
botonCerrarApp.addEventListener("click", function () {
  volverInicio();
});

/* Evento del botón Lock para volver a bloquear el celular. */
botonBloquear.addEventListener("click", function () {
  bloquearCelular();
});

/* Evento para cerrar la alerta interna del iPhone. */
cerrarAlertaSistema.addEventListener("click", function () {
  alertaSistema.classList.remove("visible");
});


/*  reloj en tiempo real. */
actualizarMemoriaVirtual();
dibujarAppsInstaladasInicio();
actualizarUsuarioInicio();
actualizarReloj();
setInterval(actualizarReloj, 1000);


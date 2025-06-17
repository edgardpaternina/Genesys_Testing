function startGenesysWidget() {
  Window.Genesys = null;
  let gdeploymentId;
  gdeploymentId = document.getElementById("CBoxDeploymentId").value;

  (function (g, e, n, es, ys) {
    g["_genesysJs"] = e;
    g[e] =
      g[e] ||
      function () {
        (g[e].q = g[e].q || []).push(arguments);
      };
    g[e].t = 1 * new Date();
    g[e].c = es;
    ys = document.createElement("script");
    ys.async = 1;
    ys.src = n;
    ys.charset = "utf-8";
    document.head.appendChild(ys);
  })(window, "Genesys", "https://apps.mypurecloud.com/genesys-bootstrap/genesys.min.js", {
    environment: "use1",
    deploymentId: gdeploymentId,
  });
}

function Eventos() {
  if (typeof Genesys == "undefined"){
    return;
  }

  console.log("== Eventos :: Inicio ==");

  Genesys("subscribe", "MessagingService.ready", function(data){
    console.log("** " + data.event + " **");
    messengerServiceReady = true;
    let btnIniciar = document.getElementById("btnIniciarChat");
    if (fromIniciar){
      btnIniciarChat.className = "oculto"
    }
  });
  
  Genesys("subscribe", "MessagingService.started", function(data){
    console.log("** " + data.event + " **");
    conversationActive = !data.data.readOnly;
    newSession = data.data.newSession;
    statusData = {
      "fromIniciar": fromIniciar,
      "conversationActive": conversationActive,
      "newSession": newSession,
      "launcherReady": launcherReady,
      "messengerOpened": messengerOpened
      
    }
    console.log(statusData);
    if (conversationActive && !fromIniciar){
      loadPage = false;
      fromIniciar = true;
      activeReload = true;
      if (launcherReady){
        Genesys("command", "Launcher.show", {}, function(){}, function(){});
      }
      launcherDisplay = true;
      if (!messengerOpened){
        Genesys("command", "Messenger.open", {}, function(){}, function(){});
      }
      let btnToggle = document.getElementById("btnToggle");
      btnToggle.className = "visible";

      let btnIniciar = document.getElementById("btnIniciarChat");
      btnIniciarChat.className = "oculto";
    }
  });

  Genesys("subscribe", "MessagingService.conversationDisconnected", function(data){
    console.log("** " + data.event + " **");
    statusData = {
      "fromIniciar": fromIniciar,
      "conversationActive": conversationActive,
      "newSession": newSession,
      "activeReload": activeReload
    }
    console.log(statusData);
    if (fromIniciar){
      if (conversationActive){
        fromIniciar = false;
        playNotification = false;
        console.log("** Desplegar Encuesta **");
      }
      if (!newSession && !activeReload){
        Genesys("command", "MessagingService.resetConversation", {}, function(){
          console.log("*** messagingservice.resetconversation Accepted ***");
        }, function(){
          console.log("*** messagingservice.resetconversation Rejected ***");
        });
        newSession = false;
      }
    }
    conversationActive = false;
  });

  Genesys("subscribe", "MessagingService.messagesReceived", function(data){
    console.log("** " + data.event + " **");
    if (data.data.messages[0].direction == "Outboubd"){
      if (playNotification){
        console.log("** Reproducir Sonido **");
      }
    }
  });

  Genesys("subscribe", "Messenger.ready", function(data){
    console.log("** " + data.event + " **");
    messengerReady = true;
    messengerReadyCount = messengerReadyCount + 1;
    if (messengerReadyCount > 1){
      let fieldEstado = document.getElementById("fieldEstado");
      fieldEstado.innerHTML = "Listo";
    }
  });
  
  Genesys("subscribe", "Messenger.opened", function(data){
    console.log("** " + data.event + " **");
    messengerOpened = true;
    let btnToggle = document.getElementById("btnToggle");
    btnToggle.innerHTML = "Ocultar Chat";
    if (loadPage){
      Genesys("command", "Messenger.close", {}, function(){}, function(){});
    }
  });

  Genesys("subscribe", "Messenger.closed", function(data){
    console.log("** " + data.event + " **");
    messengerOpened = false;
    let btnToggle = document.getElementById("btnToggle");
    btnToggle.innerHTML = "Mostrar Chat";
  });
  
  Genesys("subscribe", "Launcher.ready", function(data){
    console.log("** " + data.event + " **");
    Genesys("command", "Launcher.hide", {}, function(){}, function(){});
    launcherReady = true;
    if (launcherDisplay){
      Genesys("command", "Launcher.show", {}, function(){}, function(){});
    }
  });
  
  Genesys("subscribe", "Launcher.visible", function(data){
    console.log("** " + data.event + " **");
  });
  
  Genesys("subscribe", "Conversations.ready", function(data){
    console.log("** " + data.event + " **");
  });
  
  Genesys("subscribe", "Conversations.error", function(){
    console.log("** " + data.event + " **", o.data.error);
  });
  
  clearInterval(intervalIdEventos);

  let btnGenesysWidget = document.getElementById("btnGenesysWidget");
  
  btnGenesysWidget.className = "oculto";
  
  console.log("== Eventos :: Final ==");
}

function checkStart(){
  if (messengerReady && launcherReady){
    let btnIniciar = document.getElementById("btnIniciarChat");
    btnIniciarChat.className = "visible";
    clearInterval(intervalIdStart);
  }
}

function iniciarChat() {
  fromIniciar = true;

  if (loadPage){
    AsignarAtributosInicio();
    loadPage = false;
  }
  if (launcherReady){
    Genesys("command", "Launcher.show", {}, function(){}, function(){});
  }
  launcherDisplay = true;
  if (!messengerOpened){
    Genesys("command", "Messenger.open", {}, function(){}, function(){});
  }
  let btnToggle = document.getElementById("btnToggle");
  btnToggle.className = "visible";

  let btnIniciar = document.getElementById("btnIniciarChat");
  btnIniciarChat.className = "oculto";
}

function toggleWidget() {
  let btnToggle = document.getElementById("btnToggle");
  if (btnToggle.innerHTML == "Mostrar Chat") {
    Genesys("command", "Messenger.open", {}, function(){}, function(){});
    btnToggle.innerHTML = "Ocultar Chat";
  } else {
    Genesys("command", "Messenger.close", {}, function(){}, function(){});
    btnToggle.innerHTML = "Mostrar Chat";
  }
}

function AsignarAtributosInicio() {
  Genesys("command", "Database.set", {
    messaging: {
      customAttributes: {
        nid: "123456",
        tid: "01",
      },
    },
  });
}

function ValidarAtributos() {
  const attr = Genesys("command", "Database.get", {}, function(data){});
}

let loadPage = true;
let activeReload = false;

let fromIniciar = false;
let playNotification = true;

let conversationActive = false;
let newSession = false;


let messengerReady = false;
let messengerOpened = false;
let messengerReadyCount = 0;

let launcherReady = false;
let launcherDisplay = false;

let messengerServiceReady = false;

let intervalIdEventos;
let intervalIdStart;

window.onload = function () {
  console.log("Version 1.12");
  intervalIdEventos = setInterval(Eventos, 500);
  intervalIdStart = setInterval(checkStart, 500);
}

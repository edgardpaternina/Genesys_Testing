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
  });
  
  Genesys("subscribe", "MessagingService.started", function(data){
    console.log("** " + data.event + " **");
    let btnIniciar = document.getElementById("btnIniciarChat");
    if(fromIniciar){
      btnIniciarChat.className = "oculto"
    }
    let fieldEstado = document.getElementById("fieldEstado");
    fieldEstado.innerHTML = "Listo";
  });

  Genesys("subscribe", "MessagingService.conversationDisconnected", function(data){
    console.log("** " + data.event + " **");
  });

  Genesys("subscribe", "MessagingService.messageReceived", function(data){
    console.log("** " + data.event + " **");
  });
  
  Genesys("subscribe", "Launcher.ready", function(data){
    console.log("** " + data.event + " **");
  });
  
  Genesys("subscribe", "Launcher.visible", function(data){
    console.log("** " + data.event + " **");
  });
  
  Genesys("subscribe", "Messenger.ready", function(data){
    console.log("** " + data.event + " **");
  });
  
  Genesys("subscribe", "Messenger.opened", function(data){
    console.log("** " + data.event + " **");
    messengerOpened = true;
    let btnToggle = document.getElementById("btnToggle");
    btnToggle.innerHTML = "Ocultar Chat";
  });

  Genesys("subscribe", "Messenger.closed", function(data){
    console.log("** " + data.event + " **");
    messengerClosed = false;
    let btnToggle = document.getElementById("btnToggle");
    btnToggle.innerHTML = "Mostrar Chat";
  });
  
  Genesys("subscribe", "Conversations.ready", function(data){
    console.log("** " + data.event + " **");
    AsignarAtributos();
  });
  
  Genesys("subscribe", "Conversations.started", function(data){
    console.log("** " + data.event + " **");
    AsignarAtributos();
  });
  
  Genesys("subscribe", "Conversations.closed", function(data){
    console.log("** " + data.event + " **");
  });
  
  Genesys("subscribe", "Conversations.opened", function(data){
    console.log("** " + data.event + " **");
  });
  
  Genesys("subscribe", "Conversations.error", function(){
    console.log("** " + data.event + " **", o.data.error);
  });
  
  clearInterval(intervalID);

  let btnGenesysWidget = document.getElementById("btnGenesysWidget");
  let btnIniciar = document.getElementById("btnIniciarChat");
  
  btnGenesysWidget.className = "oculto";
  btnIniciarChat.className = "visible";
  
  console.log("== Eventos :: Final ==");
}

function iniciarChat() {
  fromIniciar = true;

  if(loadPage){
    loadPage = false;
  }
  Genesys("command", "Launcher.show", {}, function(){}, function(){});
  Genesys("command", "Messenger.open", {}, function(){}, function(){});
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

function AsignarAtributos() {
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
let intervalId;
let fromIniciar = false;
let conversationActive = false;
let newSession = false;
let activeReload = false;
let triggerSurvey = true;
let playNotification = true;
let messengerOpened = false;

window.onload = function () {
  intervalID = setInterval(Eventos, 500);
}

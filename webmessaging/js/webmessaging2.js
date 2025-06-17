function genesysWidget() {
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

function ToggleWidget() {
  let boton = document.getElementById("toggle");
  if (boton.innerHTML == "Mostrar Chat") {
    Genesys("command", "Messenger.open", {}, function(){}, function(){});
    boton.innerHTML = "Ocultar Chat";
  } else {
    Genesys("command", "Messenger.close", {}, function(){}, function(){});
    boton.innerHTML = "Mostrar Chat";
  }
}

function Eventos() {
  if (typeof Genesys == "undefined") {
    return;
  }

  console.log("== Eventos :: Inicio ==");

  Genesys("subscribe", "MessagingService.ready", function(data){
    console.log("** " + data.event + " **");
  });
  
  Genesys("subscribe", "MessagingService.started", function (data){
    console.log("** " + data.event + " **");
    
    let btngenesysWidget = document.getElementById("estado");
    btngenesysWidget.innerHTML = "Listo";
  });

  Genesys("subscribe", "MessagingService.conversationDisconnected", function (data){
    console.log("** " + data.event + " **");
  };

  Genesys("subscribe", "MessagingService.messageReceived", function (data){
    console.log("** " + data.event + " **");
  };
  
  Genesys("subscribe", "Launcher.ready", function (data) {
    console.log("** " + data.event + " **");
  });
  
  Genesys("subscribe", "Launcher.visible", function (data) {
    console.log("** " + data.event + " **");
  });
  
  Genesys("subscribe", "Messenger.ready", function (data) {
    console.log("** " + data.event + " **");
  });
  
  Genesys("subscribe", "Messenger.opened", function (data) {
    console.log("** " + data.event + " **");
  });
  
  Genesys("subscribe", "Conversations.ready", function () {
    console.log("** " + data.event + " **");
    AsignarAtributos();
  });
  
  Genesys("subscribe", "Conversations.started", function () {
    console.log("** " + data.event + " **");
    AsignarAtributos();
  });
  
  Genesys("subscribe", "Conversations.closed", function () {
    console.log("** " + data.event + " **");
  });
  
  Genesys("subscribe", "Conversations.opened", function () {
    console.log("** " + data.event + " **");
  });
  
  Genesys("subscribe", "Conversations.error", function () {
    console.log("** " + data.event + " **", o.data.error);
  });
  
  clearInterval(intervalID);
  
  let btnGenesysWidget = document.getElementById("btnGenesysWidget");
  btnGenesysWidget.className = "oculto";
  let btnIniciarChat = document.getElementById("btnIniciarChat");
  btnIniciarChat.className = "visible";
  
  console.log("== Eventos :: Final ==");
}

function BtnIniciarChat() {
  console.log("-- BntInciarChat :: Inicio ---");
  if (!ConversationOpened) {
    Genesys("command", "Messenger.open", {}, function (data) {});
  }

  let boton = document.getElementById("toggle");
  boton.innerHTML = "Ocultar Chat";
  console.log("-- BntInciarChat :: Fin ---");
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

let intervalID;

window.onload = function () {
  intervalID = setInterval(Eventos, 500);
}

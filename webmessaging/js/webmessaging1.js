const OriginatingEntity = Object.freeze({
  Human: "Human",
  Bot: "Bot",
});
var current_OriginatingEntity = "";

function genesysWidget() {
  Window.Genesys = null;
  var gdeploymentId;
  gdeploymentId = document.getElementById("CBoxdeploymentId").value;

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
  if (gdeploymentId == "eca6822c-3d4b-4743-b95b-9750d2905991") {
    Genesys("command", "Messenger.open", {}, function (o) {});
    boton.innerHTML = "Ocultar Chat";
  }
}

function ToggleWidget() {
  let boton = document.getElementById("toggle");
  if (boton.innerHTML == "Mostrar Chat") {
    Genesys("command", "Messenger.open", {}, function (o) {});
    boton.innerHTML = "Ocultar Chat";
  } else {
    Genesys("command", "Messenger.close", {}, function (o) {});
    boton.innerHTML = "Mostrar Chat";
  }
}

function Eventos() {
  console.log("==== Eventos  :: inicio");
  if (typeof Genesys == "undefined") {
    //console.log("==== Eventos  :: aun lo existe objeto Genesys");
    return;
  }

  /*Genesys("command", "Messenger.close", {},
    function(o){},
    );

    let boton = document.getElementById("toggle");
    boton.innerHTML = "Mostrar Chat";*/

  let btngenesysWidget = document.getElementById("btngenesysWidget");
  btngenesysWidget.className = "oculto";

  let btnIniciarChat = document.getElementById("btnIniciarChat");
  btnIniciarChat.className = "visible";

  //Genesys("subscribe", "Conversations.messageAdded", function (o) {
  //  console.log("*******messageAdded Inicio *******");
  //});
  Genesys("subscribe", "MessagingService.messagesReceived", function (o) {
    //console.log("*******MessagingService.messagesReceived Inicio*******");
    const mensaje = o.data.messages[0].text;
    o.data.messages[0].text = "";
    const direction = o.data.messages[0].direction;
    if (direction == "Outbound" && isValidHttpUrl(mensaje)) {
      MostrarPopUp(mensaje);
    }
    console.log(o);
    ValidarAtributos();

    //console.log("*******MessagingService.messagesReceived Final*******");
  });
  ////////////////////
  Genesys("subscribe", "MessagingService.oldMessages", function (o) {
    console.log("*******MessagingService.oldMessages*******");
  });
  Genesys("subscribe", "MessagingService.online", function (o) {
    console.log("*******MessagingService.online*******");
  });
  Genesys("subscribe", "MessagingService.oldMessages", function (o) {
    console.log("*******MessagingService.oldMessages*******");
  });
  Genesys("subscribe", "MessagingService.offline", function (o) {
    console.log("*******MessagingService.offline*******");
  });
  Genesys("subscribe", "MessagingService.started", function (o) {
    console.log("*******MessagingService.started*******");
    let btngenesysWidget = document.getElementById("estado");
    btngenesysWidget.innerHTML = "Listo";
  });
  //Genesys("subscribe", "MessagingService.messagesReceived", function(o){ console.log("*******MessagingService.messagesReceived*******"); });

  //----------------------------------------------------------------------------------------
  Genesys("subscribe", "Launcher.ready", function (o) {
    console.log("*******Launcher.ready*******");
  });
  Genesys("subscribe", "Launcher.visible", function (o) {
    console.log("*******Launcher.visible*******");
  });
  Genesys("subscribe", "Messenger.ready", function (o) {
    console.log("*******Messenger.ready  Inicio *******");
    console.log("*******Messenger.ready  Final *******");
  });
  Genesys("subscribe", "Messenger.opened", function (o) {
    console.log("*******Messenger.opened*******");
  });
  //document.getElementById("txt2").innerHTML = "*** subscribir *****";
  //-----------------------------------------------------
  Genesys("subscribe", "Conversations.ready", function () {
    console.log("*******Conversations.ready*******");
    AsignarAtributos();
  });
  Genesys("subscribe", "Conversations.started", function () {
    console.log("*******Conversations.started*******");
    AsignarAtributos();
  });
  Genesys("subscribe", "Conversations.closed", function () {
    ConversationOpened = false;
    console.log("*******Conversations.closed*******");
  });
  Genesys("subscribe", "Conversations.opened", function () {
    ConversationOpened = true;
    console.log("*******Conversations.opened*******");
  });
  Genesys("subscribe", "Conversations.error", function () {
    console.log("*******Conversations.error*******", o.data.error);
  });
  clearInterval(intervalID);
  console.log("==== Eventos  :: Final");
}
function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
var intervalID;
window.onload = function () {
  localStorage.setItem(
    "_68240440-dd57-4e69-af59-254f9a2c1370:gcmcopn",
    '{"value":"false","ttl":null}'
  );
  intervalID = setInterval(Eventos, 500);
  CfgPopUp();
};

//---------------------------------------
//var tocarAudio = false;
//var focused = true;
//var focused2 = true;
var ConversationOpened = false;
var EnOtroTab = false;

function checkFocus() {
  if (document.activeElement == document.getElementById("genesys-mxg-frame")) {
    focused2 = true;
    //console.log('iframe has focus');
  } else {
    focused2 = false;
    //console.log('iframe not focused');
  }
}

window.onfocus = function () {
  //focused = true;
  //console.log(document.activeElement);
  //console.log(document.getElementById("genesys-mxg-frame"));
  //console.log("-- onfocus ::" + window.location.hostname);
  EnOtroTab = false;

  console.log("onfocus :: EnOtroTab = " + EnOtroTab);
};
window.onblur = function () {
  //focused = false;
  //console.log(document.activeElement);
  //console.log(document.getElementById("genesys-mxg-frame"));
  console.log("-- onblur ::" + window.location.hostname);
  EnOtroTab = true;
  console.log("onblur :: EnOtroTab = " + EnOtroTab);
};
//----------------------------------------

function CfgPopUp() {
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  };
  var embed1 = document.getElementById("embed1");
  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    embed1.src = "";
    modal.style.display = "none";
    console.log("== span.onclick ==");
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      embed1.src = "";
      modal.style.display = "none";
      console.log("== window.onclick ==");
    }
  };
}

function MostrarPopUp(mensaje) {
  // URL Demo https://www.youtube.com/embed/uU3AIBmXF1o
  // https://botpersonasv2dev.blob.core.windows.net/videos/Convi%C3%A9rtase%20en%20cliente%20Davivienda%20abriendo%20una%20Cuenta%20M%C3%B3vil%20_%20Banco%20Davivienda.mp4
  let embed1 = document.getElementById("embed1");
  embed1.src = mensaje;

  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  modal.style.display = "block";
}

function BntInciarChat() {
  console.log("-- BntInciarChat :: Inicio ---");
  if (!ConversationOpened) {
    Genesys("command", "Messenger.open", {}, function (o) {});
  }

  let boton = document.getElementById("toggle");
  boton.innerHTML = "Ocultar Chat";
  console.log("-- BntInciarChat :: Fin ---");
}

function AsignarAtributos() {
  console.log("@@@@@@@@@@@@@@@@@@@  ASIGNANDO ATRIBUTOS @@@@@@@@@@@@@@@@@");
  Genesys("command", "Database.set", {
    messaging: {
      customAttributes: {
        nid: "80243820",
        tid: "01",
      },
    },
  });
}

function ValidarAtributos() {
  const attr = Genesys("command", "Database.get", {}, function (data) {
    console.log("ValidarAtributos ------ Validar Si hay Atributos");
    console.log(data);
    //console.log(data.messaging.customAttributes.hasOwnProperty("nid"));
  });
  console.log("ValidarAtributos ------");
  console.log("ValidarAtributos ------");
}

function EliminarHistorial() {
  console.log("EliminarHistorial ------ Inicio");
  Genesys("command", "Identifiers.purgeAll");
  console.log("EliminarHistorial ------ Fin");
}

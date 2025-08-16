<script type="text/javascript">
  function iniciarMessenger() {
    const genesysDeploymentId = '27e6fd09-1845-42dc-8a8b-8af444ee87e4'; // Conecta Autenticado

    if (typeof Genesys == "undefined") {
      (function (g, e, n, es, ys) {
        g['_genesysJs'] = e;
        g[e] = g[e] || function () {
          (g[e].q = g[e].q || []).push(arguments)
        };
        g[e].t = 1 * new Date();
        g[e].c = es;
        ys = document.createElement('script'); ys.async = 1; ys.src = n; ys.charset = 'utf-8'; document.head.appendChild(ys);
      })(window, 'Genesys', 'https://apps.mypurecloud.com/genesys-bootstrap/genesys.min.js', {
        environment: 'prod',
        deploymentId: genesysDeploymentId
      });
      console.log("** Inicializado Genesys **");
    }
    else {
      console.log("** Previamente Inicializado Genesys **");
    }
  }

  function iniciarChat(){
    fromIniciar = true;
    authCodeAD = document.getElementById("authCode").value;

    iniciarMessenger();
    
    if (loadPage || clearedConversation){
      loadPage = false;
      asignarAtributosInicio();
      if (clearedConversation) {
        if (!launcherVisible) {
          Genesys("command", "Launcher.show", {}, function(){}, function(){});
        }
        if (!messengerOpened) {
          Genesys("command", "Messenger.open", {}, function(){}, function(){});
        }
      }
      clearedConversation = false;
    }

    pendingLoad = true;

    let btnIniciarChat = document.getElementById("iniciar");
    btnIniciarChat.className = "oculto";
  }

  function asignarAtributosInicio() {
    Genesys("command", "Database.set", {
      messaging: {
        customAttributes: {
          idCliente: "123456",
          tipoIdCliente: "01",
          categoria: "58",
          preguntaAsesor: "Pregunte1|Pregunta2|Pregunta3",
          clientePriorizado: "no",
          idConversarion: "123456789",
          correoUsuario: "prueba@test.com"
        },
      },
    });
  }

  function eventos() {
    if (typeof Genesys == "undefined"){
      return;
    }

    console.log("== Eventos :: Inicio ==");

    Genesys('registerPlugin', 'AuthProvider', (AuthProvider) => {
      AuthProvider.registerCommand('getAuthCode', (e) => {
        console.log('getAuthCode');
        e.resolve({
          authCode: authCodeAD,
          redirectUri: 'http://localhost:4200/callbackGenesys'
        });
      });

      AuthProvider.registerCommand('reAuthenticate', (e) => {
        console.log('reAuthenticate');
        Genesys("command", "Auth.getTokens", {}, function(){}, function(){});
        e.resolve({
          authCode: authCodeAD,
          redirectUri: 'http://localhost:4200/callbackGenesys'
        });
      });

      AuthProvider.subscribe('Auth.ready', () => {});

      AuthProvider.subscribe('Auth.authenticated', () => {});

      AuthProvider.subscribe('Auth.error', (error) => {
        const { message } = error.data || {};
        console.log("Auth Error", message);
      });

      AuthProvider.subscribe('Auth.authError', (error) => {});

      AuthProvider.ready();
    });

    Genesys("subscribe", "Auth.ready", function(data) {
      console.log("** " + data.event + " **");
    });

    Genesys("subscribe", "Auth.authenticating", function(data) {
      stepAuthenticating = true;
      console.log("** " + data.event + " **");
    });

    Genesys("subscribe", "Auth.authenticated", function(data){
      console.log("** " + data.event + " **");
      stepAuthenticated = true;
      if (!stepAuthenticating && stepAuthenticated) {
        console.log("== Refreshing Token ==");
        Genesys("command", "Auth.refreshToken", {}, function(){}, function(){});
      }
    });

    Genesys("subscribe", "Auth.authError", function(data) {
      console.log("** " + data.event + " **");
      console.log(data);
    });

    Genesys("subscribe", "Auth.tokenError", function(data) {
      console.log("** " + data.event + " **");
    });

    Genesys("subscribe", "Auth.error", function(data) {
      console.log("** " + data.event + " **");
      console.log(data);
    });

    Genesys("subscribe", "MessagingService.ready", function(data){
      console.log("** " + data.event + " **");
      messengerServiceReady = true;
      if (launcherReady && messengerReady && messengerServiceReady) {
        if (!launcherVisible) {
          Genesys("command", "Launcher.show", {}, function(){}, function(){});
        }
        if (!messengerOpened) {
          Genesys("command", "Messenger.open", {}, function(){}, function(){});
        }
      }
    });
    
    Genesys("subscribe", "MessagingService.started", function(data){
      console.log("** " + data.event + " **");
      conversationActive = !data.data.readOnly;
      newSession = data.data.newSession;
      statusData = {
        fromIniciar: fromIniciar,
        conversationActive: conversationActive,
        newSession: newSession,
        launcherReady: launcherReady,
        messengerOpened: messengerOpened,
        loadPage: loadPage
      }
      console.log(statusData);
      if (conversationActive && !fromIniciar && loadPage){
        loadPage = false;
        fromIniciar = true;
        activeReload = true;
        
        let btnIniciarChat = document.getElementById("iniciar");
        btnIniciarChat.className = "oculto";
      }
    });

    Genesys("subscribe", "MessagingService.conversationDisconnected", function(data){
      console.log("** " + data.event + " **");
      statusData = {
        fromIniciar: fromIniciar,
        conversationActive: conversationActive,
        newSession: newSession,
        activeReload: activeReload
      }
      console.log(statusData);
      if (fromIniciar){
        if (conversationActive){
          fromIniciar = false;
          playNotification = false;
          console.log("** Desplegar Encuesta **");
          Genesys("command", "MessagingService.clearConversation", {}, function(){}, function(){});
        }
      }
      conversationActive = false;
    });

    Genesys("subscribe", "MessagingService.messagesReceived", function(data){
      console.log("** " + data.event + " **");
      if (data.data.messages[0].direction == "Outbound"){
        if (playNotification){
          console.log("** Reproducir Sonido **");
        }
      }
    });

    Genesys("subscribe", "MessagingService.conversationCleared", function(data){
      console.log("** " + data.event + " **");
      Genesys("command", "Auth.logout", {}, function(){}, function(){});
      clearedConversation = true;
      messengerOpened = false;
      launcherVisible = false;

      let btnIniciarChat = document.getElementById("iniciar");
      btnIniciarChat.className = "visible";
    });

    Genesys("subscribe", "MessagingService.error", function(data){
      console.log("** " + data.event + " **");
      console.log(data);
    });

    Genesys("subscribe", "Messenger.ready", function(data){
      console.log("** " + data.event + " **");
      messengerReady = true;
      if (launcherReady && messengerReady && messengerServiceReady) {
        if (!launcherVisible) {
          Genesys("command", "Launcher.show", {}, function(){}, function(){});
        }
        if (!messengerOpened) {
          Genesys("command", "Messenger.open", {}, function(){}, function(){});
        }
      }
    });
    
    Genesys("subscribe", "Messenger.opened", function(data){
      console.log("** " + data.event + " **");
      messengerOpened = true;
    });

    Genesys("subscribe", "Messenger.closed", function(data){
      console.log("** " + data.event + " **");
      messengerOpened = false;
    });
    
    Genesys("subscribe", "Launcher.ready", function(data){
      console.log("** " + data.event + " **");
      launcherReady = true;
      if (launcherReady && messengerReady && messengerServiceReady) {
        if (!launcherVisible) {
          Genesys("command", "Launcher.show", {}, function(){}, function(){});
        }
        if (!messengerOpened) {
          Genesys("command", "Messenger.open", {}, function(){}, function(){});
        }
      }
    });
    
    Genesys("subscribe", "Launcher.hide", function(data){
      console.log("** " + data.event + " **");
      launcherVisible = false;
    });

    Genesys("subscribe", "Launcher.visible", function(data){
      console.log("** " + data.event + " **");
      launcherVisible = true;
    });
    
    clearInterval(intervalIdEventos);
    
    console.log("== Eventos :: Final ==");
  }

  let loadPage = true;
  let activeReload = false;

  let fromIniciar = false;
  let clearedConversation = false;
  let pendingLoad = false;
  let playNotification = true;

  let conversationActive = false;
  let newSession = false;

  let authReady = false;
  let stepAuthenticating = false;
  let stepAuthenticated = false;

  let messengerReady = false;
  let messengerOpened = false;

  let launcherReady = false;
  let launcherVisible = false;

  let messengerServiceReady = false;
  let messengerServiceWait = false;

  let authCodeAD = '';

  let intervalIdEventos;
  let intervalIdCheckAuthenticated;

  window.onload = function () {
    console.log("Version 0");
    intervalIdEventos = setInterval(eventos, 500);
  }
</script>


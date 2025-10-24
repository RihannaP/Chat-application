

let websocket = null;

window.addEventListener("pageshow", () => {
  log("OPENING");

  websocket = new WebSocket(backendUrl);

  websocket.addEventListener("open", () => {
    log("CONNECTED");
    pingInterval = setInterval(() => {
      log(`SENT: ping: ${counter}`);
      websocket.send("ping");
    }, 1000);
  });

  websocket.addEventListener("close", () => {
    log("DISCONNECTED");
    clearInterval(pingInterval);
  });

  websocket.addEventListener("message", (e) => {
    log(`RECEIVED: ${e.data}: ${counter}`);
    counter++;
  });

  websocket.addEventListener("error", (e) => {
    log(`ERROR: ${e.data}`);
  });
});
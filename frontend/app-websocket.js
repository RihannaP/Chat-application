
import { formatTime, renderMessages} from "./app-polling.js";

const chatBox = document.querySelector("#chat-box-websocket");
const form = document.querySelector("#message-form-websocket");
const authorInput = document.querySelector("#author-websocket");
const textInput = document.querySelector("#text-websocket");
const formMessage = document.querySelector("#form-message-websocket");


let wsUrl;

if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  wsUrl = "ws://127.0.0.1:3000/";
  console.log("💻 Running in local mode. Using local backend.");
} else {
  wsUrl = "wss://rihannap-chatapp-backend.hosting.codeyourfuture.io/";
  console.log("☁️ Running in deployed mode. Using live backend.");
}


const state = {
  messages: []
};

function log(message) {
  console.log(message);
}

let websocket = null;

function connectWebSocket() {
  websocket = new WebSocket(wsUrl);
  console.log("Connecting to WebSocket...");

  websocket.addEventListener("open", () => {
    log("CONNECTED");
  });

  websocket.addEventListener("message", (e) => {
    try {
      const messages = JSON.parse(e.data);
      if (Array.isArray(messages)) {
        state.messages.push(...messages);
        renderMessages(chatBox, state.messages);

      }
    } catch (err) {
      console.error("Failed to parse WebSocket message:", err);
    }
  });

  websocket.addEventListener("close", () => {
    console.warn("Disconnected from WebSocket. Reconnecting in 3 seconds...");
    setTimeout(connectWebSocket, 3000);
  });


  websocket.addEventListener("error", (err) => {
    console.error("WebSocket error:", err);
    websocket.close();
  });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const author = authorInput.value.trim();
  const text = textInput.value.trim();

  if (!author || !text) return;
  if (!websocket || websocket.readyState !== WebSocket.OPEN) {
    formMessage.textContent = "WebSocket not connected!";
    return;
  }

  const message = { author, text };
  websocket.send(JSON.stringify(message));

  textInput.value = "";
  authorInput.value = "";
  formMessage.textContent = "Message sent successfully!";
});

window.addEventListener("pageshow", connectWebSocket);
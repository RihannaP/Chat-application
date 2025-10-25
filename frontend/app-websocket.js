
import {state, renderMessages, wsUrl} from "./app-shared.js";

const chatBox = document.querySelector("#chat-box-websocket");
const form = document.querySelector("#message-form-websocket");
const authorInput = document.querySelector("#author-websocket");
const textInput = document.querySelector("#text-websocket");
const formMessage = document.querySelector("#form-message-websocket");

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
      const newRequest = JSON.parse(e.data);
      if (!Array.isArray(newRequest)) return;
        newRequest.forEach((msg) => {
          const existingId = state.messages.findIndex((m) => m.id === msg.id);
          if(existingId >= 0){
            Object.assign(state.messages[existingId], msg);
          } else{
            state.messages.push(msg);
          }
        })
        
        renderMessages(chatBox, state.messages, reactMessage);

      
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

function reactMessage(messageId, reactionType) {
  if (!websocket || websocket.readyState !== WebSocket.OPEN) {
    console.warn("WebSocket not connected for reaction!");
    return;
  }

  const payload = {
    type: "reaction",
    id: messageId,
    reaction: reactionType, // "like" or "dislike"
  };

  websocket.send(JSON.stringify(payload));
}


window.addEventListener("pageshow", connectWebSocket);
let backendUrl;
let wsUrl;

if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  backendUrl = "http://127.0.0.1:3000/messages";
  console.log("💻 Polling Running in local mode. Using local backend.");
  wsUrl = "ws://127.0.0.1:3000/";
  console.log("💻 WS Running in local mode. Using local backend.");
} else {
  backendUrl = "https://rihannap-chatapp-backend.hosting.codeyourfuture.io/messages";
  console.log("☁️ Polling Running in deployed mode. Using live backend.");
  wsUrl = "wss://rihannap-chatapp-backend.hosting.codeyourfuture.io/";
  console.log("☁️ WS Running in deployed mode. Using live backend.");
}

const state = {
  messages: []
};

function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { day: "2-digit",
    month: "short",year: "numeric",hour: "2-digit", minute: "2-digit" });
}

function renderMessages(chatBox, messages, reactMessage) {
  chatBox.textContent = ""; // clear old
  messages.forEach((msg) => {
    const div = document.createElement("div");
    div.classList.add("message");

    const author = document.createElement("div");
    author.classList.add("author");
    author.textContent = msg.author;

    const text = document.createElement("div");
    text.classList.add("text");
    text.textContent = msg.text;

    const time = document.createElement("div");
    time.classList.add("time");
    time.textContent = formatTime(msg.timestamp);

    const reactions = document.createElement("div");
    reactions.classList.add("reactions");

    const likeBtn = document.createElement("button");
    likeBtn.textContent = `👍 ${msg.likes || 0}`;
    likeBtn.addEventListener("click", () => reactMessage(msg.id, "like"));

    const dislikeBtn = document.createElement("button");
    dislikeBtn.textContent = `👎 ${msg.dislikes || 0}`;
    dislikeBtn.addEventListener("click", () => reactMessage(msg.id, "dislike"));

    reactions.appendChild(likeBtn);
    reactions.appendChild(dislikeBtn);

    div.appendChild(author);
    div.appendChild(text);
    div.appendChild(time);
    div.appendChild(reactions);

    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

function mergeMessages(newMessages) {
  if (!Array.isArray(newMessages) || newMessages.length === 0) return;

  newMessages.forEach((msg) => {
    const existingId = state.messages.findIndex((m) => m.id === msg.id);
    if (existingId >= 0) {
      Object.assign(state.messages[existingId], msg);
    } else {
      state.messages.push(msg);
    }
  });
}

export{renderMessages, mergeMessages, state, formatTime, backendUrl, wsUrl}

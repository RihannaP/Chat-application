const chatBox = document.querySelector("#chat-box-polling");
const form = document.querySelector("#message-form-polling");
const authorInput = document.querySelector("#author-polling");
const textInput = document.querySelector("#text-polling");
const formMessage = document.querySelector("#form-message-polling");


export let backendUrl;

if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  backendUrl = "http://127.0.0.1:3000/messages";
  console.log("💻 Running in local mode. Using local backend.");
} else {
  backendUrl = "https://rihannap-chatapp-backend.hosting.codeyourfuture.io/messages";
  console.log("☁️ Running in deployed mode. Using live backend.");
}


const state = {
  messages: []
};

export function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { day: "2-digit",
    month: "short",year: "numeric",hour: "2-digit", minute: "2-digit" });
}

export function renderMessages(chatBox, messages) {
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

async function fetchMessages() {
  try {
    const lastMessageTime = state.messages.length > 0? state.messages[state.messages.length - 1].timestamp : null;
    const query = lastMessageTime ? `?since=${lastMessageTime}` : "";
    const response = await fetch(`${backendUrl}${query}`);
    const messages = await response.json();

    if (Array.isArray(messages) && messages.length > 0) {
      state.messages.push(...messages);
      renderMessages(chatBox, state.messages);
    }
  } catch (err) {
    console.error("Failed to fetch messages:", err);
  }finally{
    setTimeout(fetchMessages, 0); 
  }
}

async function reactMessage(messageId, type) {
  try {
    const response = await fetch(`${backendUrl}/${messageId}/react`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });

    if (!response.ok) throw new Error("Failed to react");

    const updatedMsg = await response.json();

    const idx = state.messages.findIndex(m => m.id === updatedMsg.id);
    if (idx >= 0) {
      state.messages[idx].likes = updatedMsg.likes;
      state.messages[idx].dislikes = updatedMsg.dislikes;
      renderMessages(chatBox, state.messages);
    }

  } catch (err) {
    console.error("Error reacting to message:", err);
  }
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const author = authorInput.value.trim();
  const text = textInput.value.trim();

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, text }),
    });

    if (!response.ok) throw new Error("Failed to submit message");

    formMessage.textContent = "Message sent successfully!";
    textInput.value = "";
    authorInput.value = "";

  } catch (err) {
    formMessage.textContent = "Error submitting message.";
    console.error(err);
  }
});

fetchMessages();


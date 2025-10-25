import { renderMessages,mergeMessages, state,backendUrl } from "./app-shared.js";


const chatBox = document.querySelector("#chat-box-polling");
const form = document.querySelector("#message-form-polling");
const authorInput = document.querySelector("#author-polling");
const textInput = document.querySelector("#text-polling");
const formMessage = document.querySelector("#form-message-polling");


let lastMessageTime = null;
let lastReactionTime = null;

async function fetchMessages() {
  const query = `?sinceMessage=${lastMessageTime || ''}&sinceReaction=${lastReactionTime || ''}`;
  const res = await fetch(`${backendUrl}${query}`);
  const newMessages = await res.json();
  
  if (newMessages.length > 0) {
    mergeMessages(newMessages);
    renderMessages(chatBox, state.messages, reactMessage);
    lastMessageTime = new Date(Math.max(...newMessages.map(m => new Date(m.timestamp))));
    lastReactionTime = new Date(Math.max(...newMessages.map(m => new Date(m.reactionTimestamp))));
  }

  setTimeout(fetchMessages, 1000);
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
      renderMessages(chatBox, state.messages, reactMessage);
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


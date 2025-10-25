import { renderMessages,mergeMessages, state,backendUrl } from "./app-shared.js";


const chatBox = document.querySelector("#chat-box-polling");
const form = document.querySelector("#message-form-polling");
const authorInput = document.querySelector("#author-polling");
const textInput = document.querySelector("#text-polling");
const formMessage = document.querySelector("#form-message-polling");


async function fetchMessages() {
  try {
    const lastMessageTime = state.messages.length > 0? state.messages[state.messages.length - 1].timestamp : null;
    const query = lastMessageTime ? `?since=${lastMessageTime}` : "";
    const response = await fetch(`${backendUrl}${query}`);
    const messages = await response.json();

    mergeMessages(messages);
    renderMessages(chatBox, state.messages, reactMessage);
    
  } catch (err) {
    console.error("Failed to fetch messages:", err);
  }finally{
    setTimeout(fetchMessages, 2000); 
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


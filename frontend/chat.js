
const chatBox = document.querySelector("#chat-box");
const form = document.querySelector("#message-form");
const authorInput = document.querySelector("#author");
const textInput = document.querySelector("#text");
const formMessage = document.querySelector("#form-message");


const backendUrl = "http://127.0.0.1:3000/messages";
// const backendUrl = "https://rihannap-chatapp-backend.hosting.codeyourfuture.io/messages";


const state = {
  messages: []
};

async function fetchMessages() {
  try {
    const lastMessageTime = state.messages.length > 0? state.messages[state.messages.length - 1] : null;
    const query = lastMessage ? `?since=${lastMessageTime}` : "";
    const response = await fetch(`${backendUrl}${query}`);
    const messages = await response.json();

    chatBox.textContent = ""; 
    messages.forEach(msg => {
      const div = document.createElement("div");
      div.textContent = `${msg.author}: ${msg.text}`;
      chatBox.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to fetch messages:", err);
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

    fetchMessages(); // refresh messages

  } catch (err) {
    formMessage.textContent = "Error submitting message.";
    console.error(err);
  }
});

fetchMessages();
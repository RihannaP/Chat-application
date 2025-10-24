
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

function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { day: "2-digit",
    month: "short",year: "numeric",hour: "2-digit", minute: "2-digit" });
}

async function fetchMessages() {
  try {
    const lastMessageTime = state.messages.length > 0? state.messages[state.messages.length - 1].timestamp : null;
    const query = lastMessageTime ? `?since=${lastMessageTime}` : "";
    const response = await fetch(`${backendUrl}${query}`);
    const messages = await response.json();

    if (Array.isArray(messages) && messages.length > 0) {
      state.messages.push(...messages);

      chatBox.textContent = ""; 
      state.messages.forEach(msg => {
      const time = formatTime(msg.timestamp);
      const div = document.createElement("div");
      div.classList.add("message"); // <-- Add this class!

      const authorDiv = document.createElement("div");
      authorDiv.classList.add("author");
      authorDiv.textContent = msg.author;

      const textDiv = document.createElement("div");
      textDiv.classList.add("text");
      textDiv.textContent = msg.text;

      const timeDiv = document.createElement("div");
      timeDiv.classList.add("time");
      timeDiv.textContent = formatTime(msg.timestamp);

      div.appendChild(authorDiv);
      div.appendChild(textDiv);
      div.appendChild(timeDiv);
      chatBox.appendChild(div);
    });

      chatBox.scrollTop = chatBox.scrollHeight
  }
  } catch (err) {
    console.error("Failed to fetch messages:", err);
  }finally{
    fetchMessages();
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


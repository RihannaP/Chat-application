const chatBox = document.querySelector("#chat-box");
const form = document.querySelector("#message-form");
const authorInput = document.querySelector("#author");
const textInput = document.querySelector("#text");

const backendUrl = "http://127.0.0.1:3000/messages";

async function fetchMessages() {
  const res = await fetch(backendUrl);
  const messages = await response.text();

  chatBox.textContent = ""; 
  messages.forEach(msg => {
    const div = document.createElement("div");
    div.textContent = `${msg.author}: ${msg.text}`;
    chatBox.appendChild(div);
  });
}

// async function fetchQuote() {
//   try {
//     const response = await fetch(backendUrl);
//     const text = await response.text();
//     const [_, quote, author] = text.match(/"(.*)"\s*-(.*)/) || [];
//     quoteLine.textContent = quote?.trim() || text;
//     authorLine.textContent = author?.trim() || "";
//   } catch {
//     quoteLine.textContent = "Error fetching quote.";
//     authorLine.textContent = "";
//   }
// }

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const author = authorInput.value.trim();
  const text = textInput.value.trim();

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({author, text}),
    });

  if (!response.ok) throw new Error("Failed to submit Message");

    formMessage.textContent = "Msg sent successfully!";
  
    textInput.value = "";

  } catch (err) {
    formMessage.textContent = "Error submitting Message.";
    console.error(err);
  }
});

loadMessages();


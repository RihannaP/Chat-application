# 💬 Chat Application  

A real-time chat app where users can send messages, react with likes or dislikes, and see updates instantly through **WebSockets** or **Polling**.

---

## 🚀 Live Demo  

🔗 **[Open the Live App](https://rihannap-chatapp-frontend.hosting.codeyourfuture.io)**  
🖥️ **[Backend API](https://rihannap-chatapp-backend.hosting.codeyourfuture.io/messages)**  

---

## ✨ Features

- 💬 **Send and receive messages** in real time  
- 🔄 **Dual communication modes:**  
  - ⚡ **WebSockets** – Instant updates  
  - 🌐 **Long Polling** – Reliable fallback using HTTP  
- 👍👎 **React to messages** with likes and dislikes  
- ⏰ **Timestamps** for messages and reactions  
- 🧩 **Shared frontend logic** for both WebSocket and Polling  
- 🔁 **Automatic reconnection** for WebSocket clients  

---

## 🧰 Technologies

### 🖥️ Frontend
- **HTML5**, **CSS3**, **Vanilla JavaScript (ES Modules)**
- Modular structure:
  - `app-polling.js` – Handles long polling updates  
  - `app-websocket.js` – Handles WebSocket real-time communication  
  - `app-shared.js` – Shared logic 

### ⚙️ Backend
- **Node.js** + **Express** – REST API and HTTP handling  
- **CORS** – Cross-origin resource sharing  
- **WebSocket (websocket npm package)** – Real-time communication  
- Supports **both HTTP polling** and **WebSocket** connections simultaneously  



# 💬 Chat Application  

A simple chat app where users can send and view messages in real time.  

---

## 🚀 Live Demo  

🔗 **[Open the Live App](https://rihannap-chatapp-frontend.hosting.codeyourfuture.io)**  
🖥️ **[Backend API](https://rihannap-chatapp-backend.hosting.codeyourfuture.io/messages)**  

---

## ✨ Features  
- 📝 Send and display chat messages  
- 🔄 Auto-refresh to show new messages from all users  

---

## 🧰 Technologies  
**Backend:** Node.js, Express, CORS  
**Frontend:** HTML, CSS, JavaScript  

---

## 📡 API Endpoints  
**GET** `/messages` → Returns all chat messages  
**POST** `/messages` → Adds a new message  
```json
{
  "author": "Your name",
  "text": "Your message"
}

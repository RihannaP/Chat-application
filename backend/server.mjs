
import express from "express";
import cors from "cors";
import { server as WebSocketServer } from "websocket";


const app = express();
const port = 3000;
app.use(express.json());

app.use(cors()); 

let messages = []

const callbacksForNewMessages = []

app.get("/messages", (req, res) => {
  const since = req.query.since; // since=2025-10-24T12:00:00.000Z
  const newMessages = since ? messages.filter(msg => new Date(msg.timestamp) > new Date(since)) : messages;
  
  if (newMessages.length > 0){
      return res.json(newMessages)
  };

  callbacksForNewMessages.push((messagesToSend) => res.json(messagesToSend));

});


  

app.post("/messages", (req, res) => {
  const { text, author } = req.body;
  if (!text || !author) return res.status(400).json("Message text and author are required.");

  const newMessage = {
    id: messages.length + 1,
    text: text.trim(),
    author: author.trim(),
    timestamp: new Date()
  };

  messages.push(newMessage);

  while (callbacksForNewMessages.length > 0) {
    const callback = callbacksForNewMessages.pop();
    callback([newMessage]); // always send as array
  }
  res.status(201).json(newMessage);
});


app.listen(port, () => {
  console.error(`Chat server listening on port ${port}`);
});


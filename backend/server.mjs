
import express from "express";
import cors from "cors";
import http from "http"
import {server as WebSocketServer } from "websocket";


const app = express();
const port = 3000;
app.use(express.json());
app.use(cors()); 

let wsClients = [];
let messages = [];
const callbacksForNewMessages = []

///////////---- HTTP- Long polling ----///////////

app.get("/messages", (req, res) => {
  const sinceMessage = req.query.sinceMessage;// since=2025-10-24T12:00:00.000Z
  const sinceReaction = req.query.sinceReaction;

  const newMessages = messages.filter(msg =>
    (!sinceMessage || new Date(msg.timestamp) > new Date(sinceMessage)) ||
    (!sinceReaction || new Date(msg.reactionTimestamp) > new Date(sinceReaction))
  );

  if (newMessages.length > 0) {
    return res.json(newMessages);
  }

  callbacksForNewMessages.push((messagesToSend) => res.json(messagesToSend));

});


app.post("/messages", (req, res) => {
  const { text, author } = req.body;
  if (!text || !author) return res.status(400).json("Message text and author are required.");

  const newMessage = {
    id: messages.length + 1,
    text: text.trim(),
    author: author.trim(),
    timestamp: new Date(),
    reactionTimestamp: new Date(),
    likes: 0,      
    dislikes: 0    
  };
  
  messages.push(newMessage);

  while (callbacksForNewMessages.length > 0) {
    const callback = callbacksForNewMessages.pop();
    callback([newMessage]); // always send as array
  }

  wsClients.forEach((client) => {
    if (client.connected) {
      client.sendUTF(JSON.stringify([newMessage]));
    }
  });
  res.status(201).json(newMessage);
});

app.post("/messages/:id/react", (req, res) => {
  const messageId = parseInt(req.params.id);
  const { type } = req.body; // "like" or "dislike"

  const msg = messages.find(m => m.id === messageId);
  if (!msg) return res.status(404).json({ error: "Message not found" });

  if (type === "like") msg.likes++;
  else if (type === "dislike") msg.dislikes++;
  else return res.status(400).json({ error: "Invalid reaction type" });

  msg.reactionTimestamp = new Date();
  while (callbacksForNewMessages.length > 0) {
    const callback = callbacksForNewMessages.pop();
    callback([msg]); 
  }

  // notify WebSocket clients
  wsClients.forEach((client) => {
    if (client.connected) {
      client.sendUTF(JSON.stringify([msg]));
    }
  });

  res.json(msg);
});

///////////---- WebSocket ----///////////


const server = http.createServer(app);
const wsServer = new WebSocketServer({ httpServer: server });

wsServer.on("request", (request) => {
    console.log("Incoming WS request:", request.origin, request.resource);
  const connection = request.accept(null, request.origin);
  wsClients.push(connection);

  console.log("WebSocket client connected");
  connection.sendUTF(JSON.stringify(messages)); 

  connection.on("message", (msg) => {
    if (msg.type === "utf8") {
      try {
        const data = JSON.parse(msg.utf8Data);
        if (!data.type && !data.text) return;

         //reaction
      if (data.type === "reaction" && data.id && data.reaction) {
        const msgToUpdate = messages.find((m) => m.id === data.id);
        if (!msgToUpdate) return;

        if (data.reaction === "like") msgToUpdate.likes++;
        else if (data.reaction === "dislike") msgToUpdate.dislikes++;

        msgToUpdate.timestamp = new Date();
        

        wsClients.forEach((client) => {
          if (client.connected) {
            client.sendUTF(JSON.stringify([msgToUpdate]));
          }
        });

         while (callbacksForNewMessages.length > 0) {
          const callback = callbacksForNewMessages.pop();
          callback([msgToUpdate]);
        }
      }

        //new message
      else if (data.text && data.author) {
        const newMessage = {
          id: messages.length + 1,
          author: data.author.trim(),
          text: data.text.trim(),
          timestamp: new Date(),
          reactionTimestamp: new Date(),
          likes: 0,      
          dislikes: 0    
        };

        messages.push(newMessage);

        
        wsClients.forEach((client) => {
          if (client.connected) {
            client.sendUTF(JSON.stringify([newMessage]));
          }
        });

        
        while (callbacksForNewMessages.length > 0) {
          const callback = callbacksForNewMessages.pop();
          callback([newMessage]);
        }}

      

      } catch (e) {
        console.error("Invalid WebSocket message:", e);
      }
    }
  });

  connection.on("close", () => {
    console.log("WebSocket client disconnected");
    wsClients = wsClients.filter((client) => client !== connection);
  });
});



server.listen(port, () => {
  console.log(`Chat server running on http://127.0.0.1:${port}`);
});

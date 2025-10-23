
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;
app.use(express.json());

app.use(cors({
  origin: "https://rihannap-chatapp-frontend.hosting.codeyourfuture.io",
  methods: ["GET","POST","OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

let messages = []

app.get("/messages", (req, res) => {
  res.json(messages);
});

app.post("/messages", (req, res) => {
  const { text, author } = req.body;
  if (!text || !author) {
    return res.status(400).json("Message text and author are required.");
    }

    const newMessage = {
    id: messages.length + 1,
    text: text.trim(),
    author: author.trim(),
    timestamp: new Date() 
  };

    messages.push(newMessage);
    res.status(201).json(newMessage);
});


app.listen(port, () => {
  console.error(`Chat server listening on port ${port}`);
});


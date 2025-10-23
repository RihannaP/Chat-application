
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;
app.use(cors());


app.get("/messages", (req, res) => {
  res.send(messages);
});

app.post("/messages", (req, res) => {
  const { text, author } = req.body;
  if (!text?.trim() || !author?.trim()) {
    res.status(400).send("Message text and author are required.");
  return;
    }

    const message = {
    id: messages.length + 1,
    text: text.trim(),
    author: author.trim(),
  };

  messages.push(message);
  res.json(message);
});


// app.listen(port, () => {
//   console.error(`Quote server listening on port ${port}`);
// });

let messages = []

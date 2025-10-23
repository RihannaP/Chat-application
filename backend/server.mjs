
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;
app.use(cors());


app.get("/messages", (req, res) => {
  res.send(messages);
});

// app.post("/", (req, res) => {
//   const bodyBytes = [];
//   req.on("data", chunk => bodyBytes.push(...chunk));
//   req.on("end", () => {
//     const bodyString = String.fromCharCode(...bodyBytes);
//     let body;
//     try {
//       body = JSON.parse(bodyString);
//     } catch (error) {
//       console.error(`Failed to parse body ${bodyString} as JSON: ${error}`);
//       res.status(400).send("Expected body to be JSON.");
//       return;
//     }
//     if (typeof body != "object" || !("quote" in body) || !("author" in body)||
//       !body.quote.trim() ||
//       !body.author.trim()) {
//       console.error(`Failed to extract quote and author from post body: ${bodyString}`);
//       res.status(400).send("Expected body to be a JSON object containing keys quote and author.");
//       return;
//     }
//     quotes.push({
//       quote: body.quote,
//       author: body.author,
//     });
//     res.send("ok");
//   });
// });

// app.listen(port, () => {
//   console.error(`Quote server listening on port ${port}`);
// });

let messages = []

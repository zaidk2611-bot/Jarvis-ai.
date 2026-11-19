const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/chat") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const { message } = JSON.parse(body || "{}");
        if (!message || typeof message !== "string") {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Please enter a message." }));
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({
            reply: "I'm online, but my AI brain is not connected yet. Add your API key as the OPENAI_API_KEY environment variable in your hosting service."
          }));
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
              { role: "system", content: "You are Jarvis, a helpful, friendly personal AI assistant. Give clear, concise answers. Do not claim to control the phone or perform actions you cannot actually perform." },
              { role: "user", content: message }
            ]
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || "The AI service returned an error.");
        }

        const reply = data.choices?.[0]?.message?.content || "I couldn't generate a reply.";
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ reply }));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message || "Something went wrong." }));
      }
    });
    return;
  }

  const requested = req.url === "/" ? "/public/index.html" : req.url;
  const filePath = path.join(ROOT, requested.replace(/^\//, ""));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      return res.end("Not found");
    }
    const ext = path.extname(filePath);
    const type = ext === ".html" ? "text/html; charset=utf-8" :
                 ext === ".css" ? "text/css" :
                 ext === ".js" ? "text/javascript" : "text/plain";
    res.writeHead(200, { "Content-Type": type });
    res.end(content);
  });
});

server.listen(PORT, () => console.log(`Jarvis is running on port ${PORT}`));

// Run locally: OPENAI_API_KEY=sk-... node server.js
// Or put OPENAI_API_KEY in Render's environment tab when you deploy.

const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/session", async (req, res) => {
  try {
    // Mint a short-lived ephemeral key for the browser
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-realtime",
        voice: "Cedar",
        // style: British accent out of the gate
        instructions: "Speak with a natural British accent and UK phrasing. Keep replies brief."
      })
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(500).json({ error: "Failed to mint session", details: t });
    }

    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));

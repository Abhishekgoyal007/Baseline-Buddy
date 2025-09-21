import express from "express";
import cors from "cors";
import * as wf from "web-features";
import OpenAI from "openai";
import dotenv from "dotenv";

// Configure dotenv - try relative path first
dotenv.config({ path: './backend/.env' });

const app = express();
app.use(cors());
app.use(express.json());

const port = 5000;

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route: test server
app.get("/", (req, res) => {
  res.send("Baseline Buddy Backend is running!");
});

// Route: check feature
app.post("/check-feature", async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { feature } = req.body;
    if (!feature) return res.status(400).json({ error: "Feature is required" });

    // 1️⃣ Check Baseline using web-features
    console.log("Looking for feature:", feature);
    const support = wf.features[feature];
    console.log("Support data:", support);
    const baselineSafe = (support && 'status' in support && support.status?.baseline === "high") || false;
    const browsers = (support && 'status' in support && support.status?.support) ? Object.keys(support.status.support) : [];

    // 2️⃣ Generate AI explanation
    const prompt = `
You are a senior web developer helping another developer.
The feature "${feature}" is ${baselineSafe ? "fully safe" : "not fully supported"} in modern browsers.
Explain why this feature is ${baselineSafe ? "safe" : "risky"} and suggest safer alternatives if needed.
Keep the explanation short, clear, and actionable.
`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiExplanation = aiResponse.choices[0].message?.content || "";

    // 3️⃣ Return result to frontend
    res.json({
      feature,
      baselineSafe,
      browsers,
      aiExplanation,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

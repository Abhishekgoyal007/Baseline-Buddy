const express = require("express");
const cors = require("cors");
const wf = require("web-features");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: './.env' });

const app = express();
app.use(cors());
app.use(express.json());

const port = 5000;

// Gemini AI setup
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

console.log("Environment check - GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY ? "Found" : "Missing");

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
    console.log("Support data:", support ? "found" : "not found");
    const baselineSafe = (support && support.status && support.status.baseline === "high") || false;
    const browsers = (support && support.status && support.status.support) ? Object.keys(support.status.support) : [];

    // 2️⃣ Generate AI explanation
    const prompt = `
You are a senior web developer helping another developer.
The feature "${feature}" is ${baselineSafe ? "fully safe" : "not fully supported"} in modern browsers.
Explain why this feature is ${baselineSafe ? "safe" : "risky"} and suggest safer alternatives if needed.
Keep the explanation short, clear, and actionable.
`;

    const aiResult = await model.generateContent(prompt);
    const response = await aiResult.response;
    const aiExplanation = response.text() || "";

    // 3️⃣ Return result to frontend
    const result = {
      feature,
      baselineSafe,
      browsers,
      aiExplanation,
    };
    
    console.log("Sending result:", result);
    res.json(result);
  } catch (err) {
    console.error("Error in /check-feature:", err);
    res.status(500).json({ error: "Something went wrong: " + err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
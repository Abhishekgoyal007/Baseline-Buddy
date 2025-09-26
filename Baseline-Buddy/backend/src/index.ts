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

// Route: analyze code
app.post("/analyze-code", async (req, res) => {
  try {
    console.log("Code analysis request:", req.body);
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ error: "Code is required" });

    // Define baseline rules for different features
    const baselineRules = {
      // CSS Rules
      ':has': { 
        status: 'unsafe', 
        explanation: 'CSS :has selector is not fully baseline safe yet. Limited support in older Safari versions.',
        alternative: 'Use JavaScript for conditional styling or CSS custom properties.'
      },
      'container-query': { 
        status: 'caution', 
        explanation: 'Container queries have good support in modern browsers but Safari <17 lacks full support.',
        alternative: 'Use media queries or JavaScript-based solutions for broader compatibility.'
      },
      '@container': { 
        status: 'caution', 
        explanation: 'Container queries have good support in modern browsers but Safari <17 lacks full support.',
        alternative: 'Use media queries or JavaScript-based solutions for broader compatibility.'
      },
      'aspect-ratio': { 
        status: 'safe', 
        explanation: 'CSS aspect-ratio is well supported across modern browsers.',
        alternative: null
      },
      
      // JavaScript Rules
      'fetch': { 
        status: 'safe', 
        explanation: 'Fetch API is supported across all baseline browsers.',
        alternative: null
      },
      'document.write': { 
        status: 'unsafe', 
        explanation: 'document.write is discouraged and can cause performance issues.',
        alternative: 'Use DOM manipulation methods like appendChild or innerHTML.'
      },
      'localStorage': { 
        status: 'safe', 
        explanation: 'localStorage is well supported across all modern browsers.',
        alternative: null
      },
      'sessionStorage': { 
        status: 'safe', 
        explanation: 'sessionStorage is well supported across all modern browsers.',
        alternative: null
      },
      'Promise': { 
        status: 'safe', 
        explanation: 'Promises are fully supported in all baseline browsers.',
        alternative: null
      },
      'async/await': { 
        status: 'safe', 
        explanation: 'Async/await syntax is supported in all modern browsers.',
        alternative: null
      },
      'const': { 
        status: 'safe', 
        explanation: 'const declaration is supported in all baseline browsers.',
        alternative: null
      },
      'let': { 
        status: 'safe', 
        explanation: 'let declaration is supported in all baseline browsers.',
        alternative: null
      },
      'arrow functions': { 
        status: 'safe', 
        explanation: 'Arrow functions are supported in all baseline browsers.',
        alternative: null
      },
      'template literals': { 
        status: 'safe', 
        explanation: 'Template literals are supported in all baseline browsers.',
        alternative: null
      },
      
      // HTML5 features
      'dialog': { 
        status: 'caution', 
        explanation: 'HTML dialog element has good modern support but requires polyfills for older browsers.',
        alternative: 'Use modal libraries or custom div-based modals for broader compatibility.'
      },
      'details': { 
        status: 'safe', 
        explanation: 'HTML details/summary elements are well supported.',
        alternative: null
      },
      'summary': { 
        status: 'safe', 
        explanation: 'HTML details/summary elements are well supported.',
        alternative: null
      }
    };

    const safe: string[] = [];
    const caution: string[] = [];
    const unsafe: string[] = [];
    const explanations: Record<string, string> = {};
    const alternatives: Record<string, string> = {};

    // Analyze code for baseline features
    Object.entries(baselineRules).forEach(([feature, rule]) => {
      const regex = new RegExp(feature.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      
      if (regex.test(code)) {
        switch (rule.status) {
          case 'safe':
            safe.push(feature);
            break;
          case 'caution':
            caution.push(feature);
            break;
          case 'unsafe':
            unsafe.push(feature);
            break;
        }
        explanations[feature] = rule.explanation;
        if (rule.alternative) {
          alternatives[feature] = rule.alternative;
        }
      }
    });

    // Special pattern matching
    if (/=>\s*{/.test(code) || /=>\s*[^{]/.test(code)) {
      if (!safe.includes('arrow functions')) {
        safe.push('arrow functions');
        explanations['arrow functions'] = baselineRules['arrow functions'].explanation;
      }
    }

    if (/`.*\$\{.*\}.*`/.test(code)) {
      if (!safe.includes('template literals')) {
        safe.push('template literals');
        explanations['template literals'] = baselineRules['template literals'].explanation;
      }
    }

    if (/async\s+function|async\s*\(/.test(code) && /await\s+/.test(code)) {
      if (!safe.includes('async/await')) {
        safe.push('async/await');
        explanations['async/await'] = baselineRules['async/await'].explanation;
      }
    }

    res.json({
      safe,
      caution,
      unsafe,
      explanations,
      alternatives,
      language: language || 'unknown'
    });

  } catch (err: any) {
    console.error("Code analysis error:", err);
    res.status(500).json({ error: "Something went wrong during code analysis" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

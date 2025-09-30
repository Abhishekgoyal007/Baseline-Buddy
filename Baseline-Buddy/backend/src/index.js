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
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

// Route: analyze code
app.post("/analyze-code", async (req, res) => {
  try {
    console.log("Code analysis request:", req.body);
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ error: "Code is required" });

    // Define baseline rules for different features
    const baselineRules = {
      // CSS Rules - Expanded
      ':has': { 
        status: 'unsafe', 
        explanation: 'CSS :has selector is not fully baseline safe yet. Limited support in older Safari versions.',
        alternative: 'Use JavaScript for conditional styling or CSS custom properties.',
        line: null
      },
      'backdrop-filter': {
        status: 'caution',
        explanation: 'backdrop-filter has good modern support but may need prefixes for older Safari.',
        alternative: 'Use solid backgrounds or JavaScript-based blur effects for broader compatibility.',
        line: null
      },
      'subgrid': {
        status: 'caution',
        explanation: 'CSS subgrid has limited support. Not supported in Chrome until recently.',
        alternative: 'Use regular CSS Grid or flexbox layouts for broader compatibility.',
        line: null
      },
      'accent-color': {
        status: 'safe',
        explanation: 'accent-color is well supported in modern browsers for form controls.',
        alternative: null,
        line: null
      },
      '@container': { 
        status: 'caution', 
        explanation: 'Container queries have good support in modern browsers but Safari <17 lacks full support.',
        alternative: 'Use media queries or JavaScript-based solutions for broader compatibility.',
        line: null
      },
      'aspect-ratio': { 
        status: 'safe', 
        explanation: 'CSS aspect-ratio is well supported across modern browsers.',
        alternative: null,
        line: null
      },
      'scroll-behavior': {
        status: 'safe',
        explanation: 'scroll-behavior: smooth is well supported across modern browsers.',
        alternative: null,
        line: null
      },
      
      // JavaScript Rules - Expanded
      'fetch': { 
        status: 'safe', 
        explanation: 'Fetch API is supported across all baseline browsers.',
        alternative: null,
        line: null
      },
      'BigInt': {
        status: 'safe',
        explanation: 'BigInt is supported in all modern browsers.',
        alternative: null,
        line: null
      },
      'top-level await': {
        status: 'caution',
        explanation: 'Top-level await requires ES2022+ and module type. Good modern support.',
        alternative: 'Use async IIFE or regular async functions for broader compatibility.',
        line: null
      },
      'Intl.Segmenter': {
        status: 'caution',
        explanation: 'Intl.Segmenter has limited browser support, especially in Firefox.',
        alternative: 'Use regular string methods or third-party libraries for text segmentation.',
        line: null
      },
      'document.write': { 
        status: 'unsafe', 
        explanation: 'document.write is discouraged and can cause performance issues.',
        alternative: 'Use DOM manipulation methods like appendChild or innerHTML.',
        line: null
      },
      'localStorage': { 
        status: 'safe', 
        explanation: 'localStorage is well supported across all modern browsers.',
        alternative: null,
        line: null
      },
      'sessionStorage': { 
        status: 'safe', 
        explanation: 'sessionStorage is well supported across all modern browsers.',
        alternative: null,
        line: null
      },
      'Promise': { 
        status: 'safe', 
        explanation: 'Promises are fully supported in all baseline browsers.',
        alternative: null,
        line: null
      },
      'async/await': { 
        status: 'safe', 
        explanation: 'Async/await syntax is supported in all modern browsers.',
        alternative: null,
        line: null
      },
      'const': { 
        status: 'safe', 
        explanation: 'const declaration is supported in all baseline browsers.',
        alternative: null,
        line: null
      },
      'let': { 
        status: 'safe', 
        explanation: 'let declaration is supported in all baseline browsers.',
        alternative: null,
        line: null
      },
      'arrow functions': { 
        status: 'safe', 
        explanation: 'Arrow functions are supported in all baseline browsers.',
        alternative: null,
        line: null
      },
      'template literals': { 
        status: 'safe', 
        explanation: 'Template literals are supported in all baseline browsers.',
        alternative: null,
        line: null
      },
      'optional chaining': {
        status: 'safe',
        explanation: 'Optional chaining (?.) is supported in all modern browsers.',
        alternative: null,
        line: null
      },
      'nullish coalescing': {
        status: 'safe',
        explanation: 'Nullish coalescing (??) is supported in all modern browsers.',
        alternative: null,
        line: null
      },
      
      // React/Next.js Rules
      '"use client"': {
        status: 'safe',
        explanation: 'Next.js 13+ App Router client directive is stable and recommended.',
        alternative: null,
        line: null
      },
      '"use server"': {
        status: 'caution',
        explanation: 'Next.js Server Actions are stable but require proper error handling.',
        alternative: 'Use API routes for more traditional server-side logic.',
        line: null
      },
      'useTransition': {
        status: 'safe',
        explanation: 'React 18 useTransition hook is stable and baseline safe.',
        alternative: null,
        line: null
      },
      'Suspense': {
        status: 'safe',
        explanation: 'React Suspense is stable and widely supported.',
        alternative: null,
        line: null
      },
      'useDeferredValue': {
        status: 'safe',
        explanation: 'React 18 useDeferredValue hook is stable.',
        alternative: null,
        line: null
      },
      
      // HTML5 features - Expanded
      'dialog': { 
        status: 'caution', 
        explanation: 'HTML dialog element has good modern support but requires polyfills for older browsers.',
        alternative: 'Use modal libraries or custom div-based modals for broader compatibility.',
        line: null
      },
      'details': { 
        status: 'safe', 
        explanation: 'HTML details/summary elements are well supported.',
        alternative: null,
        line: null
      },
      'summary': { 
        status: 'safe', 
        explanation: 'HTML details/summary elements are well supported.',
        alternative: null,
        line: null
      },
      'Web Components': {
        status: 'safe',
        explanation: 'Custom Elements and Shadow DOM are well supported.',
        alternative: null,
        line: null
      },
      'input type="date"': {
        status: 'safe',
        explanation: 'HTML5 date input is well supported across modern browsers.',
        alternative: null,
        line: null
      }
    };

    const safe = [];
    const caution = [];
    const unsafe = [];
    const explanations = {};
    const alternatives = {};
    const lineNumbers = {};
    
    // Split code into lines for line number detection
    const codeLines = code.split('\n');

    // Analyze code for baseline features with line detection
    Object.entries(baselineRules).forEach(([feature, rule]) => {
      const regex = new RegExp(feature.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      
      if (regex.test(code)) {
        // Find line numbers where this feature appears
        const foundLines = [];
        codeLines.forEach((line, index) => {
          if (regex.test(line)) {
            foundLines.push(index + 1);
          }
        });
        
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
        lineNumbers[feature] = foundLines;
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

    // Generate comprehensive code analysis
    const codeAnalysis = analyzeCodeStructure(code, language);
    
    // Create summary counts
    const summary = {
      safe: safe.length,
      caution: caution.length,
      unsafe: unsafe.length,
      total: safe.length + caution.length + unsafe.length
    };

    // Generate enhancement suggestions
    const enhancements = generateEnhancements(code, language, safe, caution, unsafe);

    res.json({
      safe,
      caution,
      unsafe,
      explanations,
      alternatives,
      lineNumbers,
      summary,
      codeAnalysis,
      enhancements,
      language: language || 'unknown'
    });

  } catch (err) {
    console.error("Code analysis error:", err);
    res.status(500).json({ error: "Something went wrong during code analysis" });
  }
});

// Helper function to analyze code structure
function analyzeCodeStructure(code, language) {
  const lines = code.split('\n');
  const totalLines = lines.length;
  const nonEmptyLines = lines.filter(line => line.trim().length > 0).length;
  const commentLines = lines.filter(line => {
    const trimmed = line.trim();
    return trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('<!--');
  }).length;

  const analysis = {
    totalLines,
    nonEmptyLines,
    commentLines,
    codeLines: nonEmptyLines - commentLines,
    complexity: 'Low'
  };

  // Analyze complexity based on language
  if (language === 'javascript' || language === 'typescript') {
    const functions = (code.match(/function\s+\w+|=>\s*{|async\s+function/g) || []).length;
    const classes = (code.match(/class\s+\w+/g) || []).length;
    const imports = (code.match(/import\s+.*from|require\s*\(/g) || []).length;
    const conditionals = (code.match(/if\s*\(|switch\s*\(|for\s*\(|while\s*\(/g) || []).length;
    
    analysis.functions = functions;
    analysis.classes = classes;
    analysis.imports = imports;
    analysis.conditionals = conditionals;
    
    const complexityScore = functions + classes * 2 + conditionals;
    if (complexityScore > 10) analysis.complexity = 'High';
    else if (complexityScore > 5) analysis.complexity = 'Medium';
  } else if (language === 'css') {
    const selectors = (code.match(/[.#]?[\w-]+\s*{/g) || []).length;
    const mediaQueries = (code.match(/@media\s*\(/g) || []).length;
    const animations = (code.match(/@keyframes|animation:|transition:/g) || []).length;
    
    analysis.selectors = selectors;
    analysis.mediaQueries = mediaQueries;
    analysis.animations = animations;
    
    if (selectors > 20) analysis.complexity = 'High';
    else if (selectors > 10) analysis.complexity = 'Medium';
  } else if (language === 'html') {
    const elements = (code.match(/<[^/][^>]*>/g) || []).length;
    const forms = (code.match(/<form|<input|<select|<textarea/g) || []).length;
    const scripts = (code.match(/<script/g) || []).length;
    
    analysis.elements = elements;
    analysis.forms = forms;
    analysis.scripts = scripts;
    
    if (elements > 30) analysis.complexity = 'High';
    else if (elements > 15) analysis.complexity = 'Medium';
  }

  return analysis;
}

// Helper function to generate enhancement suggestions
function generateEnhancements(code, language, safe, caution, unsafe) {
  const suggestions = [];

  // General enhancements
  if (unsafe.length > 0) {
    suggestions.push({
      type: 'critical',
      title: 'Replace Unsafe Features',
      description: `Found ${unsafe.length} features that are not baseline safe. Consider replacing them with safer alternatives.`
    });
  }

  if (caution.length > 0) {
    suggestions.push({
      type: 'warning',
      title: 'Review Caution Features',
      description: `Found ${caution.length} features that need careful consideration. Add fallbacks or test across browsers.`
    });
  }

  // Language-specific suggestions
  if (language === 'javascript' || language === 'typescript') {
    if (!code.includes('try') && code.includes('fetch')) {
      suggestions.push({
        type: 'improvement',
        title: 'Add Error Handling',
        description: 'Consider adding try-catch blocks for fetch operations to handle network errors gracefully.'
      });
    }

    if (code.includes('console.log')) {
      suggestions.push({
        type: 'improvement',
        title: 'Remove Debug Logs',
        description: 'Remove console.log statements before production deployment.'
      });
    }

    if (!code.includes('const') && !code.includes('let') && code.includes('var')) {
      suggestions.push({
        type: 'improvement',
        title: 'Use Modern Variable Declarations',
        description: 'Replace var with const/let for better scoping and immutability.'
      });
    }
  }

  if (language === 'css') {
    if (!code.includes('@media')) {
      suggestions.push({
        type: 'improvement',
        title: 'Add Responsive Design',
        description: 'Consider adding media queries for better mobile responsiveness.'
      });
    }

    if (code.includes('!important')) {
      suggestions.push({
        type: 'improvement',
        title: 'Reduce !important Usage',
        description: 'Try to avoid !important declarations. Use more specific selectors instead.'
      });
    }
  }

  if (language === 'html') {
    if (!code.includes('alt=')) {
      suggestions.push({
        type: 'accessibility',
        title: 'Add Alt Attributes',
        description: 'Add alt attributes to images for better accessibility.'
      });
    }

    if (!code.includes('lang=')) {
      suggestions.push({
        type: 'accessibility',
        title: 'Add Language Attribute',
        description: 'Add lang attribute to html element for better accessibility.'
      });
    }
  }

  // Performance suggestions
  if (safe.length > 10) {
    suggestions.push({
      type: 'performance',
      title: 'Great Modern Features Usage',
      description: `Excellent! You're using ${safe.length} modern, baseline-safe features.`
    });
  }

  return suggestions;
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
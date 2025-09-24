"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { SplitPane } from "@/components/ui/resizable";

// Dynamically import Monaco Editor
const Editor: any = dynamic(
  () => import("@monaco-editor/react").then((mod) => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-muted animate-pulse rounded-md flex items-center justify-center text-sm text-gray-500">Loading Editor...</div>,
  }
);

interface AnalysisResult {
  safe: string[];
  caution: string[];
  unsafe: string[];
  explanations: Record<string, string>;
  alternatives: Record<string, string>;
  lineNumbers: Record<string, number[]>;
  summary: {
    safe: number;
    caution: number;
    unsafe: number;
    total: number;
  };
  codeAnalysis: {
    totalLines: number;
    nonEmptyLines: number;
    commentLines: number;
    codeLines: number;
    complexity: string;
    functions?: number;
    classes?: number;
    imports?: number;
    conditionals?: number;
    selectors?: number;
    mediaQueries?: number;
    animations?: number;
    elements?: number;
    forms?: number;
    scripts?: number;
  };
  enhancements: Array<{
    type: string;
    title: string;
    description: string;
  }>;
  language: string;
}

export default function CodeAnalyzerPage() {
  const router = useRouter();
  const [code, setCode] = useState(`// Modern JavaScript features showcase
"use client"; // Next.js App Router directive

import { useState, useTransition } from 'react';

const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.log('Error:', error);
  }
};

// React component with hooks
function MyComponent() {
  const [data, setData] = useState(null);
  const [isPending, startTransition] = useTransition();
  
  const handleClick = () => {
    startTransition(() => {
      fetchData().then(setData);
    });
  };
  
  return (
    <div>
      <button onClick={handleClick}>Load Data</button>
      {isPending && <div>Loading...</div>}
      {data?.name ?? 'No data'}
    </div>
  );
}

/* CSS with modern and experimental features */
.container {
  display: grid;
  aspect-ratio: 16/9;
  backdrop-filter: blur(10px);
  accent-color: #007acc;
}

.parent:has(.child) {
  background: red; /* Not baseline safe */
}

@container (min-width: 300px) {
  .element {
    font-size: 2rem;
  }
}

/* Subgrid example */
.grid-container {
  display: grid;
  grid-template-columns: subgrid;
}`);
  const [language, setLanguage] = useState("javascript");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
    { value: "jsx", label: "React (JSX)" },
    { value: "tsx", label: "React (TSX)" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "php", label: "PHP" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "sql", label: "SQL" },
    { value: "yaml", label: "YAML" },
    { value: "xml", label: "XML" },
    { value: "markdown", label: "Markdown" },
  ];

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/analyze-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language })
      });
      
      if (!response.ok) {
        throw new Error("Failed to analyze code");
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Analysis error:", error);
      setResult({
        safe: [],
        caution: [],
        unsafe: [],
        explanations: { error: "Analysis failed. Make sure the backend is running." },
        alternatives: {},
        lineNumbers: {},
        summary: { safe: 0, caution: 0, unsafe: 0, total: 0 },
        codeAnalysis: { 
          totalLines: 0, 
          nonEmptyLines: 0, 
          commentLines: 0, 
          codeLines: 0, 
          complexity: "Unknown" 
        },
        enhancements: [],
        language: "unknown"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft/> Back to Home
        </Button>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">🔍 Baseline Code Analyzer</h1>
        <p className="text-muted-foreground text-lg">
          Check if your HTML, CSS, JavaScript, TypeScript, or React code is Baseline Web Platform safe
        </p>
      </div>

      <div className="h-[calc(100vh-200px)]">
        <SplitPane
          defaultSplitPosition={50}
          minLeftWidth={400}
          minRightWidth={400}
          leftPanel={
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Code Editor</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Theme:</label>
                      <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="px-3 py-1 border rounded-md text-sm bg-black text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {isDarkMode ? "🌙 Dark" : "☀️ Light"}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Language:</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="px-3 py-1 border rounded-md text-sm bg-black text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        style={{
                          backgroundColor: '#000000',
                          color: '#ffffff',
                        }}
                      >
                        {languages.map((lang) => (
                          <option 
                            key={lang.value} 
                            value={lang.value}
                            className="bg-black text-white"
                            style={{
                              backgroundColor: '#000000',
                              color: '#ffffff',
                            }}
                          >
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-120px)]">
                <div className={`border rounded-lg overflow-hidden h-full ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <Editor
                    height="100%"
                    language={language}
                    theme={isDarkMode ? "vs-dark" : "vs-light"} 
                    value={code}
                    onChange={(value: string | undefined) => setCode(value || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                      tabSize: 2,
                      insertSpaces: true,
                      detectIndentation: true,
                      renderWhitespace: "selection",
                      renderControlCharacters: false,
                      fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'SF Mono', Monaco, Menlo, 'Ubuntu Mono', monospace",
                      fontLigatures: true,
                      cursorBlinking: "blink",
                      cursorSmoothCaretAnimation: "on",
                      smoothScrolling: true,
                      contextmenu: true,
                      mouseWheelZoom: true,
                      multiCursorModifier: "ctrlCmd",
                      suggestOnTriggerCharacters: true,
                      acceptSuggestionOnEnter: "on",
                      bracketPairColorization: { enabled: true },
                      guides: {
                        bracketPairs: true,
                        indentation: true,
                      },
                    }}
                  />
                </div>
                <Button
                  onClick={handleAnalyze}
                  className="w-full mt-4"
                  disabled={loading || !code.trim()}
                >
                  {loading ? "🔍 Analyzing..." : "🚀 Analyze Code"}
                </Button>
              </CardContent>
            </Card>
          }
          rightPanel={
            <div className="h-full overflow-auto p-4 space-y-4">
              {result ? (
                <>
                  {/* Summary Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        📊 Analysis Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{result?.summary?.safe ?? 0}</div>
                            <div className="text-sm text-muted-foreground">Safe</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{result?.summary?.caution ?? 0}</div>
                            <div className="text-sm text-muted-foreground">Caution</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{result?.summary?.unsafe ?? 0}</div>
                            <div className="text-sm text-muted-foreground">Unsafe</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{result?.summary?.total ?? 0}</div>
                            <div className="text-sm text-muted-foreground">Total</div>
                          </div>
                      </div>
                      
                      {result.codeAnalysis && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Lines:</strong> {result.codeAnalysis.totalLines} total, {result.codeAnalysis.codeLines} code
                          </div>
                          <div>
                            <strong>Complexity:</strong> {result.codeAnalysis.complexity}
                          </div>
                          {result.codeAnalysis.functions !== undefined && (
                            <div><strong>Functions:</strong> {result.codeAnalysis.functions}</div>
                          )}
                          {result.codeAnalysis.classes !== undefined && (
                            <div><strong>Classes:</strong> {result.codeAnalysis.classes}</div>
                          )}
                          {result.codeAnalysis.selectors !== undefined && (
                            <div><strong>CSS Selectors:</strong> {result.codeAnalysis.selectors}</div>
                          )}
                          {result.codeAnalysis.elements !== undefined && (
                            <div><strong>HTML Elements:</strong> {result.codeAnalysis.elements}</div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Enhancement Suggestions */}
                  {result.enhancements && result.enhancements.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          💡 Enhancement Suggestions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {result.enhancements.map((enhancement, index) => (
                          <div key={index} className={`p-3 border rounded-lg ${
                            enhancement.type === 'critical' ? 'bg-red-50 border-red-200' :
                            enhancement.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                            enhancement.type === 'accessibility' ? 'bg-blue-50 border-blue-200' :
                            enhancement.type === 'performance' ? 'bg-green-50 border-green-200' :
                            'bg-gray-50 border-gray-200'
                          }`}>
                            <div className={`font-medium ${
                              enhancement.type === 'critical' ? 'text-red-800' :
                              enhancement.type === 'warning' ? 'text-yellow-800' :
                              enhancement.type === 'accessibility' ? 'text-blue-800' :
                              enhancement.type === 'performance' ? 'text-green-800' :
                              'text-gray-800'
                            }`}>
                              {enhancement.title}
                            </div>
                            <p className="text-sm mt-1 text-gray-600">
                              {enhancement.description}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Safe Features */}
                  {result.safe.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          ✅ Baseline Safe Features
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            {result.safe.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {result.safe.map((feature) => (
                          <div key={feature} className="p-3 border rounded-lg bg-green-50">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-green-800">{feature}</div>
                              {result?.lineNumbers?.[feature] && result.lineNumbers[feature].length > 0 && (
                                <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                  Lines: {result.lineNumbers[feature].join(', ')}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-green-600 mt-1">
                              {result?.explanations?.[feature] || 'No explanation available'}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Caution Features */}
                  {result.caution.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          ⚠️ Use With Caution
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            {result.caution.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {result.caution.map((feature) => (
                          <div key={feature} className="p-3 border rounded-lg bg-yellow-50">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-yellow-800">{feature}</div>
                              {result?.lineNumbers?.[feature] && result.lineNumbers[feature].length > 0 && (
                                <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                                  Lines: {result.lineNumbers[feature].join(', ')}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-yellow-600 mt-1">
                              {result?.explanations?.[feature] || 'No explanation available'}
                            </p>
                            {result?.alternatives?.[feature] && (
                              <div className="mt-2 p-2 bg-yellow-100 rounded text-sm">
                                <strong>Alternative:</strong> {result.alternatives[feature]}
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Unsafe Features */}
                  {result.unsafe.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          ❌ Not Baseline Safe
                          <Badge variant="outline" className="bg-red-100 text-red-800">
                            {result.unsafe.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {result.unsafe.map((feature) => (
                          <div key={feature} className="p-3 border rounded-lg bg-red-50">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-red-800">{feature}</div>
                              {result?.lineNumbers?.[feature] && result.lineNumbers[feature].length > 0 && (
                                <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                  Lines: {result.lineNumbers[feature].join(', ')}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-red-600 mt-1">
                              {result?.explanations?.[feature] || 'No explanation available'}
                            </p>
                            {result?.alternatives?.[feature] && (
                              <div className="mt-2 p-2 bg-red-100 rounded text-sm">
                                <strong>Recommended:</strong> {result.alternatives[feature]}
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* No Features Found */}
                  {result.safe.length === 0 && 
                   result.caution.length === 0 && 
                   result.unsafe.length === 0 && 
                   !result.explanations.error && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <div className="text-4xl mb-2">🎉</div>
                        <h3 className="text-lg font-semibold mb-2">No Specific Features Detected</h3>
                        <p className="text-muted-foreground">
                          Your code doesn't contain any web platform features we're tracking.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Error State */}
                  {result.explanations.error && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <div className="text-4xl mb-2">⚠️</div>
                        <h3 className="text-lg font-semibold mb-2 text-red-600">Analysis Error</h3>
                        <p className="text-red-600">{result.explanations.error}</p>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                    <p className="text-muted-foreground">
                      Write or paste your code in the editor and click "Analyze Code" to check baseline compatibility.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}

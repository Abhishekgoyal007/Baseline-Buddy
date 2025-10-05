"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import the Image component
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Search, Sun, Moon } from "lucide-react";
import { SplitPane } from "@/components/ui/resizable";
import { auth, googleProvider } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup,createUserWithEmailAndPassword, User } from "firebase/auth";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";


// Dynamically import Monaco Editor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const [downloadPending, setDownloadPending] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"json" | "txt" | "csv" | "pdf" | "docx">("json");
  // User state
  const [user, setUser] = useState<User | null>(null);

  // Login popup state
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const generatePDF = (result: AnalysisResult) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let y = 40;

    const addCard = (title: string, content: string[], bgColor: string, textColor: string) => {
      const padding = 15; // Increased padding for nicer spacing
      const lineHeight = 16; // Line height for content
      const titleLineHeight = 18; // Line height for title

      // Wrap title
      const wrappedTitle = doc.splitTextToSize(title, pageWidth - margin * 2 - padding * 2);
      const titleHeight = wrappedTitle.length * titleLineHeight;

      // Wrap content
      const wrappedLines: string[][] = content.map(line =>
        doc.splitTextToSize(line, pageWidth - margin * 2 - padding * 2)
      );
      const contentHeight =
        wrappedLines.reduce((acc, lines) => acc + lines.length * lineHeight + 4, 0); // Added small spacing between lines

      const cardHeight = titleHeight + contentHeight + padding * 2;

      // Draw background card
      doc.setFillColor(bgColor);
      doc.roundedRect(margin, y, pageWidth - margin * 2, cardHeight, 5, 5, "F");

      // Draw title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(textColor);
      doc.text(wrappedTitle, margin + padding, y + padding + titleLineHeight - 4); // added offset for better spacing

      // Draw content
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor("#000000");
      let contentY = y + padding + titleHeight + 10; // added extra spacing after title

      wrappedLines.forEach(lines => {
        doc.text(lines, margin + padding, contentY);
        contentY += lines.length * lineHeight + 4; // spacing between lines
      });

      y += cardHeight + 20; // spacing between cards

      // Page break if needed
      if (y + 50 > doc.internal.pageSize.getHeight()) {
        doc.addPage();
        y = 40;
      }
    };


    // Main title
    const mainTitle = "Code Analysis Report";
    const wrappedMainTitle = doc.splitTextToSize(mainTitle, pageWidth - margin * 2);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#333333");
    doc.text(wrappedMainTitle, margin, y);
    y += wrappedMainTitle.length * 20 + 10;

    // Summary
    addCard(
      "Analysis Summary",
      [
        `Safe: ${result.summary.safe}`,
        `Caution: ${result.summary.caution}`,
        `Unsafe: ${result.summary.unsafe}`,
        `Total: ${result.summary.total}`
      ],
      "#f0f0f0",
      "#1a73e8"
    );

    // Enhancements
    if (result.enhancements.length > 0) {
      addCard(
        "Enhancement Suggestions",
        result.enhancements.map(e => `${e.type.toUpperCase()}: ${e.title} - ${e.description}`),
        "#fff8e1",
        "#f4b400"
      );
    }

    // Features
    const renderFeaturesCard = (title: string, features: string[], color: string, bgColor: string) => {
      if (features.length === 0) return;
      addCard(
        title,
        features.map(f => {
          let lineText = f;
          if (result.lineNumbers[f]) lineText += ` (Lines: ${result.lineNumbers[f].join(", ")})`;
          if (result.alternatives[f]) lineText += ` | Recommended: ${result.alternatives[f]}`;
          return lineText;
        }),
        bgColor,
        color
      );
    };

    renderFeaturesCard("Baseline Safe Features", result.safe, "#0f9d58", "#e6f4ea");
    renderFeaturesCard("Use With Caution", result.caution, "#f4b400", "#fff8e1");
    renderFeaturesCard("Not Baseline Safe", result.unsafe, "#db4437", "#fdecea");

    doc.save("code-analysis.pdf");
  };

  const generateDOCXReport = async (result: AnalysisResult) => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "🔍 Baseline Code Analysis Report",
              heading: HeadingLevel.TITLE,
            }),
            new Paragraph({
              text: `Generated on: ${new Date().toLocaleString()}`,
              spacing: { after: 200 },
            }),

            new Paragraph({ text: "📊 Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: `Safe: ${result.summary.safe}` }),
            new Paragraph({ text: `Caution: ${result.summary.caution}` }),
            new Paragraph({ text: `Unsafe: ${result.summary.unsafe}` }),
            new Paragraph({ text: `Total: ${result.summary.total}` }),

            new Paragraph({ text: "💡 Enhancement Suggestions", heading: HeadingLevel.HEADING_1 }),
            ...result.enhancements.map((e) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `[${e.type.toUpperCase()}] ${e.title}: `, bold: true }),
                  new TextRun(e.description),
                ],
                spacing: { after: 100 },
              })
            ),

            new Paragraph({ text: "✅ Safe Features", heading: HeadingLevel.HEADING_1 }),
            ...result.safe.map(f =>
              new Paragraph({
                text: `- ${f} (Lines: ${result.lineNumbers[f]?.join(",") || "N/A"}): ${result.explanations[f] || ""}`,
                spacing: { after: 100 },
              })
            ),

            new Paragraph({ text: "⚠️ Caution Features", heading: HeadingLevel.HEADING_1 }),
            ...result.caution.map(f =>
              new Paragraph({
                text: `- ${f} (Lines: ${result.lineNumbers[f]?.join(",") || "N/A"}): ${result.explanations[f] || ""}`,
                spacing: { after: 100 },
              })
            ),

            new Paragraph({ text: "❌ Unsafe Features", heading: HeadingLevel.HEADING_1 }),
            ...result.unsafe.map(f =>
              new Paragraph({
                text: `- ${f} (Lines: ${result.lineNumbers[f]?.join(",") || "N/A"}): ${result.explanations[f] || ""}`,
                spacing: { after: 100 },
              })
            ),
          ],
        },
      ],
    });

    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, "code-analysis-report.docx");
  };



  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/analyze-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
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
          complexity: "Unknown",
        },
        enhancements: [],
        language: "unknown",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!user) {
      setDownloadPending(true);
      setShowAuthDialog(true);
      return;
    }
    if (!result) return;

    const fileNameBase = "code-analysis";

    if (downloadFormat === "json") {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
      saveAs(blob, `${fileNameBase}.json`);
    } else if (downloadFormat === "txt") {
      const content = `
        Analysis Summary:
        Safe: ${result.summary.safe}
        Caution: ${result.summary.caution}
        Unsafe: ${result.summary.unsafe}
        Total: ${result.summary.total}

        Enhancements:
        ${result.enhancements.map(e => `- ${e.type.toUpperCase()}: ${e.title} - ${e.description}`).join("\n")}

        Safe Features: ${result.safe.join(", ")}
        Caution Features: ${result.caution.join(", ")}
        Unsafe Features: ${result.unsafe.join(", ")}
        `;
      saveAs(new Blob([content], { type: "text/plain" }), `${fileNameBase}.txt`);
    } else if (downloadFormat === "csv") {
      const content = `Category,Count\nSafe,${result.summary.safe}\nCaution,${result.summary.caution}\nUnsafe,${result.summary.unsafe}\nTotal,${result.summary.total}`;
      saveAs(new Blob([content], { type: "text/csv" }), `${fileNameBase}.csv`);
    } else if (downloadFormat === "pdf") {
      generatePDF(result);
    } else if (downloadFormat === "docx") {
      await generateDOCXReport(result);
    }


    setDownloadPending(false);
  };


  const handleAuth = async () => {
    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setShowAuthDialog(false);
      setAuthError("");
    } catch (_err) {
      setAuthError("Authentication failed. Check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowAuthDialog(false);
      setAuthError("");
    } catch (_err) {
      setAuthError("Google sign-in failed");
    }
  };

useEffect(() => {
  if (user && downloadPending) {
    handleDownload();
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [user, downloadPending]);

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-center justify-center mb-1 relative">
        <div className="absolute top-0 left-0">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft/>
            </Button>
        </div>
        <div className="text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center">
              <Image src="/logo.png" alt="App Logo" width={50} height={50} className="mr-2" />
              Baseline Code Analyzer
            </h1>
        </div>
      </div>
      
      <div className="text-center mb-4">
        <p className="text-muted-foreground text-lg">
          Check if your HTML, CSS, JavaScript, TypeScript, or React code is Baseline Web Platform safe
        </p>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #2D2D2D;
        }

        ::-webkit-scrollbar-thumb {
          background: #4F4F4F;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #5a5a5a;
        }
      `}</style>

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
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                      >
                        {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      </Button>
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
                  {loading ? "🔍 Analyzing..." : <><Search className="mr-2 h-4 w-4" /> Analyze Code</>}
                </Button>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Format:</label>
                    <select
                      value={downloadFormat}
                      onChange={(e) => setDownloadFormat(e.target.value as 'json' | 'pdf' | 'docx')}
                      className="px-3 py-1 border rounded-md text-sm bg-black text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      style={{ backgroundColor: '#000', color: '#fff' }}
                    >
                      <option value="json">JSON</option>
                      <option value="txt">TXT</option>
                      <option value="csv">CSV</option>
                      <option value="pdf">PDF</option>
                      <option value="docx">DOCX</option>
                    </select>
                  </div>
                  <Button onClick={handleDownload} className="flex-grow sm:flex-grow-0 w-full sm:w-auto" disabled={!result}>
                    <Download className="mr-2 h-4 w-4" /> Download Analysis
                  </Button>
                </div>
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
                              <div className="mt-2 p-2 text-black bg-yellow-100 rounded text-sm">
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
                              <div className="mt-2 p-2 text-black bg-red-100 rounded text-sm">
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
                          Your code doesn&apos;t contain any web platform features we&apos;re tracking.
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
                      Write or paste your code in the editor and click &quot;Analyze Code&quot; to check baseline compatibility.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          }
        />
      </div>
      {/* Login / SignUp Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{authMode === "login" ? "Login" : "Sign Up"} Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {authError && <p className="text-red-600 text-sm">{authError}</p>}
            <Button className="w-full" onClick={handleAuth}>{authMode === "login" ? "Login" : "Sign Up"}</Button>
            <Button variant="secondary" className="w-full" onClick={handleGoogleLogin}>Continue with Google</Button>
            <Button variant="link" className="w-full mt-2" onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}>
              {authMode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
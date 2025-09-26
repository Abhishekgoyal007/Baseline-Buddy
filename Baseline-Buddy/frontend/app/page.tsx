"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, CheckCircle, XCircle, Globe, Sparkles, Code2, Shield } from "lucide-react"
import { SiGooglechrome, SiFirefox, SiSafari, SiAndroid } from "react-icons/si"
import { FaEdge } from "react-icons/fa"


// ✅ Using Globe icon as a fallback for all browsers to maintain functionality

interface FeatureResult {
  feature: string
  baselineSafe: boolean
  browsers: string[]
  aiExplanation: string
}

type BrowserIconsType = {
  [key: string]: { name: string; icon: React.ReactNode }
}

const formatAIExplanation = (text: string) => {
  const formattedText = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^\* /gm, "• ")
    .replace(/\*/g, "")

  return formattedText
}

function App() {
  const router = useRouter()
  const [feature, setFeature] = useState("")
  const [result, setResult] = useState<FeatureResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const checkFeature = async () => {
    if (!feature.trim()) return
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("http://localhost:5000/check-feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature }),
      })

      if (!response.ok) throw new Error("Failed to fetch result")

      const data = await response.json()
      setResult(data)
    } catch {
      setError("Something went wrong. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      checkFeature()
    }
  }

  // ✅ Browser Icons using Globe as fallback to maintain functionality
const browserIcons: BrowserIconsType = {
  chrome: { 
    name: "Chrome", 
    icon: <SiGooglechrome className="w-6 h-6 text-[#4285F4]" /> 
  },
  chrome_android: { 
    name: "Chrome (Android)", 
    icon: (
      <div className="flex items-center space-x-1">
        <SiGooglechrome className="w-5 h-5 text-[#4285F4]" />
        <span className="text-sm font-bold text-gray-600">+</span>
        <SiAndroid className="w-4 h-4 text-[#3DDC84]" />
      </div>
    ) 
  },
  firefox: { 
    name: "Firefox", 
    icon: <SiFirefox className="w-6 h-6 text-[#FF7139]" /> 
  },
  firefox_android: { 
    name: "Firefox (Android)", 
    icon: (
      <div className="flex items-center space-x-1">
        <SiFirefox className="w-5 h-5 text-[#FF7139]" />
        <span className="text-sm font-bold text-gray-600">+</span>
        <SiAndroid className="w-4 h-4 text-[#3DDC84]" />
      </div>
    ) 
  },
  safari: { 
    name: "Safari", 
    icon: <SiSafari className="w-6 h-6 text-[#0A84FF]" /> 
  },
  safari_ios: { 
    name: "Safari (iOS)", 
    icon: <SiSafari className="w-6 h-6 text-[#0A84FF]" /> 
  },
  edge: { 
    name: "Edge", 
    icon: <FaEdge className="w-6 h-6 text-[#0A84FF]" /> 
  },
}

  const exampleFeatures = ["fetch", ":has", "container-queries", "grid", "flexbox", "css-variables"]

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-lg flex items-center justify-center">
                <Image
                  src="/logo.png" // 👈 Update with your logo path
                  alt="Baseline Buddy Logo"
                  width={2000} // 👈 Set width
                  height={2000} // 👈 Set height
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Baseline Buddy</h1>
                <p className="text-sm text-muted-foreground">Web Feature Compatibility Checker</p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-2">
              <Shield className="w-3 h-3" />
              Professional Tool
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Check Web Feature Compatibility
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">
            Ensure Your Features Are <span className="text-primary">Baseline Safe</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto mb-8">
            Verify browser compatibility for modern web features and get AI-powered explanations to make informed
            development decisions.
          </p>

          {/* Search Section */}
          <Card className="max-w-2xl mx-auto mb-8">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Enter a web feature (e.g., fetch, :has, container-queries)"
                    value={feature}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeature(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 h-12 text-base"
                    disabled={loading}
                    suppressHydrationWarning
                  />
                </div>
                <Button onClick={checkFeature} disabled={loading || !feature} size="lg" className="px-8" suppressHydrationWarning>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Check Feature
                    </>
                  )}
                </Button>
              </div>

              {/* Example Features */}
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Try these examples:</p>
                <div className="flex flex-wrap gap-2">
                  {exampleFeatures.map((example) => (
                    <Button
                      key={example}
                      variant="outline"
                      size="sm"
                      onClick={() => setFeature(example)}
                      className="text-xs"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
              {/* Redirect to Code Analyzer */}
              <div className="mt-6 text-center">
                <Button
                  size="lg"
                  className="px-8"
                  onClick={() => router.push("/code-analyzer")}
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  Open Code Analyzer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Analyzing feature compatibility...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="max-w-4xl mx-auto border-destructive/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-destructive">
                <XCircle className="w-5 h-5" />
                <p className="font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Feature Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <code className="bg-muted px-3 py-1 rounded-md text-primary font-mono">{result.feature}</code>
                    </CardTitle>
                    <CardDescription className="mt-2">Web feature compatibility analysis</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      {result.baselineSafe ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="font-semibold">
                        {result.baselineSafe ? "Baseline Safe" : "Not Baseline Safe"}
                      </span>
                    </div>
                    <Badge variant={result.baselineSafe ? "default" : "destructive"} className="gap-2">
                      {result.baselineSafe ? "✅ Safe to Use" : "❌ Use with Caution"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Browser Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Browser Support
                </CardTitle>
                <CardDescription>Compatibility across major browsers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.browsers.map((browser, i) => {
                    const browserInfo = browserIcons[browser] || { name: browser, icon: <Globe /> }
                    return (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border">
                        {browserInfo.icon}
                        <span className="font-medium">{browserInfo.name}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* AI Explanation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Analysis
                </CardTitle>
                <CardDescription>Detailed explanation and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <div
                    className="text-foreground leading-relaxed whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: formatAIExplanation(result.aiExplanation),
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-border/50">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Built for developers who care about web standards and compatibility</p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
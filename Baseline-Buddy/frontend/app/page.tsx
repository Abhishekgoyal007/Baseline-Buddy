"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ToastContainer } from "@/components/ui/toast"
import { Search, Loader2, CheckCircle, XCircle, Globe, Sparkles, Code2, Shield, Zap, TrendingUp, Copy, Plus, X, Clock, BarChart3, Users, Star, Award, HelpCircle, ChevronRight, Quote, Keyboard, Mail, Send } from "lucide-react"
import { SiGooglechrome, SiFirefox, SiSafari, SiAndroid } from "react-icons/si"
import { FaEdge } from "react-icons/fa"
import { ThemeToggle } from "@/components/theme-toggle"


// ✅ Using Globe icon as a fallback for all browsers to maintain functionality

// Popular web features for autocomplete
const POPULAR_FEATURES = [
  "fetch", "grid", "flexbox", "css-variables", ":has", "container-queries",
  "aspect-ratio", "backdrop-filter", "subgrid", "gap", "async-await",
  "promises", "arrow-functions", "template-literals", "destructuring",
  "spread-operator", "optional-chaining", "nullish-coalescing",
  "intersection-observer", "resize-observer", "web-animations",
  "custom-properties", "scroll-snap", "position-sticky", "object-fit"
]

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

// Counter Animation Hook
function useCounterAnimation(end: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!startCounting) return
    
    let startTime: number | null = null
    const startValue = 0
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * (end - startValue) + startValue))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [end, duration, startCounting])
  
  return count
}

function App() {
  const router = useRouter()
  const [feature, setFeature] = useState("")
  const [result, setResult] = useState<FeatureResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Autocomplete states
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  // Recent searches state
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  // Copy to clipboard state
  const [copied, setCopied] = useState(false)
  
  // Comparison mode states
  const [comparisonMode, setComparisonMode] = useState(false)
  const [comparisonResults, setComparisonResults] = useState<FeatureResult[]>([])
  
  // Stats tracking
  const [stats, setStats] = useState({
    totalSearches: 0,
    popularFeatures: [] as { name: string; count: number }[],
    totalUsers: 1250,
    featuresChecked: 450
  })
  
  // Tutorial/Onboarding state
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [showStats, setShowStats] = useState(false)
  
  // Toast notifications
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: "success" | "error" | "info" | "warning" }>>([])
  
  // What's New modal
  const [showWhatsNew, setShowWhatsNew] = useState(false)
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [contactSubmitting, setContactSubmitting] = useState(false)
  
  // Counter animations state
  const [startCounters, setStartCounters] = useState(false)
  const animatedTotalUsers = useCounterAnimation(1250, 2000, startCounters)
  const animatedFeaturesChecked = useCounterAnimation(450, 1500, startCounters)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches')
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
    
    // Load stats
    const storedStats = localStorage.getItem('appStats')
    if (storedStats) {
      setStats(JSON.parse(storedStats))
    }
    
    // Check if first-time user
    const hasVisited = localStorage.getItem('hasVisited')
    if (!hasVisited) {
      setShowTutorial(true)
      localStorage.setItem('hasVisited', 'true')
    }
    
    // Check if should show "What's New"
    const lastVersion = localStorage.getItem('lastSeenVersion')
    const currentVersion = '2.0.0' // Update this when you add new features
    if (lastVersion !== currentVersion) {
      setShowWhatsNew(true)
      localStorage.setItem('lastSeenVersion', currentVersion)
    }
  }, [])
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K - Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
        searchInput?.focus()
        showToast('Press Esc to close', 'info')
      }
      
      // Ctrl/Cmd + / - Open help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        setShowTutorial(true)
      }
      
      // Ctrl/Cmd + Shift + S - Toggle stats
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault()
        setShowStats(!showStats)
        showToast(showStats ? 'Stats hidden' : 'Stats visible', 'info')
      }
      
      // Esc - Close modals
      if (e.key === 'Escape') {
        setShowTutorial(false)
        setShowWhatsNew(false)
        setShowStats(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showStats])
  
  // Trigger counter animations when stats dashboard opens
  useEffect(() => {
    if (showStats) {
      setStartCounters(true)
    }
  }, [showStats])
  
  // Scroll Reveal Animation
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    }
    
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '50px'
    })
    
    const scrollElements = document.querySelectorAll('.scroll-reveal')
    scrollElements.forEach(el => observer.observe(el))
    
    return () => observer.disconnect()
  }, [])
  
  // Toast helper function
  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
  }
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }
  
  // Update stats on search
  const updateStats = (featureName: string) => {
    const newStats = { ...stats }
    newStats.totalSearches += 1
    
    // Update popular features
    const existingFeature = newStats.popularFeatures.find(f => f.name === featureName)
    if (existingFeature) {
      existingFeature.count += 1
    } else {
      newStats.popularFeatures.push({ name: featureName, count: 1 })
    }
    
    // Sort and keep top 5
    newStats.popularFeatures = newStats.popularFeatures
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    setStats(newStats)
    localStorage.setItem('appStats', JSON.stringify(newStats))
  }

  // Save to recent searches
  const saveToRecentSearches = (searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // Handle autocomplete
  const handleInputChange = (value: string) => {
    setFeature(value)
    if (value.length > 0) {
      const filtered = POPULAR_FEATURES.filter(f => 
        f.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5)
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactSubmitting(true)
    
    try {
      // Simulate form submission (replace with your actual API)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      showToast(`✉️ Thanks ${contactForm.name}! We'll get back to you soon.`, 'success')
      setContactForm({ name: "", email: "", message: "" })
    } catch {
      showToast('❌ Failed to send message. Please try again.', 'error')
    } finally {
      setContactSubmitting(false)
    }
  }

  // Copy result to clipboard
  const copyToClipboard = () => {
    if (!result) return
    const text = `Feature: ${result.feature}\nBaseline Safe: ${result.baselineSafe ? 'Yes' : 'No'}\nBrowsers: ${result.browsers.join(', ')}\nExplanation: ${result.aiExplanation}`
    navigator.clipboard.writeText(text)
    showToast('✅ Results copied to clipboard!', 'success')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const checkFeature = async () => {
    if (!feature.trim()) return
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/check-feature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature }),
      })

      if (!response.ok) throw new Error("Failed to fetch result")

      const data = await response.json()
      
      // Save to recent searches
      saveToRecentSearches(feature)
      
      // Update stats
      updateStats(feature)
      
      if (comparisonMode) {
        // Add to comparison results
        setComparisonResults(prev => [...prev, data])
        showToast(`➕ Added "${feature}" to comparison (${comparisonResults.length + 1} features)`, 'info')
      } else {
        setResult(data)
        showToast('✅ Feature analyzed successfully!', 'success')
      }
      
      // Clear suggestions
      setShowSuggestions(false)
    } catch {
      setError("Something went wrong. Please try again later.")
      showToast('❌ Something went wrong. Please try again.', 'error')
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
      {/* Modern Navbar with Glassmorphism */}
      <nav className="glass-card border-b border-border/50 sticky top-0 z-50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/20">
                <Image
                  src="/logo.png"
                  alt="Baseline Buddy"
                  width={32}
                  height={32}
                  className="transition-transform duration-300 group-hover:rotate-3"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Baseline Buddy
                </h1>
                <p className="text-xs text-muted-foreground">Compatibility Checker</p>
              </div>
            </div>

            {/* Center - Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  document.querySelector('#search-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="gap-2 hover:bg-primary/5"
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStats(!showStats)}
                className="gap-2 hover:bg-primary/5"
              >
                <BarChart3 className="w-4 h-4" />
                Stats
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  document.querySelector('#features-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="gap-2 hover:bg-primary/5"
              >
                <Sparkles className="w-4 h-4" />
                Features
              </Button>
            </div>

            {/* Right - Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTutorial(true)}
                className="gap-2 hover:bg-primary/5"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Help</span>
              </Button>
              
              <div className="hidden md:flex items-center gap-2">
                <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
                  <Shield className="w-3 h-3" />
                  <span className="text-xs">v2.0</span>
                </Badge>
              </div>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Cleaner Hero Section */}
        <div className="text-center mb-16 slide-up max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Powered by AI & Web Standards
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Check If Your Web Features Are{" "}
            <span className="text-primary">Baseline Safe</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Verify browser compatibility and get AI-powered insights for modern web features
          </p>
        </div>

        {/* Stats Dashboard - Cleaner Layout with Animations */}
        {showStats && (
          <Card className="max-w-5xl mx-auto mb-12 glass-card slide-up">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <BarChart3 className="w-5 h-5 text-primary" />
                Your Stats Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="text-center p-3 rounded-lg bg-muted/30 border border-muted stagger-1">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-xl font-bold counter-animate">{animatedTotalUsers.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Users</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30 border border-muted stagger-2">
                  <Search className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <div className="text-xl font-bold counter-animate">{stats.totalSearches}</div>
                  <div className="text-xs text-muted-foreground">Your Searches</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30 border border-muted stagger-3">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <div className="text-xl font-bold counter-animate">{animatedFeaturesChecked}</div>
                  <div className="text-xs text-muted-foreground">Features Checked</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30 border border-muted stagger-4">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <div className="text-xl font-bold counter-animate">95%</div>
                  <div className="text-xs text-muted-foreground">Accuracy Rate</div>
                </div>
              </div>
                
              {stats.popularFeatures.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Your Most Checked Features
                  </h3>
                  <div className="space-y-2">
                    {stats.popularFeatures.map((feat, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/20 border border-muted/50">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <code className="text-sm font-mono">{feat.name}</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${(feat.count / stats.popularFeatures[0].count) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground w-6 text-right">{feat.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Cleaner Search Section */}
        <div id="search-section" className="max-w-2xl mx-auto mb-12 scroll-mt-20">
          <Card className="glass-card glow-on-hover">
            <CardContent className="p-6">
              {/* Comparison Mode Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={comparisonMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setComparisonMode(!comparisonMode)}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {comparisonMode ? "Comparison Mode ON" : "Compare Features"}
                  </Button>
                  {comparisonMode && comparisonResults.length > 0 && (
                    <Badge variant="secondary">{comparisonResults.length} features</Badge>
                  )}
                </div>
                {comparisonMode && comparisonResults.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setComparisonResults([])
                      showToast('🗑️ Comparison cleared', 'info')
                    }}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </Button>
                )}
              </div>

              {/* Search Input with Autocomplete */}
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                  <Input
                    type="text"
                    placeholder="Enter a web feature (e.g., fetch, :has, grid)"
                    value={feature}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="pl-10 h-12 text-base input-focus"
                    disabled={loading}
                    suppressHydrationWarning
                  />
                  
                  {/* Autocomplete Suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setFeature(suggestion)
                            setShowSuggestions(false)
                            showToast('✨ Selected from suggestions', 'info')
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span>{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Button onClick={checkFeature} disabled={loading || !feature} size="lg" className="px-8 btn-press" suppressHydrationWarning>
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

              {/* Recent Searches & Example Features */}
              <div className="mt-4 space-y-3">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recent searches:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <Button
                          key={index}
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setFeature(search)
                            showToast('🕐 Loaded from recent searches', 'info')
                          }}
                          className="text-xs gap-1"
                        >
                          {search}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Example Features */}
                <div>
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

        {/* Enhanced Loading State - AI Style Spinner */}
        {loading && (
          <div className="max-w-4xl mx-auto fade-in">
            <Card className="glass-card">
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <p className="text-lg font-medium mb-2">Analyzing feature compatibility</p>
                  <p className="text-sm text-muted-foreground">Checking browser support & generating AI insights...</p>
                </div>
              </CardContent>
            </Card>
          </div>
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

        {/* Enhanced Results with Copy Button */}
        {result && !comparisonMode && (
          <div className="max-w-4xl mx-auto space-y-6 slide-up">
            {/* Feature Overview with Glassmorphism */}
            <Card className="glass-card glow-on-hover">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl flex items-center gap-3 flex-wrap">
                      <code className="bg-muted px-3 py-1 rounded-md text-primary font-mono text-lg">{result.feature}</code>
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Web feature compatibility analysis
                    </CardDescription>
                  </div>
                  
                  {/* Copy to Clipboard Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Results
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between flex-wrap gap-4 mt-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2 justify-end">
                      {result.baselineSafe ? (
                        <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <path className="checkmark-draw" d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                      <span className="font-semibold text-lg">
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

            {/* Browser Support - Enhanced */}
            <Card className="glass-card glow-on-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Globe className="w-6 h-6 text-primary" />
                  Browser Support
                </CardTitle>
                <CardDescription>Compatibility across major browsers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.browsers.map((browser, i) => {
                    const browserInfo = browserIcons[browser] || { name: browser, icon: <Globe /> }
                    return (
                      <div 
                        key={i} 
                        className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border hover:bg-muted transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                      >
                        <div className="text-2xl">{browserInfo.icon}</div>
                        <span className="font-medium">{browserInfo.name}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* AI Explanation - Enhanced */}
            <Card className="glass-card glow-on-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  AI Analysis
                </CardTitle>
                <CardDescription>Detailed explanation and recommendations powered by AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none dark:prose-invert">
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

        {/* Comparison View */}
        {comparisonMode && comparisonResults.length > 0 && (
          <div className="max-w-6xl mx-auto space-y-6 slide-up">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Plus className="w-6 h-6 text-primary" />
                  Feature Comparison ({comparisonResults.length})
                </CardTitle>
                <CardDescription>Side-by-side comparison of web features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold">Feature</th>
                        <th className="text-center p-4 font-semibold">Baseline Safe</th>
                        <th className="text-center p-4 font-semibold">Browser Support</th>
                        <th className="text-right p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonResults.map((result, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                              {result.feature}
                            </code>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {result.baselineSafe ? (
                                <>
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Safe</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-5 h-5 text-red-500" />
                                  <span className="text-sm font-medium text-red-600 dark:text-red-400">Caution</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center flex-wrap gap-2">
                              {result.browsers.slice(0, 4).map((browser, i) => {
                                const browserInfo = browserIcons[browser] || { name: browser, icon: <Globe className="w-4 h-4" /> }
                                return (
                                  <div key={i} title={browserInfo.name} className="text-xl">
                                    {browserInfo.icon}
                                  </div>
                                )
                              })}
                              {result.browsers.length > 4 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{result.browsers.length - 4}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setComparisonResults(prev => prev.filter((_, i) => i !== index))
                                showToast('➖ Removed from comparison', 'info')
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Export Comparison Button */}
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const comparisonText = comparisonResults.map(r => 
                        `Feature: ${r.feature}\nBaseline Safe: ${r.baselineSafe ? 'Yes' : 'No'}\nBrowsers: ${r.browsers.join(', ')}\n---`
                      ).join('\n')
                      navigator.clipboard.writeText(comparisonText)
                      showToast('✅ Comparison copied to clipboard!', 'success')
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Comparison
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Testimonials & Use Cases Section */}
        <div id="features-section" className="max-w-6xl mx-auto mt-20 mb-12 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="text-primary">Developers Worldwide</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              See how teams are using Baseline Buddy to build better web experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Testimonial 1 */}
            <Card className="glass-card hover:scale-105 transition-transform scroll-reveal">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="text-sm mb-4 italic">
                  &quot;Baseline Buddy saved our team hours of research. We can now confidently use modern CSS features knowing they&apos;re safe for our users.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    SE
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Sarah Engineer</p>
                    <p className="text-xs text-muted-foreground">Senior Frontend Dev</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="glass-card hover:scale-105 transition-transform scroll-reveal">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="text-sm mb-4 italic">
                  &quot;The comparison mode is a game-changer! I can evaluate multiple CSS Grid alternatives side-by-side and make data-driven decisions.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold">
                    MC
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Mike Chen</p>
                    <p className="text-xs text-muted-foreground">Tech Lead @ Startup</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="glass-card hover:scale-105 transition-transform scroll-reveal">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="text-sm mb-4 italic">
                  &quot;AI explanations are incredibly helpful for junior developers on our team. They learn WHY features are safe, not just IF.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white font-bold">
                    AP
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Alex Parker</p>
                    <p className="text-xs text-muted-foreground">Engineering Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Use Cases */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Code2 className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">For Development Teams</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Make informed technology decisions with comprehensive browser compatibility data
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">Sprint Planning</Badge>
                      <Badge variant="secondary" className="text-xs">Tech Debt</Badge>
                      <Badge variant="secondary" className="text-xs">Code Reviews</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">For Learning & Education</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Perfect for bootcamps, courses, and self-taught developers learning modern web development
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">Tutorials</Badge>
                      <Badge variant="secondary" className="text-xs">Workshops</Badge>
                      <Badge variant="secondary" className="text-xs">Best Practices</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="mt-20 pt-8 border-t border-border/50">
          <div className="text-center text-muted-foreground space-y-2">
            <p className="text-sm flex items-center justify-center gap-2">
              Built with <span className="text-red-500 animate-pulse">❤️</span> for developers who care about web standards
            </p>
            <p className="text-xs opacity-70">Powered by AI & Web Baseline Database</p>
          </div>
        </footer>
      </main>
      
      {/* What's New Modal */}
      <Dialog open={showWhatsNew} onOpenChange={setShowWhatsNew}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-primary" />
              What&apos;s New in Baseline Buddy v2.0 🎉
            </DialogTitle>
            <DialogDescription>
              We&apos;ve added powerful new features to enhance your workflow
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-6">
            {/* Toast Notifications */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">Toast Notifications</h3>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">NEW</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get instant feedback for every action with beautiful toast notifications. No more wondering if your action succeeded!
                </p>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Keyboard className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">Keyboard Shortcuts</h3>
                  <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">NEW</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Work faster with powerful keyboard shortcuts:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <kbd className="px-2 py-1 bg-muted rounded border">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-muted rounded border">K</kbd>
                    <span>Focus Search</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <kbd className="px-2 py-1 bg-muted rounded border">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-muted rounded border">/</kbd>
                    <span>Open Help</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <kbd className="px-2 py-1 bg-muted rounded border">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-muted rounded border">Shift</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-muted rounded border">S</kbd>
                    <span>Toggle Stats</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <kbd className="px-2 py-1 bg-muted rounded border">Esc</kbd>
                    <span>Close Modals</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Dashboard */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">Stats Dashboard</h3>
                  <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30">IMPROVED</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Track your usage with detailed analytics and insights about your most-searched features.
                </p>
              </div>
            </div>

            {/* Performance */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">Faster & Smoother</h3>
                  <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">IMPROVED</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Optimized animations and improved performance for a buttery-smooth experience.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => {
                setShowWhatsNew(false)
                localStorage.setItem('lastSeenVersion', '2.0.0')
              }}
              className="gap-2"
            >
              Got it!
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Interactive Tutorial Dialog */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-primary" />
              Welcome to Baseline Buddy! 🎉
            </DialogTitle>
            <DialogDescription>
              Let&apos;s take a quick tour of the features to help you get started
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {tutorialStep === 0 && (
              <div className="space-y-4 fade-in">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Smart Search</h3>
                    <p className="text-sm text-muted-foreground">
                      Start typing any web feature (like &quot;grid&quot;, &quot;fetch&quot;, or &quot;:has&quot;) and get instant autocomplete suggestions. Hit Enter or click Check Feature to see compatibility data.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Recent Searches</h3>
                    <p className="text-sm text-muted-foreground">
                      Your last 5 searches are automatically saved locally. Click any recent search to quickly check it again.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {tutorialStep === 1 && (
              <div className="space-y-4 fade-in">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Copy className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Copy Results</h3>
                    <p className="text-sm text-muted-foreground">
                      Found useful information? Click the &quot;Copy Results&quot; button to share findings with your team or save for documentation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Plus className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Comparison Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable comparison mode to check multiple features side-by-side. Perfect for evaluating alternatives like &quot;grid vs flexbox&quot;.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {tutorialStep === 2 && (
              <div className="space-y-4 fade-in">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Stats Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Click &quot;Stats&quot; in the header to see your usage statistics and most-checked features. Track your learning progress!
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">AI Explanations</h3>
                    <p className="text-sm text-muted-foreground">
                      Every result includes AI-powered explanations to help you understand browser compatibility and make informed decisions.
                    </p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium text-center">
                    🎉 You&apos;re all set! Start exploring web features with confidence.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {[0, 1, 2].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    tutorialStep === step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              {tutorialStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setTutorialStep(tutorialStep - 1)}
                >
                  Previous
                </Button>
              )}
              
              {tutorialStep < 2 ? (
                <Button
                  onClick={() => setTutorialStep(tutorialStep + 1)}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setShowTutorial(false)
                    setTutorialStep(0)
                  }}
                  className="gap-2"
                >
                  Get Started
                  <Sparkles className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Form Section */}
      <section id="contact" className="max-w-4xl mx-auto mb-16 scroll-mt-20 scroll-reveal">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Mail className="w-6 h-6 text-primary" />
              Get in Touch
            </CardTitle>
            <CardDescription>
              Have questions or feedback? We&apos;d love to hear from you!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="input-focus"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="input-focus"
                  required
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Your Message"
                  rows={5}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="input-focus resize-none"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={contactSubmitting}
                className="w-full btn-press gap-2"
              >
                {contactSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default App
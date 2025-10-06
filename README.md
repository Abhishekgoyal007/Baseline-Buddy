# Baseline Buddy

**AI-powered browser compatibility checker for modern web development**

[🚀 Live Demo](https://baseline-buddy-app.vercel.app) • [📖 Docs](#quick-start) • [🐛 Issues](https://github.com/Abhishekgoyal007/Baseline-Buddy/issues)

---

## What is Baseline Buddy?

A professional tool that instantly checks if your HTML, CSS, JavaScript, TypeScript, or React code works across modern browsers. Powered by Google Gemini AI and built with Next.js 15.

**The Problem:** Developers waste hours checking browser compatibility, leading to bugs in production.

**Our Solution:** Instant compatibility checks with AI explanations, code analysis, and exportable reports.

---

## Key Features

- **🔍 Smart Search** - Autocomplete with 30+ popular web features
- **🤖 AI Explanations** - Detailed compatibility insights from Google Gemini
- **📊 Code Analyzer** - Upload entire files for comprehensive analysis
- **⚡ Real-time Results** - Color-coded feedback (Green/Yellow/Red)
- **📝 Export Reports** - Download in JSON, PDF, TXT, CSV, or DOCX
- **⌨️ Keyboard Shortcuts** - `Ctrl+K` for search, `Ctrl+H` for help
- **🎯 Comparison Mode** - Check multiple features side-by-side
- **🎨 Modern UI** - Dark/light mode with glassmorphism design
- **📱 PWA Ready** - Install as an app on any device

---

## Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Radix UI, Monaco Editor

**Backend:** Node.js, Express, Google Gemini AI

**Deployment:** Vercel (Frontend), Railway (Backend)

---

## Quick Start

### Prerequisites

- Node.js 18+
- Google Gemini API Key ([Get it here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone repository
git clone https://github.com/Abhishekgoyal007/Baseline-Buddy.git
cd Baseline-Buddy

# Setup Backend
cd backend
npm install
echo "GOOGLE_API_KEY=your_api_key_here" > .env
echo "FRONTEND_URL=http://localhost:3000" >> .env
npm start  # Runs on port 5000

# Setup Frontend (new terminal)
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm run dev  # Runs on port 3000
```

Visit **http://localhost:3000** to start using Baseline Buddy!

---

## How to Use

### Check a Feature
1. Type a web feature (e.g., `flexbox`, `fetch`, `:has`)
2. View instant compatibility results
3. Get AI-powered explanations

### Analyze Code
1. Navigate to **Code Analyzer**
2. Paste your HTML/CSS/JS/TS code
3. Get comprehensive analysis with metrics

### Compare Features
1. Click **"+"** to enable comparison
2. Add multiple features
3. View side-by-side compatibility

### Export Reports
Select format (JSON/PDF/TXT/CSV/DOCX) and download

---

## Project Structure

```
Baseline-Buddy/
├── backend/           # Express.js API with Gemini integration
│   └── src/index.js
├── frontend/          # Next.js application
│   ├── app/           # Pages and layouts
│   ├── components/    # Reusable UI components
│   └── lib/           # Utilities and config
└── README.md
```

---

## Why Baseline Buddy Wins

✅ **Unique Value** - Only tool combining AI explanations + code analysis + export  
✅ **Real Problem** - Solves daily pain point for developers  
✅ **Technical Excellence** - Latest tech stack (Next.js 15, React 19, Gemini AI)  
✅ **User Experience** - Intuitive, fast, beautiful, accessible  
✅ **Production Ready** - Fully deployed and functional  

---

## Environment Variables

### Backend (.env)
```
GOOGLE_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push: `git push origin feature/name`
5. Open Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) file

---

## Acknowledgments

Built with Web.dev Baseline, Google Gemini AI, Next.js, Vercel, Radix UI, Tailwind CSS, and Monaco Editor.

---

**Made with ❤️ for developers who care about browser compatibility**

⭐ Star this repo if you find it helpful!

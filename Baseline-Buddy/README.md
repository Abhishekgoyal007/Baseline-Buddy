# 🎯 Baseline Buddy

> **Your AI-powered companion for web feature compatibility** - Check if your code works across all modern browsers instantly!

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 What is Baseline Buddy?

**Baseline Buddy** is a professional web development tool that helps developers check browser compatibility for web features. Built with Next.js 15 and powered by Google Gemini AI, it provides instant feedback on whether HTML, CSS, JavaScript, TypeScript, or React code is safe to use across modern browsers.

### 🎯 Why Use Baseline Buddy?

- ✅ **Save Time**: Stop manually checking browser compatibility tables
- ✅ **Avoid Bugs**: Catch compatibility issues before they reach production
- ✅ **Learn Fast**: Get AI-powered explanations for every feature
- ✅ **Stay Updated**: Baseline 2024 standards ensure modern browser support
- ✅ **Code Smarter**: Analyze entire code files, not just individual features

### 🚀 Key Features

| Feature | Description |
|---------|-------------|
| 🔍 **Smart Search** | Autocomplete suggestions for 30+ popular web features |
| 🤖 **AI Explanations** | Google Gemini AI provides detailed compatibility insights |
| 📊 **Code Analyzer** | Upload entire files and get comprehensive analysis |
| 🎨 **Modern UI** | Glassmorphism design with dark/light mode support |
| � **PWA Ready** | Install as an app on any device |
| ⚡ **Real-time Results** | Color-coded feedback (Safe/Caution/Unsafe) |
| 📝 **Export Reports** | Download analysis in JSON, PDF, TXT, CSV, or DOCX |
| ⌨️ **Keyboard Shortcuts** | `Ctrl+K` for quick search, `Ctrl+H` for help |
| 🎯 **Comparison Mode** | Check multiple features side-by-side |
| 📈 **Stats Dashboard** | Track your usage and learning progress |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.3 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS + Glassmorphism
- **Components**: Radix UI + Custom Components
- **Fonts**: Geist Sans & Geist Mono
- **Analytics**: Vercel Analytics
- **Code Editor**: Monaco Editor (VS Code engine)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI**: Google Gemini API
- **CORS**: Enabled for cross-origin requests

---

## 🚀 Quick Start (Local Setup)

### Prerequisites

Make sure you have the following installed:
- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn**: Package manager
- **Git**: Version control ([Download](https://git-scm.com/))
- **Google Gemini API Key**: Get it from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Abhishekgoyal007/Baseline-Buddy.git
cd Baseline-Buddy
```

### 2️⃣ Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Windows (PowerShell)
echo GOOGLE_API_KEY=your_gemini_api_key_here > .env
echo FRONTEND_URL=http://localhost:3000 >> .env
echo NODE_ENV=development >> .env

# macOS/Linux
cat > .env << EOF
GOOGLE_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
EOF

# Start backend server (runs on port 5000)
npm start
```

**Backend will run at:** `http://localhost:5000`

### 3️⃣ Setup Frontend

Open a **new terminal window** and run:

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
# Windows (PowerShell)
echo NEXT_PUBLIC_API_URL=http://localhost:5000 > .env.local

# macOS/Linux
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Start development server (runs on port 3000)
npm run dev
```

**Frontend will run at:** `http://localhost:3000`

### 4️⃣ Open Your Browser

Visit **http://localhost:3000** and start checking web features! 🎉

---

## 📁 Project Structure

```
Baseline-Buddy/
├── backend/                  # Express.js API server
│   ├── src/
│   │   └── index.js         # Main server file with Gemini integration
│   ├── package.json
│   └── vercel.json          # Backend deployment config
│
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── page.tsx         # Home page with feature checker
│   │   ├── layout.tsx       # Root layout with metadata
│   │   ├── globals.css      # Global styles + animations
│   │   └── code-analyzer/
│   │       └── page.tsx     # Code analysis page
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── lib/
│   │   ├── firebase.ts      # Firebase auth (optional)
│   │   └── utils.ts         # Utility functions
│   ├── public/
│   │   ├── manifest.json    # PWA manifest
│   │   └── logo.png         # App logo
│   ├── package.json
│   └── vercel.json          # Frontend deployment config
│
└── README.md                # You are here!
```

---

## 🎮 How to Use

### 1. **Check a Single Feature**

1. Type a web feature in the search box (e.g., `flexbox`, `fetch`, `:has`)
2. See autocomplete suggestions appear
3. Press `Enter` or click "Check Feature"
4. View color-coded results:
   - 🟢 **Green**: Safe to use everywhere
   - 🟡 **Yellow**: Use with caution (polyfill recommended)
   - 🔴 **Red**: Not baseline safe (avoid or use fallback)

### 2. **Analyze Code**

1. Click **"Code Analyzer"** in the navigation
2. Paste or write your HTML/CSS/JS/TS code
3. Click **"Analyze Code"**
4. Get comprehensive report with:
   - All detected features
   - Compatibility status
   - AI explanations
   - Alternative suggestions
   - Code metrics (lines, complexity, functions)

### 3. **Compare Features**

1. Click the **"+"** button to enable comparison mode
2. Search and add multiple features
3. View side-by-side compatibility data
4. Make informed decisions on which feature to use

### 4. **Download Reports**

1. After analysis, select format (JSON/PDF/TXT/CSV/DOCX)
2. Click **"Download Analysis"**
3. Share with your team or save for documentation

### 5. **Keyboard Shortcuts**

- `Ctrl + K` (or `Cmd + K`): Quick search
- `Ctrl + H` (or `Cmd + H`): Open help tutorial
- `Enter`: Submit search
- `Escape`: Close dialogs

---

## 🌐 Deployment

### Deploy to Vercel (Frontend)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Abhishekgoyal007/Baseline-Buddy)

1. Click the button above or go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=your_backend_url
   ```
5. Deploy!

### Deploy to Railway (Backend)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Select `backend` directory
4. Add environment variables:
   ```
   GOOGLE_API_KEY=your_gemini_api_key
   FRONTEND_URL=your_vercel_url
   NODE_ENV=production
   ```
5. Deploy!

**Important**: Update frontend's `NEXT_PUBLIC_API_URL` with Railway URL after backend deployment.

---

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
GOOGLE_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Get Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key and add it to your backend `.env` file

---

## 🧪 Available Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Frontend
```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

---

## 🎨 Features in Detail

### 🤖 AI-Powered Explanations
Every feature check includes:
- Browser compatibility status
- Detailed explanation of the feature
- When and why to use it
- Alternative recommendations
- Real-world use cases

### 📊 Code Analyzer
Advanced analysis includes:
- **Feature Detection**: Automatically finds all web features
- **Code Metrics**: Lines of code, complexity score, function count
- **Security Checks**: Identifies potentially unsafe patterns
- **Enhancement Suggestions**: Performance and modern best practices
- **Multi-Language Support**: HTML, CSS, JavaScript, TypeScript, React

### � Smart Autocomplete
Pre-loaded with 30+ popular features:
- CSS: `flexbox`, `grid`, `container-queries`, `aspect-ratio`, `:has`, etc.
- JavaScript: `fetch`, `async-await`, `optional-chaining`, `nullish-coalescing`, etc.
- Web APIs: `intersection-observer`, `resize-observer`, `web-animations`, etc.

### � Progressive Web App (PWA)
- Install on mobile/desktop
- Offline-ready (with service worker)
- Native app experience
- Add to home screen

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting
- Update README if adding new features

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Abhishek Goyal**
- GitHub: [@Abhishekgoyal007](https://github.com/Abhishekgoyal007)
- Repository: [Baseline-Buddy](https://github.com/Abhishekgoyal007/Baseline-Buddy)

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful AI explanations
- **Next.js Team** - For the amazing React framework
- **Vercel** - For seamless deployment
- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For utility-first styling
- **Monaco Editor** - For VS Code-like code editing

---

## 📞 Support

If you have questions or need help:

1. **Check Documentation**: Read this README thoroughly
2. **Open an Issue**: [GitHub Issues](https://github.com/Abhishekgoyal007/Baseline-Buddy/issues)
3. **Contact Form**: Use the contact form on the live site

---

## 🎉 What's Next?

Future features planned:
- [ ] Browser usage statistics
- [ ] Custom baseline configuration
- [ ] Team collaboration features
- [ ] Browser extension
- [ ] VS Code extension
- [ ] CLI tool for CI/CD integration

---

**Made with ❤️ for developers who care about browser compatibility**

⭐ **Star this repo if you find it helpful!**

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/Abhishekgoyal007/Baseline-Buddy?style=social)
![GitHub forks](https://img.shields.io/github/forks/Abhishekgoyal007/Baseline-Buddy?style=social)
![GitHub issues](https://img.shields.io/github/issues/Abhishekgoyal007/Baseline-Buddy)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Abhishekgoyal007/Baseline-Buddy)

---

**🚀 Happy Coding! Check those features and build amazing web experiences!**

## 💻 Local Development

### Quick Setup
```powershell
# Windows
.\setup-dev.ps1

# Linux/Mac
chmod +x setup-dev.sh
./setup-dev.sh
```

### Manual Setup
```bash
# Backend
cd backend
npm install
# Create .env and add GOOGLE_API_KEY
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 🛠 Tech Stack

| Frontend | Backend |
|----------|---------|
| Next.js 15 | Express.js |
| React 19 | Node.js |
| TypeScript | Google Gemini AI |
| Tailwind CSS | web-features |
| Monaco Editor | |

---

## 📁 Project Structure

```
Baseline-Buddy/
├── backend/              # Express.js API
│   ├── src/
│   │   └── index.js      # Main server
│   ├── .env.example      # Environment template
│   └── railway.json      # Railway config
├── frontend/             # Next.js app
│   ├── app/              # Pages & routes
│   ├── components/       # React components
│   ├── .env.example      # Environment template
│   └── vercel.json       # Vercel config
├── DEPLOYMENT.md         # 📖 Full deployment guide
├── READY-TO-DEPLOY.md    # ✅ Quick checklist
└── README.md             # 👈 You are here
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
GOOGLE_API_KEY=your_google_gemini_api_key
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Get API Key:** [Google AI Studio](https://makersuite.google.com/app/apikey)

---

## 📚 API Endpoints

### `POST /check-feature`
Check if a web feature is baseline safe.

**Request:**
```json
{
  "feature": "fetch"
}
```

**Response:**
```json
{
  "feature": "fetch",
  "baselineSafe": true,
  "browsers": ["chrome", "firefox", "safari", "edge"],
  "aiExplanation": "The Fetch API is fully supported..."
}
```

### `POST /analyze-code`
Analyze code for browser compatibility issues.

**Request:**
```json
{
  "code": "const data = fetch('...')",
  "language": "javascript"
}
```

📖 **Full API Docs:** [backend/README.md](./backend/README.md)

---

## 🎯 Use Cases

- ✅ **Before Deployment** - Validate features are baseline safe
- ✅ **Code Review** - Check PRs for compatibility issues
- ✅ **Learning** - Understand browser differences
- ✅ **Decision Making** - Choose safe alternatives

---

## 📖 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [READY-TO-DEPLOY.md](./READY-TO-DEPLOY.md) - Quick deployment checklist
- [RAILWAY-CLI-DEPLOY.md](./RAILWAY-CLI-DEPLOY.md) - CLI deployment method
- [backend/README.md](./backend/README.md) - Backend API documentation

---

## 🐛 Troubleshooting

**CORS Error?**
- Verify `FRONTEND_URL` in Railway matches your Vercel URL exactly

**API Not Working?**
- Check `NEXT_PUBLIC_API_URL` in Vercel points to Railway backend
- Ensure Railway backend is running

**Build Failed?**
- Verify all dependencies in package.json
- Check deployment logs in Vercel/Railway dashboards

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License

---

## 🙏 Credits

- [web.dev Baseline](https://web.dev/baseline) - Browser compatibility data
- [Google Gemini](https://ai.google.dev/) - AI explanations
- [Vercel](https://vercel.com) - Frontend hosting
- [Railway](https://railway.app) - Backend hosting

---

**Made with ❤️ for developers**

*Need help? Check [DEPLOYMENT.md](./DEPLOYMENT.md) or open an issue!*

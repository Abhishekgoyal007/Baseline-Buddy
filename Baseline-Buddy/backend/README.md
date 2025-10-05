# Baseline Buddy Backend

Express.js backend API for Baseline Buddy web feature compatibility checker.

## 🚀 Features

- Web feature compatibility checking using `web-features` library
- AI-powered explanations with Google Gemini
- Code analysis for baseline safety
- RESTful API endpoints
- CORS enabled for frontend integration

## 📦 Installation

```bash
npm install
```

## ⚙️ Configuration

Create a `.env` file in the backend directory:

```env
GOOGLE_API_KEY=your_google_gemini_api_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

## 🏃 Running Locally

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 🌐 API Endpoints

### GET `/`
Health check endpoint

**Response:**
```
Baseline Buddy Backend is running!
```

### POST `/check-feature`
Check if a web feature is baseline safe

**Request Body:**
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

### POST `/analyze-code`
Analyze code for baseline-safe features

**Request Body:**
```json
{
  "code": "const data = fetch('...')",
  "language": "javascript"
}
```

**Response:**
```json
{
  "safe": ["fetch", "const"],
  "caution": [],
  "unsafe": [],
  "explanations": {...},
  "alternatives": {...},
  "lineNumbers": {...},
  "summary": {...},
  "codeAnalysis": {...},
  "enhancements": [...]
}
```

## 🚢 Deployment

### Railway Deployment

1. Push your code to GitHub
2. Connect Railway to your repository
3. Set environment variables in Railway dashboard
4. Railway will auto-deploy

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Google Gemini API key | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port (default: 5000) | No |

## 📚 Dependencies

- **express**: Web framework
- **cors**: CORS middleware
- **dotenv**: Environment variable management
- **web-features**: Browser feature compatibility data
- **@google/generative-ai**: Google Gemini AI integration

## 🛡️ Security

- CORS configured for specific origins
- Environment variables for sensitive data
- Input validation on all endpoints
- Error handling for all routes

## 📝 License

MIT

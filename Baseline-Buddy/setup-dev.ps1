# Baseline Buddy - Local Development Setup Script (PowerShell)

Write-Host "🚀 Setting up Baseline Buddy for local development..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Backend setup
Write-Host "📦 Setting up backend..." -ForegroundColor Yellow
Set-Location backend

if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from template..."
    Copy-Item .env.example .env
    Write-Host "⚠️  Please edit backend\.env and add your GOOGLE_API_KEY" -ForegroundColor Yellow
} else {
    Write-Host "✅ Backend .env already exists" -ForegroundColor Green
}

Write-Host "Installing backend dependencies..."
npm install

Set-Location ..

# Frontend setup
Write-Host ""
Write-Host "📦 Setting up frontend..." -ForegroundColor Yellow
Set-Location frontend

if (-not (Test-Path ".env.local")) {
    Write-Host "Creating .env.local file..."
    "NEXT_PUBLIC_API_URL=http://localhost:5000" | Out-File -FilePath .env.local -Encoding utf8
    Write-Host "✅ Frontend .env.local created" -ForegroundColor Green
} else {
    Write-Host "✅ Frontend .env.local already exists" -ForegroundColor Green
}

Write-Host "Installing frontend dependencies..."
npm install

Set-Location ..

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Add your GOOGLE_API_KEY to backend\.env"
Write-Host "2. Start the backend: cd backend; npm run dev"
Write-Host "3. Start the frontend: cd frontend; npm run dev"
Write-Host ""
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Magenta

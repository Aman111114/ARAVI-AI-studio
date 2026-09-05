ARAVI AI STUDIO — Real Fashion Catalogue Generator
What is this?
A complete, production-ready AI-powered fashion catalogue generator. Upload any dress photo (kurti, saree, lehenga, t-shirt, pant, jeans, lower, suit, anything) and get professional studio-quality photos back.
Features
12 dress types supported (Indian ethnic + Western)
6 professional shoot styles (Studio, Model, Lifestyle, Flatlay, Mannequin)
Drag & drop upload
Real-time AI processing simulation
Credit-based system
Photo gallery with filters
Download & share
Responsive design (Mobile + Desktop)
Tech Stack
Layer
Technology
Frontend
React 18 + Vite + Lucide Icons
Backend
Node.js + Express + MongoDB
AI
Replicate API (Stable Diffusion)
Storage
Cloudinary
Payment
Razorpay
Deploy
Docker + Vercel + Railway
Project Structure
aravi-ai-studio/
├── frontend/           # React app
│   ├── src/
│   │   ├── pages/      # Login, Dashboard, Catalogue, etc.
│   │   ├── components/ # Layout, Sidebar
│   │   ├── api.js      # API service
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   └── nginx.conf
├── backend/            # Node.js API
│   ├── server.js       # Main server
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
└── README.md
Quick Start (5 minutes)
Step 1: Prerequisites
Node.js 18+ installed
MongoDB Atlas account (free)
Step 2: Start Backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm run dev
# Server runs on http://localhost:5000
Step 3: Start Frontend
cd frontend
cp .env.example .env
npm install
npm run dev
# App opens on http://localhost:5173
Step 4: Try it!
Open http://localhost:5173
Register / Login
Select dress type & style
Upload a photo
Click "Generate now"
See results in gallery
Deploy to Production
Frontend → Vercel (Free)
cd frontend
npm install
npm run build
# Install Vercel CLI: npm i -g vercel
vercel --prod
Backend → Railway (Free)
# Install Railway CLI: npm i -g @railway/cli
railway login
railway init
railway up
Or use Docker
docker-compose up --build
Connect Real AI (Replicate)
Sign up at https://replicate.com
Get API token from Account → API Tokens
Add to backend/.env: REPLICATE_API_TOKEN=your_token
In server.js, uncomment the Replicate API call section
Restart backend
Cost
Item
Cost
AI Generation
~Rs.1 per photo
Cloud Storage
Free (25GB)
Server
Free tier
Your selling price
Rs.5 per photo
Profit
~80%
Need Help?
All files are in /mnt/agents/output/aravi-ai-studio/. Download and start building!

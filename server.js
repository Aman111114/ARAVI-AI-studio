require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

// Config
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aravi_ai'

// Connect MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err))

// Models
const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  avatar: String, credits: { type: Number, default: 50 },
  plan: { type: String, default: 'free' }, createdAt: { type: Date, default: Date.now }
})
const PhotoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  originalUrl: String, generatedUrls: [String],
  dressType: String, style: String, name: String,
  downloads: { type: Number, default: 0 }, createdAt: { type: Date, default: Date.now }
})
const CreditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number, type: { type: String, enum: ['debit', 'credit'] },
  reason: String, createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', UserSchema)
const Photo = mongoose.model('Photo', PhotoSchema)
const CreditLog = mongoose.model('CreditLog', CreditLogSchema)

// Auth Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token' })
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch { res.status(401).json({ error: 'Invalid token' }) }
}

// File Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir)
    cb(null, dir)
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

// ========== AUTH ROUTES ==========
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email exists' })
    const hashed = await bcrypt.hash(password, 10)
    const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase()
    const user = await User.create({ name, email, password: hashed, avatar, credits: 50 })
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name, email, credits: 50, avatar } })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !await bcrypt.compare(password, user.password))
      return res.status(400).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email, credits: user.credits, avatar: user.avatar } })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/auth/me', auth, async (req, res) => {
  const user = await User.findById(req.userId).select('-password')
  res.json(user)
})

// ========== PHOTO GENERATION ==========
app.post('/api/generate', auth, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (user.credits < 5) return res.status(400).json({ error: 'Insufficient credits' })

    const { dressType, style } = req.body

    // TODO: Integrate real AI API here (Replicate/Stable Diffusion)
    // For now, return mock generated URLs
    const generatedUrls = [
      `https://picsum.photos/seed/${Date.now()}a/512/768`,
      `https://picsum.photos/seed/${Date.now()}b/512/768`,
      `https://picsum.photos/seed/${Date.now()}c/512/768`,
      `https://picsum.photos/seed/${Date.now()}d/512/768`,
    ]

    user.credits -= 5
    await user.save()
    await CreditLog.create({ userId: user._id, amount: 5, type: 'debit', reason: 'Photo generation' })

    const photo = await Photo.create({
      userId: user._id, originalUrl: `/uploads/${req.file.filename}`,
      generatedUrls, dressType, style,
      name: `${dressType.charAt(0).toUpperCase() + dressType.slice(1)} Photo`
    })

    fs.unlinkSync(req.file.path)

    res.json({ success: true, photo: { id: photo._id, name: photo.name, dressType, style, images: generatedUrls, creditsLeft: user.credits } })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/photos', auth, async (req, res) => {
  const photos = await Photo.find({ userId: req.userId }).sort({ createdAt: -1 })
  res.json(photos)
})

app.delete('/api/photos/:id', auth, async (req, res) => {
  await Photo.findOneAndDelete({ _id: req.params.id, userId: req.userId })
  res.json({ success: true })
})

app.post('/api/photos/:id/download', auth, async (req, res) => {
  const photo = await Photo.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { $inc: { downloads: 1 } }, { new: true }
  )
  res.json({ downloads: photo.downloads })
})

// ========== CREDITS ==========
app.get('/api/credits', auth, async (req, res) => {
  const user = await User.findById(req.userId)
  const logs = await CreditLog.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(20)
  res.json({ credits: user.credits, logs })
})

app.post('/api/credits/buy', auth, async (req, res) => {
  const { amount } = req.body
  const user = await User.findById(req.userId)
  user.credits += parseInt(amount)
  await user.save()
  await CreditLog.create({ userId: user._id, amount: parseInt(amount), type: 'credit', reason: `Purchased ${amount} credits` })
  res.json({ success: true, credits: user.credits })
})

// ========== STATS ==========
app.get('/api/stats', auth, async (req, res) => {
  const user = await User.findById(req.userId)
  const totalPhotos = await Photo.countDocuments({ userId: req.userId })
  res.json({ credits: user.credits, photos: totalPhotos * 4, items: totalPhotos, plan: user.plan })
})

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))
// Static Files Serve करने के लिए
const path = require('path');
app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Aravi AI Studio API running on http://localhost:${PORT}`)
  console.log(`📁 API Endpoints:`)
  console.log(`   POST /api/auth/register  - Register new user`)  
  console.log(`   POST /api/auth/login     - Login`)
  console.log(`   POST /api/generate       - Generate AI photos (auth + multipart)`)
  console.log(`   GET  /api/photos         - Get all photos`)
  console.log(`   GET  /api/credits        - Get credit balance`)
  console.log(`   GET  /api/stats          - Get dashboard stats\n`)
})

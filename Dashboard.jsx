import { useState, useEffect, useCallback } from 'react'
import { Upload, Download, Share2, Trash2, Camera, Sparkles, Zap } from 'lucide-react'
import { photoAPI, statsAPI } from '../api'

const DRESS_TYPES = [
  { type: 'kurti', emoji: '👘', label: 'Kurti' },
  { type: 'saree', emoji: '🥻', label: 'Saree' },
  { type: 'lehenga', emoji: '👗', label: 'Lehenga' },
  { type: 'tshirt', emoji: '👕', label: 'T-shirt' },
  { type: 'shirt', emoji: '👔', label: 'Shirt' },
  { type: 'pant', emoji: '👖', label: 'Pant' },
  { type: 'jeans', emoji: '🩳', label: 'Jeans' },
  { type: 'lower', emoji: '🩲', label: 'Lower' },
  { type: 'suit', emoji: '🤵', label: 'Suit' },
  { type: 'dress', emoji: '👗', label: 'Dress' },
  { type: 'jacket', emoji: '🧥', label: 'Jacket' },
  { type: 'other', emoji: '✨', label: 'Other' },
]

const STYLES = [
  { id: 'studio-white', emoji: '⬜', name: 'Studio White', desc: 'Clean white background' },
  { id: 'studio-grey', emoji: '🔲', name: 'Studio Grey', desc: 'Neutral grey backdrop' },
  { id: 'model', emoji: '👤', name: 'Model Shoot', desc: 'Real model wearing it' },
  { id: 'lifestyle', emoji: '🏠', name: 'Lifestyle', desc: 'Real world setting' },
  { id: 'flatlay', emoji: '📐', name: 'Flatlay', desc: 'Top-down arrangement' },
  { id: 'mannequin', emoji: '🪆', name: 'Mannequin', desc: 'Invisible mannequin' },
]

export default function Dashboard({ user, setUser }) {
  const [selectedDress, setSelectedDress] = useState('kurti')
  const [selectedStyle, setSelectedStyle] = useState('studio-white')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [photos, setPhotos] = useState([])
  const [stats, setStats] = useState({ photos: 0, items: 0, credits: user?.credits || 0 })
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState(null)

  useEffect(() => { loadPhotos(); loadStats() }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadPhotos = async () => {
    try {
      const { data } = await photoAPI.getAll()
      setPhotos(data)
    } catch (e) { console.error(e) }
  }

  const loadStats = async () => {
    try {
      const { data } = await statsAPI.getStats()
      setStats(data)
      setUser(prev => ({ ...prev, credits: data.credits }))
    } catch (e) { console.error(e) }
  }

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) { showToast('Please upload an image', 'error'); return }
    if (file.size > 10 * 1024 * 1024) { showToast('Max 10MB', 'error'); return }
    setUploadedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0])
  }, [])

  const startGeneration = async () => {
    if (!uploadedFile) { showToast('Upload a photo first', 'error'); return }
    if (stats.credits < 5) { showToast('Not enough credits!', 'error'); return }

    setGenerating(true)
    setProgress(0)

    const steps = [10, 25, 45, 65, 80, 100]
    steps.forEach((p, i) => setTimeout(() => setProgress(p), i * 600))

    try {
      const formData = new FormData()
      formData.append('image', uploadedFile)
      formData.append('dressType', selectedDress)
      formData.append('style', selectedStyle)

      const { data } = await photoAPI.generate(formData)
      showToast('Generated 4 professional variants!')
      setStats(prev => ({ ...prev, credits: data.creditsLeft, photos: prev.photos + 4, items: prev.items + 1 }))
      setUser(prev => ({ ...prev, credits: data.creditsLeft }))
      loadPhotos()

      setUploadedFile(null)
      setPreviewUrl('')
    } catch (err) {
      showToast(err.response?.data?.error || 'Generation failed', 'error')
    }
    setGenerating(false)
    setProgress(0)
  }

  const handleDelete = async (id) => {
    try { await photoAPI.delete(id); loadPhotos(); showToast('Deleted') }
    catch (e) { showToast('Delete failed', 'error') }
  }

  const filteredPhotos = filter === 'all' ? photos : photos.filter(p => p.dressType === filter)

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 10000,
          padding: '14px 20px', background: toast.type === 'error' ? 'var(--danger)' : 'var(--success)',
          color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 500,
          animation: 'slideIn 0.3s ease', boxShadow: 'var(--shadow-lg)'
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600 }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 2 }}>Transform any dress photo into a professional catalogue shoot</p>
        </div>
        <button style={{ padding: '10px 18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Camera size={16} /> New shoot
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { icon: '📸', label: 'Photos generated', value: stats.photos, delta: '+12%', up: true, bg: '#f3e8ff' },
          { icon: '👗', label: 'Catalogue items', value: stats.items, delta: '+5 new', up: true, bg: '#dbeafe' },
          { icon: '⚡', label: 'Credits remaining', value: stats.credits, delta: '-28 today', up: false, bg: '#dcfce7' },
          { icon: '⏱️', label: 'Avg. generation', value: '4.2s', delta: '-0.8s', up: true, bg: '#ffedd5' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 20, transition: 'all 0.2s' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, fontSize: 18 }}>{s.icon}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div style={{ fontSize: 12, marginTop: 6, fontWeight: 500, color: s.up ? 'var(--success)' : 'var(--danger)' }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Upload Card */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 32, marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Create new photoshoot</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Upload any dress photo — kurti, saree, lehenga, t-shirt, pant, jeans, lower, suit, anything</p>

        {/* Dress Types */}
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#555' }}>Select dress type</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {DRESS_TYPES.map(d => (
            <button key={d.type} onClick={() => setSelectedDress(d.type)}
              style={{
                padding: '8px 16px', borderRadius: 100, border: '1.5px solid',
                borderColor: selectedDress === d.type ? 'var(--primary)' : 'var(--border)',
                background: selectedDress === d.type ? 'var(--primary)' : '#fff',
                color: selectedDress === d.type ? '#fff' : '#555', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}>
              <span style={{ fontSize: 16 }}>{d.emoji}</span>{d.label}
            </button>
          ))}
        </div>

        {/* Styles */}
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#555' }}>Choose shoot style</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {STYLES.map(s => (
            <button key={s.id} onClick={() => setSelectedStyle(s.id)}
              style={{
                border: '1.5px solid', borderRadius: 12, padding: 16, cursor: 'pointer',
                borderColor: selectedStyle === s.id ? 'var(--primary)' : 'var(--border)',
                background: selectedStyle === s.id ? '#fafafa' : '#fff', textAlign: 'center'
              }}>
              <div style={{ width: '100%', aspectRatio: '4/3', background: '#f0f0f0', borderRadius: 8, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>{s.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.desc}</div>
            </button>
          ))}
        </div>

        {/* Upload Zone */}
        {!previewUrl ? (
          <div onClick={() => document.getElementById('fileInput').click()}
            onDrop={handleDrop} onDragOver={e => e.preventDefault()}
            style={{
              border: '2px dashed #d0d0d0', borderRadius: 16, padding: '48px 32px',
              textAlign: 'center', cursor: 'pointer', background: '#fafafa', transition: 'all 0.25s'
            }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📤</div>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Drop your dress photo here</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>or click to browse — JPG, PNG, WEBP up to 10MB</div>
          </div>
        ) : (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#555' }}>Original photo</div>
            <img src={previewUrl} alt="Preview" style={{ maxHeight: 200, borderRadius: 12, border: '1px solid var(--border)' }} />
          </div>
        )}
        <input type="file" id="fileInput" style={{ display: 'none' }} accept="image/*"
          onChange={e => e.target.files.length && handleFile(e.target.files[0])} />

        {/* Generate Bar */}
        {previewUrl && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#f5f5f5', borderRadius: 12, marginTop: 20 }}>
            <div style={{ fontSize: 13, color: '#555' }}>This will generate <strong>4 professional variants</strong> using <strong>5 credits</strong></div>
            <button onClick={startGeneration} disabled={generating}
              style={{ padding: '12px 28px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: generating ? 'not-allowed' : 'pointer', opacity: generating ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} />
              {generating ? `Generating ${progress}%...` : 'Generate now'}
            </button>
          </div>
        )}
      </div>

      {/* Processing Overlay */}
      {generating && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)'
        }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center', maxWidth: 420, width: '90%' }}>
            <div style={{ width: 64, height: 64, border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.9s linear infinite', margin: '0 auto 24px' }}></div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>AI is creating your shoot...</div>
            <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>Transforming into professional catalogue photos</div>
            <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--primary)', borderRadius: 3, width: `${progress}%`, transition: 'width 0.4s ease' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>Recent generations</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'kurti', 'saree', 'tshirt', 'pant'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px', borderRadius: 100, border: '1px solid',
                borderColor: filter === f ? 'var(--primary)' : 'var(--border)',
                background: filter === f ? 'var(--primary)' : '#fff',
                color: filter === f ? '#fff' : '#555', fontSize: 12, fontWeight: 500, cursor: 'pointer'
              }}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {filteredPhotos.map(photo => (
          <div key={photo._id || photo.id} style={{
            background: '#fff', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden',
            transition: 'all 0.25s', cursor: 'pointer', position: 'relative'
          }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ width: '100%', aspectRatio: '3/4', background: '#f5f5f5', position: 'relative', overflow: 'hidden' }}>
              {photo.generatedUrls?.[0] ? (
                <img src={photo.generatedUrls[0]} alt={photo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>
                  {DRESS_TYPES.find(d => d.type === photo.dressType)?.emoji || '👗'}
                </div>
              )}
              <span style={{ position: 'absolute', top: 10, right: 10, padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: 'var(--primary)', color: '#fff' }}>{photo.style}</span>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{photo.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{photo.dressType}</span>
                <span>{photo.downloads} downloads</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

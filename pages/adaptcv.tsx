import { useState } from 'react'
import { ArrowLeft, Lock } from 'lucide-react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

export default function AdaptPage() {
  const [jobText, setJobText] = useState('')
  const [cvText, setCvText] = useState('')
  const [loading, setLoading] = useState(false)
  const [adaptedCV, setAdaptedCV] = useState('rewtttttttttttt')
  const [unlocked, setUnlocked] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAdaptedCV('')
    setUnlocked(false)

    try {
      const res = await fetch('http://localhost:8000/adapt-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_text: jobText, cv_text: cvText }),
      })

      const data = await res.json()
      setAdaptedCV(data.cv)
    } catch (err) {
      console.error('Грешка при заявката:', err)
      alert('Възникна грешка при адаптиране. Опитай пак.')
    } finally {
      setLoading(false)
    }
  }

  const handleUnlock = () => {
    // TODO: Replace with real payment logic
    setUnlocked(true)
  }

  // Calculate preview text length (20%)
  const previewLength = Math.floor(adaptedCV.length * 0.2)
  const previewText = adaptedCV.slice(0, previewLength)
  const hiddenText = adaptedCV.slice(previewLength)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white px-6 py-10">
      <button
        onClick={() => router.push('/')}
        className="cursor-pointer mb-6 flex items-center text-cyan-600 hover:text-cyan-800 transition"
      >
        <ArrowLeft className="mr-2" /> Обратно
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto border border-cyan-100">
        <h1 className="text-4xl font-extrabold text-center text-cyan-700 mb-8">
          Адаптирай своето CV
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-cyan-800">Обява за работа</label>
            <textarea
              className="text-gray-900 w-full border border-cyan-200 rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-cyan-300"
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Постави текста на обявата тук..."
              required
              draggable={false}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-cyan-800">Твоето CV</label>
            <textarea
              className="text-gray-900 w-full border border-cyan-200 rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-cyan-300"
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Постави съдържанието на своето CV..."
              required
              draggable={false}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-xl transition shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Адаптира се...' : 'Адаптирай CV'}
          </motion.button>
        </form>

        {adaptedCV && (
          <div className="relative mt-10 p-6 bg-cyan-50 border border-cyan-200 rounded-2xl shadow-inner font-mono text-gray-800 text-sm leading-relaxed min-h-[200px]">
            {/* Show preview + blurred hidden text */}
            <pre className="whitespace-pre-wrap">
              {previewText}
              <span
                className={`inline-block text-transparent select-none ${
                  unlocked ? 'blur-none' : 'blur-sm'
                }`}
                style={{ userSelect: unlocked ? 'text' : 'none' }}
              >
                {hiddenText}
              </span>
            </pre>

            {/* Paywall overlay */}
            {!unlocked && (
              <div
                onClick={handleUnlock}
                className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-2xl flex flex-col justify-center items-center cursor-pointer select-none px-6"
              >
                <Lock className="text-cyan-600 mb-4" size={48} />
                <p className="mb-4 text-cyan-700 font-semibold text-xl text-center">
                  Отключи пълния резултат за <strong>1.99 BGN</strong>
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnlock()
                  }}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg font-semibold transition cursor-pointer"
                >
                  Отключи сега
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

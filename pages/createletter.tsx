import { useState } from 'react'
import {  Lock } from 'lucide-react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import NavBar from '@/components/NavBar'
export default function CreatePage() {
  const { data: session } = useSession()
  const [jobText, setJobText] = useState('')
  const [cvText, setCvText] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState(
    'Motivational letters are typically submitted alongside your CV or resume. Unlike a cover letter, which gives practical examples of how your skills and experience match the opening, a motivational letter focuses more on your personality, interests, and motivation to apply'
  )
  const [unlocked, setUnlocked] = useState(false)
  const [useJobAd, setUseJobAd] = useState(true)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGeneratedLetter('')
    setUnlocked(false)

    try {
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': session?.user?.email || '',
        },
        body: JSON.stringify({
          job_text: useJobAd ? jobText : '',
          cv_text: cvText,
        }),
      })

      const data = await res.json()
      setGeneratedLetter(data.letter || data.error || '')
    } catch (err) {
      console.error('Грешка при заявката:', err)
      alert('Възникна грешка при генериране. Опитай пак.')
    } finally {
      setLoading(false)
    }
  }

  const handleUnlock = () => {
    setUnlocked(true)
  }

  return (
    <>
    <NavBar />
    <div className="pt-18 min-h-screen bg-gradient-to-br from-cyan-50 to-white px-6 py-10">

      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto border border-cyan-100">
        <h1 className="text-4xl font-extrabold text-center text-cyan-700 mb-8">
          Генерирай впечатляващо мотивационно писмо
        </h1>

        <div className="flex items-center justify-center mb-6">
          <span className="text-cyan-800 font-semibold mr-4">
            Адаптирай писмото към определена обява за работа
          </span>
          <div
            onClick={() => setUseJobAd(!useJobAd)}
            className={`w-16 h-9 flex items-center px-1 rounded-full cursor-pointer transition-colors duration-300 ${
              useJobAd ? 'bg-cyan-600' : 'bg-gray-300'
            }`}
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 700, damping: 30 }}
              className="w-7 h-7 rounded-full bg-white shadow-md ring-1 ring-black/10"
              animate={{
                x: useJobAd ? 28 : 0,
                boxShadow: useJobAd
                  ? '0 0 0 6px rgba(34,211,238,0.5)'
                  : '0 0 0 2px rgba(156,163,175,0.4)',
              }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div layout className="space-y-6">
            <AnimatePresence>
              {useJobAd && (
                <motion.div
                  key="jobfield"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: -20,
                    transition: { type: 'spring', stiffness: 700, damping: 30 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <label className="block font-semibold mb-2 text-cyan-800">Обява за работа</label>
                  <textarea
                    className="text-gray-900 w-full border border-cyan-200 rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    value={jobText}
                    onChange={(e) => setJobText(e.target.value)}
                    placeholder="Постави текста на обявата тук..."
                    required={useJobAd}
                    draggable={false}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div layout>
              <label className="block font-semibold mb-2 text-cyan-800">Твоето CV</label>
              <textarea
                className="text-gray-900 w-full border border-cyan-200 rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-cyan-300"
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Постави съдържанието на своето CV..."
                required
                draggable={false}
              />
            </motion.div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-xl transition shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Генерира се...' : 'Генерирай писмо'}
          </motion.button>
        </form>

        {generatedLetter && (
          <div className="relative mt-10 p-6 bg-cyan-50 border border-cyan-200 rounded-2xl shadow-inner font-mono text-gray-800 text-sm leading-relaxed min-h-[200px] flex items-center justify-center overflow-auto">
            {!unlocked ? (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-2xl flex flex-col justify-center items-center px-6 py-10 text-center space-y-5 select-none">
                <Lock className="text-cyan-600" size={40} />
                <h2 className="text-xl font-semibold text-cyan-800">Резултатът е готов</h2>
                <p className="text-gray-600 max-w-md text-sm">
                  Впечатляващо мотивационно писмо, персонализирано спрямо твоя опит и обявата за работа. Отключи го и го използвай веднага.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button
                    onClick={handleUnlock}
                    className="cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition"
                  >
                    Отключи за 1.49 лв
                  </button>
                  <button
                    onClick={() => router.push('/#pricing')}
                    className="cursor-pointer text-cyan-700 hover:underline text-sm font-medium"
                  >
                    Виж всички планове
                  </button>
                </div>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap">{generatedLetter}</pre>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  )
}

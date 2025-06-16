import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

export default function AdaptPage() {
  const { data: session } = useSession()
  const [jobText, setJobText] = useState('')
  const [cvText, setCvText] = useState('')
  const [loading, setLoading] = useState(false)
  const [adaptedCV, setAdaptedCV] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAdaptedCV('')
    setUnlocked(false)

    try {
      const res = await fetch('https://vpechatli-api.onrender.com/adapt-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': session?.user?.email || '',
        },
        body: JSON.stringify({ job_text: jobText, cv_text: cvText }),
      })

      const data = await res.json()
      const content = data.cv || data.error || ''

      if (!content.trim().toUpperCase().startsWith('YES')) {
        alert('Въведената обява е твърде обща или неподходяща. Моля, опитай с по-конкретен текст.')
        return
      }

      setAdaptedCV(content)
    } catch (err) {
      console.error('Грешка при заявката:', err)
      alert('Възникна грешка при адаптиране. Опитай пак.')
    } finally {
      setLoading(false)
    }
  }

  const handleUnlock = () => {
    // TODO: Replace with payment logic or session check
    // Example: Redirect to payment then unlock on return
    router.push('/checkout')
  }

  return (
    <>
      <Head>
        <title>Vpechatli.tech – AI Мотивационни писма и CV</title>
        <meta name="description" content="Създай мотивационно писмо и адаптира CV за конкретна обява с помощта на AI." />
        <meta property="og:title" content="Vpechatli.tech – AI Мотивационни писма и CV" />
        <meta property="og:description" content="AI инструмент за персонализиране на документи за работа." />
        <meta property="og:image" content="/og-image.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta charSet="UTF-8" />
      </Head>

      <NavBar />

      <div className="pt-18 min-h-screen bg-gradient-to-br from-cyan-50 to-white px-6 py-10">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto border border-cyan-100">
          <h1 className="text-4xl font-extrabold text-center text-cyan-700 mb-8">
            Адаптирай своето CV
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div layout className="space-y-6">
              <AnimatePresence>
                <motion.div
                  key="jobfield"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <label className="block font-semibold mb-2 text-cyan-800">Обява за работа</label>
                  <textarea
                    className="text-gray-900 w-full border border-cyan-200 rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    value={jobText}
                    onChange={(e) => setJobText(e.target.value)}
                    placeholder="Постави текста на обявата тук..."
                    required
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>

              <motion.div
                key="cvfield"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
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
              {loading ? 'Адаптира се...' : 'Адаптирай CV'}
            </motion.button>
          </form>

          {adaptedCV && (
            <div className="relative mt-10 p-6 bg-cyan-50 border border-cyan-200 rounded-2xl shadow-inner font-mono text-gray-800 text-sm leading-relaxed min-h-[200px] overflow-hidden">
              {!unlocked ? (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-2xl flex flex-col px-6 py-8 text-center space-y-5 select-none overflow-y-auto max-h-full">
                  <div className="flex flex-col items-center space-y-4">
                    <h2 className="text-xl font-semibold text-cyan-800">Резултатът е готов</h2>
                    <p className="text-gray-600 max-w-md text-sm">
                      Адаптирано CV, съобразено с конкретната обява. Отключи го и го използвай веднага.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      <button
                        onClick={handleUnlock}
                        className="cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition"
                      >
                        Отключи за 2.49 лв
                      </button>
                      <button
                        onClick={() => router.push('/#pricing')}
                        className="cursor-pointer text-cyan-700 hover:underline text-sm font-medium"
                      >
                        Виж всички планове
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap">
                  {adaptedCV.replace(/^YES\s*/i, '')}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import Head from 'next/head'

export default function CreatePage() {
  const { data: session } = useSession()
  const [jobText, setJobText] = useState('')
  const [cvText, setCvText] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [useJobAd, setUseJobAd] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [eligible, setEligible] = useState(false)
  const [checkingEligibility, setCheckingEligibility] = useState(true)

  const router = useRouter()

  // Check user access via secure API route
  useEffect(() => {
    const checkEligibility = async () => {
      if (!session?.user?.email) {
        setEligible(false)
        setUnlocked(false)
        setCheckingEligibility(false)
        return
      }

      try {
        // ✅ INIT USER IN FIRESTORE (first-time setup or missing fields)
        const initResponse = await fetch('/api/auth/post-login-init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: session.user.email }),
        })

        if (!initResponse.ok) {
          throw new Error('Failed to initialize user in Firestore')
        }

        // ✅ CHECK ACCESS (e.g. usageCount and subscriptionActive)
        const accessRes = await fetch('/api/check-access', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.user.email}`,
          },
        })

        if (!accessRes.ok) {
          setEligible(false)
          setUnlocked(false)
          return
        }

        const data = await accessRes.json()

        // Unlock if usageCount < 1 OR subscriptionActive === true
        if ((data.usageCount !== undefined && data.usageCount < 1) || data.subscriptionActive === true) {
          setEligible(true)
          setUnlocked(true)
        } else if (data.unlocked) {
          setEligible(true)
          setUnlocked(true)
        } else {
          setEligible(false)
          setUnlocked(false)
        }
      } catch (error) {
        console.error('Error checking access:', error)
        setEligible(false)
        setUnlocked(false)
      } finally {
        setCheckingEligibility(false)
      }
    }

    checkEligibility()
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGeneratedLetter('')
    setUnlocked(false)

    try {
      const endpoint = useJobAd ? 'adapt-cv' : 'generate'
      const res = await fetch(`https://vpechatli-api.onrender.com/${endpoint}`, {
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
      const content = useJobAd ? data.cv : data.letter || data.error || ''

      if (!content.trim().toUpperCase().startsWith('YES')) {
        alert('Въведената обява не е достатъчно информативна. Моля, опитай с по-конкретен текст.')
        setGeneratedLetter('')
        return
      }

      setGeneratedLetter(content)
      // Note: unlocked state depends on eligibility and payment
    } catch (err) {
      console.error('Грешка при заявката:', err)
      alert('Възникна грешка при генериране. Опитай пак.')
    } finally {
      setLoading(false)
    }
  }

  const handleUnlock = () => {
    // Normally triggers payment, here just unlock UI
    setUnlocked(true)
  }

  return (
    <>
      <Head>
        <title>Vpechatli.tech – AI Мотивационни писма и CV</title>
        <meta
          name="description"
          content="Създай мотивационно писмо и адаптирай CV за конкретна обява с помощта на AI."
        />
        <meta property="og:title" content="Vpechatli.tech – AI Мотивационни писма и CV" />
        <meta
          property="og:description"
          content="AI инструмент за персонализиране на документи за работа."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta charSet="UTF-8" />
      </Head>

      <NavBar />

      <div className="pt-18 min-h-screen bg-gradient-to-br from-cyan-50 to-white px-6 py-10">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto border border-cyan-100">
          <h1 className="text-4xl font-extrabold text-center text-cyan-700 mb-8">
            Генерирай впечатляващо мотивационно писмо
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <span className="text-cyan-800 font-semibold text-center sm:text-left">
              Адаптирай писмото към определена обява за работа
            </span>

            <button
              onClick={() => setUseJobAd(!useJobAd)}
              type="button"
              role="switch"
              aria-checked={useJobAd}
              className={`cursor-pointer relative w-14 h-8 transition-colors rounded-full p-1 flex items-center ${
                useJobAd ? 'bg-cyan-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  useJobAd ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
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
            <div className="relative mt-10 p-6 bg-cyan-50 border border-cyan-200 rounded-2xl shadow-inner font-mono text-gray-800 text-sm leading-relaxed min-h-[200px] overflow-hidden">
              {!unlocked && !checkingEligibility ? (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-2xl flex flex-col px-6 py-8 text-center space-y-5 select-none overflow-y-auto max-h-full">
                  <div className="flex flex-col items-center space-y-4">
                    <h2 className="text-xl font-semibold text-cyan-800">Резултатът е готов</h2>
                    <p className="text-gray-600 max-w-md text-sm">
                      Впечатляващо мотивационно писмо, персонализирано спрямо твоя опит и обявата за работа. Отключи го и го използвай веднага.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      <button
                        onClick={handleUnlock}
                        className="cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition"
                      >
                        Отключи за 1.99 лв
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
                <pre className="whitespace-pre-wrap">{generatedLetter.replace(/^YES\s*/i, '')}</pre>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

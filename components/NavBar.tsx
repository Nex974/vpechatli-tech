'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all ${
        isScrolled ? 'bg-white/80 shadow-md backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-2xl font-extrabold text-cyan-700 tracking-tight">
            vpechatli<span className="text-cyan-500">.tech</span>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/createletter"
            className="text-cyan-700 font-medium hover:text-cyan-900 transition"
          >
            Мотивационно писмо
          </Link>
          <Link
            href="/adaptcv"
            className="text-cyan-700 font-medium hover:text-cyan-900 transition"
          >
            Адаптиране на CV
          </Link>
          <Link
            href="/#pricing"
            className="text-cyan-700 font-medium hover:text-cyan-900 transition"
          >
            Цени
          </Link>

          {session ? (
            <button
              onClick={() => signOut()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Изход ({session.user?.name?.split(' ')[0]})
            </button>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Вход
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-cyan-700">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-md border-t border-cyan-100 px-4 pb-6 pt-2"
          >
            <div className="flex flex-col space-y-4">
              <Link
                href="/createletter"
                className="text-cyan-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Мотивационно писмо
              </Link>
              <Link
                href="/adaptcv"
                className="text-cyan-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Адаптиране на CV
              </Link>
              <Link
                href="/#pricing"
                className="text-cyan-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Цени
              </Link>
              {session ? (
                <button
                  onClick={() => {
                    setIsOpen(false)
                    signOut()
                  }}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Изход ({session.user?.name?.split(' ')[0]})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false)
                    signIn('google')
                  }}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Вход
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

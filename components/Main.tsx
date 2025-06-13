import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Main() {
  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-12 bg-gradient-to-b from-white to-cyan-50">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-cyan-700 mb-6 leading-snug sm:leading-tight drop-shadow-sm">
            Персонализирай CV-то и мотивационното си писмо с помощта на AI
          </h1>

          <p className="text-base sm:text-lg text-gray-700 mb-10 max-w-md sm:max-w-xl mx-auto">
            Просто постави текста на обявата за работа и своето CV — ние ще създадем впечатляващи материали, съобразени изцяло с изискванията на позицията.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/createletter" passHref>
                <button
                  className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg text-base sm:text-lg font-semibold shadow-md transition"
                  type="button"
                >
                  Генерирай мотивационно писмо
                </button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/adaptcv" passHref>
                <button
                  className="w-full sm:w-auto bg-white text-cyan-700 border border-cyan-600 hover:bg-cyan-50 px-6 py-3 rounded-lg text-base sm:text-lg font-semibold shadow-sm transition"
                  type="button"
                >
                  Адаптирай CV за конкретна обява
                </button>
              </Link>
            </motion.div>
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-gray-500 font-medium tracking-wide">
          Автоматизирано. Персонализирано. Убедително.
          <br />
          Направи крачката напред в кариерата си.
        </p>
      </div>

      <section className="bg-white py-16 px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-center text-cyan-700 mb-14 drop-shadow-sm">
          Как работи?
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12">
          {[
            {
              title: '1. Постави обявата',
              description: 'Копирай текста от работната обява, която те интересува.',
              delay: 0,
            },
            {
              title: '2. Добави своето CV',
              description: 'Въведи или постави своя автобиография в текстов формат.',
              delay: 0.2,
            },
            {
              title: '3. Получи резултата',
              description: 'Нашият AI ще ти предложи адаптирано CV и/или мотивационно писмо за конкретната позиция.',
              delay: 0.4,
            },
          ].map(({ title, description, delay }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay }}
              viewport={{ once: true }}
              className="bg-cyan-50 p-6 rounded-xl shadow-md text-center"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-cyan-700 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/createletter" passHref>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg text-base sm:text-lg font-semibold shadow-md transition"
              type="button"
            >
              Начало
            </motion.button>
          </Link>
        </div>
      </section>
      
<motion.div
  initial={{ opacity: 0, scaleX: 0.4 }}
  whileInView={{ opacity: 1, scaleX: 1 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="w-full py-8 flex justify-center bg-gradient-to-r from-transparent via-cyan-100 to-transparent"
>
  <div className="h-px w-3/4 bg-cyan-100"></div>
</motion.div>

  <section className="bg-white py-20 px-6">
    <h2 className="text-3xl font-bold text-center text-cyan-700 mb-4 drop-shadow-sm">
      Избери своя план
    </h2>
    <p className="text-center text-gray-600 mb-12 text-lg">
      Прозрачни и достъпни цени – без абонаменти, ако не желаеш.
    </p>

    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          title: 'Мотивационно писмо',
          promo: '1.99 лв',
          original: '2.99 лв',
          features: ['Генериране с AI', 'Персонализирано по обявата', 'Еднократна такса'],
        },
        {
          title: 'Адаптиране на CV',
          promo: '2.49 лв',
          original: '3.99 лв',
          features: ['Анализ на обявата', 'Оптимизация на CV', 'Еднократна такса'],
        },
        {
          title: 'Неограничен достъп (30 дни)',
          promo: '7.99 лв',
          original: '14.99 лв',
          features: ['Без лимит', 'Мотивационни писма + CV', 'Приоритетна поддръжка'],
          highlight: true,
        },
      ].map(({ title, promo, original, features, highlight }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          viewport={{ once: true }}
          className={`rounded-2xl p-6 shadow-md text-center ${
            highlight ? 'bg-cyan-600 text-white border-2 border-cyan-700 scale-105' : 'bg-white'
          }`}
        >
          <h3 className={`text-xl font-bold mb-2 ${highlight ? 'text-white' : 'text-cyan-700'}`}>
            {title}
          </h3>
          <p className={`text-3xl font-extrabold ${highlight ? 'text-white' : 'text-cyan-700'}`}>
            {promo}{' '}
            <span className={`${highlight ? 'text-cyan-200' : 'text-gray-400'} text-base font-normal line-through ml-2`}>{original}</span>
          </p>
          <ul className={`mt-6 mb-6 space-y-2 text-sm ${highlight ? 'text-cyan-100' : 'text-gray-600'}`}>
            {features.map((f, i) => (
              <li key={i}>✓ {f}</li>
            ))}
          </ul>
          <button
            type="button"
            className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
              highlight
                ? 'bg-white text-cyan-700 hover:bg-gray-100'
                : 'bg-cyan-600 text-white hover:bg-cyan-700'
            }`}
          >
            Започни сега
          </button>
        </motion.div>
      ))}
    </div>
  </section>
    </>
  )
}

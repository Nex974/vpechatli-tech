import Link from 'next/link'

export default function Footer() {
    return (
      <footer className="bg-cyan-600 text-white py-10 px-6">
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
    <div>
      <h4 className="font-semibold text-lg mb-2">Vpechatli.tech</h4>
      <p className="text-sm">AI решения за автобиографии и мотивационни писма.</p>
    </div>
    <div>
      <h4 className="font-semibold text-lg mb-2">Навигация</h4>
      <ul className="text-sm space-y-1">
        <li><Link href="/terms">Условия за ползване</Link></li>
        <li><Link href="/privacy">Политика за поверителност</Link></li>
      </ul>
    </div>
    <div>
      <h4 className="font-semibold text-lg mb-2">Контакт</h4>
      <p className="text-sm">vpechatli.tech@gmail.com</p>
    </div>
  </div>
</footer>
    )
  }
  
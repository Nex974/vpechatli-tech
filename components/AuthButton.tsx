import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function AuthButton() {
  const { data: session } = useSession()

  return session ? (
    <div className="flex items-center gap-3">
      <span className="text-white">Здравей, {session.user?.name}</span>
      <button
        onClick={() => signOut()}
        className="bg-cyan-600 text-white px-4 py-1 rounded hover:bg-cyan-700"
      >
        Изход
      </button>
    </div>
  ) : (
    <Link
      href="/login"
      className="bg-cyan-600 text-white px-4 py-1 rounded hover:bg-cyan-700"
    >
      Вход
    </Link>
  )
}

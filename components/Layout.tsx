import NavBar from './NavBar'
import Main from './Main'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 light">
      <NavBar />
      <Main />
      <Footer />
    </div>
  )
}

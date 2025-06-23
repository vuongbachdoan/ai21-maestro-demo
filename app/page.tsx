import Header from "./components/header"
import HeroBanner from "./components/hero-banner"
import ProductGrid from "./components/product-grid"
import ChatAssistant from "./components/chat-assistant"
import Footer from "./components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Header />
      <main>
        <HeroBanner />
        <ProductGrid />
      </main>
      <Footer />
      <ChatAssistant />
    </div>
  )
}

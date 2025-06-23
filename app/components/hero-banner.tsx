export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 opacity-90"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>

      <div className="relative min-h-[500px] flex items-center justify-center px-4">
        <div className="text-center text-white z-10 max-w-4xl mx-auto">
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
              ✨ New Collection Available
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="block">Discover Your</span>
            <span className="block bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Perfect Style
            </span>
          </h2>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90 leading-relaxed">
            Explore our curated collection of premium fashion pieces designed for the modern lifestyle
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-300/20 rounded-full blur-xl"></div>
    </section>
  )
}

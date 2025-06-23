import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="relative mt-20">
      <div className="absolute inset-0 bg-black"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

      <div className="relative text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                StyleHub
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Your premier destination for modern fashion and timeless style. Discover quality clothing that fits your
                lifestyle.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all hover:scale-110"
                >
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all hover:scale-110"
                >
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all hover:scale-110"
                >
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all hover:scale-110"
                >
                  <Youtube className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors hover:underline">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors hover:underline">
                    Size Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors hover:underline">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors hover:underline">
                    Returns
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors hover:underline">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors hover:underline">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors hover:underline">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold">Stay Updated</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Subscribe to our newsletter for the latest fashion trends and exclusive offers.
              </p>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-full backdrop-blur-sm focus:bg-white/20 focus:border-white/40"
                />
                <Button className="w-full bg-white text-black hover:bg-gray-100 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8 text-center">
            <p className="text-white/70 text-sm">
              © 2024 StyleHub. All rights reserved. Made with 💜 for fashion lovers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

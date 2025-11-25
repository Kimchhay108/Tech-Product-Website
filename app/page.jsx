'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const products = [
    { id: 1, name: 'ProCore X1', price: '$1,299', icon: '🖥️', desc: 'Ultimate Performance' },
    { id: 2, name: 'Swift Drive Pro', price: '$599', icon: '⚡', desc: 'Lightning Fast' },
    { id: 3, name: 'Sentinel Shield', price: '$399', icon: '🛡️', desc: 'Enterprise Security' },
  ];

  const features = [
    { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized performance' },
    { icon: '🛡️', title: 'Secure', desc: 'Enterprise security' },
    { icon: '🧠', title: 'Smart', desc: 'AI-powered' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ========== NAVIGATION ========== */}
      <nav className="fixed top-0 w-full z-40 bg-black/90 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            TechVault
          </h1>
          
          <div className="hidden md:flex gap-12 text-sm font-medium">
            <a href="#products" className="text-gray-300 hover:text-blue-400 transition duration-300">Products</a>
            <a href="#features" className="text-gray-300 hover:text-blue-400 transition duration-300">Features</a>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition duration-300 items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart
            </button>
            
            <button 
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-white/10 px-6 py-6 space-y-4">
            <a href="#products" className="block text-gray-300 hover:text-blue-400 transition">Products</a>
            <a href="#features" className="block text-gray-300 hover:text-blue-400 transition">Features</a>
          </div>
        )}
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="pt-40 pb-48 px-6 relative overflow-hidden">
        <div className="absolute top-40 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div>
                <span className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-full text-xs font-medium text-blue-300">
                  ✨ New Collection
                </span>
              </div>
              
              <h2 className="text-6xl lg:text-7xl font-bold leading-tight">
                Next Gen <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Technology</span>
              </h2>
              
              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                Premium tech products with cutting-edge innovation and unmatched performance. Experience the future today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-4 rounded-lg font-semibold text-base transition duration-300 hover:shadow-lg hover:shadow-blue-500/30">
                  Shop Now
                </button>
                <button className="border-2 border-gray-400 hover:border-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold text-base transition duration-300">
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="flex justify-center items-center h-96">
              <div 
                className="text-9xl transition-transform duration-300"
                style={{ transform: `translateY(${scrollY * 0.15}px)` }}
              >
                🔮
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section id="features" className="py-48 px-6 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <h3 className="text-5xl font-bold mb-6">Why Choose Us</h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Industry-leading features designed for modern tech enthusiasts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group p-12 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl hover:border-blue-400/50 hover:bg-white/15 transition duration-300 flex flex-col h-full"
              >
                <div className="text-6xl mb-8 group-hover:scale-110 transition duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-bold mb-4">{feature.title}</h4>
                <p className="text-gray-400 text-base leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRODUCTS SECTION ========== */}
      <section id="products" className="py-48 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <h3 className="text-5xl font-bold mb-6">Featured Products</h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Handpicked products for exceptional performance and quality
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-12 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/20 transition duration-300 flex flex-col h-full"
              >
                <div className="mb-8">
                  <div className="text-7xl group-hover:scale-110 transition duration-300 inline-block">
                    {product.icon}
                  </div>
                </div>
                
                <p className="text-blue-400 text-sm font-semibold mb-4 uppercase tracking-wide">
                  {product.desc}
                </p>
                
                <h4 className="text-2xl font-bold mb-8 flex-grow">
                  {product.name}
                </h4>
                
                <div className="flex justify-between items-center pt-8 border-t border-white/10">
                  <span className="text-3xl font-bold text-cyan-400">
                    {product.price}
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition duration-300 hover:scale-110">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-48 px-6 bg-gradient-to-r from-blue-600/20 via-transparent to-cyan-600/20">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h3 className="text-5xl font-bold">
            Ready to Upgrade?
          </h3>
          
          <p className="text-gray-300 text-lg leading-relaxed">
            Join thousands of satisfied customers. Free shipping on orders over $100.
          </p>
          
          <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-10 py-4 rounded-lg font-semibold text-lg transition duration-300 hover:shadow-lg hover:shadow-blue-500/30 inline-block">
            Start Shopping →
          </button>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-white/10 py-20 px-6 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-16">
            <div>
              <h5 className="font-bold text-white mb-8">Product</h5>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold text-white mb-8">Company</h5>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold text-white mb-8">Legal</h5>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold text-white mb-8">Follow</h5>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center text-gray-500 pt-12 border-t border-white/10">
            <p>&copy; 2025 TechVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Cpu, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import logo from '../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor page scroll to style navbar background dynamically
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Ana Sayfa', href: '#heros' },
    { label: 'Atölyelerimiz', href: '#atolyeler' },
    { label: 'Mini Oyun', href: '#mini-oyun' },
    { label: 'Kurucumuz', href: '#kurucu' },
    { label: 'S.S.S.', href: '#faq' },
    { label: 'İletişim', href: '#iletisim' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const topOffset = targetElement.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-indigo-100 py-3' 
        : 'bg-white/40 backdrop-blur-sm py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo with bright robotics theme */}
          <a 
            href="#heros" 
            onClick={(e) => handleScrollTo(e, '#heros')}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-slate-100 shadow-sm">
              <img src={logo} alt="Çağan Robotics Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight block leading-none">
                ÇAĞAN <span className="text-indigo-600">ROBOTICS</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                KİLİS TEKNOLOJİ ATÖLYESİ
              </span>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1.5">
            {menuItems.map((item) => (
              <a
                id={`nav-link-${item.href.replace('#', '')}`}
                key={item.label}
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href)}
                className="text-slate-700 hover:text-indigo-600 font-bold text-sm px-4 py-2 rounded-xl transition-all hover:bg-indigo-50"
              >
                {item.label}
              </a>
            ))}
            
            {/* Quick Contact CTA */}
            <a
              id="nav-quick-contact-btn"
              href="#iletisim"
              onClick={(e) => handleScrollTo(e, '#iletisim')}
              className="ml-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md shadow-indigo-500/25 transition-transform hover:scale-102 active:scale-100"
            >
              <Phone className="w-3.5 h-3.5 fill-white/10" strokeWidth={3} /> Kayıt Talebi
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              id="mobile-nav-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-800 p-2 rounded-xl hover:bg-slate-100/80 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href)}
                  className="block text-slate-800 hover:text-indigo-600 font-extrabold text-base px-4 py-3 rounded-xl transition-all hover:bg-indigo-50"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-100">
                <a
                  href="#iletisim"
                  onClick={(e) => handleScrollTo(e, '#iletisim')}
                  className="w-full justify-center bg-indigo-600 text-white font-extrabold text-sm py-3 px-4 rounded-xl flex items-center gap-2 shadow-lg"
                >
                  <Phone className="w-4 h-4" /> Bize Ulaşın
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

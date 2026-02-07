'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Users,
  Bell,
  CreditCard,
  FileText,
  ArrowRight,
  Check,
  Star,
  Heart
} from 'lucide-react'

export function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#2D2A26] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#E8DCD0] rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-[#D4E5D7] rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#F5E6D3] rounded-full blur-2xl opacity-50" />
        {/* Subtle grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#C65D3B] rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-xl font-semibold tracking-tight"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              SimpleCRM
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-[#5C5751] hover:text-[#2D2A26] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-[#2D2A26] text-[#FDF8F3] text-sm font-medium rounded-full hover:bg-[#1a1816] transition-all duration-300 hover:shadow-lg hover:shadow-[#2D2A26]/20 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-24 md:px-12 lg:px-20 md:pt-24 md:pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {/* Handwritten accent */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 bg-[#D4E5D7] rounded-full text-sm text-[#3D5A42] mb-8 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <Star className="w-4 h-4 fill-current" />
              <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Built for businesses who care
              </span>
            </div>

            <h1
              className={`text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] mb-6 transform transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Remember{' '}
              <span className="relative inline-block">
                <span className="relative z-10">every</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path
                    d="M2 8C50 2 150 2 198 8"
                    stroke="#C65D3B"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="opacity-60"
                  />
                </svg>
              </span>
              <br />
              customer.
            </h1>

            <p
              className={`text-xl md:text-2xl text-[#5C5751] leading-relaxed mb-10 max-w-xl transform transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              A simple, beautiful way to keep track of your customers,
              follow-ups, and payments. No complexity, just what you need.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C65D3B] text-white text-lg font-medium rounded-full hover:bg-[#B54D2B] transition-all duration-300 hover:shadow-xl hover:shadow-[#C65D3B]/30 hover:-translate-y-1"
              >
                Start for free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#2D2A26]/20 text-[#2D2A26] text-lg font-medium rounded-full hover:border-[#2D2A26]/40 hover:bg-[#2D2A26]/5 transition-all duration-300"
              >
                See how it works
              </Link>
            </div>
          </div>

          {/* Decorative illustration */}
          <div className="hidden lg:block absolute top-24 right-12 xl:right-24">
            <div className="relative">
              {/* Floating cards */}
              <div
                className={`absolute -top-4 -left-8 w-64 h-40 bg-white rounded-2xl shadow-xl p-5 transform rotate-[-8deg] transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#F5E6D3] rounded-full" />
                  <div>
                    <div className="w-24 h-3 bg-[#E8DCD0] rounded" />
                    <div className="w-16 h-2 bg-[#E8DCD0] rounded mt-2" />
                  </div>
                </div>
                <div className="w-full h-2 bg-[#D4E5D7] rounded mt-4" />
                <div className="w-3/4 h-2 bg-[#E8DCD0] rounded mt-2" />
              </div>

              <div
                className={`w-72 h-48 bg-white rounded-2xl shadow-2xl p-6 transform rotate-[4deg] transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#5C5751]">Today's Follow-ups</span>
                  <span className="w-6 h-6 bg-[#C65D3B] rounded-full flex items-center justify-center text-xs text-white font-medium">3</span>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 bg-[#F5E6D3] rounded-full" />
                    <div className="flex-1">
                      <div className="w-20 h-2 bg-[#E8DCD0] rounded" />
                    </div>
                    <div className="w-6 h-6 bg-[#D4E5D7] rounded-lg flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#3D5A42]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-24 md:px-12 lg:px-20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-normal mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Everything you need,{' '}
              <span className="text-[#C65D3B]">nothing you don't</span>
            </h2>
            <p className="text-lg text-[#5C5751] max-w-2xl mx-auto">
              Built for small businesses who value simplicity over feature bloat.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: 'Customer Profiles',
                description: 'Keep all customer details, notes, and history in one place.',
                color: '#C65D3B',
                bg: '#FDF2ED',
              },
              {
                icon: Bell,
                title: 'Smart Follow-ups',
                description: 'Never miss a follow-up. Get reminded at the right time.',
                color: '#7C9A82',
                bg: '#EDF3EE',
              },
              {
                icon: CreditCard,
                title: 'Payment Tracking',
                description: 'Record payments and see customer lifetime value instantly.',
                color: '#8B7355',
                bg: '#F5F0EB',
              },
              {
                icon: FileText,
                title: 'Activity Timeline',
                description: 'See every interaction at a glance. Full history, no digging.',
                color: '#6B8E9B',
                bg: '#EDF2F4',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="group p-6 bg-white rounded-2xl border border-[#E8DCD0]/60 hover:border-transparent hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: feature.bg }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-[#5C5751] text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section className="relative z-10 px-6 py-24 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-6 h-6 text-[#C65D3B] fill-current" />
            ))}
          </div>
          <blockquote
            className="text-2xl md:text-3xl lg:text-4xl text-[#2D2A26] leading-relaxed mb-8"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
          >
            "Finally, a CRM that doesn't feel like homework.
            I actually enjoy opening it every morning."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-[#E8DCD0] rounded-full" />
            <div className="text-left">
              <div className="font-medium">Priya Sharma</div>
              <div className="text-sm text-[#5C5751]">Interior Designer, Mumbai</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-[#2D2A26] rounded-3xl p-10 md:p-16 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C65D3B]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D4E5D7]/10 rounded-full blur-2xl" />

            <div className="relative z-10 text-center">
              <h2
                className="text-3xl md:text-4xl lg:text-5xl text-[#FDF8F3] font-normal mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Start remembering
              </h2>
              <p className="text-lg text-[#A8A29E] mb-8 max-w-xl mx-auto">
                Join thousands of small businesses who've simplified their customer relationships.
              </p>
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-[#C65D3B] text-white text-lg font-medium rounded-full hover:bg-[#B54D2B] transition-all duration-300 hover:shadow-xl hover:shadow-[#C65D3B]/30 hover:-translate-y-1"
              >
                Get started free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-[#78716C] mt-4">
                No credit card required • Free forever for small teams
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 md:px-12 lg:px-20 border-t border-[#E8DCD0]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C65D3B] rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium" style={{ fontFamily: 'Georgia, serif' }}>
              SimpleCRM
            </span>
          </div>
          <p className="text-sm text-[#5C5751]">
            Made with care for small businesses everywhere.
          </p>
        </div>
      </footer>
    </div>
  )
}

'use client';

import Link from 'next/link';
import { Leaf, Brain, Shield, Utensils, Dumbbell, Droplets, Calendar, BarChart3, MessageCircle, ArrowRight, Sparkles, Heart, Sun } from 'lucide-react';

const features = [
  { icon: Brain, title: 'Prakriti Analysis', desc: 'Discover your unique Ayurvedic constitution through an intelligent quiz analyzed by AI', href: '/prakriti', color: '#9b59b6' },
  { icon: Shield, title: 'Symptom Check', desc: 'Report your symptoms and get AI-powered Vikriti (imbalance) analysis with safety alerts', href: '/vikriti', color: '#e74c3c' },
  { icon: Utensils, title: 'Personalized Diet', desc: 'Get AI-generated diet plans tailored to your Dosha, season, and health conditions', href: '/diet', color: '#f39c12' },
  { icon: Dumbbell, title: 'Yoga & Movement', desc: 'Receive specific yoga asanas and pranayama prescriptions based on your constitution', href: '/yoga', color: '#2ecc71' },
  { icon: Droplets, title: 'Smart Hydration', desc: 'Personalized hydration plans based on your body, season, and activity level', href: '/hydration', color: '#3498db' },
  { icon: Calendar, title: 'Daily Routine', desc: 'AI-generated Dinacharya schedule personalized to your Dosha and lifestyle', href: '/routine', color: '#e67e22' },
  { icon: Sun, title: 'Seasonal Guide', desc: 'Ritucharya recommendations that adapt to the current Ayurvedic season', href: '/seasonal', color: '#f1c40f' },
  { icon: Heart, title: 'Disease Library', desc: 'AI-powered Ayurvedic guidance for common health conditions with stage-based advice', href: '/diseases', color: '#e74c3c' },
  { icon: BarChart3, title: 'Health Analytics', desc: 'Track your Dosha trends, habit adherence, and symptom improvement over time', href: '/analytics', color: '#00e676' },
  { icon: MessageCircle, title: 'AI Chat Doctor', desc: 'Chat directly with our Ayurvedic AI for personalized questions and advice', href: '/chat', color: '#40c4ff' },
];

const steps = [
  { step: '01', title: 'Take the Prakriti Quiz', desc: 'Answer 10 questions about your body, mind, and lifestyle' },
  { step: '02', title: 'AI Analyzes Your Constitution', desc: 'Our AI determines your Vata-Pitta-Kapha distribution' },
  { step: '03', title: 'Report Your Symptoms', desc: 'Share current health concerns for Vikriti analysis' },
  { step: '04', title: 'Get Your Personalized Plan', desc: 'Receive AI-generated diet, yoga, routine, and herbal recommendations' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated bg orbs */}
        <div style={{
          position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46, 204, 113, 0.08) 0%, transparent 70%)',
          top: '-100px', right: '-100px', animation: 'float 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(155, 89, 182, 0.06) 0%, transparent 70%)',
          bottom: '-50px', left: '-50px', animation: 'float 8s ease-in-out infinite 1s',
        }} />

        <div style={{ maxWidth: '900px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-in-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 20px', borderRadius: '30px',
            background: 'rgba(46, 204, 113, 0.1)', border: '1px solid rgba(46, 204, 113, 0.2)',
            marginBottom: '28px', fontSize: '13px', fontWeight: 600, color: '#2ecc71',
          }}>
            <Sparkles size={14} />
            AI-Powered Ayurvedic Health Companion
          </div>

          <h1 className="animate-fade-in-up stagger-1" style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '24px',
          }}>
            Your Personal{' '}
            <span className="gradient-text">Ayurvedic</span>
            <br />Health Mentor
          </h1>

          <p className="animate-fade-in-up stagger-2" style={{
            fontSize: '1.15rem',
            color: '#a5d6a7',
            maxWidth: '640px',
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            Discover your Prakriti, balance your Doshas, and receive AI-generated personalized
            diet plans, yoga prescriptions, daily routines, and herbal recommendations —
            all rooted in 5000 years of Ayurvedic wisdom.
          </p>

          <div className="animate-fade-in-up stagger-3" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/prakriti" className="btn-primary" style={{ fontSize: '16px', padding: '14px 32px' }}>
              <Brain size={18} />
              Start Prakriti Quiz
              <ArrowRight size={16} />
            </Link>
            <Link href="/chat" className="btn-secondary" style={{ fontSize: '16px', padding: '14px 32px' }}>
              <MessageCircle size={18} />
              Chat with AI
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up stagger-4" style={{
            display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '60px', flexWrap: 'wrap',
          }}>
            {[
              { value: '10+', label: 'Health Modules' },
              { value: 'AI', label: 'Powered Reports' },
              { value: '🌿', label: 'Ancient Wisdom' },
              { value: '24/7', label: 'AI Available' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#2ecc71' }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: '#66bb6a', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-header">
          <h2 className="gradient-text">How It Works</h2>
          <p>Four simple steps to your personalized Ayurvedic health plan</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
        }}>
          {steps.map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '32px 24px', textAlign: 'center', opacity: 0, animationDelay: `${i * 0.15}s` }}
              ref={(el) => {
                if (el) {
                  const observer = new IntersectionObserver(([e]) => {
                    if (e.isIntersecting) { el.classList.add('animate-fade-in-up'); observer.unobserve(el); }
                  }, { threshold: 0.1 });
                  observer.observe(el);
                }
              }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: 700, color: '#fff',
                margin: '0 auto 20px',
                fontFamily: 'Outfit, sans-serif',
              }}>
                {s.step}
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{s.title}</h3>
              <p style={{ fontSize: '14px', color: '#a5d6a7', lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-header">
          <h2 className="gradient-text">Complete Health Modules</h2>
          <p>Every aspect of your wellness, powered by AI and Ayurveda</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {features.map((f, i) => (
            <Link key={i} href={f.href} className="glass-card" style={{
              padding: '28px 24px',
              textDecoration: 'none',
              display: 'block',
              opacity: 0,
            }}
              ref={(el) => {
                if (el) {
                  const observer = new IntersectionObserver(([e]) => {
                    if (e.isIntersecting) { el.classList.add('animate-fade-in-up'); el.style.animationDelay = `${(i % 3) * 0.1}s`; observer.unobserve(el); }
                  }, { threshold: 0.1 });
                  observer.observe(el);
                }
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${f.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <f.icon size={22} color={f.color} />
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '8px', fontFamily: 'Outfit, sans-serif', color: '#e8f5e9' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: '#a5d6a7', lineHeight: 1.6 }}>{f.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '16px', fontSize: '13px', fontWeight: 600, color: f.color }}>
                Explore <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Disclaimer / Footer */}
      <section style={{
        padding: '40px 24px 60px',
        textAlign: 'center',
        borderTop: '1px solid rgba(46, 204, 113, 0.1)',
      }}>
        <div style={{
          maxWidth: '700px', margin: '0 auto',
          padding: '24px',
          background: 'rgba(255, 171, 0, 0.06)',
          border: '1px solid rgba(255, 171, 0, 0.15)',
          borderRadius: '14px',
          marginBottom: '40px',
        }}>
          <p style={{ fontSize: '13px', color: '#ffab00', fontWeight: 600, marginBottom: '8px' }}>⚠️ Health Disclaimer</p>
          <p style={{ fontSize: '12px', color: '#a5d6a7', lineHeight: 1.6 }}>
            AyurGenix provides AI-generated Ayurvedic guidance for educational purposes only.
            It is not a substitute for professional medical advice, diagnosis, or treatment.
            Always consult a qualified healthcare provider for serious health concerns.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <Leaf size={18} color="#2ecc71" />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: '#2ecc71' }}>AyurGenix</span>
        </div>
        <p style={{ fontSize: '12px', color: '#66bb6a' }}>
          Built with 🌿 Ancient Wisdom + 🤖 Modern AI
        </p>
      </section>
    </div>
  );
}

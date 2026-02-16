'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    Leaf, LayoutDashboard, Brain, Utensils, Dumbbell,
    Droplets, Calendar, Sun, BookOpen, FlaskConical, Calculator,
    BarChart3, MessageCircle, Menu, X, ChevronDown, LogIn, LogOut, User
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/assess', label: 'Health Assessment', icon: Brain },
    {
        label: 'Wellness', icon: ChevronDown, children: [
            { href: '/diet', label: 'Diet Plan', icon: Utensils },
            { href: '/yoga', label: 'Yoga', icon: Dumbbell },
            { href: '/hydration', label: 'Hydration', icon: Droplets },
            { href: '/routine', label: 'Daily Routine', icon: Calendar },
            { href: '/seasonal', label: 'Seasonal Guide', icon: Sun },
        ]
    },
    {
        label: 'Health', icon: ChevronDown, children: [
            { href: '/diseases', label: 'Disease Library', icon: BookOpen },
            { href: '/herbs', label: 'Herbs', icon: FlaskConical },
            { href: '/bmi', label: 'BMI Calculator', icon: Calculator },
        ]
    },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/chat', label: 'AI Chat', icon: MessageCircle },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { user, signOut, loading: authLoading } = useAuth();

    // Don't show anything while loading auth
    if (authLoading) return null;

    // ── Not logged in: Minimal bar with logo + Login / Sign Up ──
    if (!user) {
        return (
            <nav style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(15, 26, 18, 0.85)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(46, 204, 113, 0.1)',
                padding: '0 24px',
            }}>
                <div style={{
                    maxWidth: '1400px', margin: '0 auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    height: '64px',
                }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)',
                        }}>
                            <Leaf size={20} color="#fff" />
                        </div>
                        <span style={{
                            fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 700,
                            background: 'linear-gradient(135deg, #2ecc71, #a8e6cf)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>AyurGenix</span>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link href="/login" style={{
                            padding: '8px 16px', borderRadius: '8px', color: '#a5d6a7',
                            fontSize: '14px', fontWeight: 500, textDecoration: 'none',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            transition: 'all 0.2s',
                        }}><LogIn size={14} /> Login</Link>
                        <Link href="/signup" className="btn-primary" style={{
                            padding: '8px 18px', fontSize: '13px', textDecoration: 'none',
                        }}>Sign Up</Link>
                    </div>
                </div>
            </nav>
        );
    }

    // ── Logged in: Full navigation bar ──
    return (
        <nav style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: 'rgba(15, 26, 18, 0.85)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(46, 204, 113, 0.1)',
            padding: '0 24px',
        }}>
            <div style={{
                maxWidth: '1400px', margin: '0 auto',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: '64px',
            }}>
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)',
                    }}>
                        <Leaf size={20} color="#fff" />
                    </div>
                    <span style={{
                        fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 700,
                        background: 'linear-gradient(135deg, #2ecc71, #a8e6cf)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>AyurGenix</span>
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
                    {navLinks.map((link) =>
                        link.children ? (
                            <div key={link.label} style={{ position: 'relative' }}
                                onMouseEnter={() => setOpenDropdown(link.label)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <button style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '8px 14px', borderRadius: '8px',
                                    background: 'transparent', border: 'none',
                                    color: '#a5d6a7', fontSize: '14px', fontWeight: 500,
                                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                    transition: 'all 0.2s',
                                }}>
                                    {link.label}
                                    <ChevronDown size={14} style={{
                                        transition: 'transform 0.2s',
                                        transform: openDropdown === link.label ? 'rotate(180deg)' : 'rotate(0)',
                                    }} />
                                </button>
                                {openDropdown === link.label && (
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0,
                                        background: 'rgba(22, 32, 25, 0.95)', backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(46, 204, 113, 0.15)',
                                        borderRadius: '12px', padding: '8px', minWidth: '200px',
                                        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
                                        animation: 'fadeInUp 0.2s ease-out',
                                    }}>
                                        {link.children.map((child) => (
                                            <Link key={child.href} href={child.href} style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                padding: '10px 14px', borderRadius: '8px', color: '#a5d6a7',
                                                fontSize: '13px', fontWeight: 500, textDecoration: 'none',
                                                transition: 'all 0.2s',
                                            }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(46, 204, 113, 0.1)'; e.currentTarget.style.color = '#2ecc71'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a5d6a7'; }}
                                            >
                                                <child.icon size={16} />
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link key={link.href} href={link.href!} style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '8px 14px', borderRadius: '8px', color: '#a5d6a7',
                                fontSize: '14px', fontWeight: 500, textDecoration: 'none',
                                transition: 'all 0.2s',
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(46, 204, 113, 0.08)'; e.currentTarget.style.color = '#2ecc71'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a5d6a7'; }}
                            >
                                <link.icon size={16} />
                                {link.label}
                            </Link>
                        )
                    )}
                </div>

                {/* User Menu + Mobile Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Desktop User Menu */}
                    <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ position: 'relative' }}
                            onMouseEnter={() => setUserMenuOpen(true)}
                            onMouseLeave={() => setUserMenuOpen(false)}
                        >
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '6px 14px', borderRadius: '10px',
                                background: 'rgba(46,204,113,0.08)', border: '1px solid rgba(46,204,113,0.15)',
                                color: '#a5d6a7', fontSize: '13px', cursor: 'pointer',
                                fontFamily: 'Inter, sans-serif',
                            }}>
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '12px', fontWeight: 700, color: '#fff',
                                }}>
                                    {(user.user_metadata?.name || user.email || '?')[0].toUpperCase()}
                                </div>
                                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.user_metadata?.name || user.email?.split('@')[0]}
                                </span>
                                <ChevronDown size={12} />
                            </button>
                            {userMenuOpen && (
                                <div style={{
                                    position: 'absolute', top: '100%', right: 0,
                                    background: 'rgba(22, 32, 25, 0.95)', backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(46, 204, 113, 0.15)',
                                    borderRadius: '12px', padding: '8px', minWidth: '180px',
                                    boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                                    animation: 'fadeInUp 0.2s ease-out',
                                }}>
                                    <div style={{ padding: '8px 14px', fontSize: '12px', color: '#66bb6a', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '4px' }}>
                                        {user.email}
                                    </div>
                                    <Link href="/dashboard" style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '10px 14px', borderRadius: '8px', color: '#a5d6a7',
                                        fontSize: '13px', textDecoration: 'none', transition: 'all 0.2s',
                                    }}><User size={14} /> Profile</Link>
                                    <button onClick={signOut} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '10px 14px', borderRadius: '8px', color: '#ff5252',
                                        fontSize: '13px', background: 'none', border: 'none',
                                        cursor: 'pointer', width: '100%', textAlign: 'left',
                                        fontFamily: 'Inter, sans-serif',
                                    }}><LogOut size={14} /> Sign Out</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="mobile-toggle"
                        style={{
                            display: 'none', background: 'transparent',
                            border: 'none', color: '#a5d6a7', cursor: 'pointer', padding: '8px',
                        }}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="mobile-menu" style={{
                    padding: '16px',
                    borderTop: '1px solid rgba(46, 204, 113, 0.1)',
                    animation: 'fadeInUp 0.3s ease-out',
                }}>
                    {navLinks.map((link) =>
                        link.children ? (
                            <div key={link.label}>
                                <div style={{
                                    padding: '10px 12px', color: '#66bb6a', fontSize: '12px',
                                    fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px',
                                }}>{link.label}</div>
                                {link.children.map((child) => (
                                    <Link key={child.href} href={child.href}
                                        onClick={() => setMobileOpen(false)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '12px 16px', color: '#a5d6a7', fontSize: '14px',
                                            fontWeight: 500, textDecoration: 'none', borderRadius: '8px',
                                        }}>
                                        <child.icon size={16} />
                                        {child.label}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <Link key={link.href} href={link.href!}
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '12px 16px', color: '#a5d6a7', fontSize: '14px',
                                    fontWeight: 500, textDecoration: 'none', borderRadius: '8px',
                                }}>
                                <link.icon size={16} />
                                {link.label}
                            </Link>
                        )
                    )}
                    {/* Mobile Sign Out */}
                    <div style={{ borderTop: '1px solid rgba(46,204,113,0.08)', marginTop: '8px', paddingTop: '12px' }}>
                        <button onClick={() => { signOut(); setMobileOpen(false); }} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '12px 16px', color: '#ff5252', fontSize: '14px',
                            background: 'none', border: 'none', cursor: 'pointer',
                            width: '100%', fontFamily: 'Inter, sans-serif',
                        }}><LogOut size={16} /> Sign Out</button>
                    </div>
                </div>
            )}

            <style jsx>{`
                @media (max-width: 900px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: block !important; }
                }
                @media (min-width: 901px) {
                    .mobile-menu { display: none !important; }
                }
            `}</style>
        </nav>
    );
}

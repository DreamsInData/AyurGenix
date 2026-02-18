'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
    Leaf, LayoutDashboard, Brain, Utensils, Dumbbell,
    Droplets, Calendar, Sun, BookOpen, FlaskConical, Calculator,
    BarChart3, MessageCircle, Menu, ChevronDown, ChevronRight, LogIn, LogOut, User, Settings
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
    const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { user, signOut, loading: authLoading } = useAuth();

    // Close mobile menu on resize past breakpoint
    useEffect(() => {
        const handler = () => { if (window.innerWidth > 1024) setMobileOpen(false); };
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    if (authLoading) return null;

    // ── Shared Logo ──
    const Logo = (
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div className="nav-logo-icon">
                <Leaf size={20} color="#fff" />
            </div>
            <span className="nav-logo-text">AyurGenix</span>
        </Link>
    );

    // ── Shared Hamburger Button ──
    const HamburgerBtn = (
        <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="nav-mobile-toggle"
            aria-label="Toggle menu"
        >
            <Menu size={24} />
        </button>
    );

    // ══════════════════════════════════════
    //  NOT LOGGED IN
    // ══════════════════════════════════════
    if (!user) {
        return (
            <nav className="nav-bar">
                <div className="nav-container">
                    {Logo}
                    <div className="nav-auth-buttons nav-desktop-only">
                        <Link href="/login" className="nav-auth-link">
                            <LogIn size={14} /> Login
                        </Link>
                        <Link href="/signup" className="btn-primary nav-auth-signup">
                            Sign Up
                        </Link>
                    </div>
                    {HamburgerBtn}
                </div>

                {/* Mobile menu for not logged in */}
                {mobileOpen && (
                    <div className="nav-mobile-overlay" onClick={() => setMobileOpen(false)}>
                        <div className="nav-mobile-panel" onClick={e => e.stopPropagation()}>
                            <div className="nav-mobile-header">
                                {Logo}
                                <button onClick={() => setMobileOpen(false)} className="nav-mobile-close">
                                    <ChevronRight size={22} />
                                </button>
                            </div>
                            <div className="nav-mobile-body">
                                <Link href="/login" onClick={() => setMobileOpen(false)} className="nav-mobile-link">
                                    <LogIn size={18} /> Login
                                </Link>
                                <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-primary nav-mobile-cta">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                <style jsx>{navStyles}</style>
            </nav>
        );
    }

    // ══════════════════════════════════════
    //  LOGGED IN
    // ══════════════════════════════════════
    return (
        <nav className="nav-bar">
            <div className="nav-container">
                {Logo}

                {/* Desktop Navigation */}
                <div className="nav-desktop-links nav-desktop-only">
                    {navLinks.map((link) =>
                        link.children ? (
                            <div key={link.label} className="nav-dropdown-wrapper"
                                onMouseEnter={() => setOpenDropdown(link.label)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <button className="nav-link">
                                    {link.label}
                                    <ChevronDown size={14} style={{
                                        transition: 'transform 0.2s',
                                        transform: openDropdown === link.label ? 'rotate(180deg)' : 'rotate(0)',
                                    }} />
                                </button>
                                {openDropdown === link.label && (
                                    <div className="nav-dropdown-menu">
                                        {link.children.map((child) => (
                                            <Link key={child.href} href={child.href} className="nav-dropdown-item">
                                                <child.icon size={16} />
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link key={link.href} href={link.href!} className="nav-link">
                                <link.icon size={16} />
                                {link.label}
                            </Link>
                        )
                    )}
                </div>

                {/* Desktop User Menu */}
                <div className="nav-desktop-only" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="nav-dropdown-wrapper"
                        onMouseEnter={() => setUserMenuOpen(true)}
                        onMouseLeave={() => setUserMenuOpen(false)}
                    >
                        <button className="nav-user-btn">
                            <div className="nav-user-avatar">
                                {(user.user_metadata?.name || user.email || '?')[0].toUpperCase()}
                            </div>
                            <span className="nav-user-name">
                                {user.user_metadata?.name || user.email?.split('@')[0]}
                            </span>
                            <ChevronDown size={12} />
                        </button>
                        {userMenuOpen && (
                            <div className="nav-dropdown-menu nav-dropdown-right">
                                <div className="nav-dropdown-email">{user.email}</div>
                                <Link href="/dashboard" className="nav-dropdown-item">
                                    <User size={14} /> Profile
                                </Link>
                                <Link href="/settings" className="nav-dropdown-item">
                                    <Settings size={14} /> Settings
                                </Link>
                                <button onClick={signOut} className="nav-dropdown-item nav-signout-btn">
                                    <LogOut size={14} /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Toggle */}
                {HamburgerBtn}
            </div>

            {/* Mobile Menu (logged in) */}
            {mobileOpen && (
                <div className="nav-mobile-overlay" onClick={() => setMobileOpen(false)}>
                    <div className="nav-mobile-panel" onClick={e => e.stopPropagation()}>
                        <div className="nav-mobile-header">
                            {Logo}
                            <button onClick={() => setMobileOpen(false)} className="nav-mobile-close">
                                <ChevronRight size={22} />
                            </button>
                        </div>
                        <div className="nav-mobile-body">
                            {/* Navigation links */}
                            {navLinks.map((link) =>
                                link.children ? (
                                    <div key={link.label}>
                                        <button
                                            className="nav-mobile-link nav-mobile-dropdown-toggle"
                                            onClick={() => setMobileDropdown(
                                                mobileDropdown === link.label ? null : link.label
                                            )}
                                        >
                                            <span>{link.label}</span>
                                            <ChevronDown size={16} style={{
                                                transition: 'transform 0.2s',
                                                transform: mobileDropdown === link.label ? 'rotate(180deg)' : 'rotate(0)',
                                            }} />
                                        </button>
                                        {mobileDropdown === link.label && (
                                            <div className="nav-mobile-sub">
                                                {link.children.map((child) => (
                                                    <Link key={child.href} href={child.href}
                                                        onClick={() => setMobileOpen(false)}
                                                        className="nav-mobile-link nav-mobile-sublink"
                                                    >
                                                        <child.icon size={16} />
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link key={link.href} href={link.href!}
                                        onClick={() => setMobileOpen(false)}
                                        className="nav-mobile-link"
                                    >
                                        <link.icon size={18} />
                                        {link.label}
                                    </Link>
                                )
                            )}
                        </div>

                        {/* Footer: Settings + User info + Sign out */}
                        <div className="nav-mobile-footer">
                            <Link href="/settings" onClick={() => setMobileOpen(false)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '10px 16px', color: '#a5d6a7', fontSize: '13px',
                                    textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)',
                                }}
                            >
                                <Settings size={16} /> Settings
                            </Link>
                            <div className="nav-mobile-footer-user">
                                <div className="nav-user-avatar">
                                    {(user.user_metadata?.name || user.email || '?')[0].toUpperCase()}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#e8f5e9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {user.user_metadata?.name || user.email?.split('@')[0]}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#66bb6a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {user.email}
                                    </div>
                                </div>
                                <button onClick={() => { signOut(); setMobileOpen(false); }}
                                    className="nav-mobile-signout-icon"
                                    title="Sign Out"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{navStyles}</style>
        </nav>
    );
}

// ══════════════════════════════════════
//  ALL NAVBAR CSS (single source of truth)
// ══════════════════════════════════════
const navStyles = `
    /* ── Base Bar ── */
    .nav-bar {
        position: sticky;
        top: 0;
        z-index: 100;
        background: rgba(15, 26, 18, 0.92);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(46, 204, 113, 0.1);
    }

    .nav-container {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 64px;
        padding: 0 clamp(16px, 3vw, 24px);
    }

    /* ── Logo ── */
    .nav-logo-icon {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: linear-gradient(135deg, #2ecc71, #27ae60);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
        flex-shrink: 0;
    }

    .nav-logo-text {
        font-family: 'Outfit', sans-serif;
        font-size: clamp(18px, 2.5vw, 22px);
        font-weight: 700;
        background: linear-gradient(135deg, #2ecc71, #a8e6cf);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* ── Desktop Links ── */
    .nav-desktop-links {
        display: flex;
        align-items: center;
        gap: 2px;
    }

    .nav-link {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        border-radius: 8px;
        background: transparent;
        border: none;
        color: #a5d6a7;
        font-size: clamp(12px, 1.2vw, 14px);
        font-weight: 500;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        text-decoration: none;
        transition: all 0.2s;
        white-space: nowrap;
    }

    .nav-link:hover {
        background: rgba(46, 204, 113, 0.08);
        color: #2ecc71;
    }

    /* ── Dropdown ── */
    .nav-dropdown-wrapper {
        position: relative;
    }

    .nav-dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        background: rgba(22, 32, 25, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(46, 204, 113, 0.15);
        border-radius: 12px;
        padding: 8px;
        min-width: 200px;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
        animation: fadeInUp 0.2s ease-out;
        z-index: 50;
    }

    .nav-dropdown-right {
        left: auto;
        right: 0;
    }

    .nav-dropdown-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-radius: 8px;
        color: #a5d6a7;
        font-size: 13px;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s;
        background: none;
        border: none;
        width: 100%;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
    }

    .nav-dropdown-item:hover {
        background: rgba(46, 204, 113, 0.1);
        color: #2ecc71;
    }

    .nav-dropdown-email {
        padding: 8px 14px;
        font-size: 12px;
        color: #66bb6a;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        margin-bottom: 4px;
    }

    /* ── User Button ── */
    .nav-user-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        border-radius: 10px;
        background: rgba(46, 204, 113, 0.08);
        border: 1px solid rgba(46, 204, 113, 0.15);
        color: #a5d6a7;
        font-size: 13px;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
    }

    .nav-user-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2ecc71, #27ae60);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        color: #fff;
        flex-shrink: 0;
    }

    .nav-user-name {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .nav-signout-btn {
        color: #ff5252 !important;
    }

    /* ── Auth Buttons (not logged in) ── */
    .nav-auth-buttons {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .nav-auth-link {
        padding: 8px 16px;
        border-radius: 8px;
        color: #a5d6a7;
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
    }

    .nav-auth-link:hover {
        color: #2ecc71;
    }

    .nav-auth-signup {
        padding: 8px 18px !important;
        font-size: 13px !important;
        text-decoration: none;
    }

    /* ── Mobile Toggle ── */
    .nav-mobile-toggle {
        display: none;
        background: transparent;
        border: none;
        color: #a5d6a7;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: background 0.2s;
    }

    .nav-mobile-toggle:hover {
        background: rgba(46, 204, 113, 0.08);
    }

    /* ── Mobile Overlay & Panel ── */
    .nav-mobile-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 200;
        animation: fadeIn 0.2s ease-out;
    }

    .nav-mobile-panel {
        position: fixed;
        top: 0;
        right: 0;
        width: min(260px, 72vw);
        height: 100vh;
        height: 100dvh;
        background: rgba(15, 26, 18, 0.98);
        border-left: 1px solid rgba(46, 204, 113, 0.1);
        display: flex;
        flex-direction: column;
        animation: slideInRight 0.3s ease-out;
        overflow-y: auto;
    }

    .nav-mobile-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(46, 204, 113, 0.1);
    }

    .nav-mobile-close {
        background: rgba(46, 204, 113, 0.06);
        border: 1px solid rgba(46, 204, 113, 0.12);
        color: #66bb6a;
        cursor: pointer;
        padding: 6px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .nav-mobile-close:hover {
        background: rgba(46, 204, 113, 0.15);
        color: #2ecc71;
    }

    .nav-mobile-body {
        padding: 12px 10px;
        flex: 1;
        overflow-y: auto;
    }

    .nav-mobile-user {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        margin-bottom: 4px;
    }

    .nav-mobile-divider {
        height: 1px;
        background: rgba(46, 204, 113, 0.1);
        margin: 8px 0;
    }

    /* ── Mobile Links ── */
    .nav-mobile-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        color: #e8f5e9;
        font-size: 15px;
        font-weight: 500;
        text-decoration: none;
        border-radius: 10px;
        transition: background 0.2s;
        width: 100%;
        background: none;
        border: none;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
    }

    .nav-mobile-link:hover, .nav-mobile-link:active {
        background: rgba(46, 204, 113, 0.08);
    }

    .nav-mobile-dropdown-toggle {
        justify-content: space-between;
        color: #66bb6a;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .nav-mobile-sub {
        padding-left: 8px;
    }

    .nav-mobile-sublink {
        font-size: 14px;
        padding: 12px 16px;
    }

    .nav-mobile-signout {
        color: #ff5252 !important;
    }

    /* ── Mobile Footer ── */
    .nav-mobile-footer {
        border-top: 1px solid rgba(46, 204, 113, 0.1);
        padding: 12px;
        margin-top: auto;
    }

    .nav-mobile-footer-user {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px;
        border-radius: 10px;
        background: rgba(46, 204, 113, 0.04);
    }

    .nav-mobile-signout-icon {
        background: rgba(255, 82, 82, 0.1);
        border: none;
        color: #ff5252;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
        margin-left: auto;
    }

    .nav-mobile-signout-icon:hover {
        background: rgba(255, 82, 82, 0.2);
    }

    .nav-mobile-cta {
        display: flex;
        justify-content: center;
        margin-top: 12px;
        text-decoration: none;
        width: 100%;
    }

    /* ══════════════════════════════════════
       RESPONSIVE BREAKPOINTS
       ══════════════════════════════════════ */

    /* Tablet & below: show hamburger, hide desktop nav */
    @media (max-width: 1024px) {
        .nav-desktop-only {
            display: none !important;
        }
        .nav-mobile-toggle {
            display: flex !important;
        }
    }

    /* Desktop: show nav, hide hamburger */
    @media (min-width: 1025px) {
        .nav-mobile-toggle {
            display: none !important;
        }
        .nav-mobile-overlay {
            display: none !important;
        }
    }
`;

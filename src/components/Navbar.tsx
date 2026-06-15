'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, ShieldCheck, PhoneCall, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const whatsappUrl = `https://wa.me/919673000053?text=${encodeURIComponent(
    'Hello 24K Realtors, I am visiting your website and would like to learn more about your verified projects.'
  )}`;

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderRadius: '0 0 16px 16px',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px',
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          textDecoration: 'none',
        }} onClick={() => setIsDrawerOpen(false)}>
          <div style={{
            background: 'var(--gold-gradient)',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(197, 160, 89, 0.3)',
          }}>
            <ShieldCheck size={24} color="#000" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="gold-text" style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              lineHeight: 1.1,
              letterSpacing: '0.05em',
            }}>
              24K REALTORS
            </span>
            <span style={{
              fontSize: '0.65rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.15em',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}>
              Verified Property Consultants
            </span>
          </div>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2.5rem',
        }} className="nav-menu">
          <Link href="/?type=APARTMENT" style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'var(--transition-smooth)',
          }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
             onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
            Apartments
          </Link>
          <Link href="/?type=VILLA" style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'var(--transition-smooth)',
          }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
             onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
            Villas
          </Link>
          <Link href="/?type=PLOT" style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'var(--transition-smooth)',
          }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
             onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
            Plots
          </Link>
          <Link href="/?type=COMMERCIAL" style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'var(--transition-smooth)',
          }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
             onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
            Commercial
          </Link>
        </nav>

        {/* Call to Actions (Desktop) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }} className="nav-actions">
          <a href="tel:+919673000053" className="btn-outline" style={{
            padding: '0.6rem 1.2rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <PhoneCall size={16} />
            <span>+91 96730 00053</span>
          </a>
          
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{
            padding: '0.6rem 1.2rem',
            fontSize: '0.85rem',
          }}>
            <MessageCircle size={16} />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>

        {/* Hamburger Menu Icon (Mobile) */}
        <button
          onClick={toggleDrawer}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '8px',
            display: 'none',
            zIndex: 1001,
          }}
          className="hamburger-btn"
        >
          {isDrawerOpen ? <X size={26} color="var(--gold-primary)" /> : <Menu size={26} />}
        </button>
      </div>

      {/* Slide-out Mobile Navigation Drawer */}
      {isDrawerOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'var(--bg-primary)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          padding: '100px 2rem 2rem 2rem',
          boxSizing: 'border-box',
        }} className="animate-fade-in">
          {/* Drawer Links */}
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            marginBottom: '3rem',
          }}>
            <Link href="/?type=APARTMENT" style={{
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '1.4rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
            }} onClick={() => setIsDrawerOpen(false)}>
              Apartments
            </Link>
            <Link href="/?type=VILLA" style={{
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '1.4rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
            }} onClick={() => setIsDrawerOpen(false)}>
              Villas
            </Link>
            <Link href="/?type=PLOT" style={{
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '1.4rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
            }} onClick={() => setIsDrawerOpen(false)}>
              Plots
            </Link>
            <Link href="/?type=COMMERCIAL" style={{
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '1.4rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
            }} onClick={() => setIsDrawerOpen(false)}>
              Commercial
            </Link>
          </nav>

          {/* Drawer Contacts */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            marginTop: 'auto',
          }}>
            <a href="tel:+919673000053" className="btn-outline" style={{
              padding: '1rem',
              justifyContent: 'center',
              fontSize: '1rem',
            }}>
              <PhoneCall size={18} />
              <span>Call +91 96730 00053</span>
            </a>
            
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{
              padding: '1rem',
              justifyContent: 'center',
              fontSize: '1rem',
            }}>
              <MessageCircle size={18} />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @media (max-width: 900px) {
          .nav-menu {
            display: none !important;
          }
          .nav-actions {
            display: none !important;
          }
          .hamburger-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}

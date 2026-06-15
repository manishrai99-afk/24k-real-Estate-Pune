'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, ShieldCheck, PhoneCall } from 'lucide-react';

export default function Navbar() {
  const whatsappUrl = `https://wa.me/919673000053?text=${encodeURIComponent(
    'Hello 24K Realtors, I am visiting your website and would like to learn more about your verified projects.'
  )}`;

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
        }}>
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

        {/* Navigation Links */}
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

        {/* Call to Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
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
      </div>
      
      <style jsx>{`
        @media (max-width: 900px) {
          .nav-menu {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

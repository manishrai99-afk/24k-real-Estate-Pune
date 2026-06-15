import React from 'react';
import { ShieldAlert, Award, FileText, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '4rem 0 2rem 0',
      marginTop: '5rem',
      color: 'var(--text-secondary)',
      fontSize: '0.9rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          {/* Brand Intro */}
          <div>
            <h3 className="gold-text" style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              marginBottom: '1rem',
              letterSpacing: '0.05em',
            }}>
              24K REALTORS
            </h3>
            <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
              We partner directly with India&apos;s top-tier builders to represent fully authorized, verifiably clean real estate projects. Transparency over sales pressure.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}>
              <CheckCircle2 size={16} color="var(--gold-primary)" />
              <span>100% RERA Verified Inventory</span>
            </div>
          </div>

          {/* Markets Serviced */}
          <div>
            <h4 style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '1rem',
              marginBottom: '1.2rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              High-Growth Markets
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.6rem' }}>Whitefield, Bangalore</li>
              <li style={{ marginBottom: '0.6rem' }}>Gachibowli, Hyderabad</li>
              <li style={{ marginBottom: '0.6rem' }}>Powai, Mumbai</li>
              <li style={{ marginBottom: '0.6rem' }}>Baner & Balewadi, Pune</li>
              <li style={{ marginBottom: '0.6rem' }}>New Chandigarh, Punjab</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '1rem',
              marginBottom: '1.2rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Headquarters
            </h4>
            <p style={{ lineHeight: '1.7', marginBottom: '1rem' }}>
              24K Corporate Tower, 3rd Floor,<br />
              Off Baner Road, Baner,<br />
              Pune, Maharashtra - 411045
            </p>
            <p>
              <strong>Direct Helpline:</strong> +91 96730 00053<br />
              <strong>Advisory Email:</strong> concierge@24krealtors.com
            </p>
          </div>

          {/* RERA Compliance Seal */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.95rem',
              marginBottom: '0.8rem',
            }}>
              <Award size={20} color="var(--gold-primary)" />
              <span>RERA Registered Agent</span>
            </div>
            <p style={{ fontSize: '0.8rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Authorized under MahaRERA as a registered channel partner advisory firm.
            </p>
            <div style={{
              padding: '0.5rem 0.8rem',
              backgroundColor: 'rgba(197, 160, 89, 0.1)',
              borderRadius: '4px',
              border: '1px solid rgba(197, 160, 89, 0.2)',
              fontSize: '0.8rem',
              color: 'var(--gold-light)',
              fontWeight: '700',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              textAlign: 'center',
            }}>
              MahaRERA: A52100028741
            </div>
          </div>
        </div>

        {/* Separator line */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

        {/* Disclaimer & Copyright */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          fontSize: '0.75rem',
        }}>
          <div>
            &copy; {new Date().getFullYear()} 24K Realtors. All Rights Reserved.
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            lineHeight: '1.4',
            maxWidth: '650px',
          }}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Disclaimer:</strong> 24K Realtors acts strictly as an authorized Channel Partner/Property Consultant. Project floor plans, pricing details, and visual renderings are developer-provided. Registered customers receive accompanied site visits under professional representation.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

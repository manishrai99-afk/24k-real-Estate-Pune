'use client';

import React, { useState } from 'react';
import { PhoneCall, MessageCircle, Calendar, X, Check, AlertCircle } from 'lucide-react';

export default function MobileActionBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const whatsappUrl = `https://wa.me/919673000053?text=${encodeURIComponent(
    'Hello 24K Realtors, I am visiting your website on mobile and would like a direct consultation.'
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/[\s-()]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setStatus('error');
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: cleanPhone,
          email: null,
          message: 'Requested direct callback from Mobile Action Bar.',
          utmSource: 'mobile_sticky_bar',
          utmMedium: 'callback_fab',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to request callback.');
      }

      setStatus('success');
      setName('');
      setPhone('');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      {/* Sticky Bottom Action Bar */}
      <div className="mobile-action-bar glass-panel" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '65px',
        zIndex: 998,
        display: 'none', // Managed by CSS media query below
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        borderRadius: '16px 16px 0 0',
        borderBottom: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.5)',
      }}>
        {/* Direct Call Button */}
        <a href="tel:+919673000053" style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          color: '#fff',
          textDecoration: 'none',
          fontSize: '0.85rem',
          fontWeight: 600,
          fontFamily: 'var(--font-display)',
          height: '45px',
          borderRight: '1px solid var(--border-color)',
        }}>
          <PhoneCall size={16} color="var(--gold-primary)" />
          <span>Call Partner</span>
        </a>

        {/* WhatsApp Chat Button */}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          color: '#fff',
          textDecoration: 'none',
          fontSize: '0.85rem',
          fontWeight: 600,
          fontFamily: 'var(--font-display)',
          height: '45px',
          borderRight: '1px solid var(--border-color)',
        }}>
          <MessageCircle size={16} color="#25D366" />
          <span>WhatsApp</span>
        </a>

        {/* Quick Callback FAB Trigger */}
        <button
          onClick={() => setIsOpen(true)}
          style={{
            flex: 1.2,
            background: 'var(--gold-gradient)',
            border: 'none',
            borderRadius: '6px',
            color: '#000',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.3rem',
            height: '45px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(197, 160, 89, 0.2)',
          }}
        >
          <Calendar size={15} />
          <span>Book Callback</span>
        </button>
      </div>

      {/* Slide-up Bottom Drawer for Callback Form */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
          zIndex: 1002,
          display: 'flex',
          alignItems: 'flex-end',
        }} className="animate-fade-in" onClick={() => setIsOpen(false)}>
          
          <div
            onClick={(e) => e.stopPropagation()} // Stop closing on drawer click
            className="glass-panel animate-slide-up"
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '24px 24px 0 0',
              padding: '2rem 1.5rem',
              boxSizing: 'border-box',
              borderBottom: 'none',
              borderLeft: 'none',
              borderRight: 'none',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}>
              <div>
                <h3 className="gold-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Request Direct Callback</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Get verified developer pricing details</span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setStatus('idle');
                }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form states */}
            {status === 'success' ? (
              <div style={{
                textAlign: 'center',
                padding: '1.5rem 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.8rem',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--success)',
                }}>
                  <Check size={20} />
                </div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>Advisory Callback Requested</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Your phone number has been logged in the CRM database. An authorized Pune partner advisor will reach out to you shortly.
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setStatus('idle');
                  }}
                  className="btn-gold"
                  style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem', marginTop: '0.5rem' }}
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {status === 'error' && (
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '6px',
                    padding: '0.6rem 0.8rem',
                    color: '#f87171',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <AlertCircle size={14} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.75rem' }}>Your Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ padding: '0.75rem 1rem' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.75rem' }}>Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ padding: '0.75rem 1rem' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-gold"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.8rem',
                    marginTop: '0.5rem',
                    fontSize: '0.9rem',
                    opacity: status === 'loading' ? 0.75 : 1,
                  }}
                >
                  {status === 'loading' ? 'Submitting to CRM...' : 'Request Advisory Call'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Media query styling */}
      <style jsx>{`
        @media (max-width: 767px) {
          .mobile-action-bar {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}

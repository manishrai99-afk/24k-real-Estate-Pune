'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EnquiryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setResponseMsg('');

    // Strict 10-digit Indian mobile number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/[\s-()]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setStatus('error');
      setResponseMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: cleanPhone,
          email: email || null,
          message: message || 'General Property Enquiry Request',
          utmSource: 'floating_enquiry_modal',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      setStatus('success');
      setResponseMsg(data.message || 'Thank you! Your enquiry has been received.');
      
      // Clear inputs
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setResponseMsg(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <>
      {/* Floating CTA Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn-gold"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 999,
          borderRadius: '50px',
          padding: '1rem 1.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          boxShadow: '0 8px 30px rgba(197, 160, 89, 0.4), var(--shadow-glow)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <MessageSquare size={20} />
        <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>Enquire Now</span>
      </button>

      {/* Modal Dialog Overlay */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem',
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '500px',
            borderRadius: '16px',
            overflow: 'hidden',
            animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            boxShadow: 'var(--shadow-premium)',
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem',
              borderBottom: '1px solid var(--border-color)',
            }}>
              <div>
                <h3 className="gold-text" style={{ fontSize: '1.3rem', fontWeight: 700 }}>24K Advisory Desk</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Transparency over sales pressure</span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setStatus('idle');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition-smooth)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.8rem' }}>
              {status === 'success' ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.2rem',
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <CheckCircle2 size={32} color="var(--success)" />
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>Enquiry Registered</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {responseMsg}
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setStatus('idle');
                    }}
                    className="btn-gold"
                    style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem', marginTop: '0.5rem' }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  
                  {status === 'error' && (
                    <div style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '6px',
                      padding: '0.8rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      color: '#f87171',
                      fontSize: '0.85rem',
                    }}>
                      <AlertCircle size={16} />
                      <span>{responseMsg}</span>
                    </div>
                  )}

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Mobile Number *</label>
                    <input
                      type="tel"
                      className="form-input"
                      required
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="name@example.com (optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Your Inquiry Message</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Share your requirements (e.g., BHK size, budget range)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-gold"
                    disabled={status === 'loading'}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '1rem',
                      marginTop: '0.5rem',
                      opacity: status === 'loading' ? 0.75 : 1,
                    }}
                  >
                    {status === 'loading' ? 'Submitting details...' : 'Submit Enquiry'}
                    <Send size={16} style={{ marginLeft: '0.3rem' }} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FadeIn CSS animation helper */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

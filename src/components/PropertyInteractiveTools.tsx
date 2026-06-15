'use client';

import React, { useState } from 'react';
import { Calendar, Users, DollarSign, Calculator, HelpCircle, PhoneCall, Check, AlertCircle, Building2, Ruler } from 'lucide-react';
import { formatIndianPrice } from '@/lib/utils';

interface FloorPlan {
  id: string;
  name: string;
  bhk: number;
  sizeSqFt: number;
  price: number | string;
  imageUrl: string;
}

interface PropertyToolsProps {
  propertyId: string;
  propertyTitle: string;
  minPrice: number;
  floorPlans: FloorPlan[];
}

export default function PropertyInteractiveTools({
  propertyId,
  propertyTitle,
  minPrice,
  floorPlans,
}: PropertyToolsProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<'details' | 'plans' | 'calc' | 'booking'>('details');

  // Booking Form State
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('11:00');
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingResponse, setBookingResponse] = useState('');

  // EMI Calculator State
  const [emiPrincipal, setEmiPrincipal] = useState(minPrice);
  const [emiRate, setEmiRate] = useState(8.5);
  const [emiTenure, setEmiTenure] = useState(20);

  // Stamp Duty State
  const [stampState, setStampState] = useState('MH');
  const [stampGender, setStampGender] = useState<'male' | 'female' | 'joint'>('male');

  // Home Loan Eligibility State
  const [monthlyIncome, setMonthlyIncome] = useState(150000); // 1.5 L
  const [existingEmi, setExistingEmi] = useState(20000);
  const [eligibilityTenure, setEligibilityTenure] = useState(20);

  // --- Calculations ---

  // A. EMI Formula
  const calculateEMIResult = () => {
    const r = emiRate / 12 / 100;
    const n = emiTenure * 12;
    if (r === 0) return emiPrincipal / n;
    const emi = (emiPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  // B. Stamp Duty
  const calculateStampResult = () => {
    const rates: Record<string, { male: number; female: number; joint: number; registrationMax: number; registrationPercent: number }> = {
      MH: { male: 0.06, female: 0.05, joint: 0.06, registrationMax: 30000, registrationPercent: 0.01 }, // Maharashtra
      KA: { male: 0.05, female: 0.05, joint: 0.05, registrationMax: 0, registrationPercent: 0.01 },    // Karnataka
      DL: { male: 0.06, female: 0.04, joint: 0.05, registrationMax: 0, registrationPercent: 0.01 },    // Delhi
    };

    const selectedRate = rates[stampState] || { male: 0.05, female: 0.05, joint: 0.05, registrationMax: 30000, registrationPercent: 0.01 };
    const stampRate = selectedRate[stampGender];
    
    const stampDuty = minPrice * stampRate;
    let registrationFee = minPrice * selectedRate.registrationPercent;
    if (selectedRate.registrationMax > 0 && registrationFee > selectedRate.registrationMax) {
      registrationFee = selectedRate.registrationMax;
    }

    return {
      stampDuty: Math.round(stampDuty),
      registrationFee: Math.round(registrationFee),
      total: Math.round(stampDuty + registrationFee),
    };
  };

  // C. Loan Eligibility
  // Bank rule: FOIR (Fixed Obligation to Income Ratio) is approx 50% for high income.
  // Allowed EMI = (Monthly Income * 0.50) - Existing EMIs
  const calculateEligibility = () => {
    const maxAllowedEmi = (monthlyIncome * 0.50) - existingEmi;
    if (maxAllowedEmi <= 0) return 0;

    // Rearranging EMI formula to find Principal:
    // P = EMI / [ (r * (1+r)^n) / ((1+r)^n - 1) ]
    const r = 8.5 / 12 / 100; // Average rate of 8.5%
    const n = eligibilityTenure * 12;
    const factor = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    const maxPrincipal = maxAllowedEmi / factor;
    return Math.round(maxPrincipal);
  };

  // --- Handlers ---
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('loading');
    setBookingResponse('');

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = bookingPhone.replace(/[\s-()]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setBookingStatus('error');
      setBookingResponse('Please enter a valid 10-digit mobile number starting with 6-9.');
      return;
    }

    try {
      const scheduledDateTime = `${bookingDate}T${bookingTime}:00`;
      
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bookingName,
          phone: cleanPhone,
          email: bookingEmail || null,
          propertyId,
          scheduledAt: scheduledDateTime,
          message: bookingMsg,
          utmSource: 'website_details',
          utmMedium: 'booking_widget',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete reservation.');
      }

      setBookingStatus('success');
      setBookingResponse(data.message);
      
      // Clear form
      setBookingName('');
      setBookingPhone('');
      setBookingEmail('');
      setBookingDate('');
      setBookingMsg('');
    } catch (err: any) {
      setBookingStatus('error');
      setBookingResponse(err.message || 'An error occurred during booking. Please try again.');
    }
  };

  const stampResult = calculateStampResult();
  const eligibleLoan = calculateEligibility();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
      
      {/* Dynamic Tab Selector */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        gap: '1.5rem',
        overflowX: 'auto',
        paddingBottom: '0.2rem',
      }}>
        {[
          { key: 'details', label: 'Authorized Details' },
          { key: 'plans', label: 'Floor Plans & Pricing' },
          { key: 'calc', label: 'Financial Calculators' },
          { key: 'booking', label: 'Accompanied Site Visit' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '0.8rem 0',
              background: 'none',
              border: 'none',
              color: activeTab === tab.key ? 'var(--gold-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              borderBottom: activeTab === tab.key ? '2px solid var(--gold-primary)' : '2px solid transparent',
              transition: 'var(--transition-smooth)',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div>
        {/* PANEL 1: Details */}
        {activeTab === 'details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1rem' }}>
                Channel Partner Advisory Statement
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                24K Realtors acts as a direct, authorized partner representing this project. We have audited the builder agreement documents and title clear registries. Under our "Transparency over Sales Pressure" guidelines, we provide you direct builder prices with no additional broker charges.
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                backgroundColor: 'rgba(255,255,255,0.02)',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', textTransform: 'uppercase' }}>
                    Builder Trust Rating
                  </span>
                  <span style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>Verified & Certified</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', textTransform: 'uppercase' }}>
                    Title Document Registry
                  </span>
                  <span style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>Clean Title Deed</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', textTransform: 'uppercase' }}>
                    Advisory Representation
                  </span>
                  <span style={{ fontSize: '1.1rem', color: 'var(--gold-primary)', fontWeight: 700 }}>0% Brokerage Fee</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 2: Floor Plans */}
        {activeTab === 'plans' && (
          <div>
            {floorPlans.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Please enquire with our concierge at +91 9673000053 to receive the authorized builder layout map.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                {floorPlans.map((plan) => (
                  <div key={plan.id} className="glass-panel" style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#1b1b22',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-color)',
                        overflow: 'hidden',
                      }}>
                        <img src={plan.imageUrl} alt={plan.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.3rem' }}>{plan.name}</h4>
                        <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Building2 size={14} color="var(--gold-primary)" />
                            {plan.bhk} BHK Configuration
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Ruler size={14} color="var(--gold-primary)" />
                            {plan.sizeSqFt} Sq. Ft. (Super Area)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block' }}>Base Builder Price</span>
                      <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                        {formatIndianPrice(plan.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PANEL 3: Financial Calculators */}
        {activeTab === 'calc' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* EMI Calculator */}
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Calculator size={20} color="var(--gold-primary)" />
                <h4 style={{ color: '#fff', fontSize: '1.15rem' }}>EMI Loan Calculator</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Loan Amount</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{formatIndianPrice(emiPrincipal)}</span>
                  </div>
                  <input
                    type="range"
                    min={Math.round(minPrice * 0.5)}
                    max={Math.round(minPrice * 1.5)}
                    step={100000}
                    value={emiPrincipal}
                    onChange={(e) => setEmiPrincipal(parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: 'var(--gold-primary)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Interest Rate (p.a.)</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{emiRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="15"
                    step="0.1"
                    value={emiRate}
                    onChange={(e) => setEmiRate(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--gold-primary)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Tenure (Years)</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{emiTenure} Years</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={emiTenure}
                    onChange={(e) => setEmiTenure(parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: 'var(--gold-primary)' }}
                  />
                </div>

                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  padding: '1.2rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  textAlign: 'center',
                  marginTop: '0.5rem',
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>
                    Estimated Monthly Payment
                  </span>
                  <span style={{ fontSize: '1.6rem', color: 'var(--gold-primary)', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                    ₹{calculateEMIResult().toLocaleString('en-IN')}/mo
                  </span>
                </div>
              </div>
            </div>

            {/* Stamp Duty & Home Loan Eligibility */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Stamp Duty */}
              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <DollarSign size={18} color="var(--gold-primary)" />
                  Stamp Duty Estimator
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem' }}>State Jurisdiction</label>
                    <select className="form-input" style={{ padding: '0.5rem' }} value={stampState} onChange={(e) => setStampState(e.target.value)}>
                      <option value="MH">Maharashtra</option>
                      <option value="KA">Karnataka</option>
                      <option value="DL">Delhi</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem' }}>Ownership Gender</label>
                    <select className="form-input" style={{ padding: '0.5rem' }} value={stampGender} onChange={(e) => setStampGender(e.target.value as any)}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="joint">Joint</option>
                    </select>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Estimated Stamp Duty:</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{formatIndianPrice(stampResult.stampDuty)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Registration Charges:</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{formatIndianPrice(stampResult.registrationFee)}</span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.3rem 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700 }}>
                    <span style={{ color: 'var(--gold-primary)' }}>Total Taxes:</span>
                    <span style={{ color: 'var(--gold-light)' }}>{formatIndianPrice(stampResult.total)}</span>
                  </div>
                </div>
              </div>

              {/* Home Loan Eligibility */}
              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <HelpCircle size={18} color="var(--gold-primary)" />
                  Home Loan Eligibility
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Monthly Net Salary</span>
                      <span style={{ color: '#fff' }}>{formatIndianPrice(monthlyIncome)}</span>
                    </div>
                    <input
                      type="range"
                      min={50000}
                      max={500000}
                      step={10000}
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(parseInt(e.target.value, 10))}
                      style={{ width: '100%', accentColor: 'var(--gold-primary)' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Existing Monthly EMI Obligations</span>
                      <span style={{ color: '#fff' }}>{formatIndianPrice(existingEmi)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={150000}
                      step={5000}
                      value={existingEmi}
                      onChange={(e) => setExistingEmi(parseInt(e.target.value, 10))}
                      style={{ width: '100%', accentColor: 'var(--gold-primary)' }}
                    />
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  padding: '0.8rem',
                  borderRadius: '6px',
                  border: '1px dashed var(--border-color)',
                  textAlign: 'center',
                }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>Max Loan Eligibility</span>
                  <span style={{ fontSize: '1.25rem', color: eligibleLoan > 0 ? 'var(--success)' : 'var(--error)', fontWeight: 700 }}>
                    {eligibleLoan > 0 ? formatIndianPrice(eligibleLoan) : 'Insufficient Income'}
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* PANEL 4: Site Booking Form */}
        {activeTab === 'booking' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Calendar color="var(--gold-primary)" size={22} />
                  Accompanied Builder Site Visit
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Choose a calendar date and time. Our certified advisor will accompany you to represent your interests directly on site.
                </p>
              </div>

              {bookingStatus === 'success' ? (
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Check size={20} color="var(--success)" />
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>Request Submitted Successfully</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {bookingResponse}
                  </p>
                  <button onClick={() => setBookingStatus('idle')} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Schedule Another Visit
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {bookingStatus === 'error' && (
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
                      <span>{bookingResponse}</span>
                    </div>
                  )}

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="Enter your name"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Mobile Number *</label>
                      <input
                        type="tel"
                        className="form-input"
                        required
                        placeholder="10-digit number"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="name@domain.com"
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Visit Date *</label>
                      <input
                        type="date"
                        className="form-input"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Available Slot *</label>
                      <select
                        className="form-input"
                        required
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                      >
                        <option value="09:00">09:00 AM - Morning</option>
                        <option value="11:00">11:00 AM - Midday</option>
                        <option value="14:00">02:00 PM - Afternoon</option>
                        <option value="16:00">04:00 PM - Evening</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Additional Notes / Specific Requests</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="e.g. Require car pick-up service, interested in specific block layouts..."
                      value={bookingMsg}
                      onChange={(e) => setBookingMsg(e.target.value)}
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-gold"
                    disabled={bookingStatus === 'loading'}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '1rem',
                      marginTop: '0.5rem',
                      opacity: bookingStatus === 'loading' ? 0.75 : 1,
                    }}
                  >
                    {bookingStatus === 'loading' ? 'Assigning Local Advisor...' : 'Request Accompanied Visit'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

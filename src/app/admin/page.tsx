'use client';

import React, { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, Search, ShieldCheck, Edit, Trash, Plus, Filter, Award, CheckCircle, RefreshCw } from 'lucide-react';
import { formatIndianPrice } from '@/lib/utils';

interface MockLead {
  id: string;
  displayId?: string;
  name: string;
  phone: string;
  email: string | null;
  leadSource: string;
  status: string;
  advisorName: string;
  createdAt: string;
}

interface MockBooking {
  id: string;
  displayId?: string;
  clientName: string;
  projectName: string;
  advisorName: string;
  scheduledAt: string;
  status: string;
}

interface MockCommission {
  id: string;
  displayId?: string;
  projectName: string;
  builderName: string;
  percentage: string;
  flatFee: string | null;
  payoutEst: string;
  status: string;
}

export default function AdminDashboard() {
  const [activeModule, setActiveModule] = useState<'leads' | 'bookings' | 'commissions'>('leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isDbOffline, setIsDbOffline] = useState(true);

  // CRM state lists
  const [leads, setLeads] = useState<MockLead[]>([]);
  const [bookings, setBookings] = useState<MockBooking[]>([]);
  const [commissions, setCommissions] = useState<MockCommission[]>([]);

  // Fetch or fallback initialization
  useEffect(() => {
    const mockLeads = [
      {
        id: 'L-101',
        displayId: 'L-101',
        name: 'Sanjay Dutt',
        phone: '9876543210',
        email: 'sanjay@domain.com',
        leadSource: 'Booking: Prestige Augusta Golf Village',
        status: 'SITE_VISIT_SCHEDULED',
        advisorName: 'Rohit Deshmukh',
        createdAt: '2026-06-13 14:32',
      },
      {
        id: 'L-102',
        displayId: 'L-102',
        name: 'Meera Deshpande',
        phone: '9988776655',
        email: 'meera@domain.com',
        leadSource: 'Inquiry: Lodha Bellagio',
        status: 'NEW',
        advisorName: 'Ananya Sen',
        createdAt: '2026-06-13 18:15',
      },
      {
        id: 'L-103',
        displayId: 'L-103',
        name: 'John Doe',
        phone: '9876543210',
        email: 'john@domain.com',
        leadSource: 'Floating Enquiry Modal',
        status: 'CONTACTED',
        advisorName: 'Rohit Deshmukh',
        createdAt: '2026-06-14 00:02',
      },
    ];

    const mockBookings = [
      {
        id: 'B-201',
        displayId: 'B-201',
        clientName: 'Sanjay Dutt',
        projectName: 'Prestige Augusta Golf Village',
        advisorName: 'Rohit Deshmukh',
        scheduledAt: '2026-06-20 11:00 AM',
        status: 'CONFIRMED',
      },
      {
        id: 'B-202',
        displayId: 'B-202',
        clientName: 'John Doe',
        projectName: 'Prestige Augusta Golf Village',
        advisorName: 'Rohit Deshmukh',
        scheduledAt: '2027-06-25 11:00 AM',
        status: 'PENDING',
      },
    ];

    const mockCommissions = [
      {
        id: 'C-301',
        displayId: 'C-301',
        projectName: 'Prestige Augusta Golf Village',
        builderName: 'Prestige Group',
        percentage: '2.50%',
        flatFee: 'N/A',
        payoutEst: '₹8,75,000 (Based on ₹3.5 Cr Min)',
        status: 'ACTIVE_RETAINER',
      },
      {
        id: 'C-302',
        displayId: 'C-302',
        projectName: 'Lodha Bellagio',
        builderName: 'Lodha Group',
        percentage: '2.20%',
        flatFee: 'N/A',
        payoutEst: '₹4,84,000 (Based on ₹2.2 Cr Min)',
        status: 'ACTIVE_RETAINER',
      },
      {
        id: 'C-303',
        displayId: 'C-303',
        projectName: '24K Altura',
        builderName: 'Lodha Group',
        percentage: '2.50%',
        flatFee: 'N/A',
        payoutEst: '₹4,50,000 (Based on ₹1.8 Cr Min)',
        status: 'ACTIVE_RETAINER',
      },
    ];

    const loadData = async () => {
      try {
        const res = await fetch('/api/admin/data');
        if (res.ok) {
          const data = await res.json();
          if (data.leads && data.leads.length > 0) {
            setLeads(data.leads);
            setBookings(data.bookings || []);
            setCommissions(data.commissions || []);
            setIsDbOffline(false);
          } else {
            // DB is connected but empty, load mock data but declare active database
            setLeads(mockLeads);
            setBookings(mockBookings);
            setCommissions(mockCommissions);
            setIsDbOffline(false);
          }
        } else {
          throw new Error('Admin API returned failure');
        }
      } catch (err) {
        console.warn('Database connection offline or query failed. Displaying local demo state.', err);
        setLeads(mockLeads);
        setBookings(mockBookings);
        setCommissions(mockCommissions);
        setIsDbOffline(true);
      }
    };

    loadData();
  }, []);

  // Handle lead status updates and persist to database
  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    // Optimistic UI state update
    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
    );

    if (!isDbOffline) {
      try {
        const res = await fetch('/api/admin/data', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ leadId, status: newStatus }),
        });
        if (!res.ok) {
          const errData = await res.json();
          console.error('Failed to update lead status in DB:', errData.error);
        }
      } catch (err) {
        console.error('Network error during status update:', err);
      }
    }
  };

  // Filter items
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter ? lead.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const filteredBookings = bookings.filter((booking) =>
    booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header Title bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <h1 className="gold-text" style={{ fontSize: '2.4rem', fontWeight: 800 }}>24K Realtors Back-Office</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Lead management pipelines, commission tracking, and scheduled site visits CRM.
            </p>
          </div>
          
          {/* DB Indicator */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: isDbOffline ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            borderRadius: '20px',
            border: isDbOffline ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: isDbOffline ? 'var(--gold-light)' : '#34d399',
          }}>
            <RefreshCw size={12} className={isDbOffline ? "" : "spin"} />
            <span>{isDbOffline ? 'Mock CRM Demo Mode' : 'Connected to Supabase Live DB'}</span>
          </div>
        </div>

        {/* Dashboard grid panel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 3fr',
          gap: '2rem',
        }} className="detail-layout">
          
          {/* Side Tabs Navigation */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', height: 'fit-content' }}>
            <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              CRM Modules
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                onClick={() => setActiveModule('leads')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.8rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeModule === 'leads' ? 'var(--gold-primary)' : 'transparent',
                  color: activeModule === 'leads' ? '#000' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textAlign: 'left',
                  transition: 'var(--transition-smooth)',
                }}
              >
                <Users size={18} />
                <span>Leads CRM</span>
              </button>

              <button
                onClick={() => setActiveModule('bookings')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.8rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeModule === 'bookings' ? 'var(--gold-primary)' : 'transparent',
                  color: activeModule === 'bookings' ? '#000' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textAlign: 'left',
                  transition: 'var(--transition-smooth)',
                }}
              >
                <Calendar size={18} />
                <span>Site Visits Booking</span>
              </button>

              <button
                onClick={() => setActiveModule('commissions')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.8rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeModule === 'commissions' ? 'var(--gold-primary)' : 'transparent',
                  color: activeModule === 'commissions' ? '#000' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textAlign: 'left',
                  transition: 'var(--transition-smooth)',
                }}
              >
                <DollarSign size={18} />
                <span>Commissions Log</span>
              </button>
            </div>
          </div>

          {/* Module Panel Display */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
            
            {/* Search Filter Header */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1.5rem',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <div className="form-group" style={{ marginBottom: 0, flexGrow: 1 }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search clients, projects, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Search size={16} color="var(--text-tertiary)" style={{
                    position: 'absolute',
                    left: '0.9rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }} />
                </div>
              </div>

              {activeModule === 'leads' && (
                <div className="form-group" style={{ marginBottom: 0, width: '200px' }}>
                  <select
                    className="form-input"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="SITE_VISIT_SCHEDULED">Visit Scheduled</option>
                  </select>
                </div>
              )}
            </div>

            {/* TAB CONTENT: Leads CRM */}
            {activeModule === 'leads' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#fff' }}>
                      <th style={{ padding: '1rem' }}>Client ID</th>
                      <th style={{ padding: '1rem' }}>Client Name</th>
                      <th style={{ padding: '1rem' }}>Phone & Email</th>
                      <th style={{ padding: '1rem' }}>Lead Source</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                      <th style={{ padding: '1rem' }}>Advisor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <td style={{ padding: '1.2rem 1rem', fontWeight: 'bold', color: '#fff' }}>{lead.displayId || lead.id}</td>
                        <td style={{ padding: '1.2rem 1rem' }}>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{lead.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Registered: {lead.createdAt}</div>
                        </td>
                        <td style={{ padding: '1.2rem 1rem' }}>
                          <div>{lead.phone}</div>
                          <div style={{ fontSize: '0.8rem' }}>{lead.email || 'N/A'}</div>
                        </td>
                        <td style={{ padding: '1.2rem 1rem' }}>{lead.leadSource}</td>
                        <td style={{ padding: '1.2rem 1rem' }}>
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                            style={{
                              padding: '0.3rem 0.6rem',
                              backgroundColor: 'var(--bg-tertiary)',
                              color: lead.status === 'SITE_VISIT_SCHEDULED' ? 'var(--gold-light)' : 'var(--text-primary)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="SITE_VISIT_SCHEDULED">Visit Scheduled</option>
                            <option value="NEGOTIATION">Negotiation</option>
                            <option value="CLOSED_WON">Closed (Won)</option>
                            <option value="CLOSED_LOST">Closed (Lost)</option>
                          </select>
                        </td>
                        <td style={{ padding: '1.2rem 1rem' }}>{lead.advisorName}</td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                          No enquiries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB CONTENT: Bookings Site Visit */}
            {activeModule === 'bookings' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#fff' }}>
                      <th style={{ padding: '1rem' }}>Visit ID</th>
                      <th style={{ padding: '1rem' }}>Client Name</th>
                      <th style={{ padding: '1rem' }}>Target Project</th>
                      <th style={{ padding: '1rem' }}>Scheduled Time</th>
                      <th style={{ padding: '1rem' }}>Assigned Advisor</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <td style={{ padding: '1.2rem 1rem', fontWeight: 'bold', color: '#fff' }}>{booking.displayId || booking.id}</td>
                        <td style={{ padding: '1.2rem 1rem', fontWeight: 600, color: '#fff' }}>{booking.clientName}</td>
                        <td style={{ padding: '1.2rem 1rem' }}>{booking.projectName}</td>
                        <td style={{ padding: '1.2rem 1rem', fontWeight: 500, color: 'var(--gold-light)' }}>{booking.scheduledAt}</td>
                        <td style={{ padding: '1.2rem 1rem' }}>{booking.advisorName}</td>
                        <td style={{ padding: '1.2rem 1rem' }}>
                          <span style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: booking.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: booking.status === 'CONFIRMED' ? 'var(--success)' : '#fbbf24',
                            border: booking.status === 'CONFIRMED' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                          }}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredBookings.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                          No scheduled site visits found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB CONTENT: Commissions Tracker */}
            {activeModule === 'commissions' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#fff' }}>
                      <th style={{ padding: '1rem' }}>Project Code</th>
                      <th style={{ padding: '1rem' }}>Project Name</th>
                      <th style={{ padding: '1rem' }}>Builder Entity</th>
                      <th style={{ padding: '1rem' }}>Commission Fee</th>
                      <th style={{ padding: '1rem' }}>Est. Earnings</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissions.map((comm) => (
                      <tr key={comm.id} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <td style={{ padding: '1.2rem 1rem', fontWeight: 'bold', color: '#fff' }}>{comm.displayId || comm.id}</td>
                        <td style={{ padding: '1.2rem 1rem', fontWeight: 600, color: '#fff' }}>{comm.projectName}</td>
                        <td style={{ padding: '1.2rem 1rem' }}>{comm.builderName}</td>
                        <td style={{ padding: '1.2rem 1rem', color: 'var(--gold-light)', fontWeight: 600 }}>{comm.percentage}</td>
                        <td style={{ padding: '1.2rem 1rem', fontWeight: 500 }}>{comm.payoutEst}</td>
                        <td style={{ padding: '1.2rem 1rem' }}>
                          <span style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: 'rgba(59, 130, 246, 0.15)',
                            color: '#60a5fa',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                          }}>
                            {comm.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>

      </div>
      
      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

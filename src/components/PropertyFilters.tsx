'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, RotateCcw, SlidersHorizontal, MapPin } from 'lucide-react';

interface FiltersProps {
  initialFilters: {
    type: string;
    status: string;
    minPrice: string;
    maxPrice: string;
    bhk: string;
    microMarket: string;
    query: string;
  };
  microMarkets: string[];
}

export default function PropertyFilters({ initialFilters, microMarkets }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local component states
  const [query, setQuery] = useState(initialFilters.query);
  const [type, setType] = useState(initialFilters.type);
  const [status, setStatus] = useState(initialFilters.status);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [microMarket, setMicroMarket] = useState(initialFilters.microMarket);
  const [selectedBhks, setSelectedBhks] = useState<string[]>(
    initialFilters.bhk ? initialFilters.bhk.split(',') : []
  );

  // Sync state if URL changes externally
  useEffect(() => {
    setQuery(initialFilters.query);
    setType(initialFilters.type);
    setStatus(initialFilters.status);
    setMinPrice(initialFilters.minPrice);
    setMaxPrice(initialFilters.maxPrice);
    setMicroMarket(initialFilters.microMarket);
    setSelectedBhks(initialFilters.bhk ? initialFilters.bhk.split(',') : []);
  }, [initialFilters]);

  // Update query parameters in the URL
  const applyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (query) params.set('query', query);
      if (type) params.set('type', type);
      if (status) params.set('status', status);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (microMarket) params.set('microMarket', microMarket);
      if (selectedBhks.length > 0) params.set('bhk', selectedBhks.join(','));
      
      router.push(`/?${params.toString()}`, { scroll: false });
    });
  };

  const resetFilters = () => {
    setQuery('');
    setType('');
    setStatus('');
    setMinPrice('');
    setMaxPrice('');
    setMicroMarket('');
    setSelectedBhks([]);
    startTransition(() => {
      router.push('/', { scroll: false });
    });
  };

  const handleBhkChange = (bhkVal: string) => {
    setSelectedBhks((prev) =>
      prev.includes(bhkVal) ? prev.filter((b) => b !== bhkVal) : [...prev, bhkVal]
    );
  };

  return (
    <div className="glass-panel" style={{
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '3rem',
      boxShadow: 'var(--shadow-premium)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <SlidersHorizontal size={20} color="var(--gold-primary)" />
          <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>Discovery Filter Engine</h3>
        </div>
        
        <button
          onClick={resetFilters}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            transition: 'var(--transition-smooth)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <RotateCcw size={14} />
          Reset Filters
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        alignItems: 'end',
      }}>
        {/* Keyword Search */}
        <div className="form-group">
          <label>Project Keyword</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Prestige, Powai, Altura..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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

        {/* Micro Market */}
        <div className="form-group">
          <label>Micro-Market Region</label>
          <select
            className="form-input"
            value={microMarket}
            onChange={(e) => setMicroMarket(e.target.value)}
            style={{ appearance: 'none' }}
          >
            <option value="">All Regions</option>
            {microMarkets.map((market) => (
              <option key={market} value={market}>
                {market}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div className="form-group">
          <label>Property Category</label>
          <select
            className="form-input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="APARTMENT">Apartments</option>
            <option value="VILLA">Villas</option>
            <option value="PLOT">Plots / Land</option>
            <option value="COMMERCIAL">Commercial Spaces</option>
          </select>
        </div>

        {/* Construction Status */}
        <div className="form-group">
          <label>Construction Status</label>
          <select
            className="form-input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="NEW_LAUNCH">New Launch</option>
            <option value="UNDER_CONSTRUCTION">Under Construction</option>
            <option value="READY_TO_MOVE">Ready To Move</option>
          </select>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2.5rem',
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-color)',
        alignItems: 'center',
      }}>
        {/* BHK Configurations */}
        <div>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: '0.6rem',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            BHK Layout Configuration
          </label>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            {['2', '3', '4'].map((val) => (
              <button
                key={val}
                onClick={() => handleBhkChange(val)}
                style={{
                  flex: 1,
                  padding: '0.6rem 0',
                  backgroundColor: selectedBhks.includes(val) ? 'var(--gold-primary)' : 'var(--bg-tertiary)',
                  color: selectedBhks.includes(val) ? '#000' : 'var(--text-primary)',
                  border: '1px solid',
                  borderColor: selectedBhks.includes(val) ? 'var(--gold-primary)' : 'var(--border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'var(--transition-smooth)',
                }}
              >
                {val} BHK
              </button>
            ))}
          </div>
        </div>

        {/* Budget Range Inputs */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }} className="form-group">
            <label>Min Budget (INR)</label>
            <select
              className="form-input"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            >
              <option value="">No Min</option>
              <option value="5000000">50 Lakhs</option>
              <option value="10000000">1 Crore</option>
              <option value="20000000">2 Crores</option>
              <option value="30000000">3 Crores</option>
              <option value="50000000">5 Crores</option>
            </select>
          </div>
          <div style={{ flex: 1 }} className="form-group">
            <label>Max Budget (INR)</label>
            <select
              className="form-input"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            >
              <option value="">No Max</option>
              <option value="15000000">1.5 Crores</option>
              <option value="25000000">2.5 Crores</option>
              <option value="35000000">3.5 Crores</option>
              <option value="50000000">5 Crores</option>
              <option value="100000000">10 Crores</option>
            </select>
          </div>
        </div>

        {/* Apply Trigger Button */}
        <div>
          <button
            onClick={applyFilters}
            disabled={isPending}
            className="btn-gold"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.9rem',
              marginTop: '0.5rem',
              opacity: isPending ? 0.75 : 1,
            }}
          >
            {isPending ? 'Searching Inventory...' : 'Apply Filters'}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, BedDouble, ShieldCheck, Home } from 'lucide-react';
import { formatIndianPrice } from '@/lib/utils';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    slug: string;
    propertyType: string;
    constructionStatus: string;
    minPrice: number | string;
    maxPrice: number | string;
    bhkConfig: number[];
    microMarket: string;
    locality: string;
    city: string;
    reraNumber: string;
    builder: {
      name: string;
      logoUrl: string | null;
    };
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Select stock real estate photos based on property type to ensure high visual quality
  const getStockImage = (type: string) => {
    switch (type) {
      case 'VILLA':
        return 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&auto=format&fit=crop&q=80';
      case 'PLOT':
        return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80';
      case 'COMMERCIAL':
        return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80';
      case 'APARTMENT':
      default:
        return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';
    }
  };

  const statusClass = (status: string) => {
    switch (status) {
      case 'READY_TO_MOVE':
        return 'badge-ready';
      case 'UNDER_CONSTRUCTION':
        return 'badge-construction';
      case 'NEW_LAUNCH':
      default:
        return 'badge-new';
    }
  };

  const statusLabel = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <div className="glass-panel" style={{
      borderRadius: '16px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'var(--transition-bounce)',
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit',
    }}>
      <Link href={`/properties/${property.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Cover Image */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          overflow: 'hidden',
          backgroundColor: '#202024',
        }}>
          <img
            src={getStockImage(property.propertyType)}
            alt={property.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
          {/* Badges on Image */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            zIndex: 2,
          }}>
            <span className={`badge-status ${statusClass(property.constructionStatus)}`}>
              {statusLabel(property.constructionStatus)}
            </span>
          </div>
          
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 2,
            backgroundColor: 'rgba(0,0,0,0.85)',
            border: '1px solid rgba(197, 160, 89, 0.4)',
            borderRadius: '20px',
            padding: '0.3rem 0.8rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--gold-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            backdropFilter: 'blur(4px)',
          }}>
            <ShieldCheck size={14} color="var(--gold-primary)" />
            <span>RERA VERIFIED</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
          
          {/* Builder & Location */}
          <div>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--gold-primary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {property.builder.name}
            </span>
            <h3 style={{
              fontSize: '1.35rem',
              color: '#fff',
              marginTop: '0.2rem',
              lineHeight: '1.3',
              fontWeight: 700,
            }}>
              {property.title}
            </h3>
          </div>

          {/* Micro-market & Locality */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <MapPin size={16} color="var(--gold-primary)" style={{ flexShrink: 0 }} />
            <span>{property.locality}, {property.microMarket}</span>
          </div>

          {/* Configuration */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.8rem 0',
            borderTop: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)',
            margin: '0.2rem 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <Home size={16} />
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                {property.propertyType.charAt(0) + property.propertyType.slice(1).toLowerCase()}
              </span>
            </div>
            
            {property.bhkConfig.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <BedDouble size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {property.bhkConfig.join('/')} BHK Configurations
                </span>
              </div>
            )}
          </div>

          {/* Price Range & Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
          }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'block', textTransform: 'uppercase' }}>
                Verified Advisory Pricing
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>
                {formatIndianPrice(property.minPrice)} - {formatIndianPrice(property.maxPrice)}
              </span>
            </div>

            <span className="btn-gold" style={{
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              borderRadius: '4px',
            }}>
              View Project
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

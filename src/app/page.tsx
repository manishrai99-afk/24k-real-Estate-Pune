import React from 'react';
import { db } from '@/lib/db';
import PropertyFilters from '@/components/PropertyFilters';
import PropertyCard from '@/components/PropertyCard';
import { PropertyType, ConstructionStatus } from '@prisma/client';
import { Star, ShieldAlert, Award, FileText, CheckCircle } from 'lucide-react';

// Static Fallback Data if PostgreSQL connection is not active/migrated yet
const FALLBACK_PROPERTIES = [
  {
    id: 'p1',
    title: 'Prestige Augusta Golf Village',
    slug: 'prestige-augusta-golf-village',
    propertyType: 'VILLA',
    constructionStatus: 'READY_TO_MOVE',
    minPrice: 35000000,
    maxPrice: 65000000,
    bhkConfig: [3, 4],
    microMarket: 'Whitefield',
    locality: 'Hennur Road',
    city: 'Bangalore',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/171015/000200',
    builder: { name: 'Prestige Group', logoUrl: null },
  },
  {
    id: 'p2',
    title: 'Lodha Bellagio',
    slug: 'lodha-bellagio',
    propertyType: 'APARTMENT',
    constructionStatus: 'UNDER_CONSTRUCTION',
    minPrice: 22000000,
    maxPrice: 48000000,
    bhkConfig: [2, 3, 4],
    microMarket: 'Powai',
    locality: 'Saki Vihar Road',
    city: 'Mumbai',
    reraNumber: 'P51800033966',
    builder: { name: 'Lodha Group', logoUrl: null },
  },
  {
    id: 'p3',
    title: '24K Altura',
    slug: '24k-altura',
    propertyType: 'APARTMENT',
    constructionStatus: 'NEW_LAUNCH',
    minPrice: 18000000,
    maxPrice: 32000000,
    bhkConfig: [3, 4],
    microMarket: 'Baner',
    locality: 'Baner-Balewadi Link Road',
    city: 'Pune',
    reraNumber: 'P52100030502',
    builder: { name: 'Lodha Group', logoUrl: null },
  },
];

const FALLBACK_MICRO_MARKETS = ['Whitefield', 'Powai', 'Baner', 'Gachibowli', 'New Chandigarh'];

const TESTIMONIALS = [
  {
    name: 'Sanjay Dutt',
    role: 'Golf Villa Owner',
    text: 'Absolute transparent guidance from Manish. Buying my golf villa was completely stress-free without any sales push.',
    rating: 5,
  },
  {
    name: 'Meera Deshpande',
    role: 'Powai Resident',
    text: 'Verifiably the most honest consultants in the market. Guided me away from unapproved projects directly to Lodha Powai.',
    rating: 5,
  },
  {
    name: 'Rohan Malhotra',
    role: 'Plot Investor',
    text: 'No sales push, just pure data. They helped verify the DTCP approvals before I signed any documents. Highly recommended.',
    rating: 5,
  },
];

interface HomeProps {
  searchParams: Promise<{
    type?: string;
    status?: string;
    minPrice?: string;
    maxPrice?: string;
    bhk?: string;
    microMarket?: string;
    query?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedParams = await searchParams;
  const filterType = resolvedParams.type || '';
  const filterStatus = resolvedParams.status || '';
  const filterMinPrice = resolvedParams.minPrice || '';
  const filterMaxPrice = resolvedParams.maxPrice || '';
  const filterBhk = resolvedParams.bhk || '';
  const filterMicroMarket = resolvedParams.microMarket || '';
  const filterQuery = resolvedParams.query || '';

  let properties = [];
  let microMarkets = FALLBACK_MICRO_MARKETS;
  let isFallback = false;

  try {
    // 1. Build Query Condition
    const where: any = {};

    if (filterType && Object.values(PropertyType).includes(filterType as PropertyType)) {
      where.propertyType = filterType as PropertyType;
    }

    if (filterStatus && Object.values(ConstructionStatus).includes(filterStatus as ConstructionStatus)) {
      where.constructionStatus = filterStatus as ConstructionStatus;
    }

    if (filterMinPrice || filterMaxPrice) {
      where.minPrice = { gte: filterMinPrice ? parseFloat(filterMinPrice) : 0 };
      if (filterMaxPrice) {
        where.maxPrice = { lte: parseFloat(filterMaxPrice) };
      }
    }

    if (filterBhk) {
      const bhkList = filterBhk.split(',').map((b) => parseInt(b, 10)).filter((b) => !isNaN(b));
      if (bhkList.length > 0) {
        where.bhkConfig = { hasSome: bhkList };
      }
    }

    if (filterMicroMarket) {
      where.microMarket = { equals: filterMicroMarket, mode: 'insensitive' };
    }

    if (filterQuery) {
      where.OR = [
        { title: { contains: filterQuery, mode: 'insensitive' } },
        { description: { contains: filterQuery, mode: 'insensitive' } },
        { locality: { contains: filterQuery, mode: 'insensitive' } },
        { reraNumber: { contains: filterQuery, mode: 'insensitive' } },
        { builder: { name: { contains: filterQuery, mode: 'insensitive' } } },
      ];
    }

    // 2. Fetch live data
    const rawProperties = await db.property.findMany({
      where,
      include: {
        builder: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Serialize Decimal fields so they can be passed to Client Components
    properties = rawProperties.map((p) => ({
      ...p,
      minPrice: (p.minPrice as any).toNumber ? (p.minPrice as any).toNumber() : Number(p.minPrice),
      maxPrice: (p.maxPrice as any).toNumber ? (p.maxPrice as any).toNumber() : Number(p.maxPrice),
    }));

    // Fetch distinct micro-markets for filters
    const allProps = await db.property.findMany({ select: { microMarket: true } });
    const uniqueMarkets = Array.from(new Set(allProps.map((p) => p.microMarket))).filter(Boolean);
    if (uniqueMarkets.length > 0) {
      microMarkets = uniqueMarkets;
    }
  } catch (error) {
    console.warn('PostgreSQL database query failed or pending migrations. Falling back to local static mock data.', error);
    isFallback = true;
    
    // Filter fallback data client-side for immediate demo correctness
    properties = FALLBACK_PROPERTIES.filter((p) => {
      if (filterType && p.propertyType !== filterType) return false;
      if (filterStatus && p.constructionStatus !== filterStatus) return false;
      if (filterMinPrice && p.minPrice < parseFloat(filterMinPrice)) return false;
      if (filterMaxPrice && p.maxPrice > parseFloat(filterMaxPrice)) return false;
      if (filterMicroMarket && p.microMarket.toLowerCase() !== filterMicroMarket.toLowerCase()) return false;
      if (filterBhk) {
        const bhkList = filterBhk.split(',').map((b) => parseInt(b, 10));
        const hasMatch = bhkList.some((b) => p.bhkConfig.includes(b));
        if (!hasMatch) return false;
      }
      if (filterQuery) {
        const queryLower = filterQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(queryLower);
        const matchesLoc = p.locality.toLowerCase().includes(queryLower);
        const matchesBuilder = p.builder.name.toLowerCase().includes(queryLower);
        if (!matchesTitle && !matchesLoc && !matchesBuilder) return false;
      }
      return true;
    });
  }

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Fallback Banner Alert */}
      {isFallback && (
        <div style={{
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          padding: '0.75rem 1rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--gold-light)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <ShieldAlert size={16} />
          <span>Running in local demonstration mode with simulated catalog. Setup PostgreSQL to enable live CRM sync.</span>
        </div>
      )}

      {/* Hero Section */}
      <section style={{
        padding: '6rem 0 4rem 0',
        background: 'radial-gradient(circle at 50% 20%, rgba(197, 160, 89, 0.08) 0%, transparent 60%)',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: '30px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            <Award size={14} color="var(--gold-primary)" />
            <span>Authorized Developer Channel Partner</span>
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            lineHeight: '1.2',
            fontWeight: 800,
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em',
          }}>
            Transparency Over <span className="gold-text">Sales Pressure</span>
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            maxWidth: '650px',
            margin: '0 auto 2.5rem auto',
            lineHeight: '1.6',
          }}>
            Welcome to <strong style={{ color: '#fff' }}>24K Realtors</strong>. We curate premium, RERA-approved residential developments directly from verified builders. Honest guidance, zero spam.
          </p>
        </div>
      </section>

      {/* Discovery Filters Container */}
      <section className="container">
        <PropertyFilters
          initialFilters={{
            type: filterType,
            status: filterStatus,
            minPrice: filterMinPrice,
            maxPrice: filterMaxPrice,
            bhk: filterBhk,
            microMarket: filterMicroMarket,
            query: filterQuery,
          }}
          microMarkets={microMarkets}
        />
      </section>

      {/* Property Listings Grid */}
      <section className="container" style={{ minHeight: '300px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
            Featured Verified Listings ({properties.length})
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing directly-negotiated builder contracts
          </span>
        </div>

        {properties.length === 0 ? (
          <div className="glass-panel" style={{
            borderRadius: '12px',
            padding: '4rem 2rem',
            textAlign: 'center',
            color: 'var(--text-secondary)',
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No projects matched your selected filtering parameters.</p>
            <a href="/" className="btn-outline" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
              Clear Search Criteria
            </a>
          </div>
        ) : (
          <div className="grid-listings">
            {properties.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Brand Value Pillars */}
      <section style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '5rem 0',
        marginTop: '6rem',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '1rem' }}>
              The <span className="gold-text">24K Purity</span> Customer Service Standard
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Real estate represents your largest lifetime asset. We guarantee a client advisory lifecycle built entirely on integrity.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
          }}>
            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '12px', background: 'var(--bg-primary)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: 'rgba(197, 160, 89, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <CheckCircle size={24} color="var(--gold-primary)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.8rem' }}>100% RERA Validation</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Every villa, commercial complex, or plot on our platform displays a valid, active local state authority RERA registration ID. No speculative launches.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '12px', background: 'var(--bg-primary)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: 'rgba(197, 160, 89, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <FileText size={24} color="var(--gold-primary)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.8rem' }}>Zero Sales Pressure</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Our advisors are structured as property consultants, not hard-sales agents. We provide transparent pros and cons for each locality and builders track records.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '12px', background: 'var(--bg-primary)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: 'rgba(197, 160, 89, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <Award size={24} color="var(--gold-primary)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.8rem' }}>Direct Builder Channels</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Working directly as official builders partner allows us to secure inventory bookings, launch price tables, and direct discount options straight to clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container" style={{ marginTop: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <span style={{ color: 'var(--gold-primary)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Client Endorsements
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginTop: '0.5rem' }}>
            Verified Client Reviews
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem',
        }}>
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="glass-panel" style={{
              padding: '2rem',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--gold-primary)" color="var(--gold-primary)" />
                ))}
              </div>
              
              <p style={{
                fontStyle: 'italic',
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                flexGrow: 1,
              }}>
                "{t.text}"
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{t.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)' }}>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

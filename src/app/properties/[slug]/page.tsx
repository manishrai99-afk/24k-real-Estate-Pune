import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import PropertyInteractiveTools from '@/components/PropertyInteractiveTools';
import { formatIndianPrice } from '@/lib/utils';
import { Shield, MapPin, Building, Calendar, MessageCircle, FileText, ArrowLeft, ArrowUpRight, PhoneCall } from 'lucide-react';
import Link from 'next/link';

// Static Fallback details if DB is not setup yet
const FALLBACK_DETAILS: Record<string, any> = {
  'prestige-augusta-golf-village': {
    id: 'p1',
    title: 'Prestige Augusta Golf Village',
    slug: 'prestige-augusta-golf-village',
    description: 'Augusta Golf Village is the ultimate luxury answer for individuals who value exclusivity. Fully complete 3 and 4 BHK villas nestled within a ready, spectacular 9-hole golf course.',
    propertyType: 'VILLA',
    constructionStatus: 'READY_TO_MOVE',
    minPrice: 35000000,
    maxPrice: 65000000,
    bhkConfig: [3, 4],
    microMarket: 'Whitefield',
    locality: 'Hennur Road',
    city: 'Bangalore',
    state: 'Karnataka',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/171015/000200',
    builder: { name: 'Prestige Group', logoUrl: null },
    floorPlans: [
      {
        id: 'fp1',
        name: 'Royal Executive Villa (3 BHK)',
        bhk: 3,
        sizeSqFt: 3500,
        price: 35000000,
        imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500',
      },
      {
        id: 'fp2',
        name: 'Presidential Golf Villa (4 BHK)',
        bhk: 4,
        sizeSqFt: 5400,
        price: 65000000,
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
      },
    ],
  },
  'lodha-bellagio': {
    id: 'p2',
    title: 'Lodha Bellagio',
    slug: 'lodha-bellagio',
    description: 'Lodha Bellagio offers European-inspired imperial living on Powai hillside. Experience stunning panoramic lake views, ultra-spacious decks, and high-fidelity custom design systems.',
    propertyType: 'APARTMENT',
    constructionStatus: 'UNDER_CONSTRUCTION',
    minPrice: 22000000,
    maxPrice: 48000000,
    bhkConfig: [2, 3, 4],
    microMarket: 'Powai',
    locality: 'Saki Vihar Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    reraNumber: 'P51800033966',
    builder: { name: 'Lodha Group', logoUrl: null },
    floorPlans: [
      {
        id: 'fp3',
        name: 'Imperial Suite (2 BHK)',
        bhk: 2,
        sizeSqFt: 1250,
        price: 22000000,
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500',
      },
      {
        id: 'fp4',
        name: 'Grand Lakeside Vista (3 BHK)',
        bhk: 3,
        sizeSqFt: 1850,
        price: 35000000,
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
      },
    ],
  },
  '24k-altura': {
    id: 'p3',
    title: '24K Altura',
    slug: '24k-altura',
    description: '24K Altura introduces structural poetry to Pune. Curated boutique homes featuring Italian marble flooring, biometric entrance validation, and customized home-automation networks.',
    propertyType: 'APARTMENT',
    constructionStatus: 'NEW_LAUNCH',
    minPrice: 18000000,
    maxPrice: 32000000,
    bhkConfig: [3, 4],
    microMarket: 'Baner',
    locality: 'Baner-Balewadi Link Road',
    city: 'Pune',
    state: 'Maharashtra',
    reraNumber: 'P52100030502',
    builder: { name: 'Lodha Group', logoUrl: null },
    floorPlans: [
      {
        id: 'fp5',
        name: 'Altura Penthouse Suite (4 BHK)',
        bhk: 4,
        sizeSqFt: 2900,
        price: 32000000,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
      },
    ],
  },
};

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  let property = null;

  try {
    // 1. Query DB
    const dbProperty = await db.property.findUnique({
      where: { slug },
      include: {
        builder: { select: { name: true, logoUrl: true } },
        floorPlans: true,
      },
    });
    // Serialize Decimal fields to plain numbers for Client Component compatibility
    if (dbProperty) {
      property = {
        ...dbProperty,
        minPrice: (dbProperty.minPrice as any).toNumber ? (dbProperty.minPrice as any).toNumber() : Number(dbProperty.minPrice),
        maxPrice: (dbProperty.maxPrice as any).toNumber ? (dbProperty.maxPrice as any).toNumber() : Number(dbProperty.maxPrice),
        floorPlans: dbProperty.floorPlans.map((fp) => ({
          ...fp,
          price: (fp.price as any).toNumber ? (fp.price as any).toNumber() : Number(fp.price),
        })),
      };
    }
  } catch (error) {
    console.warn('Database offline, reading static fallback files for slug:', slug);
  }

  // 2. Fallback to static mock data if DB query fails/empty
  if (!property) {
    property = FALLBACK_DETAILS[slug] || null;
  }

  if (!property) {
    notFound();
  }

  // Select header cover image based on property type
  const getCoverImage = (type: string) => {
    switch (type) {
      case 'VILLA':
        return 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80';
      case 'PLOT':
        return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80';
      case 'COMMERCIAL':
        return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80';
      case 'APARTMENT':
      default:
        return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80';
    }
  };

  const formattedMinPrice = formatIndianPrice(property.minPrice);
  const formattedMaxPrice = formatIndianPrice(property.maxPrice);

  // RERA Portal lookup URL
  const reraSearchUrl = 'https://maharerait.maharashtra.gov.in/searchlist/search';

  // Dynamic WhatsApp Link Generation
  const whatsappMsg = `Hello 24K Realtors, I am interested in viewing the project *${property.title}* (RERA: ${property.reraNumber}). Please share the verified layout map and pricing details.`;
  const whatsappUrl = `https://wa.me/919673000053?text=${encodeURIComponent(whatsappMsg)}`;

  // Google JSON-LD schema
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'SingleFamilyResidence',
    'name': property.title,
    'description': property.description,
    'image': [getCoverImage(property.propertyType)],
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': property.microMarket,
      'addressRegion': property.state,
      'addressCountry': 'IN',
    },
    'offers': {
      '@type': 'AggregateOffer',
      'priceCurrency': 'INR',
      'lowPrice': property.minPrice.toString(),
      'highPrice': property.maxPrice.toString(),
      'seller': {
        '@type': 'RealEstateAgent',
        'name': '24K Realtors',
        'telephone': '+919673000053',
        'url': 'https://www.24krealtors.com',
      },
    },
  };

  return (
    <div style={{ paddingBottom: '5rem' }}>
      
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* Hero Header Back Drop */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        overflow: 'hidden',
        backgroundColor: '#0a0a0c',
      }}>
        <img
          src={getCoverImage(property.propertyType)}
          alt={property.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.55,
          }}
        />
        
        {/* Soft shadow overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)',
          zIndex: 1,
        }} />

        {/* Back navigation & Float CTAs */}
        <div className="container" style={{
          position: 'absolute',
          top: '2rem',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}>
          <Link href="/" className="btn-back">
            <ArrowLeft size={16} />
            Back to Catalog
          </Link>
        </div>
      </div>

      {/* Main Container Info */}
      <section className="container" style={{ marginTop: '-4rem', position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gap: '3rem',
          alignItems: 'start',
        }} className="detail-layout">
          
          {/* Left Column: Heading and Details */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{
                color: 'var(--gold-primary)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {property.builder.name} • Authorized Listing
              </span>
              <h1 style={{ fontSize: '2.8rem', color: '#fff', fontWeight: 800 }}>
                {property.title}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginTop: '0.3rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  <MapPin size={16} color="var(--gold-primary)" />
                  {property.locality}, {property.microMarket}, {property.city}
                </span>
                
                {/* RERA compliance box */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.8rem',
                  backgroundColor: 'rgba(197, 160, 89, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(197, 160, 89, 0.25)',
                  fontSize: '0.85rem',
                }}>
                  <Shield size={14} color="var(--gold-primary)" />
                  <span style={{ color: '#fff', fontWeight: 600 }}>RERA ID:</span>
                  <a
                    href={reraSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--gold-light)',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                    }}
                  >
                    {property.reraNumber}
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            </div>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: '1.8',
              marginBottom: '3rem',
            }}>
              {property.description}
            </p>

            {/* Interactive Tool Panel (Calculators, booking) */}
            <PropertyInteractiveTools
              propertyId={property.id}
              propertyTitle={property.title}
              minPrice={property.minPrice}
              floorPlans={property.floorPlans || []}
            />
          </div>

          {/* Right Column: Pricing & Advisor Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Quick Price card */}
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block' }}>
                Verified Launch Pricing
              </span>
              <span style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: '#fff',
                fontFamily: 'var(--font-display)',
                display: 'block',
                margin: '0.3rem 0 1.5rem 0',
              }}>
                {formattedMinPrice} - {formattedMaxPrice}
              </span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{
                  justifyContent: 'center',
                  padding: '1rem',
                  width: '100%',
                }}>
                  <MessageCircle size={18} />
                  <span>Enquire on WhatsApp</span>
                </a>
                
                <a href="tel:+919673000053" className="btn-outline" style={{
                  justifyContent: 'center',
                  padding: '1rem',
                  width: '100%',
                }}>
                  <PhoneCall size={18} />
                  <span>Call Advisory Helpline</span>
                </a>
              </div>

              <div style={{
                marginTop: '1.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
              }}>
                <Shield size={12} />
                <span>Authorized Builder Price List</span>
              </div>
            </div>

            {/* Why advisory card */}
            <div className="glass-panel" style={{
              padding: '2rem',
              borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.01)',
            }}>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building size={18} color="var(--gold-primary)" />
                Direct Builder Benefits
              </h3>
              
              <ul style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'start' }}>
                  <span style={{ color: 'var(--gold-primary)', fontWeight: 'bold' }}>✓</span>
                  <span><strong>Priority Booking Queue:</strong> Immediate floor allotment selection during launches.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'start' }}>
                  <span style={{ color: 'var(--gold-primary)', fontWeight: 'bold' }}>✓</span>
                  <span><strong>Zero Advisory Charges:</strong> Representing you directly under authorized builder mandates.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'start' }}>
                  <span style={{ color: 'var(--gold-primary)', fontWeight: 'bold' }}>✓</span>
                  <span><strong>Legal Oversight:</strong> Accompanying your registry checks and title searches at no additional cost.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>
      
    </div>
  );
}

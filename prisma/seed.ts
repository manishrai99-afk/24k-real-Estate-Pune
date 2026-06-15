import { PrismaClient, Role, PropertyType, ConstructionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.adminActivity.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.floorPlan.deleteMany();
  await prisma.propertyAmenity.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.property.deleteMany();
  await prisma.builder.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding users/advisors...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@24krealtors.com',
      passwordHash: '$2b$10$g16x32289fG9B4.1x7oDceYg9K8W9rV.y2Z6fS5wRzE3M94Ff8.Oq', // 'password'
      name: 'Manish Sharma',
      phone: '9673000053',
      role: Role.ADMIN,
    },
  });

  const advisor1 = await prisma.user.create({
    data: {
      email: 'rohit.advisor@24krealtors.com',
      passwordHash: '$2b$10$g16x32289fG9B4.1x7oDceYg9K8W9rV.y2Z6fS5wRzE3M94Ff8.Oq',
      name: 'Rohit Deshmukh',
      phone: '9876543210',
      role: Role.ADVISOR,
    },
  });

  const advisor2 = await prisma.user.create({
    data: {
      email: 'ananya.advisor@24krealtors.com',
      passwordHash: '$2b$10$g16x32289fG9B4.1x7oDceYg9K8W9rV.y2Z6fS5wRzE3M94Ff8.Oq',
      name: 'Ananya Sen',
      phone: '9876543211',
      role: Role.ADVISOR,
    },
  });

  console.log('Seeding builders...');
  const Prestige = await prisma.builder.create({
    data: {
      name: 'Prestige Group',
      logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150',
      description: 'One of the leading real estate developers in India, known for top-tier residential and commercial properties since 1986.',
      establishedYear: 1986,
      websiteUrl: 'https://www.prestigeconstructions.com',
      reraNumber: 'PRM/KA/RERA/1251/310/PR/170916/000100',
    },
  });

  const Lodha = await prisma.builder.create({
    data: {
      name: 'Lodha Group',
      logoUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=150',
      description: 'Lodha is renowned for landmark developments, luxury residences, and premium customer care standards.',
      establishedYear: 1980,
      websiteUrl: 'https://www.lodhagroup.in',
      reraNumber: 'P51900000124',
    },
  });

  const DLF = await prisma.builder.create({
    data: {
      name: 'DLF Limited',
      logoUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=150',
      description: 'India\'s largest publicly listed real estate company, establishing benchmark projects across major metros.',
      establishedYear: 1946,
      websiteUrl: 'https://www.dlf.in',
      reraNumber: 'RC/REP/HARERA/GGM/2018/14',
    },
  });

  console.log('Seeding amenities...');
  const pool = await prisma.amenity.create({ data: { name: 'Swimming Pool', iconName: 'Waves' } });
  const golf = await prisma.amenity.create({ data: { name: 'Golf Course', iconName: 'Compass' } });
  const gym = await prisma.amenity.create({ data: { name: 'State-of-the-Art Gym', iconName: 'Dumbbell' } });
  const security = await prisma.amenity.create({ data: { name: '24/7 Security & CCTV', iconName: 'ShieldAlert' } });
  const elevator = await prisma.amenity.create({ data: { name: 'Private Elevator Access', iconName: 'ArrowUpCircle' } });
  const lounge = await prisma.amenity.create({ data: { name: 'Sky Lounge & Deck', iconName: 'Coffee' } });
  const clubhouse = await prisma.amenity.create({ data: { name: 'Luxury Clubhouse', iconName: 'Home' } });

  console.log('Seeding properties...');
  
  // 1. Prestige Augusta Golf Village - Villa
  const p1 = await prisma.property.create({
    data: {
      title: 'Prestige Augusta Golf Village',
      slug: 'prestige-augusta-golf-village',
      description: 'Augusta Golf Village is the ultimate luxury answer for individuals who value exclusivity. Fully complete 3 and 4 BHK villas nestled within a ready, spectacular 9-hole golf course.',
      builderId: Prestige.id,
      propertyType: PropertyType.VILLA,
      constructionStatus: ConstructionStatus.READY_TO_MOVE,
      minPrice: 35000000, // 3.5 Cr
      maxPrice: 65000000, // 6.5 Cr
      bhkConfig: [3, 4],
      microMarket: 'Whitefield',
      locality: 'Hennur Road',
      city: 'Bangalore',
      state: 'Karnataka',
      latitude: 13.0645,
      longitude: 77.6789,
      reraNumber: 'PRM/KA/RERA/1251/446/PR/171015/000200',
      isFeatured: true,
      virtualTourUrl: 'https://my.matterport.com/show/?m=L4Bv4N1G',
      walkthroughVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  });

  // 2. Lodha Bellagio - Apartment
  const p2 = await prisma.property.create({
    data: {
      title: 'Lodha Bellagio',
      slug: 'lodha-bellagio',
      description: 'Lodha Bellagio offers European-inspired imperial living on Powai hillside. Experience stunning panoramic lake views, ultra-spacious decks, and high-fidelity custom design systems.',
      builderId: Lodha.id,
      propertyType: PropertyType.APARTMENT,
      constructionStatus: ConstructionStatus.UNDER_CONSTRUCTION,
      minPrice: 22000000, // 2.2 Cr
      maxPrice: 48000000, // 4.8 Cr
      bhkConfig: [2, 3, 4],
      microMarket: 'Powai',
      locality: 'Saki Vihar Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      latitude: 19.1245,
      longitude: 72.8953,
      reraNumber: 'P51800033966',
      isFeatured: true,
      virtualTourUrl: 'https://my.matterport.com/show/?m=L4Bv4N1G',
    },
  });

  // 3. 24K Altura - Apartment (Baner, Pune)
  const p3 = await prisma.property.create({
    data: {
      title: '24K Altura',
      slug: '24k-altura',
      description: '24K Altura introduces structural poetry to Pune. Curated boutique homes featuring Italian marble flooring, biometric entrance validation, and customized home-automation networks.',
      builderId: Lodha.id, // Partnered distribution
      propertyType: PropertyType.APARTMENT,
      constructionStatus: ConstructionStatus.NEW_LAUNCH,
      minPrice: 18000000, // 1.8 Cr
      maxPrice: 32000000, // 3.2 Cr
      bhkConfig: [3, 4],
      microMarket: 'Baner',
      locality: 'Baner-Balewadi Link Road',
      city: 'Pune',
      state: 'Maharashtra',
      latitude: 18.5642,
      longitude: 73.7911,
      reraNumber: 'P52100030502',
      isFeatured: true,
    },
  });

  // 4. DLF Hyde Park Estate - Plot
  const p4 = await prisma.property.create({
    data: {
      title: 'DLF Hyde Park Estate',
      slug: 'dlf-hyde-park-estate',
      description: 'Develop your customized royal address on premium DTCP-approved residential plots. Wide internal avenues, landscaped parks, and direct proximity to key arterial highways.',
      builderId: DLF.id,
      propertyType: PropertyType.PLOT,
      constructionStatus: ConstructionStatus.READY_TO_MOVE,
      minPrice: 9000000,  // 90 L
      maxPrice: 18000000, // 1.8 Cr
      bhkConfig: [],
      microMarket: 'New Chandigarh',
      locality: 'Mullanpur',
      city: 'Chandigarh',
      state: 'Punjab',
      latitude: 30.7911,
      longitude: 76.7324,
      reraNumber: 'PBRERA-SAS80-PR0092',
      isFeatured: false,
    },
  });

  console.log('Seeding Floor Plans...');
  await prisma.floorPlan.createMany({
    data: [
      {
        propertyId: p1.id,
        name: 'Royal Executive Villa (3 BHK)',
        bhk: 3,
        sizeSqFt: 3500,
        price: 35000000,
        imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500',
      },
      {
        propertyId: p1.id,
        name: 'Presidential Golf Villa (4 BHK)',
        bhk: 4,
        sizeSqFt: 5400,
        price: 65000000,
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
      },
      {
        propertyId: p2.id,
        name: 'Imperial Suite (2 BHK)',
        bhk: 2,
        sizeSqFt: 1250,
        price: 22000000,
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500',
      },
      {
        propertyId: p2.id,
        name: 'Grand Lakeside Vista (3 BHK)',
        bhk: 3,
        sizeSqFt: 1850,
        price: 35000000,
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
      },
      {
        propertyId: p3.id,
        name: 'Altura Penthouse Suite (4 BHK)',
        bhk: 4,
        sizeSqFt: 2900,
        price: 32000000,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
      },
    ],
  });

  console.log('Seeding Property Amenities linkages...');
  await prisma.propertyAmenity.createMany({
    data: [
      { propertyId: p1.id, amenityId: pool.id },
      { propertyId: p1.id, amenityId: golf.id },
      { propertyId: p1.id, amenityId: gym.id },
      { propertyId: p1.id, amenityId: security.id },
      { propertyId: p2.id, amenityId: pool.id },
      { propertyId: p2.id, amenityId: elevator.id },
      { propertyId: p2.id, amenityId: gym.id },
      { propertyId: p2.id, amenityId: security.id },
      { propertyId: p2.id, amenityId: lounge.id },
      { propertyId: p3.id, amenityId: pool.id },
      { propertyId: p3.id, amenityId: gym.id },
      { propertyId: p3.id, amenityId: clubhouse.id },
      { propertyId: p3.id, amenityId: security.id },
    ],
  });

  console.log('Seeding Reviews...');
  await prisma.review.createMany({
    data: [
      {
        propertyId: p1.id,
        authorName: 'Sanjay Dutt',
        rating: 5,
        content: 'Absolute transparent guidance from Manish. Buying my golf villa was completely stress-free without any sales push.',
        isVerified: true,
        isPublished: true,
      },
      {
        propertyId: p2.id,
        authorName: 'Meera Deshpande',
        rating: 5,
        content: 'Verifiably the most honest consultants in the market. Guided me away from unapproved projects directly to Lodha Powai.',
        isVerified: true,
        isPublished: true,
      },
    ],
  });

  console.log('Seeding Commissions...');
  await prisma.commission.create({
    data: {
      propertyId: p1.id,
      builderId: Prestige.id,
      percentage: 2.50, // 2.5% Commission
      terms: '1.25% payable on agreement signing, 1.25% payable on registration.',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

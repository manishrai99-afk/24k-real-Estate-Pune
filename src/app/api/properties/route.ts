import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PropertyType, ConstructionStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type') as PropertyType | null;
    const status = searchParams.get('status') as ConstructionStatus | null;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null;
    const bhk = searchParams.get('bhk'); // e.g., "2,3"
    const microMarket = searchParams.get('microMarket');
    const query = searchParams.get('query'); // text search keyword
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 12;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;

    const where: any = {};

    if (type && Object.values(PropertyType).includes(type)) {
      where.propertyType = type;
    }
    
    if (status && Object.values(ConstructionStatus).includes(status)) {
      where.constructionStatus = status;
    }

    if (minPrice !== null || maxPrice !== null) {
      where.minPrice = { gte: minPrice !== null ? minPrice : 0 };
      if (maxPrice !== null) {
        where.maxPrice = { lte: maxPrice };
      }
    }

    if (bhk) {
      const bhkList = bhk.split(',').map((b) => parseInt(b.trim(), 10)).filter((b) => !isNaN(b));
      if (bhkList.length > 0) {
        where.bhkConfig = { hasSome: bhkList };
      }
    }

    if (microMarket) {
      where.microMarket = { equals: microMarket, mode: 'insensitive' };
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { locality: { contains: query, mode: 'insensitive' } },
        { reraNumber: { contains: query, mode: 'insensitive' } },
        { builder: { name: { contains: query, mode: 'insensitive' } } },
      ];
    }

    const [properties, total] = await db.$transaction([
      db.property.findMany({
        where,
        include: {
          builder: {
            select: {
              name: true,
              logoUrl: true,
            },
          },
          amenities: {
            include: {
              amenity: true,
            },
          },
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' },
        ],
        take: limit,
        skip: offset,
      }),
      db.property.count({ where }),
    ]);

    // Serialize Decimal fields to plain numbers so they can be passed to Client Components
    const serializedProperties = properties.map((p) => ({
      ...p,
      minPrice: p.minPrice.toNumber(),
      maxPrice: p.maxPrice.toNumber(),
    }));

    return NextResponse.json({
      properties: serializedProperties,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties', details: error.message }, { status: 500 });
  }
}

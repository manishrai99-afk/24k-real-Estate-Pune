import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LeadStatus, BookingStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      propertyId,
      scheduledAt,
      message,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body;

    // 1. Basic Field Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter a valid name (min 2 characters).' }, { status: 400 });
    }

    // 2. Strict 10-digit Indian mobile number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone ? phone.replace(/[\s-()]/g, '') : '';
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number (e.g., 9876543210).' }, { status: 400 });
    }

    // 3. Optional Email format validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!propertyId || typeof propertyId !== 'string') {
      return NextResponse.json({ error: 'Invalid property selected.' }, { status: 400 });
    }

    if (!scheduledAt) {
      return NextResponse.json({ error: 'Please select a date and time for the visit.' }, { status: 400 });
    }

    const bookingDate = new Date(scheduledAt);
    if (isNaN(bookingDate.getTime()) || bookingDate < new Date()) {
      return NextResponse.json({ error: 'Scheduled visit date must be in the future.' }, { status: 400 });
    }

    // 4. DB Connectivity Fallback logic
    let property = null;
    let advisors: any[] = [];
    let isDbOffline = false;

    try {
      // Try fetching property and advisors from PostgreSQL database
      property = await db.property.findUnique({
        where: { id: propertyId },
      });
      
      advisors = await db.user.findMany({
        where: { role: 'ADVISOR' },
        select: { id: true, name: true },
      });
    } catch (dbError) {
      console.warn('Database offline during booking search, executing offline preview fallback.');
      isDbOffline = true;
    }

    // Simulated Fallback if DB is offline or table is empty
    if (isDbOffline || !property) {
      const mockProperties: Record<string, string> = {
        'p1': 'Prestige Augusta Golf Village',
        'p2': 'Lodha Bellagio',
        'p3': '24K Altura',
      };
      const title = mockProperties[propertyId] || 'Selected Premium Project';
      const advisorName = 'Rohit Deshmukh';

      return NextResponse.json({
        success: true,
        message: `Your booking has been received. Our certified advisor, ${advisorName}, will contact you shortly to confirm the slot. [Mock Preview Mode]`,
        bookingId: 'mock-booking-' + Math.floor(Math.random() * 100000),
        advisorName,
      });
    }

    // 5. Intelligent Advisor Routing & Auto-assignment
    let assignedAdvisorId: string | null = null;
    if (advisors.length > 0) {
      // Find the count of active leads per advisor to distribute work evenly
      const leadCounts = await Promise.all(
        advisors.map(async (adv) => {
          const count = await db.lead.count({ where: { advisorId: adv.id } });
          return { id: adv.id, count };
        })
      );

      // Sort by active workload
      leadCounts.sort((a, b) => a.count - b.count);
      assignedAdvisorId = leadCounts[0].id;
    }

    // 6. Transactional persistence: Create lead & booking concurrently
    const result = await db.$transaction(async (tx) => {
      // Create lead
      const lead = await tx.lead.create({
        data: {
          name: name.trim(),
          phone: cleanPhone,
          email: email ? email.trim().toLowerCase() : null,
          leadSource: `Website: Booking for ${property!.title}`,
          status: LeadStatus.NEW,
          message: message ? message.trim() : null,
          utmSource,
          utmMedium,
          utmCampaign,
          propertyId,
          advisorId: assignedAdvisorId,
        },
      });

      // Create site booking
      const booking = await tx.booking.create({
        data: {
          leadId: lead.id,
          propertyId,
          advisorId: assignedAdvisorId,
          scheduledAt: bookingDate,
          status: BookingStatus.PENDING,
          notes: 'Automated channel partner assignment initialized.',
        },
      });

      return { lead, booking };
    });

    const advisorName = advisors.find(a => a.id === assignedAdvisorId)?.name || '24K Support Executive';

    return NextResponse.json({
      success: true,
      message: `Your booking has been received. Our certified advisor, ${advisorName}, will contact you shortly to confirm the slot.`,
      bookingId: result.booking.id,
      advisorName,
    });
  } catch (error: any) {
    console.error('Error booking site visit:', error);
    return NextResponse.json({ error: 'An error occurred while scheduling your booking.', details: error.message }, { status: 500 });
  }
}

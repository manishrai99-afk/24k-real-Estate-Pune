import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LeadStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message, utmSource } = body;

    // 1. Validation checks
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter a valid name (min 2 characters).' }, { status: 400 });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone ? phone.replace(/[\s-()]/g, '') : '';
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // 2. Database checks with fallback
    let advisors: any[] = [];
    let isDbOffline = false;

    try {
      advisors = await db.user.findMany({
        where: { role: 'ADVISOR' },
        select: { id: true, name: true },
      });
    } catch (dbError) {
      console.warn('Database offline during enquiry, running simulated preview fallback.');
      isDbOffline = true;
    }

    if (isDbOffline) {
      const mockAdvisor = 'Rohit Deshmukh';
      return NextResponse.json({
        success: true,
        message: `Thank you! Your general enquiry has been registered. Our certified advisor, ${mockAdvisor}, will call you back shortly. [Mock Preview Mode]`,
        leadId: 'mock-lead-' + Math.floor(Math.random() * 100000),
        advisorName: mockAdvisor,
      });
    }

    // 3. Round-Robin Advisor Assignment
    let assignedAdvisorId: string | null = null;
    if (advisors.length > 0) {
      const leadCounts = await Promise.all(
        advisors.map(async (adv) => {
          const count = await db.lead.count({ where: { advisorId: adv.id } });
          return { id: adv.id, count };
        })
      );
      leadCounts.sort((a, b) => a.count - b.count);
      assignedAdvisorId = leadCounts[0].id;
    }

    // 4. Save to Database
    const lead = await db.lead.create({
      data: {
        name: name.trim(),
        phone: cleanPhone,
        email: email ? email.trim().toLowerCase() : null,
        leadSource: `General Enquiry (${utmSource || 'direct'})`,
        status: LeadStatus.NEW,
        message: message ? message.trim() : 'General Enquiry request submitted.',
        advisorId: assignedAdvisorId,
      },
    });

    const advisorName = advisors.find(a => a.id === assignedAdvisorId)?.name || '24K Concierge Support';

    return NextResponse.json({
      success: true,
      message: `Thank you! Your general enquiry has been registered. Our certified advisor, ${advisorName}, will call you back shortly.`,
      leadId: lead.id,
      advisorName,
    });
  } catch (error: any) {
    console.error('Error saving general enquiry:', error);
    return NextResponse.json({ error: 'An error occurred while saving your enquiry.', details: error.message }, { status: 500 });
  }
}

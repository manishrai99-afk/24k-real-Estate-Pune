import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LeadStatus } from '@prisma/client';

export async function GET() {
  try {
    // Fetch all leads
    const dbLeads = await db.lead.findMany({
      include: {
        property: {
          select: {
            title: true,
          },
        },
        advisor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Fetch all bookings
    const dbBookings = await db.booking.findMany({
      include: {
        lead: {
          select: {
            name: true,
          },
        },
        property: {
          select: {
            title: true,
          },
        },
        advisor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    });

    // Fetch all commissions
    const dbCommissions = await db.commission.findMany({
      include: {
        property: {
          select: {
            title: true,
          },
        },
        builder: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Map database structures to fit dashboard format
    const leads = dbLeads.map((l) => ({
      id: l.id,
      displayId: l.id.slice(0, 8).toUpperCase(),
      name: l.name,
      phone: l.phone,
      email: l.email,
      leadSource: l.property ? `Inquiry: ${l.property.title}` : l.leadSource,
      status: l.status,
      advisorName: l.advisor ? l.advisor.name : 'Unassigned',
      createdAt: new Date(l.createdAt).toLocaleString('en-IN', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    }));

    const bookings = dbBookings.map((b) => ({
      id: b.id,
      displayId: b.id.slice(0, 8).toUpperCase(),
      clientName: b.lead.name,
      projectName: b.property.title,
      advisorName: b.advisor ? b.advisor.name : 'Unassigned',
      scheduledAt: new Date(b.scheduledAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      status: b.status,
    }));

    const commissions = dbCommissions.map((c) => ({
      id: c.id,
      displayId: c.id.slice(0, 8).toUpperCase(),
      projectName: c.property.title,
      builderName: c.builder.name,
      percentage: c.percentage ? `${c.percentage.toString()}%` : '0%',
      flatFee: c.flatFee ? formatIndianPrice(c.flatFee.toNumber()) : 'N/A',
      payoutEst: c.percentage 
        ? `₹${((c.property as any).minPrice * c.percentage.toNumber() / 100).toLocaleString('en-IN')} (Based on Min)` 
        : 'N/A',
      status: 'ACTIVE_RETAINER',
    }));

    return NextResponse.json({
      leads,
      bookings,
      commissions,
    });
  } catch (error: any) {
    console.error('Database query failed for admin dashboard data:', error);
    return NextResponse.json({ error: 'Database query failed', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { leadId, status } = body;

    if (!leadId || !status) {
      return NextResponse.json({ error: 'Missing leadId or status' }, { status: 400 });
    }

    // Validate that status is a valid LeadStatus enum value
    if (!Object.values(LeadStatus).includes(status as LeadStatus)) {
      return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 });
    }

    const updatedLead = await db.lead.update({
      where: { id: leadId },
      data: { status: status as LeadStatus },
    });

    return NextResponse.json({
      success: true,
      lead: {
        id: updatedLead.id,
        status: updatedLead.status,
      },
    });
  } catch (error: any) {
    console.error('Failed to update lead status in DB:', error);
    return NextResponse.json({ error: 'Failed to update lead status', details: error.message }, { status: 500 });
  }
}

// Simple pricing utility since utils isn't easily imported inside Node router
function formatIndianPrice(num: number): string {
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lakh`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}

import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';

export const metadata: Metadata = {
  title: '24K Realtors | Premium Real Estate Consultants & Channel Partners',
  description: 'Verified properties directly from top-tier builders in Bangalore, Mumbai, Pune, and Chandigarh. Honest, pressure-free real estate advisory.',
  keywords: '24k realtors, premium real estate, luxury properties, verified villas, apartments bangalore, Powai apartments, Baner villas, MahaRERA registered agent',
  openGraph: {
    title: '24K Realtors | Premium Real Estate Property Consultants',
    description: '100% verified listings directly from top-tier builders. Transparency over sales pressure.',
    url: 'https://www.24krealtors.com',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flexGrow: 1 }}>{children}</main>
        <Footer />
        <EnquiryModal />
      </body>
    </html>
  );
}

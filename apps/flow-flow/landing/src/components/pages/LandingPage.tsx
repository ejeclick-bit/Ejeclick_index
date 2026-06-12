import { MainLayout } from '../templates/MainLayout';
import { Hero } from '../organisms/Hero';
import { Services } from '../organisms/Services';
import { Gallery } from '../organisms/Gallery';
import { Testimonials } from '../organisms/Testimonials';
import { Contact } from '../organisms/Contact';
import { CancelBooking } from '../organisms/CancelBooking';
import { WhatsAppFAB } from '../organisms/WhatsAppFAB';

export function LandingPage() {
  return (
    <MainLayout>
      <Hero />
      <Contact />
      <CancelBooking />
      <Services />
      <Gallery />
      <Testimonials />
      <WhatsAppFAB />
    </MainLayout>
  );
}

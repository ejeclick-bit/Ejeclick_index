import { Hero } from '../organisms/Hero';
import { Services } from '../organisms/Services';
import { Gallery } from '../organisms/Gallery';
import { Testimonials } from '../organisms/Testimonials';
import { Contact } from '../organisms/Contact';
import { CancelBooking } from '../organisms/CancelBooking';

export function LandingPage() {
  return (
    <>
      <Hero />
      <Contact />
      <CancelBooking />
      <Services />
      <Gallery />
      <Testimonials />
    </>
  );
}

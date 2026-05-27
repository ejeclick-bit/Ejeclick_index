import { Hero } from '../organisms/Hero';
import { Services } from '../organisms/Services';
import { Gallery } from '../organisms/Gallery';
import { Testimonials } from '../organisms/Testimonials';
import { Contact } from '../organisms/Contact';

export function LandingPage() {
  return (
    <>
      <Hero />
      <Services />
      <Gallery />
      <Testimonials />
      <Contact />
    </>
  );
}

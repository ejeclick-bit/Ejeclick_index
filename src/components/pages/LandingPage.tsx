import { MainLayout } from '@/components/templates/MainLayout';
import { HeroSection } from '@/components/organisms/HeroSection';
import { ServicesGrid } from '@/components/organisms/ServicesGrid';
import { ProcessSection } from '@/components/organisms/ProcessSection';
import { SocialProofSection } from '@/components/organisms/SocialProofSection';
import { FAQSection } from '@/components/organisms/FAQSection';
import { ContactSection } from '@/components/organisms/ContactSection';

export function LandingPage() {
  return (
    <MainLayout>
      <HeroSection />
      <SocialProofSection />
      <ServicesGrid />
      <ProcessSection />
      <FAQSection />
      <ContactSection />
    </MainLayout>
  );
}

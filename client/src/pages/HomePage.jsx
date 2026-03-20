import HeroSection from '../sections/HeroSection';
import MembershipPlans from '../sections/MembershipPlans';
import AboutSection from '../sections/AboutSection';
import TrainersSection from '../sections/TrainersSection';
import GallerySection from '../sections/GallerySection';
import UpdatesSection from '../sections/UpdatesSection';
import ShopShowcase from '../sections/ShopShowcase';
import ContactSection from '../sections/ContactSection';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const target = window.sessionStorage.getItem('sd_scroll_target');
    if (target !== 'trainers') return;

    window.sessionStorage.removeItem('sd_scroll_target');
    const element = document.getElementById('trainers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="space-y-24 pb-16">
      <HeroSection />
      <MembershipPlans />
      <AboutSection />
      <TrainersSection />
      <GallerySection />
      <UpdatesSection />
      <ShopShowcase />
      <ContactSection />
    </div>
  );
}

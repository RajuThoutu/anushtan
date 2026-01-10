import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
// New 2.0 Components
import { HeroSection } from "@/components/home/HeroSection";
import { DashboardCards } from "@/components/home/DashboardCards";
import { TrayiSection } from "@/components/home/TrayiSection";
import { PivotSection } from "@/components/home/PivotSection";
import { KitchenSection } from "@/components/home/KitchenSection";
import { InfrastructureSection } from "@/components/home/InfrastructureSection";

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anushtan In: Ancient Roots, Global Minds',
  description: 'Anushtan Indic School: A vibrant ecosystem cultivating specialized excellence in Soul, Mind, and Future technologies.',
};

export default function Home() {
  return (
    <>
      <Navbar />

      {/* 2.0 Hero: The Awakening */}
      <HeroSection />

      {/* 2.0 Dashboard Cards (Academics, Holistic, Culture) */}
      <DashboardCards />

      {/* 2.0 The Anushtan Trayi (Trishakti) */}
      <TrayiSection />

      {/* 2.0 The 8th Grade Pivot */}
      <PivotSection />

      {/* 2.0 The Sacred Kitchen */}
      <KitchenSection />

      {/* 2.0 Infrastructure & Governance */}
      <InfrastructureSection />

      {/* Admissions CTA Band */}
      <section className="py-24 bg-anushtan-terracotta text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] mix-blend-overlay" />
        <div className="container-custom relative z-10">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">The Awakening Begins June 2026</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-10 text-xl font-light">
            Founding seats are limited. Join the cohort that will redefine Indian education.
          </p>
          <div className="flex justify-center gap-4">
            <Button href="/admissions" className="bg-anushtan-gold text-anushtan-charcoal hover:bg-white border-0 px-10 py-6 text-lg font-bold shadow-xl">
              Apply Now
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

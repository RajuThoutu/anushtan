import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { PillarsSection } from "@/components/sections/PillarsSection";
import { SwadharmaStreams } from "@/components/sections/SwadharmaStreams";
import { SacredKitchen } from "@/components/sections/SacredKitchen";
import { InfrastructureBento } from "@/components/sections/InfrastructureBento";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Anushtan Indic School',
  description: 'An institutional overview of Anushtan Indic School, focusing on academics, culture, and character.',
};

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center bg-anushtan-bg overflow-hidden min-h-[85vh]">
        {/* Text Side (Left) */}
        <div className="relative flex-1 p-8 md:p-16 lg:pl-24 flex flex-col justify-center z-10">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-anushtan-primary mb-6 leading-tight">
            Not Just a School. <br /> A Swadharma.
          </h1>
          <p className="text-xl md:text-2xl text-anushtan-primary/80 max-w-xl mb-8 leading-relaxed font-light">
            Where Ancient Roots meet Global Futures. An Indic school designed for the AI-driven era.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/admissions" className="bg-anushtan-primary text-white hover:bg-anushtan-primary/90 border-0 px-8 py-6 text-lg">
              Secure a Founding Batch Seat – June 2026
            </Button>
            <Button href="/about" variant="outline" className="text-anushtan-primary border-anushtan-primary hover:bg-anushtan-primary/5 px-8 py-6 text-lg">
              Explore the Middle Path
            </Button>
          </div>
        </div>

        {/* Image Side (Right) */}
        <div className="absolute inset-0 md:static md:flex-1 flex justify-end h-full w-full z-0 md:z-auto opacity-20 md:opacity-100 pointer-events-none md:pointer-events-auto">
          <div className="relative w-full h-full md:h-[95vh] flex justify-end items-end md:items-center">
            <img
              src="/hero-swami-standing.jpg"
              alt="Swami Vivekananda"
              className="h-full w-auto object-cover md:object-contain object-right-bottom md:object-right"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 15%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Identity Blend Section */}
      <section className="py-24 bg-anushtan-bg relative overflow-hidden flex flex-col items-center justify-center">
        {/* Subtle Background Pattern or Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-anushtan-primary/5 to-transparent pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          {/* Logo Container with Glow/Blend Effect */}
          <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto mb-8 animate-in fade-in zoom-in duration-1000">
            <div className="absolute inset-0 bg-anushtan-accent/20 blur-3xl rounded-full" />
            <div className="relative h-full w-full rounded-full overflow-hidden border-4 border-anushtan-primary/10 shadow-2xl">
              <img
                src="/logo.jpg"
                alt="Anushtan Logo"
                className="h-full w-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
              />
            </div>
          </div>

          {/* Conceptual Text */}
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-anushtan-primary mb-4">
            The Anushtan Spirit
          </h2>
          <div className="h-1 w-24 bg-anushtan-accent mx-auto mb-6 rounded-full" />
          <p className="text-xl text-anushtan-charcoal/80 leading-relaxed italic">
            "More than an institution, we are a movement. A convergence of ancient wisdom and modern vitality, shaping character for the world of tomorrow."
          </p>
        </div>
      </section>

      {/* Triangle of Excellence */}
      <PillarsSection />

      {/* Swadharma Streams */}
      <SwadharmaStreams />

      {/* Sacred Kitchen */}
      <SacredKitchen />

      {/* Infrastructure Bento */}
      <InfrastructureBento />

      {/* Admissions CTA Band */}
      <section className="py-16 bg-anushtan-primary text-white text-center">
        <div className="container-custom">
          <h2 className="font-heading text-3xl font-bold mb-4">Begin Your Journey</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Admissions open for the Founding Batch (June 2026). Contact: +91-91103 93271
          </p>
          <div className="flex justify-center gap-4">
            <Button href="/admissions" className="bg-anushtan-accent text-anushtan-brand-charcoal hover:bg-anushtan-accent/90 border-0 font-bold">
              Start Admissions Process
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

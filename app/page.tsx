import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
      <section className="relative min-h-[80vh] flex items-center justify-center bg-transparent overflow-hidden">
        <div className="container-custom relative z-10 text-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-anushtan-maroon mb-6 leading-tight">
            Anushtan Indic School
          </h1>
          <p className="text-xl md:text-2xl text-anushtan-charcoal/80 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            An institutional approach to education integrating academics, physical vitality, cultural grounding, and inner discipline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/admissions" className="bg-anushtan-maroon text-white hover:bg-anushtan-maroon/90 border-0">
              Admissions Information
            </Button>
            <Button href="/campus" variant="outline" className="text-anushtan-maroon border-anushtan-maroon hover:bg-anushtan-maroon/5">
              Schedule a Campus Visit
            </Button>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-transparent">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <blockquote className="font-heading text-2xl md:text-3xl italic text-anushtan-charcoal mb-6 relative px-8">
            <span className="absolute left-0 top-0 text-6xl text-anushtan-gold opacity-30">“</span>
            Education is the manifestation of the perfection already in man.
            <span className="absolute right-0 bottom-0 text-6xl text-anushtan-gold opacity-30">”</span>
          </blockquote>
          <cite className="block text-anushtan-saffron font-bold not-italic tracking-wider uppercase text-sm">
            Swami Vivekananda
          </cite>
          <div className="mt-8 flex justify-center opacity-80 font-medium text-anushtan-charcoal/30">
            {"{{IMAGE:VIVEKANANDA}}"}
          </div>
        </div>
      </section>

      {/* Institutional Overview */}
      <section className="py-20 bg-transparent">
        <div className="container-custom">
          <SectionHeader title="Institutional Overview" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-anushtan-border bg-white">
              <h3 className="font-heading text-xl font-bold mb-4 text-anushtan-maroon">Rootedness</h3>
              <p className="text-anushtan-charcoal/80">
                Grounded in cultural heritage and local context, providing a stable foundation for growth.
              </p>
            </Card>
            <Card className="border-anushtan-border bg-white">
              <h3 className="font-heading text-xl font-bold mb-4 text-anushtan-maroon">Vitality</h3>
              <p className="text-anushtan-charcoal/80">
                Emphasis on physical health, sports, and regular practice for robust development.
              </p>
            </Card>
            <Card className="border-anushtan-border bg-white">
              <h3 className="font-heading text-xl font-bold mb-4 text-anushtan-maroon">Clarity</h3>
              <p className="text-anushtan-charcoal/80">
                Developing intellectual sharpness and independent thinking through rigorous study.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Campus */}
      <section className="py-20 bg-transparent">
        <div className="container-custom">
          <SectionHeader title="Campus Environment" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="h-80 bg-anushtan-ivory border border-anushtan-border rounded flex items-center justify-center text-anushtan-charcoal/30">
              {"{{GALLERY:CAMPUS}}"}
            </div>
            <div>
              <h3 className="font-heading text-2xl font-bold mb-4 text-anushtan-maroon">A Silent Teacher</h3>
              <p className="text-lg text-anushtan-charcoal/80 leading-relaxed mb-6">
                The physical environment acts as a support for learning—clean, orderly, and close to nature.
              </p>
              <Button href="/campus" variant="outline" className="text-anushtan-saffron border-anushtan-saffron hover:bg-anushtan-saffron/5">
                View Facilities
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Admissions CTA Band */}
      <section className="py-16 bg-anushtan-maroon text-white text-center">
        <div className="container-custom">
          <h2 className="font-heading text-3xl font-bold mb-4">Admissions</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Admissions information and campus visit scheduling.
          </p>
          <div className="flex justify-center gap-4">
            <Button href="/admissions" className="bg-anushtan-saffron text-white hover:bg-anushtan-saffron/90 border-0">
              {"{{CTA:ADMISSIONS}}"}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

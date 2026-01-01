import { Navbar } from "@/components/layout/Navbar";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PillarsSection } from "@/components/sections/PillarsSection";
import { VideoSection } from "@/components/sections/VideoSection";
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
      <section className="relative flex flex-col md:flex-row items-center bg-[#fdfbf7] overflow-hidden min-h-[85vh]">
        {/* Text Side (Left) */}
        <div className="relative flex-1 p-8 md:p-16 lg:pl-24 flex flex-col justify-center z-10">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-[#632e22] mb-6 leading-tight">
            Anushtan Indic School
          </h1>
          <p className="text-xl md:text-2xl text-[#632e22]/80 max-w-xl mb-8 leading-relaxed font-light">
            An institutional approach to education integrating academics, physical vitality, cultural grounding, and inner discipline.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/admissions" className="bg-[#632e22] text-white hover:bg-[#632e22]/90 border-0 px-8 py-6 text-lg">
              Admissions Information
            </Button>
            <Button href="/campus" variant="outline" className="text-[#632e22] border-[#632e22] hover:bg-[#632e22]/5 px-8 py-6 text-lg">
              Schedule a Campus Visit
            </Button>
          </div>
        </div>

        {/* Image Side (Right) */}
        <div className="absolute inset-0 md:static md:flex-1 flex justify-end h-full w-full z-0 md:z-auto opacity-20 md:opacity-100 pointer-events-none md:pointer-events-auto">
          {/* The image needs to be positioned absolutely or handled carefully to respect the flex layout while maintaining aspect ratio */}
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

      {/* Video Highlights */}
      <VideoSection />

      {/* Pillars Section (Philosophical Foundations) */}
      <PillarsSection />

      {/* Institutional Overview */}
      <section className="py-20 bg-transparent">
        <div className="container-custom">
          <SectionHeader
            title="Why Anushtan?"
            subtitle="As Gautama Buddha said, we need a 'Middle Path'—a balance in society. Anushtan is built to provide that balance for the modern Indian student."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-anushtan-border bg-white h-full">
              <h3 className="font-heading text-xl font-bold mb-4 text-anushtan-maroon">Academic Excellence</h3>
              <div className="text-anushtan-charcoal/80 space-y-4">
                <p>
                  True academic excellence is not about finishing Intermediate syllabus in the 8th grade—that is destruction, not education.
                </p>
                <p>
                  We follow the <strong>National Education Policy (NEP)</strong> standards designed by experts like Dr. Kasturirangan. Our goal is to build strong conceptual foundations in Mathematics and Sciences without exhausting the child, preparing them for competitive success (IIT/NEET) at the right age.
                </p>
              </div>
            </Card>
            <Card className="border-anushtan-border bg-white h-full">
              <h3 className="font-heading text-xl font-bold mb-4 text-anushtan-maroon">Cultural Rootedness</h3>
              <div className="text-anushtan-charcoal/80 space-y-4">
                <p>
                  Culture is not just rituals; it is the life force that has sustained our civilization for thousands of years.
                </p>
                <p>
                  At Anushtan, students connect with nature (organic farming, cow service) and simple living. We inculcate values like <em>Seva</em> (service) and <em>Niramdabarata</em> (simplicity), ensuring they remain rooted in their identity even as they achieve global success.
                </p>
              </div>
            </Card>
            <Card className="border-anushtan-border bg-white h-full">
              <h3 className="font-heading text-xl font-bold mb-4 text-anushtan-maroon">Holistic Development</h3>
              <div className="text-anushtan-charcoal/80 space-y-4">
                <p>
                  A student might get an IIT seat or a 1-crore package, but without holistic development, they may not know how to live happily or handle failure.
                </p>
                <p>
                  We focus on Team Sports (to learn winning/losing), Life Skills (farming, cooking), and Arts. This is the "Second Segment" of our school—ensuring a child is physically, emotionally, and socially complete.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Campus */}
      <section className="py-20 bg-transparent">
        <div className="container-custom">
          <SectionHeader title="Campus Environment" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 w-full rounded-lg overflow-hidden border border-anushtan-border shadow-lg">
              <Image
                src="/campus-building.jpg"
                alt="Anushtan Campus Building"
                fill
                className="object-cover"
              />
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
            Admissions information and campus visit scheduling. Contact: +91-9044454441, +91-9044454442
          </p>
          <div className="flex justify-center gap-4">
            <Button href="/admissions" className="bg-anushtan-saffron text-white hover:bg-anushtan-saffron/90 border-0">
              Admissions Inquiry
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

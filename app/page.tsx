import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, BookOpen, User, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* 1) Hero Section */}
      <Hero
        title="Anushtan Indic School"
        subtitle="A balanced approach to education integrating academics, physical vitality, cultural grounding, and inner discipline."
        align="center"
        background="bg-background"
      >
        <Button size="lg" href="/admissions">Admissions</Button>
        <Button size="lg" variant="outline" href="/contact#visit">Visit Campus</Button>
      </Hero>

      {/* 2) Vivekananda Quote Section */}
      <section className="bg-secondary py-20 text-white relative overflow-hidden">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <blockquote className="font-heading text-3xl md:text-4xl italic leading-relaxed mb-6">
              "Education is the manifestation of the perfection already in man."
            </blockquote>
            <cite className="block text-xl font-medium text-amber-200 not-italic">
              — Swami Vivekananda
            </cite>
          </div>
          <div className="order-1 lg:order-2 h-80 lg:h-full bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
            <span className="text-white/50 text-center px-4">{{ IMAGE: VIVEKANANDA }}</span>
          </div>
        </div>
      </section>

      {/* 3) Why Anushtan Exists */}
      <section className="py-24 bg-surface">
        <div className="container-custom">
          <SectionHeader
            title="Why Anushtan Exists"
            subtitle="Anushtan was founded to restore balance to education by protecting childhood, strengthening foundations, and nurturing character alongside competence."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hoverEffect className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary"><Sparkles /></div>
              <h3 className="font-heading text-xl font-bold mb-2">Joyful Learning</h3>
              <p className="text-sm text-text/70">Learning aligned with age and readiness to preserve curiosity and well-being.</p>
            </Card>
            <Card hoverEffect className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary"><BookOpen /></div>
              <h3 className="font-heading text-xl font-bold mb-2">Global Competence</h3>
              <p className="text-sm text-text/70">Strong academic foundations and conceptual clarity for modern pathways.</p>
            </Card>
            <Card hoverEffect className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary"><User /></div>
              <h3 className="font-heading text-xl font-bold mb-2">Cultural Rootedness</h3>
              <p className="text-sm text-text/70">Values and identity integrated into daily life, not treated as an accessory.</p>
            </Card>
            <Card hoverEffect className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary"><MapPin /></div>
              <h3 className="font-heading text-xl font-bold mb-2">Holistic Development</h3>
              <p className="text-sm text-text/70">Education that develops body, mind, conduct, and responsibility together.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4) Educational Philosophy */}
      <section className="py-24 bg-background">
        <div className="container-custom">
          <SectionHeader title="Educational Philosophy" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border-l-4 border-primary bg-surface/50">
              <h4 className="font-heading text-xl font-bold mb-2">Academics with Understanding</h4>
              <p className="text-text/70">Conceptual learning prioritized over rote repetition.</p>
            </div>
            <div className="p-6 border-l-4 border-secondary bg-surface/50">
              <h4 className="font-heading text-xl font-bold mb-2">Physical Vitality</h4>
              <p className="text-text/70">Daily movement, sports, and yoga to support strength and mental clarity.</p>
            </div>
            <div className="p-6 border-l-4 border-accent bg-surface/50">
              <h4 className="font-heading text-xl font-bold mb-2">Culture and Inner Discipline</h4>
              <p className="text-text/70">Values, reflection, and disciplined routines to develop stability and character.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5) Curriculum Overview */}
      <section className="py-24 bg-surface">
        <div className="container-custom">
          <SectionHeader title="Curriculum Overview" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col h-full">
              <h3 className="font-heading text-2xl font-bold mb-2">Primary (Grades 1–5)</h3>
              <p className="text-text/70 mb-6 flex-grow">Foundations, joy, movement, cultural absorption.</p>
              <Link href="/academics#primary" className="text-primary font-medium inline-flex items-center gap-2 hover:underline">
                Learn More <ArrowRight size={16} />
              </Link>
            </Card>
            <Card className="flex flex-col h-full">
              <h3 className="font-heading text-2xl font-bold mb-2">Middle (Grades 6–8)</h3>
              <p className="text-text/70 mb-6 flex-grow">Balanced growth and conceptual strengthening.</p>
              <Link href="/academics#middle" className="text-primary font-medium inline-flex items-center gap-2 hover:underline">
                Learn More <ArrowRight size={16} />
              </Link>
            </Card>
            <Card className="flex flex-col h-full">
              <h3 className="font-heading text-2xl font-bold mb-2">Secondary (Grades 9–12)</h3>
              <p className="text-text/70 mb-6 flex-grow">Academic rigor with sustained balance and preparedness.</p>
              <Link href="/academics#secondary" className="text-primary font-medium inline-flex items-center gap-2 hover:underline">
                Learn More <ArrowRight size={16} />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* 6) Daily Life at Anushtan */}
      <section className="py-24 bg-background">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader title="Daily Life at Anushtan" align="left" />
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary" /> A calm and disciplined daily rhythm</li>
              <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary" /> Academics in focused blocks with breaks</li>
              <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary" /> Daily sports and physical activity</li>
              <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary" /> Cultural engagement integrated into routines</li>
              <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary" /> Weekly experiential learning</li>
            </ul>
            <Button href="/student-life" variant="outline">Learn More</Button>
          </div>
          <div className="h-96 bg-surface border border-text/10 rounded-lg flex items-center justify-center">
            <span className="text-text/30">{{ GALLERY: STUDENT_LIFE }}</span>
          </div>
        </div>
      </section>

      {/* 7) Teachers and Acharyas */}
      <section className="py-24 bg-surface">
        <div className="container-custom text-center max-w-4xl mx-auto">
          <SectionHeader title="Teachers and Acharyas" />
          <p className="text-lg text-text/80 leading-relaxed mb-8">
            Teachers at Anushtan are guides who combine academic competence with disciplined conduct and responsibility.
          </p>
          <Button href="/teachers-community#acharyas">Learn about our approach</Button>
        </div>
      </section>

      {/* 8) Campus and Learning Environment */}
      <section className="py-24 bg-background">
        <div className="container-custom">
          <SectionHeader title="Campus and Learning Environment" />
          <div className="h-64 md:h-96 bg-surface border border-text/10 rounded-lg flex items-center justify-center mb-8">
            <span className="text-text/30">{{ GALLERY: CAMPUS }}</span>
          </div>
          <div className="text-center">
            <p className="text-lg text-text/80 mb-6 max-w-2xl mx-auto">
              The campus functions as a silent teacher—supporting focus, movement, cleanliness, and balance.
            </p>
            <Button href="/campus" variant="outline">Explore campus</Button>
          </div>
        </div>
      </section>

      {/* 9) Admissions CTA Band */}
      <section className="bg-secondary text-white py-20 text-center">
        <div className="container-custom">
          <h2 className="font-heading text-4xl font-bold mb-6">Admissions</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Review the admission process and schedule a campus visit.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/admissions" className="bg-white text-secondary hover:bg-white/90">Admissions Process</Button>
            <Button href="/contact#visit" variant="outline" className="text-white border-white hover:bg-white/10">Schedule a Visit</Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, BookOpen, User, MapPin, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* 1) Hero Section */}
      <Hero
        title="Anushtan Indic School"
        subtitle="Where timeless wisdom meets modern excellence. Creating the next generation of conscious leaders."
        align="center"
        background="bg-background"
      >
        <Button size="lg" href="/admissions">Apply Now</Button>
        <Button size="lg" variant="outline" href="/about">Discover Our Vision</Button>
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
            <span className="text-white/50 text-center px-4">[VIVEKANANDA_IMAGE_HERE]</span>
          </div>
        </div>
      </section>

      {/* 3) Why Anushtan Exists */}
      <section className="py-24 bg-surface">
        <div className="container-custom">
          <SectionHeader title="Why Anushtan Exists" subtitle="Bridging the gap between cultural roots and future capabilities." />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hoverEffect className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary"><Sparkles /></div>
              <h3 className="font-heading text-xl font-bold mb-2">Character First</h3>
              <p className="text-sm text-text/70">[Short description about character building]</p>
            </Card>
            <Card hoverEffect className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary"><BookOpen /></div>
              <h3 className="font-heading text-xl font-bold mb-2">Academic Rigor</h3>
              <p className="text-sm text-text/70">[Short description about academic excellence]</p>
            </Card>
            <Card hoverEffect className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary"><User /></div>
              <h3 className="font-heading text-xl font-bold mb-2">Holistic Growth</h3>
              <p className="text-sm text-text/70">[Short description about physical and mental growth]</p>
            </Card>
            <Card hoverEffect className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary"><MapPin /></div>
              <h3 className="font-heading text-xl font-bold mb-2">Global Vision</h3>
              <p className="text-sm text-text/70">[Short description about global perspective]</p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4) Educational Philosophy Snapshot */}
      <section className="py-24 bg-background">
        <div className="container-custom">
          <SectionHeader title="Our Educational Philosophy" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border-l-4 border-primary bg-surface/50">
              <h4 className="font-heading text-xl font-bold mb-2">The Integrated Self</h4>
              <p className="text-text/70">[Placeholder text about integrating mind, body, and spirit in education.]</p>
            </div>
            <div className="p-6 border-l-4 border-secondary bg-surface/50">
              <h4 className="font-heading text-xl font-bold mb-2">Learning by Doing</h4>
              <p className="text-text/70">[Placeholder text about experiential and hands-on learning methodologies.]</p>
            </div>
            <div className="p-6 border-l-4 border-accent bg-surface/50">
              <h4 className="font-heading text-xl font-bold mb-2">Rooted Modernity</h4>
              <p className="text-text/70">[Placeholder text about combining traditional wisdom with modern science.]</p>
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
              <div className="h-40 bg-background mb-4 rounded flex items-center justify-center text-text/30">[IMAGE]</div>
              <h3 className="font-heading text-2xl font-bold mb-2">Primary Years</h3>
              <p className="text-text/70 mb-6 flex-grow">Foundational learning through play, stories, and observation.</p>
              <Link href="/academics" className="text-primary font-medium inline-flex items-center gap-2 hover:underline">
                Learn More <ArrowRight size={16} />
              </Link>
            </Card>
            <Card className="flex flex-col h-full">
              <div className="h-40 bg-background mb-4 rounded flex items-center justify-center text-text/30">[IMAGE]</div>
              <h3 className="font-heading text-2xl font-bold mb-2">Middle Years</h3>
              <p className="text-text/70 mb-6 flex-grow">Exploration, critical thinking, and disciplined study habits.</p>
              <Link href="/academics" className="text-primary font-medium inline-flex items-center gap-2 hover:underline">
                Learn More <ArrowRight size={16} />
              </Link>
            </Card>
            <Card className="flex flex-col h-full">
              <div className="h-40 bg-background mb-4 rounded flex items-center justify-center text-text/30">[IMAGE]</div>
              <h3 className="font-heading text-2xl font-bold mb-2">Secondary Years</h3>
              <p className="text-text/70 mb-6 flex-grow">Advanced concepts, leadership, and preparation for the world.</p>
              <Link href="/academics" className="text-primary font-medium inline-flex items-center gap-2 hover:underline">
                Learn More <ArrowRight size={16} />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* 6) Student Life Preview */}
      <section className="py-24 bg-background">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader title="Life at Anushtan" align="left" />
            <p className="text-lg text-text/80 mb-6">
              More than just classes. A vibrant community of learners growing together in a serene environment.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary" /> Daily Yoga & Meditation</li>
              <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary" /> Performing Arts & Culture</li>
              <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary" /> Sports & Physical Fitness</li>
              <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary" /> Community Service</li>
            </ul>
            <Button href="/student-life" variant="outline">Explore Student Life</Button>
          </div>
          <div className="h-96 bg-surface border border-text/10 rounded-lg flex items-center justify-center">
            <span className="text-text/30">[STUDENT_LIFE_COLLAGE_PLACEHOLDER]</span>
          </div>
        </div>
      </section>

      {/* 7) Teachers & Acharyas */}
      <section className="py-24 bg-surface">
        <div className="container-custom text-center max-w-4xl mx-auto">
          <SectionHeader title="Our Acharyas" />
          <p className="text-lg text-text/80 leading-relaxed mb-8">
            Our teachers are mentors guiding students on their path of discovery. They combine academic expertise with deep empathy and cultural understanding.
            [Placeholder for a short paragraph about the role of teachers at Anushtan.]
          </p>
          <Button href="/teachers-community">Meet Our Faculty</Button>
        </div>
      </section>

      {/* 8) Campus Preview */}
      <section className="py-24 bg-background">
        <div className="container-custom">
          <SectionHeader title="The Campus" subtitle="A silent teacher inspiring peace and focus." />
          <div className="h-64 md:h-96 bg-surface border border-text/10 rounded-lg flex items-center justify-center mb-8">
            <span className="text-text/30">[CAMPUS_GALLERY_STRIP_PLACEHOLDER]</span>
          </div>
          <div className="text-center">
            <Button href="/campus" variant="outline">Tour Our Campus</Button>
          </div>
        </div>
      </section>

      {/* 9) Admissions CTA Band */}
      <section className="bg-secondary text-white py-20 text-center">
        <div className="container-custom">
          <h2 className="font-heading text-4xl font-bold mb-6">Begin Your Journey</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Admissions are open for the upcoming academic year. Join a community dedicated to excellence.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/admissions" className="bg-white text-secondary hover:bg-white/90">Apply Now</Button>
            <Button href="/contact" variant="outline" className="text-white border-white hover:bg-white/10">Contact Us</Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

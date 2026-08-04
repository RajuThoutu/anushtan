import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, HeartHandshake, MapPin, Phone, Sprout } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anushtan Indic School | Learning in Motion",
  description: "Anushtan Indic School in Siddipet: a living school community where academic learning, culture, wellbeing, sport, and character grow together.",
};

const moments = [
  { title: "Learning beyond the textbook", text: "Projects, No Bag Day, creative work, and purposeful learning make curiosity part of the school day.", href: "/academics", label: "Academics", tone: "bg-[#EAF2F8] text-[#355C7D]" },
  { title: "Body, mind, and belonging", text: "Sport, yoga, traditional games, and shared responsibility help children build confidence together.", href: "/student-life", label: "Student life", tone: "bg-[#F8EEE6] text-[#8B452E]" },
  { title: "Roots that are lived", text: "Indic classroom culture, language, wellbeing, and everyday practices connect learning with life.", href: "/food-wellness", label: "Wellbeing & culture", tone: "bg-[#EEF3E9] text-[#506A43]" },
];

const promises = [
  ["A school year already in motion", "From the first day of school to competitions, campus activities, and parent conversations—Anushtan is a living learning community."],
  ["A considered partnership with parents", "Campus visits and parent dialogue start with a conversation, so every family can understand the school in context."],
  ["A place to grow in many directions", "Academic foundations, movement, creativity, culture, and care for the community belong in the same school day."],
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#FCFAF6] text-anushtan-charcoal">
        <section className="relative isolate border-b border-anushtan-border bg-[#F5EFE6]">
          <div className="container-custom grid min-h-[680px] items-center gap-10 py-16 lg:grid-cols-[1.02fr_.98fr] lg:py-20">
            <div className="relative z-10 max-w-2xl">
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-anushtan-terracotta/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-anushtan-terracotta shadow-sm">
                <CalendarDays className="h-4 w-4" /> 2026–27 academic year
              </p>
              <h1 className="font-heading text-5xl font-bold leading-[.98] tracking-tight text-anushtan-charcoal md:text-7xl">
                A school day with <span className="text-anushtan-terracotta italic">more in it.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-anushtan-charcoal/75 md:text-xl">
                Anushtan is where children learn with focus, move with confidence, stay rooted in culture, and discover what they can contribute.
              </p>
              <p className="mt-5 font-heading text-xl font-bold text-anushtan-terracotta md:text-2xl">
                Ancient roots. Global readiness.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/admissions" className="inline-flex items-center justify-center gap-2 rounded-md bg-anushtan-terracotta px-7 py-4 font-bold text-white shadow-lg shadow-anushtan-terracotta/20 transition hover:-translate-y-0.5 hover:bg-[#743426]">
                  Plan a campus visit <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#life-at-anushtan" className="inline-flex items-center justify-center rounded-md border border-anushtan-terracotta/30 bg-white px-7 py-4 font-bold text-anushtan-terracotta transition hover:bg-anushtan-terracotta/5">
                  See life at Anushtan
                </Link>
              </div>
              <div className="mt-11 grid max-w-xl grid-cols-3 gap-4 border-t border-anushtan-charcoal/10 pt-6 text-sm">
                <div><p className="font-heading text-2xl font-bold text-anushtan-terracotta">85+</p><p className="mt-1 text-anushtan-charcoal/65">school stories shared</p></div>
                <div><p className="font-heading text-2xl font-bold text-anushtan-terracotta">4.9K</p><p className="mt-1 text-anushtan-charcoal/65">Instagram community</p></div>
                <div><p className="font-heading text-2xl font-bold text-anushtan-terracotta">Now</p><p className="mt-1 text-anushtan-charcoal/65">learning in motion</p></div>
              </div>
            </div>
            <div className="relative min-h-[480px] lg:min-h-[560px]">
              <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-anushtan-charcoal shadow-2xl">
                <Image src="/campus-building.jpg" alt="Anushtan Indic School campus" fill priority className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
              </div>
              <p className="absolute bottom-5 left-6 rounded-full border border-white/30 bg-anushtan-charcoal/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">Beside SUDA Office · Siddipet</p>
            </div>
          </div>
        </section>

        <section id="life-at-anushtan" className="py-20 md:py-28">
          <div className="container-custom">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-anushtan-terracotta">Life at Anushtan</p>
              <h2 className="mt-4 font-heading text-4xl font-bold leading-tight md:text-5xl">Learning is visible here.</h2>
              <p className="mt-5 text-lg leading-relaxed text-anushtan-charcoal/70">The strongest story is not a promise for later. It is what children are doing, making, practising, and sharing today.</p>
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {moments.map((moment) => (
                <Link key={moment.title} href={moment.href} className="group rounded-2xl border border-anushtan-border bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${moment.tone}`}>{moment.label}</span>
                  <h3 className="mt-7 font-heading text-2xl font-bold leading-tight">{moment.title}</h3>
                  <p className="mt-4 leading-relaxed text-anushtan-charcoal/70">{moment.text}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-anushtan-terracotta">Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-anushtan-charcoal py-20 text-[#FCFAF6] md:py-28">
          <div className="container-custom grid items-center gap-12 lg:grid-cols-[.92fr_1.08fr]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10">
              <Image src="/campus-tech-lab.jpg" alt="Technology learning space at Anushtan" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-8 pt-20">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-anushtan-gold">A prepared environment</p>
                <p className="mt-2 font-heading text-2xl font-bold">Spaces that invite curiosity.</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-anushtan-gold">What families can expect</p>
              <h2 className="mt-4 font-heading text-4xl font-bold leading-tight md:text-5xl">A more complete way to grow.</h2>
              <div className="mt-9 space-y-6">
                {promises.map(([title, text], index) => (
                  <div key={title} className="grid grid-cols-[auto_1fr] gap-5 border-t border-white/15 pt-6">
                    <span className="font-heading text-2xl font-bold text-anushtan-gold">0{index + 1}</span>
                    <div><h3 className="font-heading text-2xl font-bold">{title}</h3><p className="mt-2 leading-relaxed text-white/70">{text}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container-custom grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-anushtan-terracotta">A visit is the best beginning</p>
              <h2 className="mt-4 font-heading text-4xl font-bold leading-tight md:text-5xl">See whether Anushtan feels right for your family.</h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-anushtan-charcoal/70">Tour the campus, understand the learning approach, talk through grade availability, and make a decision with the context you need.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/admissions" className="inline-flex items-center justify-center gap-2 rounded-md bg-anushtan-terracotta px-7 py-4 font-bold text-white transition hover:bg-[#743426]">Schedule a visit <ArrowRight className="h-4 w-4" /></Link>
                <a href="tel:+919044454441" className="inline-flex items-center justify-center gap-2 rounded-md border border-anushtan-terracotta/30 bg-white px-7 py-4 font-bold text-anushtan-terracotta"><Phone className="h-4 w-4" /> Call admissions</a>
              </div>
              <div className="mt-9 flex flex-wrap gap-5 text-sm font-medium text-anushtan-charcoal/70"><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-anushtan-terracotta" /> Siddipet</span><span className="inline-flex items-center gap-2"><HeartHandshake className="h-4 w-4 text-anushtan-terracotta" /> Parent dialogue</span><span className="inline-flex items-center gap-2"><Sprout className="h-4 w-4 text-anushtan-terracotta" /> Holistic learning</span></div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#E8E1D5] shadow-xl">
              <Image src="/campus-classroom-1.jpg" alt="Anushtan classroom" fill className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, CalendarCheck, CheckCircle2, Phone, Sparkles } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AdmissionsForm } from "@/components/sections/AdmissionsForm";

export const metadata: Metadata = {
    title: "Admissions | Anushtan Indic School",
    description: "Plan a campus visit and begin your enquiry for the 2026–27 academic year at Anushtan Indic School.",
};

const visitTopics = [
    ["See the learning in context", "Explore the classrooms, activity spaces, and the settings where a school day comes to life."],
    ["Talk about your child", "Discuss the grade you are considering, your child&apos;s needs, and the questions that matter to your family."],
    ["Understand the next step", "Our admissions team will guide you through the enquiry process and current availability."],
];

export default function Admissions() {
    return (
        <div className="min-h-screen bg-[#fcfaf6]">
            <Navbar />

            <main>
                <section className="overflow-hidden bg-anushtan-terracotta text-white">
                    <div className="container-custom grid min-h-[640px] items-center gap-12 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
                        <div className="relative z-10 max-w-2xl">
                            <span className="mb-6 inline-flex rounded-full border border-anushtan-gold/40 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-anushtan-gold">
                                2026–27 academic year
                            </span>
                            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Admissions at Anushtan</p>
                            <h1 className="font-heading text-5xl font-bold leading-[0.98] md:text-7xl">Start with a <span className="text-anushtan-gold">school visit.</span></h1>
                            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
                                The best way to understand Anushtan is to see a school day in context. Come explore the campus, share what matters for your child, and ask every question on your mind.
                            </p>
                            <div className="mt-10 flex flex-wrap gap-4">
                                <a href="#enquire" className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-4 font-bold text-anushtan-terracotta shadow-lg transition-all hover:-translate-y-0.5 hover:bg-anushtan-parchment">
                                    Request a campus visit <ArrowRight className="h-5 w-5" />
                                </a>
                                <a href="tel:+919044454441" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-4 font-bold text-white transition-colors hover:bg-white/10">
                                    <Phone className="h-5 w-5" /> Call admissions
                                </a>
                            </div>
                        </div>

                        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                            <div className="absolute -inset-5 rounded-[2.5rem] border border-anushtan-gold/30" />
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
                                <Image src="/campus-classroom-1.jpg" alt="Anushtan classroom" fill priority className="object-cover" sizes="(min-width: 1024px) 43vw, 90vw" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 bg-black/35 p-5 backdrop-blur-sm">
                                    <CalendarCheck className="mb-3 h-6 w-6 text-anushtan-gold" />
                                    <p className="font-heading text-xl font-bold">A campus visit is a conversation, not a commitment.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-anushtan-border bg-white py-10">
                    <div className="container-custom flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
                        <p className="max-w-2xl text-lg leading-relaxed text-anushtan-charcoal/80">Bring your questions. We will help you understand the learning approach, grade eligibility, campus life, and the right next step for your family.</p>
                        <div className="flex items-center gap-3 font-semibold text-anushtan-terracotta"><Phone className="h-5 w-5" /> +91 9044 454 441</div>
                    </div>
                </section>

                <section className="py-24 md:py-32">
                    <div className="container-custom">
                        <div className="mb-14 max-w-3xl">
                            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-anushtan-gold">Your visit, your questions</p>
                            <h2 className="font-heading text-4xl font-bold leading-tight text-anushtan-charcoal md:text-6xl">A decision made with more clarity.</h2>
                            <p className="mt-6 text-lg leading-relaxed text-anushtan-charcoal/75">Choosing a school is personal. The visit is designed to give you a real sense of Anushtan, without pressure or unnecessary promises.</p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            {visitTopics.map(([title, text], index) => (
                                <article key={title} className="min-h-[250px] rounded-2xl border border-anushtan-border bg-white p-8 shadow-sm">
                                    <span className="font-heading text-5xl font-bold text-anushtan-gold/60">0{index + 1}</span>
                                    <h3 className="mt-6 font-heading text-2xl font-bold text-anushtan-terracotta">{title}</h3>
                                    <p className="mt-4 leading-relaxed text-anushtan-charcoal/75">{text}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="enquire" className="bg-[#eee2cf] py-24 md:py-28">
                    <div className="container-custom grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                        <div className="lg:sticky lg:top-28">
                            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-anushtan-terracotta">Request a visit</p>
                            <h2 className="font-heading text-4xl font-bold leading-tight text-anushtan-terracotta md:text-5xl">Tell us a little about your child.</h2>
                            <p className="mt-6 text-lg leading-relaxed text-anushtan-charcoal/75">Share the essentials below. Our admissions team will get in touch to plan a visit and guide you through the next step.</p>
                            <div className="mt-10 space-y-4">
                                {[
                                    "A short enquiry—no payment or commitment needed",
                                    "Discuss your child&apos;s grade and current availability",
                                    "Get a guided view of the campus and school life",
                                ].map((item) => (
                                    <p key={item} className="flex gap-3 text-anushtan-charcoal/80"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-anushtan-terracotta" />{item}</p>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-anushtan-border bg-white p-8 shadow-xl md:p-10">
                            <AdmissionsForm />
                        </div>
                    </div>
                </section>

                <section className="py-24 md:py-28">
                    <div className="container-custom grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
                        <div>
                            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-anushtan-gold">A simple next step</p>
                            <h2 className="font-heading text-4xl font-bold leading-tight text-anushtan-charcoal md:text-5xl">From enquiry to enrolment, without the maze.</h2>
                            <p className="mt-6 text-lg leading-relaxed text-anushtan-charcoal/75">We keep the process straightforward, so families can focus on what matters: finding the right environment for their child.</p>
                        </div>
                        <div className="space-y-4">
                            {[
                                ["01", "Send an enquiry", "Share your details and preferred grade through the form."],
                                ["02", "Plan your visit", "Choose a convenient time to see the campus and speak with the team."],
                                ["03", "Choose with confidence", "Understand the next formalities once you feel Anushtan is the right fit."],
                            ].map(([number, title, text]) => (
                                <div key={number} className="flex gap-5 rounded-2xl border border-anushtan-border bg-white p-6 shadow-sm">
                                    <span className="font-heading text-3xl font-bold text-anushtan-gold">{number}</span>
                                    <div><h3 className="font-heading text-xl font-bold text-anushtan-charcoal">{title}</h3><p className="mt-2 leading-relaxed text-anushtan-charcoal/70">{text}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-anushtan-charcoal py-20 text-white md:py-24">
                    <div className="container-custom grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                        <div>
                            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-anushtan-gold">Find us in Siddipet</p>
                            <h2 className="font-heading text-4xl font-bold leading-tight md:text-5xl">Come and see the campus for yourself.</h2>
                            <p className="mt-6 text-lg leading-relaxed text-white/70">Beside SUDA Office, Siddipet. Our team will be happy to help you plan your visit.</p>
                            <a href="https://maps.app.goo.gl/bPBGFH48J7z9fpcg9" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 font-bold text-anushtan-gold transition-colors hover:text-white">
                                Open in Google Maps <ArrowRight className="h-5 w-5" />
                            </a>
                        </div>
                        <div className="relative h-[340px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                src="https://maps.google.com/maps?q=Anushtan%20Indic%20School%2C%20Beside%20SUDA%20Office%2C%20Siddipet&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                loading="lazy"
                                title="Anushtan Indic School location"
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-anushtan-charcoal pb-24 md:pb-28">
                    <div className="container-custom border-t border-white/10 pt-12 text-center">
                        <Sparkles className="mx-auto h-7 w-7 text-anushtan-gold" />
                        <p className="mt-5 font-heading text-2xl italic text-white/80">The first step is simply to come, see, and ask.</p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

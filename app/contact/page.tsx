import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <Hero
                title="Contact Us"
                subtitle="We are here to answer your questions and welcome you to our community."
                background="bg-primary/5"
            />

            <section className="py-24 bg-background">
                <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Info */}
                    <div>
                        <SectionHeader title="Get in Touch" align="left" />
                        <div className="space-y-8 mb-12">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 bg-surface rounded-full flex items-center justify-center text-primary shadow-sm shrink-0"><MapPin /></div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Visit Campus</h4>
                                    <p className="text-text/70">123 Knowledge Park, [City], [State], India - 500000</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-12 w-12 bg-surface rounded-full flex items-center justify-center text-primary shadow-sm shrink-0"><Mail /></div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Email Us</h4>
                                    <p className="text-text/70">admissions@anushtanschool.edu</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-12 w-12 bg-surface rounded-full flex items-center justify-center text-primary shadow-sm shrink-0"><Phone /></div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Call Us</h4>
                                    <p className="text-text/70">+91 98765 43210</p>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="h-64 bg-surface rounded-lg border border-text/10 flex items-center justify-center text-text/30">
                            [GOOGLE_MAP_EMBED_PLACEHOLDER]
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-surface p-8 rounded-lg shadow-sm border border-text/5">
                        <h3 className="font-heading text-2xl font-bold mb-6">Send a Message</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input type="text" className="w-full h-10 px-3 rounded border border-text/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" className="w-full h-10 px-3 rounded border border-text/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="your@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input type="tel" className="w-full h-10 px-3 rounded border border-text/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="+91" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Message</label>
                                <textarea className="w-full h-32 px-3 py-2 rounded border border-text/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="How can we help?" />
                            </div>
                            <Button fullWidth>Submit Inquiry</Button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

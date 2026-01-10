"use client";

import { Button } from "@/components/ui/Button";

export const HeroSection = () => {
    return (
        <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center bg-anushtan-charcoal">
            {/* Hero Image Background */}
            <div className="absolute inset-0 z-0">
                {/* Gradient Overlay for Blending */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-anushtan-charcoal z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-anushtan-charcoal/90 via-transparent to-anushtan-charcoal/90 z-10" />

                {/* 
                   Using an img tag for the background to ensure it covers properly.
                   In a real Next.js app, using <Image fill ... /> is better, but requires importing Image.
                   I will use a div with background image or standard img tag relative.
                */}
                <div className="w-full h-full relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/hero-banner-collage.png"
                        alt="Anushtan Hero Banner"
                        className="w-full h-full object-cover object-top opacity-80"
                    />
                </div>
            </div>

            <div className="container-custom relative z-20 text-center flex flex-col items-center">
                <div className="inline-block border border-anushtan-gold/30 bg-anushtan-charcoal/50 backdrop-blur-md px-6 py-2 rounded-full mb-8">
                    <span className="text-anushtan-gold font-bold tracking-[0.2em] text-sm uppercase">
                        Admissions Opening June 2026
                    </span>
                </div>

                <h1 className="font-heading text-6xl md:text-7xl lg:text-9xl font-bold text-anushtan-parchment mb-8 leading-none">
                    Ancient Roots.<br />
                    <span className="text-anushtan-terracotta italic">Global Minds.</span>
                </h1>

                <p className="text-xl md:text-2xl text-anushtan-parchment/80 max-w-3xl mb-12 font-light leading-relaxed">
                    Architecting the next generation through a USA-supervised ecosystem. Where Vedantic strength meets Silicon Valley logic.
                </p>

                <div className="flex flex-col md:flex-row gap-6">
                    <Button href="/admissions" className="bg-anushtan-terracotta text-white hover:bg-anushtan-terracotta/90 border-0 px-10 py-8 text-xl tracking-wide shadow-[0_0_30px_rgba(107,49,38,0.3)]">
                        Secure a Founding Batch Seat
                    </Button>
                    <Button href="#trayi" variant="outline" className="text-anushtan-gold border-anushtan-gold/50 hover:bg-anushtan-gold/10 px-10 py-8 text-xl tracking-wide">
                        Explore the Trayi Path
                    </Button>
                </div>
            </div>
        </section>
    );
};

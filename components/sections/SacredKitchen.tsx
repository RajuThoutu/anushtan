import { Check } from "lucide-react";

const features = [
    "A2 Desi Cow Milk for brain development",
    "Ancient Grains (Millets) for sustained energy",
    "Zero-Sugar Standard for cognitive focus",
    "Sahabhojan: The culture of humble service"
];

export function SacredKitchen() {
    return (
        <section className="py-24 bg-surface relative overflow-hidden">
            <div className="container-custom relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-anushtan-primary mb-6 leading-tight">
                            Food is Prana. <br />
                            <span className="text-anushtan-accent">Nutrition is Sacred.</span>
                        </h2>
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-anushtan-accent/20 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-anushtan-primary" />
                                    </div>
                                    <p className="text-lg text-foreground/80">{feature}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 h-96 w-full relative rounded-2xl overflow-hidden bg-anushtan-bg border border-border">
                        {/* Placeholder for Kitchen/Food Image */}
                        <div className="absolute inset-0 flex items-center justify-center text-anushtan-charcoal/40 bg-anushtan-accent/5">
                            <span className="font-heading text-xl">Sacred Kitchen & Dining Image</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

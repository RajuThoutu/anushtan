import { Card } from "@/components/ui/Card";

interface Stream {
    name: string;
    focus: string;
    target: string;
}

const streams: Stream[] = [
    {
        name: "Mathematical Sciences",
        focus: "Logic, Coding, Analytical Thinking",
        target: "JEE, BITSAT, Architecture"
    },
    {
        name: "Life Sciences",
        focus: "Biology, Research, Ecology",
        target: "NEET, Sustainability, Medicine"
    },
    {
        name: "Management & Governance",
        focus: "Economics, Ethics, Leadership",
        target: "IAS, Entrepreneurship, Global Business"
    }
];

export function SwadharmaStreams() {
    return (
        <section className="py-24 bg-anushtan-bg">
            <div className="container-custom">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="font-heading text-4xl font-bold text-anushtan-primary mb-6">
                        The Swadharma Streams
                    </h2>
                    <p className="text-xl text-anushtan-charcoal/80">
                        The 8th Grade Pivot: Why force a future leader into a JEE factory? We recognize the unique nature of every child.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {streams.map((stream, index) => (
                        <Card key={index} className="bg-surface border-border p-8 hover:shadow-lg transition-shadow duration-300">
                            <h3 className="font-heading text-2xl font-bold text-anushtan-primary mb-4">
                                {stream.name}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold text-anushtan-accent uppercase tracking-wider mb-2">Focus</h4>
                                    <p className="text-foreground/80">{stream.focus}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-anushtan-accent uppercase tracking-wider mb-2">Target</h4>
                                    <p className="text-foreground/80">{stream.target}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

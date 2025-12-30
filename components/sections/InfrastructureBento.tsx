import clsx from "clsx";

interface BentoItem {
    title: string;
    desc: string;
    className?: string;
}

const items: BentoItem[] = [
    {
        title: "The Living Lab",
        desc: "Goshala & Organic Farm",
        className: "md:col-span-2 md:row-span-2 min-h-[300px]"
    },
    {
        title: "The Digital Sanctum",
        desc: "AI & Robotics Hub",
        className: "md:col-span-1 md:row-span-1 min-h-[200px]"
    },
    {
        title: "The Open-Air Mandapa",
        desc: "Nature-integrated learning",
        className: "md:col-span-1 md:row-span-1 min-h-[200px]"
    },
    {
        title: "The Sports Arena",
        desc: "Character through grit",
        className: "md:col-span-2 md:row-span-1 min-h-[200px]"
    }
];

export function InfrastructureBento() {
    return (
        <section className="py-24 bg-anushtan-bg">
            <div className="container-custom">
                <h2 className="font-heading text-4xl font-bold text-center text-anushtan-primary mb-16">
                    Infrastructure for the Soul
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className={clsx(
                                "group relative p-8 rounded-xl border border-border bg-surface overflow-hidden hover:shadow-lg transition-all duration-300",
                                item.className
                            )}
                        >
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <h3 className="font-heading text-2xl font-bold text-anushtan-primary group-hover:text-anushtan-accent transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-lg text-foreground/80 mt-2">
                                    {item.desc}
                                </p>
                            </div>

                            {/* Decorative background accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-anushtan-primary/5 rounded-bl-full -mr-8 -mt-8" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

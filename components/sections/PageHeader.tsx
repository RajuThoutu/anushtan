import React from "react";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
    return (
        <section className={`pt-32 pb-12 border-b border-black/[0.08] ${className || "bg-anushtan-ivory"}`}>
            <div className="container-custom text-center">
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-anushtan-maroon mb-4">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-lg md:text-xl text-anushtan-charcoal max-w-3xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}

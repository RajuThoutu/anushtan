import * as React from "react";
import { cn } from "@repo/ui";

interface HeroProps {
    title: string;
    subtitle?: string;
    className?: string;
    children?: React.ReactNode;
    align?: "center" | "left";
    background?: string; // class name
}

export function Hero({
    title,
    subtitle,
    className,
    children,
    align = "center",
    background = "bg-background",
}: HeroProps) {
    return (
        <section
            className={cn(
                "relative py-20 lg:py-32 overflow-hidden",
                background,
                className
            )}
        >
            <div
                className={cn(
                    "container-custom relative z-10 flex flex-col gap-6",
                    align === "center" ? "items-center text-center" : "items-start text-left"
                )}
            >
                <h1 className="font-heading text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl max-w-4xl leading-tight">
                    {title}
                </h1>

                {subtitle && (
                    <p className="max-w-2xl text-lg text-text/80 sm:text-xl leading-relaxed">
                        {subtitle}
                    </p>
                )}

                {children && (
                    <div className="mt-8 flex flex-wrap gap-4 justify-center">
                        {children}
                    </div>
                )}
            </div>

            {/* Decorative background element placeholder */}
            <div className="absolute inset-0 -z-10 opacity-5 bg-[url('/pattern.png')] bg-repeat" />
        </section>
    );
}

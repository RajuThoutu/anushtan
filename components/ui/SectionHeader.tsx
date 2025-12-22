import { cn } from "../ui/Button";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    className?: string;
    align?: "center" | "left";
}

export function SectionHeader({
    title,
    subtitle,
    className,
    align = "center",
}: SectionHeaderProps) {
    return (
        <div
            className={cn(
                "mb-12 flex flex-col gap-3",
                align === "center" ? "items-center text-center" : "items-start text-left",
                className
            )}
        >
            <div className="h-1 w-20 bg-anushtan-maroon/40 rounded-full mb-2" />
            <h2 className="font-heading text-3xl font-bold text-anushtan-maroon sm:text-4xl">
                {title}
            </h2>
            {subtitle && (
                <p className="max-w-2xl text-lg text-anushtan-charcoal/70">{subtitle}</p>
            )}
        </div>
    );
}

import * as React from "react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    href?: string;
    fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", href, fullWidth, children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50";

        const variants = {
            primary: "bg-primary text-white hover:bg-opacity-90 shadow-sm",
            secondary: "bg-secondary text-white hover:bg-opacity-90 shadow-sm",
            outline: "border border-primary text-primary hover:bg-primary/10",
            ghost: "hover:bg-primary/10 text-primary",
        };

        const sizes = {
            sm: "h-9 px-3 text-sm",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-8 text-lg",
        };

        const classes = cn(
            baseStyles,
            variants[variant],
            sizes[size],
            fullWidth && "w-full",
            className
        );

        if (href) {
            return (
                <a href={href} className={classes}>
                    {children}
                </a>
            );
        }

        return (
            <button ref={ref} className={classes} {...props}>
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button, cn };

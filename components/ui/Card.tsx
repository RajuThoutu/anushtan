import * as React from "react";
import { cn } from "./Button"; // Reusing cn utility

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverEffect = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-surface rounded-lg border border-primary/10 p-6 shadow-sm",
                    hoverEffect && "transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/30",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Card.displayName = "Card";

export { Card };

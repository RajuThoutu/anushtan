import * as React from "react";
import { cn } from "./Button";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverEffect = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-white rounded-lg border border-anushtan-border p-6 shadow-sm",
                    hoverEffect && "transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-anushtan-maroon/20",
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

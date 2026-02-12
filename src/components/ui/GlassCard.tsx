import { forwardRef } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
    children: React.ReactNode;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ hover = false, padding = "md", children, className = "", ...props }, ref) => {
        const paddings = {
            none: "",
            sm: "p-4",
            md: "p-6",
            lg: "p-8",
        };

        return (
            <div
                ref={ref}
                className={`bg-white/[0.07] backdrop-blur-md border border-white/[0.12] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${hover ? "hover:bg-white/[0.12] transition-colors" : ""} ${paddings[padding]} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

GlassCard.displayName = "GlassCard";
export default GlassCard;

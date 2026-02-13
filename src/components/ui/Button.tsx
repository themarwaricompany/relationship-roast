

import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "whatsapp";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    fullWidth?: boolean;
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", size = "md", loading = false, fullWidth = false, children, className = "", disabled, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-xl active:scale-[0.97]";

        const variants = {
            primary: "bg-red text-white hover:bg-red-hover shadow-[0_4px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_4px_28px_rgba(220,38,38,0.5)]",
            secondary: "bg-white/[0.08] backdrop-blur-md border border-white/[0.15] text-white hover:bg-white/[0.14]",
            ghost: "bg-white/[0.06] border border-white/[0.1] text-white/90 hover:text-white hover:bg-white/[0.1]",
            whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-[0_4px_20px_rgba(37,211,102,0.3)]",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3.5 text-base",
            lg: "px-8 py-4 text-lg",
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Loading...
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = "Button";
export default Button;


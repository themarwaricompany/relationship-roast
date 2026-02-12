interface BackgroundProps {
    children: React.ReactNode;
}

export default function Background({ children }: BackgroundProps) {
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative"
            style={{ backgroundImage: "url('/images/bg.png')" }}
        >
            {/* Warm cinematic overlay */}
            <div className="fixed inset-0 bg-[rgba(20,10,5,0.45)] pointer-events-none z-0" />
            {/* Warm gradient overlay for extra depth */}
            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[rgba(20,10,5,0.2)] to-[rgba(10,5,2,0.6)] pointer-events-none z-0" />
            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}

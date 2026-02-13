export default function Header() {
    return (
        <header className="flex items-center justify-between px-5 py-4">
            <a href="/" className="flex items-center gap-2 group">
                <span className="text-xl">🫡</span>
                <span className="text-xs text-white/30 font-mono tracking-tight group-hover:text-white/50 transition-colors">
                    jorukagulaam.com
                </span>
            </a>
        </header>
    );
}

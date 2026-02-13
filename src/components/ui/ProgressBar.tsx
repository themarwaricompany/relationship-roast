import { motion } from "framer-motion";

interface ProgressBarProps {
    current: number;
    total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
    const percentage = (current / total) * 100;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/50 font-medium">Question {current} of {total}</span>
                <span className="text-sm text-white/30 font-medium">
                    {Math.round(percentage)}%
                </span>
            </div>
            <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-red rounded-full"
                    initial={false}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}

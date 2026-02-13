import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingAICTAProps {
    onOpenChat: () => void;
}

const FloatingAICTA = ({ onOpenChat }: FloatingAICTAProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [pulse, setPulse] = useState(false);

    // Collapse on scroll down, expand on scroll up
    useEffect(() => {
        let lastY = window.scrollY;
        const onScroll = () => {
            const currentY = window.scrollY;
            setCollapsed(currentY > lastY && currentY > 300);
            lastY = currentY;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Gentle pulse every 15 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setPulse(true);
            setTimeout(() => setPulse(false), 1200);
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.button
            onClick={onOpenChat}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 1.5 }}
            className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 glass-card rounded-full shadow-2xl transition-all duration-300 border border-primary/20 hover:border-primary/50 hover:shadow-primary/20 hover:shadow-2xl cursor-pointer group ${collapsed ? "px-3.5 py-3.5" : "px-5 py-3"
                }`}
        >
            {/* Animated gradient ring */}
            <div className="absolute inset-0 rounded-full gradient-ai opacity-20 group-hover:opacity-40 transition-opacity" />

            <div className="relative">
                <Sparkles
                    className={`w-5 h-5 text-primary transition-transform group-hover:scale-110 ${pulse ? "scale-125" : ""
                        }`}
                />
                {pulse && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-ping" />
                )}
            </div>

            <AnimatePresence>
                {!collapsed && (
                    <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm font-medium text-foreground whitespace-nowrap overflow-hidden"
                    >
                        Ask Pedro's AI
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default FloatingAICTA;

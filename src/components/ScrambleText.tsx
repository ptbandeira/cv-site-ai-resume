import { useState, useEffect, useCallback } from "react";

interface ScrambleTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
}

const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`01";

const ScrambleText = ({
    text,
    className = "",
    delay = 400,
    duration = 1200,
}: ScrambleTextProps) => {
    const [display, setDisplay] = useState(text);
    const [started, setStarted] = useState(false);

    const scramble = useCallback(() => {
        const totalFrames = Math.floor(duration / 30); // ~30ms per frame
        let frame = 0;

        const interval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;

            // Progressively reveal characters left-to-right
            const revealed = Math.floor(progress * text.length);

            const newText = text
                .split("")
                .map((char, i) => {
                    if (char === " ") return " ";
                    if (i < revealed) return text[i];
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join("");

            setDisplay(newText);

            if (frame >= totalFrames) {
                clearInterval(interval);
                setDisplay(text);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [text, duration]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStarted(true);
            scramble();
        }, delay);
        return () => clearTimeout(timer);
    }, [delay, scramble]);

    return (
        <span className={className}>
            {started ? display : text.replace(/./g, (c) => (c === " " ? " " : "░"))}
        </span>
    );
};

export default ScrambleText;

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { GripVertical, AlertTriangle, Database } from "lucide-react";

const rawData = `{
  "store_id": "WAW-Hub-03",
  "sku": "IBU-400-BL60",
  "product": "Ibuprofen 400mg x60",
  "current_stock": 12,
  "avg_daily_demand": 8.4,
  "reorder_point": 50,
  "last_shipment": "2026-02-06",
  "supplier_lead_days": 3,
  "status": "CRITICAL_LOW",
  "region": "Mazowieckie",
  "warehouse": "Warsaw Central Hub"
}`;

const DataTransformation = () => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current || !isDragging.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
        setSliderPos(pct);
    }, []);

    const handleMouseDown = useCallback(() => {
        isDragging.current = true;
        const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
        const onMouseUp = () => {
            isDragging.current = false;
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }, [handleMove]);

    const handleTouchStart = useCallback(() => {
        isDragging.current = true;
        const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
        const onTouchEnd = () => {
            isDragging.current = false;
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("touchend", onTouchEnd);
    }, [handleMove]);

    const showInsight = sliderPos > 60;
    const scanProgress = Math.min(100, Math.max(0, (sliderPos - 30) * (100 / 40)));

    return (
        <section className="py-20 px-6 bg-secondary/30">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                        Excel to Insight
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Drag the slider to see raw pharmacy data become an actionable business alert — in real time.
                    </p>
                </div>

                {/* Slider container */}
                <div
                    ref={containerRef}
                    className="relative rounded-2xl overflow-hidden glass-card select-none"
                    style={{ height: 380, cursor: "col-resize" }}
                >
                    {/* Before (Raw Data) — full width background */}
                    <div className="absolute inset-0 bg-[#0F172A] p-6 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <Database className="w-4 h-4 text-slate-500" />
                            <span className="agent-text text-slate-500 uppercase tracking-wider font-bold">
                                Raw Data • pharmacy_inventory.json
                            </span>
                        </div>
                        <pre className="agent-text text-emerald-400/80 leading-relaxed flex-1 overflow-hidden whitespace-pre">
                            {rawData}
                        </pre>
                    </div>

                    {/* After (Insight) — clipped by slider */}
                    <div
                        className="absolute inset-0 bg-background p-6 flex flex-col justify-center items-center"
                        style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
                    >
                        <motion.div
                            animate={{ opacity: showInsight ? 1 : 0, scale: showInsight ? 1 : 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-sm w-full"
                        >
                            {/* Alert Card */}
                            <div className="bg-white rounded-xl border border-amber-200 shadow-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Stock Alert</p>
                                        <p className="text-[10px] font-mono text-muted-foreground">Auto-generated • Just now</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 mb-4">
                                    <p className="text-sm text-amber-900 font-medium leading-relaxed">
                                        ⚠️ <strong>Ibuprofen 400mg</strong> critically low at Warsaw Hub.
                                        Current stock covers <strong>1.4 days</strong> at avg demand.
                                        Reorder required immediately — supplier lead time is 3 business days.
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <span className="text-[10px] font-mono px-2 py-1 bg-red-50 text-red-600 rounded-full border border-red-200">CRITICAL</span>
                                    <span className="text-[10px] font-mono px-2 py-1 bg-secondary text-muted-foreground rounded-full border border-border">WAW-Hub-03</span>
                                    <span className="text-[10px] font-mono px-2 py-1 bg-secondary text-muted-foreground rounded-full border border-border">Mazowieckie</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Scanning line */}
                    {sliderPos > 30 && sliderPos < 65 && (
                        <motion.div
                            className="absolute top-0 w-0.5 h-full gradient-ai opacity-60"
                            style={{ left: `${sliderPos}%` }}
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    )}

                    {/* Slider handle */}
                    <div
                        className="absolute top-0 h-full flex items-center z-10"
                        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                    >
                        <div className="w-1 h-full bg-white/80" />
                        <div className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-border flex items-center justify-center cursor-grab active:cursor-grabbing">
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>

                    {/* Labels */}
                    <div className="absolute top-4 left-4 z-20">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 bg-slate-800 text-slate-300 rounded-full">
                            Before
                        </span>
                    </div>
                    <div className="absolute top-4 right-4 z-20">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 bg-white text-foreground rounded-full border border-border shadow-sm">
                            After
                        </span>
                    </div>

                    {/* Scan progress */}
                    {scanProgress > 0 && scanProgress < 100 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                            <span className="agent-text px-3 py-1.5 gradient-ai text-white rounded-full">
                                Scanning... {Math.round(scanProgress)}%
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default DataTransformation;

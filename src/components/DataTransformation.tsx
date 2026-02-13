import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSpreadsheet, Play, AlertTriangle } from "lucide-react";

const rawJson = `[
  { "product": "Ibuprofen 400mg",
    "stock": 12,
    "region": "Mazowieckie",
    "warehouse": "Warsaw Central Hub" },
  { "product": "Amoxicillin 500mg",
    "stock": 340,
    "region": "Małopolskie",
    "warehouse": "Kraków South" },
  { "product": "Metformin 850mg",
    "stock": 189,
    "region": "Śląskie",
    "warehouse": "Katowice Depot" }
]`;

type Row = { product: string; stock: number; region: string; warehouse: string; alert: boolean };

const tableData: Row[] = [
    { product: "Ibuprofen 400mg", stock: 12, region: "Mazowieckie", warehouse: "Warsaw Central Hub", alert: true },
    { product: "Amoxicillin 500mg", stock: 340, region: "Małopolskie", warehouse: "Kraków South", alert: false },
    { product: "Metformin 850mg", stock: 189, region: "Śląskie", warehouse: "Katowice Depot", alert: false },
];

const headers = ["Product", "Stock", "Region", "Warehouse"];

const DataTransformation = () => {
    const [phase, setPhase] = useState<"json" | "processing" | "table">("json");
    const [visibleCells, setVisibleCells] = useState(0);
    const [showAlert, setShowAlert] = useState(false);

    const totalCells = tableData.length * headers.length;

    const handleTransform = () => {
        setPhase("processing");
        setVisibleCells(0);
        setShowAlert(false);

        setTimeout(() => {
            setPhase("table");
        }, 800);
    };

    // Cell-by-cell population effect
    useEffect(() => {
        if (phase !== "table") return;

        if (visibleCells < totalCells) {
            const timer = setTimeout(() => {
                setVisibleCells((v) => v + 1);
            }, 60);
            return () => clearTimeout(timer);
        }

        // All cells populated → show alert after brief pause
        if (visibleCells >= totalCells && !showAlert) {
            const timer = setTimeout(() => setShowAlert(true), 400);
            return () => clearTimeout(timer);
        }
    }, [phase, visibleCells, totalCells, showAlert]);

    const handleReset = () => {
        setPhase("json");
        setVisibleCells(0);
        setShowAlert(false);
    };

    const isCellVisible = (rowIdx: number, colIdx: number) => {
        const cellIndex = rowIdx * headers.length + colIdx;
        return cellIndex < visibleCells;
    };

    const getCellValue = (row: Row, colIdx: number) => {
        switch (colIdx) {
            case 0: return row.product;
            case 1: return row.stock.toString();
            case 2: return row.region;
            case 3: return row.warehouse;
            default: return "";
        }
    };

    return (
        <section className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                        Excel to Insight
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Raw data becomes structured intelligence. Watch JSON transform into
                        an actionable Excel view — with alerts.
                    </p>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden">
                    <AnimatePresence mode="wait">
                        {/* ─── JSON Phase ─── */}
                        {phase === "json" && (
                            <motion.div
                                key="json"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-red-400" />
                                        <span className="w-3 h-3 rounded-full bg-amber-400" />
                                        <span className="w-3 h-3 rounded-full bg-green-400" />
                                        <span className="ml-3 text-xs font-mono text-muted-foreground">
                                            pharmacy_inventory.json
                                        </span>
                                    </div>
                                </div>
                                <pre className="bg-slate-900 text-emerald-400 rounded-lg p-5 text-xs font-mono leading-relaxed overflow-x-auto">
                                    {rawJson}
                                </pre>
                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={handleTransform}
                                        className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                        <FileSpreadsheet className="w-4 h-4" />
                                        Transform to Excel
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── Processing Phase ─── */}
                        {phase === "processing" && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-6 flex flex-col items-center justify-center min-h-[320px] gap-4"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent"
                                />
                                <p className="agent-text text-muted-foreground">
                                    Parsing schema... mapping columns... validating types...
                                </p>
                            </motion.div>
                        )}

                        {/* ─── Excel Table Phase ─── */}
                        {phase === "table" && (
                            <motion.div
                                key="table"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                                        <span className="text-xs font-mono text-muted-foreground">
                                            pharmacy_inventory.xlsx
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-muted-foreground">
                                        {Math.min(visibleCells, totalCells)}/{totalCells} cells
                                    </span>
                                </div>

                                <div className="overflow-x-auto rounded-lg border border-border">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-emerald-600 text-white">
                                                {headers.map((h) => (
                                                    <th
                                                        key={h}
                                                        className="px-4 py-2.5 text-left text-xs font-semibold tracking-wider uppercase"
                                                    >
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.map((row, rowIdx) => (
                                                <tr
                                                    key={rowIdx}
                                                    className={`border-b border-border transition-colors ${row.alert && showAlert
                                                            ? "bg-red-50 dark:bg-red-950/30"
                                                            : rowIdx % 2 === 0
                                                                ? "bg-card"
                                                                : "bg-secondary/30"
                                                        }`}
                                                >
                                                    {headers.map((_, colIdx) => (
                                                        <td
                                                            key={colIdx}
                                                            className="px-4 py-2.5 font-mono text-xs"
                                                        >
                                                            {isCellVisible(rowIdx, colIdx) ? (
                                                                <motion.span
                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    transition={{
                                                                        type: "spring",
                                                                        stiffness: 500,
                                                                        damping: 25,
                                                                    }}
                                                                    className={
                                                                        row.alert && showAlert && colIdx === 1
                                                                            ? "text-red-600 font-bold"
                                                                            : "text-foreground"
                                                                    }
                                                                >
                                                                    {getCellValue(row, colIdx)}
                                                                </motion.span>
                                                            ) : (
                                                                <span className="inline-block w-2 h-4 bg-muted-foreground/20 animate-pulse rounded-sm" />
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Alert Card */}
                                <AnimatePresence>
                                    {showAlert && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className="mt-5 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3"
                                        >
                                            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                                                    ⚠️ Stock Alert: Ibuprofen critically low
                                                </p>
                                                <p className="agent-text text-red-700/80 dark:text-red-400/80 mt-1">
                                                    Warsaw Central Hub — 12 units remaining.
                                                    Auto-reorder threshold is 50 units. Triggering procurement workflow.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="mt-4 flex justify-center">
                                    <button
                                        onClick={handleReset}
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                                    >
                                        <Play className="w-3 h-3" /> Replay
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default DataTransformation;

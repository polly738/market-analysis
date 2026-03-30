/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
    BarChart3,
    Factory,
    Shield,
    Gavel,
    Rocket,
    Share2,
    Download,
    CheckCircle2,
    TrendingUp,
    HeartPulse,
    DollarSign,
    Globe,
    Building2,
    Search,
    Quote,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fetchAnalysis } from "./api";

// --- Types ---

interface SearchHistoryItem {
    id: string;
    market: string;
    company: string;
    active?: boolean;
    go?: boolean;
    summary?: string;
}

// --- Components ---

const SidebarItem = ({
    item,
    onClick,
}: {
    item: SearchHistoryItem;
    onClick: () => void;
}) => {
    return (
        <div
            onClick={onClick}
            className={`group flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium ${
                item.active
                    ? "bg-white shadow-sm text-blue-700 ring-1 ring-slate-200"
                    : "text-slate-600 hover:bg-slate-200/50 hover:translate-x-1"
            }`}
        >
            <span className="truncate">
                {item.market} / {item.company}
            </span>
        </div>
    );
};

export default function App() {
    const [targetMarket, setTargetMarket] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [viewState, setViewState] = useState<
        "result" | "analyzing" | "user-inputting"
    >("user-inputting");
    const [activeId, setActiveId] = useState("");
    const [historyData, setHistoryData] = useState<
        {
            id: string;
            market: string;
            company: string;
            go?: boolean;
            summary?: string;
        }[]
    >([]);

    const history = historyData.map((item) => ({
        ...item,
        active: item.id === activeId,
    }));

    const activeItem = history.find((item) => item.active);

    const handleNewAnalysis = () => {
        setTargetMarket("");
        setCompanyName("");
        setActiveId("");
        setViewState("user-inputting");
    };

    const handleExecute = async () => {
        const newId = String(Date.now());
        setHistoryData((prev) => [
            ...prev,
            {
                id: newId,
                market: targetMarket,
                company: companyName,
                go: undefined as boolean | undefined,
                summary: "",
            },
        ]);
        setActiveId(newId);
        setIsAnalyzing(true);
        setViewState("analyzing");

        try {
            const result = await fetchAnalysis({
                market: targetMarket,
                company: companyName,
            });
            setHistoryData((prev) =>
                prev.map((item) =>
                    item.id === newId
                        ? { ...item, go: result.go, summary: result.summary }
                        : item,
                ),
            );
            setViewState("result");
        } catch {
            setViewState("user-inputting");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fbf9f8] text-slate-900 font-sans selection:bg-blue-100">
            {/* Top Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center px-8 h-16">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        Enterprise Architect Engine
                    </span>
                </div>
            </nav>

            {/* Sidebar */}
            <aside className="h-screen w-64 fixed left-0 top-0 pt-20 bg-slate-50 flex flex-col border-r border-slate-200">
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="px-4 py-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Search History
                    </div>
                    <div className="space-y-1">
                        {history.map((item) => (
                            <SidebarItem
                                key={item.id}
                                item={item}
                                onClick={() => {
                                    setActiveId(item.id);
                                    setTargetMarket(item.market);
                                    setCompanyName(item.company);
                                    setViewState("result");
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="shrink-0 p-4">
                    <button
                        onClick={handleNewAnalysis}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm shadow-md shadow-blue-200 transition-all active:scale-[0.98]"
                    >
                        New Analysis
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 pt-24 px-12 pb-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <header className="mb-10">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                Intelligence Engine
                            </span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                            Strategic Market Analysis
                        </h1>
                        <p className="text-slate-500 max-w-2xl text-lg leading-relaxed font-light">
                            Utilize our proprietary LLM-driven architect to
                            evaluate market saturation and company alignment for
                            immediate investment decisions.
                        </p>
                    </header>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-12 gap-8">
                        {/* Form Section */}
                        <section className="col-span-12 lg:col-span-5">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                                <h2 className="text-lg font-bold mb-8 flex items-center gap-2.5 text-slate-800">
                                    <Search className="w-5 h-5 text-blue-600" />
                                    Analysis Parameters
                                </h2>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Target Market
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={targetMarket}
                                                onChange={(e) =>
                                                    setTargetMarket(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-0 rounded-xl py-3.5 px-4 text-slate-700 transition-all outline-none"
                                            />
                                            <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Company Name
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={companyName}
                                                onChange={(e) =>
                                                    setCompanyName(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-0 rounded-xl py-3.5 px-4 text-slate-700 transition-all outline-none"
                                            />
                                            <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={handleExecute}
                                            disabled={isAnalyzing}
                                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
                                        >
                                            {isAnalyzing ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Rocket className="w-5 h-5" />
                                            )}
                                            {isAnalyzing
                                                ? "Processing..."
                                                : "Execute Analysis"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Results Section */}
                        <section className="col-span-12 lg:col-span-7">
                            <AnimatePresence mode="wait">
                                {viewState === "result" && activeItem ? (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white h-full p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col"
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h2 className="text-lg font-bold text-slate-800">
                                                    Strategic Verdict
                                                </h2>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Real-time synthesis
                                                    completed 2m ago
                                                </p>
                                            </div>
                                        </div>

                                        {/* Verdict Card */}
                                        <div className="flex items-center gap-8 mb-10 p-8 bg-slate-50 rounded-2xl relative overflow-hidden border border-slate-100">
                                            <div className="relative z-10 flex items-center gap-6">
                                                <div
                                                    className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl ring-4 ${activeItem?.go ? "bg-blue-600 shadow-blue-200 ring-blue-50" : "bg-red-600 shadow-red-200 ring-red-50"}`}
                                                >
                                                    <CheckCircle2 className="w-10 h-10" />
                                                </div>
                                                <div>
                                                    <div
                                                        className={`text-5xl font-black tracking-tighter uppercase leading-none ${activeItem?.go ? "text-blue-600" : "text-red-600"}`}
                                                    >
                                                        {activeItem?.go
                                                            ? "Go"
                                                            : "No-Go"}
                                                    </div>
                                                    <div className="text-sm font-medium text-slate-500 mt-1">
                                                        {activeItem?.market} /{" "}
                                                        {activeItem?.company}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Decorative Gradient */}
                                            <div
                                                className={`absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l ${activeItem?.go ? "from-blue-500/5" : "from-red-500/5"} to-transparent`}
                                            />
                                        </div>

                                        {/* Executive Summary */}
                                        <div className="flex-1 space-y-4">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                Executive Summary & Reason
                                            </label>
                                            <div className="bg-slate-50 rounded-2xl p-8 relative border border-slate-100">
                                                <Quote className="absolute -top-3 -left-1 text-blue-600/10 w-12 h-12" />
                                                <p className="text-slate-600 leading-relaxed italic text-lg relative z-10">
                                                    "The target company,{" "}
                                                    <span className="text-slate-900 font-medium not-italic">
                                                        {activeItem?.company}
                                                    </span>
                                                    , in the{" "}
                                                    <span className="text-slate-900 font-medium not-italic">
                                                        {activeItem?.market}
                                                    </span>{" "}
                                                    market —{" "}
                                                    {activeItem?.summary}"
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : viewState === "analyzing" ? (
                                    <motion.div
                                        key="analyzing"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center"
                                    >
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                            <BarChart3 className="w-8 h-8 text-slate-300 animate-pulse" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-600">
                                            Generating Intelligence...
                                        </h3>
                                        <p className="text-sm text-slate-400 mt-2 max-w-xs">
                                            Our LLM architect is synthesizing
                                            market data and company filings.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="user-inputting"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center"
                                    >
                                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                            <Search className="w-8 h-8 text-blue-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-600">
                                            New Analysis
                                        </h3>
                                        <p className="text-sm text-slate-400 mt-2 max-w-xs">
                                            Enter a target market and company
                                            name, then click Execute Analysis to
                                            begin.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

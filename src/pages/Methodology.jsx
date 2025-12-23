import { useState, useEffect } from "react";
import {
    Database,
    BrainCircuit,
    Stethoscope,
    GitBranch,
    Layers,
    CheckCircle2,
    Scale,
    ArrowRight
} from "lucide-react";

export default function Methodology() {
    const [activeSection, setActiveSection] = useState("ingestion");

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            // Offset for sticky headers
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = ["ingestion", "architecture", "inference", "performance"];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= -150 && rect.top <= 300) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { id: "ingestion", label: "Data Ingestion" },
        { id: "architecture", label: "Architecture" },
        { id: "inference", label: "Inference" },
        { id: "performance", label: "Validation" }
    ];

    return (
        <div className="min-h-screen bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

                {/* header */}
                <div className="space-y-4 max-w-4xl">
                    <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-slate-600 text-xs font-bold uppercase tracking-wider">
                        Project Documentation & Pipeline
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight break-words">
                        About the Project
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
                        An explainable AI pipeline that detects early-stage Alzheimer's from spontaneous speech. This project combines state-of-the-art NLP (DeBERTa) with clinical linguistic feature extraction.
                    </p>
                </div>

                {/* Mobile Navigation */}
                <div className="lg:hidden sticky top-16 z-40 -mx-4 px-4 bg-white/95 backdrop-blur border-b border-slate-100 py-3 mb-6">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`flex-none px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeSection === item.id
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                    : "bg-slate-50 text-slate-600 border border-slate-200"
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-24 space-y-2 border-l-2 border-slate-100 pl-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`block w-full text-left py-2 px-2 text-sm font-medium transition-colors rounded-lg ${activeSection === item.id
                                        ? "text-indigo-600 bg-indigo-50"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="col-span-1 lg:col-span-9 space-y-20 min-w-0">

                        {/* 1. DATA INGESTION */}
                        <section id="ingestion" className="space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <Database size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">1. Data Ingestion & Preprocessing</h2>
                            </div>
                            <p className="text-slate-600">
                                We process standard <code>.CHA</code> clinical transcripts using a specialized <strong>Two-Pass Parsing Strategy</strong> to capture both global discourse patterns and local syntactic features.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                                        <GitBranch size={18} className="text-blue-500" /> Pass 1: Global Stats
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        We scan the full patient session to calculate the <strong>Type-Token Ratio (TTR)</strong>, a global proxy for vocabulary richness and cognitive decline.
                                    </p>
                                </div>
                                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                                        <Layers size={18} className="text-blue-500" /> Pass 2: Injection
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Sentences are cleaned for BERT while <strong>explicitly preserving fillers</strong> (&-um, &-uh) and tokenizing pauses ([PAUSE]) as critical markers.
                                    </p>
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono">
                                Extracting: Fillers, Repetitions [/+], Retracing [//], Errors [*], Pauses
                            </div>
                        </section>

                        {/* 2. ARCHITECTURE */}
                        <section id="architecture" className="space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <BrainCircuit size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">2. Hybrid Neural Architecture</h2>
                            </div>
                            <p className="text-slate-600">
                                The core model is a <strong>ResearchHybridModel</strong> that fuses deep contextual embeddings with explicit linguistic vectors via a learnable gate.
                            </p>

                            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 relative">
                                    <div className="hidden md:block absolute top-1/2 left-4 right-4 h-0.5 bg-slate-700 -z-0"></div>
                                    <div className="md:hidden absolute top-4 bottom-4 left-1/2 w-0.5 bg-slate-700 -z-0"></div>

                                    <div className="relative z-10 bg-slate-800 p-4 rounded-xl border border-slate-700 w-full md:w-1/3 text-center">
                                        <div className="text-indigo-400 font-bold mb-1">DeBERTa Base</div>
                                        <div className="text-xs text-slate-400">Layers 0-5 Frozen</div>
                                        <div className="text-xs text-slate-400">Layers 6-11 Fine-Tuned</div>
                                    </div>

                                    <div className="relative z-10 bg-slate-900 p-1 rounded-full text-slate-500">
                                        <ArrowRight size={16} className="rotate-90 md:rotate-0" />
                                    </div>

                                    <div className="relative z-10 bg-slate-800 p-4 rounded-xl border border-slate-700 w-full md:w-1/3 text-center">
                                        <div className="text-purple-400 font-bold mb-1">Gated Fusion</div>
                                        <div className="text-xs text-slate-400">Sigmoid Gate</div>
                                        <div className="text-xs text-slate-400">z * Txt + (1-z) * Feat</div>
                                    </div>

                                    <div className="relative z-10 bg-slate-900 p-1 rounded-full text-slate-500">
                                        <ArrowRight size={16} className="rotate-90 md:rotate-0" />
                                    </div>

                                    <div className="relative z-10 bg-slate-800 p-4 rounded-xl border border-slate-700 w-full md:w-1/3 text-center">
                                        <div className="text-teal-400 font-bold mb-1">BiLSTM + Attn</div>
                                        <div className="text-xs text-slate-400">Temporal Context</div>
                                        <div className="text-xs text-slate-400">Explainable Weights</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. INFERENCE */}
                        <section id="inference" className="space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                    <Stethoscope size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">3. Clinical Inference</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <h4 className="font-bold text-slate-800">Recall-Dependent Thresholding</h4>
                                    <p className="text-sm text-slate-600">
                                        Medical screening requires high sensitivity. Based on validation curves, we set the decision threshold to <strong>0.15 - 0.20</strong>.
                                    </p>
                                    <div className="inline-block px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-100">
                                        Operating Point: 0.15
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-bold text-slate-800">Attention Maps</h4>
                                    <p className="text-sm text-slate-600">
                                        We intercept the attention layer weights to visualize exactly which sentences triggered the dementia classification, providing "Explainable AI" for clinicians.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 4. PERFORMANCE */}
                        <section id="performance" className="space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                    <Scale size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">4. Performance</h2>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 border border-slate-200 rounded-xl text-center bg-white shadow-sm">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Test AUC</div>
                                    <div className="text-3xl font-black text-slate-900 mt-1">0.874</div>
                                </div>
                                <div className="p-4 border border-slate-200 rounded-xl text-center bg-white shadow-sm">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accuracy</div>
                                    <div className="text-3xl font-black text-slate-900 mt-1">81.1%</div>
                                </div>
                                <div className="p-4 border border-slate-200 rounded-xl text-center bg-white shadow-sm">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sensitivity</div>
                                    <div className="text-3xl font-black text-slate-900 mt-1">83.9%</div>
                                </div>
                            </div>

                            {/* Detailed Table */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden mt-6">
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-semibold text-slate-700">
                                    Final Sensitivity Analysis (Test Set)
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-white text-slate-500 font-semibold border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-3 whitespace-nowrap">Threshold</th>
                                                <th className="px-6 py-3 whitespace-nowrap">Sensitivity</th>
                                                <th className="px-6 py-3 whitespace-nowrap">Specificity</th>
                                                <th className="px-6 py-3 whitespace-nowrap">Accuracy</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            <tr className="bg-emerald-50/50">
                                                <td className="px-6 py-3 font-mono font-bold text-emerald-700">0.15 (Rec.)</td>
                                                <td className="px-6 py-3 font-bold text-emerald-700">85.5%</td>
                                                <td className="px-6 py-3">67.4%</td>
                                                <td className="px-6 py-3">77.5%</td>
                                            </tr>
                                            <tr className="">
                                                <td className="px-6 py-3 font-mono font-medium text-slate-600">0.20</td>
                                                <td className="px-6 py-3 font-bold text-emerald-600">83.9%</td>
                                                <td className="px-6 py-3">77.6%</td>
                                                <td className="px-6 py-3 font-bold text-slate-900">81.1%</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-3 font-mono text-slate-500">0.25</td>
                                                <td className="px-6 py-3 font-bold text-emerald-600">80.7%</td>
                                                <td className="px-6 py-3">79.6%</td>
                                                <td className="px-6 py-3">80.2%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

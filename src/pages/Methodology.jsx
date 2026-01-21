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
                                We combine data from the <strong>Pitt Corpus, ADReSS 2020, and ADReSSo 2021</strong>, implementing a strict age/gender binning strategy to ensure a <strong>1:1 ratio</strong> of AD to Control subjects.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                                        <GitBranch size={18} className="text-blue-500" /> Segmentation
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        We use time-stamped CSVs to distinctively isolate <strong>"Participant"</strong> speech from "Investigator" speech, preventing data leakage in the audio branch.
                                    </p>
                                </div>
                                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                                        <Layers size={18} className="text-blue-500" /> Augmentation
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        To maximize robust training, we employ <strong>SpecAugment</strong> (Time/Freq masking) for audio and <strong>EDA</strong> (Synonym replacement) for text.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 2. ARCHITECTURE */}
                        <section id="architecture" className="space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <BrainCircuit size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">2. Tri-Branch Fusion Architecture</h2>
                            </div>
                            <p className="text-slate-600">
                                The system mimics a clinician's diagnostic process by fusing three distinct modalities via a <strong>Late Fusion</strong> strategy into a 144-dimensional vector.
                            </p>

                            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 relative">
                                    <div className="hidden md:block absolute top-1/2 left-4 right-4 h-0.5 bg-slate-700 -z-0"></div>
                                    <div className="md:hidden absolute top-4 bottom-4 left-1/2 w-0.5 bg-slate-700 -z-0"></div>

                                    <div className="relative z-10 bg-slate-800 p-4 rounded-xl border border-slate-700 w-full md:w-1/3 text-center">
                                        <div className="text-indigo-400 font-bold mb-1">Semantic Branch</div>
                                        <div className="text-xs text-slate-400">DeBERTa v3 + BiLSTM</div>
                                        <div className="text-xs text-slate-400">Captures Narrative Flow</div>
                                    </div>

                                    <div className="relative z-10 bg-slate-900 p-1 rounded-full text-slate-500">
                                        <ArrowRight size={16} className="rotate-90 md:rotate-0" />
                                    </div>

                                    <div className="relative z-10 bg-slate-800 p-4 rounded-xl border border-slate-700 w-full md:w-1/3 text-center">
                                        <div className="text-purple-400 font-bold mb-1">Acoustic Branch</div>
                                        <div className="text-xs text-slate-400">ViT-base-patch16</div>
                                        <div className="text-xs text-slate-400">Mel-Spectrogram Analysis</div>
                                    </div>

                                    <div className="relative z-10 bg-slate-900 p-1 rounded-full text-slate-500">
                                        <ArrowRight size={16} className="rotate-90 md:rotate-0" />
                                    </div>

                                    <div className="relative z-10 bg-slate-800 p-4 rounded-xl border border-slate-700 w-full md:w-1/3 text-center">
                                        <div className="text-teal-400 font-bold mb-1">Linguistic Branch</div>
                                        <div className="text-xs text-slate-400">MLP (Dense Network)</div>
                                        <div className="text-xs text-slate-400">Explicit Clinical Markers</div>
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
                                    <h4 className="font-bold text-slate-800">Real-World ASR</h4>
                                    <p className="text-sm text-slate-600">
                                        Even without manual transcription, our model maintains <strong>87% accuracy</strong> using OpenAI Whisper generated transcripts, proving viability for automated screening.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-bold text-slate-800">Explainable AI</h4>
                                    <p className="text-sm text-slate-600">
                                        Each prediction is backed by detailed visualizations: modality contributions, probability distributions, and key segment highlighting for clinician review.
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
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">ASR Accuracy</div>
                                    <div className="text-3xl font-black text-slate-900 mt-1">87.0%</div>
                                </div>
                                <div className="p-4 border border-slate-200 rounded-xl text-center bg-white shadow-sm">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Deployment</div>
                                    <div className="text-3xl font-black text-slate-900 mt-1">Ready</div>
                                </div>
                                <div className="p-4 border border-slate-200 rounded-xl text-center bg-white shadow-sm">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Latency</div>
                                    <div className="text-3xl font-black text-slate-900 mt-1">&lt; 2s</div>
                                </div>
                            </div>

                            {/* Detailed Table */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden mt-6">
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-semibold text-slate-700">
                                    Ablation Study Analysis (Held-Out Test Set)
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-white text-slate-500 font-semibold border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-3 whitespace-nowrap">Experiment</th>
                                                <th className="px-6 py-3 whitespace-nowrap">Accuracy</th>
                                                <th className="px-6 py-3 whitespace-nowrap">Insight</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            <tr className="bg-emerald-50/50">
                                                <td className="px-6 py-3 font-mono font-bold text-emerald-700">Real-World ASR</td>
                                                <td className="px-6 py-3 font-bold text-emerald-700">87.04%</td>
                                                <td className="px-6 py-3">Clinically viable even with automated transcripts.</td>
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

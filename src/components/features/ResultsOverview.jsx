import { motion } from "framer-motion";
import { Activity, FileText, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useConfig } from "../../context/ConfigContext";

export default function ResultsOverview({ results, onViewDetail, onReset }) {
    const { config } = useConfig();
    // Calculate summary stats
    const totalFiles = results.length;
    const diseasedCount = results.filter(r => r.is_dementia).length;
    const healthyCount = totalFiles - diseasedCount;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6 text-slate-800"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Activity className="text-blue-600" /> Analysis Overview
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Processed {results.length} transcripts using DeBERTa v2.1 Protocol
                    </p>
                </div>
                <button
                    onClick={onReset}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-lg text-sm font-medium transition-all"
                >
                    Reset All
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <FileText size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">{totalFiles}</div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Analyzed</div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">{healthyCount}</div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Healthy Control</div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">{diseasedCount}</div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Cognitive Decline</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {results.map((result, index) => {
                    const isDementia = result.is_dementia;
                    const confidencePercent = (result.confidence * 100).toFixed(1);

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onViewDetail(result)}
                            className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl border ${result.is_pending ? 'bg-amber-50 border-amber-100 text-amber-600' : isDementia ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                        {result.is_pending ? <Activity size={24} /> : isDementia ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">{result.filename || `Transcript ${index + 1}`}</h3>
                                        <div className="flex items-center gap-3 text-sm mt-0.5">
                                            {result.is_pending ? (
                                                <span className="font-medium text-amber-700">Feature In Development</span>
                                            ) : (
                                                <span className={`font-medium ${isDementia ? 'text-red-700' : 'text-emerald-700'}`}>
                                                    {result.prediction}
                                                </span>
                                            )}

                                            {!result.is_pending && config.featureShowConfidence && (
                                                <>
                                                    <span className="text-slate-300">|</span>
                                                    <span className="text-slate-500">Confidence: {confidencePercent}%</span>
                                                </>
                                            )}

                                            {!result.is_pending && (
                                                <>
                                                    <span className="text-slate-300">|</span>
                                                    <span className="text-slate-400 text-xs uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded-full">{result.model_used || "Hybrid DeBERTa"}</span>
                                                </>
                                            )}

                                            {result.error && (
                                                <span className="text-red-500 font-bold ml-2">- Analysis Failed</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-600 transition-colors">
                                    <span className="text-sm font-medium hidden sm:block">View Report</span>
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

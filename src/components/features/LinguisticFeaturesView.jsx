import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { Quote, Activity, ChevronDown, ChevronUp, Mic, AudioWaveform, Layers } from "lucide-react";

export default function LinguisticFeaturesView({
    features,
    keySegments,
    isDementia,
    generatedTranscript,
    spectrogramBase64,
    modalityContributions
}) {
    const [showTranscript, setShowTranscript] = useState(true);
    const [showSpectrogram, setShowSpectrogram] = useState(true);

    // Format features for chart - handle empty features object
    const data = features && Object.keys(features).length > 0
        ? Object.entries(features).map(([key, value]) => ({
            name: key.replace(/_/g, ' ').toUpperCase(),
            value: parseFloat((value || 0).toFixed(3)),
            originalKey: key
        }))
        : [];

    // Format modality contributions for pie chart
    const modalityData = modalityContributions
        ? Object.entries(modalityContributions).map(([key, value]) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: parseFloat((value * 100).toFixed(1)),
            originalKey: key
        }))
        : [];

    const MODALITY_COLORS = {
        text: '#3b82f6',      // blue
        audio: '#8b5cf6',     // purple
        linguistic: '#10b981' // green
    };

    const barColor = isDementia ? "#ef4444" : "#10b981";

    // Helper to get segment importance - handles both V2 (importance) and V3 (marker_count)
    const getSegmentImportance = (seg) => {
        if (seg.importance !== undefined) {
            return seg.importance;
        }
        if (seg.marker_count !== undefined) {
            // Normalize marker_count to 0-1 range (assuming max ~5 markers)
            return Math.min(seg.marker_count / 5, 1);
        }
        return 0.5; // default
    };

    const getSegmentLabel = (seg) => {
        if (seg.importance !== undefined) {
            return `Impact Score: ${seg.importance}`;
        }
        if (seg.marker_count !== undefined) {
            return `Markers: ${seg.marker_count}`;
        }
        return '';
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-slate-500 uppercase text-xs font-bold tracking-wider flex items-center gap-2">
                    <Activity size={14} /> Linguistic Analysis & Explainer
                </h3>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">

                {/* Generated Transcript - ASR Mode */}
                {generatedTranscript && (
                    <div>
                        <button
                            onClick={() => setShowTranscript(!showTranscript)}
                            className="w-full flex items-center justify-between text-sm font-bold text-slate-800 mb-4 px-2 hover:text-blue-600 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <Mic size={16} className="text-purple-500" />
                                Whisper ASR Transcript
                            </span>
                            {showTranscript ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <AnimatePresence>
                            {showTranscript && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 mb-4"
                                >
                                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        {generatedTranscript}
                                    </p>
                                    <div className="mt-3 pt-3 border-t border-purple-100">
                                        <span className="text-xs text-purple-500 font-medium">Generated via OpenAI Whisper</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Modality Contributions - V3 only */}
                {modalityData.length > 0 && (
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-4 px-2 flex items-center gap-2">
                            <Layers size={16} className="text-blue-500" />
                            Modality Contributions
                        </h4>
                        <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl p-4 border border-slate-100">
                            <div className="flex items-center gap-6">
                                <div className="h-32 w-32 flex-shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={modalityData}
                                                innerRadius={30}
                                                outerRadius={50}
                                                paddingAngle={3}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {modalityData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={MODALITY_COLORS[entry.originalKey] || '#94a3b8'}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => `${value}%`}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1 space-y-2">
                                    {modalityData.map((entry) => (
                                        <div key={entry.originalKey} className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: MODALITY_COLORS[entry.originalKey] || '#94a3b8' }}
                                            />
                                            <span className="text-sm text-slate-600 flex-1">{entry.name}</span>
                                            <span className="text-sm font-semibold text-slate-800">{entry.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
                                Shows the relative contribution of each modality branch to the final prediction.
                            </p>
                        </div>
                    </div>
                )}

                {/* Spectrogram - V3 with audio */}
                {spectrogramBase64 && (
                    <div>
                        <button
                            onClick={() => setShowSpectrogram(!showSpectrogram)}
                            className="w-full flex items-center justify-between text-sm font-bold text-slate-800 mb-4 px-2 hover:text-blue-600 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <AudioWaveform size={16} className="text-indigo-500" />
                                Audio Spectrogram
                            </span>
                            {showSpectrogram ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <AnimatePresence>
                            {showSpectrogram && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100"
                                >
                                    <img
                                        src={spectrogramBase64}
                                        alt="Audio Spectrogram"
                                        className="w-full rounded-lg border border-indigo-100"
                                    />
                                    <p className="text-xs text-indigo-500 mt-3 pt-3 border-t border-indigo-100">
                                        Mel-spectrogram visualization processed by the ViT audio branch.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Linguistic Features Chart */}
                {data.length > 0 && (
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-4 px-2">Linguistic Biomarkers</h4>
                        <div className="h-64 w-full bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    layout="vertical"
                                    data={data}
                                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                >
                                    <XAxis type="number" domain={[0, 'auto']} hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={120}
                                        tick={{ fontSize: 10, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={barColor} opacity={0.8} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Key Segments */}
                {keySegments && keySegments.length > 0 && (
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-4 px-2">Key Contributing Segments</h4>
                        <div className="space-y-3">
                            {keySegments.map((seg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative group hover:bg-white hover:shadow-sm transition-all"
                                >
                                    <Quote size={16} className="absolute top-4 left-4 text-slate-300" />
                                    <p className="pl-8 text-sm text-slate-600 italic leading-relaxed">
                                        "{seg.text}"
                                    </p>
                                    <div className="mt-2 pl-8 flex items-center gap-2">
                                        <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${getSegmentImportance(seg) * 100}%`,
                                                    backgroundColor: barColor
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-slate-400">
                                            {getSegmentLabel(seg)}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

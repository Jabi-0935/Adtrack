import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Quote, Activity } from "lucide-react";

export default function LinguisticFeaturesView({ features, keySegments, isDementia }) {
    // Format features for chart
    const data = Object.entries(features).map(([key, value]) => ({
        name: key.replace(/_/g, ' ').toUpperCase(),
        value: parseFloat(value.toFixed(3)),
        originalKey: key
    }));

    const barColor = isDementia ? "#ef4444" : "#10b981";

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-slate-500 uppercase text-xs font-bold tracking-wider flex items-center gap-2">
                    <Activity size={14} /> Linguistic Analysis & Explainer
                </h3>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">

                {/* Linguistic Features Chart */}
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

                {/* Key Segments */}
                <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-4 px-2">Key Contributing Segments</h4>
                    <div className="space-y-3">
                        {keySegments && keySegments.map((seg, i) => (
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
                                            style={{ width: `${seg.importance * 100}%`, backgroundColor: barColor }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-slate-400">Impact Score: {seg.importance}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

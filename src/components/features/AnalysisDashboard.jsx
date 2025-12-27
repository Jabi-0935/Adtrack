import { motion } from "framer-motion";
import { Activity, Printer, AlertTriangle, CheckCircle2 } from "lucide-react";
import HeatmapViewer from "./HeatmapViewer";
import LinguisticFeaturesView from "./LinguisticFeaturesView";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function AnalysisDashboard({ result, onReset }) {
  const isDementia = result.is_dementia;
  // Handle case where confidence might be missing or differently named, though context normalizes it.
  const confidencePercent = result.confidence ? (result.confidence * 100).toFixed(1) : "N/A";

  const data = [
    { name: isDementia ? 'Dementia Probability' : 'Healthy Probability', value: result.confidence ? result.confidence * 100 : 0 },
    { name: 'Uncertainty', value: 100 - (result.confidence ? result.confidence * 100 : 0) }
  ];

  /* Brighter Red/Rose for Dementia, Emerald/Teal for Control */
  const primaryColor = isDementia ? "#ef4444" : "#10b981";
  const secondaryColor = "#e2e8f0"; // slate-200

  const downloadReport = () => {
    window.print();
  };

  // Determine which visualizer to use
  const hasAttentionMap = Array.isArray(result.attention_map);
  const hasLinguisticFeatures = result.linguistic_features && typeof result.linguistic_features === 'object';

  // Safe sentence count
  const sentenceCount = hasAttentionMap
    ? result.attention_map.length
    : result.metadata?.sentence_count || "multiple";

  const protocolName = result.model_used || "Unknown Protocol";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 text-slate-800"
    >
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Activity className="text-blue-600" /> Analysis Report
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Patient ID: {result.filename} | Protocol: {protocolName}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={downloadReport}
            className="flex-1 md:flex-none justify-center items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm font-medium shadow-sm transition-all"
          >
            <Printer size={16} /> Print Report
          </button>
          <button
            onClick={onReset}
            className="flex-1 md:flex-none justify-center items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white border border-transparent rounded-lg text-sm font-medium shadow-md shadow-blue-600/10 transition-all"
          >
            New Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Column: Metrics (4/12 columns on desktop) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-full">

          {/* Diagnosis Card - Compact */}
          <div className="bg-white p-5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden flex-shrink-0">
            <h3 className="text-slate-500 uppercase text-xs font-bold tracking-wider mb-4">Diagnostic Assessment</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl border ${isDementia ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                {isDementia ? <AlertTriangle size={28} /> : <CheckCircle2 size={28} />}
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDementia ? 'text-red-700' : 'text-emerald-700'} tracking-tight leading-none`}>
                  {result.prediction || (isDementia ? "Dementia" : "Healthy Control")}
                </div>
                <div className="text-slate-500 text-xs mt-1">
                  Confidence Score: {confidencePercent}%
                </div>
              </div>
            </div>

            <div className="h-40 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell key="cell-0" fill={primaryColor} />
                    <Cell key="cell-1" fill={secondaryColor} />
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#1e293b' }}
                    itemStyle={{ color: '#1e293b' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold text-slate-800">{confidencePercent}%</span>
              </div>
            </div>
          </div>

          {/* Interpretation - Flexible height */}
          <div className="bg-white p-5 rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 flex-grow">
            <h3 className="text-slate-500 uppercase text-xs font-bold tracking-wider mb-2">Clinical Interpretation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Based on the analysis of <strong>{sentenceCount} sentences</strong>, the model identified {isDementia ? "patterns consistent with cognitive decline" : "no significant indicators of cognitive decline"}.
              <br /><br />
              {isDementia
                ? "Key indicators may include reduced lexical diversity, simplified syntactic structures, and specific disfluency markers detected by the AI protocol."
                : "The transcript demonstrates patterns typical of healthy controls, such as normal fluency and syntactic complexity."}
            </p>
          </div>
        </div>

        {/* Right Column: Heatmap/Features (8/12 columns on desktop) - Full Height */}
        <div className="lg:col-span-8 h-full min-h-[600px] lg:min-h-0">
          {hasAttentionMap ? (
            <HeatmapViewer attentionMap={result.attention_map} isDementia={isDementia} />
          ) : hasLinguisticFeatures ? (
            <LinguisticFeaturesView
              features={result.linguistic_features}
              keySegments={result.key_segments}
              isDementia={isDementia}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
              Visualization not available for this results format.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
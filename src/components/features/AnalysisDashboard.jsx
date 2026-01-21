import { motion } from "framer-motion";
import { Activity, Printer, AlertTriangle, CheckCircle2 } from "lucide-react";
import HeatmapViewer from "./HeatmapViewer";
import LinguisticFeaturesView from "./LinguisticFeaturesView";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useConfig } from "../../context/ConfigContext";

export default function AnalysisDashboard({ result, onReset }) {
  const { config } = useConfig();
  const isDementia = result.is_dementia;
  const confidencePercent = result.confidence ? (result.confidence * 100).toFixed(1) : "N/A";

  const data = [
    { name: isDementia ? 'Dementia Probability' : 'Healthy Probability', value: result.confidence ? result.confidence * 100 : 0 },
    { name: 'Uncertainty', value: 100 - (result.confidence ? result.confidence * 100 : 0) }
  ];

  const primaryColor = isDementia ? "#ef4444" : "#10b981";
  const secondaryColor = "#e2e8f0";

  const downloadReport = () => {
    window.print();
  };

  const hasAttentionMap = Array.isArray(result.attention_map);
  const hasLinguisticFeatures = result.linguistic_features && typeof result.linguistic_features === 'object';

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


      {/* Removed is_pending block */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        <div className="lg:col-span-4 space-y-6 flex flex-col h-full">

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
                {config.featureShowConfidence && (
                  <div className="text-slate-500 text-xs mt-1">
                    Confidence Score: {confidencePercent}%
                  </div>
                )}
              </div>
            </div>

            {config.featureShowConfidence && (
              <>
                {/* V3 Probability Bars - show when probabilities data is available */}
                {result.probabilities && (
                  <div className="mb-4 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-red-600 font-medium">Alzheimer's (AD)</span>
                        <span className="text-slate-600 font-semibold">
                          {(result.probabilities.AD * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.probabilities.AD * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-emerald-600 font-medium">Healthy Control</span>
                        <span className="text-slate-600 font-semibold">
                          {(result.probabilities.Control * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.probabilities.Control * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Pie chart - show when no V3 probabilities available */}
                {!result.probabilities && (
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
                )}
              </>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 flex-grow">
            <h3 className="text-slate-500 uppercase text-xs font-bold tracking-wider mb-2">Clinical Interpretation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Based on the analysis of <strong>{sentenceCount} sentences</strong>, the model identified {isDementia ? "patterns consistent with cognitive decline" : "no significant indicators of cognitive decline"}.
              <br /><br />
              {isDementia
                ? "Key indicators may include reduced lexical diversity, simplified syntactic structures, and specific disfluency markers detected by the AI protocol."
                : "The transcript demonstrates patterns typical of healthy controls, such as normal fluency and syntactic complexity."}
            </p>
            {result.modalities_used && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Modalities Used</h4>
                <div className="flex gap-2">
                  {result.modalities_used.map(m => (
                    <span key={m} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md capitalize">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8 h-full min-h-[600px] lg:min-h-0">
          {hasAttentionMap ? (
            <HeatmapViewer attentionMap={result.attention_map} isDementia={isDementia} />
          ) : (hasLinguisticFeatures || result.analysis?.linguistic_metrics || result.generated_transcript || result.spectrogram_base64 || result.modality_contributions || (result.key_segments && result.key_segments.length > 0)) ? (
            <LinguisticFeaturesView
              features={result.linguistic_features || result.analysis?.linguistic_metrics || {}}
              keySegments={result.key_segments || []}
              keySegmentsNote={result.key_segments_note}
              isDementia={isDementia}
              generatedTranscript={result.generated_transcript}
              spectrogramBase64={result.spectrogram_base64}
              modalityContributions={result.modality_contributions}
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
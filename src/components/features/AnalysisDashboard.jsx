import { motion } from "framer-motion";
import { Activity, FileText, RefreshCw, Download, BrainCircuit, AlertTriangle, CheckCircle2 } from "lucide-react";
import HeatmapViewer from "./HeatmapViewer";

export default function AnalysisDashboard({ result, onReset }) {
  const isDementia = result.is_dementia;
  const confidencePercent = (result.confidence * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto space-y-6"
    >
      {/* 1. The Head-Up Display (HUD) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Diagnosis */}
        <div className={`p-6 rounded-2xl border shadow-sm flex items-center gap-4 ${isDementia ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <div className={`p-3 rounded-xl ${isDementia ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {isDementia ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-60">Model Prediction</p>
            <h2 className={`text-2xl font-bold ${isDementia ? 'text-rose-900' : 'text-emerald-900'}`}>
              {result.prediction}
            </h2>
          </div>
        </div>

        {/* Card 2: Confidence */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confidence Score</span>
            <span className="text-2xl font-bold text-slate-900">{confidencePercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${confidencePercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full ${isDementia ? 'bg-rose-500' : 'bg-emerald-500'}`} 
            />
          </div>
        </div>

        {/* Card 3: Metadata */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center gap-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">File Analyzed</p>
          <div className="flex items-center gap-2 text-slate-700 font-medium truncate">
            <FileText size={16} />
            {result.filename}
          </div>
          <p className="text-xs text-slate-400 mt-1">Processed via ResearchHybridModel</p>
        </div>
      </div>

      {/* 2. Main Visualization Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        {/* Left: Summary & Actions */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <BrainCircuit size={300} />
          </div>
          
          <div className="relative z-10 space-y-6">
            <h3 className="text-xl font-semibold">Clinical Interpretation</h3>
            <p className="text-slate-300 leading-relaxed">
              The model analyzed <strong>{result.attention_map.length} sentences</strong>. 
              {isDementia 
                ? " Significant linguistic markers associated with cognitive decline were detected in the provided transcript. High attention scores correlate with repetitive phrasing or syntactic simplicity."
                : " The linguistic patterns align with the healthy control group. The model did not detect significant anomalies in syntax or vocabulary richness."}
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl flex items-center justify-center gap-2 transition-all">
              <Download size={18} />
              <span>Export Report (PDF)</span>
            </button>
            <button 
              onClick={onReset}
              className="w-full py-3 px-4 bg-white text-slate-900 hover:bg-slate-100 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-lg"
            >
              <RefreshCw size={18} />
              <span>Analyze New Patient</span>
            </button>
          </div>
        </div>

        {/* Right: The Heatmap (Takes up 2 columns) */}
        <div className="lg:col-span-2 h-full">
          <HeatmapViewer attentionMap={result.attention_map} isDementia={isDementia} />
        </div>
      </div>
    </motion.div>
  );
}
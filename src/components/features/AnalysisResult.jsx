import { motion } from "framer-motion";
import { Activity, BrainCircuit, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function AnalysisResult({ result, onReset }) {
  const isDementia = result.is_dementia;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden w-full max-w-6xl h-[calc(100vh-14rem)]"
    >
      {/* Compact Header */}
      <div className={cn(
        "p-4 text-white relative overflow-hidden",
        isDementia ? "bg-slate-900" : "bg-emerald-900"
      )}>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BrainCircuit size={100} />
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-xl backdrop-blur-md bg-white/20",
              isDementia ? "text-red-200" : "text-emerald-200"
            )}>
              {isDementia ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
            </div>
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Prediction</p>
              <h2 className="text-xl font-bold text-white">{result.prediction}</h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-white/60 text-xs font-medium uppercase">Confidence</p>
              <p className="text-2xl font-bold text-white">{(result.confidence * 100).toFixed(1)}%</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-right max-w-[120px]">
              <p className="text-white/60 text-xs font-medium uppercase">File</p>
              <p className="text-sm font-medium text-white truncate">{result.filename}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Fixed Grid */}
      <div className="grid grid-cols-4 h-[calc(100%-5rem)]">
        
        {/* Left Sidebar - Fixed width */}
        <div className="col-span-1 p-4 bg-slate-50/50 border-r border-slate-200 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Analysis</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Linguistic patterns indicate 
                <strong className={isDementia ? "text-red-600 ml-1" : "text-emerald-600 ml-1"}>
                  {isDementia ? "cognitive decline" : "healthy speech"}
                </strong>.
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-3 h-3 text-slate-400" />
                <span className="text-xs font-bold text-slate-700 uppercase">Intensity</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full", isDementia ? "bg-red-500" : "bg-emerald-500")}
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={onReset}
            className="w-full py-2 px-4 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-all"
          >
            New Analysis
          </button>
        </div>

        {/* Right Content - Scrollable */}
        <div className="col-span-3 p-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-slate-400" />
            <h3 className="text-base font-bold text-slate-800">Transcript Attention Map</h3>
          </div>
          
          <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-1">
              {result.attention_map.map((item, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={cn(
                    "inline relative cursor-help transition-colors duration-200 rounded px-1 py-0.5 mr-1 leading-7 text-sm",
                    item.attention_score > 0.1 ? "font-medium text-slate-900" : "text-slate-500"
                  )}
                  style={{
                    backgroundColor: isDementia 
                      ? `rgba(252, 165, 165, ${item.attention_score * 2})` 
                      : `rgba(110, 231, 183, ${item.attention_score * 2})`
                  }}
                  title={`Score: ${item.attention_score.toFixed(4)}`}
                >
                  {item.sentence}
                </motion.span>
              ))}
            </div>
          </div>
          
          <p className="mt-2 text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-300"></span>
            Darker highlights influenced diagnosis
          </p>
        </div>
      </div>
    </motion.div>
  );
}
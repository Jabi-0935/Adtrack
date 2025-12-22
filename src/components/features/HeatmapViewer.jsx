import { motion } from "framer-motion";
import { cn } from "../../lib/utils"; // Create this utility or inline it

export default function HeatmapViewer({ attentionMap, isDementia }) {
  // Base color for highlighting (Red for Dementia, Emerald for Control)
  const baseColor = isDementia ? "244, 63, 94" : "16, 185, 129"; // RGB values

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">
          Linguistic Attention Map
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Low Impact</span>
          <div className="w-16 h-2 rounded-full bg-gradient-to-r from-transparent via-slate-200 to-slate-400" />
          <span>High Impact</span>
        </div>
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar h-[400px] leading-8 text-slate-700 text-lg">
        {attentionMap.map((item, index) => {
          // Normalize opacity to be visible but readable (0.1 to 0.6)
          const opacity = Math.min(Math.max(item.attention_score, 0.05), 0.7);
          
          return (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              className="inline-block relative mr-1 px-1 rounded transition-colors duration-300 hover:brightness-95 cursor-help"
              style={{
                backgroundColor: `rgba(${baseColor}, ${opacity})`,
              }}
              title={`Attention Score: ${item.attention_score.toFixed(4)}`}
            >
              {item.sentence}
            </motion.span>
          );
        })}
      </div>
      
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-xs text-slate-400">
        * Darker highlights indicate sentences that the model weighed most heavily in its decision.
      </div>
    </div>
  );
}
import { motion } from "framer-motion";

export default function HeatmapViewer({ attentionMap, isDementia }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col border border-slate-200 shadow-xl shadow-slate-200/50">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
          Transcript Analysis
        </h3>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span>Low Attn</span>
          <div className="w-24 h-2 rounded-full bg-slate-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-current opacity-70" style={{ color: isDementia ? '#ef4444' : '#10b981' }} />
          </div>
          <span>High Attn</span>
        </div>
      </div>

      <div className="p-0 overflow-y-auto custom-scrollbar flex-1 bg-white text-sm leading-relaxed relative">
        {/* Line Numbers Decoration */}
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-slate-50 border-r border-slate-100 z-10 pointer-events-none" />

        <div className="p-6 pl-14 pt-6 space-y-2 font-mono">
          {attentionMap.map((item, index) => {
            const score = item.attention_score;
            // Use softer background colors for light mode legibility
            // Red-ish for dementia, Emerald-ish for control
            const baseColor = isDementia ? `254, 202, 202` : `167, 243, 208`; // red-200 / emerald-200

            // Opacity drives the "strength" of the highlight
            const opacity = Math.min(Math.max(score, 0), 1);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.01 }}
                className="relative group flex"
              >
                <span className="absolute -left-10 text-slate-400 select-none text-xs top-1 w-6 text-right">{index + 1}</span>
                <span
                  className="rounded px-1 transition-all duration-300 cursor-help relative text-slate-800"
                  style={{
                    backgroundColor: `rgba(${isDementia ? '252, 165, 165' : '110, 231, 183'}, ${opacity * 0.6})`, // lighter pastel
                    borderBottom: opacity > 0.5 ? `2px solid ${isDementia ? '#f87171' : '#34d399'}` : 'none'
                  }}
                >
                  {item.sentence}

                  {/* Tooltip on hover */}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-20">
                    Attention: {score.toFixed(4)}
                  </span>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between font-medium">
        <span>Sentence-Level Attention Map</span>
        <span>Total Sentences: {attentionMap.length}</span>
      </div>
    </div>
  );
}
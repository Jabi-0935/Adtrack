import { useState, useEffect } from "react";
import { usePrediction } from "../context/PredictionContext";
import Hero from "../components/features/Hero";
import AnalysisDashboard from "../components/features/AnalysisDashboard";
import ResultsOverview from "../components/features/ResultsOverview";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function Home() {
  const { results, resetPrediction } = usePrediction();
  const [selectedResult, setSelectedResult] = useState(null);

  // Auto-select removed to always show summary overview first
  // This ensures users see the stats (Healthy/Diseased counts) even for single files.

  useEffect(() => {
    // Reset selection if results are cleared
    if (results.length === 0) {
      setSelectedResult(null);
    }
  }, [results]);

  const handleBackToOverview = () => {
    setSelectedResult(null);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {results.length === 0 ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
          >
            <Hero />
          </motion.div>
        ) : selectedResult ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={handleBackToOverview}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Overview
            </button>
            <AnalysisDashboard result={selectedResult} onReset={resetPrediction} />
          </motion.div>
        ) : (
          <motion.div
            key="overview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
          >
            <ResultsOverview
              results={results}
              onViewDetail={setSelectedResult}
              onReset={resetPrediction}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
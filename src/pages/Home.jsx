import { usePrediction } from "../context/PredictionContext";
import Hero from "../components/features/Hero";
import AnalysisDashboard from "../components/features/AnalysisDashboard";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { result, resetPrediction } = usePrediction();

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-12">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
          >
            <Hero />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5 }}
          >
            <AnalysisDashboard result={result} onReset={resetPrediction} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
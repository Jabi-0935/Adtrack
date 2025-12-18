import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Loader2, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrediction } from "../../context/PredictionContext";
import DisclaimerModal from "../ui/DisclaimerModal";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function FileUpload() {
  const { predictDementia, loading, error, result, resetPrediction } = usePrediction();
  
  const [stagedFile, setStagedFile] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setStagedFile(acceptedFiles[0]);
      setShowDisclaimer(true);
    }
  }, []);

  const handleConfirmUpload = () => {
    if (stagedFile) {
      predictDementia(stagedFile);
      setShowDisclaimer(false);
      setStagedFile(null);
    }
  };

  const handleCancelUpload = () => {
    setStagedFile(null);
    setShowDisclaimer(false);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.cha'] },
    maxFiles: 1,
    multiple: false,
    disabled: loading
  });

  return (
    <>
      <DisclaimerModal 
        isOpen={showDisclaimer} 
        onConfirm={handleConfirmUpload} 
        onCancel={handleCancelUpload} 
      />

      <div className="w-full max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div
                {...getRootProps()}
                className={cn(
                  "relative group cursor-pointer flex flex-col items-center justify-center w-full h-72 rounded-3xl border-2 border-dashed transition-all duration-300 ease-out backdrop-blur-sm",
                  isDragActive 
                    ? "border-blue-500 bg-blue-50/50" 
                    : "border-slate-200 bg-white/80 hover:border-blue-400 hover:bg-slate-50 hover:shadow-lg hover:shadow-blue-500/5",
                  isDragReject && "border-red-500 bg-red-50",
                  loading && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
              >
                <input {...getInputProps()} />
                
                <div className="flex flex-col items-center space-y-5 text-center p-6">
                  <div className={cn(
                    "p-5 rounded-2xl shadow-sm transition-all duration-300",
                    isDragActive 
                      ? "bg-blue-100 text-blue-600 scale-110" 
                      : "bg-white border border-slate-100 text-slate-400 group-hover:text-blue-500 group-hover:border-blue-100"
                  )}>
                    {loading ? (
                      <Loader2 className="w-10 h-10 animate-spin" />
                    ) : (
                      <UploadCloud className="w-10 h-10" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-slate-800">
                      {loading ? "Analyzing Biomarkers..." : "Upload Clinical Transcript"}
                    </p>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                      {loading 
                        ? "Please wait while our models process the linguistic features." 
                        : "Drag & drop your .cha file here, or click to browse secure directory"}
                    </p>
                  </div>

                  {!loading && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span className="text-xs font-medium text-slate-500">.CHA files supported</span>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-start gap-3 p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 shadow-sm"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-1">Upload Error</span>
                    {error}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
            >
              <div className="relative p-8 flex flex-col items-center text-center space-y-8">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
                
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Analysis Complete</h3>
                  <p className="text-slate-500 mt-2">Data successfully processed by the inference engine.</p>
                </div>

                <div className="grid grid-cols-2 gap-px bg-slate-200 rounded-2xl overflow-hidden w-full max-w-md border border-slate-200 shadow-sm">
                  <div className="bg-slate-50 p-6 flex flex-col items-center justify-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Prediction</p>
                    <p className={cn(
                      "text-xl font-extrabold",
                      result.prediction === "Dementia" ? "text-red-600" : "text-slate-900"
                    )}>
                      {result.prediction}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-6 flex flex-col items-center justify-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confidence</p>
                    <p className="text-xl font-extrabold text-slate-900">
                      {(result.probability * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="w-full max-w-md pt-2">
                  <button
                    onClick={resetPrediction}
                    className="w-full bg-slate-900 text-white font-medium py-3.5 px-6 rounded-xl hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:scale-[0.99]"
                  >
                    Analyze Another Patient
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
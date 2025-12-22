import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Loader2, FileText, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrediction } from "../../context/PredictionContext";
import DisclaimerModal from "../ui/DisclaimerModal";
import AnalysisResult from "./AnalysisResult"; // Import the new component
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

      <div className="w-full flex justify-center">
        <AnimatePresence mode="wait">
          {!result ? (
            // UPLOAD STATE
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-2xl space-y-4"
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
                      {loading ? "Processing Transcript..." : "Upload Clinical Transcript"}
                    </p>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                      {loading 
                        ? "Extracting linguistic features and attention maps." 
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
            // RESULT STATE (New Component)
            <AnalysisResult result={result} onReset={resetPrediction} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Loader2, FileText, AlertCircle, HardDrive } from "lucide-react";
import { motion } from "framer-motion";
import { usePrediction } from "../../context/PredictionContext";
import DisclaimerModal from "../ui/DisclaimerModal";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function FileUpload() {
  const { predictDementia, loading, error, progress } = usePrediction();

  const [stagedFiles, setStagedFiles] = useState([]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setStagedFiles(acceptedFiles);
      setShowDisclaimer(true);
    }
  }, []);

  const handleConfirmUpload = () => {
    if (stagedFiles.length > 0) {
      predictDementia(stagedFiles);
      setShowDisclaimer(false);
      setStagedFiles([]);
    }
  };

  const handleCancelUpload = () => {
    setStagedFiles([]);
    setShowDisclaimer(false);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.cha'] },
    multiple: true,
    disabled: loading
  });

  return (
    <>
      <DisclaimerModal
        isOpen={showDisclaimer}
        onConfirm={handleConfirmUpload}
        onCancel={handleCancelUpload}
        title={stagedFiles.length > 1 ? `Upload ${stagedFiles.length} Transcripts?` : "Upload Clinical Transcript"}
      >
        <div className="mb-4 max-h-40 overflow-y-auto bg-slate-50 p-3 rounded-lg border border-slate-100">
          {stagedFiles.map((f, i) => (
            <div key={i} className="text-xs text-slate-600 flex items-center gap-2 py-1">
              <FileText size={12} className="text-blue-500" /> {f.name}
            </div>
          ))}
        </div>
      </DisclaimerModal>

      <div className="w-full bg-white rounded-3xl border border-slate-200/60 p-1 shadow-xl shadow-slate-200/50">
        <div
          {...getRootProps()}
          className={cn(
            "relative group cursor-pointer flex flex-col items-center justify-center w-full h-80 rounded-[1.3rem] border-2 border-dashed transition-all duration-300 ease-out overflow-hidden bg-slate-50/50",
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-slate-200 hover:border-blue-400 hover:bg-slate-50",
            isDragReject && "border-red-400 bg-red-50",
            loading && "opacity-80 cursor-not-allowed pointer-events-none"
          )}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center space-y-6 text-center p-6 relative z-10 w-full">
            <div className={cn(
              "p-6 rounded-2xl shadow-sm transition-all duration-300",
              isDragActive
                ? "bg-blue-100 text-blue-600 scale-110"
                : "bg-white border border-slate-200 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 group-hover:shadow-md"
            )}>
              {loading ? (
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              ) : (
                <UploadCloud className="w-12 h-12" />
              )}
            </div>

            <div className="space-y-2 w-full max-w-xs mx-auto">
              <p className="text-xl font-bold text-slate-800 tracking-tight">
                {loading ? "Analyzing Transcripts..." : "Upload Clinical Transcripts"}
              </p>

              {loading ? (
                <div className="space-y-2 w-full">
                  <p className="text-sm text-slate-500">
                    Processing {progress.current} of {progress.total} transcripts...
                  </p>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden relative">
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 bg-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Drag & drop your .CHA files here to begin analysis
                </p>
              )}
            </div>

            {!loading && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium">
                <FileText size={14} />
                <span>Supports multiple .cha files</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-start gap-3 p-4 mt-2 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-1">Analysis Error</span>
              {error.message || "An error occurred during analysis"}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
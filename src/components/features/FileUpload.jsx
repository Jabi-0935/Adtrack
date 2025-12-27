import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Loader2, FileText, AlertCircle, HardDrive, BrainCircuit, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { usePrediction } from "../../context/PredictionContext";
import { useConfig } from "../../context/ConfigContext";
import DisclaimerModal from "../ui/DisclaimerModal";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function FileUpload() {
  const { predictDementia, loading, error, progress, models } = usePrediction();
  const { config } = useConfig();
  const [selectedModel, setSelectedModel] = useState("");
  const [stagedFiles, setStagedFiles] = useState([]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Set default model when models are loaded or config changes
  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0]);
    }
  }, [models, selectedModel]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      // If multiple files disabled, take only the first one
      const filesToStage = config.featureMultipleFiles ? acceptedFiles : [acceptedFiles[0]];
      setStagedFiles(filesToStage);
      setShowDisclaimer(true);
    }
  }, [config.featureMultipleFiles]);

  const handleConfirmUpload = () => {
    if (stagedFiles.length > 0) {
      predictDementia(stagedFiles, selectedModel);
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
    multiple: config.featureMultipleFiles,
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

        {config.featureModelSelection && (
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <BrainCircuit size={12} /> Analysis Protocol: <span className="font-medium text-slate-600">{selectedModel}</span>
          </div>
        )}
      </DisclaimerModal>

      <div className="w-full bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">

        {/* Model Selection Header - Conditional */}
        {config.featureModelSelection && (
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Activity size={16} className="text-blue-500" />
              <span>Analysis Model</span>
            </div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={loading}
              className="text-sm bg-white border border-slate-200 text-slate-700 py-1.5 px-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:border-blue-300 transition-colors"
            >
              {models.length === 0 && <option>Loading models...</option>}
              {models.map(m => (
                <option key={m} value={m}>
                  {m.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="p-1">
          <div
            {...getRootProps()}
            className={cn(
              "relative group cursor-pointer flex flex-col items-center justify-center w-full h-72 rounded-[1.3rem] border-2 border-dashed transition-all duration-300 ease-out overflow-hidden bg-slate-50/50",
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
                "p-4 rounded-2xl shadow-sm transition-all duration-300",
                isDragActive
                  ? "bg-blue-100 text-blue-600 scale-110"
                  : "bg-white border border-slate-200 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 group-hover:shadow-md"
              )}>
                {loading ? (
                  <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                ) : (
                  <UploadCloud className="w-10 h-10" />
                )}
              </div>

              <div className="space-y-2 w-full max-w-xs mx-auto">
                <p className="text-lg font-bold text-slate-800 tracking-tight">
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
                    Drag & drop your .CHA {config.featureMultipleFiles ? "files" : "file"} here to begin analysis
                  </p>
                )}
              </div>

              {!loading && config.featureMultipleFiles && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium">
                  <FileText size={14} />
                  <span>Supports multiple .cha files</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-start gap-3 p-4 mx-1 mb-1 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100"
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
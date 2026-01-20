import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Loader2, FileText, AlertCircle, BrainCircuit, Activity, Music, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrediction } from "../../context/PredictionContext";
import { useConfig } from "../../context/ConfigContext";
import DisclaimerModal from "../ui/DisclaimerModal";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Model V3 Mode definitions
const V3_MODES = [
  {
    id: 'cha_only',
    name: 'Transcript Only',
    description: 'Analyze from .cha transcript file',
    chaRequired: true,
    audioRequired: false,
    badge: 'Text Analysis'
  },
  {
    id: 'cha_audio',
    name: 'Transcript + Audio',
    description: 'Enhanced analysis with time-aligned audio',
    chaRequired: true,
    audioRequired: true,
    badge: 'Full Multimodal'
  },
  {
    id: 'audio_only',
    name: 'Audio Only (ASR)',
    description: 'Auto-transcribe with Whisper AI',
    chaRequired: false,
    audioRequired: true,
    badge: 'Speech Recognition'
  }
];

export default function FileUpload() {
  const { predictDementia, loading, error, progress, models } = usePrediction();
  const { config } = useConfig();
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedV3Mode, setSelectedV3Mode] = useState('cha_only');
  const [stagedFiles, setStagedFiles] = useState([]);
  const [stagedAudioFile, setStagedAudioFile] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Set default model when models are loaded or config changes
  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0].name);
    }
  }, [models, selectedModel]);

  // Clear files when switching models or modes
  useEffect(() => {
    setStagedFiles([]);
    setStagedAudioFile(null);
  }, [selectedModel, selectedV3Mode]);

  const currentModelObj = models.find(m => m.name === selectedModel);
  const supportsAudio = currentModelObj?.audio || false;
  const currentV3Mode = V3_MODES.find(m => m.id === selectedV3Mode) || V3_MODES[0];

  // Determine what's required based on mode
  const chaRequired = supportsAudio ? currentV3Mode.chaRequired : true;
  const audioRequired = supportsAudio ? currentV3Mode.audioRequired : false;

  // CHA file drop handler
  const onDropCha = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      const filesToStage = config.featureMultipleFiles ? acceptedFiles : [acceptedFiles[0]];
      setStagedFiles(filesToStage);
    }
  }, [config.featureMultipleFiles]);

  // Audio file drop handler
  const onDropAudio = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setStagedAudioFile(acceptedFiles[0]);
    }
  }, []);

  // Check if we can submit
  const canSubmit = () => {
    const hasCha = stagedFiles.length > 0;
    const hasAudio = !!stagedAudioFile;

    if (chaRequired && !hasCha) return false;
    if (audioRequired && !hasAudio) return false;
    return hasCha || hasAudio;
  };

  const handleSubmit = () => {
    if (canSubmit()) {
      setShowDisclaimer(true);
    }
  };

  const handleConfirmUpload = () => {
    if (canSubmit()) {
      predictDementia(stagedFiles, selectedModel, stagedAudioFile);
      setShowDisclaimer(false);
      setStagedFiles([]);
      setStagedAudioFile(null);
    }
  };

  const handleCancelUpload = () => {
    setShowDisclaimer(false);
  };

  const removeStagedFile = (index) => {
    setStagedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeStagedAudio = () => {
    setStagedAudioFile(null);
  };

  // CHA dropzone config
  const { getRootProps: getChaRootProps, getInputProps: getChaInputProps, isDragActive: isChaActive, isDragReject: isChaReject } = useDropzone({
    onDrop: onDropCha,
    accept: { 'text/plain': ['.cha'] },
    multiple: config.featureMultipleFiles,
    disabled: loading || (supportsAudio && !chaRequired && !currentV3Mode.chaRequired)
  });

  // Audio dropzone config
  const { getRootProps: getAudioRootProps, getInputProps: getAudioInputProps, isDragActive: isAudioActive, isDragReject: isAudioReject } = useDropzone({
    onDrop: onDropAudio,
    accept: { 'audio/mpeg': ['.mp3'], 'audio/wav': ['.wav'], 'audio/x-wav': ['.wav'] },
    multiple: false,
    disabled: loading
  });

  // Determine modal title based on mode
  const getModalTitle = () => {
    if (supportsAudio) {
      return `${currentV3Mode.name} Analysis`;
    }
    return stagedFiles.length > 1 ? `Upload ${stagedFiles.length} Files` : "Upload File";
  };

  return (
    <>
      <DisclaimerModal
        isOpen={showDisclaimer}
        onConfirm={handleConfirmUpload}
        onCancel={handleCancelUpload}
        title={getModalTitle()}
      >
        <div className="mb-4 max-h-40 overflow-y-auto bg-slate-50 p-3 rounded-lg border border-slate-100">
          {stagedFiles.map((f, i) => (
            <div key={i} className="text-xs text-slate-600 flex items-center gap-2 py-1">
              <FileText size={12} className="text-blue-500" /> {f.name}
            </div>
          ))}
          {stagedAudioFile && (
            <div className="text-xs text-slate-600 flex items-center gap-2 py-1">
              <Music size={12} className="text-purple-500" /> {stagedAudioFile.name}
            </div>
          )}
        </div>

        {config.featureModelSelection && (
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <BrainCircuit size={12} /> {selectedModel}
            {supportsAudio && <span className="text-purple-500 ml-1">• {currentV3Mode.name}</span>}
          </div>
        )}

        {supportsAudio && selectedV3Mode === 'audio_only' && (
          <div className="mt-3 p-2 bg-purple-50 border border-purple-100 rounded-lg text-xs text-purple-700">
            <strong>ASR Mode:</strong> Audio will be transcribed using Whisper AI before analysis.
          </div>
        )}
      </DisclaimerModal>

      <div className="w-full bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">

        {/* Model Selection Header */}
        {config.featureModelSelection && (
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30">
            <div className="flex items-center justify-between">
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
                {models.length === 0 && <option key="loading">Loading models...</option>}
                {models.map(m => (
                  <option key={m.name} value={m.name}>
                    {m.name} {m.audio ? '(Multimodal)' : '(Text Only)'}
                  </option>
                ))}
              </select>
            </div>

            {/* V3 Mode Selector - Only show for multimodal models */}
            <AnimatePresence>
              {supportsAudio && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Input Mode
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {V3_MODES.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setSelectedV3Mode(mode.id)}
                        disabled={loading}
                        className={cn(
                          "relative p-3 rounded-xl border-2 text-left transition-all duration-200",
                          selectedV3Mode === mode.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-slate-200 hover:border-purple-300 bg-white"
                        )}
                      >
                        <div className="text-xs font-bold text-slate-800 mb-0.5">{mode.name}</div>
                        <div className="text-[10px] text-slate-500 leading-tight">{mode.description}</div>
                        <div className={cn(
                          "mt-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block",
                          selectedV3Mode === mode.id
                            ? "bg-purple-500 text-white"
                            : "bg-slate-100 text-slate-500"
                        )}>
                          {mode.badge}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="p-3 space-y-3">
          {/* CHA Upload Zone */}
          <div
            {...(chaRequired || (supportsAudio && currentV3Mode.id !== 'audio_only') ? getChaRootProps() : {})}
            className={cn(
              "relative group flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed transition-all duration-300 ease-out overflow-hidden",
              supportsAudio ? "h-32" : "h-64",
              // Disabled state for audio-only mode
              supportsAudio && currentV3Mode.id === 'audio_only'
                ? "opacity-40 cursor-not-allowed bg-slate-100 border-slate-200"
                : "cursor-pointer bg-slate-50/50",
              isChaActive
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 hover:border-blue-400",
              isChaReject && "border-red-400 bg-red-50",
              loading && "opacity-80 cursor-not-allowed pointer-events-none"
            )}
          >
            {!(supportsAudio && currentV3Mode.id === 'audio_only') && <input {...getChaInputProps()} />}

            <div className="flex flex-col items-center space-y-2 text-center p-4">
              <div className={cn(
                "p-2 rounded-xl transition-all",
                isChaActive ? "bg-blue-100 text-blue-600" : "bg-white border border-slate-200 text-slate-400"
              )}>
                {loading && !supportsAudio ? (
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                ) : (
                  <FileText className="w-6 h-6" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  Transcript (.cha)
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                    chaRequired ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"
                  )}>
                    {chaRequired ? "REQUIRED" : "DISABLED"}
                  </span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {supportsAudio && currentV3Mode.id === 'audio_only'
                    ? "Not used in ASR mode"
                    : "Drop .cha file or click to browse"}
                </p>
              </div>
            </div>

            {/* Staged CHA files */}
            {stagedFiles.length > 0 && (
              <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                {stagedFiles.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    <FileText size={10} /> {f.name.length > 15 ? f.name.slice(0, 15) + '...' : f.name}
                    <button onClick={(e) => { e.stopPropagation(); removeStagedFile(i); }} className="hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Audio Upload Zone - Only for multimodal models */}
          <AnimatePresence>
            {supportsAudio && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div
                  {...getAudioRootProps()}
                  className={cn(
                    "relative group cursor-pointer flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed transition-all duration-300 ease-out overflow-hidden",
                    stagedAudioFile
                      ? "bg-purple-50 border-purple-400"
                      : isAudioActive
                        ? "border-purple-500 bg-purple-50"
                        : "bg-purple-50/30 border-purple-200 hover:border-purple-400",
                    isAudioReject && "border-red-400 bg-red-50",
                    loading && "opacity-80 cursor-not-allowed pointer-events-none"
                  )}
                >
                  <input {...getAudioInputProps()} />

                  <div className="flex flex-col items-center space-y-2 text-center p-4">
                    <div className={cn(
                      "p-2 rounded-xl transition-all",
                      stagedAudioFile || isAudioActive
                        ? "bg-purple-100 text-purple-600"
                        : "bg-white border border-purple-200 text-purple-400"
                    )}>
                      <Music className="w-6 h-6" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        Audio File (.mp3, .wav)
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                          audioRequired ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                        )}>
                          {audioRequired ? "REQUIRED" : "OPTIONAL"}
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {stagedAudioFile ? stagedAudioFile.name : "Drop audio file or click to browse"}
                      </p>
                    </div>
                  </div>

                  {/* Staged Audio file */}
                  {stagedAudioFile && (
                    <div className="absolute bottom-2 left-2 right-2 flex justify-center">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        <Music size={10} /> {stagedAudioFile.name.length > 20 ? stagedAudioFile.name.slice(0, 20) + '...' : stagedAudioFile.name}
                        <button onClick={(e) => { e.stopPropagation(); removeStagedAudio(); }} className="hover:text-red-500">
                          <X size={12} />
                        </button>
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit() || loading}
            className={cn(
              "w-full py-3 rounded-xl font-semibold text-sm transition-all",
              canSubmit() && !loading
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing {progress.current} of {progress.total}...
              </span>
            ) : (
              "Analyze"
            )}
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-start gap-3 p-4 mx-3 mb-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100"
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
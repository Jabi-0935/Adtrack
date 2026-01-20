import { createContext, useContext, useState, useCallback, useEffect } from "react";
import apiClient from "../api/Client";

const PredictionContext = createContext();

export const PredictionProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [models, setModels] = useState([]);

  // Fetch available models on mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await apiClient.get("/models");
        // Backend returns { models: ["Model V1", "Model V2", "Model V3 (Multimodal)"] }
        // Transform to { name, audio } format for frontend
        if (response.models && Array.isArray(response.models)) {
          const transformedModels = response.models.map(model => {
            // Handle if backend sends string or object
            if (typeof model === 'string') {
              return {
                name: model,
                // Model V3 (Multimodal) supports audio
                audio: model.toLowerCase().includes('multimodal') || model.includes('V3')
              };
            }
            // Already in correct format
            return model;
          });
          setModels(transformedModels);
        }
      } catch (err) {
        console.error("Failed to fetch models:", err);
      }
    };
    fetchModels();
  }, []);

  const predictDementia = useCallback(async (files, modelName, audioFile = null) => {
    setLoading(true);
    setError(null);
    setResults([]); // Clear previous results

    // Ensure files is an array (can be empty for audio-only mode)
    const fileList = Array.isArray(files) ? files : (files ? [files] : []);

    // Calculate total: if we have files, count them; if audio-only, count as 1
    const totalItems = fileList.length > 0 ? fileList.length : (audioFile ? 1 : 0);
    setProgress({ current: 0, total: totalItems });

    // Default to first model name if not specified
    const selectedModel = modelName || (models.length > 0 ? models[0].name : "Model V1");

    const newResults = [];

    try {
      // Audio-only mode (Model V3 ASR)
      if (fileList.length === 0 && audioFile) {
        const formData = new FormData();
        formData.append("model_name", selectedModel);
        formData.append("audio_file", audioFile);

        try {
          const data = await apiClient.post("/predict", formData);
          await new Promise(resolve => setTimeout(resolve, 500));

          let normalizedResult = normalizeResult(data);
          newResults.push(normalizedResult);
        } catch (fileErr) {
          console.error(`Error processing audio file ${audioFile.name}:`, fileErr);
          newResults.push({
            error: true,
            filename: audioFile.name,
            message: fileErr.response?.data?.detail || "Failed to analyze audio file."
          });
        }
        setProgress(prev => ({ ...prev, current: 1 }));
      } else {
        // Process CHA files (with optional audio for Model V3)
        for (const file of fileList) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("model_name", selectedModel);

          // Attach audio file if provided (for CHA + Audio mode in Model V3)
          if (audioFile) {
            formData.append("audio_file", audioFile);
          }

          try {
            const data = await apiClient.post("/predict", formData);
            await new Promise(resolve => setTimeout(resolve, 500));

            let normalizedResult = normalizeResult(data);
            newResults.push(normalizedResult);
          } catch (fileErr) {
            console.error(`Error processing file ${file.name}:`, fileErr);
            newResults.push({
              error: true,
              filename: file.name,
              message: fileErr.response?.data?.detail || "Failed to analyze file."
            });
          }

          // Update progress after each file
          setProgress(prev => ({ ...prev, current: prev.current + 1 }));
        }
      }

      setResults(newResults);
      return newResults;
    } catch (err) {
      console.error(err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [models]);

  // Helper function to normalize API responses across all model versions
  const normalizeResult = (data) => {
    let normalizedResult = { ...data };

    // Handle Model V3 response format with predicted_label
    if (normalizedResult.predicted_label && !normalizedResult.prediction) {
      normalizedResult.prediction = normalizedResult.predicted_label === 'AD' ? 'Dementia' : 'Healthy Control';
    }

    // Normalize is_dementia flag
    if (!normalizedResult.hasOwnProperty('is_dementia')) {
      if (normalizedResult.predicted_label) {
        normalizedResult.is_dementia = normalizedResult.predicted_label === 'AD';
      } else if (normalizedResult.prediction) {
        const predString = normalizedResult.prediction.toLowerCase();
        normalizedResult.is_dementia = predString.includes('dementia') || predString === 'ad';
      }
    }

    // Normalize confidence score
    if (!normalizedResult.hasOwnProperty('confidence')) {
      // Map probability_dementia to confidence (Model V2)
      if (normalizedResult.probability_dementia !== undefined) {
        const p = normalizedResult.probability_dementia;
        normalizedResult.confidence = normalizedResult.is_dementia ? p : (1 - p);
      }
    }

    // Map model_version to model_used for display
    if (normalizedResult.model_version && !normalizedResult.model_used) {
      normalizedResult.model_used = normalizedResult.model_version === 'v3_multimodal'
        ? 'Model V3 (Multimodal)'
        : normalizedResult.model_version;
    }

    // Extract V3 visualizations to top-level for easier component access
    if (normalizedResult.visualizations) {
      const viz = normalizedResult.visualizations;
      // Extract linguistic features (V3 nests these under visualizations)
      if (viz.linguistic_features && !normalizedResult.linguistic_features) {
        normalizedResult.linguistic_features = viz.linguistic_features;
      }
      // Extract key segments (V3 nests these under visualizations)
      if (viz.key_segments && !normalizedResult.key_segments) {
        normalizedResult.key_segments = viz.key_segments;
      }
      // Extract new V3-specific visualization data
      if (viz.modality_contributions) {
        normalizedResult.modality_contributions = viz.modality_contributions;
      }
      if (viz.spectrogram_base64) {
        normalizedResult.spectrogram_base64 = viz.spectrogram_base64;
      }
      if (viz.probabilities) {
        normalizedResult.probabilities = viz.probabilities;
      }
    }

    return normalizedResult;
  };

  const resetPrediction = () => {
    setResults([]);
    setError(null);
    setProgress({ current: 0, total: 0 });
  };

  return (
    <PredictionContext.Provider
      value={{
        results,
        loading,
        error,
        progress,
        models,
        predictDementia,
        resetPrediction
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => useContext(PredictionContext);
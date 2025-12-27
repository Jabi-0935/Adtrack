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
        // Expecting { models: ["hybrid_deberta", "model_v2"] }
        if (response.models) {
          setModels(response.models);
        }
      } catch (err) {
        console.error("Failed to fetch models:", err);
      }
    };
    fetchModels();
  }, []);

  const predictDementia = useCallback(async (files, modelName) => {
    setLoading(true);
    setError(null);
    setResults([]); // Clear previous results

    // Ensure files is an array
    const fileList = Array.isArray(files) ? files : [files];
    setProgress({ current: 0, total: fileList.length });

    // Default to first model if not specified, or 'hybrid_deberta' as fallback
    const selectedModel = modelName || (models.length > 0 ? models[0] : "hybrid_deberta");

    const newResults = [];

    try {
      for (const file of fileList) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("model_name", selectedModel);

        try {
          // New generic point
          const data = await apiClient.post("/predict", formData);

          // Artificial delay for UX
          await new Promise(resolve => setTimeout(resolve, 500));

          // Normalize Result Data
          // model_v2 returns: { prediction: "Dementia", probability_dementia: 0.78, ... }
          // hybrid_deberta returns: { prediction: "DEMENTIA", is_dementia: true, confidence: 0.85 ... }

          let normalizedResult = { ...data };

          if (!normalizedResult.hasOwnProperty('is_dementia')) {
            if (normalizedResult.prediction) {
              const predString = normalizedResult.prediction.toLowerCase();
              normalizedResult.is_dementia = predString.includes('dementia');
            }
          }

          if (!normalizedResult.hasOwnProperty('confidence')) {
            // Map probability_dementia to confidence
            if (normalizedResult.probability_dementia !== undefined) {
              // If dementia, confidence is prob_dementia. If healthy, confidence is 1 - prob_dementia? 
              // Or just use the probability of the predicted class?
              // Usually confidence implies "confidence in the prediction".
              // If prob_dementia = 0.9 -> Prediction=Dementia, Confidence=0.9
              // If prob_dementia = 0.1 -> Prediction=Control, Confidence=0.9 (1-0.1)

              const p = normalizedResult.probability_dementia;
              normalizedResult.confidence = normalizedResult.is_dementia ? p : (1 - p);
            }
          }

          newResults.push(normalizedResult);
        } catch (fileErr) {
          console.error(`Error processing file ${file.name}:`, fileErr);
          newResults.push({
            error: true,
            filename: file.name,
            message: "Failed to analyze file."
          });
        }

        // Update progress after each file
        setProgress(prev => ({ ...prev, current: prev.current + 1 }));
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
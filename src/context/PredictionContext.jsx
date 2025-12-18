import { createContext, useContext, useState, useCallback } from "react";
import apiClient from "../api/Client";

const PredictionContext = createContext();

export const PredictionProvider = ({ children }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predictDementia = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await apiClient.post("/predict", formData);
      setResult(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPrediction = () => {
    setResult(null);
    setError(null);
  };

  return (
    <PredictionContext.Provider
      value={{ result, loading, error, predictDementia, resetPrediction }}
    >
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => useContext(PredictionContext);
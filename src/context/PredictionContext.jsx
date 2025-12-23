import { createContext, useContext, useState, useCallback } from "react";
import apiClient from "../api/Client";

const PredictionContext = createContext();

export const PredictionProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const predictDementia = useCallback(async (files) => {
    setLoading(true);
    setError(null);
    setResults([]); // Clear previous results

    // Ensure files is an array
    const fileList = Array.isArray(files) ? files : [files];
    setProgress({ current: 0, total: fileList.length });

    const newResults = [];

    try {
      for (const file of fileList) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          // Hitting the specific endpoint
          const data = await apiClient.post("/predict/cha", formData);

          // Start artificial delay concurrently with next request processing if desired, 
          // but for now keeping it sequential to match original feel or prevent race conditions if strict ordering needed.
          // Adjusting logic: The original had an artificial delay. 
          // We'll keep a small delay per file for UX "processing" feel, or just one at the end?
          // Let's keep it simple: processed one by one.

          await new Promise(resolve => setTimeout(resolve, 500)); // slightly reduced delay per file

          // Attach filename to result if not already present, though backend likely returns it
          // data.filename should be there from previous analysis.

          newResults.push(data);
          // Set results incrementally if we want dynamic updates, but setting at end is safer for now
        } catch (fileErr) {
          console.error(`Error processing file ${file.name}:`, fileErr);
          // Optionally push an error object to results so we know this file failed
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
  }, []);

  const resetPrediction = () => {
    setResults([]);
    setError(null);
    setProgress({ current: 0, total: 0 });
  };

  return (
    <PredictionContext.Provider
      value={{ results, loading, error, progress, predictDementia, resetPrediction }}
    >
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => useContext(PredictionContext);
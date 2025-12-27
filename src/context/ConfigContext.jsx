import { createContext, useContext, useState, useEffect } from "react";

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
    // Load from local storage or default true
    const [config, setConfig] = useState(() => {
        try {
            const saved = localStorage.getItem("adtrack_config");
            return saved ? JSON.parse(saved) : {
                featureMultipleFiles: true,
                featureModelSelection: true,
                featureShowConfidence: true,
                featureShowAccuracy: true,
                accuracyValue: "81.1%"
            };
        } catch {
            return {
                featureMultipleFiles: true,
                featureModelSelection: true,
                featureShowConfidence: true,
                featureShowAccuracy: true,
                accuracyValue: "81.1%"
            };
        }
    });

    useEffect(() => {
        localStorage.setItem("adtrack_config", JSON.stringify(config));
    }, [config]);

    const toggleFeature = (key) => {
        setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const updateConfig = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    return (
        <ConfigContext.Provider value={{ config, toggleFeature, updateConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => useContext(ConfigContext);

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, ArrowLeft, Lock, Unlock } from "lucide-react";
import { Link } from "react-router-dom";
import { useConfig } from "../context/ConfigContext";

export default function Admin() {
    const { config, toggleFeature, updateConfig } = useConfig();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple basic auth check - in production this should be robust
        if (password === "admin123") {
            setIsAuthenticated(true);
            setError("");
        } else {
            setError("Invalid password");
        }
    };

    const settings = [
        {
            key: "featureMultipleFiles",
            label: "Multiple File Upload",
            description: "Allow users to upload and process multiple .cha files at once."
        },
        {
            key: "featureModelSelection",
            label: "Model Selection",
            description: "Enable the dropdown to choose between Standard and Advanced models."
        },
        {
            key: "featureShowConfidence",
            label: "Confidence Scores",
            description: "Display the % confidence level in reports and lists."
        },
        {
            key: "featureShowAccuracy",
            label: "Show Accuracy Stats",
            description: "Display the validation accuracy badge on the home page."
        }
    ];

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md"
                >
                    <div className="flex flex-col items-center mb-6">
                        <div className="p-3 bg-slate-100 rounded-full text-slate-500 mb-4">
                            <Lock size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">Admin Access</h1>
                        <p className="text-slate-500 text-sm">Enter password to configure settings</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
                        <button
                            type="submit"
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                        >
                            Unlock Settings
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <Link to="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Return to Home</Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-4 text-sm font-medium">
                        <ArrowLeft size={16} /> Back to Application
                    </Link>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-700">
                                <Settings size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Admin Controls</h1>
                                <p className="text-slate-500">Manage application feature flags and visibility.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="text-slate-400 hover:text-slate-600"
                            title="Lock"
                        >
                            <Unlock size={20} />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {settings.map((setting) => (
                        <motion.div
                            key={setting.key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-colors hover:border-indigo-200"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h3 className="font-bold text-slate-900">{setting.label}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{setting.description}</p>
                                </div>

                                <button
                                    onClick={() => toggleFeature(setting.key)}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${config[setting.key] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition shadow-sm ${config[setting.key] ? 'translate-x-7' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>

                            {/* Special Input for Accuracy Value */}
                            {setting.key === 'featureShowAccuracy' && config.featureShowAccuracy && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-4 pt-4 border-t border-slate-100"
                                >
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Accuracy Display Value</label>
                                    <input
                                        type="text"
                                        value={config.accuracyValue || ""}
                                        onChange={(e) => updateConfig('accuracyValue', e.target.value)}
                                        placeholder="e.g. 81.1%"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                    <p className="text-xs text-slate-400 mt-2">Enter the value to be displayed on the validation badge.</p>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

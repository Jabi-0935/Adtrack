import { Link } from "react-router-dom";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-8">

            {/* Visual Icon */}
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
                    <FileQuestion size={64} className="text-indigo-600" />
                </div>
            </div>

            {/* Text Content */}
            <div className="space-y-3 max-w-md">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    Page Not Found
                </h1>
                <p className="text-slate-500 font-medium">
                    The clinical record or page you are looking for does not exist or has been moved.
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-4">
                <Link
                    to="/"
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all shadow-md shadow-indigo-200"
                >
                    <Home size={18} />
                    Back to Dashboard
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold rounded-lg transition-all"
                >
                    <ArrowLeft size={18} />
                    Go Back
                </button>
            </div>

            <div className="text-xs text-slate-400 font-mono pt-8">
                Error Code: 404_RESOURCE_MISSING
            </div>
        </div>
    );
}

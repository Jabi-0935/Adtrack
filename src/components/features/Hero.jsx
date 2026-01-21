import FileUpload from "./FileUpload";
import { BrainCircuit, Activity, Stethoscope, FileText } from "lucide-react";
import { useConfig } from "../../context/ConfigContext";

export default function Hero() {
  const { config } = useConfig();
  return (
    <div className="relative flex flex-col items-center justify-center  py-4 md:py-12 px-4 sm:px-6 z-0">

      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Text Content */}
        <div className="text-center lg:text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-indigo-700 text-sm font-bold">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
            </span>
            RESEARCH GRADE PROTOCOL v3.0 (Multimodal)
          </div>

          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
            Detect Cognitive <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Decline Early.
            </span>
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
            Advanced AI screening tool analyzing <span className="text-slate-900 font-semibold underline decoration-indigo-200 decoration-2">linguistic & acoustic biomarkers</span> from speech to identify signs of dementia with high precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
            <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-sm border border-slate-100 flex-1 w-full max-w-xs">
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><BrainCircuit size={24} /></div>
              <div className="text-left">
                <p className="font-bold text-slate-900">Multimodal</p>
                <p className="text-xs text-slate-500">Text + Audio + Features</p>
              </div>
            </div>
            {config.featureShowAccuracy && (
              <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-sm border border-slate-100 flex-1 w-full max-w-xs">
                <div className="p-3 bg-teal-50 rounded-lg text-teal-600"><Activity size={24} /></div>
                <div className="text-left">
                  <p className="font-bold text-slate-900">{config.accuracyValue || "87.0%"}</p>
                  <p className="text-xs text-slate-500">Real-World Accuracy</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Section - Made Prominent */}
        <div className="w-full relative z-10 lg:pl-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200/50 to-blue-200/50 rounded-[3rem] blur-3xl opacity-60 -z-10 translate-y-4"></div>
          <FileUpload />

          {/* Trust Badges */}
          <div className="mt-8 flex justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for hypothetical partner logos if needed, currently just text/icon implies trust */}
            <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
              <Stethoscope size={16} /> Clinical Research Standard
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
              <FileText size={16} /> Standard .CHA Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
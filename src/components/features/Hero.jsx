import FileUpload from "./FileUpload";
import { BrainCircuit, Activity, Stethoscope } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8 md:py-12 px-4 sm:px-6 z-0 bg-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-40"
        style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Text Content */}
        <div className="text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs md:text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Clinical Research Tool h1.0
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Early Dementia Detection via <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Linguistic Analysis
            </span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
            A non-invasive, AI-powered screening tool utilizing the <span className="font-semibold text-slate-800">DeBERTa architecture</span> to identify subtle speech patterns associated with cognitive decline.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-8 text-slate-500 text-xs md:text-sm font-medium pt-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-md text-blue-600"><BrainCircuit size={18} /></div>
              <span>Deep Learning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 rounded-md text-indigo-600"><Activity size={18} /></div>
              <span>Biomarkers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-100 rounded-md text-teal-600"><Stethoscope size={18} /></div>
              <span>Clinician Aid</span>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="w-full relative z-10">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[2.5rem] blur-xl opacity-50 -z-10"></div>
          <FileUpload />
        </div>
      </div>
    </div>
  );
}
import FileUpload from "./FileUpload";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Early Detection via <br />
          <span className="text-blue-600">Linguistic Analysis</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload standard clinical transcripts (.cha) to detect early linguistic markers associated with dementia using our advanced NLP pipeline.
        </p>
      </div>
      
      <FileUpload />
    </div>
  );
}
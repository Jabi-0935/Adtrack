import { ExternalLink, FileText, BookOpen, GraduationCap } from "lucide-react";

export default function Resources() {
    const resources = [
        {
            category: "Data Standards",
            items: [
                {
                    title: "DementiaBank (TalkBank)",
                    desc: "The primary repository for the Pitt Corpus and .CHA transcript standards.",
                    link: "https://dementia.talkbank.org/",
                    icon: DatabaseIcon
                },
                {
                    title: "CHAT Transcription Format",
                    desc: "Official manual for the Codes for the Human Analysis of Transcripts (CHAT).",
                    link: "https://talkbank.org/manuals/CHAT.html",
                    icon: FileText
                }
            ]
        },
        {
            category: "Clinical Research",
            items: [
                {
                    title: "Still Upadating.....",
                    desc: "",
                    link: "",
                    icon: ActivityIcon
                },
            ]
        }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8  space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">External Resources</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Standards, datasets, and clinical protocols referenced in the development of the ADTrack pipeline.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {resources.map((section) => (
                    <div key={section.category} className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">
                            {section.category}
                        </h2>
                        <div className="grid gap-4">
                            {section.items.map((item) => (
                                <a
                                    key={item.title}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                {item.title}
                                                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <BookOpen size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Protocol FAQ</h2>
                </div>

                <div className="grid gap-6">
                    <details className="group bg-white border border-slate-200 rounded-lg open:shadow-sm transition-all">
                        <summary className="flex items-center justify-between p-4 font-semibold text-slate-800 cursor-pointer list-none select-none">
                            Why .CHA format?
                            <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                            The CHAT (.CHA) format is the global standard for linguistic analysis in dementia (DementiaBank). It allows our parser to extract specific discourse features like "filled pauses" (&-um) and "repetitions" [//] which are critical biomarkers for identifying cognitive decline.
                        </div>
                    </details>

                    <details className="group bg-white border border-slate-200 rounded-lg open:shadow-sm transition-all">
                        <summary className="flex items-center justify-between p-4 font-semibold text-slate-800 cursor-pointer list-none select-none">
                            How is TTR calculated?
                            <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                            Type-Token Ratio (TTR) is calculated as (Unique Words / Total Words). We use a "Two-Pass" approach where we calculate TTR globally for the entire session first, and then inject that value into every single sentence embedding to give the model context of the patient's overall vocabulary richness.
                        </div>
                    </details>
                </div>
            </div>

        </div>
    );
}

// Simple internal icon components to avoid import errors if Lucide doesn't have them active
function DatabaseIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s 9-1.34 9-3V5" /></svg>
    )
}

function ActivityIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
    )
}

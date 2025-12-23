import { BrainCircuit } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-sm shadow-blue-200">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              AD<span className="text-blue-600">Track</span>
            </span>
          </div>

          <div className="hidden md:block">
            <ul className="flex items-center space-x-8 text-sm font-medium text-slate-600">
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Start Assessment</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">About Model</li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;

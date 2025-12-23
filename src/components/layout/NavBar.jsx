import { useState } from "react";
import { BrainCircuit, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "text-indigo-600 bg-slate-50" : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50";
  };

  const mobileIsActive = (path) => {
    return location.pathname === path ? "text-indigo-600 bg-slate-50" : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50";
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
                <BrainCircuit className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">
                AD<span className="text-indigo-600">Track</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex items-center space-x-2 text-sm font-bold">
              <li>
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${isActive("/")}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${isActive("/about")}`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${isActive("/resources")}`}
                >
                  Resources
                </Link>
              </li>
              <li>
                <div className="h-5 w-px bg-slate-200 mx-2"></div>
              </li>
              <li>
                <a href="mailto:contact@adtrack-research.org" className="px-4 py-2 text-slate-400 hover:text-indigo-600 transition-colors font-medium">
                  Help
                </a>
              </li>
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white absolute w-full left-0 shadow-xl z-50">
          <ul className="px-4 py-4 space-y-2 text-sm font-semibold">
            <li>
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${mobileIsActive("/")}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${mobileIsActive("/about")}`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/resources"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${mobileIsActive("/resources")}`}
              >
                Resources
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};
export default NavBar;

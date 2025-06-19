import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-8 mt-16 border-t-2 border-emerald-500/30 relative overflow-hidden">
      {/* Background accent pattern */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-60"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Copyright Section */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              {/* Small chart icon */}
              <div className="flex items-end p-1.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-md shadow-sm">
                <div className="flex items-end gap-0.5 h-3">
                  <div className="w-0.5 h-1.5 bg-white rounded-sm"></div>
                  <div className="w-0.5 h-3 bg-white rounded-sm"></div>
                  <div className="w-0.5 h-2 bg-white rounded-sm"></div>
                  <div className="w-0.5 h-3 bg-white rounded-sm"></div>
                </div>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Trading Journal
              </span>
            </div>
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Trading Journal. All rights reserved.
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex space-x-6">
              <a 
                href="#" 
                className="text-sm text-slate-300 hover:text-emerald-400 transition-all duration-300 relative group font-medium"
              >
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#" 
                className="text-sm text-slate-300 hover:text-emerald-400 transition-all duration-300 relative group font-medium"
              >
                Terms of Service
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#" 
                className="text-sm text-slate-300 hover:text-emerald-400 transition-all duration-300 relative group font-medium"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            {/* Social/Additional Info */}
            <div className="flex items-center gap-4 text-slate-400">
              <div className="w-px h-4 bg-slate-600 hidden md:block"></div>
              <span className="text-xs">
                Built for Traders
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with subtle trading info */}
        <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-slate-500">
            Track • Analyze • Improve Your Trading Performance
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Powered by</span>
            <span className="text-emerald-400 font-medium">Advanced Analytics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
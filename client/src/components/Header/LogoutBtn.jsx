import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import conf from "../../conf/conf";
import { useNavigate } from "react-router-dom";

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${conf.VITE_BACKEND_URL}`,
        {},
        { withCredentials: true }
      );

      if (response?.data.success) {
        dispatch(clearUser());
        navigate("/login");
      }
    } catch (error) {
      console.log("Logout failed:", error.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="group relative px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md border border-red-400/20 overflow-hidden"
    >
      {/* Background animation overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Icon and text */}
      <div className="relative flex items-center gap-2">
        {/* Logout icon (power symbol) */}
        <svg 
          className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
          />
        </svg>
        <span className="text-sm tracking-wide">Logout</span>
      </div>
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </button>
  );
};

export default LogoutBtn;
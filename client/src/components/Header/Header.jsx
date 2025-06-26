import React from "react";
import {  Link } from "react-router-dom";
import { Container, LogoutBtn } from "../index";
import { useSelector } from "react-redux";

const Header = () => {
  const user = useSelector((state) => state.user.userData);

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: !user,
    },
    {
      name: "Dashboard",
      slug: "/dashboard",
      active: !!user
    },
    {
      name: "All Accounts",
      slug: "/all-accounts",
      active: !!user,
    },
    {
      name: "Add account",
      slug: "/add-account",
      active: !!user,
    },
  ];

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b-2 border-emerald-500 shadow-xl sticky top-0 z-50 backdrop-blur-sm">
      <Container>
        <div className="flex items-center justify-between py-4 min-h-[70px]">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-white font-bold text-xl hover:text-emerald-400 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-end p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg shadow-emerald-500/30">
              <div className="flex items-end gap-0.5 h-5">
                <div className="w-1 h-2 bg-white rounded-sm animate-pulse"></div>
                <div className="w-1 h-4 bg-white rounded-sm animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-3 bg-white rounded-sm animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <div className="w-1 h-5 bg-white rounded-sm animate-pulse" style={{animationDelay: '0.6s'}}></div>
              </div>
            </div>
            <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent font-extrabold tracking-tight">
              Trading Journal
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {navItems.map(
              (item) =>
                item.active && (
                  <Link 
                    key={item.slug} 
                    to={item.slug}
                    className="text-slate-300 hover:text-white px-4 py-2 rounded-md hover:bg-emerald-500/10 transition-all duration-300 font-medium relative group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2"></span>
                  </Link>
                )
            )}

            {/* Auth Section */}
            <div className="flex items-center gap-3 ml-6 pl-6 border-l border-slate-600">
              {!user ? (
                <>
                  <Link 
                    to="/login" 
                    className="text-emerald-400 hover:text-white px-4 py-2 border border-emerald-500 rounded-md hover:bg-emerald-500 transition-all duration-300 font-medium"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-white px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-md hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <LogoutBtn />
              )}
            </div>
          </nav>
        </div>
      </Container>
      
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-60"></div>
    </header>
  );
};

export default Header;
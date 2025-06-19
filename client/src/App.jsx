import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Header } from "./components/index";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-400">
      <div className="w-full block">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;

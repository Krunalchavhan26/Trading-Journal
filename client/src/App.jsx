import { Header, Footer } from "./components/index";
import { Outlet } from "react-router-dom";

// ✅ Toastify import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-400">
      <div className="w-full block">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />

        {/* ✅ Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          pauseOnHover
          theme="dark"
        />
      </div>
    </div>
  );
}

export default App;

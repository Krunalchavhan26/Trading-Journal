import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { setUser } from "../../store/slices/userSlice" 

const AuthLayout = ({ children, authentication = true }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authentication && !user) {
          const res = await axiosInstance.get("/api/v1/users/current-user")

          if (res.data?.data) {
            dispatch(setUser(res.data.data));
          } else {
            navigate("/login");
          }
        } else if (!authentication && user) {
          navigate("/dashboard");
        }

        setLoader(false);
      } catch (error) {
        console.error("Auth check failed", error);
        navigate("/login");
        setLoader(false);
      }
    };

    checkAuth();
  }, [authentication, user, dispatch, navigate]);

  if (loader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          {/* Spinning loader */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-600 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-l-emerald-400 rounded-full animate-pulse"></div>
          </div>
          
          {/* Loading text */}
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-4">
            Trading Journal
          </h1>
          <p className="text-slate-400 text-lg">Loading your experience...</p>
          
          {/* Animated dots */}
          <div className="flex justify-center mt-6 space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthLayout;
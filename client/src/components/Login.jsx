import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import axios from "axios";
import conf from "../conf/conf";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${conf.VITE_BACKEND_URL}/api/v1/users/login`,
        data,
        { withCredentials: true }
      );

      if (response?.data?.success) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message)
        navigate("/");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || "Something went wrong";
            toast.error(errorMessage)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 hover:shadow-emerald-500/10 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-400">Sign in to your trading journal</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Email or Username
              </label>
              <input
                type="text"
                {...register("identifier", {
                  required: "Email or Username is required",
                })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                placeholder="Enter your email or username"
              />
              {errors.identifier && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 flex items-center">
            <div className="flex-1 border-t border-slate-600"></div>
            <span className="px-4 text-sm text-slate-400">Don't have an account?</span>
            <div className="flex-1 border-t border-slate-600"></div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-300"
            >
              Register here
            </Link>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center gap-6 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Instant Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
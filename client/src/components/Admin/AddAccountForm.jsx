import React from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addAccount } from "../../store/slices/accountSlice";

const AddAccountForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/accounts/add-account",
        data
      );

      if (response?.data?.success) {
        dispatch(addAccount(response.data.account));
        toast.success(response.data.message);
        reset();
      }
    } catch (error) {
      console.error("Error adding account:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 hover:shadow-emerald-500/10 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-2">
            Add New Account
          </h2>
          <p className="text-slate-400">Create a new trading account</p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Account Name */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Account Name
            </label>
            <input
              {...register("name", { required: "Account name is required" })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              placeholder="Enter account name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-2">{errors.name.message}</p>
            )}
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Account Type
            </label>
            <select
              {...register("type", { required: "Account type is required" })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
            >
              <option value="" className="bg-slate-700">Select type</option>
              <option value="Evaluation" className="bg-slate-700">Evaluation</option>
              <option value="Funded" className="bg-slate-700">Funded</option>
              <option value="Personal" className="bg-slate-700">Personal</option>
            </select>
            {errors.type && (
              <p className="text-red-400 text-sm mt-2">{errors.type.message}</p>
            )}
          </div>

          {/* Starting Balance */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Starting Balance
            </label>
            <input
              type="number"
              step="0.01"
              {...register("startingBalance", {
                required: "Starting balance is required",
              })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              placeholder="0.00"
            />
            {errors.startingBalance && (
              <p className="text-red-400 text-sm mt-2">{errors.startingBalance.message}</p>
            )}
          </div>

          {/* Trading Goal */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Trading Goal
            </label>
            <input
              type="number"
              step="0.01"
              {...register("goal", {
                required: "Goal is required",
                min: { value: 100, message: "Goal should be at least 100"},
              })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              placeholder="100.00"
            />
            {errors.goal && (
              <p className="text-red-400 text-sm mt-2">{errors.goal.message}</p>
            )}
          </div>

          {/* Commission */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Commission per Lot
            </label>
            <input
              type="number"
              step="0.01"
              {...register("commission", {required: "Commission is required"})}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              placeholder="0.00"
            />
            {errors.commission && (
              <p className="text-red-400 text-sm mt-2">{errors.commission.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            Add Account
          </button>
        </form>

        {/* Bottom decorative elements */}
        <div className="flex justify-center mt-6 space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default AddAccountForm;
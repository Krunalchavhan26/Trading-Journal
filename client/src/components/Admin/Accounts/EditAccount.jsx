import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance";
import {
  setSelectedAccount,
  updateAccount,
} from "../../../store/slices/accountSlice";

const EditAccount = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const account = useSelector((state) => state.account.selectedAccount);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      type: "",
      startingBalance: "",
      goal: "",
      accountStatus: "",
      commission: "",
    },
  });

  const watchedAccountStatus = watch("accountStatus");

  // Fetch account data and populate form
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/accounts/get-single-account/${accountId}`
        );
        const accountData = response.data.data;

        dispatch(setSelectedAccount(accountData));

        // Populate form with account data
        Object.entries(accountData).forEach(([key, value]) => {
          if (
            key in
            {
              name: 1,
              type: 1,
              startingBalance: 1,
              goal: 1,
              accountStatus: 1,
              commission: 1,
            }
          ) {
            setValue(key, value || "");
          }
        });
      } catch (error) {
        console.error("Error fetching account:", error);
        toast.error("Failed to fetch account details");
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchAccount();
    }
  }, [accountId, dispatch, setValue]);

  // Handle form submission
  const onSubmit = async (formData) => {
    setSaving(true);

    const { name, type, goal, accountStatus, startingBalance, commission } =
      formData;
    const payload = { name, type, goal, accountStatus, commission };
    if (account.totalTrades === 0) {
      payload.startingBalance = startingBalance;
    }

    try {
      const response = await axiosInstance.patch(
        `/api/v1/accounts/edit-account/${accountId}`,
        payload
      );

      if (response?.data?.success) {
        dispatch(updateAccount(response.data.data));
        toast.success("Account updated successfully");
        navigate("/all-accounts");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error(error?.response?.data?.message || "Failed to update account");
    } finally {
      setSaving(false);
    }
  };

  // Status color helper
  const getStatusColor = (status) => {
    const colors = {
      active: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      "not started": "text-slate-400 bg-slate-400/10 border-slate-400/20",
      completed: "text-green-400 bg-green-400/10 border-green-400/20",
      paused: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    };
    return (
      colors[status?.toLowerCase()] ||
      "text-slate-400 bg-slate-400/10 border-slate-400/20"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-400 text-lg">Loading account...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/all-accounts")}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors duration-300 border border-slate-700/50 hover:border-emerald-500/30"
            >
              <svg
                className="w-5 h-5 text-slate-400 hover:text-emerald-400 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              Edit Account
            </h2>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-transparent rounded-full ml-14"></div>
        </div>

        {/* Account Info Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Account Details</h3>
              <p className="text-slate-400 text-sm">
                Update your account information
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Account ID:</span>
              <span className="text-white font-mono">{account?._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Balance:</span>
              <span className="text-emerald-400 font-semibold">
                ${account?.currentBalance?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Trades:</span>
              <span className="text-white">{account?.totalTrades || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Created:</span>
              <span className="text-white">
                {account?.createdAt
                  ? new Date(account.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Account Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  placeholder="Enter account name"
                />
              </div>

              {/* Account Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Account Type
                </label>
                <select
                  {...register("type")}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                >
                  <option value="">Select account type</option>
                  <option value="Evaluation">Evaluation</option>
                  <option value="Funded">Funded</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              {/* Starting Balance */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Starting Balance
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    {...register("startingBalance")}
                    disabled={account?.totalTrades > 0}
                    className="w-full pl-8 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="0.00"
                  />
                </div>
                {account?.totalTrades > 0 && (
                  <p className="text-xs text-amber-400 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.742-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Cannot modify starting balance after trades have been placed
                  </p>
                )}
              </div>

              {/* Goal */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Goal
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    {...register("goal")}
                    className="w-full pl-8 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Account Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Account Status
                </label>
                <select
                  {...register("accountStatus")}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                >
                  <option value="">Select status</option>
                  <option value="Not Started">Not Started</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Paused">Paused</option>
                </select>
                {watchedAccountStatus && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-slate-400">Preview:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                        watchedAccountStatus
                      )}`}
                    >
                      {watchedAccountStatus}
                    </span>
                  </div>
                )}
              </div>

              {/* Commission */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Commission
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    {...register("commission")}
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate("/accounts")}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Update Account
                </>
              )}
            </button>
          </div>
        </form>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-500/3 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default EditAccount;

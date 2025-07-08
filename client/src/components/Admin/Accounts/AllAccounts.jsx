import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { setAccounts } from "../../../store/slices/accountSlice";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";


const AllAccounts = () => {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.account.accounts);
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/v1/accounts/getAllAccounts"
        );
        dispatch(setAccounts(response.data.data));
      } catch (error) {
        console.error("Error fetching accounts", error);
      }
    };

    fetchAccounts();
  }, [dispatch]);

  const handleDeleteClick = (e, account) => {
    e.stopPropagation(); // Prevent card click navigation
    setAccountToDelete(account);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (accountToDelete) {
      handleDelete(accountToDelete._id);
      setShowDeleteDialog(false);
      setAccountToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setAccountToDelete(null);
  };

  const handleDelete = async (accountId) => {
    try {
      const response = await axiosInstance.delete(`/api/v1/accounts/delete-account/${accountId}`)
      if(response?.data?.success){
        toast.success(response.data.message);
        dispatch(setAccounts(accounts.filter(acc => acc._id !== accountId)))
      }
    } catch (error) {
      console.error("Delete failed: ", error);
      toast.error(error?.response?.data?.message)
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "paused":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "closed":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const getAccountTypeIcon = (type) => {
    if (type.toLowerCase().includes("challenge")) {
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      );
    } else if (type.toLowerCase().includes("funded")) {
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
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
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              All Accounts
            </h2>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-emerald-500 to-transparent rounded-full ml-14"></div>
        </div>

        {/* Accounts Grid */}
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 mb-6">
              <svg
                className="w-16 h-16 text-slate-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <p className="text-2xl font-semibold text-slate-400 mb-2">
              No accounts found
            </p>
            <p className="text-slate-500">
              Create your first trading account to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div
                key={account._id}
                onClick={() => navigate(`/accounts/${account._id}/orderbooks`)}
                className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer"
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Card content */}
                <div className="relative z-10">
                  {/* Header with icon, status, and DELETE BUTTON */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors duration-300 text-emerald-500">
                        {getAccountTypeIcon(account.type)}
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          account.accountStatus
                        )}`}
                      >
                        {account.accountStatus}
                      </div>
                    </div>
                    
                    {/* DELETE BUTTON - This was missing! */}
                    <button
                      onClick={(e) => handleDeleteClick(e, account)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all duration-300 border border-red-500/20 hover:border-red-500/40 opacity-0 group-hover:opacity-100 hover:scale-110"
                      title="Delete Account"
                    >
                      <svg
                        className="w-4 h-4 text-red-400 hover:text-red-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Account Type */}
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors duration-300">
                    {account.type}
                  </h3>

                  {/* Account Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm font-medium">
                        Goal
                      </span>
                      <span className="text-white font-semibold">
                        {account.goal}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm font-medium">
                        Balance
                      </span>
                      <span className="text-emerald-400 font-bold text-lg">
                        ${account.currentBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              (account.currentBalance /
                                parseInt(String(account.goal).replace(/[$,]/g, ""))) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {Math.round(
                          (account.currentBalance /
                            parseInt(String(account.goal).replace(/[$,]/g, ""))) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <svg
                      className="w-5 h-5 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <svg
                    className="w-6 h-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Delete Account
                  </h3>
                  <p className="text-slate-400 text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-slate-300 mb-2">
                  Are you sure you want to delete this account?
                </p>
                <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                  <p className="text-white font-semibold">
                    {accountToDelete?.type}
                  </p>
                  <p className="text-emerald-400 text-sm">
                    Balance: $
                    {accountToDelete?.currentBalance?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors duration-300 border border-slate-600/50 hover:border-slate-500/50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-emerald-500/3 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default AllAccounts;
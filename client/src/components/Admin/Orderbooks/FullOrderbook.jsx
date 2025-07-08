import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Edit3,
  Save,
  X,
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  DollarSign,
  Target,
  AlertCircle,
  Image as ImageIcon,
  Calendar,
  Activity,
  FileText,
  Layers,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance";
import {
  updateOrderbook,
  setOrderbooks,
} from "../../../store/slices/orderbookSlice";

const FullOrderbook = () => {
  const { accountId, orderbookId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderbooks = useSelector((state) => state.orderbook.orderbooks);

  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);
  const [originalOrder, setOriginalOrder] = useState(null);

  // Find the specific orderbook
  const orderbook = orderbooks.find((order) => order._id === orderbookId);

  useEffect(() => {
    const fetchOrderbooksIfNeeded = async () => {
      if (!orderbook) {
        try {
          const response = await axiosInstance.get(
            `/api/v1/orderbooks/all-orderbooks/${accountId}`
          );
          if (response?.data?.success) {
            dispatch(setOrderbooks(response.data.data));
          }
        } catch (error) {
          console.error("Error fetching orderbooks:", error);
          toast.error("Failed to load orderbooks.");
        }
      } else {
        // Orderbook already found in Redux
        setOriginalOrder(orderbook);
        setEditedOrder({ ...orderbook });
      }
    };

    fetchOrderbooksIfNeeded();
  }, [orderbook, accountId, dispatch]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedOrder({ ...originalOrder });
  };

  const handleSave = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    // Here you'll add your backend call
    console.log("Saving order:", editedOrder);

    // For now, we'll just update the local state
    setOriginalOrder(editedOrder);
    setIsEditing(false);
    setShowConfirmDialog(false);

    // Prepare formdata
    const formData = new FormData();

    // Append all feilds from editedOrder
    for (const key in editedOrder) {
      if (key === "tradeImageFile" && editedOrder[key] instanceof File) {
        formData.append("tradeImage", editedOrder[key]);
      } else if (key !== "tradeImageFile") {
        formData.append(key, editedOrder[key]);
      }
    }

    console.log("FormData: ", formData);

    // TODO: Add your backend API call here
    try {
      const response = await axiosInstance.put(
        `/api/v1/orderbooks/edit-orderbook/${accountId}/${orderbookId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data?.success) {
        const updatedOrder = response.data.data;
        if (updatedOrder.tradeImage) {
          updatedOrder.tradeImage = `${
            updatedOrder.tradeImage
          }?t=${Date.now()}`;
        }
        dispatch(updateOrderbook(updatedOrder));
        setEditedOrder(updatedOrder);
        setOriginalOrder(updatedOrder);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "tradeImage" && value instanceof File) {
      setEditedOrder((prev) => ({
        ...prev,
        tradeImage: URL.createObjectURL(value), // temp URL for preview
        tradeImageFile: value, // File object for upload
      }));
    } else {
      setEditedOrder((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const getSessionColor = (session) => {
    switch (session?.toLowerCase()) {
      case "london":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "asia":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "new york":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getPnLColor = (pnl) => {
    const value = parseFloat(pnl);
    if (value > 0) return "text-emerald-400";
    if (value < 0) return "text-red-400";
    return "text-slate-400";
  };

  const getResultColor = (result) => {
    switch (result?.toLowerCase()) {
      case "profit":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "loss":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getTradeStatusColor = (tradeStatus) => {
    switch (tradeStatus?.toLowerCase()) {
      case "open":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "closed by take profit":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "closed by stop loss":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "closed manually":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  if (!orderbook || !editedOrder) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-400 text-lg">Orderbook not found</p>
          <button
            onClick={() => navigate(`/account/${accountId}/orderbooks`)}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Orderbooks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/accounts/${accountId}/orderbooks`)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {editedOrder.pair} Order Details
                </h1>
                <p className="text-slate-400">
                  {isEditing ? "Edit Mode" : "View Mode"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                Trade Screenshot
              </h3>

              {editedOrder.tradeImage ? (
                <div className="relative">
                  <img
                    src={editedOrder.tradeImage}
                    alt="Trade Screenshot"
                    className="w-full h-auto rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="hidden w-full h-48 bg-slate-700 rounded-lg items-center justify-center">
                    <div className="text-center text-slate-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      <p>Image not available</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 bg-slate-700 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                    <p>No image uploaded</p>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Image URL
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    // value={editedOrder.tradeImage || ""}
                    onChange={(e) =>
                      handleInputChange("tradeImageFile", e.target.files[0])
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Trade Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Currency Pair
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedOrder.pair || ""}
                      onChange={(e) =>
                        handleInputChange("pair", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-slate-700 rounded-lg text-white">
                      {editedOrder.pair}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Direction
                  </label>
                  {isEditing ? (
                    <select
                      value={editedOrder.direction || ""}
                      onChange={(e) =>
                        handleInputChange("direction", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Long">Long</option>
                      <option value="Short">Short</option>
                    </select>
                  ) : (
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        editedOrder.direction === "Long"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {editedOrder.direction === "Long" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {editedOrder.direction}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Session
                  </label>
                  {isEditing ? (
                    <select
                      value={editedOrder.session || ""}
                      onChange={(e) =>
                        handleInputChange("session", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="London">London</option>
                      <option value="Asia">Asia</option>
                      <option value="New York">New York</option>
                    </select>
                  ) : (
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getSessionColor(
                        editedOrder.session
                      )}`}
                    >
                      <MapPin className="w-4 h-4" />
                      {editedOrder.session}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Trade Status
                  </label>
                  {isEditing ? (
                    <select
                      value={editedOrder.tradeStatus || ""}
                      onChange={(e) =>
                        handleInputChange("tradeStatus", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Open">Open</option>
                      <option value="Closed by Take Profit">
                        Closed by Take Profit
                      </option>
                      <option value="Closed by Stop Loss">
                        Closed by Stop Loss
                      </option>
                      <option value="Closed Manually">Closed Manually</option>
                    </select>
                  ) : (
                    <div
                      className={`inline-block px-3 py-2 rounded-lg border ${getTradeStatusColor(
                        editedOrder.tradeStatus
                      )}`}
                    >
                      {editedOrder.tradeStatus}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Lot Size
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editedOrder.lotSize || ""}
                      onChange={(e) =>
                        handleInputChange("lotSize", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-slate-700 rounded-lg text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-400" />
                      {editedOrder.lotSize}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Result
                  </label>
                  {isEditing ? (
                    <select
                      value={editedOrder.result || ""}
                      onChange={(e) =>
                        handleInputChange("result", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select Result</option>
                      <option value="Profit">Profit</option>
                      <option value="Loss">Loss</option>
                    </select>
                  ) : (
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getResultColor(
                        editedOrder.result
                      )}`}
                    >
                      {editedOrder.result === "Profit" ? (
                        <TrendingUpIcon className="w-4 h-4" />
                      ) : (
                        <TrendingDownIcon className="w-4 h-4" />
                      )}
                      {editedOrder.result || "Not set"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                Timestamps
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Open Time
                  </label>
                  {isEditing ? (
                    <input
                      type="datetime-local"
                      value={
                        editedOrder.open
                          ? new Date(editedOrder.open)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("open", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-slate-700 rounded-lg text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {editedOrder.open
                        ? new Date(editedOrder.open).toLocaleString()
                        : "Not set"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Close Time
                  </label>
                  {isEditing ? (
                    <input
                      type="datetime-local"
                      value={
                        editedOrder.close
                          ? new Date(editedOrder.close)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("close", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-slate-700 rounded-lg text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {editedOrder.close
                        ? new Date(editedOrder.close).toLocaleString()
                        : "Not closed"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Trade Levels */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Trade Levels
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Entry Price
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.00001"
                      value={editedOrder.entry || ""}
                      onChange={(e) =>
                        handleInputChange("entry", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-slate-700 rounded-lg text-white">
                      {editedOrder.entry || "Not set"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Exit Price
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.00001"
                      value={editedOrder.exit || ""}
                      onChange={(e) =>
                        handleInputChange("exit", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-slate-700 rounded-lg text-white">
                      {editedOrder.exit || "Not set"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Risk Amount
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editedOrder.risk || ""}
                      onChange={(e) =>
                        handleInputChange("risk", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-slate-700 rounded-lg text-white">
                      {editedOrder.risk || "Not set"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Commission
                  </label>

                  <div className="px-3 py-2 bg-slate-700 rounded-lg text-white">
                    {(editedOrder.commission).toFixed(2) || "0"}
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Data */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Financial Data
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Gross PnL
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editedOrder.grossPnL || ""}
                      onChange={(e) =>
                        handleInputChange("grossPnL", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <div
                      className={`px-3 py-2 bg-slate-700 rounded-lg font-bold ${getPnLColor(
                        editedOrder.grossPnL
                      )}`}
                    >
                      {editedOrder.grossPnL || "Not set"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Net PnL
                    <span className="text-xs text-slate-500 ml-2">
                      (Auto-calculated)
                    </span>
                  </label>
                  <div
                    className={`px-3 py-2 bg-slate-700 rounded-lg font-bold ${getPnLColor(
                      editedOrder.netPnL
                    )}`}
                  >
                    {editedOrder.netPnL || "Not calculated"}
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis & Review */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Analysis & Review
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Confluence
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedOrder.confluence || ""}
                      onChange={(e) =>
                        handleInputChange("confluence", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 h-24 resize-none"
                      placeholder="Enter confluence factors..."
                    />
                  ) : (
                    <div className="px-3 py-2 bg-slate-700 rounded-lg text-white min-h-[6rem]">
                      {editedOrder.confluence || "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Analysis
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedOrder.analysis || ""}
                      onChange={(e) =>
                        handleInputChange("analysis", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 h-32 resize-none"
                      placeholder="Enter trade analysis..."
                    />
                  ) : (
                    <div className="px-3 py-2 bg-slate-700 rounded-lg text-white min-h-[8rem]">
                      {editedOrder.analysis || "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Result Review
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedOrder.resultReview || ""}
                      onChange={(e) =>
                        handleInputChange("resultReview", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 h-32 resize-none"
                      placeholder="Enter result review..."
                    />
                  ) : (
                    <div className="px-3 py-2 bg-slate-700 rounded-lg text-white min-h-[8rem]">
                      {editedOrder.resultReview || "Not provided"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Challenge Badge */}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Confirm Changes
                </h3>
                <p className="text-slate-400 text-sm">
                  Are you sure you want to save these changes?
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullOrderbook;

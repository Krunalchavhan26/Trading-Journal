import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { BarChart3, TrendingUp, TrendingDown, Clock, MapPin, Info, Image } from 'lucide-react'
import axiosInstance from "../../../utils/axiosInstance"
import { setOrderbooks } from "../../../store/slices/orderbookSlice"

const AllOrderbooks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accountId } = useParams();
  const orderbooks = useSelector((state) => state.orderbook.orderbooks);

  useEffect(() => {
    const fetchOrderbooks = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/orderbooks/all-orderbooks/${accountId}`)
        dispatch(setOrderbooks(response?.data?.data))
      } catch (error) {
        console.error("Failed to fetch orderbooks: ", error)
      }
    }

    fetchOrderbooks();
  }, [accountId, dispatch])

  const handleCardClick = (orderId) => {
    navigate(`/accounts/${accountId}/orderbook/${orderId}`);
  }

  const getSessionColor = (session) => {
    switch (session?.toLowerCase()) {
      case 'london': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'asia': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'new york': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  }

  const getPnLColor = (pnl) => {
    const value = parseFloat(pnl);
    if (value > 0) return 'text-emerald-400';
    if (value < 0) return 'text-red-400';
    return 'text-slate-400';
  }

  // Get color for close reason
  const getCloseReasonColor = (closeReason) => {
    switch (closeReason?.toLowerCase()) {
      case 'take profit':
      case 'closed by take profit':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'stop loss':
      case 'closed by stop loss':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'manual':
      case 'closed manually':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    }
  }

  const generateMockChart = (direction, pnl) => {
    const isProfit = parseFloat(pnl) > 0;
    const color = isProfit ? '#10b981' : '#ef4444';
    const bgColor = isProfit ? '#10b981' : '#ef4444';
    
    return (
      <div className="relative h-20 bg-slate-800/50 rounded-lg overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(45deg, ${bgColor}20, transparent 70%)`
          }}
        />
        <div className="absolute bottom-0 left-0 w-full h-8 flex items-end justify-between px-2">
          {[...Array(20)].map((_, i) => {
            const height = Math.random() * 100;
            const trend = direction === 'BUY' ? 
              (isProfit ? height + Math.random() * 20 : height - Math.random() * 20) :
              (isProfit ? height + Math.random() * 20 : height - Math.random() * 20);
            
            return (
              <div
                key={i}
                className="w-0.5 bg-current opacity-60"
                style={{
                  height: `${Math.max(10, Math.min(100, trend))}%`,
                  color: color
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            All Orderbooks
          </h2>
          <p className="text-slate-400 mt-2">Track and analyze your trading performance</p>
        </div>

        {orderbooks.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-400 text-lg">No orderbook entries found.</p>
              <p className="text-slate-500 text-sm mt-2">Start by creating your first orderbook entry.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {orderbooks.map((order) => (
              <div
                key={order._id}
                onClick={() => handleCardClick(order._id)}
                className="group relative overflow-hidden bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer"
              >
                {/* Chart Area - Only show if no trade image */}
                {!order.tradeImage && (
                  <div className="relative h-24 p-4 bg-slate-750">
                    {generateMockChart(order.direction, order.grossPnL)}
                    
                    {/* Floating Info Button */}
                    <div className="absolute top-2 right-2 bg-slate-700/80 backdrop-blur-sm rounded-full p-1.5">
                      <Info className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                )}

                {/* Trade Image - Show at top if available */}
                {order.tradeImage && (
                  <div className="relative h-48 w-full overflow-hidden bg-slate-700/50">
                    <img 
                      src={order.tradeImage} 
                      alt="Trade Screenshot"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="flex items-center justify-center h-full text-slate-400">
                            <div class="text-center">
                              <div class="w-6 h-6 mx-auto mb-2">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                              </div>
                              <p class="text-xs">Image not available</p>
                            </div>
                          </div>
                        `;
                      }}
                    />
                    {/* Floating Info Button */}
                    <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm rounded-full p-1.5">
                      <Info className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-lg text-white">
                      {order.pair}
                    </h3>
                  </div>

                  {/* Timestamps */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>Open: {new Date(order.open).toLocaleDateString()}</span>
                      <span className="text-slate-500">
                        {new Date(order.open).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>Close: 
                        {order.close ? 
                          ` ${new Date(order.close).toLocaleDateString()} ${new Date(order.close).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` :
                          ' —'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {/* Pair */}
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md text-xs font-medium">
                      {order.pair}
                    </span>
                    
                    {/* Session */}
                    <span className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 border ${getSessionColor(order.session)}`}>
                      <MapPin className="w-3 h-3" />
                      {order.session}
                    </span>
                  </div>

                  {/* Direction & Status */}
                  <div className="flex gap-2">
                    {/* Fixed Direction Colors - BUY/Long = Green, SELL/Short = Red */}
                    <span className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 border ${
                      order.direction === 'BUY' || order.direction === 'Long'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {(order.direction === 'BUY' || order.direction === 'Long') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {order.direction}
                    </span>
                  </div>

                  {/* Close Reason with proper color coding */}
                  {order.tradeStatus && (
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCloseReasonColor(order.tradeStatus)}`}>
                        {order.tradeStatus}
                      </span>
                    </div>
                  )}

                  {/* Loss Indicator */}
                  {parseFloat(order.netPnL) < 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-red-400 font-medium">Loss</span>
                    </div>
                  )}

                  {/* PnL */}
                  <div className="pt-3 border-t border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Net PnL</span>
                      <span className={`font-bold text-lg ${getPnLColor(order.netPnL)}`}>
                        {order.netPnL}
                      </span>
                    </div>
                  </div>

                  {/* Challenge Badge */}
                  <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 px-3 py-2 rounded-md border border-blue-500/30">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">The 5%ters Challenge phase 2</span>
                  </div>
                </div>

                {/* Enhanced Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Subtle border glow on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                     style={{
                       background: 'linear-gradient(45deg, transparent, rgba(16, 185, 129, 0.1), transparent)',
                       padding: '1px',
                       borderRadius: '12px'
                     }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllOrderbooks
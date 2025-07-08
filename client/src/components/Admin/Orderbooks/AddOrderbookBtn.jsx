import { useNavigate, useParams } from "react-router-dom";

const AddOrderbookBtn = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();

  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={() => navigate(`/accounts/${accountId}/add-orderbook`)}
        className="
          group relative overflow-hidden
          bg-gradient-to-r from-slate-800 to-slate-700
          hover:from-emerald-600 hover:to-emerald-500
          border border-slate-600 hover:border-emerald-400
          text-slate-200 hover:text-white
          font-medium px-6 py-3 rounded-lg
          transition-all duration-300 ease-in-out
          hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/25
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50
        "
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        <span className="relative bg-gradient-to-r from-slate-200 to-slate-300 group-hover:from-white group-hover:to-emerald-100 bg-clip-text text-transparent font-semibold">
          + Add Orderbook
        </span>
      </button>
    </div>
  );
};

export default AddOrderbookBtn;
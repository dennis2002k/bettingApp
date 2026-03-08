import { useState } from "react";
import api from "../api/axios";

export default function MarketResultModal({ market, event, onClose, onSuccess }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (result === null) {
      setError("Please select a result.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.patch(`/markets/${market.id}/`, { result });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || "Failed to set result.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm shadow-2xl">

        {/* header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">
              {event.name}
            </p>
            <h2 className="text-white font-black text-lg">{market.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-all text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase">
            Select Result
          </p>

          {/* result buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setResult(true)}
              className={`py-4 rounded-xl font-black text-sm tracking-widest uppercase border transition-all ${
                result === true
                  ? "bg-green-500 border-green-500 text-black"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-green-500 hover:text-green-400"
              }`}
            >
              ✓ Won
            </button>
            <button
              onClick={() => setResult(false)}
              className={`py-4 rounded-xl font-black text-sm tracking-widest uppercase border transition-all ${
                result === false
                  ? "bg-red-500 border-red-500 text-white"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-red-500 hover:text-red-400"
              }`}
            >
              ✗ Lost
            </button>
          </div>

          {/* current result indicator */}
          {market.result !== null && market.result !== undefined && (
            <div className="bg-zinc-800 rounded-xl p-3 text-center">
              <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Current Result</p>
              <p className={`font-black text-sm ${market.result ? "text-green-400" : "text-red-400"}`}>
                {market.result ? "✓ Won" : "✗ Lost"}
              </p>
            </div>
          )}

          {/* error */}
          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || result === null}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black text-sm tracking-widest uppercase py-3 rounded-lg transition-all"
          >
            {loading ? "Saving..." : "Confirm Result"}
          </button>
        </div>
      </div>
    </div>
  );
}
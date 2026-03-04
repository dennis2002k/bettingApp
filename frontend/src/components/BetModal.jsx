import { useState } from "react";
import api from "../api/axios";

export default function BetModal({ market, event, balance, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const potentialPayout =
    amount && parseFloat(amount) > 0
      ? (parseFloat(amount) * parseFloat(market.current_odds)).toFixed(2)
      : "0.00";

  const handleSubmit = async () => {
    setError("");
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (parseFloat(amount) > parseFloat(balance)) {
      setError("Insufficient balance.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/bets/", {
        amount: parseFloat(amount),
        market: market.id,
        event: event.id,
        odds: market.current_odds,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || "Failed to place bet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // backdrop
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md shadow-2xl">

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

        {/* body */}
        <div className="p-6 space-y-5">

          {/* odds + balance */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-800 rounded-xl p-4">
              <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Odds</p>
              <p className="text-green-400 font-black text-2xl">{market.current_odds}</p>
            </div>
            <div className="bg-zinc-800 rounded-xl p-4">
              <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Balance</p>
              <p className="text-white font-black text-2xl">€{parseFloat(balance).toFixed(2)}</p>
            </div>
          </div>

          {/* amount input */}
          <div>
            <label className="block text-zinc-400 text-xs font-bold tracking-widest uppercase mb-2">
              Bet Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">€</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-4 py-3 text-white text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              />
            </div>

            {/* quick amount buttons */}
            <div className="flex gap-2 mt-2">
              {[5, 10, 25, 50].map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(String(q))}
                  className="flex-1 text-xs font-black tracking-widest uppercase py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all"
                >
                  €{q}
                </button>
              ))}
            </div>
          </div>

          {/* potential payout preview */}
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex items-center justify-between">
            <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase">Potential Payout</p>
            <p className={`font-black text-xl ${parseFloat(potentialPayout) > 0 ? "text-green-400" : "text-zinc-600"}`}>
              €{potentialPayout}
            </p>
          </div>

          {/* error */}
          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !amount}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-900 disabled:text-green-700 font-black text-sm tracking-widest uppercase py-3 rounded-lg transition-all"
          >
            {loading ? "Placing Bet..." : "Place Bet"}
          </button>
        </div>
      </div>
    </div>
  );
}
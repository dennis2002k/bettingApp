import { useState } from "react";

// ── Balance Card ──────────────────────────────────────────────────────────────
export default function BalanceCard({ profile, onAddFunds }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      await onAddFunds(amount);
      setAmount("");
      setShowInput(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">
        Available Balance
      </p>
      <p className="text-white text-4xl font-black mb-4">
        €{profile ? parseFloat(profile.balance).toFixed(2) : "—"}
      </p>

      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="text-xs font-black tracking-widest uppercase px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg transition-all"
        >
          + Add Funds
        </button>
      ) : (
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500 transition-all"
          />
          <button
            onClick={handleAddFunds}
            disabled={loading}
            className="px-4 py-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black text-xs font-black tracking-widest uppercase rounded-lg transition-all"
          >
            {loading ? "..." : "Add"}
          </button>
          <button
            onClick={() => setShowInput(false)}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs rounded-lg transition-all"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
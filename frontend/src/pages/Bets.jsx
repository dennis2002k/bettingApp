import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import BetCard from "../components/BetCard";



// ── Bets Page ─────────────────────────────────────────────────────────────────
export default function Bets() {
  const [user, setUser] = useState(null);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filters = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "P" },
    { label: "Won", value: "W" },
    { label: "Lost", value: "L" },
    { label: "Cancelled", value: "C" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, betsRes] = await Promise.all([
          api.get("/users/me/"),
          api.get("/bets/"),
        ]);
        setUser(userRes.data);
        setBets(betsRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          window.location.href = "/login";
        } else {
          setError("Failed to load bets.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBets = filter === "ALL" ? bets : bets.filter((b) => b.status === filter);

  // summary stats
 
  const totalBets = bets.length;
  const wonBets = bets.filter((b) => b.status === "W").length;
  const totalWagered = bets.reduce((sum, b) => sum + parseFloat(b.amount), 0);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* header */}
        <div className="mb-8">
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Overview</p>
          <h1 className="text-white font-black text-3xl">My Bets</h1>
        </div>

        {/* summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Total Bets</p>
            <p className="text-white font-black text-2xl">{totalBets}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Won</p>
            <p className="text-green-400 font-black text-2xl">{wonBets}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Total Wagered</p>
            <p className="text-white font-black text-2xl">€{totalWagered.toFixed(2)}</p>
          </div>
        </div>

        {/* filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-xs font-black tracking-widest uppercase px-4 py-2 rounded-lg border transition-all ${
                filter === f.value
                  ? "bg-green-500 border-green-500 text-black"
                  : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {f.label}
              <span className="ml-2 opacity-60">
                {f.value === "ALL" ? bets.length : bets.filter((b) => b.status === f.value).length}
              </span>
            </button>
          ))}
        </div>

        {/* bets list */}
        {error && (
          <div className="text-red-400 text-sm text-center py-10">{error}</div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 animate-pulse h-36" />
            ))}
          </div>
        ) : filteredBets.length === 0 ? (
          <div className="text-center py-20 text-zinc-600 text-sm tracking-widest uppercase font-bold">
            No {filter === "ALL" ? "" : filters.find(f => f.value === filter)?.label.toLowerCase()} bets found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBets.map((bet) => (
              <BetCard key={bet.id} bet={bet} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
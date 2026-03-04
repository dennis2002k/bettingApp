// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    P: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    W: "bg-green-500/10 text-green-400 border-green-500/30",
    L: "bg-red-500/10 text-red-400 border-red-500/30",
    C: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
  };
  const labels = {
    P: "Pending",
    W: "Won",
    L: "Lost",
    C: "Cancelled",
  };

  return (
    <span className={`text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

// ── Bet Card ──────────────────────────────────────────────────────────────────
export default function BetCard({ bet }) {
  const createdAt = new Date(bet.created_at);
  const expiresAt = new Date(bet.expires_at);

  return (
    <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-5 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">
            {bet.event_name ?? "Event"}
          </p>
          <h3 className="text-white font-bold text-base">{bet.market_name ?? `Market #${bet.market}`}</h3>
        </div>
        <StatusBadge status={bet.status} />
      </div>

      {/* stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-800 rounded-xl p-3">
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Amount</p>
          <p className="text-white font-black text-sm">€{parseFloat(bet.amount).toFixed(2)}</p>
        </div>
        <div className="bg-zinc-800 rounded-xl p-3">
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Odds</p>
          <p className="text-green-400 font-black text-sm">{bet.odds}</p>
        </div>
        <div className="bg-zinc-800 rounded-xl p-3">
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Payout</p>
          <p className={`font-black text-sm ${bet.status === "W" ? "text-green-400" : "text-white"}`}>
            €{parseFloat(bet.potential_payout).toFixed(2)}
          </p>
        </div>
      </div>

      {/* footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
        <p className="text-zinc-600 text-xs">
          Placed {createdAt.toLocaleDateString()} · {createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
        <p className="text-zinc-600 text-xs">
          Expires {expiresAt.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
import { useState } from "react";

// ── Event Card ────────────────────────────────────────────────────────────────
export default function EventCard({ event, onBetClick, user, onSetResult }) {
  const [expanded, setExpanded] = useState(false);
  const startAt = event.start_at ? new Date(event.start_at) : null;
  const isLive = startAt && startAt <= new Date();

  return (
    <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-5 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isLive && (
              <span className="flex items-center gap-1 text-xs font-black tracking-widest uppercase text-red-400">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                Live
              </span>
            )}
            <h3 className="text-white font-bold text-base">{event.name}</h3>
          </div>
          {startAt && (
            <p className="text-zinc-500 text-xs">
              {startAt.toLocaleDateString()} · {startAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-zinc-500 hover:text-green-400 text-xs font-bold tracking-widest uppercase transition-colors"
        >
          {expanded ? "Hide" : "Markets"}
        </button>
      </div>

      {/* markets */}
      {expanded && (
        <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
          {event.markets && event.markets.length > 0 ? (
            event.markets.map((market) => (
              <div
                key={market.id}
                className="flex items-center justify-between bg-zinc-800 rounded-lg px-4 py-3"
              >
              <div>
                <span className="text-zinc-300 text-sm">{market.name}</span>
                {/* show result if set */}
                {market.result !== null && market.result !== undefined && (
                  <span className={`ml-2 text-xs font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${
                    market.result 
                      ? "bg-green-500/10 text-green-400 border border-green-500/30" 
                      : "bg-red-500/10 text-red-400 border border-red-500/30"
                  }`}>
                    {market.result ? "✓ Won" : "✗ Lost"}
                  </span>
                )}
              </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 font-black text-sm">
                    {market.current_odds}
                  </span>
                  {/* only show bet button if no result yet */}
                  {market.result === null || market.result === undefined ? (
                    <button
                      onClick={() => onBetClick(market)}
                      className="text-xs font-black tracking-widest uppercase px-3 py-1.5 bg-green-500 hover:bg-green-400 text-black rounded-lg transition-all"
                    >
                      Bet
                    </button>
                  ) : null}
                   {user?.is_staff && (
                    <button
                      onClick={() => onSetResult(market)}
                      className="text-xs font-black tracking-widest uppercase px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-lg transition-all"
                    >
                      Set Result
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-600 text-sm text-center py-2">No markets available</p>
          )}
        </div>
      )}
    </div>
  );
}

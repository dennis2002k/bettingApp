import { useState } from "react";
import api from "../api/axios";

const emptyMarket = () => ({ name: "", current_odds: "" });

export default function AdminEventModal({ onClose, onSuccess }) {
  const [eventData, setEventData] = useState({
    name: "",
    starts_at: "",
    ends_at: "",
  });
  const [markets, setMarkets] = useState([emptyMarket()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateEvent = (field, value) =>
    setEventData((prev) => ({ ...prev, [field]: value }));

  const updateMarket = (index, field, value) =>
    setMarkets((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );

  const addMarket = () => setMarkets((prev) => [...prev, emptyMarket()]);

  const removeMarket = (index) =>
    setMarkets((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    setError("");

    // basic validation
    if (!eventData.name || !eventData.starts_at || !eventData.ends_at) {
      setError("Please fill in all event fields.");
      return;
    }
    if (markets.some((m) => !m.name || !m.current_odds)) {
      setError("Please fill in all market fields.");
      return;
    }
    if (new Date(eventData.ends_at) <= new Date(eventData.starts_at)) {
      setError("End time must be after start time.");
      return;
    }

    setLoading(true);
    try {
      // create event first
      const eventRes = await api.post("/events/create/", eventData);
      const eventId = eventRes.data.id;

      // then create all markets linked to the event
      await Promise.all(
        markets.map((market) =>
          api.post("/markets/", {
            ...market,
            event: eventId,
            current_odds: parseFloat(market.current_odds),
          })
        )
      );

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Failed to create event."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
          <div>
            <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Admin</p>
            <h2 className="text-white font-black text-lg">Create Event</h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-all text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* event fields */}
          <div className="space-y-4">
            <h3 className="text-zinc-400 text-xs font-black tracking-widest uppercase">Event Details</h3>

            <div>
              <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
                Event Name
              </label>
              <input
                type="text"
                value={eventData.name}
                onChange={(e) => updateEvent("name", e.target.value)}
                placeholder="e.g. Man Utd vs Liverpool"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
                  Starts At
                </label>
                <input
                  type="datetime-local"
                  value={eventData.starts_at}
                  onChange={(e) => updateEvent("starts_at", e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
                  Ends At
                </label>
                <input
                  type="datetime-local"
                  value={eventData.ends_at}
                  onChange={(e) => updateEvent("ends_at", e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* divider */}
          <div className="border-t border-zinc-800" />

          {/* markets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-zinc-400 text-xs font-black tracking-widest uppercase">Markets</h3>
              <button
                onClick={addMarket}
                className="text-xs font-black tracking-widest uppercase px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-green-400 border border-green-500/30 rounded-lg transition-all"
              >
                + Add Market
              </button>
            </div>

            {markets.map((market, index) => (
              <div key={index} className="bg-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase">
                    Market {index + 1}
                  </span>
                  {markets.length > 1 && (
                    <button
                      onClick={() => removeMarket(index)}
                      className="text-zinc-600 hover:text-red-400 text-xs transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={market.name}
                  onChange={(e) => updateMarket(index, "name", e.target.value)}
                  placeholder="e.g. Man Utd to win"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-all"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={market.current_odds}
                    onChange={(e) => updateMarket(index, "current_odds", e.target.value)}
                    placeholder="Odds e.g. 2.50"
                    min="1"
                    step="0.01"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-all"
                  />
                  {market.current_odds && (
                    <span className="text-green-400 font-black text-sm whitespace-nowrap">
                      @ {parseFloat(market.current_odds).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
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
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-900 disabled:text-green-700 font-black text-sm tracking-widest uppercase py-3 rounded-lg transition-all"
          >
            {loading ? "Creating..." : `Create Event with ${markets.length} Market${markets.length > 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
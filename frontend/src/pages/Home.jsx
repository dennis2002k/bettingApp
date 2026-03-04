import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import BalanceCard from "../components/BalanceCard";
import EventCard from "../components/EventCard";
import BetModal from "../components/BetModal"
import AdminEventModal from "../components/AdminEventModal";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// ── Home Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState("");
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, eventsRes] = await Promise.all([
          api.get("/users/me/"),
          api.get("/events/"),
        ]);
        console.log(userRes)
        setUser(userRes.data);
        setProfile(userRes.data.profile);
        setEvents(eventsRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          window.location.href = "/login";
        } else {
          setError("Failed to load data.");
        }
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchData();
  }, []);

  const handleAddFunds = async (amount) => {
    const res = await api.post("/users/add-funds/", { amount });
    setProfile((prev) => ({ ...prev, balance: res.data.balance }));
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar user={user} onCreateEvent={() => setShowAdminModal(true)} />

      {/* background glow */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-green-500 opacity-3 rounded-full blur-3xl pointer-events-none" />

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-1">
            <BalanceCard profile={profile} onAddFunds={handleAddFunds} />
          </div>

          {/* welcome */}
          <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center">
            <div>
              <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">
                Welcome back
              </p>
              <h1 className="text-white text-3xl font-black">
                {user ? user.username : "—"}
              </h1>
              <p className="text-zinc-500 text-sm mt-2">
                Place your bets on upcoming events below.
              </p>
            </div>
          </div>
        </div>

        {/* events */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-black text-lg tracking-widest uppercase">
              Upcoming Events
            </h2>
            <span className="text-zinc-600 text-xs font-bold tracking-widest uppercase">
              {events.length} events
            </span>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center py-10">{error}</div>
          )}

          {loadingEvents ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 animate-pulse h-20" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 text-zinc-600 text-sm tracking-widest uppercase font-bold">
              No upcoming events
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onBetClick={(market) => {
                      setSelectedMarket(market);
                      setSelectedEvent(event);
                  }}
                />
              ))}
            </div>
          )}
          
        </div>
      </main>
      {selectedMarket && (
            <BetModal
                market={selectedMarket}
                event={selectedEvent}
                balance={profile?.balance ?? 0}
                onClose={() => setSelectedMarket(null)}
                onSuccess={() => {
                // refresh balance after bet is placed
                api.get("/users/me/").then(res => setProfile(res.data.profile));
                }}
            />
          )}
        {showAdminModal && (
            <AdminEventModal
                onClose={() => setShowAdminModal(false)}
                onSuccess={() => {
                // refresh events list after creating
                api.get("/events/").then(res => setEvents(res.data));
                }}
            />
        )}
    </div>
  );
}
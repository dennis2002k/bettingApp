// import AdminEventModal from "./AdminEventModal";

// ── Navbar ────────────────────────────────────────────────────────────────────
export default function Navbar({ user,  onCreateEvent }) {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded rotate-45" />
          <span className="text-white font-black text-xl tracking-widest uppercase">
            BetApp
          </span>
        </div>

        {/* right side */}
        <div className="flex items-center gap-6">
          <a href="/" className="text-green-500 text-sm font-bold tracking-widest uppercase">
            Home
          </a>
          <a href="/bets" className="text-zinc-400 hover:text-white text-sm font-bold tracking-widest uppercase transition-colors">
            My Bets
          </a>

          {/* admin button */}
          {user?.is_staff && (
            <button
              onClick={onCreateEvent}
              className="text-xs font-black tracking-widest uppercase px-4 py-2 bg-green-500 hover:bg-green-400 rounded-lg transition-all"
            >
              + Create Event
            </button>
          )}

          {user && (
            <span className="text-zinc-500 text-sm">
              {user.username}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-xs font-black tracking-widest uppercase px-4 py-2 border border-zinc-700 hover:border-red-500 hover:text-red-400 text-zinc-400 rounded-lg transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

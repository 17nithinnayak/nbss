import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { OrgMasthead } from "./OrgMasthead";

export function Navbar() {
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate("/login");
  }

  const linkClass = "text-ink hover:text-brand transition-colors block sm:inline";

  return (
    <header className="bg-surface relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <OrgMasthead compact />
        </Link>

        <>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link to="/members" className={linkClass}>Members</Link>
            {user && (
              <>
              <Link to="/events" className={linkClass}>Events</Link>
              {isSuperAdmin && <Link to="/admin" className={linkClass}>Manage members</Link>}
              <Link to="/account" className={linkClass}>{user.full_name.split(" ")[0]}</Link>
              <button onClick={handleLogout} className="text-muted hover:text-brand transition-colors">
                Log out
              </button>
              </>
            )}
            {!user && <Link to="/login" className={linkClass}>Log in</Link>}
          </nav>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="sm:hidden p-2 -mr-2 text-brand"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="sm:hidden border-t border-gray-200 px-4 py-3 flex flex-col gap-3 text-sm bg-surface">
          <Link to="/members" className={linkClass} onClick={() => setMenuOpen(false)}>Members</Link>
          {user ? (
            <>
              <Link to="/events" className={linkClass} onClick={() => setMenuOpen(false)}>Events</Link>
              {isSuperAdmin && (
                <Link to="/admin" className={linkClass} onClick={() => setMenuOpen(false)}>Manage members</Link>
              )}
              <Link to="/account" className={linkClass} onClick={() => setMenuOpen(false)}>
                {user.full_name.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="text-muted hover:text-brand transition-colors text-left">
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>Log in</Link>
          )}
        </nav>
      )}

      <div className="tricolor-stripe" />
    </header>
  );
}

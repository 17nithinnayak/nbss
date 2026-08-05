import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { OrgMasthead } from "./OrgMasthead";

export function Navbar() {
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="bg-surface">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/">
          <OrgMasthead compact />
        </Link>

        {user && (
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/" className="text-ink hover:text-brand transition-colors">
              Directory
            </Link>
            <Link to="/events" className="text-ink hover:text-brand transition-colors">
              Events
            </Link>
            {isSuperAdmin && (
              <Link to="/admin" className="text-ink hover:text-brand transition-colors">
                Manage members
              </Link>
            )}
            <Link to="/account" className="text-ink hover:text-brand transition-colors">
              {user.full_name.split(" ")[0]}
            </Link>
            <button
              onClick={handleLogout}
              className="text-muted hover:text-brand transition-colors"
            >
              Log out
            </button>
          </nav>
        )}
      </div>
      <div className="tricolor-stripe" />
    </header>
  );
}

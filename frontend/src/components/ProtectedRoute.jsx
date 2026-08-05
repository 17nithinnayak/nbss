import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function RequireSuperAdmin({ children }) {
  const { user, loading, isSuperAdmin } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isSuperAdmin) return <Navigate to="/" replace />;
  return children;
}

function FullPageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen text-muted">
      Loading…
    </div>
  );
}

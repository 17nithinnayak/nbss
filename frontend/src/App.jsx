import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RequireAuth, RequireSuperAdmin } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Login } from "./pages/Login";
import { Directory } from "./pages/Directory";
import { MemberDetail } from "./pages/MemberDetail";
import { AdminPanel } from "./pages/AdminPanel";
import { Account } from "./pages/Account";
import { Events } from "./pages/Events";
import { EventDetail } from "./pages/EventDetail";
import { VerifyMember } from "./pages/VerifyMember";

function AppShell() {
  // Wraps EVERYTHING (Navbar + auth context + routes) so a crash anywhere —
  // not just inside a page — shows a message instead of blanking the app.
  const location = useLocation();

  return (
    <ErrorBoundary resetKey={location.pathname}>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify/:id" element={<VerifyMember />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Directory />
              </RequireAuth>
            }
          />
          <Route
            path="/members/:id"
            element={
              <RequireAuth>
                <MemberDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <Account />
              </RequireAuth>
            }
          />
          <Route
            path="/events"
            element={
              <RequireAuth>
                <Events />
              </RequireAuth>
            }
          />
          <Route
            path="/events/:id"
            element={
              <RequireAuth>
                <EventDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireSuperAdmin>
                <AdminPanel />
              </RequireSuperAdmin>
            }
          />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

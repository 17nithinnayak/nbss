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

function AppRoutes() {
  // Tied to the current path so the ErrorBoundary clears itself whenever
  // the user navigates, instead of a crash on one page haunting every
  // page visited afterward.
  const location = useLocation();

  return (
    <ErrorBoundary resetKey={location.pathname}>
      <Routes>
        <Route path="/login" element={<Login />} />
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
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/members";

export function Account() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setStatus({ type: "success", message: "Password updated." });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.detail || "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-brand-dark mb-1">My Account</h1>
      <p className="text-sm text-muted mb-6">Your NBSS membership details.</p>

      {/* ID-card styled profile panel — same language as the member detail page */}
      <div className="rounded-lg border-2 border-brand overflow-hidden bg-surface">
        <div className="bg-brand text-white px-6 py-3">
          <p className="text-xs tracking-widest font-medium">NBSS / PFI MEMBER RECORD</p>
        </div>
        <div className="tricolor-stripe" />

        <div className="p-6 flex flex-col sm:flex-row gap-6">
          <div className="w-36 h-40 border-2 border-brand-light rounded bg-brand-light overflow-hidden flex-shrink-0">
            {user.photo_url ? (
              <img src={user.photo_url} alt={user.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-display text-brand">
                {user.full_name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="font-display text-xl text-ink">{user.full_name}</h2>
            <p className="text-saffron font-medium text-sm mt-0.5 uppercase tracking-wide">
              {user.title}
            </p>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted w-28 flex-shrink-0">Email</dt>
                <dd className="text-ink">: {user.email}</dd>
              </div>
              {user.phone && (
                <div className="flex gap-2">
                  <dt className="text-muted w-28 flex-shrink-0">Mob</dt>
                  <dd className="text-ink">: {user.phone}</dd>
                </div>
              )}
              {user.blood_group && (
                <div className="flex gap-2">
                  <dt className="text-muted w-28 flex-shrink-0">Blood Group</dt>
                  <dd className="text-ink">: {user.blood_group}</dd>
                </div>
              )}
              {user.valid_until && (
                <div className="flex gap-2">
                  <dt className="text-muted w-28 flex-shrink-0">Valid Date</dt>
                  <dd className="text-ink">
                    : {new Date(user.valid_until).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </dd>
                </div>
              )}
              <div className="flex gap-2">
                <dt className="text-muted w-28 flex-shrink-0">Role</dt>
                <dd className="text-ink">: {user.role === "super_admin" ? "Super Admin" : "Member"}</dd>
              </div>
            </dl>

            {user.bio && (
              <p className="text-sm text-ink mt-4 leading-relaxed border-t border-gray-200 pt-3">
                {user.bio}
              </p>
            )}
          </div>
        </div>
        <div className="tricolor-stripe" />
      </div>

      {/* Password change — present, but secondary to the profile above */}
      <div className="mt-8">
        <h2 className="text-sm font-medium text-ink mb-3">Change password</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
          <div>
            <label className="block text-sm text-ink mb-1">Current password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">New password</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {status && (
            <p className={`text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-brand hover:bg-brand-dark text-white rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60"
          >
            {submitting ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

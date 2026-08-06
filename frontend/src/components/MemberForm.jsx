import { useState } from "react";

const emptyForm = {
  full_name: "",
  title: "",
  email: "",
  password: "",
  phone: "",
  blood_group: "",
  valid_until: "",
  bio: "",
  photo_url: "",
  display_order: 100,
  role: "member",
};

/**
 * Shared add/edit form.
 * - `initial`: pass an existing member to edit, omit to create a new one.
 * - `onSubmit(payload)`: called with a cleaned-up payload on submit.
 * - `onCancel()`: called when the user backs out.
 */
export function MemberForm({ initial, onSubmit, onCancel }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(() => ({ ...emptyForm, ...initial }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        display_order: Number(form.display_order),
        valid_until: form.valid_until || null,
      };
      if (isEdit) {
        // Password/email are not editable here — password has its own flow,
        // email changes would need re-verification, kept out of scope.
        delete payload.password;
        delete payload.email;
      }
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-surface border border-gray-200 rounded-lg p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full name" value={form.full_name} onChange={(v) => update("full_name", v)} required />
        <Field label="Title / Role" value={form.title} onChange={(v) => update("title", v)} required placeholder="e.g. National Chairman" />
      </div>

      {!isEdit && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
          <Field label="Initial password" type="text" value={form.password} onChange={(v) => update("password", v)} required />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Phone (optional)" value={form.phone || ""} onChange={(v) => update("phone", v)} />
        <Field label="Photo URL (optional)" value={form.photo_url || ""} onChange={(v) => update("photo_url", v)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink mb-1">Blood group (optional)</label>
          <select
            value={form.blood_group || ""}
            onChange={(e) => update("blood_group", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">—</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
        <Field
          label="Valid until (optional)"
          type="date"
          value={form.valid_until || ""}
          onChange={(v) => update("valid_until", v)}
        />
      </div>

      <div>
        <label className="block text-sm text-ink mb-1">Bio (optional)</label>
        <textarea
          value={form.bio || ""}
          onChange={(e) => update("bio", e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Display order (lower shows first)"
          type="number"
          value={form.display_order}
          onChange={(v) => update("display_order", v)}
        />
        <div>
          <label className="block text-sm text-ink mb-1">Role</label>
          <select
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="member">Member</option>
            <option value="super_admin">Super admin</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-brand hover:bg-brand-dark text-white rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Add member"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted hover:text-ink transition-colors px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, type = "text", required = false, placeholder }) {
  return (
    <div>
      <label className="block text-sm text-ink mb-1">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
      />
    </div>
  );
}

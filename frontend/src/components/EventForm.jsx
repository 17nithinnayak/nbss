import { useState } from "react";

const emptyForm = { title: "", description: "", event_date: "", photos: [] };

/**
 * Shared add/edit form for events.
 * - `initial`: pass an existing event to edit, omit to create a new one.
 * - `onSubmit(payload)`: called with a cleaned-up payload on submit.
 * - `onCancel()`: called when the user backs out.
 */
export function EventForm({ initial, onSubmit, onCancel }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...initial,
    photos: initial?.photos?.length
      ? initial.photos.map((p) => ({ photo_url: p.photo_url, caption: p.caption || "" }))
      : [],
  }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updatePhoto(index, field, value) {
    setForm((f) => {
      const photos = [...f.photos];
      photos[index] = { ...photos[index], [field]: value };
      return { ...f, photos };
    });
  }

  function addPhotoRow() {
    setForm((f) => ({ ...f, photos: [...f.photos, { photo_url: "", caption: "" }] }));
  }

  function removePhotoRow(index) {
    setForm((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const photos = form.photos
        .filter((p) => p.photo_url.trim())
        .map((p, i) => ({ photo_url: p.photo_url.trim(), caption: p.caption || null, display_order: i }));

      await onSubmit({
        title: form.title,
        description: form.description || null,
        event_date: form.event_date,
        photos,
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-surface border border-gray-200 rounded-lg p-6">
      <div>
        <label className="block text-sm text-ink mb-1">Event title</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div>
        <label className="block text-sm text-ink mb-1">Date</label>
        <input
          type="date"
          required
          value={form.event_date}
          onChange={(e) => update("event_date", e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div>
        <label className="block text-sm text-ink mb-1">Description (optional)</label>
        <textarea
          value={form.description || ""}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div>
        <label className="block text-sm text-ink mb-2">Photos (optional)</label>
        <div className="space-y-2">
          {form.photos.map((photo, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input
                type="text"
                placeholder="Photo URL"
                value={photo.photo_url}
                onChange={(e) => updatePhoto(i, "photo_url", e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <input
                type="text"
                placeholder="Caption (optional)"
                value={photo.caption}
                onChange={(e) => updatePhoto(i, "caption", e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <button
                type="button"
                onClick={() => removePhotoRow(i)}
                className="text-red-600 hover:text-red-700 text-sm px-2 py-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addPhotoRow}
          className="mt-2 text-sm text-brand hover:text-brand-dark transition-colors"
        >
          + Add photo
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-brand hover:bg-brand-dark text-white rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Add event"}
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

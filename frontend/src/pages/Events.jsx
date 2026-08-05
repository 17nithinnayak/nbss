import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventsApi } from "../api/members";
import { EventForm } from "../components/EventForm";
import { useAuth } from "../context/AuthContext";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function Events() {
  const { isSuperAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState(null); // null | "add" | { editId }

  function refresh() {
    return eventsApi.list().then(setEvents);
  }

  useEffect(() => {
    refresh()
      .catch(() => setError("Couldn't load events."))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(payload) {
    await eventsApi.create(payload);
    await refresh();
    setMode(null);
  }

  async function handleEdit(id, payload) {
    await eventsApi.update(id, payload);
    await refresh();
    setMode(null);
  }

  async function handleDelete(event) {
    if (!window.confirm(`Delete "${event.title}"? This can't be undone.`)) return;
    await eventsApi.remove(event.id);
    await refresh();
  }

  const editingEvent =
    mode && typeof mode === "object" ? events.find((e) => e.id === mode.editId) : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-brand-dark">Events</h1>
          <p className="text-sm text-muted mt-1">Events conducted by the NBSS community.</p>
        </div>
        {isSuperAdmin && !mode && (
          <button
            onClick={() => setMode("add")}
            className="bg-brand hover:bg-brand-dark text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            + Add event
          </button>
        )}
      </div>

      {mode === "add" && (
        <div className="mb-8">
          <EventForm onSubmit={handleAdd} onCancel={() => setMode(null)} />
        </div>
      )}

      {editingEvent && (
        <div className="mb-8">
          <EventForm
            initial={editingEvent}
            onSubmit={(p) => handleEdit(editingEvent.id, p)}
            onCancel={() => setMode(null)}
          />
        </div>
      )}

      {loading && <p className="text-sm text-muted">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && events.length === 0 && (
        <p className="text-sm text-muted">No events yet.</p>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-surface border-2 border-brand-light rounded-lg overflow-hidden"
          >
            <div className="flex gap-4 p-4">
              {event.photos[0] && (
                <img
                  src={event.photos[0].photo_url}
                  alt=""
                  className="w-24 h-24 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-saffron font-medium uppercase tracking-wide">
                  {formatDate(event.event_date)}
                </p>
                <Link to={`/events/${event.id}`} className="block">
                  <h2 className="font-display text-lg text-ink hover:text-brand transition-colors">
                    {event.title}
                  </h2>
                </Link>
                {event.description && (
                  <p className="text-sm text-muted mt-1 line-clamp-2">{event.description}</p>
                )}
                {event.photos.length > 1 && (
                  <p className="text-xs text-muted mt-1">{event.photos.length} photos</p>
                )}
              </div>
              {isSuperAdmin && (
                <div className="flex flex-col gap-2 text-sm flex-shrink-0">
                  <button
                    onClick={() => setMode({ editId: event.id })}
                    className="text-brand hover:text-brand-dark transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

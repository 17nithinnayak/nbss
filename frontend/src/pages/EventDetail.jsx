import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { eventsApi } from "../api/members";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    eventsApi
      .get(id)
      .then(setEvent)
      .catch(() => setError("This event could not be found."));
  }, [id]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <p className="text-sm text-red-600">{error}</p>
        <Link to="/events" className="text-sm text-brand mt-4 inline-block">
          ← Back to events
        </Link>
      </div>
    );
  }

  if (!event) {
    return <div className="max-w-2xl mx-auto px-6 py-10 text-sm text-muted">Loading…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/events" className="text-sm text-muted hover:text-brand transition-colors">
        ← Back to events
      </Link>

      <div className="mt-6">
        <p className="text-xs text-saffron font-medium uppercase tracking-wide">
          {formatDate(event.event_date)}
        </p>
        <h1 className="font-display text-2xl text-ink mt-1">{event.title}</h1>
        <div className="tricolor-stripe max-w-xs mt-3 rounded" />

        {event.description && (
          <p className="text-sm text-ink mt-4 leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        )}

        {event.photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
            {event.photos.map((photo) => (
              <figure key={photo.id} className="rounded-lg overflow-hidden border-2 border-brand-light">
                <img src={photo.photo_url} alt={photo.caption || ""} className="w-full aspect-square object-cover" />
                {photo.caption && (
                  <figcaption className="text-xs text-muted px-2 py-1.5 bg-surface">
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { publicApi } from "../api/members";
import { MemberCard } from "../components/MemberCard";

export function Directory() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    publicApi
      .listMembers()
      .then(setMembers)
      .catch(() => setError("Couldn't load the directory. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-brand-dark mb-1">Our Community</h1>
      <p className="text-sm text-muted mb-3">Members of the NBSS community.</p>
      <div className="tricolor-stripe max-w-xs mb-8 rounded" />

      {loading && <p className="text-sm text-muted">Loading members…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && members.length === 0 && (
        <p className="text-sm text-muted">No members have been added yet.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {members.map((m) => (
          <MemberCard key={m.id} member={m} />
        ))}
      </div>
    </div>
  );
}

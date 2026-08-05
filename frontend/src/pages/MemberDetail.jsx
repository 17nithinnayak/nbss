import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { membersApi } from "../api/members";

export function MemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    membersApi
      .get(id)
      .then(setMember)
      .catch(() => setError("This member could not be found."));
  }, [id]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <p className="text-sm text-red-600">{error}</p>
        <Link to="/" className="text-sm text-brand mt-4 inline-block">
          ← Back to directory
        </Link>
      </div>
    );
  }

  if (!member) {
    return <div className="max-w-2xl mx-auto px-6 py-10 text-sm text-muted">Loading…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link to="/" className="text-sm text-muted hover:text-brand transition-colors">
        ← Back to directory
      </Link>

      {/* ID-card styled member panel */}
      <div className="mt-6 rounded-lg border-2 border-brand overflow-hidden bg-surface">
        <div className="bg-brand text-white px-6 py-3">
          <p className="text-xs tracking-widest font-medium">NBSS / PFI MEMBER RECORD</p>
        </div>
        <div className="tricolor-stripe" />

        <div className="p-6 flex flex-col sm:flex-row gap-6">
          <div className="w-36 h-40 border-2 border-brand-light rounded bg-brand-light overflow-hidden flex-shrink-0">
            {member.photo_url ? (
              <img src={member.photo_url} alt={member.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-display text-brand">
                {member.full_name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="font-display text-xl text-ink">{member.full_name}</h1>
            <p className="text-saffron font-medium text-sm mt-0.5 uppercase tracking-wide">
              {member.title}
            </p>

            <dl className="mt-4 space-y-2 text-sm">
              {member.phone && (
                <div className="flex gap-2">
                  <dt className="text-muted w-24 flex-shrink-0">Mob</dt>
                  <dd className="text-ink">: {member.phone}</dd>
                </div>
              )}
              {member.blood_group && (
                <div className="flex gap-2">
                  <dt className="text-muted w-24 flex-shrink-0">Blood Group</dt>
                  <dd className="text-ink">: {member.blood_group}</dd>
                </div>
              )}
              {member.valid_until && (
                <div className="flex gap-2">
                  <dt className="text-muted w-24 flex-shrink-0">Valid Date</dt>
                  <dd className="text-ink">: {new Date(member.valid_until).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })}</dd>
                </div>
              )}
              <div className="flex gap-2">
                <dt className="text-muted w-24 flex-shrink-0">Status</dt>
                <dd className="text-ink">: {member.is_active ? "Active" : "Inactive"}</dd>
              </div>
            </dl>

            {member.bio && (
              <p className="text-sm text-ink mt-4 leading-relaxed border-t border-gray-200 pt-3">
                {member.bio}
              </p>
            )}
          </div>
        </div>
        <div className="tricolor-stripe" />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { publicApi } from "../api/members";
import { OrgMasthead } from "../components/OrgMasthead";

export function VerifyMember() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    publicApi
      .getMember(id)
      .then(setMember)
      .catch(() => setError("This ID card could not be verified — no matching member found."));
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-10">
      <div className="w-full max-w-sm rounded-lg border-2 border-brand shadow-sm overflow-hidden bg-surface">
        <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center">
          <OrgMasthead />
        </div>
        <div className="tricolor-stripe" />

        <div className="px-6 py-6">
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          {!error && !member && (
            <p className="text-sm text-muted text-center">Verifying…</p>
          )}

          {member && (
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-32 border-2 border-brand-light rounded bg-brand-light overflow-hidden flex-shrink-0 mb-4">
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-display text-brand">
                    {member.full_name.charAt(0)}
                  </div>
                )}
              </div>

              <h1 className="font-display text-lg text-ink">{member.full_name}</h1>
              <p className="text-saffron font-medium text-sm mt-0.5 uppercase tracking-wide">
                {member.title}
              </p>

              <div
                className={`mt-4 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  member.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {member.is_active ? "VERIFIED — ACTIVE MEMBER" : "INACTIVE"}
              </div>

              <dl className="mt-4 space-y-1.5 text-sm w-full text-left max-w-[220px] mx-auto">
                {member.blood_group && (
                  <div className="flex gap-2">
                    <dt className="text-muted w-28 flex-shrink-0">Blood Group</dt>
                    <dd className="text-ink">: {member.blood_group}</dd>
                  </div>
                )}
                {member.valid_until && (
                  <div className="flex gap-2">
                    <dt className="text-muted w-28 flex-shrink-0">Valid Until</dt>
                    <dd className="text-ink">
                      : {new Date(member.valid_until).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
        <div className="tricolor-stripe" />
        <p className="text-[10px] text-muted text-center py-2">
          Verified via NBSS Community Portal
        </p>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { membersApi } from "../api/members";
import { MemberForm } from "../components/MemberForm";
import { QRCodeBlock } from "../components/QRCodeBlock";
import { useAuth } from "../context/AuthContext";

export function AdminPanel() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(null); // null | "add" | { editId }
  const [error, setError] = useState("");
  const [qrOpenId, setQrOpenId] = useState(null);

  function refresh() {
    return membersApi.list().then(setMembers);
  }

  useEffect(() => {
    refresh()
      .catch(() => setError("Couldn't load members."))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(payload) {
    await membersApi.create(payload);
    await refresh();
    setMode(null);
  }

  async function handleEdit(id, payload) {
    await membersApi.update(id, payload);
    await refresh();
    setMode(null);
  }

  async function handleDelete(member) {
    if (member.id === user.id) return; // safety net, backend also blocks this
    if (!window.confirm(`Remove ${member.full_name} from the community?`)) return;
    await membersApi.remove(member.id);
    await refresh();
  }

  const editingMember =
    mode && typeof mode === "object" ? members.find((m) => m.id === mode.editId) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl text-brand-dark">Manage members</h1>
          <p className="text-sm text-muted mt-1">Add, edit, or remove community members.</p>
        </div>
        {!mode && (
          <button
            onClick={() => setMode("add")}
            className="bg-brand hover:bg-brand-dark text-white rounded-md px-4 py-2 text-sm font-medium transition-colors self-start sm:self-auto"
          >
            + Add member
          </button>
        )}
      </div>

      {mode === "add" && (
        <div className="mb-8">
          <MemberForm onSubmit={handleAdd} onCancel={() => setMode(null)} />
        </div>
      )}

      {editingMember && (
        <div className="mb-8">
          <MemberForm initial={editingMember} onSubmit={(p) => handleEdit(editingMember.id, p)} onCancel={() => setMode(null)} />
        </div>
      )}

      {loading && <p className="text-sm text-muted">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-surface">
        {members.map((m) => (
          <div key={m.id}>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink">{m.full_name}</p>
                <p className="text-xs text-muted">{m.title} · {m.role === "super_admin" ? "Super admin" : "Member"}</p>
              </div>
              <div className="flex gap-4 text-sm">
                <button
                  onClick={() => setQrOpenId(qrOpenId === m.id ? null : m.id)}
                  className="text-brand hover:text-brand-dark transition-colors"
                >
                  {qrOpenId === m.id ? "Hide QR" : "QR Code"}
                </button>
                <button onClick={() => setMode({ editId: m.id })} className="text-brand hover:text-brand-dark transition-colors">
                  Edit
                </button>
                {m.id !== user.id && (
                  <button onClick={() => handleDelete(m)} className="text-red-600 hover:text-red-700 transition-colors">
                    Delete
                  </button>
                )}
              </div>
            </div>

            {qrOpenId === m.id && (
              <div className="px-4 pb-4 flex flex-col items-center bg-brand-light">
                <p className="text-xs text-muted mb-2 text-center max-w-xs">
                  Scan this from the printed ID card to open {m.full_name}'s verification page — no login needed.
                </p>
                <QRCodeBlock
                  value={`${window.location.origin}/verify/${m.id}`}
                  filename={`${m.full_name.replace(/\s+/g, "-").toLowerCase()}-qr.png`}
                  size={180}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

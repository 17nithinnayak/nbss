import { useEffect, useState } from "react";
import JSZip from "jszip";
import QRCode from "qrcode";
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
  const [exporting, setExporting] = useState(false);

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

  async function handleExportQrs() {
    setExporting(true);
    setError("");
    try {
      const archive = new JSZip();
      await Promise.all(members.map(async (member) => {
        const qrUrl = await QRCode.toDataURL(`${window.location.origin}/verify/${member.id}`, {
          width: 480,
          margin: 2,
        });
        const qrImage = new Image();
        qrImage.src = qrUrl;
        await qrImage.decode();

        const canvas = document.createElement("canvas");
        canvas.width = 560;
        canvas.height = 590;
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#14213d";
        context.font = "bold 30px sans-serif";
        context.textAlign = "center";
        context.fillText(member.full_name, canvas.width / 2, 58, 520);
        context.drawImage(qrImage, 40, 90, 480, 480);

        const png = await new Promise((resolve, reject) => {
          canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PNG creation failed")), "image/png");
        });
        const safeName = member.full_name.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
        archive.file(`${safeName || "member"}-${member.id}.png`, png);
      }));

      const archiveBlob = await archive.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(archiveBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "nbss-member-qr-codes.zip";
      link.click();
      URL.revokeObjectURL(downloadUrl);
    } catch {
      setError("Couldn't export the QR codes. Please try again.");
    } finally {
      setExporting(false);
    }
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
          <div className="flex flex-wrap gap-2 self-start sm:self-auto">
            <button
              onClick={handleExportQrs}
              disabled={exporting || loading || members.length === 0}
              className="border border-brand text-brand hover:bg-brand-light disabled:opacity-50 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              {exporting ? "Preparing QR codes…" : "Export QR codes"}
            </button>
            <button
              onClick={() => setMode("add")}
              className="bg-brand hover:bg-brand-dark text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              + Add member
            </button>
          </div>
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

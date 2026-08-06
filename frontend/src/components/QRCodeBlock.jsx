import { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * Renders a QR code encoding `value`, with a download-as-PNG button.
 * Used to generate the code printed on a member's physical ID card,
 * linking to their public (no-login) verification page.
 */
export function QRCodeBlock({ value, filename = "qr-code.png", size = 200 }) {
  const [dataUrl, setDataUrl] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, { width: size, margin: 1 })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't generate QR code.");
      });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!dataUrl) return <p className="text-sm text-muted">Generating…</p>;

  return (
    <div className="flex flex-col items-center gap-2">
      <img src={dataUrl} alt="QR code" width={size} height={size} className="border border-gray-200 rounded" />
      <a
        href={dataUrl}
        download={filename}
        className="text-sm text-brand hover:text-brand-dark transition-colors"
      >
        Download PNG
      </a>
    </div>
  );
}

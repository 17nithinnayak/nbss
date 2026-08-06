export function OrgMasthead({ compact = false }) {
  const badgeSize = compact ? "w-10 h-10" : "w-16 h-16";

  return (
    <div className="flex items-center gap-3">
      {/* Placeholder for the real NBSS emblem — swap this div for an <img> once available */}
      <img src="/state.jpeg" className={`${badgeSize} rounded-full object-contain`} />
      <div>
        <p
          className={`font-display font-bold tracking-wide text-brand ${
            compact ? "text-sm" : "text-xl"
          }`}
        >
          NATIONAL BHARATH SEVAK SAMAJ/PFI
        </p>
        <p className={`text-muted ${compact ? "text-[10px]" : "text-xs"} tracking-wide`}>
          Registered under by the Government of India, Ministry of Consumer Affairs.
        </p>
      </div>
    </div>
  );
}

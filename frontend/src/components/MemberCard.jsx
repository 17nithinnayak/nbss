import { Link } from "react-router-dom";

export function MemberCard({ member }) {
  return (
    <Link
      to={`/members/${member.id}`}
      className="group bg-surface rounded-lg border-2 border-brand-light overflow-hidden hover:border-brand hover:shadow-md transition-all"
    >
      <div className="aspect-square bg-brand-light overflow-hidden">
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.full_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl font-display text-brand">
            {member.full_name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-4 border-t-2" style={{ borderColor: "rgba(255, 153, 51, 0.4)" }}>
        <h3 className="font-display text-base text-ink leading-snug">{member.full_name}</h3>
        <p className="text-sm text-saffron font-medium mt-0.5 uppercase tracking-wide">
          {member.title}
        </p>
      </div>
    </Link>
  );
}

const tones = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-sky-100 text-sky-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
  active: "bg-emerald-100 text-emerald-800",
  banned: "bg-rose-100 text-rose-800",
};

const StatusPill = ({ value }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
      tones[value] || "bg-slate-100 text-slate-700"
    }`}
  >
    {value}
  </span>
);

export default StatusPill;

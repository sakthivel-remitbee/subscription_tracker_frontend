"use client";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  icon?: React.ReactNode;
};

export default function Select({ value, onChange, options, icon }: Props) {
  return (
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
      <select
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg py-3 text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 transition-colors appearance-none ${icon ? "pl-9 pr-4" : "px-4"}`}
      >
        {options.map((o) => <option key={o} value={o} className="bg-[#0d0e1f]">{o}</option>)}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </span>
    </div>
  );
}
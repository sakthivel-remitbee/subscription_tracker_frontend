"use client";

type Props = {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  img?: string | null;
};

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-xl",
  xl: "h-[112px] w-[112px] text-[3rem] sm:h-24 sm:w-24 sm:text-3xl",
};

export default function Avatar({ name, color = "#6c47ff", size = "md", img }: Props) {
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div
      className={`${sizes[size]} rounded-xl flex items-center justify-center font-semibold text-white shrink-0 overflow-hidden`}
      style={!img ? { backgroundColor: color } : {}}
    >
      {img ? (
        <img src={img} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

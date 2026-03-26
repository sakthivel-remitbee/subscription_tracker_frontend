"use client";

type Props = {
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: any;
};

export default function Input({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}: Props) {
  return (
    <input name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-white 
      placeholder-gray-400 outline-none border border-white/10 focus:border-white/30"
    />
  );
}
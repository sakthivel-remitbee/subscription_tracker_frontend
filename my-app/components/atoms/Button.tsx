"use client";

type Props = {
  text: string;
  loading?: boolean;
};

export default function Button({ text, loading }: Props) {
  return (
    <button
      type="submit"
      className="w-full rounded-lg py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600"
    >
      {loading ? "Loading..." : text}
    </button>
  );
}
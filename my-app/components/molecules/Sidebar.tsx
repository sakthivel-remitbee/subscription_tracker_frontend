"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store";
import { logout, logoutUser } from "@/redux/userSlice";
import { ReactNode } from "react";

type NavItemConfig = {
  label: string;
  icon: ReactNode;
  path: string;
};

const iconClassName = "h-4 w-4 shrink-0";

const MENU: NavItemConfig[] = [
  {
    label: "Subscriptions",
    path: "/subscriptions",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M3 10h18" />
      </svg>
    ),
  },
  {
    label: "Calendar",
    path: "/calendar",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="2.5" />
        <path d="M8 2v4M16 2v4M3 10h18" />
      </svg>
    ),
  },
];

const ACCOUNT: NavItemConfig[] = [
  {
    label: "Profile",
    path: "/profile",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="8" r="4" />
      </svg>
    ),
  },
];
type Props = { onClose?: () => void };

export default function Sidebar({ onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  useSelector((state: RootState) => state.user);

  const NavItem = ({ label, icon, path }: NavItemConfig) => {
    const active = pathname === path;
    return (
      <button
        onClick={() => router.push(path)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? "bg-purple-600/20 text-purple-400 font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
      >
        <span className="flex items-center justify-center">{icon}</span>
        {label}
      </button>
    );
  };

  return (
    <aside className="w-[200px] shrink-0 h-screen sticky top-0 flex flex-col border-r border-white/5 bg-[#05061a] px-3 py-4">
      <div className="flex items-center justify-between px-2 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="font-semibold text-white text-sm">SubTrack</span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <p className="text-[10px] text-gray-600 uppercase tracking-widest px-2 mb-2">Menu</p>
      <nav className="flex flex-col gap-1 mb-6">
        {MENU.map((item) => <NavItem key={item.path} {...item} />)}
      </nav>

      <p className="text-[10px] text-gray-600 uppercase tracking-widest px-2 mb-2">Account</p>
      <nav className="flex flex-col gap-1">
        {ACCOUNT.map((item) => <NavItem key={item.path} {...item} />)}
      </nav>

      <div className="mt-auto">
        <button
          onClick={async () => {
            await dispatch(logoutUser()); 
            dispatch(logout());           
            router.push("/login");
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

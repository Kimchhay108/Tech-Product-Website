"use client";

import { useState, useEffect } from "react";
import {
    FiHome,
    FiGrid,
    FiPackage,
    FiLogOut,
    FiMenu,
    FiChevronDown,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { getAuth, logout } from "@/lib/auth";

export default function StaffLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    const [openProfile, setOpenProfile] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [auth] = useState(() => getAuth());

    // --- AUTH & REDIRECT LOGIC ---
    useEffect(() => {
        if (!auth) {
            router.replace("/profile");
            return;
        }
        const role = auth.user?.role;
        if (role !== "staff") {
            router.replace(role === "admin" ? "/admin" : "/user");
        }
    }, [auth, router]);

    const handleLogout = () => {
        logout();
        router.replace("/profile");
    };

    const isActive = (path) =>
        path === "/staff" ? pathname === "/staff" : pathname.startsWith(path);

    const role = auth?.user?.role;
    const isStaff = role === "staff";
    if (!isStaff) return null;

    return (
        <div className="flex min-h-screen">
            {/* MOBILE OVERLAY */}
            {openMenu && (
                <div
                    onClick={() => setOpenMenu(false)}
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-[#2E2E2E] to-[#1a1a1a] text-white p-5 flex flex-col shadow-2xl
                    transform transition-transform duration-300
                    ${openMenu ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                <div>
                    <div className="flex gap-3 items-center mb-8 pb-6 border-b border-gray-700">
                        <Image
                            src="/LogoOnlyWhite.png"
                            alt="Logo"
                            width={40}
                            height={50}
                            className="w-auto h-auto"
                        />
                        <div>
                            <h2 className="text-lg font-bold">Staff Dashboard</h2>
                            <p className="text-xs text-gray-400">Manage your tasks</p>
                        </div>
                    </div>

                    <nav>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                            Menu
                        </p>
                        <ul className="space-y-1">
                            {[
                                { href: "/staff", label: "Overview", icon: FiGrid },
                                { href: "/staff/products", label: "My Products", icon: FiPackage },
                            ].map(({ href, label, icon: Icon }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        onClick={() => setOpenMenu(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                            isActive(href)
                                                ? "bg-white/10 text-white shadow-lg"
                                                : "text-gray-300 hover:bg-white/5 hover:text-white"
                                        }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{label}</span>
                                        {isActive(href) && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-700">
                    <Link
                        href="/"
                        onClick={() => setOpenMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200"
                    >
                        <FiHome size={20} />
                        <span className="font-medium">Back to Store</span>
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col bg-gray-50 md:ml-64">
                {/* HEADER */}
                <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
                    <button
                        onClick={() => setOpenMenu((v) => !v)}
                        className="md:hidden text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    >
                        <FiMenu size={24} />
                    </button>

                    <div className="hidden md:flex items-center gap-2">
                        <div className="h-8 w-1 bg-[#2E2E2E] rounded-full"></div>
                        <div>
                            <h1 className="text-xl font-bold text-[#2E2E2E]">Welcome back, Staff</h1>
                            <p className="text-xs text-gray-500">Manage your products efficiently</p>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setOpenProfile((prev) => !prev)}
                            className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors border border-gray-200"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2E2E2E] to-gray-600 flex items-center justify-center text-white font-semibold text-sm">
                                S
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-gray-700">{auth.user?.name || "Staff"}</p>
                                <p className="text-xs text-gray-500">Staff Account</p>
                            </div>
                            <FiChevronDown size={16} className="text-gray-500" />
                        </button>

                        <div
                            className={`absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-lg border border-gray-200 py-2 z-50 transition-all duration-200 ease-out transform ${
                                openProfile
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-95 pointer-events-none"
                            }`}
                        >
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-700">Staff Account</p>
                                <p className="text-xs text-gray-500">{auth.user?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors mt-1"
                            >
                                <FiLogOut size={18} />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="p-6 flex-1">{children}</main>
            </div>
        </div>
    );
}

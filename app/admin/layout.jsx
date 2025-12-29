"use client";

import { useState, useEffect } from "react";
import {
    FiChevronRight,
    FiHome,
    FiGrid,
    FiList,
    FiPackage,
    FiUsers,
    FiLogOut,
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { CategoriesProvider } from "./context/CategoriesContext";
import { getAuth, logout } from "@/lib/auth";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    const [openProfile, setOpenProfile] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        if (!auth) {
            router.replace("/profile");
            return;
        }
        if (auth.user.role !== "admin") {
            router.replace("/");
        }
    }, [router]);

    const handleLogout = () => {
        logout(); // clear auth
        router.replace("/profile");
    };

    const isActive = (path) =>
        path === "/admin" ? pathname === "/admin" : pathname.startsWith(path);

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
                className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#2E2E2E] text-white p-5 flex flex-col
                    transform transition-transform duration-300
                    ${openMenu ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                <div>
                    <div className="flex gap-2 items-center mb-6">
                        <Image
                            src="/LogoOnlyWhite.png"
                            alt="Logo only"
                            width={40}
                            height={50}
                            className="w-auto h-auto"
                        />
                        <h2 className="text-xl font-bold">Admin Dashboard</h2>
                    </div>

                    <nav>
                        <ul className="space-y-2">
                            {[
                                { href: "/admin", label: "Overview", icon: FiGrid },
                                { href: "/admin/category", label: "Category", icon: FiList },
                                { href: "/admin/products", label: "Product", icon: FiPackage },
                                { href: "/admin/staff", label: "Staff", icon: FiUsers },
                            ].map(({ href, label, icon: Icon }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        onClick={() => setOpenMenu(false)}
                                        className={`flex justify-between items-center px-3 py-2 rounded-lg ${
                                            isActive(href)
                                                ? "bg-[#3A3A3A] text-white"
                                                : "hover:bg-[#4A4A4A]"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon size={20} />
                                            <span>{label}</span>
                                        </div>
                                        <FiChevronRight />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="mt-auto pt-4 border-t border-white">
                    <Link
                        href="/"
                        onClick={() => setOpenMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#4A4A4A] text-white"
                    >
                        <FiHome />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col bg-gray-100 md:ml-64">
                <header className="h-14 bg-white flex justify-end items-center px-6 shadow-sm">
                    <button
                        onClick={() => setOpenMenu((v) => !v)}
                        className="md:hidden mr-auto text-2xl"
                    >
                        ☰
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setOpenProfile((prev) => !prev)}
                            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded"
                        >
                            <FaUserCircle className="text-4xl text-gray-700" />
                        </button>

                        <div
                            className={`absolute right-0 mt-2 w-56 bg-white shadow-xl rounded z-50 transition-all duration-100 ease-out transform ${
                                openProfile
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-95 pointer-events-none"
                            }`}
                        >
                            <div className="flex items-center gap-3 border-gray-300 border-b p-3">
                                <FaUserCircle size={30} />
                                <p className="font-medium">{getAuth()?.user?.name || "Admin"}</p>
                            </div>
                            <div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                >
                                    <FiLogOut />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <CategoriesProvider>
                    <main className="p-4 flex-1">{children}</main>
                </CategoriesProvider>
            </div>
        </div>
    );
}

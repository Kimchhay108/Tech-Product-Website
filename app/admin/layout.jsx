"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { CategoriesProvider } from "./context/CategoriesContext";

export default function AdminLayout({ children }) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/");
    };

    const pathname = usePathname();

    const isActive = (path) => {
        if (path === "/admin") {
            return pathname === "/admin";
        }
        return pathname.startsWith(path);
    };

    //Profile modal

    const [openProfile, setOpenProfile] = useState(false);

    return (
        <>
            <div className="flex min-h-screen">
                {/* LEFT SIDEBAR */}
                <aside className="w-1/5 bg-[#2E2E2E] text-white p-5 flex flex-col">
                    <div>
                        <div className="flex gap-2 items-center mb-6">
                            <div>
                                <Image
                                    src="/LogoOnlyWhite.png"
                                    alt="Logo only"
                                    width={40}
                                    height={50}
                                    className="w-auto h-auto"
                                />
                            </div>
                            <h2 className="text-xl font-bold ">
                                Admin Dashboard
                            </h2>
                        </div>

                        <nav>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/admin"
                                        className={`flex justify-between items-center px-3 py-2 rounded-lg
                                        ${
                                            isActive("/admin")
                                                ? "bg-[#3A3A3A] text-white"
                                                : "hover:bg-[#4A4A4A]"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FiGrid size={20} />
                                            <span>Overview</span>
                                        </div>
                                        <FiChevronRight />
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        href="/admin/category"
                                        className={`flex justify-between items-center px-3 py-2 rounded-lg
                                        ${
                                            isActive("/admin/category")
                                                ? "bg-[#3A3A3A] text-white"
                                                : "hover:bg-[#4A4A4A]"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FiList size={20} />
                                            <span>Category</span>
                                        </div>
                                        <FiChevronRight />
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        href="/admin/products"
                                        className={`flex justify-between items-center px-3 py-2 rounded-lg
                                        ${
                                            isActive("/admin/products")
                                                ? "bg-[#3A3A3A] text-white"
                                                : "hover:bg-[#4A4A4A]"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FiPackage size={20} />
                                            <span>Product</span>
                                        </div>
                                        <FiChevronRight />
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        href="/admin/staff"
                                        className={`flex justify-between items-center px-3 py-2 rounded-lg
                                        ${
                                            isActive("/admin/staff")
                                                ? "bg-[#3A3A3A] text-white"
                                                : "hover:bg-[#4A4A4A]"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FiUsers size={20} />
                                            <span>Staff</span>
                                        </div>
                                        <FiChevronRight />
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Bottom home link */}
                    <div className="mt-auto pt-4 border-t border-white">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#4A4A4A] text-white"
                        >
                            <FiHome />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </aside>

                {/* RIGHT SIDE */}
                <div className="w-4/5 flex flex-col bg-gray-100">
                    {/* TOP HEADER */}
                    <header className="h-14 bg-white flex justify-end items-center px-6 shadow-sm">
                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setOpenProfile((prev) => !prev)}
                                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded"
                            >
                                <FaUserCircle className="text-4xl text-gray-700" />
                            </button>

                            <div
                                className={`
                                            absolute right-0 mt-2 w-56 bg-white shadow-xl rounded z-50 
                                            transition-all duration-100 ease-out transform
                                            ${
                                                openProfile
                                                    ? "opacity-100 scale-100"
                                                    : "opacity-0 scale-95 pointer-events-none"
                                            }`}
                            >
                                <div className="flex items-center gap-3 border-gray-300 border-b-1 p-3">
                                    <FaUserCircle size={30} />
                                    <p className="font-medium">Admin</p>
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

                    {/* PAGE CONTENT */}
                    <CategoriesProvider>
                        <main className="p-6 flex-1">{children}</main>
                    </CategoriesProvider>
                </div>
            </div>
        </>
    );
}

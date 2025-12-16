"use client";

import { FiChevronRight, FiHome, FiGrid, FiList, FiPackage, FiUsers } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

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

    return (
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
                        <h2 className="text-xl font-bold ">Admin Dashboard</h2>
                    </div>

                    <nav>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/admin"
                                    className={`flex justify-between items-center px-3 py-2 rounded-lg
                                        ${isActive("/admin") ? "bg-[#3A3A3A] text-white" : "hover:bg-[#4A4A4A]"}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <FiGrid size={20}/>
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
                                        <FiList size={20}/>
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
                                        <FiPackage size={20}/>
                                        <span>Product</span>
                                    </div>
                                    <FiChevronRight />
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/admin/users"
                                    className={`flex justify-between items-center px-3 py-2 rounded-lg
                                        ${
                                            isActive("/admin/users")
                                                ? "bg-[#3A3A3A] text-white"
                                                : "hover:bg-[#4A4A4A]"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <FiUsers size={20}/>
                                        <span>Users</span>
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
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded"
                    >
                        <FaUserCircle className="text-2xl text-gray-700" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </header>

                {/* PAGE CONTENT */}
                <main className="p-6 flex-1">{children}</main>
            </div>
        </div>
    );
}

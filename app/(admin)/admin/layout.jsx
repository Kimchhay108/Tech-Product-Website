import { FiChevronRight } from "react-icons/fi";
import Link from "next/link";

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            {/* LEFT SIDEBAR (20%) */}
            <aside className="w-1/5 bg-gray-900 text-white p-4">
                <h2 className="text-xl font-bold mb-6">Admin</h2>
                
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href="/admin/dashboard"
                                className="flex justify-between items-center px-3 py-2 rounded hover:bg-blue-900"
                            >
                                <span>Dashboard</span>
                                <FiChevronRight />
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/admin/users"
                                className="flex justify-between items-center px-3 py-2 rounded hover:bg-blue-900"
                            >
                                <span>Users</span>
                                <FiChevronRight />
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* RIGHT CONTENT (80%) */}
            <main className="w-4/5 bg-gray-100 p-6">{children}</main>
        </div>
    );
}

'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "admin") {
            router.push("/login"); // block access
        }
    }, []);

    return (
        <>
            <div className="w-full">
                <div>
                    <h1>Admin Dashboard</h1>
                </div>
            </div>
        </>
    );
}

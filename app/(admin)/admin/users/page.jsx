'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminUsers() {
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
                    <h1>Admin Users</h1>
                </div>
            </div>
        </>
    );
}

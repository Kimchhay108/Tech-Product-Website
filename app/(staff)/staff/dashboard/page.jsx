'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiChevronRight } from "react-icons/fi";

export default function StaffDashboard() {
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "staff") {
            router.push("/login"); // block access
        }
    }, []);

    return (
        <>
            <div className="w-full">
                <div>
                    <h1>Staff dashboard</h1>
                </div>
            </div>
        </>
    );
}

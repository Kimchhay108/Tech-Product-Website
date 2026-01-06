"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ClientWrapper({ children }) {
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <main>{children}</main>;
    }

    // Hide header/footer for admin or staff dashboards
    const isDashboardRoute =
        pathname?.startsWith("/admin") || pathname?.startsWith("/staff");

    return (
        <>
            {!isDashboardRoute && <Header />}
            <main>{children}</main>
            {!isDashboardRoute && <Footer />}
        </>
    );
}

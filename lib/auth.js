import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Auth() {
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
        router.push("/login"); // not logged in
        return;
        }

        if (user.role === "admin") {
        router.push("/admin");
        } else if (user.role === "staff") {
        router.push("/staff");
        } else {
        router.push("/user"); // regular user home
        }
    }, []);
}

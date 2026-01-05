"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, logout } from "@/lib/auth";
import { FiCpu } from "react-icons/fi";
import { auth as firebaseAuth } from "@/lib/firebaseConfig";
import { sendEmailVerification } from "firebase/auth";
import Login from "../auth/login/page";
import Register from "../auth/register/page";

export default function ProfilePage() {
    const [selectedAuth, setSelectedAuth] = useState("login");
    const [auth, setAuth] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [emailVerified, setEmailVerified] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const loadAuth = async () => {
            const authData = getAuth();
            
            // If localStorage has different user than Firebase, sign out from Firebase
            if (firebaseAuth.currentUser && authData?.user?.email && 
                firebaseAuth.currentUser.email !== authData.user.email) {
                try {
                    await firebaseAuth.signOut();
                } catch (err) {
                    console.log("Firebase signout error:", err);
                }
            }
            
            setAuth(authData);
            setIsLoading(false);

            if (authData?.user?.role === "admin") {
                router.replace("/admin");
            } else if (authData?.user?.role === "staff") {
                router.replace("/staff");
            } else if (authData?.user?.role === "user") {
                router.replace("/user");
            }

            // Check Firebase verification status (only if emails match)
            if (firebaseAuth.currentUser && authData?.user?.email === firebaseAuth.currentUser.email) {
                setEmailVerified(firebaseAuth.currentUser.emailVerified);
            }
        };

        loadAuth();

        // Listen for storage changes (when user logs in/out)
        const handleStorageChange = () => {
            loadAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('cart-reload', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cart-reload', handleStorageChange);
        };
    }, [router]);

    const handleLogout = () => {
        logout();
        setAuth(null);
        setSelectedAuth("login");
        
        // Trigger cart reload events
        window.dispatchEvent(new Event('cart-reload'));
        window.dispatchEvent(new Event('storage'));
    };

    const handleEditProfile = () => {
        router.push("/user/edit-profile");
    };

    const handleResendVerificationEmail = async () => {
        if (resendCooldown > 0) {
            alert(`Please wait ${resendCooldown} seconds before trying again`);
            return;
        }

        setResendLoading(true);
        try {
            if (firebaseAuth.currentUser) {
                await sendEmailVerification(firebaseAuth.currentUser);
                alert("Verification email sent! Check your inbox.");
                
                // Set cooldown of 60 seconds
                setResendCooldown(60);
                const interval = setInterval(() => {
                    setResendCooldown(prev => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        } catch (error) {
            const errorMessage = error.code === 'auth/too-many-requests'
                ? "Too many requests. Please wait a few minutes before trying again."
                : error.message;
            alert("Failed to send verification email: " + errorMessage);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <section className="md:min-h-screen container mx-auto">
            <div className="w-full my-2 flex p-3">
                <div className="w-full">
                    {/* Header */}
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                            Welcome to cyber <FiCpu size={20} />
                        </p>

                        <div className="flex gap-5 mb-5">
                            <button
                                onClick={() => setSelectedAuth("login")}
                                className={
                                    selectedAuth === "login"
                                        ? "border-b-2 font-bold"
                                        : ""
                                }
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setSelectedAuth("register")}
                                className={
                                    selectedAuth === "register"
                                        ? "border-b-2 font-bold"
                                        : ""
                                }
                            >
                                Register
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {selectedAuth === "login" && (
                        <Login setSelectedAuth={setSelectedAuth} setAuth={setAuth} />
                    )}
                    {selectedAuth === "register" && (
                        <Register setSelectedAuth={setSelectedAuth} setAuth={setAuth} />
                    )}
                </div>
            </div>
        </section>
    );
}

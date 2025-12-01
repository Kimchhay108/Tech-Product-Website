"use client";

import Image from "next/image";
import { FiMail, FiPhone, FiFacebook, FiInstagram, FiTwitter, FiLinkedin } from "react-icons/fi";
import LogoWhite from "../assets/LogoWhite.png"; // adjust path if needed

export default function Footer() {
    return (
        <footer className="bg-[var(--primary)] text-white py-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Logo / About */}
                <div className="space-y-4">
                    <Image src={LogoWhite} alt="logo" className="max-w-xs min-w-[120px] h-auto"/>
                    <p className="text-sm font-light leading-relaxed">
                        We are connecting you with technology that makes life easier.
                    </p>
                </div>

                {/* Categories */}
                <div>
                    <h2 className="text-base font-semibold mb-4">Categories</h2>
                    <ul className="space-y-2">
                        {["Laptops", "Desktops", "Phones", "Tablets", "Smart Watches", "Gaming"].map((item) => (
                        <li key={item}>
                            <a href="#" className="text-sm hover:font-bold transition-colors">
                                {item}
                            </a>
                        </li>
                        ))}
                    </ul>
                </div>

                {/* Social Links */}
                <div>
                    <h2 className="text-base font-semibold mb-4">Follow Us</h2>
                    <ul className="space-y-3">
                        {[
                        { icon: <FiFacebook />, label: "Facebook" },
                        { icon: <FiInstagram />, label: "Instagram" },
                        { icon: <FiTwitter />, label: "Twitter" },
                        { icon: <FiLinkedin />, label: "Linkedin" },
                        ].map(({ icon, label }) => (
                        <li key={label}>
                            <a
                            href="#"
                            className="flex items-center space-x-2 text-sm hover:font-bold transition-colors"
                            >
                                {icon}
                                <span>{label}</span>
                            </a>
                        </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h2 className="text-base font-semibold mb-4">Contact Us</h2>
                    <div className="flex items-center space-x-2 mb-2 text-sm">
                        <FiMail />
                        <span>rupp@gmail.edu.kh</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                        <FiPhone />
                        <span>(+885) 12 345 678</span>
                    </div>
                </div>

            </div>

            {/* Bottom note */}
            <div className="text-center text-sm mt-10 text-gray-400">
                &copy; {new Date().getFullYear()} Cyber. All rights reserved.
            </div>
        </footer>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    FiMenu,
    FiX,
    FiShoppingCart,
    FiUser,
    FiSearch,
    FiMonitor,
    FiSmartphone,
    FiTablet,
    FiWatch,
    FiHeadphones,
} from "react-icons/fi";
import { FaLaptop } from "react-icons/fa6";
import { getAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Header() {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    const router = useRouter();

    useEffect(() => {
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Failed to load categories", err));
    }, []);

    const handleProfileClick = () => {
        const auth = getAuth();

        if (!auth) {
            router.push("/profile");
            return;
        }

        const role = auth.user.role;
        if (role === "admin") router.push("/admin");
        else if (role === "staff") router.push("/staff");
        else router.push("/user");
    };

    // CATEGORY ICON MAP
    const categoryIcons = {
        laptop: FaLaptop,
        laptops: FaLaptop,
        desktop: FiMonitor,
        desktops: FiMonitor,
        phone: FiSmartphone,
        phones: FiSmartphone,
        tablet: FiTablet,
        tablets: FiTablet,
        watch: FiWatch,
        watches: FiWatch,
        gaming: FiHeadphones,
    };

    const DefaultIcon = FiMonitor;

    return (
        <header id="header" className="sticky top-0 z-50 shadow">
            {/* TOP HEADER */}
            <div className="bg-white w-full h-full mx-auto px-4 py-4 flex items-center justify-around">
                {/* Logo */}
                <Link href="/home">
                    <Image
                        src="/Logo.png"
                        alt="Logo"
                        width={120}
                        height={40}
                        className="max-w-xs min-w-[120px] h-auto"
                    />
                </Link>

                {/* Search Desktop */}
                <div className="hidden md:flex bg-gray-100 items-center rounded-lg w-full max-w-md mx-6">
                    <FiSearch
                        size={20}
                        className="ml-2 text-[var(--secondary)]"
                    />
                    <input
                        type="text"
                        placeholder="Search"
                        className="px-3 py-2 w-full bg-gray-100 focus:outline-none"
                    />
                </div>

                {/* Nav Desktop */}
                <nav className="hidden md:flex items-center space-x-10 text-[var(--secondary)]">
                    <ul className="flex space-x-8">
                        <li>
                            <Link href="/home" className="hover:text-black">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="#footer" className="hover:text-black">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#footer"
                                className="hover:text-black whitespace-nowrap"
                            >
                                Contact Us
                            </Link>
                        </li>
                    </ul>

                    <div className="flex items-center space-x-6">
                        <Link href="/cart" className="text-black">
                            <FiShoppingCart size={25} />
                        </Link>
                        <button
                            onClick={handleProfileClick}
                            className="text-black cursor-pointer"
                        >
                            <FiUser size={25} />
                        </button>
                    </div>
                </nav>

                {/* Mobile Icons */}
                <div className="md:hidden flex space-x-6">
                    <button className="text-3xl" onClick={() => setOpen(!open)}>
                        {open ? <FiX /> : <FiMenu />}
                    </button>

                    <div className="flex items-center space-x-6">
                        <Link href="/cart" className="text-black">
                            <FiShoppingCart size={25} />
                        </Link>
                        <button
                            onClick={handleProfileClick}
                            className="text-black cursor-pointer"
                        >
                            <FiUser size={25} />
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE DROPDOWN */}
            <div
                className={`
          md:hidden bg-white px-4 overflow-hidden
          transition-all duration-300
          ${
              open
                  ? "max-h-[500px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-3"
          }
        `}
            >
                {/* Search Mobile */}
                <div className="bg-gray-100 flex items-center rounded-lg">
                    <FiSearch
                        size={20}
                        className="ml-2 text-[var(--secondary)]"
                    />
                    <input
                        type="text"
                        placeholder="Search"
                        className="px-3 py-2 w-full bg-gray-100 focus:outline-none"
                    />
                </div>

                {/* Mobile Categories */}
                <ul className="py-4 space-y-3 text-[var(--secondary)]">
                    {categories.map((cat) => (
                        <li key={cat._id}>
                            <Link
                                href={`/products?category=${cat.slug}`}
                                className="block text-black"
                            >
                                {cat.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* CATEGORY BAR DESKTOP */}
            <div className="hidden md:block bg-[var(--accent)] py-2 overflow-hidden">
                <ul className="flex justify-center items-center space-x-14 text-lg">
                    {categories.map((cat) => {
                        const key = cat.name.toLowerCase();
                        const Icon = categoryIcons[key] || DefaultIcon;

                        return (
                            <li key={cat._id}>
                                <Link
                                    href={`/products?category=${cat.slug}`}
                                    className="flex items-center space-x-2 text-[var(--secondary)] hover:font-bold whitespace-nowrap"
                                >
                                    <Icon size={20} />
                                    <span>{cat.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </header>
    );
}

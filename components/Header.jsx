"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMenu, FiX, FiShoppingCart, FiUser, FiSearch } from "react-icons/fi";
import { FaLaptop } from "react-icons/fa6";
import {
    FiMonitor,
    FiSmartphone,
    FiTablet,
    FiWatch,
    FiHeadphones,
    } from "react-icons/fi";
import Logo from "../assets/Logo.png"; // Keep this path correct relative to your app folder

export default function Header() {
    const [open, setOpen] = useState(false);


    return (
        <header id="header" className="sticky top-0 z-50 shadow">
            {/* TOP HEADER */}
            <div className="bg-white w-full h-full mx-auto px-4 py-4 flex items-center justify-around">

                {/* Logo */}
                <Link href="/home">
                    <Image src={Logo} alt="logo" className="max-w-xs min-w-[120px] h-auto"/>
                </Link>

                {/* Search (Desktop) */}
                <div className="hidden md:flex bg-gray-100 items-center rounded-lg w-full max-w-md mx-6">
                    <FiSearch size={20} className="ml-2 text-[var(--secondary)]" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="px-3 py-2 w-full bg-gray-100 focus:outline-none"
                    />
                </div>

                {/* Nav + Icons (Desktop) */}
                <nav className="hidden md:flex items-center space-x-10 text-[var(--secondary)]">
                    <ul className="flex space-x-8">
                        <li><a href="/home" className="hover:text-black">Home</a></li>
                        <li><a href="#footer" className="hover:text-black">About</a></li>
                        <li><a href="#footer" className="hover:text-black whitespace-nowrap">Contact Us</a></li>
                    </ul>
                    <div className="flex items-center space-x-6">
                        <a href="/shoppingCart" className="text-black">
                            <FiShoppingCart size={25} />
                        </a>
                        <Link href="#" className="text-black">
                            <FiUser size={25} />
                        </Link>
                    </div>
                </nav>

                {/* Nav + Icons (Mobile) */}
                <div className="md:hidden flex space-x-6">
                    <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
                        {open ? <FiX /> : <FiMenu />}
                    </button>

                    <div className="md:hidden flex items-center space-x-6">
                        <a href="/shoppingCart" className="text-black">
                            <FiShoppingCart size={25} />
                        </a>
                        <Link href="#" className="text-black">
                            <FiUser size={25} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* MOBILE DROPDOWN */}
            <div
                className={`
                md:hidden bg-white px-4 overflow-hidden
                transition-all duration-300
                ${open ? "max-h-[500px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-3"}
                `}
            >
                {/* Search Mobile */}
                <div className="bg-gray-100 flex items-center rounded-lg">
                    <FiSearch size={20} className="ml-2 text-[var(--secondary)]" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="px-3 py-2 w-full bg-gray-100 focus:outline-none"
                    />
                </div>

                {/* Mobile Links */}
                <ul className=" py-4 space-y-3 text-[var(--secondary)]">
                    <li><a href="/productpage" className="block text-black">Laptops</a></li>
                    <li><a href="/productpage" className="block text-black">Desktops</a></li>
                    <li><a href="/productpage" className="block text-black">Phones</a></li>
                    <li><a href="/productpage" className="block text-black">Tablets</a></li>
                    <li><a href="/productpage" className="block text-black">Smart Watches</a></li>
                    <li><a href="/productpage" className="block text-black">Gaming</a></li>
                    <li><a href="/productpage" className="block text-black">About Us</a></li>
                </ul>
            </div>

            {/* CATEGORY BAR */}
            <div className="hidden md:block bg-[var(--accent)] py-2 overflow-hidden">
                <ul className="flex justify-center items-center space-x-14 text-lg">
                    <li>
                        <a href="/productpage" className="flex items-center space-x-2 text-[var(--secondary)] hover:font-bold">
                            <FaLaptop size={20} />
                            <span>Laptops</span>
                        </a>
                    </li>
                    <li>
                        <a href="/productpage" className="flex items-center space-x-2 text-[var(--secondary)] hover:font-bold">
                            <FiMonitor size={20} />
                            <span>Desktops</span>
                        </a>
                    </li>
                    <li>
                        <a href="/productpage" className="flex items-center space-x-2 text-[var(--secondary)] hover:font-bold">
                            <FiSmartphone size={20} />
                            <span>Phones</span>
                        </a>
                    </li>
                    <li>
                        <a href="/productpage" className="flex items-center space-x-2 text-[var(--secondary)] hover:font-bold">
                            <FiTablet size={20} />
                            <span>Tablets</span>
                        </a>
                    </li>
                    <li>
                        <a href="/productpage" className="flex items-center space-x-2 text-[var(--secondary)] hover:font-bold whitespace-nowrap">
                            <FiWatch size={20}/>
                            <span>Smart Watches</span>
                        </a>
                    </li>
                    <li>
                        <a href="/productpage" className="flex items-center space-x-2 text-[var(--secondary)] hover:font-bold">
                            <FiHeadphones size={20} />
                            <span>Gaming</span>
                        </a>
                    </li>
                </ul>
            </div>
        </header>
    );
}

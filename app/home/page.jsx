"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

import { FaLaptop } from "react-icons/fa6";
import {
    FiMonitor,
    FiSmartphone,
    FiTablet,
    FiWatch,
    FiHeadphones,
    FiPhone,
    FiHeart,
    FiShoppingCart,
    FiEye,
    FiStar,
} from "react-icons/fi";

export default function HomePage() {
    const router = useRouter();

    const goToProducts = () => {
        router.push("/products");
    };

    const goToProductDetail = () => {
        router.push("/productDetail");
    };

    // ===== CATEGORY =====
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Failed to load categories", err));
    }, []);

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

    const defaultIcon = FiMonitor;
    // ==================

    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState("newArrival");
    const [hoveredProduct, setHoveredProduct] = useState(null);

    useEffect(() => {
        let url = `/api/products?${activeTab}=true`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error(err));
    }, [activeTab]);

    return (
        <>
            {/* Hero Section */}
            <section className="bg-[#211C24]">
                <div className="container mx-auto px-5 sm:px-10 flex flex-col md:flex-row md:items-end ">
                    {/* Text / Left side */}
                    <div className="md:w-1/2 flex flex-col justify-center md:justify-start py-20 md:py-40 mx-10 text-center md:text-start">
                        <h1 className="text-[var(--secondary)] text-xl mt-3">
                            Pro.Beyond.
                        </h1>
                        <h1 className="text-white my-2 text-6xl">
                            IPhone 14 <b>Pro</b>
                        </h1>
                        <p className="text-[var(--secondary)] text-md">
                            Created to change everything for the better. For
                            everyone
                        </p>
                        <div>
                            <button
                                onClick={goToProducts}
                                className="text-white border border-white rounded-md py-3 px-10 my-3 cursor-pointer hover:bg-white hover:text-[#211C24] transition-all duration-300 font-medium"
                            >
                                Shop Now
                            </button>
                        </div>
                    </div>

                    {/* Image / Right side */}
                    <div className="md:w-1/2 flex h-full justify-center md:justify-center">
                        <Image
                            src="/home/IphoneImage.png"
                            alt="iphone 14 pro"
                            width={1440}
                            height={632}
                            className="w-64 h-auto md:w-84"
                        />
                    </div>
                </div>
            </section>

            {/* Display Section */}
            <section className="bg-white">
                <div className="max-w-8xl mx-auto flex flex-col md:flex-row">
                    {/* Left side */}
                    <div className="md:w-1/2 grid grid-cols-1 md:grid-cols-2 ">
                        {/* Ps5 */}
                        <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center justify-center bg-white h-[600px] md:h-[300px]">
                            <div className="w-full md:w-1/2 flex items-end justify-center">
                                <Image
                                    src="/home/Ps5.png"
                                    alt="Ps5"
                                    width={600}
                                    height={600}
                                    className="w-110 md:w-full h-full object-contain"
                                />
                            </div>
                            <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-start py-5 px-4">
                                <h1 className="text-xl sm:text-4xl md:text-3xl lg:text-5xl font-bold py-3">
                                    Playstation 5
                                </h1>
                                <p className="text-[var(--secondary)] text-base sm:text-base md:text-sm lg:text-base">
                                    Incredibly powerful CPUs, GPUs, and an SSD
                                    with integrated I/O will redefine your
                                    PlayStation experience.
                                </p>
                            </div>
                        </div>

                        {/* Airpods */}
                        <div className="flex flex-col md:flex-row items-center justify-center bg-[#EDEDED] py-10 md:py-0">
                            <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end md:overflow-hidden">
                                <Image
                                    src="/home/Airpods.png"
                                    alt="Airpods"
                                    width={600}
                                    height={600}
                                    className="w-64 sm:w-80 md:max-w-md lg:max-w-lg h-auto object-contain md:me-5"
                                />
                            </div>
                            <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-start py-5 px-4">
                                <h1 className="text-xl sm:text-3xl md:text-2xl lg:text-3xl font-semibold">
                                    Apple AirPods Max
                                </h1>
                                <p className="text-[var(--secondary)] text-base sm:text-base md:text-sm lg:text-base">
                                    Computational audio. Listen, it&apos;s powerful.
                                </p>
                            </div>
                        </div>

                        {/* Macbook Pro */}
                        <div className="flex flex-col md:flex-row items-center justify-center bg-[#353535] py-10 md:py-0">
                            <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end md:overflow-hidden">
                                <Image
                                    src="/home/MacbookPro.png"
                                    alt="MacbookPro"
                                    width={600}
                                    height={600}
                                    className="w-64 sm:w-80 md:max-w-md lg:max-w-lg h-auto object-contain md:me-5"
                                />
                            </div>
                            <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-start py-5 px-4">
                                <h1 className="text-white text-xl sm:text-3xl md:text-2xl lg:text-3xl font-semibold">
                                    Apple Macbook Pro
                                </h1>
                                <p className="text-[var(--secondary)] text-base sm:text-base md:text-sm lg:text-base">
                                    Great ideas start on Mac
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="md:w-1/2 bg-[#EDEDED]">
                        <div className="w-full h-full flex flex-col md:flex-row justify-center items-center py-10">
                            <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start pl-10">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                                    Vision <b>Pro</b>
                                </h1>
                                <p className="text-[var(--secondary)] text-base sm:text-base md:text-sm lg:text-base py-3">
                                    An immersive way to experience entertainment
                                </p>
                                <button
                                    onClick={goToProducts}
                                    className="text-sm sm:text-base md:text-lg lg:text-xl text-black border border-black rounded-lg py-3 px-9 my-3 hidden md:block hover:bg-black hover:text-white transition-all duration-300 font-medium cursor-pointer"
                                >
                                    Shop Now
                                </button>
                            </div>
                            <div className="w-full md:w-1/2 flex items-center justify-center py-3">
                                <Image
                                    src="/home/Vision.png"
                                    alt="Vision"
                                    width={600}
                                    height={600}
                                    className="w-72 md:w-full h-auto object-contain"
                                />
                            </div>
                            <button
                                onClick={goToProducts}
                                className="text-sm sm:text-base md:text-lg lg:text-xl text-black border border-black rounded-lg py-3 px-9 my-3 md:hidden hover:bg-black hover:text-white transition-all duration-300 font-medium cursor-pointer"
                            >
                                Shop Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Browse By Category */}
            <section className="bg-[#FAFAFA] px-5">
                <div className="max-w-7xl mx-auto py-15">
                    <h1 className="text-2xl md:text-3xl font-bold mb-10 text-center md:text-left">
                        Browse By Category
                    </h1>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-10">
                        {categories.map((cat) => {
                            const key = cat.name.toLowerCase();
                            const Icon = categoryIcons[key] || defaultIcon;

                            return (
                                <Link
                                    key={cat._id}
                                    href={`/products?category=${cat.slug}`}
                                >
                                    <div className="bg-[#EDEDED] p-8 rounded shadow flex flex-col justify-center items-center cursor-pointer">
                                        <Icon size={40} />
                                        <p className="text-base md:text-lg lg:text-lg font-bold mt-2 whitespace-nowrap">
                                            {cat.name}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* New Arrivals & Products Grid - REDESIGNED */}
            <section className="px-3 bg-white">
                <div className="max-w-7xl mx-auto py-15">
                    {/* Header Tabs */}
                    <div className="flex space-x-7 justify-center md:justify-start items-center text-start text-lg mb-8">
                        <p
                            className={`cursor-pointer relative pb-1 transition-colors ${
                                activeTab === "newArrival"
                                    ? "text-black font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black after:origin-center after:animate-underlineGrow"
                                    : "text-[#8B8B8B] hover:text-black"
                            }`}
                            onClick={() => setActiveTab("newArrival")}
                        >
                            New Arrival
                        </p>
                        <p
                            className={`cursor-pointer relative pb-1 transition-colors ${
                                activeTab === "bestSeller"
                                    ? "text-black font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black after:origin-center after:animate-underlineGrow"
                                    : "text-[#8B8B8B] hover:text-black"
                            }`}
                            onClick={() => setActiveTab("bestSeller")}
                        >
                            BestSeller
                        </p>
                        <p
                            className={`cursor-pointer relative pb-1 transition-colors ${
                                activeTab === "specialOffer"
                                    ? "text-black font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black after:origin-center after:animate-underlineGrow"
                                    : "text-[#8B8B8B] hover:text-black"
                            }`}
                            onClick={() => setActiveTab("specialOffer")}
                        >
                            Special Offers
                        </p>
                    </div>

                    {/* Product Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div
                                    key={product._id}
                                    className="group relative bg-white border border-gray-200 shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-300 flex flex-col h-full cursor-pointer"
                                    onMouseEnter={() => setHoveredProduct(product._id)}
                                    onMouseLeave={() => setHoveredProduct(null)}
                                    onClick={() => router.push(`/productDetail/${product._id}`)}
                                >
                                    

                                    {/* Image Container */}
                                    <div className="relative bg-white p-6 aspect-square flex items-center justify-center overflow-hidden">
                                        <Image
                                            src={product.images?.[0] || "/placeholder.png"}
                                            alt={product.name}
                                            width={600}
                                            height={600}
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4 flex flex-col flex-grow bg-white">
                                        {/* Product Name */}
                                        <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-gray-700 transition-colors">
                                            {product.name}
                                        </h3>
                                        
                                        {/* Price Section */}
                                        <div className="flex items-baseline gap-2 mb-4 mt-auto">
                                            <span className="text-xl md:text-2xl font-bold text-gray-900">
                                                ${product.price}
                                            </span>
                                            {activeTab === "specialOffer" && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    ${(product.price * 1.25).toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button
                                            className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/productDetail/${product._id}`);
                                            }}
                                        >
                                            <FiShoppingCart size={16} />
                                            <span>Add to Cart</span>
                                        </button>
                                    </div>  
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg font-medium">Coming soon!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section>
                <div className="flex flex-col md:flex-row w-full">
                    {/* Featured Product 1 */}
                    <div className="bg-[#FFFFFF] md:w-1/4 p-5 flex flex-col justify-between space-y-10">
                        <div>
                            <Image
                                src="/home/Ip14prm.png"
                                width={600}
                                height={600}
                                alt="Apple iPhone 14 Pro Max"
                                className="max-w-full max-h-84 mx-auto object-contain"
                            />
                        </div>
                        <div className="text-center md:text-start py-5">
                            <h1 className="text-2xl">
                                Apple iPhone 14 Pro Max
                            </h1>
                            <h1 className="text-xs text-[#909090] my-3">
                                Think different, everything different.
                            </h1>
                            <button
                                className="border border-black px-8 py-3 font-semibold rounded-md cursor-pointer hover:bg-[#2C2C2C] hover:text-white transition-all duration-300"
                                onClick={goToProducts}
                            >
                                Shop Now
                            </button>
                        </div>
                    </div>

                    {/* Featured Product 2 */}
                    <div className="bg-[#F9F9F9] md:w-1/4 p-5 flex flex-col justify-between space-y-10">
                        <div>
                            <Image
                                src="/home/Ipad.png"
                                width={600}
                                height={600}
                                alt="Ipad Pro"
                                className="max-w-full max-h-84 mx-auto object-contain"
                            />
                        </div>
                        <div className="text-center md:text-start py-5">
                            <h1 className="text-2xl">Ipad Pro</h1>
                            <h1 className="text-xs text-[#909090] my-3">
                                iPad combines a magnificent 10.2-inch Retina
                                display, incredible performance, multitasking
                                and ease of use.
                            </h1>
                            <button
                                className="border border-black px-8 py-3 font-semibold rounded-md cursor-pointer hover:bg-[#2C2C2C] hover:text-white transition-all duration-300"
                                onClick={goToProducts}
                            >
                                Shop Now
                            </button>
                        </div>
                    </div>

                    {/* Featured Product 3 */}
                    <div className="bg-[#EAEAEA] md:w-1/4 p-5 flex flex-col justify-between space-y-10">
                        <div>
                            <Image
                                src="/home/Watches.png"
                                width={600}
                                height={600}
                                alt="Apple Watch Series 9"
                                className="max-w-full max-h-84 mx-auto object-contain"
                            />
                        </div>
                        <div className="text-center md:text-start py-5">
                            <h1 className="text-2xl">Apple Watch Series 9</h1>
                            <h1 className="text-xs text-[#909090] my-3">
                                Introducing Apple Watch Series 9
                            </h1>
                            <button
                                className="border border-black px-8 py-3 font-semibold rounded-md cursor-pointer hover:bg-[#2C2C2C] hover:text-white transition-all duration-300"
                                onClick={goToProducts}
                            >
                                Shop Now
                            </button>
                        </div>
                    </div>

                    {/* Featured Product 4 */}
                    <div className="bg-[#2C2C2C] md:w-1/4 p-5 flex flex-col justify-between space-y-10">
                        <div>
                            <Image
                                src="/home/ZFold.png"
                                width={800}
                                height={800}
                                alt="Galaxy Z Fold5"
                                className="max-w-full max-h-84 mx-auto object-contain"
                            />
                        </div>
                        <div className="text-center md:text-start py-5">
                            <h1 className="text-white text-2xl">
                                Galaxy Z Fold5
                            </h1>
                            <h1 className="text-xs text-[#909090] my-3">
                                Join the flip side
                            </h1>
                            <button
                                className="border border-white text-white px-8 py-3 font-semibold rounded-md cursor-pointer hover:bg-white hover:text-[#2C2C2C] transition-all duration-300"
                                onClick={goToProducts}
                            >
                                Shop Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
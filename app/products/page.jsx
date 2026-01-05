"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import {
    FiChevronDown,
    FiChevronRight,
    FiChevronLeft,
    FiGrid,
    FiList,
    FiHeart,
    FiShoppingCart,
    FiStar,
    FiEye,
} from "react-icons/fi";

export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get("category");

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filter, setFilter] = useState("");
    const [products, setProducts] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const [hoveredProduct, setHoveredProduct] = useState(null);

    const sortedProducts = [...products].sort((a, b) => {
        if (filter === "low-to-high") return a.price - b.price;
        if (filter === "high-to-low") return b.price - a.price;
        if (filter === "name-az") return a.name.localeCompare(b.name);
        if (filter === "name-za") return b.name.localeCompare(a.name);
        return 0;
    });

    useEffect(() => {
        const loadProducts = async () => {
            try {
                let url = "/api/products";
                if (category) {
                    url += `?category=${category.toLowerCase()}`;
                }

                const res = await fetch(url);
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load products:", err);
                setProducts([]);
            }
        };

        loadProducts();
    }, [category]);

    return (
        <section className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="  p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        {/* Breadcrumb & Title */}
                        <div>
                            <nav className="hidden sm:flex items-center space-x-2  text-gray-500 mb-2">
                                <Link href="/products" className="hover:text-black transition-colors">
                                    Category
                                </Link>
                                <FiChevronRight size={14} />
                                {category && (
                                    <>
                                        
                                        <span className="text-black font-medium">
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </span>
                                    </>
                                )}
                            </nav>
                            
                        </div>

                        {/* Filter & View Controls */}
                        <div className="flex items-center gap-3">
                            {/* View Toggle */}
                            <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-all ${
                                        viewMode === "grid"
                                            ? "bg-white text-black shadow-sm"
                                            : "text-gray-600 hover:text-black"
                                    }`}
                                >
                                    <FiGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-all ${
                                        viewMode === "list"
                                            ? "bg-white text-black shadow-sm"
                                            : "text-gray-600 hover:text-black"
                                    }`}
                                >
                                    <FiList size={18} />
                                </button>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative inline-block w-56">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-full rounded-lg border-2 border-gray-200 p-3 bg-white text-sm shadow-md flex justify-between items-center hover:border-gray-300 transition-all"
                                >
                                    <span className="font-medium">
                                        {filter === "low-to-high"
                                            ? "Price: Low → High"
                                            : filter === "high-to-low"
                                            ? "Price: High → Low"
                                            : filter === "name-az"
                                            ? "Name: A → Z"
                                            : filter === "name-za"
                                            ? "Name: Z → A"
                                            : "Filter By"}
                                    </span>
                                    <FiChevronDown
                                        size={18}
                                        className={`transform transition-transform duration-200 ${
                                            dropdownOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                <div
                                    className={`absolute right-0 mt-2 w-full rounded-lg bg-white shadow-lg border border-gray-200 z-10 origin-top transition-all duration-200 ${
                                        dropdownOpen
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-95 pointer-events-none"
                                    }`}
                                >
                                    {[
                                        { value: "low-to-high", label: "Price: Low → High" },
                                        { value: "high-to-low", label: "Price: High → Low" },
                                        { value: "name-az", label: "Name: A → Z" },
                                        { value: "name-za", label: "Name: Z → A" },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                                            onClick={() => {
                                                setFilter(option.value);
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid/List */}
                {sortedProducts.length > 0 ? (
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                                : "flex flex-col gap-4"
                        }
                    >
                        {sortedProducts.map((product) => (
                            <div
                                key={product._id}
                                className={`group relative bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-300 ${
                                    viewMode === "list" ? "flex" : "flex flex-col"
                                }`}
                                onMouseEnter={() => setHoveredProduct(product._id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                            >
                                {viewMode === "grid" ? (
                                    // Grid View
                                    <>
                                        
                                        

                                        {/* Image */}
                                        <div
                                            className="relative bg-gray-50 p-6 aspect-square flex items-center justify-center overflow-hidden cursor-pointer"
                                            onClick={() => router.push(`/productDetail/${product._id}`)}
                                        >
                                            <Image
                                                src={product.images?.[0] || "/placeholder.png"}
                                                alt={product.name}
                                                width={400}
                                                height={400}
                                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h2
                                                className="text-sm md:text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-blue-600 transition-colors"
                                                onClick={() => router.push(`/productDetail/${product._id}`)}
                                            >
                                                {product.name}
                                            </h2>

                                           

                                            {/* Price */}
                                            <div className="flex items-baseline gap-2 mb-4 mt-auto">
                                                <span className="text-xl md:text-2xl font-bold text-gray-900">
                                                    ${product.price}
                                                </span>
                                            </div>

                                            {/* Button */}
                                            <button
                                                className="w-full bg-black text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-gray-800 active:scale-95 flex items-center justify-center gap-2 text-sm"
                                                onClick={() => router.push(`/productDetail/${product._id}`)}
                                            >
                                                <FiShoppingCart size={16} />
                                                <span>Add to Cart</span>
                                            </button>
                                        </div>

                                        {/* Hover Border */}
                                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-400 rounded-xl pointer-events-none transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                                    </>
                                ) : (
                                    // List View
                                    <>
                                        <div
                                            className="w-48 shrink-0 bg-gray-50 p-6 flex items-center justify-center cursor-pointer"
                                            onClick={() => router.push(`/productDetail/${product._id}`)}
                                        >
                                            <Image
                                                src={product.images?.[0] || "/placeholder.png"}
                                                alt={product.name}
                                                width={200}
                                                height={200}
                                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>

                                        <div className="flex-1 p-6 flex flex-col justify-between">
                                            <div>
                                                <h2
                                                    className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                                                    onClick={() => router.push(`/productDetail/${product._id}`)}
                                                >
                                                    {product.name}
                                                </h2>

                                                

                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {product.description || "High-quality product with excellent features and performance."}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-3xl font-bold text-gray-900">
                                                    ${product.price}
                                                </span>

                                                <button
                                                    className="bg-black text-white py-3 px-8 rounded-lg font-medium transition-all duration-300 hover:bg-gray-800 active:scale-95 flex items-center gap-2"
                                                    onClick={() => router.push(`/productDetail/${product._id}`)}
                                                >
                                                    <FiShoppingCart size={18} />
                                                    <span>Add to Cart</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiGrid size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-6">
                            Try adjusting your filters or browse other categories
                        </p>
                        <Link
                            href="/products"
                            className="inline-block px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
                        >
                            View All Products
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {sortedProducts.length > 0 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button className="p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            <FiChevronLeft size={20} />
                        </button>
                        <button className="px-5 py-3 rounded-lg bg-black text-white font-medium">
                            1
                        </button>
                        <button className="px-5 py-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                            2
                        </button>
                        <button className="px-5 py-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                            3
                        </button>
                        <button className="p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
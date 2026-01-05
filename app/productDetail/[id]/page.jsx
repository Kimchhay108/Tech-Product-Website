"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartDispatch, CartActions } from "../../context/CartContext";

import { FiChevronRight, FiHeart, FiShare2, FiCheck, FiTruck, FiShield, FiCreditCard, FiStar } from "react-icons/fi";

export default function ProductsDetail() {
    const { id: productId } = useParams();
    const router = useRouter();
    const dispatch = useCartDispatch();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bigImage, setBigImage] = useState(null);

    const colors = ["#000000", "#E8E8E8", "#781DBC", "#E1B000"];
    const [selectedColor, setSelectedColor] = useState(colors[0]);

    const memories = ["128GB", "256GB", "512GB", "1TB"];
    const [selectedMemory, setSelectedMemory] = useState(memories[0]);

    const [quantity, setQuantity] = useState(1);
    const increase = () => setQuantity((prev) => prev + 1);
    const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${productId}`, {
                    cache: "no-store",
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || "Failed to fetch product"
                    );
                }
                const data = await res.json();
                setProduct(data);
                setBigImage(data.images?.[0] || null);
            } catch (err) {
                console.error(err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        if (productId) fetchProduct();
    }, [productId]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
    );
    
    if (!product)
        return (
            <div className="text-center mt-20">
                <p className="text-xl text-gray-600">Product not found.</p>
            </div>
        );

    const categoryLabel =
        product?.category?.name || product?.categoryLabel || "Products";
    const categoryParam = encodeURIComponent(categoryLabel);

    const productFirstWord = (product?.name || "Product").split(" ")[0];

    const images = product.images || [];
    const phoneDetails = product.details || [];
    const description = product.description || "No description available.";

    const colorNames = {
        "#000000": "Space Black",
        "#E8E8E8": "Silver",
        "#781DBC": "Deep Purple",
        "#E1B000": "Gold"
    };

    return (
        <section className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <nav className="hidden sm:flex items-center space-x-2 my-4 pb-4">
                    <Link href="/products" className="text-gray-500 hover:text-gray-900 transition-colors">
                        Category
                    </Link>
                    <FiChevronRight size={16} className="text-gray-400" />
                    <Link
                        href={`/products?category=${categoryParam}`}
                        className="text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        {categoryLabel}
                    </Link>
                    <FiChevronRight size={16} className="text-gray-400" />
                    <span className="text-gray-900 font-medium">{productFirstWord}</span>
                </nav>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
                        {/* Left Side - Images */}
                        <div className="flex flex-col-reverse md:flex-row gap-4">
                            {/* Thumbnail Images */}
                            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setBigImage(img)}
                                        className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                                            bigImage === img
                                                ? "border-black shadow-sm"
                                                : "border-gray-200 hover:border-gray-400"
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} view ${index + 1}`}
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 relative rounded-2xl overflow-hidden group">
                                <div className="aspect-square flex items-center justify-center p-4">
                                    <Image
                                        src={bigImage}
                                        alt={product.name}
                                        width={600}
                                        height={600}
                                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                
                                
                            </div>
                        </div>

                        {/* Right Side - Product Info */}
                        <div className="flex flex-col space-y-6">
                            {/* Product Title & Rating */}
                            <div>
                                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
                                    {product.name}
                                </h1>       
                            </div>

                            {/* Price */}
                            <div className="border-y border-gray-200 py-4">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-gray-900">
                                        ${product.price}
                                    </span>
                                    <span className="text-xl text-gray-400 line-through">
                                        ${(product.price * 1.15).toFixed(2)}
                                    </span>
                                  
                                </div>
                                
                            </div>

                            {/* Color Selection */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className=" font-semibold text-gray-900">
                                        Color: <span className="font-normal text-gray-600">{colorNames[selectedColor]}</span>
                                    </label>
                                </div>
                                <div className="flex gap-3">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                                                selectedColor === color
                                                    ? "border-black ring-2 ring-offset-2 ring-black"
                                                    : "border-gray-300 hover:border-gray-400"
                                            }`}
                                            style={{ backgroundColor: color }}
                                        >
                                            {selectedColor === color && (
                                                <FiCheck 
                                                    className={`absolute inset-0 m-auto ${
                                                        color === "#000000" ? "text-white" : "text-gray-900"
                                                    }`} 
                                                    size={20} 
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Storage Selection */}
                            <div>
                                <label className=" font-semibold text-gray-900 mb-3 block">
                                    Storage Capacity
                                </label>
                                <div className="grid grid-cols-4 gap-3">
                                    {memories.map((memory) => (
                                        <button
                                            key={memory}
                                            onClick={() => setSelectedMemory(memory)}
                                            className={`py-3 px-4 rounded-lg text-sm font-medium text-center border-2 transition-all ${
                                                selectedMemory === memory
                                                    ? "border-black bg-black text-white"
                                                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                                            }`}
                                        >
                                            {memory}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="rounded-lg">
                                <p className="py-2 font-semibold">Description:</p>
                                <p className="text-sm text-gray-700">{description}</p>
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="space-y-4 pt-2">
                                <div>
                                    <label className=" font-semibold text-gray-900 mb-2 block">
                                        Quantity
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                                            <button
                                                onClick={decrease}
                                                className="px-5 py-3 text-xl font-semibold bg-gray-50 hover:bg-gray-100 transition-colors"
                                            >
                                                −
                                            </button>
                                            <span className="px-8 py-3 text-lg font-semibold bg-white min-w-[80px] text-center">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={increase}
                                                className="px-5 py-3 text-xl font-semibold bg-gray-50 hover:bg-gray-100 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="w-full py-4 bg-black text-white font-semibold rounded-xl shadow-md hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                                    onClick={() => {
                                        dispatch({
                                            type: CartActions.ADD,
                                            payload: {
                                                cartItemId: Date.now(),
                                                productId: product._id,
                                                name: product.name,
                                                price: product.price,
                                                color: selectedColor,
                                                memory: selectedMemory,
                                                quantity,
                                                image: bigImage,
                                                category: product.category,
                                            },
                                        });
                                        router.push("/cart");
                                    }}
                                >
                                    <FiCheck size={20} />
                                    Add to Cart
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#F6F6F6] rounded-lg">
                                        <FiTruck size={24} className="text-[#797979]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Fast Shipping</p>
                                        <p className="text-xs text-gray-600">Only 1.5$ nationally</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#F6F6F6] rounded-lg">
                                        <FiShield size={24} className="text-[#797979]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">2 Year Warranty</p>
                                        <p className="text-xs text-gray-600">Full coverage</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#F6F6F6] rounded-lg">
                                        <FiCreditCard size={24} className="text-[#797979]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
                                        <p className="text-xs text-gray-600">100% protected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
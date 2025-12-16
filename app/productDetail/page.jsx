"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartDispatch, CartActions } from "@/context/CartContext";
import { FiChevronRight, FiPlus, FiMinus } from "react-icons/fi";

export default function ProductsDetail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get("category");
    const productId = searchParams.get("id");
    const product = products.find((p) => p.id === Number(productId));

    const dispatch = useCartDispatch();

    // Left Side Images
    const images = product?.images || []; // gallery (can all be IP14 for now)
    const [bigImage, setBigImage] = useState(product?.img || null); // use the product's main image

    // Right Side Options
    const colors = ["#000000", "#E8E8E8", "#781DBC", "#E1B000"];
    const [selectedColor, setSelectedColor] = useState(colors[0]);

    const memories = ["128GB", "256GB", "512GB", "1TB"];
    const [selectedMemory, setSelectedMemory] = useState(memories[0]);

    const phoneDetails = product?.details || [];
    const description = product?.description || "No description available.";

    // Quantity
    const [quantity, setQuantity] = useState(1);
    const increase = () => setQuantity((prev) => prev + 1);
    const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    if (!product) {
        return <div className="text-center mt-10">Product not found.</div>;
    }

    return (
        <section className="container mx-auto px-3 sm:mt-6">
            {/* Category */}
            <div className="hidden sm:flex items-center space-x-4">
                <h1 className="text-[#A4A4A4] font-medium">Category</h1>
                <FiChevronRight size={20} className="text-[#A4A4A4]" />
                <Link href={`/products?category=${category}`}>
                    <h1 className="text-black font-medium">{category}</h1>
                </Link>
                <FiChevronRight size={20} className="text-[#A4A4A4]" />
                <h2 className="text-black font-medium">
                    {product?.name.split(" ")[0]}
                </h2>
            </div>

            <div className="md:max-w-7xl mx-auto flex flex-col md:flex-row h-auto py-5">
                {/* Left Side */}
                <div className="md:w-1/2 flex flex-col md:flex-row justify-evenly items-center">
                    {/* Small Images Desktop */}
                    <div className="hidden md:flex flex-row md:flex-col gap-4 justify-center">
                        {images.map((img, index) => (
                            <Image
                                key={index}
                                src={img}
                                alt={`${product.name} view ${index + 1}`}
                                width={800}
                                height={800}
                                className="w-20 h-auto object-contain cursor-pointer"
                                onClick={() => setBigImage(img)}
                            />
                        ))}
                    </div>

                    {/* Big Image */}
                    <div className="flex justify-center items-center my-4">
                        <Image
                            src={bigImage}
                            alt={product.name}
                            width={800}
                            height={800}
                            className="w-80 md:w-96 h-auto object-contain"
                        />
                    </div>

                    {/* Small Images Mobile */}
                    <div className="flex md:hidden flex-row gap-4 justify-center">
                        {images.map((img, index) => (
                            <Image
                                key={index}
                                src={img}
                                alt={`${product.name} view ${index + 1}`}
                                width={800}
                                height={800}
                                className="w-20 h-auto object-contain cursor-pointer"
                                onClick={() => setBigImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Side */}
                <div className="md:w-1/2 mx-auto flex flex-col space-y-3 my-4">
                    {/* Title & Price */}
                    <div>
                        <h1 className="mb-3 text-3xl font-bold">
                            {product.name}
                        </h1>
                        <h2 className="text-2xl font-semibold">
                            ${product.price}
                        </h2>
                    </div>

                    {/* Color Selection */}
                    <div className="flex gap-3 items-center">
                        <p>Select color:</p>
                        {colors.map((color, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedColor(color)}
                                className={`w-8 h-8 rounded-full cursor-pointer ${
                                    selectedColor === color ? "ring-1" : ""
                                }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>

                    {/* Memory Selection */}
                    <div className="grid grid-cols-4 gap-3">
                        {memories.map((memory, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedMemory(memory)}
                                className={`py-3 px-6 rounded-md text-[#A0A0A0] text-center border ${
                                    selectedMemory === memory
                                        ? "border-2 text-black"
                                        : ""
                                }`}
                            >
                                {memory}
                            </button>
                        ))}
                    </div>

                    {/* Phone Details */}
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {phoneDetails.map((detail, index) => (
                            <div
                                key={index}
                                className="bg-[#F4F4F4] p-4 px-6 rounded-md"
                            >
                                <p className="text-[#A7A7A7] text-sm">
                                    {detail.part}
                                </p>
                                <p className="text-sm">{detail.detail}</p>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-sm text-[#6C6C6C]">{description}</p>
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="flex flex-col gap-3">
                        <p className="text-lg font-medium">Quantity</p>
                        <div className="flex gap-3">
                            <button
                                onClick={decrease}
                                className="px-5 py-2 text-xl bg-[#F4F4F4] rounded hover:bg-gray-200"
                            >
                                <FiMinus />
                            </button>
                            <span className="w-16 py-2 text-lg text-center bg-[#F4F4F4] rounded">
                                {quantity}
                            </span>
                            <button
                                onClick={increase}
                                className="px-5 py-2 text-xl bg-[#F4F4F4] rounded hover:bg-gray-200"
                            >
                                <FiPlus />
                            </button>
                        </div>

                        <button
                            className="w-full py-3 bg-black text-white font-semibold rounded-lg cursor-pointer"
                            onClick={() => {
                                dispatch({
                                    type: CartActions.ADD,
                                    payload: {
                                        cartItemId: Date.now(),
                                        productId: product.id,
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
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

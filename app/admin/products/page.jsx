"use client";

import { useState, useEffect } from "react";
import { useCategories } from "../context/CategoriesContext";

export default function AdminProducts() {
    const { categories } = useCategories();

    const [productName, setProductName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [description, setDescription] = useState("");
    const [colors, setColors] = useState("");
    const [price, setPrice] = useState("");
    const [memory, setMemory] = useState("");
    const [images, setImages] = useState([]); // for uploading
    const [products, setProducts] = useState([]);
    const [filterCategory, setFilterCategory] = useState("");
    const [loading, setLoading] = useState(false);

    // Load products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                setProducts(data.map((p) => ({ ...p, id: p._id })));
            } catch (err) {
                console.error("Failed to fetch products:", err);
            }
        };
        fetchProducts();
    }, []);

    const handleAddProduct = async () => {
        if (!productName || !selectedCategory || !price || !colors) {
            alert("Category, Name, Price, and Colors are required");
            return;
        }

        setLoading(true);

        try {
            // Convert files to base64
            const base64Images = images.length
                ? await Promise.all(
                      images.map(
                          (file) =>
                              new Promise((resolve, reject) => {
                                  const reader = new FileReader();
                                  reader.readAsDataURL(file);
                                  reader.onload = () => resolve(reader.result);
                                  reader.onerror = (err) => reject(err);
                              })
                      )
                  )
                : [];

            // Upload to Cloudinary

            let uploadedUrls = [];
            if (base64Images.length > 0) {
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ images: base64Images }),
                });

                let data;
                try {
                    data = await uploadRes.json();
                } catch (err) {
                    throw new Error("Upload API did not return valid JSON");
                }

                if (!uploadRes.ok || !data.success) {
                    throw new Error(data.message || "Failed to upload images");
                }

                uploadedUrls = data.urls || [];
            }

            // Build product payload
            const newProduct = {
                name: productName,
                categoryId: selectedCategory,
                price: Number(price),
                colors: colors.split(",").map((c) => c.trim()),
                memory: memory || "",
                description: description || "",
                images: uploadedUrls,
            };

            // Save product
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            if (!res.ok) throw new Error("Failed to add product");

            const savedProduct = await res.json();
            setProducts([
                ...products,
                { ...savedProduct, id: savedProduct._id },
            ]);

            // Reset form
            setProductName("");
            setSelectedCategory("");
            setPrice("");
            setColors("");
            setMemory("");
            setDescription("");
            setImages([]);
            alert("Product added successfully!");
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await fetch(`/api/products?id=${id}`, { method: "DELETE" });
            setProducts(products.filter((p) => p.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const displayedProducts = products
        .filter((p) => !filterCategory || p.categoryId === filterCategory)
        .sort(() => Math.random() - 0.5);

    return (
        <div className="p-2 space-y-6">
            <h1 className="text-3xl font-bold">Manage Products</h1>

            {/* Add Product Form */}
            <div className="space-y-4 p-4 rounded shadow-lg">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                        />
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                    >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Colors (comma separated)"
                        value={colors}
                        onChange={(e) => setColors(e.target.value)}
                        className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                    />
                    <input
                        type="text"
                        placeholder="Memory (optional)"
                        value={memory}
                        onChange={(e) => setMemory(e.target.value)}
                        className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                    />
                    <textarea
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                    />
                    <input
                        type="file"
                        multiple
                        onChange={(e) => setImages([...e.target.files])}
                        className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                    />
                </div>

                <button
                    onClick={handleAddProduct}
                    disabled={loading}
                    className="bg-[#2E2E2E] text-white px-4 py-2 rounded hover:bg-[#4A4A4A] disabled:opacity-50"
                >
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </div>

            {/* Filter */}
            <div className="flex gap-2 items-center">
                <span>Filter by Category:</span>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border px-3 py-2 rounded focus:outline-none"
                >
                    <option value="">All</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-2">ID</th>
                            <th className="text-left px-4 py-2">Name</th>
                            <th className="text-left px-4 py-2">Category</th>
                            <th className="text-left px-4 py-2">Price</th>
                            <th className="text-left px-4 py-2">Memory</th>
                            <th className="text-left px-4 py-2">Colors</th>
                            <th className="text-left px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedProducts.map((p) => {
                            const category = categories.find(
                                (c) => String(c.id) === String(p.categoryId)
                            );
                            return (
                                <tr key={p.id} className="border-b">
                                    <td className="px-4 py-2">{p.id}</td>
                                    <td className="px-4 py-2">{p.name}</td>
                                    <td className="px-4 py-2">
                                        {category?.name || "Unknown"}
                                    </td>
                                    <td className="px-4 py-2">${p.price}</td>
                                    <td className="px-4 py-2">
                                        {p.memory || "-"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {Array.isArray(p.colors)
                                            ? p.colors.join(", ")
                                            : p.colors}
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleDeleteProduct(p.id)
                                            }
                                            className="py-2 px-6 rounded bg-[#2E2E2E] text-white hover:bg-[#4A4A4A]"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

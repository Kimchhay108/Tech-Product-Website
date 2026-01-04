"use client";
import { useState, useEffect } from "react";

export default function AdminProducts() {
    // State
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [newArrival, setNewArrival] = useState(false);
    const [bestSeller, setBestSeller] = useState(false);
    const [specialOffer, setSpecialOffer] = useState(false);
    const [productName, setProductName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(""); // will hold Category _id
    const [description, setDescription] = useState("");
    const [colors, setColors] = useState("");
    const [price, setPrice] = useState("");
    const [memory, setMemory] = useState("");
    const [images, setImages] = useState([]); // File[]
    const [filterCategory, setFilterCategory] = useState(""); // Category _id
    const [loading, setLoading] = useState(false);

    // Load categories and products from API
    useEffect(() => {
        (async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    fetch("/api/categories", { cache: "no-store" }),
                    fetch("/api/products", { cache: "no-store" }),
                ]);

                const [catData, prodData] = await Promise.all([
                    catRes.json().catch(() => {
                        throw new Error("Categories API returned invalid JSON");
                    }),
                    prodRes.json().catch(() => {
                        throw new Error("Products API returned invalid JSON");
                    }),
                ]);

                if (!catRes.ok)
                    throw new Error(
                        catData?.message || "Failed to load categories"
                    );
                if (!prodRes.ok)
                    throw new Error(
                        prodData?.message || "Failed to load products"
                    );

                setCategories(Array.isArray(catData) ? catData : []);
                // keep id alias for UI tables
                setProducts(
                    Array.isArray(prodData)
                        ? prodData.map((p) => ({ ...p, id: p._id }))
                        : []
                );
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        })();
    }, []);

    const handleAddProduct = async () => {
        // validations
        if (!productName || !selectedCategory || !price || !colors) {
            alert("Category, Name, Price, and Colors are required");
            return;
        }
        if (isNaN(Number(price))) {
            alert("Price must be a valid number");
            return;
        }

        setLoading(true);

        try {
            // Convert selected files to base64 data URLs (JSON upload to /api/upload)
            const base64Images =
                images.length > 0
                    ? await Promise.all(
                          images.map(
                              (file) =>
                                  new Promise((resolve, reject) => {
                                      const reader = new FileReader();
                                      reader.onload = () =>
                                          resolve(String(reader.result));
                                      reader.onerror = (err) => reject(err);
                                      reader.readAsDataURL(file);
                                  })
                          )
                      )
                    : [];

            let uploadedUrls = [];
            if (base64Images.length > 0) {
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ images: base64Images }),
                });

                let uploadData;
                try {
                    uploadData = await uploadRes.json();
                } catch {
                    throw new Error("Upload API did not return valid JSON");
                }

                if (!uploadRes.ok || !uploadData?.success) {
                    throw new Error(
                        uploadData?.message || "Failed to upload images"
                    );
                }

                uploadedUrls = Array.isArray(uploadData.urls)
                    ? uploadData.urls
                    : [];
                if (base64Images.length > 0 && uploadedUrls.length === 0) {
                    throw new Error("Upload API did not return image URLs");
                }
            }

            // Build product payload (category is ObjectId string)
            
            const newProduct = {
                name: productName,
                category: selectedCategory,
                price: Number(price),
                colors: colors
                    .split(",")
                    .map((c) => c.trim())
                    .filter(Boolean),
                memory: memory || "",
                description: description || "",
                images: uploadedUrls,
                newArrival,
                bestSeller,
                specialOffer,
            };

            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            let savedProduct;
            try {
                savedProduct = await res.json();
            } catch {
                throw new Error("Products API did not return valid JSON");
            }

            if (!res.ok) {
                throw new Error(
                    savedProduct?.message || "Failed to add product"
                );
            }

            setProducts((prev) => [
                ...prev,
                { ...savedProduct, id: savedProduct._id },
            ]);

            // Reset form
            setProductName("");
            setSelectedCategory("");
            setBestSeller("");
            setNewArrival("");
            setSpecialOffer("");
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

    // Robust filter (handles populated category objects or id strings)
    const displayedProducts = products
        .filter((p) => {
            if (!filterCategory) return true;
            const catId =
                typeof p.category === "string"
                    ? p.category
                    : p?.category?._id || p?.category?.id || "";
            return String(catId) === String(filterCategory);
        })
        .sort(() => Math.random() - 0.5);

    // === UI (unchanged) ===
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

                    {/* Category select (uses Mongo _id) */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                    >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-2 items-center">
                        <label>
                            <input
                                type="checkbox"
                                checked={newArrival}
                                onChange={(e) =>
                                    setNewArrival(e.target.checked)
                                }
                            />{" "}
                            New Arrival
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={bestSeller}
                                onChange={(e) =>
                                    setBestSeller(e.target.checked)
                                }
                            />{" "}
                            Best Seller
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={specialOffer}
                                onChange={(e) =>
                                    setSpecialOffer(e.target.checked)
                                }
                            />{" "}
                            Special Offers
                        </label>
                    </div>

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
                        onChange={(e) =>
                            setImages(Array.from(e.target.files || []))
                        }
                        className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                    />
                </div>

                <button
                    onClick={handleAddProduct}
                    disabled={
                        loading ||
                        !productName ||
                        !selectedCategory ||
                        !price ||
                        !colors
                    }
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
                    className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                {filterCategory && (
                    <button
                        onClick={() => setFilterCategory("")}
                        className="text-sm text-gray-600 underline"
                    >
                        Clear
                    </button>
                )}
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
                            const categoryName =
                                (typeof p.category === "object" &&
                                    p.category?.name) ||
                                categories.find(
                                    (c) => String(c._id) === String(p.category)
                                )?.name ||
                                "Unknown";

                            return (
                                <tr key={p.id || p._id} className="border-b">
                                    <td className="px-4 py-2">
                                        {p.id || p._id}
                                    </td>
                                    <td className="px-4 py-2">{p.name}</td>
                                    <td className="px-4 py-2">
                                        {categoryName}
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
                                            onClick={async () => {
                                                try {
                                                    const res = await fetch(
                                                        `/api/products?id=${
                                                            p.id || p._id
                                                        }`,
                                                        { method: "DELETE" }
                                                    );
                                                    if (
                                                        !res.ok &&
                                                        res.status !== 204
                                                    ) {
                                                        const data = await res
                                                            .json()
                                                            .catch(() => ({}));
                                                        throw new Error(
                                                            data.message ||
                                                                "Failed to delete product"
                                                        );
                                                    }
                                                    setProducts((prev) =>
                                                        prev.filter(
                                                            (row) =>
                                                                (row.id ||
                                                                    row._id) !==
                                                                (p.id || p._id)
                                                        )
                                                    );
                                                } catch (err) {
                                                    console.error(err);
                                                    alert(err.message);
                                                }
                                            }}
                                            className="py-2 px-6 rounded bg-[#2E2E2E] text-white hover:bg-[#4A4A4A]"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {displayedProducts.length === 0 && (
                            <tr>
                                <td
                                    className="px-4 py-6 text-gray-500"
                                    colSpan={7}
                                >
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

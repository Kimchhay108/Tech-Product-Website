"use client";
import { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function AdminProducts() {
    // State
    const [editOpen, setEditOpen] = useState(false);
    const [editProductId, setEditProductId] = useState("");
    const [editName, setEditName] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editDiscountPercent, setEditDiscountPercent] = useState("0");
    const [editColors, setEditColors] = useState("");
    const [editMemory, setEditMemory] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editNewArrival, setEditNewArrival] = useState(false);
    const [editBestSeller, setEditBestSeller] = useState(false);
    const [editSpecialOffer, setEditSpecialOffer] = useState(false);
    const [editExistingImages, setEditExistingImages] = useState([]);
    const [editNewFiles, setEditNewFiles] = useState([]); // File[]
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
    const [discountPercent, setDiscountPercent] = useState("0");
    const [memory, setMemory] = useState("");
    const [images, setImages] = useState([]); // File[]
    const [filterCategory, setFilterCategory] = useState(""); // Category _id
    const [loading, setLoading] = useState(false);

    const router = useRouter();
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
                discountPercent: Number(discountPercent) || 0,
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
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Robust filter (handles populated category objects or id strings)
    const displayedProducts = products.filter((p) => {
        if (!filterCategory) return true;
        const catId =
            typeof p.category === "string"
                ? p.category
                : p?.category?._id || p?.category?.id || "";
        return String(catId) === String(filterCategory);
    });

    // === UI ===
    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Product Management
                </h1>
                <p className="text-gray-600">
                    Add, manage, and organize your product catalog
                </p>
            </div>

            {/* Add Product Form */}
            <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#2E2E2E] to-[#3E3E3E] px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">
                        Add New Product
                    </h2>
                    <p className="text-gray-300 text-sm mt-1">
                        Fill in the product details below
                    </p>
                </div>

                <div className="p-6 space-y-5">
                    {/* Product Name & Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter product name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    $
                                </span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={discountPercent}
                                        onChange={(e) => setDiscountPercent(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <div className="text-sm text-gray-700">
                                        {Number(discountPercent) > 0 && Number(price) > 0 ? (
                                            <>After discount: <span className="font-semibold">${(Number(price) * (1 - Number(discountPercent)/100)).toFixed(2)}</span></>
                                        ) : (
                                            <span className="text-gray-500">No discount applied</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
                        >
                            <option value="">Select a category</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Product Badges */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Product Badges
                        </label>
                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newArrival}
                                    onChange={(e) =>
                                        setNewArrival(e.target.checked)
                                    }
                                    className="w-4 h-4 text-[#2E2E2E] border-gray-300 rounded focus:ring-[#2E2E2E]"
                                />
                                <span className="text-sm text-gray-700">
                                    New Arrival
                                </span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={bestSeller}
                                    onChange={(e) =>
                                        setBestSeller(e.target.checked)
                                    }
                                    className="w-4 h-4 text-[#2E2E2E] border-gray-300 rounded focus:ring-[#2E2E2E]"
                                />
                                <span className="text-sm text-gray-700">
                                    Best Seller
                                </span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={specialOffer}
                                    onChange={(e) =>
                                        setSpecialOffer(e.target.checked)
                                    }
                                    className="w-4 h-4 text-[#2E2E2E] border-gray-300 rounded focus:ring-[#2E2E2E]"
                                />
                                <span className="text-sm text-gray-700">
                                    Special Offer
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Colors & Memory */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Colors{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Black, White, Blue"
                                value={colors}
                                onChange={(e) => setColors(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Separate colors with commas
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Memory/Storage
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., 128GB, 256GB"
                                value={memory}
                                onChange={(e) => setMemory(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            placeholder="Enter product description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg
                                        className="w-8 h-8 mb-2 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                    <p className="mb-1 text-sm text-gray-500">
                                        <span className="font-semibold">
                                            Click to upload
                                        </span>{" "}
                                        or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Multiple images supported - PNG, JPG or
                                        WEBP (MAX. 5MB each)
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) =>
                                        setImages(
                                            Array.from(e.target.files || [])
                                        )
                                    }
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Image Previews */}
                        {images.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-3">
                                    Selected Images ({images.length})
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {images.map((file, index) => (
                                        <div
                                            key={index}
                                            className="relative group"
                                        >
                                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                                                <img
                                                    src={URL.createObjectURL(
                                                        file
                                                    )}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImages(
                                                        images.filter(
                                                            (_, i) =>
                                                                i !== index
                                                        )
                                                    );
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                            <div className="mt-1 text-xs text-gray-500 truncate">
                                                {file.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-5 border-t border-gray-200">
                        <button
                            onClick={handleAddProduct}
                            disabled={
                                loading ||
                                !productName ||
                                !selectedCategory ||
                                !price ||
                                !colors
                            }
                            className="inline-flex items-center px-6 py-2.5 bg-[#2E2E2E] hover:bg-[#4A4A4A] text-white font-medium rounded-lg shadow-sm transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Adding Product...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    Add Product
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter & Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Filter Section */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Product Catalog
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {displayedProducts.length} product
                                {displayedProducts.length !== 1 ? "s" : ""}{" "}
                                found
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">
                                Filter:
                            </label>
                            <select
                                value={filterCategory}
                                onChange={(e) =>
                                    setFilterCategory(e.target.value)
                                }
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all text-sm"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {filterCategory && (
                                <button
                                    onClick={() => setFilterCategory("")}
                                    className="text-sm text-[#2E2E2E] hover:text-[#4A4A4A] font-medium"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                {displayedProducts.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                        </svg>
                        <p className="text-gray-900 font-medium mb-1">
                            No products found
                        </p>
                        <p className="text-gray-500 text-sm">
                            {filterCategory
                                ? "Try changing your filter"
                                : "Add your first product to get started"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Memory
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Colors
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Badges
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {displayedProducts.map((p, index) => {
                                    const categoryName =
                                        (typeof p.category === "object" &&
                                            p.category?.name) ||
                                        categories.find(
                                            (c) =>
                                                String(c._id) ===
                                                String(p.category)
                                        )?.name ||
                                        "Unknown";

                                    return (
                                        <tr
                                            key={p._id || p.id || index}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {p.images && p.images[0] ? (
                                                        <img
                                                            src={p.images[0]}
                                                            alt={p.name}
                                                            className="h-10 w-10 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                                            <svg
                                                                className="h-6 w-6 text-gray-400"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {p.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                           ID: {p.id || p._id ? (p.id || p._id).substring(0, 8) : "N/A"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {categoryName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    ${p.price}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                    {p.memory || "-"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {(Array.isArray(p.colors)
                                                        ? p.colors
                                                        : [p.colors]
                                                    )
                                                        .slice(0, 3)
                                                        .map((color, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                                            >
                                                                {color}
                                                            </span>
                                                        ))}
                                                    {Array.isArray(p.colors) &&
                                                        p.colors.length > 3 && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                                +
                                                                {p.colors
                                                                    .length - 3}
                                                            </span>
                                                        )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {p.newArrival && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            New
                                                        </span>
                                                    )}
                                                    {p.bestSeller && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            Best
                                                        </span>
                                                    )}
                                                    {p.specialOffer && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            Offer
                                                        </span>
                                                    )}
                                                    {!p.newArrival &&
                                                        !p.bestSeller &&
                                                        !p.specialOffer && (
                                                            <span className="text-xs text-gray-400">
                                                                -
                                                            </span>
                                                        )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 flex gap-2 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        router.push(
                                                            `/productDetail/${p._id}`
                                                        )
                                                    }
                                                    className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition font-medium text-sm"
                                                >
                                                    <FiEye size={16} />
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const catId = typeof p.category === 'string' ? p.category : (p.category?._id || p.category?.id || "");
                                                        setEditProductId(p._id || p.id);
                                                        setEditName(p.name || "");
                                                        setEditCategory(String(catId));
                                                        setEditPrice(String(p.price ?? ""));
                                                        setEditDiscountPercent(String(p.discountPercent ?? 0));
                                                        const colorList = Array.isArray(p.colors) ? p.colors : (p.colors ? [p.colors] : []);
                                                        setEditColors(colorList.join(", "));
                                                        setEditMemory(p.memory || "");
                                                        setEditDescription(p.description || "");
                                                        setEditNewArrival(Boolean(p.newArrival));
                                                        setEditBestSeller(Boolean(p.bestSeller));
                                                        setEditSpecialOffer(Boolean(p.specialOffer));
                                                        setEditExistingImages(Array.isArray(p.images) ? p.images : []);
                                                        setEditNewFiles([]);
                                                        setEditOpen(true);
                                                    }}
                                                    className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors duration-200"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (
                                                            !confirm(
                                                                `Delete "${p.name}"? This action cannot be undone.`
                                                            )
                                                        )
                                                            return;
                                                        try {
                                                            const res =
                                                                await fetch(
                                                                    `/api/products?id=${
                                                                        p.id ||
                                                                        p._id
                                                                    }`,
                                                                    {
                                                                        method: "DELETE",
                                                                    }
                                                                );
                                                            if (
                                                                !res.ok &&
                                                                res.status !==
                                                                    204
                                                            ) {
                                                                const data =
                                                                    await res
                                                                        .json()
                                                                        .catch(
                                                                            () => ({})
                                                                        );
                                                                throw new Error(
                                                                    data.message ||
                                                                        "Failed to delete product"
                                                                );
                                                            }
                                                            setProducts(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (row) =>
                                                                            (row.id ||
                                                                                row._id) !==
                                                                            (p.id ||
                                                                                p._id)
                                                                    )
                                                            );
                                                        } catch (err) {
                                                            console.error(err);
                                                            alert(err.message);
                                                        }
                                                    }}
                                                    className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors duration-200"
                                                >
                                                    <svg
                                                        className="w-4 h-4 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-lg border border-gray-200 flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Product</h3>
                            <button onClick={() => setEditOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="p-6 space-y-5 overflow-y-auto flex-1 min-h-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name <span className="text-red-500">*</span></label>
                                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price <span className="text-red-500">*</span></label>
                                    <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent" />
                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                                            <input type="number" min={0} max={100} value={editDiscountPercent} onChange={(e) => setEditDiscountPercent(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent" />
                                        </div>
                                        <div className="flex items-end">
                                            <div className="text-sm text-gray-700">
                                                {Number(editDiscountPercent) > 0 && Number(editPrice) > 0 ? (
                                                    <>After discount: <span className="font-semibold">${(Number(editPrice) * (1 - Number(editDiscountPercent)/100)).toFixed(2)}</span></>
                                                ) : (
                                                    <span className="text-gray-500">No discount applied</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                                <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent">
                                    <option value="">Select a category</option>
                                    {categories.map((c) => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Colors <span className="text-red-500">*</span></label>
                                    <input value={editColors} onChange={(e) => setEditColors(e.target.value)} placeholder="e.g., Black, White" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Memory</label>
                                    <input value={editMemory} onChange={(e) => setEditMemory(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea rows={4} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent resize-none" />
                            </div>
                            {/* Images management in Edit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                                <div className="space-y-3">
                                    {Array.isArray(editExistingImages) && editExistingImages.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-500 mb-2">Existing ({editExistingImages.length})</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                {editExistingImages.map((url, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                                                            <img src={url} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                                                        </div>
                                                        <button type="button" onClick={() => setEditExistingImages(editExistingImages.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow">✕</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-4 pb-5">
                                                <svg className="w-7 h-7 mb-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                                                <p className="text-xs text-gray-500">Click to add more images</p>
                                            </div>
                                            <input type="file" multiple accept="image/*" onChange={(e) => setEditNewFiles([...(editNewFiles || []), ...Array.from(e.target.files || [])])} className="hidden" />
                                        </label>
                                        {Array.isArray(editNewFiles) && editNewFiles.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-xs text-gray-500 mb-2">New ({editNewFiles.length})</p>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                    {editNewFiles.map((file, idx) => (
                                                        <div key={idx} className="relative group">
                                                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                                                                <img src={URL.createObjectURL(file)} alt={`New ${idx + 1}`} className="w-full h-full object-cover" />
                                                            </div>
                                                            <button type="button" onClick={() => setEditNewFiles(editNewFiles.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow">✕</button>
                                                            <div className="mt-1 text-[10px] text-gray-500 truncate">{file.name}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Product Badges</label>
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={editNewArrival} onChange={(e) => setEditNewArrival(e.target.checked)} />
                                        <span className="text-sm text-gray-700">New Arrival</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={editBestSeller} onChange={(e) => setEditBestSeller(e.target.checked)} />
                                        <span className="text-sm text-gray-700">Best Seller</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={editSpecialOffer} onChange={(e) => setEditSpecialOffer(e.target.checked)} />
                                        <span className="text-sm text-gray-700">Special Offer</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 shrink-0">
                            <button onClick={() => setEditOpen(false)} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">Cancel</button>
                            <button
                                onClick={async () => {
                                    if (!editProductId || !editName || !editCategory || editPrice === "") {
                                        alert("Name, Category and Price are required");
                                        return;
                                    }
                                    try {
                                        // Upload newly added files first
                                        let uploadedUrls = [];
                                        if (Array.isArray(editNewFiles) && editNewFiles.length > 0) {
                                            const base64Images = await Promise.all(
                                                editNewFiles.map((file) => new Promise((resolve, reject) => {
                                                    const reader = new FileReader();
                                                    reader.onload = () => resolve(String(reader.result));
                                                    reader.onerror = (err) => reject(err);
                                                    reader.readAsDataURL(file);
                                                }))
                                            );
                                            const uploadRes = await fetch('/api/upload', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ images: base64Images })
                                            });
                                            const uploadData = await uploadRes.json().catch(() => ({}));
                                            if (!uploadRes.ok || !uploadData.success) {
                                                throw new Error(uploadData.message || 'Failed to upload images');
                                            }
                                            uploadedUrls = Array.isArray(uploadData.urls) ? uploadData.urls : [];
                                        }

                                        const finalImages = [
                                            ...(Array.isArray(editExistingImages) ? editExistingImages : []),
                                            ...uploadedUrls,
                                        ];

                                        const payload = {
                                            productId: editProductId,
                                            productName: editName,
                                            category: editCategory,
                                            description: editDescription,
                                            colors: editColors,
                                            price: Number(editPrice),
                                            discountPercent: Number(editDiscountPercent) || 0,
                                            memory: editMemory,
                                            newArrival: editNewArrival,
                                            bestSeller: editBestSeller,
                                            specialOffer: editSpecialOffer,
                                            images: finalImages,
                                        };
                                        const res = await fetch('/api/products', {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(payload),
                                        });
                                        const data = await res.json().catch(() => ({}));
                                        if (!res.ok || !data.success) {
                                            throw new Error(data.message || 'Failed to update product');
                                        }
                                        const updated = data.product || data;
                                        setProducts(prev => prev.map(row => ((row._id || row.id) === (updated._id) ? { ...updated, id: updated._id } : row)));
                                        setEditOpen(false);
                                    } catch (err) {
                                        console.error(err);
                                        alert(err.message || 'Update failed');
                                    }
                                }}
                                className="px-5 py-2 rounded-lg bg-[#2E2E2E] hover:bg-[#4A4A4A] text-white font-medium"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

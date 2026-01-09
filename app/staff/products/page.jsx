"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiEye,
    FiX,
    FiPackage,
    FiTrendingUp,
    FiStar,
} from "react-icons/fi";

export default function StaffProducts() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [staffProducts, setStaffProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [autoPostFacebook, setAutoPostFacebook] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
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
    const [editNewFiles, setEditNewFiles] = useState([]);
    const formRef = useRef(null);

    // Form state
    const [productName, setProductName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [description, setDescription] = useState("");
    const [colors, setColors] = useState("");
    const [price, setPrice] = useState("");
    const [discountPercent, setDiscountPercent] = useState("0");
    const [memory, setMemory] = useState("");
    const [images, setImages] = useState([]);
    const [newArrival, setNewArrival] = useState(false);
    const [bestSeller, setBestSeller] = useState(false);
    const [specialOffer, setSpecialOffer] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        if (!auth || auth.user.role !== "staff") {
            router.replace("/profile");
            return;
        }

        loadData();
    }, [router]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [catRes, prodRes] = await Promise.all([
                fetch("/api/categories", { cache: "no-store" }),
                fetch("/api/products", { cache: "no-store" }),
            ]);

            const [catData, prodData] = await Promise.all([
                catRes.json(),
                prodRes.json(),
            ]);

            setCategories(Array.isArray(catData) ? catData : []);
            const allProducts = Array.isArray(prodData) ? prodData : [];
            setProducts(allProducts);

            // Get staff's own products for management
            const auth = getAuth();
            if (auth?.user?.uid) {
                // Show all products, but only those created by staff can be edited/deleted
                const staffProds = allProducts.filter(
                    (p) => !p.createdBy || p.createdBy === auth.user.uid
                );
                setStaffProducts(staffProds);
            } else {
                setStaffProducts(allProducts);
            }
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        setImages(files);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (!productName || !selectedCategory || !price) {
            alert("Please fill in required fields");
            return;
        }

        setLoading(true);
        try {
            const auth = getAuth();
            const formData = new FormData();

            // Append form data
            formData.append("productName", productName);
            formData.append("selectedCategory", selectedCategory);
            formData.append("description", description);
            formData.append("colors", colors);
            formData.append("price", price);
            formData.append("discountPercent", discountPercent);
            formData.append("memory", memory);
            formData.append("newArrival", newArrival);
            formData.append("bestSeller", bestSeller);
            formData.append("specialOffer", specialOffer);
            formData.append("createdBy", auth.user.uid);
            formData.append(
                "staffName",
                `${auth.user.firstName} ${auth.user.lastName}`
            );

            // Append images
            images.forEach((img) => {
                formData.append("images", img);
            });

            const response = await fetch("/api/products", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok)
                throw new Error(data.message || "Failed to add product");

            // Auto-post to Facebook if enabled
            if (autoPostFacebook) {
                try {
                    await fetch("/api/facebook/post", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            productId: data.product._id,
                            productName: productName,
                            price: price,
                            description: description,
                            image: data.product.images?.[0],
                        }),
                    });
                    alert("Product created and posted to Facebook!");
                } catch (fbError) {
                    console.warn(
                        "Facebook post failed, but product created:",
                        fbError
                    );
                    alert(
                        "Product created successfully! Facebook posting failed - please configure it in settings."
                    );
                }
            } else {
                alert("Product created successfully!");
            }

            // Reset form
            setProductName("");
            setSelectedCategory("");
            setDescription("");
            setColors("");
            setPrice("");
            setMemory("");
            setImages([]);
            setNewArrival(false);
            setBestSeller(false);
            setSpecialOffer(false);
            setShowForm(false);

            // Reload data
            loadData();
        } catch (error) {
            console.error("Error adding product:", error);
            alert(error.message || "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    const handleEditProduct = (product) => {
        // Populate modal edit fields similar to admin
        const catId = typeof product.category === 'string' ? product.category : (product.category?._id || product.category?.id || "");
        setEditProductId(product._id);
        setEditName(product.productName || product.name || "");
        setEditCategory(String(catId));
        setEditPrice(String(product.price ?? ""));
        setEditDiscountPercent(String(product.discountPercent ?? 0));
        const colorList = Array.isArray(product.colors) ? product.colors : (product.colors ? [product.colors] : []);
        setEditColors(colorList.join(", "));
        setEditMemory(product.memory || "");
        setEditDescription(product.description || "");
        setEditNewArrival(Boolean(product.newArrival));
        setEditBestSeller(Boolean(product.bestSeller));
        setEditSpecialOffer(Boolean(product.specialOffer));
        setEditExistingImages(Array.isArray(product.images) ? product.images : []);
        setEditNewFiles([]);
        setShowForm(false);
        setEditingProduct(product);
        setEditOpen(true);
    };

    useEffect(() => {
        if (showForm && formRef.current) {
            formRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [showForm]);

    const handleSaveEdit = async (e) => {
        e.preventDefault();

        if (!productName || !selectedCategory || !price) {
            alert("Please fill in required fields");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/products", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: editingProduct._id,
                    productName,
                    category: selectedCategory,
                    description,
                    colors,
                    price,
                    discountPercent,
                    memory,
                    newArrival,
                    bestSeller,
                    specialOffer,
                }),
            });

            const data = await response.json();

            if (!response.ok)
                throw new Error(data.message || "Failed to update product");

            alert("Product updated successfully!");

            // Reset form
            setProductName("");
            setSelectedCategory("");
            setDescription("");
            setColors("");
            setPrice("");
            setMemory("");
            setImages([]);
            setNewArrival(false);
            setBestSeller(false);
            setSpecialOffer(false);
            setEditingProduct(null);
            setShowForm(false);

            // Reload data
            loadData();
        } catch (error) {
            console.error("Error updating product:", error);
            alert(error.message || "Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?"))
            return;

        try {
            const response = await fetch(`/api/products?id=${productId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete product");

            alert("Product deleted successfully!");
            loadData();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div>
                <div className=" px-6 py-6">
                    <h1 className="text-4xl font-bold">My Products</h1>
                    <p className=" mt-2 text-lg">
                        Create and manage your product listings
                    </p>
                </div>
            </div>

            <div className=" px-6 py-6 space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Products Card */}
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-gray-600 text-sm font-medium">
                                    Total Products
                                </p>
                                <p className="text-4xl font-bold text-gray-900 mt-2">
                                    {staffProducts.length}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Products you&apos;ve created
                                </p>
                            </div>
                            <div className="bg-linear-to-br from-blue-100 to-blue-50 rounded-xl p-4">
                                <FiPackage className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* New Arrivals Card */}
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-gray-600 text-sm font-medium">
                                    New Arrivals
                                </p>
                                <p className="text-4xl font-bold text-emerald-600 mt-2">
                                    {
                                        staffProducts.filter(
                                            (p) => p.newArrival
                                        ).length
                                    }
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Recently added products
                                </p>
                            </div>
                            <div className="bg-linear-to-br from-emerald-100 to-emerald-50 rounded-xl p-4">
                                <FiTrendingUp className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    {/* Auto-Post Card */}
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-gray-600 text-sm font-medium">
                                    Auto-Post to Facebook
                                </p>
                                <div className="mt-4 flex items-center gap-3">
                                    <div
                                        className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors"
                                        style={{
                                            backgroundColor: autoPostFacebook
                                                ? "#10b981"
                                                : "#e5e7eb",
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                setAutoPostFacebook(
                                                    !autoPostFacebook
                                                )
                                            }
                                            className={`${
                                                autoPostFacebook
                                                    ? "translate-x-7"
                                                    : "translate-x-1"
                                            } inline-block h-6 w-6 transform rounded-full bg-white transition-transform`}
                                        />
                                    </div>
                                    <label className="text-sm font-medium">
                                        {autoPostFacebook
                                            ? "Enabled"
                                            : "Disabled"}
                                    </label>
                                </div>
                            </div>
                            <div className="bg-linear-to-br from-purple-100 to-purple-50 rounded-xl p-4">
                                <FiStar className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Product Button */}
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-linear-to-r from-[#2E2E2E] to-[#1a1a1a] hover:from-[#3a3a3a] hover:to-[#2a2a2a] text-white px-6 py-3 rounded-lg transition-all font-medium shadow-md"
                    >
                        <FiPlus size={20} />
                        Add New Product
                    </button>
                )}

                {/* Add Product Form */}
                {showForm && (
                    <div
                        ref={formRef}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                        <div className="bg-linear-to-r from-[#2E2E2E] to-[#3E3E3E] px-6 py-4">
                            <h2 className="text-xl font-semibold text-white">
                                {editingProduct
                                    ? "Edit Product"
                                    : "Add New Product"}
                            </h2>
                            <p className="text-gray-300 text-sm mt-1">
                                {editingProduct
                                    ? "Update the product details below"
                                    : "Fill in the product details below"}
                            </p>
                        </div>

                        <form
                            onSubmit={
                                editingProduct
                                    ? handleSaveEdit
                                    : handleAddProduct
                            }
                            className="p-6 space-y-5"
                        >
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
                                        onChange={(e) =>
                                            setProductName(e.target.value)
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            $
                                        </span>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={price}
                                            onChange={(e) =>
                                                setPrice(e.target.value)
                                            }
                                            className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                                            <input type="number" min={0} max={100} value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all" />
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
                                    Category{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) =>
                                        setSelectedCategory(e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
                                    required
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
                                                setSpecialOffer(
                                                    e.target.checked
                                                )
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
                                        onChange={(e) =>
                                            setColors(e.target.value)
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
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
                                        onChange={(e) =>
                                            setMemory(e.target.value)
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
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
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
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
                                                Multiple images supported - PNG,
                                                JPG or WEBP (MAX. 5MB each)
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
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
                                                            alt={`Preview ${
                                                                index + 1
                                                            }`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImages(
                                                                images.filter(
                                                                    (_, i) =>
                                                                        i !==
                                                                        index
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
                                    type="submit"
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
                                            {editingProduct
                                                ? "Updating..."
                                                : "Adding..."}{" "}
                                            Product
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
                                            {editingProduct ? "Update" : "Add"}{" "}
                                            Product
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingProduct(null);
                                        setProductName("");
                                        setSelectedCategory("");
                                        setDescription("");
                                        setColors("");
                                        setPrice("");
                                        setMemory("");
                                        setImages([]);
                                        setNewArrival(false);
                                        setBestSeller(false);
                                        setSpecialOffer(false);
                                    }}
                                    className="inline-flex items-center px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-sm transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Your Products
                    </h2>

                    {loading ? (
                        <div className="text-center py-16">
                            <div className="inline-block">
                                <div className="w-10 h-10 border-4 border-gray-200 border-t-[#2E2E2E] rounded-full animate-spin"></div>
                            </div>
                            <p className="text-gray-500 mt-4 font-medium">
                                Loading products...
                            </p>
                        </div>
                    ) : staffProducts.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <div className="text-5xl mb-4">📦</div>
                            <p className="text-gray-600 font-medium mb-4">
                                No products yet
                            </p>
                            <p className="text-gray-500 mb-6">
                                Create your first product to get started
                            </p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="inline-flex items-center gap-2 bg-linear-to-r from-[#2E2E2E] to-[#1a1a1a] hover:from-[#3a3a3a] hover:to-[#2a2a2a] text-white px-6 py-2.5 rounded-lg transition font-medium"
                            >
                                <FiPlus size={20} />
                                Create Your First Product
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {staffProducts.map((product) => {
                                const auth = getAuth();
                                const isOwnProduct =
                                    !product.createdBy ||
                                    product.createdBy === auth?.user?.uid;

                                return (
                                    <div
                                        key={product._id}
                                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                                    >
                                        {/* Image */}
                                        {product.images &&
                                            product.images.length > 0 && (
                                                <div className="w-full h-48 bg-gray-100 overflow-hidden relative">
                                                    <img
                                                        src={product.images[0]}
                                                        alt={
                                                            product.productName ||
                                                            product.name
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />

                                                    <div className="absolute top-3 right-3 flex flex-col gap-1">
                                                        {product.newArrival && (
                                                            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                                New
                                                            </span>
                                                        )}

                                                        {product.bestSeller && (
                                                            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                                Best 
                                                            </span>
                                                        )}

                                                        {product.specialOffer && (
                                                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                                Offer
                                                            </span>
                                                        )}
                                                        {Number(product?.discountPercent) > 0 && (
                                                            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                                -{Number(product.discountPercent)}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {/* Content */}
                                        <div className="p-4 space-y-3">
                                            <h3 className="font-semibold text-gray-900 line-clamp-2">
                                                {product.productName ||
                                                    product.name}
                                            </h3>

                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {product.description ||
                                                    "No description"}
                                            </p>

                                            <div className="flex items-center justify-between pt-2">
                                                {Number(product?.discountPercent) > 0 ? (
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-2xl font-bold text-[#2E2E2E]">
                                                            ${(product.price * (1 - Number(product.discountPercent)/100)).toFixed(2)}
                                                        </span>
                                                        <span className="text-sm text-gray-400 line-through">${product.price}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-2xl font-bold text-[#2E2E2E]">${product.price}</span>
                                                )}
                                            </div>

                                            {product.colors && (
                                                <p className="text-xs text-gray-500">
                                                    <span className="font-semibold">
                                                        Colors:
                                                    </span>{" "}
                                                    {product.colors}
                                                </p>
                                            )}

                                            {product.memory && (
                                                <p className="text-xs text-gray-500">
                                                    <span className="font-semibold">
                                                        Storage:
                                                    </span>{" "}
                                                    {product.memory}
                                                </p>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-3 border-t border-gray-100">
                                                <button
                                                    onClick={() =>
                                                        router.push(
                                                            `/productDetail/${product._id}`
                                                        )
                                                    }
                                                    className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg transition font-medium text-sm"
                                                >
                                                    <FiEye size={16} />
                                                    View
                                                </button>
                                                {isOwnProduct && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleEditProduct(
                                                                    product
                                                                )
                                                            }
                                                            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2.5 rounded-lg transition font-medium text-sm"
                                                        >
                                                            <FiEdit2
                                                                size={16}
                                                            />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteProduct(
                                                                    product._id
                                                                )
                                                            }
                                                            className="flex-1 flex items-center justify-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 py-2.5 rounded-lg transition font-medium text-sm"
                                                        >
                                                            <FiTrash2
                                                                size={16}
                                                            />
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                {/* Edit Modal - mirrors admin editor */}
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
                                        setStaffProducts(prev => prev.map(row => ((row._id || row.id) === (updated._id) ? { ...updated, id: updated._id } : row)));
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
        </div>
        {/* Close outer min-h-screen wrapper */}
    </div>
    );
}

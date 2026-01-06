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
  const formRef = useRef(null);

  // Form state
  const [productName, setProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState("");
  const [price, setPrice] = useState("");
  const [memory, setMemory] = useState("");
  const [images, setImages] = useState([]);
  const [newArrival, setNewArrival] = useState(false);

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
      formData.append("memory", memory);
      formData.append("newArrival", newArrival);
      formData.append("createdBy", auth.user.uid);
      formData.append("staffName", `${auth.user.firstName} ${auth.user.lastName}`);

      // Append images
      images.forEach((img) => {
        formData.append("images", img);
      });

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to add product");

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
          console.warn("Facebook post failed, but product created:", fbError);
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
    setEditingProduct(product);
    setProductName(product.productName || product.name);
    // Handle category more robustly
    const categoryId = typeof product.category === 'string' 
      ? product.category 
      : product.category?._id || product.category?.id || "";
    setSelectedCategory(categoryId);
    setDescription(product.description || "");
    setColors(Array.isArray(product.colors) ? product.colors.join(", ") : product.colors || "");
    setPrice(product.price.toString());
    setMemory(product.memory || "");
    setNewArrival(product.newArrival || false);
    setImages([]);
    setShowForm(true);
  };

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
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
          memory,
          newArrival,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to update product");

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
      <div className="bg-gradient-to-r from-[#2E2E2E] to-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold">My Products</h1>
          <p className="text-gray-300 mt-2 text-lg">Create and manage your product listings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Products Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{staffProducts.length}</p>
                <p className="text-xs text-gray-500 mt-2">Products you've created</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-4">
                <FiPackage className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* New Arrivals Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">New Arrivals</p>
                <p className="text-4xl font-bold text-emerald-600 mt-2">
                  {staffProducts.filter((p) => p.newArrival).length}
                </p>
                <p className="text-xs text-gray-500 mt-2">Recently added products</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl p-4">
                <FiTrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Auto-Post Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">Auto-Post to Facebook</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors" style={{backgroundColor: autoPostFacebook ? '#10b981' : '#e5e7eb'}}>
                    <button
                      onClick={() => setAutoPostFacebook(!autoPostFacebook)}
                      className={`${
                        autoPostFacebook ? "translate-x-7" : "translate-x-1"
                      } inline-block h-6 w-6 transform rounded-full bg-white transition-transform`}
                    />
                  </div>
                  <label className="text-sm font-medium">
                    {autoPostFacebook ? "Enabled" : "Disabled"}
                  </label>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-4">
                <FiStar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Add Product Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#2E2E2E] to-[#1a1a1a] hover:from-[#3a3a3a] hover:to-[#2a2a2a] text-white px-6 py-3 rounded-lg transition-all font-medium shadow-md"
          >
            <FiPlus size={20} />
            Add New Product
          </button>
        )}

        {/* Add Product Form */}
        {showForm && (
          <div ref={formRef} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#2E2E2E] to-[#1a1a1a] text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingProduct ? "Edit Product" : "Create New Product"}
              </h2>
              <button
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
                }}
                className="text-gray-300 hover:text-white transition"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={editingProduct ? handleSaveEdit : handleAddProduct} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Available Colors
                  </label>
                  <input
                    type="text"
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition"
                    placeholder="e.g., Black, Red, Blue"
                  />
                </div>

                {/* Memory */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Memory/Storage
                  </label>
                  <input
                    type="text"
                    value={memory}
                    onChange={(e) => setMemory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition"
                    placeholder="e.g., 128GB, 256GB"
                  />
                </div>

                {/* New Arrival */}
                <div className="flex items-center gap-3 pt-4">
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors" style={{backgroundColor: newArrival ? '#10b981' : '#e5e7eb'}}>
                    <button
                      type="button"
                      onClick={() => setNewArrival(!newArrival)}
                      className={`${
                        newArrival ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </div>
                  <label className="text-sm font-semibold text-gray-700">Mark as New Arrival</label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition"
                  placeholder="Enter product description"
                  rows="4"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#2E2E2E] transition">
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    id="imageInput"
                  />
                  <label htmlFor="imageInput" className="cursor-pointer">
                    <p className="text-gray-600 font-medium">Click to upload images</p>
                    <p className="text-gray-500 text-sm mt-1">or drag and drop</p>
                  </label>
                </div>
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 md:grid-cols-4 gap-3">
                    {Array.from(images).map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(img)}
                          alt="preview"
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setImages(Array.from(images).filter((_, i) => i !== idx))}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#2E2E2E] to-[#1a1a1a] hover:from-[#3a3a3a] hover:to-[#2a2a2a] text-white px-6 py-2.5 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingProduct
                    ? loading
                      ? "Updating..."
                      : "Update Product"
                    : loading
                    ? "Creating..."
                    : "Create Product"}
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
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-lg transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Products</h2>
          
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-[#2E2E2E] rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-500 mt-4 font-medium">Loading products...</p>
            </div>
          ) : staffProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-gray-600 font-medium mb-4">No products yet</p>
              <p className="text-gray-500 mb-6">Create your first product to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2E2E2E] to-[#1a1a1a] hover:from-[#3a3a3a] hover:to-[#2a2a2a] text-white px-6 py-2.5 rounded-lg transition font-medium"
              >
                <FiPlus size={20} />
                Create Your First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffProducts.map((product) => {
                const auth = getAuth();
                const isOwnProduct = !product.createdBy || product.createdBy === auth?.user?.uid;

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                  >
                    {/* Image */}
                    {product.images && product.images.length > 0 && (
                      <div className="w-full h-48 bg-gray-100 overflow-hidden relative">
                        <img
                          src={product.images[0]}
                          alt={product.productName || product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.newArrival && (
                          <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {product.productName || product.name}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description || "No description"}
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-2xl font-bold text-[#2E2E2E]">
                          ${product.price}
                        </span>
                      </div>

                      {product.colors && (
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">Colors:</span> {product.colors}
                        </p>
                      )}

                      {product.memory && (
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">Storage:</span> {product.memory}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button
                          onClick={() =>
                            router.push(`/productDetail/${product._id}`)
                          }
                          className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg transition font-medium text-sm"
                        >
                          <FiEye size={16} />
                          View
                        </button>
                        {isOwnProduct && (
                          <>
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2.5 rounded-lg transition font-medium text-sm"
                            >
                              <FiEdit2 size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 py-2.5 rounded-lg transition font-medium text-sm"
                            >
                              <FiTrash2 size={16} />
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
        </div>
      </div>
    </div>
  );
}

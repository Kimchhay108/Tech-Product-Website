"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";

export default function StaffProducts() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [staffProducts, setStaffProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoPostFacebook, setAutoPostFacebook] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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
    setSelectedCategory(product.category._id || product.category);
    setDescription(product.description || "");
    setColors(Array.isArray(product.colors) ? product.colors.join(", ") : product.colors || "");
    setPrice(product.price.toString());
    setMemory(product.memory || "");
    setNewArrival(product.newArrival || false);
    setImages([]);
    setShowForm(true);
  };

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
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-2">
            Create and manage your product listings
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Products</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {staffProducts.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">
              New Arrivals
            </p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {staffProducts.filter((p) => p.newArrival).length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">
              Auto-Post to Facebook
            </p>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="autoPost"
                checked={autoPostFacebook}
                onChange={(e) => setAutoPostFacebook(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600"
              />
              <label htmlFor="autoPost" className="text-sm font-medium">
                {autoPostFacebook ? "Enabled" : "Disabled"}
              </label>
            </div>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {showForm ? "Cancel" : "+ Add New Product"}
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? "Edit Product" : "Create New Product"}
            </h2>

            <form onSubmit={editingProduct ? handleSaveEdit : handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Colors
                  </label>
                  <input
                    type="text"
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Black, Red, Blue"
                  />
                </div>

                {/* Memory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Memory/Storage
                  </label>
                  <input
                    type="text"
                    value={memory}
                    onChange={(e) => setMemory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 128GB, 256GB"
                  />
                </div>

                {/* New Arrival */}
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="newArrival"
                    checked={newArrival}
                    onChange={(e) => setNewArrival(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                  />
                  <label htmlFor="newArrival" className="text-sm font-medium">
                    Mark as New Arrival
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product description"
                  rows="4"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {images.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {images.length} image(s) selected
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
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
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-bold">Your Products</h2>
          </div>

          <div className="p-6">
            {loading ? (
              <p className="text-center text-gray-500">Loading products...</p>
            ) : staffProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No products yet</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
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
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      {/* Image */}
                      {product.images && product.images.length > 0 && (
                        <div className="w-full h-48 bg-gray-200 overflow-hidden">
                          <img
                            src={product.images[0]}
                            alt={product.productName || product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {product.productName || product.name}
                        </h3>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xl font-bold text-blue-600">
                            ${product.price}
                          </span>
                          {product.newArrival && (
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded">
                              New
                            </span>
                          )}
                        </div>

                        {product.colors && (
                          <p className="text-xs text-gray-600 mb-3">
                            Colors: {product.colors}
                          </p>
                        )}

                        {product.staffName && (
                          <p className="text-xs text-gray-500 mb-3">
                            By: {product.staffName}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              router.push(`/productDetail/${product._id}`)
                            }
                            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition text-sm font-medium"
                          >
                            View
                          </button>
                          {isOwnProduct && (
                            <>
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="flex-1 bg-blue-100 text-blue-700 py-2 rounded hover:bg-blue-200 transition text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="flex-1 bg-red-100 text-red-700 py-2 rounded hover:bg-red-200 transition text-sm font-medium"
                              >
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
    </div>
  );
}

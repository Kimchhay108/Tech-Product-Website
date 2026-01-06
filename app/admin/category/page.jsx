"use client";
import { useEffect, useState } from "react";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");

  // Fetch categories
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load categories");
        setCategories(data);
      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Add Category
  const addCategory = async () => {
    if (!name.trim()) return alert("Category name is required");
    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add category");
      setCategories((prev) => [...prev, data]);
      setName("");
      setDescription("");
      setShowForm(false);
      alert("Category added successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete Category
  const deleteCategory = async (_id) => {
    if (!_id) return alert("Invalid category id");
    if (!confirm("Delete this category?")) return;

    try {
      console.log("Deleting category ID:", _id);

      const res = await fetch(`/api/categories/${_id.toString()}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete category");

      setCategories((prev) => prev.filter((c) => String(c._id) !== String(_id)));
      alert("Category deleted successfully");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Update Category
  const updateCategory = async (_id, payload) => {
    if (!_id) return alert("Invalid category id");

    try {
      const res = await fetch(`/api/categories/${_id.toString()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update category");

      setCategories((prev) =>
        prev.map((c) => (String(c._id) === String(_id) ? data : c))
      );
      setEditingId(null);
      setEditName("");
      setEditDescription("");
      alert("Category updated successfully");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Category Management</h1>
                <p className="text-gray-600">
                    Organize your products by creating and managing categories
                </p>
            </div>

            {/* Action Button */}
            {!showForm && (
                <div className="mb-6">
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center px-4 py-2.5 bg-[#2E2E2E] hover:bg-[#4A4A4A] text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New Category
                    </button>
                </div>
            )}

            {/* Add Category Form */}
            {showForm && (
                <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#2E2E2E] to-[#3E3E3E] px-6 py-4">
                        <h2 className="text-xl font-semibold text-white">Create New Category</h2>
                        <p className="text-gray-300 text-sm mt-1">Add a new product category to your catalog</p>
                    </div>

                    <div className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Smartphones, Laptops"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    placeholder="Brief category description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-5 border-t border-gray-200">
                            <button
                                onClick={addCategory}
                                disabled={saving}
                                className="inline-flex items-center px-6 py-2.5 bg-[#2E2E2E] hover:bg-[#4A4A4A] text-white font-medium rounded-lg shadow-sm transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Create Category
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setName("");
                                    setDescription("");
                                }}
                                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Categories Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} available
                    </p>
                </div>

                {loading ? (
                    <div className="px-6 py-12 text-center">
                        <svg className="animate-spin h-8 w-8 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-500">Loading categories...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <p className="text-gray-900 font-medium mb-1">No categories yet</p>
                        <p className="text-gray-500 text-sm mb-4">Get started by creating your first category</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center px-4 py-2 bg-[#2E2E2E] hover:bg-[#4A4A4A] text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add First Category
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {categories.map((cat) => (
                                    <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                                        {editingId === cat._id ? (
                                            <>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        value={editDescription}
                                                        onChange={(e) => setEditDescription(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => updateCategory(cat._id, {
                                                            name: editName.trim(),
                                                            description: editDescription
                                                        })}
                                                        className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(null);
                                                            setEditName("");
                                                            setEditDescription("");
                                                        }}
                                                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200"
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-[#2E2E2E] to-[#3E3E3E] flex items-center justify-center text-white font-semibold">
                                                            {cat.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                                                            <div className="text-xs text-gray-500">ID: {cat._id.substring(0, 8)}...</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600">
                                                        {cat.description || <span className="text-gray-400 italic">No description</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(cat._id);
                                                            setEditName(cat.name);
                                                            setEditDescription(cat.description || "");
                                                        }}
                                                        className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(`Delete "${cat.name}"? This action cannot be undone.`)) {
                                                                deleteCategory(cat._id);
                                                            }
                                                        }}
                                                        className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

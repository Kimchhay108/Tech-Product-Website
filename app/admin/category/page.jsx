"use client";
import { useEffect, useState } from "react";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

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
      alert("Category updated successfully");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

    return (
        <div className="p-2 space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Manage Categories</h1>
                <p className="text-gray-500">
                    Create, Delete, Edit categories here
                </p>
            </div>

            {/* Add Category Form */}
            <div className="rounded flex flex-col md:flex-row gap-2 items-center">
                <input
                    type="text"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                />
                <button
                    onClick={addCategory}
                    disabled={saving}
                    className="bg-[#2E2E2E] text-white px-4 py-2 rounded hover:bg-[#4A4A4A] whitespace-nowrap disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Add Category"}
                </button>
            </div>

            {/* Categories Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="p-4">Loading categories…</div>
                ) : (
                    <table className="min-w-full bg-white rounded shadow">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left px-4 py-2">ID</th>
                                <th className="text-left px-4 py-2">
                                    Category Name
                                </th>
                                <th className="text-left px-4 py-2">
                                    Description
                                </th>
                                <th className="text-left px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat._id} className="border-t shadow">
                                    <td className="px-4 py-2">{cat._id}</td>
                                    <td className="px-4 py-2">{cat.name}</td>
                                    <td className="px-4 py-2">
                                        {cat.description || "-"}
                                    </td>
                                    <td className="py-2 flex gap-2">
                                        <button
                                            onClick={() => {
                                                const newName = prompt(
                                                    "New name",
                                                    cat.name
                                                );
                                                if (newName && newName.trim()) {
                                                    updateCategory(cat._id, {
                                                        name: newName.trim(),
                                                    });
                                                }
                                            }}
                                            className="py-2 px-6 rounded bg-[#2E2E2E] text-white hover:bg-[#4A4A4A]"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                deleteCategory(cat._id)
                                            }
                                            className="py-2 px-6 rounded bg-[#2E2E2E] text-white hover:bg-[#4A4A4A]"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td
                                        className="px-4 py-6 text-gray-500"
                                        colSpan={4}
                                    >
                                        No categories yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

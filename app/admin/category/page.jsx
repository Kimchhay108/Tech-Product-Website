"use client";
import { useState } from "react";
import { useCategories } from "../context/CategoriesContext";

export default function AdminCategories() {
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");

    const { categories, setCategories } = useCategories();

    const handleAddCategory = () => {
        if (!categoryName || !categoryDescription) return;

        const newCategory = {
            id: categories.length + 1, // sequential ID based on current length
            name: categoryName,
            description: categoryDescription,
        };

        setCategories([...categories, newCategory]);
        setCategoryName("");
        setCategoryDescription("");
    };

    const handleDeleteCategory = (id) => {
        // keeps only the ones that don’t match the id you want to delete.
        const filtered = categories.filter((cat) => cat.id !== id);

        // Re-assign sequential IDs
        const reIndexed = filtered.map((cat, index) => ({
            ...cat,
            id: index + 1,
        }));

        setCategories(reIndexed);
    };

    return (
        <div className="p-2 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Manage Categories</h1>
                <p className="text-gray-500">Create, Delete, Edit categories here</p>
            </div>

            {/* Add Category Form */}
            <div className="rounded flex flex-col md:flex-row gap-2 items-center">
                <input
                    type="text"
                    placeholder="Category Name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                />
                <button
                    onClick={handleAddCategory}
                    className="bg-[#2E2E2E] text-white px-4 py-2 rounded hover:bg-[#4A4A4A] whitespace-nowrap"
                >
                    Add Category
                </button>
            </div>

            {/* Categories Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-2">ID</th>
                            <th className="text-left px-4 py-2">Category Name</th>
                            <th className="text-left px-4 py-2">Description</th>
                            <th className="text-left px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id} className="border-t shadow">
                                <td className="px-4 py-2">{cat.id}</td>
                                <td className="px-4 py-2">{cat.name}</td>
                                <td className="px-4 py-2">{cat.description}</td>
                                <td className="py-2 flex gap-2">
                                    <button className="py-2 px-6 rounded bg-[#2E2E2E] text-white hover:bg-[#4A4A4A]">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(cat.id)}
                                        className="py-2 px-6 rounded bg-[#2E2E2E] text-white hover:bg-[#4A4A4A]"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

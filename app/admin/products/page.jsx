"use client";
import { useState } from "react";
import { useCategories } from "../context/CategoriesContext";

export default function AdminProducts({}) {
    const { categories } = useCategories(); // use same categories

    const [productName, setProductName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [description, setDescription] = useState("");
    const [colors, setColors] = useState(""); // comma separated
    const [price, setPrice] = useState(""); // single price for memory-less products
    const [memoryOptions, setMemoryOptions] = useState([
        { memory: "", price: "" },
    ]);
    const [specs, setSpecs] = useState({
        screenSize: "",
        cpu: "",
        batteryCapacity: "",
        numberOfCores: "",
        mainCamera: "",
        frontCamera: "",
    });

    const [products, setProducts] = useState([]);

    // Add memory row
    const addMemoryOption = () => {
        setMemoryOptions([...memoryOptions, { memory: "", price: "" }]);
    };

    // Update memory row
    const updateMemoryOption = (index, field, value) => {
        const newOptions = [...memoryOptions];
        newOptions[index][field] = value;
        setMemoryOptions(newOptions);
    };

    const handleAddProduct = () => {
        if (!productName || !selectedCategory) return; // basic validation

        const newProduct = {
            id: products.length + 1,
            name: productName,
            categoryId: selectedCategory,
            description,
            colors: colors.split(",").map((c) => c.trim()),
            memoryOptions: memoryOptions.filter((m) => m.memory), // keep only memory rows with value
            price: memoryOptions.some((m) => m.memory === "") ? price : null, // use single price if no memory
            specs: { ...specs },
        };

        setProducts([...products, newProduct]);

        // Reset form
        setProductName("");
        setSelectedCategory("");
        setDescription("");
        setColors("");
        setMemoryOptions([{ memory: "", price: "" }]);
        setPrice(""); // reset single price
        setSpecs({
            screenSize: "",
            cpu: "",
            batteryCapacity: "",
            numberOfCores: "",
            mainCamera: "",
            frontCamera: "",
        });
    };

    // Delete product
    const handleDeleteProduct = (id) => {
        setProducts(products.filter((p) => p.id !== id));
    };

    // Filter and randomize products for display
    const [filterCategory, setFilterCategory] = useState("");
    const displayedProducts = products
        .filter((p) => !filterCategory || p.categoryId === filterCategory)
        .sort(() => Math.random() - 0.5); // shuffle

    return (
        <div className="p-2 space-y-6">
            {/* Header */}
            <h1 className="text-3xl font-bold">Manage Products</h1>

            {/* Add Product Form */}
            <div className="space-y-4 p-4 rounded shadow-lg ">

                {/* FIrst 5 inputs */}
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

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                    />
                </div>

                {/* Memory + Price */}
                <div>
                    <h3 className="font-semibold mb-1">Memory Options</h3>

                    {/* Memory rows */}
                    {memoryOptions.map((m, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Memory (e.g., 128GB)"
                                value={m.memory}
                                onChange={(e) =>
                                    updateMemoryOption(
                                        index,
                                        "memory",
                                        e.target.value
                                    )
                                }
                                className="border px-3 py-2 rounded w-full focus:outline-none"
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={m.price}
                                onChange={(e) =>
                                    updateMemoryOption(
                                        index,
                                        "price",
                                        e.target.value
                                    )
                                }
                                className="border px-3 py-2 rounded w-full focus:outline-none"
                            />
                        </div>
                    ))}

                    {/* Add memory row */}
                    <button
                        type="button"
                        onClick={addMemoryOption}
                        className="bg-[#2E2E2E] text-white px-3 py-2 rounded-md hover:bg-[#4A4A4A]"
                    >
                        Add Memory
                    </button>
                </div>

                {/* Specs */}
                <div className="space-y-2 mt-2">
                    <h3 className="font-semibold">Specs (optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input
                            type="text"
                            placeholder="Screen Size"
                            value={specs.screenSize}
                            onChange={(e) =>
                                setSpecs({
                                    ...specs,
                                    screenSize: e.target.value,
                                })
                            }
                            className="border px-3 py-2 rounded focus:outline-none"
                        />
                        <input
                            type="text"
                            placeholder="CPU"
                            value={specs.cpu}
                            onChange={(e) =>
                                setSpecs({ ...specs, cpu: e.target.value })
                            }
                            className="border px-3 py-2 rounded focus:outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Battery Capacity"
                            value={specs.batteryCapacity}
                            onChange={(e) =>
                                setSpecs({
                                    ...specs,
                                    batteryCapacity: e.target.value,
                                })
                            }
                            className="border px-3 py-2 rounded focus:outline-none"
                        />
                        <input
                            type="number"
                            placeholder="Number of Cores"
                            value={specs.numberOfCores}
                            onChange={(e) =>
                                setSpecs({
                                    ...specs,
                                    numberOfCores: e.target.value,
                                })
                            }
                            className="border px-3 py-2 rounded focus:outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Main Camera"
                            value={specs.mainCamera}
                            onChange={(e) =>
                                setSpecs({
                                    ...specs,
                                    mainCamera: e.target.value,
                                })
                            }
                            className="border px-3 py-2 rounded focus:outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Front Camera"
                            value={specs.frontCamera}
                            onChange={(e) =>
                                setSpecs({
                                    ...specs,
                                    frontCamera: e.target.value,
                                })
                            }
                            className="border px-3 py-2 rounded focus:outline-none"
                        />
                    </div>
                </div>

                <button
                    onClick={handleAddProduct}
                    className="bg-[#2E2E2E] text-white px-4 py-2 rounded hover:bg-[#4A4A4A]"
                >
                    Add Product
                </button>
            </div>

            {/* Filter by Category */}
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
                            <th className="text-left px-4 py-2">
                                Memory / Price
                            </th>
                            <th className="text-left px-4 py-2">Colors</th>
                            <th className="text-left px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedProducts.map((p) => {
                            const category = categories.find(
                                (c) => c.id === Number(p.categoryId)
                            );
                            return (
                                <tr key={p.id} className="border-b">
                                    <td className="px-4 py-2">{p.id}</td>
                                    <td className="px-4 py-2">{p.name}</td>
                                    <td className="px-4 py-2">
                                        {category?.name || "Unknown"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {p.memoryOptions.length > 0
                                            ? p.memoryOptions.map((m) => (
                                                  <div key={m.memory}>
                                                      {m.memory}{" "}
                                                      {m.price
                                                          ? `: $${m.price}`
                                                          : ""}
                                                  </div>
                                              ))
                                            : p.price
                                            ? `$${p.price}`
                                            : "-"}
                                    </td>

                                    <td className="px-4 py-2">
                                        {p.colors.join(", ")}
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button className="py-2 px-6 rounded bg-[#2E2E2E] text-white hover:bg-[#4A4A4A]">
                                            Edit
                                        </button>
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

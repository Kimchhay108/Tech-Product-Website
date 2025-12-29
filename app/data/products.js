// app/data/products.js

export const fetchProducts = async () => {
  try {
    const res = await fetch("/api/products"); // relative path
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    return data.map((p) => ({ ...p, id: p._id })); // map _id → id
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const addProduct = async (product) => {
  try {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Failed to add product");
    const data = await res.json();
    return { ...data, id: data._id };
  } catch (err) {
    console.error(err);
    return null;
  }
};

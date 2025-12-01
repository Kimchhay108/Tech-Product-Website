import React from "react";

export default function ProductsPage() {
  const products = [
    { id: 1, name: "Apple iPhone 14 Pro 512GB Gold (MQ233)", price: 1437, img: "https://istore.co.na/cdn/shop/products/iPhone14Pro_Gold_539b3565-8ff0-474b-a0df-d504951871a2_1200x.png?v=1664344101" },
    { id: 2, name: "Apple iPhone 11 128GB White (MQ223)", price: 510, img: "/iphone11-white.png" },
    { id: 3, name: "Apple iPhone 11 128GB White (MQ233)", price: 550, img: "/iphone11-blue.png" },
    { id: 4, name: "Apple iPhone 14 Pro 1TB Gold (MQ293)", price: 1499, img: "/iphone14pro-gold2.png" },
    { id: 5, name: "Apple iPhone 14 Pro 1TB Gold (MQ299)", price: 1399, img: "/iphone14pro-gold3.png" },
    { id: 6, name: "Apple iPhone 14 Pro 128GB Deep Purple (MQ023)", price: 1600, img: "/iphone14pro-purple.png" },
    { id: 7, name: "Apple iPhone 13 mini 128GB Pink (MLK23)", price: 850, img: "/iphone13mini-pink.png" },
    { id: 8, name: "Apple iPhone 14 Pro 256GB Space Black (M0G73)", price: 1399, img: "/iphone14pro-black.png" },
    { id: 9, name: "Apple iPhone 14 Pro 256GB Silver (MQ103)", price: 1399, img: "/iphone14pro-silver.png" },
  ];

  return (
    <div className="bg-[#F8F8F8] min-h-screen px-6 py-10">
      
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="col-span-3 bg-white p-5 rounded-xl shadow h-fit">
          <h2 className="font-semibold mb-3">Price</h2>
          <div className="flex gap-2 mb-5">
            <input className="border p-2 rounded w-full" placeholder="From" />
            <input className="border p-2 rounded w-full" placeholder="To" />
          </div>

          <h2 className="font-semibold mb-3">Brand</h2>
          <div className="space-y-2">
            {["Apple", "Samsung", "Xiaomi", "OPPO", "Nokia"].map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-sm">
                <input type="checkbox" /> {brand}
              </label>
            ))}
          </div>

          <h2 className="font-semibold mt-5 mb-3">Built-in Memory</h2>
          <div className="space-y-2">
            {["64GB", "128GB", "256GB", "512GB", "1TB"].map((mem) => (
              <label key={mem} className="flex items-center gap-2 text-sm">
                <input type="checkbox" /> {mem}
              </label>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <main className="col-span-9">
          <div className="flex justify-between mb-5">
            <p>
              Selected Products: <b>85</b>
            </p>
            <select className="border p-2 rounded">
              <option>By rating</option>
              <option>Price low → high</option>
              <option>Price high → low</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition cursor-pointer"
              >
                <div className="w-full h-48 flex justify-center items-center">
                  <img src={p.img} alt={p.name} className="h-full object-contain" />
                </div>

                <h3 className="mt-3 text-sm font-medium leading-tight">{p.name}</h3>
                <p className="text-xl font-bold mt-2">${p.price}</p>

                <button className="mt-3 bg-black text-white w-full py-2 rounded-lg">
                  Buy Now
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-3 mt-10">
            {[1, 2, 3, "...", 12].map((n, i) => (
              <button
                key={i}
                className={`px-4 py-2 border rounded ${
                  n === 1 ? "bg-black text-white" : "bg-white"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </main>
      </div>

    </div>
  );
}

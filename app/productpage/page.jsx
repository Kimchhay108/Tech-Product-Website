'use client'
import Image from "next/image"
import { useRouter } from "next/navigation"; // For useRouter

import React, { useState } from "react";
import { FiChevronDown, FiChevronRight, FiChevronLeft } from "react-icons/fi";

import Ip14prm from "../../assets/home/Ip14prm.png";
import Ip14Gold from "../../assets/home/Ip14Gold.png";
import ZFold from "../../assets/home/ZFold.png";
import Ipad from "../../assets/home/Ipad.png";
export default function ProductsPage() {
	const products = [
		{ id: 1, name: "Apple iPhone 14 Pro 128GB Deep Purple", price: 1599, img: Ip14prm },
		{ id: 2, name: "Apple iPhone 14 Pro 1TB Gold ", price: 1399, img: Ip14Gold },
		{ id: 3, name: "Galaxy Z Fold5 256GB Phantom Black", price: 1799, img: ZFold },
		{ id: 4, name: "Apple iPad 9 10.2 64GB Wi-Fi Silver 2021", price: 1499, img: Ipad },

	];

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [filter, setFilter] = useState(""); // current filter option

	// Sort products based on filter
	const sortedProducts = [...products].sort((a, b) => {
		if (filter === "low-to-high") return a.price - b.price;
		if (filter === "high-to-low") return b.price - a.price;
		return 0; // default = original order
	});

	const router = useRouter();
		
	const goToProductsDetail = () => {
		router.push("/productDetail");
	};

  return (
    <section className="px-4">
		{/* Header */}
		<div className="flex justify-end sm:justify-around space-x-3 items-center pt-4">
			{/* Category */}
			<div className="hidden sm:flex items-center space-x-4 ">
				<h1 className="text-[#A4A4A4] font-medium">Category</h1>
				<FiChevronRight size={20} className="text-[#A4A4A4]"/>
				<h1 className="text-black font-medium">Laptops</h1>
			</div>

			{/* Dropdown Filter */}
			<div className="relative inline-block w-48 shadow-md">
				<button
					onClick={() => setDropdownOpen(!dropdownOpen)}
					className="w-full rounded-lg border p-2 bg-white text-base flex justify-between items-center shadow-xs hover:bg-gray-50"
				>
					{filter === "low-to-high" ? "Price: Low → High": 
					filter === "high-to-low" ? "Price: High → Low": "Filter"}
					<span className={`ml-2 transform transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}><FiChevronDown size={20}/></span>
				</button>

				<div
					className={`absolute mt-2 w-full rounded-lg bg-white shadow-lg origin-top transition-all duration-200 ${
						dropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
					}`}
				>
					<button
						className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
						onClick={() => { setFilter("low-to-high"); setDropdownOpen(false); }}
					>
						Price: Low → High
					</button>
					<button
						className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
						onClick={() => { setFilter("high-to-low"); setDropdownOpen(false); }}
					>
						Price: High → Low
					</button>
				</div>
			</div>
		</div>

		{/*Product Lists */}
		<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-10 max-w-7xl mx-auto w-full">
			{sortedProducts.map((product) => (
				<div key={product.id} className="bg-[#F6F6F6] rounded-lg shadow-md flex flex-col justify-between items-center text-center p-6 hover:shadow-xl transition-all duration-300">
					<div>
						<Image 
							src={product.img} 
							alt={product.name} 
							width={800}
							height={800}
							className="w-full h-50 md:h-64 object-contain sm:mb-4"
							/>
					</div>
					<div>
						<h2 className="text-md md:text-lg font-semibold">{product.name}</h2>
						<h1 className="text-black font-semibold text-xl sm:text-2xl mt-2 mb-4">${product.price}</h1>
						<button 
							className="bg-black text-sm sm:text-base text-white rounded-lg py-3 px-8 md:px-12 whitespace-nowrap cursor-pointer"
							onClick={goToProductsDetail}
						>
						Buy Now
						</button>
					</div>
				</div>
			))}
		</div>

		{/* Pagination */}
		<div className="flex justify-center items-center space-x-3 my-5">		
				<button className="mr-4 py-2 cursor-pointer "><FiChevronLeft size={20}/></button>
				<button className="px-4 py-2 cursor-pointer text-center rounded-lg bg-black text-white">1</button>
				<button className="px-4 py-2 cursor-pointer text-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">2</button>
				<button className="px-4 py-2 cursor-pointer text-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">3</button>
				<button className="mr-4 py-2 cursor-pointer "><FiChevronRight size={20}/></button>
		</div>
    </section>
  );
}

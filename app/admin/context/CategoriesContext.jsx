"use client";
import { createContext, useState, useContext } from "react";

// Create context
const CategoriesContext = createContext();

// Provider component
export function CategoriesProvider({ children }) {
    const [categories, setCategories] = useState([
        { id: 1, name: "Laptops", description: "Asus, Msi, Macbook" },
        { id: 2, name: "Desktops", description: "Pc, Ram, Cpu" },
        { id: 3, name: "Phones", description: "Iphone, Samsung" },
        { id: 4, name: "Tablets", description: "Ipad Pro, Ipad Air" },
        { id: 5, name: "Smart Watches", description: "Apple Watch" },
        { id: 6, name: "Gaming", description: "Headphones, Console" },
    ]);

    return (
        <CategoriesContext.Provider value={{ categories, setCategories }}>
            {children}
        </CategoriesContext.Provider>
    );
}

// Custom hook for easy access
export function useCategories() {
    return useContext(CategoriesContext);
}

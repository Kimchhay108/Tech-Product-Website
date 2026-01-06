'use client';
import { createContext, useContext, useReducer, useEffect, useState } from "react";
import { getAuth } from "@/lib/auth";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

export const CartActions = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  UPDATE_QTY: "UPDATE_QTY",
  LOAD_CART: "LOAD_CART",
};

function cartReducer(state, action) {
    switch (action.type) {
        case CartActions.ADD:
            return [...state, action.payload];

        case CartActions.REMOVE:
            return state.filter((item) => item.cartItemId !== action.payload);

        case CartActions.UPDATE_QTY:
            return state.map(item =>
                item.cartItemId === action.payload.id
                ? { ...item, quantity: action.payload.quantity }
                : item
            );

        case CartActions.LOAD_CART:
            return action.payload;

        default:
            return state;
    }
}

// Helper function to save cart to MongoDB
async function saveCartToMongoDB(userId, items) {
    try {
        const response = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, items }),
        });
        const data = await response.json();
        console.log("💾 Save cart response:", data);
        if (!data.success) {
            console.error("❌ Failed to save cart to MongoDB:", data.message);
        }
    } catch (error) {
        console.error("❌ Save cart error:", error);
    }
}

// Helper function to load cart from MongoDB
async function loadCartFromMongoDB(userId) {
    try {
        console.log("📡 Fetching cart from API for userId:", userId);
        const res = await fetch(`/api/cart?userId=${userId}`);
        const data = await res.json();
        console.log("📡 API response:", data);
        
        if (!data.success) {
            console.error("❌ Failed to load cart:", data.message);
            return [];
        }
        
        return data.cart || [];
    } catch (error) {
        console.error("❌ Load cart error:", error);
        return [];
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, []);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load cart when user logs in or changes
    useEffect(() => {
        const loadUserCart = async () => {
            console.log("🔄 loadUserCart called");
            setIsLoading(true);
            const auth = getAuth();
            
            if (auth?.user?.uid) {
                const newUserId = auth.user.uid;
                console.log("👤 Current user ID:", newUserId);
                console.log("👤 Previous user ID:", currentUserId);
                
                // If user changed, force clear cart first
                if (currentUserId && currentUserId !== newUserId) {
                    console.log("🔄 User changed! Clearing old cart...");
                    dispatch({ type: CartActions.LOAD_CART, payload: [] });
                }
                
                setCurrentUserId(newUserId);
                console.log("📦 Loading cart from MongoDB for user:", newUserId);
                const cart = await loadCartFromMongoDB(newUserId);
                console.log("✅ Loaded cart from MongoDB:", cart);
                dispatch({ type: CartActions.LOAD_CART, payload: cart || [] });
            } else {
                // User logged out - clear everything
                console.log("🚪 User logged out, clearing cart");
                setCurrentUserId(null);
                dispatch({ type: CartActions.LOAD_CART, payload: [] });
            }
            setIsLoading(false);
        };

        loadUserCart();
        
        // Listen for custom cart-reload event
        const handleCartReload = () => {
            console.log("🔔 Cart reload event triggered");
            loadUserCart();
        };
        
        if (typeof window !== 'undefined') {
            window.addEventListener('cart-reload', handleCartReload);
            
            return () => {
                window.removeEventListener('cart-reload', handleCartReload);
            };
        }
    }, []); // Run on mount and when triggered by events

    // Save cart to MongoDB whenever it changes (if user is logged in)
    useEffect(() => {
        if (currentUserId && !isLoading && state) {
            console.log("💾 Saving cart to MongoDB for user:", currentUserId, "items:", state.length);
            saveCartToMongoDB(currentUserId, state);
        }
    }, [state, currentUserId, isLoading]);

    return (
        <CartStateContext.Provider value={state}>
            <CartDispatchContext.Provider value={dispatch}>
                {children}
            </CartDispatchContext.Provider>
        </CartStateContext.Provider>
    );
}

export function useCartState() {
  return useContext(CartStateContext);
}

export function useCartDispatch() {
  return useContext(CartDispatchContext);
}

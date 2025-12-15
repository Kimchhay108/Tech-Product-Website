'use client';
import { createContext, useContext, useReducer } from "react";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

export const CartActions = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  UPDATE_QTY: "UPDATE_QTY",
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

        default:
            return state;
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, []);
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

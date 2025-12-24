"use client";
import { products } from "../data/products";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    useCartState,
    useCartDispatch,
    CartActions,
} from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {


    
    const router = useRouter();

    const goToHome = () => {
        router.push("/home");
    }

    const goToCheckout = () => {
        router.push("/checkout");
    }

    const cart = useCartState();
    const dispatch = useCartDispatch();

    const removeItem = (id) =>
        dispatch({ type: CartActions.REMOVE, payload: id });
    const updateQty = (id, qty) =>
        dispatch({ type: CartActions.UPDATE_QTY, payload: { id, quantity: qty } });

    let subTotal = 0;
        cart.forEach(item => {
        subTotal += item.price * item.quantity;
        });

    let total = subTotal + 1.5;

    if (!cart || cart.length === 0) {
        return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 flex flex-col justify-start items-center p-8">
                <h1 className="text-2xl font-bold">Your cart is empty</h1>
                <h1 className="my-4">Check out our latest products with best price and quality</h1>
                <button
                    className="px-6 py-2 bg-black text-white rounded-lg cursor-pointer"
                    onClick={goToHome}
                >
                    Continue Shopping
                </button>
            </div>
          
        </div>
    );
    }

   return (
            <div className=" flex flex-col md:flex-row justify-center gap-10 p-8 md:min-h-screen">

                {/* Left Side */}
                <div className="space-y-4 md:w-1/2">
                    <h1 className="text-2xl font-bold">Shopping Cart</h1>

                    {/* Items */}
                    <div className="space-y-4">
                        {cart.map((item) => (
                        <div
                            key={item.cartItemId}
                            className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg"
                        >
                            <Link href={`/productDetail?category=${item.category}&id=${item.productId}`}>
                                {item.image && (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={100}
                                        height={100}
                                        className="object-contain"
                                    />
                                )}
                            </Link>
                            {/* Item Details */}
                            <div className="flex-1 space-y-1">
                                <h2 className="font-semibold">{item.name}</h2>

                                <p className="flex items-center gap-2 text-sm text-gray-600">
                                    {item.memory}
                                    <span
                                    style={{
                                        display: "inline-block",
                                        width: 15,
                                        height: 15,
                                        background: item.color,
                                        borderRadius: "50%",
                                    }}
                                    />
                                    ${item.price}
                                </p>
                            </div>

                            {/* Quantity + Remove */}
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center">
                                    <button
                                    className="px-3 py-1 bg-gray-200 rounded cursor-pointer"
                                    onClick={() => updateQty(item.cartItemId, Math.max(1, item.quantity - 1))}
                                    >
                                    -
                                    </button>

                                    <div className="px-3 py-1">{item.quantity}</div>

                                    <button
                                    className="px-3 py-1 bg-gray-200 rounded cursor-pointer"
                                    onClick={() => updateQty(item.cartItemId, item.quantity + 1)}
                                    >
                                    +
                                    </button>
                                </div>

                                <button
                                    className="text-red-600 text-sm cursor-pointer"
                                    onClick={() => removeItem(item.cartItemId)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-1/3 md:sticky md:top-[50px] md:self-start">
                    <div className="p-8 border-2 border-[#EBEBEB] rounded-xl space-y-4 ">
                        <h1 className="text-xl font-bold">Order Summary</h1>

                        <div className="flex justify-between text-lg font-semibold">
                            <span>Subtotal:</span>
                            <span>${subTotal}</span>
                        </div>

                        <div className="flex justify-between text-[#545454] text-md font-semibold">
                            <span>Delivery fee:</span>
                            <span>1.5$</span>
                        </div>

                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <button 
                            className="w-full bg-black text-white py-3 rounded-lg font-medium"
                            onClick={goToCheckout}
                        >
                        Proceed to Checkout
                        </button>
                    </div>
                </div>

            </div>
        );
    }

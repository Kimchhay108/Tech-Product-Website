"use client";
import Image from "next/image";
import Link from "next/link";
import {
    useCartState,
    useCartDispatch,
    CartActions,
} from "../context/CartContext";
import { useRouter } from "next/navigation";
import { FiShoppingBag, FiTrash2, FiArrowLeft, FiTruck, FiShield, FiCreditCard, FiPackage } from "react-icons/fi";

export default function CartPage() {
    const router = useRouter();

    const goToHome = () => {
        router.push("/products");
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

    const deliveryFee = 1.5;
    let total = subTotal + deliveryFee;

    const colorNames = {
        "#000000": "Space Black",
        "#E8E8E8": "Silver",
        "#781DBC": "Deep Purple",
        "#E1B000": "Gold"
    };

    if (!cart || cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="w-24 h-24 bg-[#F4F4F4] rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiShoppingBag size={48} className="text-[#797979]" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
                    <p className="text-gray-600 mb-6">
                        Discover our latest products with the best prices and quality
                    </p>
                    <button
                        className="w-full px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                        onClick={goToHome}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button 
                        onClick={goToHome}
                        className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-4 group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Continue Shopping
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="text-gray-600 mt-1">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side - Cart Items */}
                    <div className="flex-1 space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.cartItemId}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md"
                            >
                                <div className="flex gap-6">
                                    {/* Product Image */}
                                    <Link 
                                        href={`/productDetail/${item.productId}`}
                                        className="flex-shrink-0"
                                    >
                                        <div className="w-28 h-28 bg-gray-50 rounded-lg overflow-hidden group cursor-pointer">
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={120}
                                                    height={120}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                                                />
                                            )}
                                        </div>
                                    </Link>

                                    {/* Item Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <Link 
                                                href={`/productDetail/${item.productId}`}
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {item.name}
                                                </h2>
                                            </Link>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">Storage:</span>
                                                    <span className="font-medium text-gray-900">{item.memory}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">Color:</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span
                                                            className="w-5 h-5 rounded-full border-2 border-gray-300"
                                                            style={{ backgroundColor: item.color }}
                                                        />
                                                        <span className="font-medium text-gray-900">
                                                            {colorNames[item.color] || "Color"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price and Quantity Controls */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-4">
                                                {/* Quantity Selector */}
                                                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                                                    <button
                                                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors font-semibold text-gray-700"
                                                        onClick={() => updateQty(item.cartItemId, Math.max(1, item.quantity - 1))}
                                                    >
                                                        −
                                                    </button>
                                                    <div className="px-5 py-2 font-semibold text-gray-900 min-w-[60px] text-center bg-white">
                                                        {item.quantity}
                                                    </div>
                                                    <button
                                                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors font-semibold text-gray-700"
                                                        onClick={() => updateQty(item.cartItemId, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium"
                                                    onClick={() => removeItem(item.cartItemId)}
                                                >
                                                    <FiTrash2 size={18} />
                                                    <span className="hidden sm:inline">Remove</span>
                                                </button>
                                            </div>

                                            {/* Item Total Price */}
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                {item.quantity > 1 && (
                                                    <p className="text-sm text-gray-500">
                                                        ${item.price} each
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Benefits Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <div className="p-2 bg-[#F6F6F6] rounded-lg">
                                                                <FiTruck size={24} className="text-[#797979]" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">Fast Shipping</p>
                                                                <p className="text-xs text-gray-600">Only 1.5$ nationally</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-center  gap-3">
                                                            <div className="p-2 bg-[#F6F6F6] rounded-lg">
                                                                <FiShield size={24} className="text-[#797979]" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">2 Year Warranty</p>
                                                                <p className="text-xs text-gray-600">Full coverage</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-center gap-3">
                                                            <div className="p-2 bg-[#F6F6F6] rounded-lg">
                                                                <FiCreditCard size={24} className="text-[#797979]" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
                                                                <p className="text-xs text-gray-600">100% protected</p>
                                                            </div>
                                                        </div>
                                                    </div>
                    </div>

                    {/* Right Side - Order Summary */}
                    <div className="lg:w-96">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                                    <span className="font-semibold">${subTotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-gray-700">
                                    <span className="flex items-center gap-2">
                                        Shipping
                                    </span>
                                    <span className="font-semibold">
                                        {"$" + deliveryFee }
                                    </span>
                                </div>

                               

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-gray-900">
                                            ${total.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 text-right">
                                        Tax included
                                    </p>
                                </div>
                            </div>

                            <button
                                className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:shadow-md mb-3 cursor-pointer"
                                onClick={goToCheckout}
                            >
                                Proceed to Checkout
                            </button>

                            <button
                                className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-200 cursor-pointer"
                                onClick={goToHome}
                            >
                                Continue Shopping
                            </button>

                            {/* Security Badge */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                    <FiPackage size={16} />
                                    <span>Let get your items deliver to your door</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
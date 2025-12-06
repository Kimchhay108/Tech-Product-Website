'use client'

import React, { useState, useRef, useEffect } from "react";
import { useCartState } from "../context/CartContext";
import { FiChevronRight, FiX, FiChevronDown, FiSend, FiPhone, FiDollarSign } from "react-icons/fi";
import Image from "next/image";
import CreditCard from "../../assets/productDetail/CreditCard.png";
import KHQR from "../../assets/productDetail/KHQR.jpg";

export default function checkoutPage(){


    // ================ Summary ================

    const cart = useCartState(); // get real cart items
    const delivery = 1.5;
    const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity + delivery, 0);
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    // ================ Payment State ================

    const [selectedPayment, setSelectedPayment] = useState("card");

    // =====================================

    const [address, setAddress] = useState("None");
    const [modalOpen, setModalOpen] = useState(false);

    // ================ Modal =====================
    //country selection
    const [countryOpen, setCountryOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("Cambodia");

    //Province selection
    const [provinceOpen, setProvinceOpen] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState("Phnom Penh");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [fullAddress, setFullAddress] = useState("");

    const dropdownRef = useRef(null);

    const provinces = [
        "Phnom Penh","Banteay Meanchey","Battambang","Kampong Cham","Kampong Chhnang",
        "Kampong Speu","Kampong Thom","Kampot","Kandal","Koh Kong","Kratie","Mondulkiri",
        "Oddar Meanchey","Pursat","Preah Vihear","Prey Veng","Ratanakiri","Siem Reap",
        "Sihanoukville","Stung Treng","Svay Rieng","Takeo","Pailin","Tboung Khmum"
    ];

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setModalOpen(false);
                setProvinceOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // =====================================

    return(
        <section>
           
            {/* Main Container */}
            <div className="flex flex-col md:flex-row gap-10 container mx-auto p-2">

                {/* LEFT SIDE */}
                <div className="flex-1 space-y-6 py-5">

                    {/* Delivery Address */}
                    <div className="space-y-4">
                        <h1 className="text-xl font-bold">Delivery Address</h1>

                        <div className="bg-[#F6F6F6] flex items-center gap-4 p-4 rounded">
                            <input type="radio" defaultChecked />
                            <h1 className="flex-1">{address}</h1>
                            <a
                                href="#"
                                className="flex items-center"
                                onClick={(e) => { e.preventDefault(); setModalOpen(true); }}
                            >
                            Change Address <FiChevronRight />
                            </a>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-3 border border-[#EBEBEB] rounded-lg p-4">
                        <h1 className="text-xl font-bold">Summary</h1>
                        <div>
                            {cart.map(item => (
                                <div 
                                    key={item.id}
                                    className="bg-[#F6F6F6] p-3 rounded flex items-center justify-between gap-3"
                                >                   
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={600}
                                            height={600}
                                            className="w-24 h-24 object-cover"
                                        />

                                        <div>
                                            <p>{item.name}</p>
                                            <p className="text-sm text-[#A0A0A0]">Color: {item.color === "#000000"
                                                                                                        ? "Black"
                                                                                                        : item.color === "#E8E8E8"
                                                                                                        ? "Grey"
                                                                                                        : item.color === "#781DBC"
                                                                                                        ? "Blue"
                                                                                                        : item.color === "#E1B000"
                                                                                                        ? "Orange"
                                                                                                        : ""}</p>
                                            <p className="text-sm text-[#A0A0A0]">Memory: {item.memory}</p>
                                            <p className="text-sm text-[#A0A0A0]">Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="text-lg font-bold">${item.price}</p>
                                </div>
                            ))}
                        </div>
                        

                        <p className="text-sm">Address</p>
                        <p>{address}</p>
                        <p className="text-sm">Shipping Method</p>
                        <p>Motobike</p>

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
                            <span>${total}</span>
                        </div>

                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex-1 space-y-6 py-5">

                    {/* Payment */}
                    <div>
                        <p className="text-xl font-bold mb-4">Payment</p>
                        <div className="flex gap-10 mb-5">
                            <button 
                                onClick={() => setSelectedPayment("card")}
                                className={`${selectedPayment === "card" ? "font-bold border-b-2 border-black" : ""}`}
                            >
                                Credit Card
                            </button>

                            <button 
                                onClick={() => setSelectedPayment("khqr")}
                                className={`${selectedPayment === "khqr" ? "font-bold border-b-2 border-black" : ""}`}
                            >
                                KHQR
                            </button>

                            <button 
                                onClick={() => setSelectedPayment("cod")}
                                className={`${selectedPayment === "cod" ? "font-bold border-b-2 border-black" : ""}`}
                            >
                                Cash on Delivery
                            </button>
                        </div>
                    </div>

                    {/* Card Payment */}
                    {selectedPayment === "card" && (
                        <div>
                            <div className="mb-4">
                                <Image
                                    src={CreditCard}
                                    alt="CreditCard"
                                    width={800}
                                    height={800}
                                    className="w-64 h-auto"
                                />
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Cardholder Name"
                                    className="w-full p-3 border border-[#CECECE] rounded-md focus:outline-none"
                                />
                                <input
                                    type="number"
                                    placeholder="Card Number"
                                    className="w-full p-3 border border-[#CECECE] rounded-md focus:outline-none"
                                />
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Exp.Date"
                                        className="w-full p-3 border border-[#CECECE] rounded-md focus:outline-none"
                                    />
                                    <input
                                        type="number"
                                        placeholder="CVV"
                                        className="w-full p-3 border border-[#CECECE] rounded-md focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* KHQR Payment */}
                    {selectedPayment === "khqr" && (
                        <div>
                            <div className="">
                                <Image
                                    src={KHQR}
                                    alt="KHQR"
                                    width={800}
                                    height={800}
                                    className="w-64 h-auto rounded-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <p className="font-semibold">Please Scan the QR Code</p>
                                <p>Name: <span className="font-semibold">MARCH KIMHAB</span></p>
                                <p>Account Number: <span className="font-semibold">004 644 927</span></p>
                            </div>
                        </div>
                    )}

                    {/* COD Payment */}
                    {selectedPayment === "cod" && (
                        <div className="p-5 border rounded bg-gray-50">
                            <h2 className="text-lg font-bold mb-2">Thank You for your purchase</h2>
                            <FiDollarSign size={20} className="mb-2"/>
                            <p>You will pay when the product arrives.</p>
                        </div>
                    )}

                    {/* Preferred Contact */}
                    <div>
                        <p className="text-lg font-bold mb-3">Preferred contact line</p>
                        <div className="bg-gray-50 p-5 rounded-lg space-y-4">
                            
                            {/* Contact Options */}
                            <div className="flex items-center gap-6">
                            
                                {/* Phone */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4" />
                                    <span className="px-4 py-2 bg-white border rounded-sm flex items-center gap-2 whitespace-nowrap">
                                        <FiPhone size={18} /> Phone call
                                    </span>
                                </label>

                                {/* Telegram */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4" />
                                    <span className="px-4 py-2 bg-white border rounded-sm flex items-center gap-2">
                                        <FiSend size={18} /> Telegram
                                    </span>
                                </label>

                            </div>

                            {/* Phone Number Field */}
                            <input
                                type="text"
                                placeholder="012345678"
                                className="w-full p-3 border border-[#CECECE] rounded-lg focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <button className="w-full py-4 px-6 bg-black text-white font-bold rounded">
                        Checkout
                    </button>
                </div>
            </div>

        {/* Modal */}
        {modalOpen && (
            <div className="fixed inset-0 z-50 flex justify-center items-center py-2">
                {/* Overlay */}
                <div className="absolute inset-0 bg-black opacity-50 transition-opacity"></div>

                {/* Modal */}
                <div 
                    ref={dropdownRef} 
                    className="relative bg-white p-8 rounded-lg z-10 
                    w-[90%] max-w-md sm:max-w-lg md:max-w-xl"
                >
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-5">
                        <h1 className="text-2xl font-bold">EDIT ADDRESS</h1>
                        <FiX 
                            size={25} 
                            className="cursor-pointer"
                            onClick={() => setModalOpen(false)} 
                        />
                    </div>

                    {/* Name */}
                    <div className=" flex flex-col md:flex-row gap-4 mb-4">
                        <div className="w-full">
                            <p>First Name</p>
                            <input 
                                type="text" 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-2 py-3 border border-[#A0A0A0] rounded focus:outline-none hover:border-black" 
                                placeholder="Enter first name"
                            />
                        </div> 
                        <div className="w-full">
                            <p>Last Name</p>
                            <input 
                                type="text" 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-2 py-3 border border-[#A0A0A0] rounded focus:outline-none hover:border-black" 
                                placeholder="Enter Last name"
                            />
                        </div>    
                    </div>

                    {/* Telephone */}
                    <div className="mb-4">
                        <p>Telephone(Required)</p>
                        <input 
                            type="tel" 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-2 py-3 border border-[#A0A0A0] rounded focus:outline-none hover:border-black" 
                            placeholder="+855"
                            required
                        />
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                        <p>Address(Required)</p>
                        <input 
                            type="text" 
                            value={fullAddress}
                            onChange={(e) => setFullAddress(e.target.value)}
                            className="w-full px-2 py-3 border border-[#A0A0A0] rounded focus:outline-none hover:border-black" 
                            placeholder="Street, Apartment, Building, Floor"
                            required
                        />
                    </div>

                    {/* Country & Province */}
                    <div className="flex gap-4 mb-4">

                       {/* Country */}
                    <div className="flex-1 relative">
                        <label className="block mb-1">Country</label>

                        <button
                            type="button"
                            onClick={() => setCountryOpen(!countryOpen)}
                            className="w-full px-2 py-3 border border-[#A0A0A0] rounded flex justify-between items-center hover:border-black"
                        >
                            {selectedCountry}
                            <FiChevronDown className={`transition-transform duration-300 ${countryOpen ? "rotate-180" : ""}`} />
                        </button>

                        <div
                            className={`
                                absolute top-full left-0 w-full bg-white shadow-lg rounded z-50
                                transition-all duration-300 overflow-hidden
                                ${countryOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
                            `}
                        >
                            <div className="max-h-40 overflow-y-auto">
                                {["Cambodia"].map((country, idx) => (
                                    <button
                                        key={idx}
                                        className="w-full px-2 py-3 text-left hover:bg-gray-100"
                                        onClick={() => {
                                            setSelectedCountry(country);
                                            setCountryOpen(false);
                                        }}
                                    >
                                        {country}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>


                        {/* Province */}
                        <div className="flex-1 relative">
                            <label className="block mb-1">City/Province</label>

                            {/* Trigger Button */}
                            <button
                                type="button"
                                onClick={() => setProvinceOpen(!provinceOpen)}
                                className="w-full px-2 py-3 border border-[#A0A0A0] rounded flex justify-between items-center focus:outline-none hover:border-black"
                            >
                                {selectedProvince}
                                <FiChevronDown
                                    className={`transition-transform duration-300 ${provinceOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Smooth Dropdown */}
                            <div
                                className={`
                                    absolute top-full left-0 w-full bg-white shadow-lg rounded z-50 
                                    transition-all duration-300 overflow-hidden
                                    ${provinceOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}
                                `}
                            >
                                {/* Scrollable inner list */}
                                <div className="max-h-60 overflow-y-auto">
                                    {provinces.map((prov, idx) => (
                                        <button
                                            key={idx}
                                            className="w-full px-2 py-3 text-sm font-medium text-left cursor-pointer hover:bg-[#F4F4F4] transition-colors"
                                            onClick={() => {
                                                setSelectedProvince(prov);
                                                setProvinceOpen(false);
                                            }}
                                        >
                                            {prov}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        className="w-full bg-black text-white py-3 rounded font-bold mt-2 cursor-pointer "
                        onClick={() => {
                            const formattedAddress = `
                        ${firstName} ${lastName}
                        ${phoneNumber}
                        ${fullAddress}
                        ${selectedProvince}
                                `.trim();

                                setAddress(formattedAddress);
                                setModalOpen(false);
                            }}
                    >
                        Save Address
                    </button>
                </div>
            </div>
        )}

        </section>
    )
}
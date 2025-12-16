'use client'

import { FiChevronRight, FiUser, FiShield, FiShoppingBag } from "react-icons/fi";
import React, { useState } from "react";

export default function userProfile(){

    const [selectedFeature, setSelectedFeature] = useState("profile");

    return(
        <section className="md:min-h-screen container mx-auto">
            <div className="w-full my-2 flex p-3">
                {/* Left Bar */}
                <div className="w-1/4 pr-3">
                    <h1 className="text-lg mb-3">Me</h1>
                    <ul className="ml-4">
                        <li 
                            onClick={() => setSelectedFeature("profile")}
                            className={`${selectedFeature === "profile" ? "flex items-center justify-between font-semibold mb-2" : "flex items-center justify-between mb-2" }`}
                        >
                            Profile
                            <FiChevronRight />
                        </li>
                        <li 
                            onClick={() => setSelectedFeature("myOrder")}
                            className={`${selectedFeature === "myOrder" ? "flex items-center justify-between font-semibold" : "flex items-center justify-between" }`}
                        >
                            My orders
                            <FiChevronRight />
                        </li>
                    </ul>
                </div>

                {/* Right content (My Profile)*/}
                {selectedFeature === "profile" && (
                    <div className="w-full">
                        <div className="flex justify-center items-center mb-5">
                            <p className="text-xl text-center font-medium flex items-center gap-2 ">
                                Profile <FiUser size={25} />
                            </p>
                        </div>

                        <div className="md:w-1/2 mx-auto mb-5">
                            <div className="w-full">
                                {/* Gender */}
                                <div className="flex items-center gap-5 mb-3">
                                    <p className="font-medium">Gender (Required)</p>
                                    <label className="flex items-center gap-1">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            className="accent-black"
                                        />
                                        Male
                                    </label>

                                    <label className="flex items-center gap-1">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            className="accent-black"
                                        />
                                        Female
                                    </label>
                                </div>
                                {/* Name */}
                                <div className=" flex flex-col md:flex-row gap-4 mb-2">
                                    <div className="w-full">
                                        <label className="block mb-1 font-medium">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-2 py-2 border border-[#A0A0A0] rounded focus:outline-none focus:border-black hover:border-black"
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="block mb-1 font-medium">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-2 py-2 border border-[#A0A0A0] rounded focus:outline-none focus:border-black hover:border-black"
                                            placeholder="Enter Last name"
                                        />
                                    </div>
                                </div>
                                {/* Email */}
                                <div className="mb-2">
                                    <label className="block mb-1 font-medium">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-2 border border-[#A0A0A0] rounded focus:outline-none focus:border-black hover:border-black"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {/* Date of birth */}
                                <div className="mb-5">
                                    <label className="block mb-1 font-medium">
                                        Date of birth
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-[#A0A0A0] rounded focus:outline-none focus:border-black hover:border-black"
                                        placeholder="Enter your Date of birth"
                                    />
                                </div>

                                {/* Update profile btn */}
                                <button type="submit" className="w-full py-2 bg-black text-white rounded font-semibold mb-4 cursor-pointer">
                                    Update
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center items-center mb-5">
                            <p className="text-lg text-center font-medium flex items-center gap-2 ">
                                Change Password <FiShield size={20} />
                            </p>
                        </div>
                        <div className="md:w-1/2 mx-auto">
                            <div className="w-full">
                                {/* Old Password */}
                                <div className="mb-2">
                                    <label className="block mb-1 font-medium">
                                        Old Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-3 py-2 border border-[#A0A0A0] rounded focus:outline-none focus:border-black hover:border-black"
                                        placeholder="Enter your old password"
                                    />
                                </div>
                                {/* New Password */}
                                <div className="mb-5">
                                    <label className="block mb-1 font-medium">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-3 py-2 border border-[#A0A0A0] rounded focus:outline-none focus:border-black hover:border-black"
                                        placeholder="Enter your new password"
                                    />
                                </div>
                                {/* Confirm New Password */}
                                <div className="mb-5">
                                    <label className="block mb-1 font-medium">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-3 py-2 border border-[#A0A0A0] rounded focus:outline-none focus:border-black hover:border-black"
                                        placeholder="Confirm your new password"
                                    />
                                </div>

                                {/* Confirm Change btn */}
                                <button type="submit" className="w-full py-2 bg-black text-white rounded font-semibold mb-4 cursor-pointer">
                                    Confirm Change
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Right content (My Order)*/}
                {selectedFeature === "myOrder" && (
                    <div className="w-full">
                        <div className="flex justify-center items-center mb-5">
                            <p className="text-lg text-center font-medium flex items-center gap-2 ">
                                Order History <FiShoppingBag size={20} />
                            </p>
                        </div>

                        
                    </div>
                )}
            
            </div>
        </section>
    );
}
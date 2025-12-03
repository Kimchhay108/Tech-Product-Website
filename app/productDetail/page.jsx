'use client'
import { useState } from "react";
import Image from "next/image"

import IP14prm from "../../assets/productDetail/IP14prm.png";
import FrontIP14prm from "../../assets/productDetail/FrontIP14prm.png";
import BackIP14prm from "../../assets/productDetail/BackIP14prm.png";
import SideIP14prm from "../../assets/productDetail/SideIP14prm.png";
import { FiPlus, FiMinus} from "react-icons/fi";

export default function ProductsDetai(){

    //Left Side
    const images = [IP14prm, FrontIP14prm, BackIP14prm, SideIP14prm];
    const [bigImage, setBigImage] = useState(IP14prm);

    //Right Side
    //Save selected color
    const colors = ["#000000", "#E8E8E8", "#781DBC", "#E1B000"];
    //setSelectedColor will set the selectedColor to the one that we just clicked
    const [selectedColor, setSelectedColor] = useState("#000000");

    //Save selected memory
    const memories = ["128GB", "256GB", "512GB", "1TB"];
    //Same flow...
    const [selectedMemory, setSelectedMemory] = useState("128GB");
    
    const phoneDetails = [
                        {
                            part: "Screen Size",
                            detail: "6.7"
                        }, 
                        {
                            part: "CPU",
                            detail: "Apple A16 Bionic"
                        }, 
                        {
                            part: "Number of Cores",
                            detail: "6"
                        }, 
                        {
                            part: "Main camera",
                            detail: "48-12 -12 MP"
                        }, 
                        {
                            part: "Front-camera",
                            detail: "12 MP"
                        }, 
                        {
                            part: "Battery capacity",
                            detail: "4323 mAh"
                        }, 
                    ]

    const description = "The iPhone is a line of Apple-designed smartphones that integrate a mobile phone, digital camera, music/video player, and personal computer into a single device, notable for its touch-sensitive screen interface.";

    //Quantity
    const [quantity, setQuantity] = useState(1);    

    const increase = () => setQuantity(prev => prev + 1);
    const decrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    
    return(
        <>
            <section className="px-3 md:py-20">
                <div className="md:max-w-7xl mx-auto h-auto flex flex-col md:flex-row ">
                    {/* Left Side */}
                    <div className="md:w-1/2 mx-auto  h-auto flex flex-col md:flex-row justify-center items-center py-10 ">

                        {/* Small img */}
                        <div className="hidden md:flex flex-row md:flex-col gap-4 justify-center">
                            {images.map((img, index) => (
                                <Image 
                                key={index}
                                src={img} 
                                alt="small images" 
                                width={800}
                                height={800}
                                className="w-20 h-auto object-contain cursor-pointer"
                                onClick={() => setBigImage(img)}
                            /> 
                            ))}    
                        </div>
                        {/* Big img */}
                        <div className="flex justify-center items-center my-4">
                            <Image 
                                src={bigImage} 
                                alt="IP14prm" 
                                width={800}
                                height={800}
                                className="w-80 md:w-94 h-auto object-contain "
                            /> 
                        </div>

                        {/* Small img for mobile */}
                        <div className="flex md:hidden flex-row md:flex-col gap-4 justify-center">
                            {images.map((img, index) => (
                                <Image 
                                key={index}
                                src={img} 
                                alt="small images" 
                                width={800}
                                height={800}
                                className="w-20 h-auto object-contain cursor-pointer"
                                onClick={() => setBigImage(img)}
                            /> 
                            ))}    
                        </div>   
                    </div>
                    {/* Right Side */}
                    <div className="md:w-1/2 mx-auto flex flex-col space-y-3 my-4">
                        <div >
                            <h1 className="mb-3 text-3xl font-bold">Apple iPhone 14 Pro Max</h1>
                            <h2 className="text-2xl font-semibold">$1399</h2>
                        </div>
                        <div className="flex gap-3 items-center">
                            <p>Select color:</p>
                            {colors.map((color, index) => (
                                <div 
                                    key={index}
                                    onClick={() => setSelectedColor(color)}
                                    className={`
                                        w-8 h-8 rounded-full ${selectedColor == color ? "ring-1 ring-gray" : "" }
                                    `}
                                    style={{ backgroundColor : color}}
                                ></div>   
                            ))}
                        </div>

                        {/* Choose memory */}
                        <div className="grid grid-cols-4 gap-3">
                            {memories.map((memory, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedMemory(memory)}
                                    className={`
                                        py-3 px-6 rounded-md text-[#A0A0A0] border-1  ${selectedMemory == memory ? "border-1 text-black" : ""}
                                    `}
                                >
                                    {memory}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {phoneDetails.map((phoneDetail, index) => (
                                <div 
                                    key={index}
                                    className="bg-[#F4F4F4] p-4 px-6 rounded-md"

                                >
                                   <p className="text-[#A7A7A7] text-sm">{phoneDetail.part}</p>
                                   <p className="text-sm">{phoneDetail.detail}</p>
                              </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-sm text-[#6C6C6C]">{description}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-lg font-medium">Quantity</p>
                            <div className="flex gap-3">
                                <button
                                onClick={decrease}
                                className="px-5 py-2 text-xl bg-[#F4F4F4] rounded hover:bg-gray-200"
                                >
                                    <FiMinus/>
                                </button>

                                <span className="w-16 py-2 text-lg text-center bg-[#F4F4F4] rounded ">{quantity}</span>

                                <button
                                    onClick={increase}
                                    className="px-5 py-2 text-xl bg-[#F4F4F4] rounded hover:bg-gray-200"
                                >
                                    <FiPlus/>
                                </button>
                            </div>
                            <div >
                                
                                <button className="w-full py-3 bg-black text-white font-semibold rounded-lg cursor-pointer">Add to Cart</button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; // Fix for useRouter

import IphoneImage from "../../assets/home/IphoneImage.png";
import Airpods from "../../assets/home/Airpods.png";
import Ps5 from "../../assets/home/Ps5.png";
import Vision from "../../assets/home/Vision.png";
import MacbookPro from "../../assets/home/MacbookPro.png";
import Earbud from "../../assets/home/EarBud.png";
import Ip14prm from "../../assets/home/Ip14prm.png";
import Watches from "../../assets/home/Watches.png";
import ZFold from "../../assets/home/ZFold.png";
import Samsung from "../../assets/home/Samsung.png";
import Ipad from "../../assets/home/Ipad.png";

import { FaLaptop } from "react-icons/fa6";
import {
  FiMonitor,
  FiSmartphone,
  FiTablet,
  FiWatch,
  FiHeadphones,
} from "react-icons/fi";

export default function HomePage() {

    // const router = useRouter();
  const router = useRouter();

  const goToProducts = () => {
    router.push("/productpage");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#211C24]">
        <div className="container mx-auto px-5 sm:px-10 flex flex-col md:flex-row md:items-end ">
          {/* Text / Left side */}
          <div className="md:w-1/2 flex flex-col justify-center md:justify-start py-20 md:py-40 mx-10 text-center md:text-start">
            <h1 className="text-[var(--secondary)] text-xl mt-3">Pro.Beyond.</h1>
            <h1 className="text-white my-2 text-6xl">
              IPhone 14 <b>Pro</b>
            </h1>
            <p className="text-[var(--secondary)] text-md">
              Created to change everything for the better. For everyone
            </p>
            <div>
                <button
                className="text-white border border-white rounded-md py-3 px-10 my-3 cursor-pointer"
                onClick={goToProducts}
                >
                Shop Now
                </button>
            </div>
          </div>
            
          {/* Image / Right side */}
          <div className="md:w-1/2 flex h-full justify-center md:justify-center">
            <Image
              src={IphoneImage}
              alt="iphone 14 pro"
              width={1440}
              height={632}
              className="w-64 h-auto md:w-84"
            />
          </div>
        </div>
      </section>

      {/* Display Section */}
      <section className="bg-white">
        <div className="max-w-8xl mx-auto flex flex-col md:flex-row">
          {/* Left side */}
          <div className="md:w-1/2 grid grid-cols-1 md:grid-cols-2 ">
            {/* Ps5 */}
            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center justify-center bg-white h-[600px] md:h-[300px]">
              <div className="w-full md:w-1/2 flex items-end justify-center">
                <Image
                  src={Ps5}
                  alt="Ps5"
                  width={600}
                  height={600}
                  className="w-110 md:w-full h-full object-contain"
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-start py-5 px-4">
                <h1 className="text-xl sm:text-4xl md:text-3xl lg:text-5xl font-bold py-3">
                  Playstation 5
                </h1>
                <p className="text-[var(--secondary)] text-base sm:text-base md:text-sm lg:text-base">
                  Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O
                  will redefine your PlayStation experience.
                </p>
              </div>
            </div>

            {/* Airpods */}
            <div className="flex flex-col md:flex-row items-center justify-center bg-[#EDEDED] py-10 md:py-0">
              <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end md:overflow-hidden">
                <Image
                  src={Airpods}
                  alt="Airpods"
                  width={600}
                  height={600}
                  className="w-64 sm:w-80 md:max-w-md lg:max-w-lg h-auto object-contain md:me-5"
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-start py-5 px-4">
                <h1 className="text-xl sm:text-3xl md:text-2xl lg:text-3xl font-semibold">
                  Apple AirPods Max
                </h1>
                <p className="text-[var(--secondary)] text-base sm:text-base md:text-sm lg:text-base">
                  Computational audio. Listen, it's powerful.
                </p>
              </div>
            </div>

            {/* Macbook Pro */}
            <div className="flex flex-col md:flex-row items-center justify-center bg-[#353535] py-10 md:py-0">
              <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end md:overflow-hidden">
                <Image
                  src={MacbookPro}
                  alt="MacbookPro"
                  width={600}
                  height={600}
                  className="w-64 sm:w-80 md:max-w-md lg:max-w-lg h-auto object-contain md:me-5"
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-start py-5 px-4">
                <h1 className="text-white text-xl sm:text-3xl md:text-2xl lg:text-3xl font-semibold">
                  Apple Macbook Pro
                </h1>
                <p className="text-[var(--secondary)] text-base sm:text-base md:text-sm lg:text-base">
                  Great ideas start on Mac
                </p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="md:w-1/2 bg-[#EDEDED]">
            <div className="w-full h-full flex flex-col md:flex-row justify-center items-center py-10">
              <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start pl-10">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                  Vision <b>Pro</b>
                </h1>
                <p className="text-[var(--secondary)] text-base sm:text-base md:text-sm lg:text-base py-3">
                  An immersive way to experience entertainment
                </p>
                <button
                  className="text-sm sm:text-base md:text-lg lg:text-xl text-black border rounded-lg py-3 px-9 my-3 hidden md:block"
                  onClick={goToProducts}
                >
                  Shop Now
                </button>
              </div>
              <div className="w-full md:w-1/2 flex items-center justify-center py-3">
                <Image
                  src={Vision}
                  alt="Vision"
                  width={600}
                  height={600}
                  className="w-72 md:w-full h-auto object-contain"
                />
              </div>
              <button
                className="text-sm sm:text-base md:text-lg lg:text-xl text-black border rounded-lg py-3 px-9 my-3 md:hidden"
                onClick={goToProducts}
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Browse By Category */}
      <section className="bg-[#FAFAFA] px-5">
        <div className="max-w-7xl mx-auto py-15">
          <h1 className="text-2xl md:text-3xl font-bold mb-10 text-center md:text-left">
            Browse By Category
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-10">
            <div className="bg-[#EDEDED] p-8 rounded shadow flex flex-col justify-center items-center">
              <FaLaptop className="text-4xl sm:text-4xl md:text-4xl" />
              <p className="text-base md:text-lg lg:text-lg font-bold mt-2">Laptops</p>
            </div>
            <div className="bg-[#EDEDED] p-8 rounded shadow flex flex-col justify-center items-center">
              <FiMonitor className="text-4xl" />
              <p className="text-base md:text-lg lg:text-lg font-bold mt-2">Desktops</p>
            </div>
            <div className="bg-[#EDEDED] p-8 rounded shadow flex flex-col justify-center items-center">
              <FiSmartphone className="text-4xl" />
              <p className="text-base md:text-lg lg:text-lg font-bold mt-2">Phones</p>
            </div>
            <div className="bg-[#EDEDED] p-8 rounded shadow flex flex-col justify-center items-center">
              <FiTablet className="text-4xl" />
              <p className="text-base md:text-lg lg:text-lg font-bold mt-2">Tablets</p>
            </div>
            <div className="bg-[#EDEDED] p-8 rounded shadow flex flex-col justify-center items-center">
              <FiWatch className="text-4xl" />
              <p className="text-base md:text-lg lg:text-lg font-bold mt-2 text-center">
                Smart Watch
              </p>
            </div>
            <div className="bg-[#EDEDED] p-8 rounded shadow flex flex-col justify-center items-center">
              <FiHeadphones className="text-4xl" />
              <p className="text-base md:text-lg lg:text-lg font-bold mt-2">Gaming</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals & Products Grid */}
      <section className="px-3">
        <div className="max-w-7xl mx-auto py-15">
          {/* Header Tabs */}
          <div className="flex space-x-7 justify-center md:justify-start items-center text-start mb-5">
            <p className="text-base md:text-lg lg:text-xl text-[#8B8B8B] active">
              New Arrival
            </p>
            <p className="text-base md:text-lg lg:text-xl text-[#8B8B8B] hover:text-black">
              BestSeller
            </p>
            <p className="text-base md:text-lg lg:text-xl text-[#8B8B8B] hover:text-black">
              Special Offers
            </p>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Product 1 */}
            <div className="bg-[#F6F6F6] p-5 rounded text-center text-black hover:shadow-md flex flex-col h-full">
              <Image
                src={Ip14prm}
                alt="Iphone 14 pro max"
                width={600}
                height={600}
                className="w-64 h-auto object-contain mx-auto p-5"
              />
              <h1 className="text-base sm:text-md md:text-lg font-semibold mb-auto">
                Apple iPhone 14 Pro Max 128GB Deep Purple
              </h1>
              <h1 className="text-3xl font-semibold my-3">$900</h1>
              <button
                className="bg-black text-white text-sm sm:text-base py-4 px-10 rounded-2xl cursor-pointer"
                onClick={goToProducts}
              >
                Buy Now
              </button>
            </div>

            {/* Product 2 */}
            <div className="bg-[#F6F6F6] p-5 rounded text-center text-black hover:shadow-md flex flex-col h-full">
              <Image
                src={ZFold}
                alt="Z fold"
                width={800}
                height={600}
                className="w-64 h-auto object-contain mx-auto p-5"
              />
              <h1 className="text-base sm:text-md md:text-lg font-semibold mb-auto">
                Galaxy Z Fold5 Unlocked | 256GB | Phantom Black
              </h1>
              <h1 className="text-3xl font-semibold my-3">$1799</h1>
              <button
                className="bg-black text-white text-sm sm:text-base py-4 px-8 rounded-2xl cursor-pointer"
                onClick={goToProducts}
              >
                Buy Now
              </button>
            </div>

            {/* Product 3 */}
            <div className="bg-[#F6F6F6] p-5 rounded text-center text-black hover:shadow-md flex flex-col h-full">
              <Image
                src={Watches}
                alt="Apple Watch Series 9"
                width={600}
                height={600}
                className="w-64 h-auto object-contain mx-auto p-5"
              />
              <h1 className="text-base sm:text-md md:text-lg font-semibold mb-auto">
                Apple Watch Series 9 GPS 41mm Starlight Aluminium Case
              </h1>
              <h1 className="text-3xl font-semibold my-3">$399</h1>
              <button
                className="bg-black text-white text-sm sm:text-base py-4 px-8 rounded-2xl cursor-pointer"
                onClick={goToProducts}
              >
                Buy Now
              </button>
            </div>

            {/* Product 4 */}
            <div className="bg-[#F6F6F6] p-5 rounded text-center text-black hover:shadow-md flex flex-col h-full">
              <Image
                src={Earbud}
                alt="Galaxy Buds"
                width={600}
                height={600}
                className="w-64 h-auto object-contain mx-auto p-5"
              />
              <h1 className="text-base sm:text-md md:text-lg font-semibold mb-auto">
                Galaxy Buds FE Graphite
              </h1>
              <h1 className="text-3xl font-semibold my-3">$99.99</h1>
              <button
                className="bg-black text-white text-sm sm:text-base py-4 px-8 rounded-2xl cursor-pointer"
                onClick={goToProducts}
              >
                Buy Now
              </button>
            </div>

            {/* Add remaining products similarly (5-8) */}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section>
        <div className="flex flex-col md:flex-row w-full">
          {/* Featured Product 1 */}
          <div className="bg-[#FFFFFF] md:w-1/4 p-5 flex flex-col justify-between space-y-10">
            <div>
              <Image
                src={Ip14prm}
                width={600}
                height={600}
                alt="Apple iPhone 14 Pro Max"
                className="max-w-full max-h-84 mx-auto object-contain"
              />
            </div>
            <div className="text-center md:text-start py-5">
              <h1 className="text-2xl">Apple iPhone 14 Pro Max</h1>
              <h1 className="text-xs text-[#909090] my-3">
                Think different, everything different.
              </h1>
              <button
                className="border-1 border-black-500 px-8 py-3 font-semibold rounded-md cursor-pointer"
                onClick={goToProducts}
              >
                Shop Now
              </button>
            </div>
          </div>

          {/* Featured Product 2 */}
          <div className="bg-[#F9F9F9] md:w-1/4 p-5 flex flex-col justify-between space-y-10">
            <div>
              <Image
                src={Ipad}
                width={600}
                height={600}
                alt="Ipad Pro"
                className="max-w-full max-h-84 mx-auto object-contain"
              />
            </div>
            <div className="text-center md:text-start py-5">
              <h1 className="text-2xl">Ipad Pro</h1>
              <h1 className="text-xs text-[#909090] my-3">
                iPad combines a magnificent 10.2-inch Retina display, incredible
                performance, multitasking and ease of use.
              </h1>
              <button
                className="border-1 border-black-500 px-8 py-3 font-semibold rounded-md cursor-pointer"
                onClick={goToProducts}
              >
                Shop Now
              </button>
            </div>
          </div>

          {/* Featured Product 3 */}
          <div className="bg-[#EAEAEA] md:w-1/4 p-5 flex flex-col justify-between space-y-10">
            <div>
              <Image
                src={Watches}
                width={600}
                height={600}
                alt="Apple Watch Series 9"
                className="max-w-full max-h-84 mx-auto object-contain"
              />
            </div>
            <div className="text-center md:text-start py-5">
              <h1 className="text-2xl">Apple Watch Series 9</h1>
              <h1 className="text-xs text-[#909090] my-3">
                Introducing Apple Watch Series 9
              </h1>
              <button
                className="border-1 border-black-500 px-8 py-3 font-semibold rounded-md cursor-pointer"
                onClick={goToProducts}
              >
                Shop Now
              </button>
            </div>
          </div>

          {/* Featured Product 4 */}
          <div className="bg-[#2C2C2C] md:w-1/4 p-5 flex flex-col justify-between space-y-10">
            <div>
              <Image
                src={ZFold}
                width={800}
                height={800}
                alt="Galaxy Z Fold5"
                className="max-w-full max-h-84 mx-auto object-contain"
              />
            </div>
            <div className="text-center md:text-start py-5">
              <h1 className="text-white text-2xl">Galaxy Z Fold5</h1>
              <h1 className="text-xs text-[#909090] my-3">Join the flip side</h1>
              <button
                className="border-1 text-white px-8 py-3 font-semibold rounded-md cursor-pointer"
                onClick={goToProducts}
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

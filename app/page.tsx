import Image from "next/image";
import { FaAngleDown, FaGear, FaLocationDot } from "react-icons/fa6";
import { HiMiniSparkles } from "react-icons/hi2";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center font-sans bg-gray-100">
      <div className="fixed flex flex-row gap-6 items-center justify-between top-10 right-10">
        <div className="flex flex-row gap-2 items-center bg-black rounded-md py-2 px-4">
          <FaLocationDot className="text-gray-100 text-xl" />
          <h1 className="text-gray-100">Location</h1>
        </div>
        <div className="bg-black rounded-md p-2.5">
          <FaGear className="text-gray-100 text-xl" />
        </div>
      </div>
      <h1 className="text-4xl text-black font-bold">GAMBIT</h1>
      <h2 className="text-gray-500">
        Gaming Analysis & Machine-Based Intelligence Tracker
      </h2>

      <div className="mt-6 flex flex-row w-1/4 px-4 items-center justify-between">
        <button className="bg-black text-white px-4 py-2 rounded-md">
          Run Search
        </button>
        <div className="flex flex-row gap-2 items-center">
          <HiMiniSparkles className="text-black" />
          <h1 className="text-black text-sm">Gemini 2.5-Flash</h1>
          <FaAngleDown className="text-black text-sm" />
        </div>
      </div>
    </div>
  );
}

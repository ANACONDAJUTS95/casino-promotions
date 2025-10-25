"use client";

import { useState, useEffect } from "react";
import { FaGear, FaLocationDot } from "react-icons/fa6";
import { IoMdRefresh } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { CasinoDataTable } from "@/components/CasinoDataTable";
import { ModelSelector } from "@/components/ModelSelector";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { InsightsDashboard } from "@/components/InsightsDashboard";
import { analyzeCoverage } from "@/lib/utils/gap-analysis";
import { casinoOffers } from "@/lib/data/casino-offers";

export default function Home() {
  const [searchStarted, setSearchStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [selectedModel, setSelectedModel] = useState("Gemini 2.5 Pro");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scheduleRun, setScheduleRun] = useState(true);
  const [showInsights, setShowInsights] = useState(false);
  const [activeStates, setActiveStates] = useState({
    newJersey: true,
    michigan: true,
    pennsylvania: true,
    westVirginia: true,
  });

  // Calculate coverage statistics
  const filteredOffers = casinoOffers.filter((offer) => {
    const stateName = offer.state.Name;
    if (stateName === "New Jersey") return activeStates.newJersey;
    if (stateName === "Michigan") return activeStates.michigan;
    if (stateName === "Pennsylvania") return activeStates.pennsylvania;
    if (stateName === "West Virginia") return activeStates.westVirginia;
    return false;
  });
  const coverageStats = analyzeCoverage(filteredOffers);

  const handleRunSearch = () => {
    setSearchStarted(true);
  };

  const handleRefresh = () => {
    setTimeLeft(90);
    // TODO: Add actual data refresh logic here when real-time data is available
    console.log("Refreshing data...");
  };

  const handleStateChange = (
    state: keyof typeof activeStates,
    enabled: boolean
  ) => {
    setActiveStates((prev) => ({
      ...prev,
      [state]: enabled,
    }));
  };

  // Countdown timer effect
  useEffect(() => {
    if (!searchStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Timer reached 0, refresh and reset
          handleRefresh();
          return 90;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [searchStarted]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-100">
      {/* Fixed Header Controls */}
      <motion.div
        className="fixed flex flex-row gap-6 items-center justify-between top-10 right-10 z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-row gap-2 items-center bg-black rounded-md py-2 px-4 cursor-pointer hover:bg-gray-800 transition-colors">
          <FaLocationDot className="text-gray-100 text-xl" />
          <h1 className="text-gray-100">Location</h1>
        </div>
        <div
          onClick={() => setIsSettingsOpen(true)}
          className="bg-black rounded-md p-2.5 cursor-pointer hover:bg-gray-800 transition-colors"
        >
          <FaGear className="text-gray-100 text-xl" />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!searchStarted ? (
          /* Initial Centered View */
          <motion.div
            key="initial-view"
            className="flex flex-col min-h-screen items-center justify-center"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <motion.h1
              className="text-4xl text-black font-bold"
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              GAMBIT
            </motion.h1>
            <motion.h2
              className="text-gray-500"
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Gaming Analysis & Machine-Based Intelligence Tracker
            </motion.h2>

            <motion.div
              className="mt-6 flex flex-row w-1/4 px-4 items-center justify-between"
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={handleRunSearch}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Run Search
              </button>
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                variant="dark"
              />
            </motion.div>
          </motion.div>
        ) : (
          /* Search Results View */
          <motion.div
            key="results-view"
            className="flex flex-col w-full px-8 pt-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="text-3xl text-black font-bold">
                GAMBIT
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Gaming Analysis & Machine-Based Intelligence Tracker
              </p>
            </motion.div>

            {/* Search Results */}
            <motion.div
              className="flex flex-row items-center justify-between mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex flex-row gap-6 items-center">
                <div className="flex flex-row gap-2 items-center">
                  <span className="text-black text-xl font-bold">Search Results</span>
                  {coverageStats.gaps.length > 0 && (
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                      {coverageStats.gaps.length} gaps
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleRefresh}
                    className="flex flex-row gap-2 items-center bg-black rounded-md py-2 px-4 hover:bg-gray-800 transition-colors"
                  >
                    <IoMdRefresh className="text-white" />
                    <span className="text-white">Refresh</span>
                    <span className="text-white/50 text-sm py-0.5 rounded min-w-[3rem] text-center">
                      {timeLeft}s
                    </span>
                  </button>
                  <button 
                    onClick={() => setShowInsights(!showInsights)}
                    className={`flex flex-row gap-2 items-center rounded-md py-2 px-4 transition-colors ${
                      showInsights 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {showInsights ? "Hide" : "Show"} Insights
                    </span>
                  </button>
                </div>
              </div>

              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                variant="light"
              />
            </motion.div>

            {/* Insights Dashboard */}
            <InsightsDashboard 
              stats={coverageStats} 
              isVisible={showInsights}
            />

            {/* Results Table */}
            <CasinoDataTable activeStates={activeStates} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        scheduleRun={scheduleRun}
        onScheduleRunChange={setScheduleRun}
        activeStates={activeStates}
        onStateChange={handleStateChange}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { FaGear, FaLocationDot } from "react-icons/fa6";
import { IoMdRefresh } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { CasinoDataTable } from "@/components/CasinoDataTable";
import { ModelSelector } from "@/components/ModelSelector";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { InsightsDashboard } from "@/components/InsightsDashboard";
import { AIResearchPanel } from "@/components/ai/AIResearchPanel";
import { AIRecommendationsPanel } from "@/components/ai/AIRecommendationsPanel";
import { ComprehensiveResearchPanel } from "@/components/ai/ComprehensiveResearchPanel";
import { analyzeCoverage, findCrossCoverageGaps } from "@/lib/utils/gap-analysis";
import { casinoOffers } from "@/lib/data/casino-offers";
import { isGeminiConfigured } from "@/lib/ai/gemini-service";
import { FiAlertCircle } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function Home() {
  const [searchStarted, setSearchStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [selectedModel, setSelectedModel] = useState("Gemini 2.5 Pro");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scheduleRun, setScheduleRun] = useState(true);
  const [showInsights, setShowInsights] = useState(false);
  const [showAIResearch, setShowAIResearch] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
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

  // AI Research state
  const [aiEnabled] = useState(isGeminiConfigured());
  const [selectedState, setSelectedState] = useState<string>("");
  
  // Get missing casinos from cross-coverage analysis for AI research
  const crossGaps = findCrossCoverageGaps(casinoOffers);
  const missingCasinosByState: Record<string, string[]> = {};
  
  crossGaps.forEach((gap) => {
    gap.missingIn.forEach((state) => {
      if (!missingCasinosByState[state]) {
        missingCasinosByState[state] = [];
      }
      missingCasinosByState[state].push(gap.casino);
    });
  });

  const states = Object.keys(coverageStats.stateDistribution);

  const handleRunSearch = () => {
    setSearchStarted(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeLeft(90);
    
    // Simulate data refresh (in a real app, this would fetch from an API)
    // This provides visual feedback and re-renders the table
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Increment key to force re-render of table component
    setRefreshKey(prev => prev + 1);
    
    setIsRefreshing(false);
    console.log("Data refreshed at:", new Date().toLocaleTimeString());
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

  // Set theme attribute on HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Countdown timer effect
  useEffect(() => {
    if (!searchStarted || !autoRefresh) return;

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
  }, [searchStarted, autoRefresh]);

  return (
    <div className={`relative flex flex-col min-h-screen font-sans transition-colors ${
      darkMode ? "bg-gray-900" : "bg-gray-100"
    }`}>
      {/* Header Controls */}
      <motion.div
        className="absolute flex flex-row gap-6 items-center justify-between top-10 right-10 z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        {/* FUTURE FEATURE: NEAREST CASINO */}

        {/* <div className="flex flex-row gap-2 items-center bg-black rounded-md py-2 px-4 cursor-pointer hover:bg-gray-800 transition-colors">
          <FaLocationDot className="text-gray-100 text-xl" />
          <h1 className="text-gray-100">Location</h1>
        </div> */}
        <div
          onClick={() => setIsSettingsOpen(true)}
          className={`rounded-md p-2.5 cursor-pointer transition-colors ${
            darkMode 
              ? "bg-gray-700 hover:bg-gray-600" 
              : "bg-black hover:bg-gray-800"
          }`}
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
              className={`text-4xl font-bold ${darkMode ? "text-white" : "text-black"}`}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              GAMBIT
            </motion.h1>
            <motion.h2
              className={darkMode ? "text-gray-400" : "text-gray-500"}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Gaming Analysis & Machine-Based Intelligence Tracker
            </motion.h2>

            <motion.div
              className="mt-6 flex flex-row w-1/4 px-4 items-center justify-center"
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={handleRunSearch}
                className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                  darkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Run Search
              </button>
              {/* FUTURE FEATURE: MODEL SELECTOR FOR AI MODELS */}
              {/* <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                variant="dark"
              /> */}
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
              <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
                GAMBIT
              </h1>
              <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
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
                  <span className={`text-xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
                    Search Results
                  </span>
                  {coverageStats.gaps.length > 0 && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      darkMode 
                        ? "bg-red-900/30 text-red-400" 
                        : "bg-red-100 text-red-600"
                    }`}>
                      {coverageStats.gaps.length} gaps
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleRefresh}
                    disabled={isRefreshing || !autoRefresh}
                    className={`flex flex-row gap-2 items-center rounded-md py-2 px-4 transition-colors cursor-pointer ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-black hover:bg-gray-800"
                    } ${
                      isRefreshing || !autoRefresh
                        ? "opacity-70 cursor-not-allowed" 
                        : ""
                    }`}
                  >
                    <IoMdRefresh className={`text-white ${isRefreshing ? "animate-spin" : ""}`} />
                    <span className="text-white">
                      {isRefreshing ? "Refreshing..." : "Refresh"}
                    </span>
                    {!isRefreshing && autoRefresh && (
                      <span className="text-white/50 text-sm py-0.5 rounded min-w-[3rem] text-center">
                        {timeLeft}s
                      </span>
                    )}
                    {!autoRefresh && (
                      <span className="text-white/50 text-xs">(Auto-off)</span>
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      setShowInsights(!showInsights);
                      if (!showInsights) setShowAIResearch(false);
                    }}
                    className={`flex flex-row gap-2 items-center rounded-md py-2 px-4 transition-colors cursor-pointer ${
                      showInsights 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : darkMode
                          ? "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {showInsights ? "Hide" : "Show"} Insights
                    </span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowAIResearch(!showAIResearch);
                      if (!showAIResearch) setShowInsights(false);
                    }}
                    className={`flex flex-row gap-2 items-center rounded-md py-2 px-4 transition-colors cursor-pointer ${
                      showAIResearch 
                        ? "bg-purple-600 text-white hover:bg-purple-700" 
                        : darkMode
                          ? "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <HiSparkles className="text-lg" />
                    <span className="text-sm font-medium">
                      {showAIResearch ? "Hide" : "Show"} AI Research
                    </span>
                  </button>
                </div>
              </div>

              {/* FUTURE FEATURE: MODEL SELECTOR FOR AI MODELS */}
              {/* <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                variant="light"
              /> */}
            </motion.div>

            {/* Insights Dashboard - Algorithm-based analysis */}
            <InsightsDashboard 
              stats={coverageStats} 
              isVisible={showInsights}
              darkMode={darkMode}
            />

            {/* AI Research Panel - AI-powered features */}
            {showAIResearch && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <div className={`rounded-lg shadow-sm p-6 ${
                  darkMode 
                    ? "bg-gray-800 border border-gray-700" 
                    : "bg-white border border-gray-200"
                }`}>
                  <div className="flex items-center gap-2 mb-4">
                    <HiSparkles className="text-purple-600 text-2xl" />
                    <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      AI-Powered Research
                    </h2>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      darkMode 
                        ? "bg-purple-900/30 text-purple-400" 
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      Gemini 2.0 Flash
                    </span>
                  </div>
                  <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Use AI to discover new casino offers, analyze offer quality, and generate strategic recommendations. 
                    Powered by Google Gemini with automatic retry logic for reliability.
                  </p>

                  {aiEnabled ? (
                    <div className="space-y-6">
                      {/* State Selector */}
                      <div className={`rounded-lg p-4 ${
                        darkMode
                          ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-700"
                          : "bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200"
                      }`}>
                        <label className={`text-sm font-semibold mb-3 block ${
                          darkMode ? "text-gray-200" : "text-gray-900"
                        }`}>
                          📍 Select State for AI Research:
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {states.map((state) => (
                            <button
                              key={state}
                              onClick={() => setSelectedState(state)}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                selectedState === state
                                  ? "bg-purple-600 text-white"
                                  : darkMode
                                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                              }`}
                            >
                              {state}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Comprehensive Market Research */}
                      <ComprehensiveResearchPanel darkMode={darkMode} />

                      {/* AI Research Panel */}
                      {selectedState && (
                        <AIResearchPanel
                          state={selectedState}
                          missingCasinos={missingCasinosByState[selectedState] || []}
                          darkMode={darkMode}
                        />
                      )}

                      {/* AI Recommendations */}
                      <AIRecommendationsPanel
                        gaps={coverageStats.gaps}
                        stats={{
                          totalOffers: coverageStats.totalOffers,
                          stateCount: states.length,
                          casinoCount: Object.keys(coverageStats.casinoDistribution).length,
                        }}
                        darkMode={darkMode}
                      />
                    </div>
                  ) : (
                    /* API Key Setup Instructions */
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <FiAlertCircle className="text-yellow-600 text-2xl flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                            AI Features Not Configured
                          </h3>
                          <p className="text-sm text-yellow-800 mb-3">
                            To enable AI-powered offer discovery and analysis, you need to add a Gemini API key.
                          </p>
                          <div className="bg-white rounded border border-yellow-200 p-3">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Quick Setup (3 minutes):</p>
                            <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
                              <li>Get a free API key at: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">https://aistudio.google.com/app/apikey</a></li>
                              <li>Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root</li>
                              <li>Add: <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_GEMINI_API_KEY=your_key_here</code></li>
                              <li>Restart your dev server: <code className="bg-gray-100 px-1 rounded">npm run dev</code></li>
                            </ol>
                          </div>
                          <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-2">
                            <p className="text-xs text-blue-800">
                              💡 <strong>Free tier includes:</strong> 1,500 requests/day • ~$6/month for heavy usage
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Results Table */}
            <CasinoDataTable 
              key={refreshKey} 
              activeStates={activeStates}
              darkMode={darkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        scheduleRun={scheduleRun}
        onScheduleRunChange={setScheduleRun}
        darkMode={darkMode}
        onDarkModeChange={setDarkMode}
        autoRefresh={autoRefresh}
        onAutoRefreshChange={setAutoRefresh}
        activeStates={activeStates}
        onStateChange={handleStateChange}
      />
    </div>
  );
}

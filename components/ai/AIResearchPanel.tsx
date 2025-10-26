"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiLoader, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import {
  discoverOffersWithAI,
  type DiscoveredOffer,
} from "@/lib/ai/gemini-service";

interface AIResearchPanelProps {
  state: string;
  missingCasinos: string[];
  onOffersDiscovered?: (offers: DiscoveredOffer[]) => void;
  darkMode?: boolean;
}

export function AIResearchPanel({
  state,
  missingCasinos,
  onOffersDiscovered,
  darkMode = false,
}: AIResearchPanelProps) {
  const [isResearching, setIsResearching] = useState(false);
  const [discoveredOffers, setDiscoveredOffers] = useState<DiscoveredOffer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleResearch = async () => {
    setIsResearching(true);
    setError(null);
    setDiscoveredOffers([]);

    try {
      const context = `We're researching casino promotions to expand our coverage. Focus on finding legitimate welcome bonuses from major operators.`;
      
      const offers = await discoverOffersWithAI(
        state,
        missingCasinos,
        context
      );

      setDiscoveredOffers(offers);
      onOffersDiscovered?.(offers);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to research offers. Please try again."
      );
    } finally {
      setIsResearching(false);
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    if (darkMode) {
      const colors = {
        high: "bg-green-900/30 text-green-400 border-green-800",
        medium: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
        low: "bg-gray-700 text-gray-400 border-gray-600",
      };
      return colors[confidence as keyof typeof colors] || colors.low;
    }
    const colors = {
      high: "bg-green-100 text-green-700 border-green-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      low: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[confidence as keyof typeof colors] || colors.low;
  };

  return (
    <div className={`rounded-lg shadow-sm p-6 ${
      darkMode 
        ? "bg-gray-800 border border-gray-700" 
        : "bg-white border border-gray-200"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HiSparkles className="text-blue-600 text-2xl" />
          <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            AI Offer Discovery
          </h3>
        </div>
        <button
          onClick={handleResearch}
          disabled={isResearching}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isResearching ? (
            <>
              <FiLoader className="animate-spin" />
              <span>Researching...</span>
            </>
          ) : (
            <>
              <FiSearch />
              <span>Research {state} Offers</span>
            </>
          )}
        </button>
      </div>

      {/* Info */}
      <div className={`rounded-lg p-3 mb-4 ${
        darkMode 
          ? "bg-blue-900/20 border border-blue-800" 
          : "bg-blue-50 border border-blue-200"
      }`}>
        <p className={`text-sm ${darkMode ? "text-blue-300" : "text-blue-800"}`}>
          <strong>AI will research:</strong> Missing casinos in {state} and find
          current promotional offers. This uses Gemini 2.0 Flash (~$0.01 per search).
        </p>
      </div>

      {/* Missing Casinos */}
      {missingCasinos.length > 0 && (
        <div className="mb-4">
          <p className={`text-xs font-semibold mb-2 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            PRIORITY TARGETS
          </p>
          <div className="flex flex-wrap gap-2">
            {missingCasinos.slice(0, 10).map((casino) => (
              <span
                key={casino}
                className={`text-xs px-3 py-1 rounded-full ${
                  darkMode 
                    ? "bg-orange-900/30 border border-orange-800 text-orange-400" 
                    : "bg-orange-50 border border-orange-200 text-orange-700"
                }`}
              >
                {casino}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-4 mb-4 ${
            darkMode 
              ? "bg-red-900/20 border border-red-800" 
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-start gap-2">
            <FiAlertCircle className="text-red-600 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <p className={`text-sm font-medium ${
                darkMode ? "text-red-400" : "text-red-800"
              }`}>
                Research Failed
              </p>
              <p className={`text-sm mt-1 ${darkMode ? "text-red-300" : "text-red-700"}`}>
                {error}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {discoveredOffers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FiCheckCircle className="text-green-600 text-xl" />
              <p className={`text-sm font-semibold ${
                darkMode ? "text-gray-200" : "text-gray-900"
              }`}>
                Found {discoveredOffers.length} Offers
              </p>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {discoveredOffers.map((offer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-lg p-4 ${
                    darkMode 
                      ? "bg-gray-750 border border-gray-700" 
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className={`font-semibold ${
                        darkMode ? "text-gray-200" : "text-gray-900"
                      }`}>
                        {offer.casino}
                      </h4>
                      <span className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                        {offer.offerType}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getConfidenceBadge(
                        offer.confidence
                      )}`}
                    >
                      {offer.confidence} confidence
                    </span>
                  </div>

                  <p className={`text-sm mb-3 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {offer.offerName}
                  </p>

                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-sm">
                      <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                        Deposit:
                      </span>{" "}
                      <span className={`font-semibold ${
                        darkMode ? "text-gray-200" : "text-gray-900"
                      }`}>
                        ${offer.estimatedDeposit.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                        Bonus:
                      </span>{" "}
                      <span className="font-semibold text-green-600">
                        ${offer.estimatedBonus.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                        Value:
                      </span>{" "}
                      <span className="font-semibold text-blue-600">
                        {((offer.estimatedBonus / (offer.estimatedDeposit || 1)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {offer.notes && (
                    <p className={`text-xs rounded p-2 ${
                      darkMode 
                        ? "text-gray-300 bg-gray-700 border border-gray-600" 
                        : "text-gray-600 bg-white border border-gray-200"
                    }`}>
                      📝 {offer.notes}
                    </p>
                  )}

                  <p className={`text-xs mt-2 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    Source: {offer.source}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


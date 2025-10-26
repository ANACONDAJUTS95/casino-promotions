"use client";

import { useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";
import { FiSearch, FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { BiBuildings } from "react-icons/bi";
import { MdCompareArrows } from "react-icons/md";
import { FaAngleDown, FaLocationDot } from "react-icons/fa6";
import {
  discoverLicensedCasinos,
  researchCasinoOffers,
  type LicensedCasino,
  type ResearchedOffer,
} from "@/lib/ai/gemini-service";
import { casinoOffers } from "@/lib/data/casino-offers";

interface ComprehensiveResearchPanelProps {
  darkMode?: boolean;
}

interface ResearchProgress {
  phase: "idle" | "discovering" | "researching" | "complete" | "error";
  currentCasino?: string;
  processedCount: number;
  totalCount: number;
}

export function ComprehensiveResearchPanel({
  darkMode = false,
}: ComprehensiveResearchPanelProps) {
  const [selectedState, setSelectedState] = useState<string>("NJ");
  const [progress, setProgress] = useState<ResearchProgress>({
    phase: "idle",
    processedCount: 0,
    totalCount: 0,
  });
  const [discoveredCasinos, setDiscoveredCasinos] = useState<LicensedCasino[]>([]);
  const [researchResults, setResearchResults] = useState<ResearchedOffer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const states = [
    { code: "NJ", name: "New Jersey" },
    { code: "MI", name: "Michigan" },
    { code: "PA", name: "Pennsylvania" },
    { code: "WV", name: "West Virginia" },
  ];

  const handleComprehensiveResearch = async () => {
    setProgress({ phase: "discovering", processedCount: 0, totalCount: 0 });
    setError(null);
    setDiscoveredCasinos([]);
    setResearchResults([]);

    try {
      // Phase 1: Discover all licensed casinos
      const casinos = await discoverLicensedCasinos(selectedState);
      setDiscoveredCasinos(casinos);
      setProgress({ phase: "researching", processedCount: 0, totalCount: casinos.length });

      // Phase 2: Research offers for each casino
      const allOffers: ResearchedOffer[] = [];
      
      for (let i = 0; i < casinos.length; i++) {
        const casino = casinos[i];
        setProgress({
          phase: "researching",
          currentCasino: casino.name,
          processedCount: i,
          totalCount: casinos.length,
        });

        // Find existing offer in our system
        const existingOffer = casinoOffers.find(
          (offer) =>
            offer.Name.toLowerCase().includes(casino.name.toLowerCase()) ||
            casino.name.toLowerCase().includes(offer.Name.toLowerCase())
        );

        const existingOfferData = existingOffer
          ? {
              name: existingOffer.Offer_Name,
              deposit: existingOffer.Expected_Deposit,
              bonus: existingOffer.Expected_Bonus,
              type: existingOffer.offer_type,
            }
          : undefined;

        try {
          const offers = await researchCasinoOffers(
            casino.name,
            selectedState,
            existingOfferData
          );
          allOffers.push(...offers);
        } catch (err) {
          console.error(`Failed to research ${casino.name}:`, err);
          // Continue with next casino even if one fails
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setResearchResults(allOffers);
      setProgress({
        phase: "complete",
        processedCount: casinos.length,
        totalCount: casinos.length,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to complete research. Please try again."
      );
      setProgress({ phase: "error", processedCount: 0, totalCount: 0 });
    }
  };

  const betterOffers = researchResults.filter((offer) => offer.isBetterThanExisting);
  const alternativeOffers = researchResults.filter(
    (offer) => !offer.isBetterThanExisting
  );

  return (
    <div
      className={`rounded-lg shadow-sm p-6 ${
        darkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BiBuildings className="text-blue-600 text-2xl" />
          <h3
            className={`text-lg font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Comprehensive Casino Research
          </h3>
        </div>
      </div>

      <p
        className={`text-sm mb-4 ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        AI-powered research to discover ALL licensed casinos in a state and identify
        better promotional offers using official regulatory sources.
      </p>

      {/* State Selection & Action */}
      <div className="flex items-center gap-3 mb-4">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton
            disabled={progress.phase === "discovering" || progress.phase === "researching"}
            className={`flex items-center gap-2 rounded-md py-2 px-4 text-sm font-medium transition-colors ${
              darkMode
                ? "bg-gray-700 border border-gray-600 text-gray-200 hover:bg-gray-600"
                : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <FaLocationDot className={darkMode ? "text-blue-400" : "text-blue-600"} />
            <span>{states.find((s) => s.code === selectedState)?.name}</span>
            <FaAngleDown className="text-sm" />
          </MenuButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems
              className={`absolute left-0 mt-2 w-56 origin-top-left rounded-md shadow-lg ring-1 ring-opacity-5 focus:outline-none z-50 ${
                darkMode
                  ? "bg-gray-700 ring-gray-600"
                  : "bg-white ring-black"
              }`}
            >
              <div className="py-1">
                {states.map((state) => (
                  <MenuItem key={state.code}>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectedState(state.code)}
                        className={`${
                          active
                            ? darkMode
                              ? "bg-gray-600"
                              : "bg-gray-100"
                            : ""
                        } ${
                          selectedState === state.code
                            ? darkMode
                              ? "bg-gray-600 font-semibold"
                              : "bg-gray-50 font-semibold"
                            : "font-normal"
                        } group flex w-full items-center px-4 py-2 text-sm transition-colors ${
                          darkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        <FaLocationDot
                          className={`mr-3 h-4 w-4 ${
                            selectedState === state.code
                              ? darkMode
                                ? "text-blue-400"
                                : "text-blue-600"
                              : darkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                          }`}
                        />
                        {state.name}
                        {selectedState === state.code && (
                          <span
                            className={`ml-auto ${
                              darkMode ? "text-blue-400" : "text-blue-600"
                            }`}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Transition>
        </Menu>

        <button
          onClick={handleComprehensiveResearch}
          disabled={progress.phase === "discovering" || progress.phase === "researching"}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {progress.phase === "discovering" || progress.phase === "researching" ? (
            <>
              <FiLoader className="animate-spin" />
              <span>Researching...</span>
            </>
          ) : (
            <>
              <FiSearch />
              <span>Research {selectedState} Market</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Indicator */}
      {(progress.phase === "discovering" || progress.phase === "researching") && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-4 mb-4 ${
            darkMode
              ? "bg-blue-900/20 border border-blue-800"
              : "bg-blue-50 border border-blue-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <FiLoader className="animate-spin text-blue-600" />
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-blue-300" : "text-blue-800"
              }`}
            >
              {progress.phase === "discovering"
                ? "Discovering licensed casinos from regulatory sources..."
                : `Researching casino offers (${progress.processedCount}/${progress.totalCount})`}
            </span>
          </div>
          {progress.currentCasino && (
            <p
              className={`text-xs ${
                darkMode ? "text-blue-400" : "text-blue-700"
              }`}
            >
              Currently researching: {progress.currentCasino}
            </p>
          )}
          {progress.totalCount > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(progress.processedCount / progress.totalCount) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Error Message */}
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
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-red-400" : "text-red-800"
                }`}
              >
                Research Failed
              </p>
              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-red-300" : "text-red-700"
                }`}
              >
                {error}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {progress.phase === "complete" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div
              className={`rounded-lg p-3 ${
                darkMode
                  ? "bg-gray-750 border border-gray-700"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div
                className={`text-xs mb-1 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Licensed Casinos
              </div>
              <div
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {discoveredCasinos.length}
              </div>
            </div>
            <div
              className={`rounded-lg p-3 ${
                darkMode
                  ? "bg-green-900/30 border border-green-800"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <div
                className={`text-xs mb-1 ${
                  darkMode ? "text-green-400" : "text-green-700"
                }`}
              >
                Better Offers Found
              </div>
              <div
                className={`text-2xl font-bold ${
                  darkMode ? "text-green-400" : "text-green-700"
                }`}
              >
                {betterOffers.length}
              </div>
            </div>
            <div
              className={`rounded-lg p-3 ${
                darkMode
                  ? "bg-blue-900/30 border border-blue-800"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <div
                className={`text-xs mb-1 ${
                  darkMode ? "text-blue-400" : "text-blue-700"
                }`}
              >
                Alternative Offers
              </div>
              <div
                className={`text-2xl font-bold ${
                  darkMode ? "text-blue-400" : "text-blue-700"
                }`}
              >
                {alternativeOffers.length}
              </div>
            </div>
          </div>

          {/* Better Offers Section */}
          {betterOffers.length > 0 && (
            <div>
              <h4
                className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                  darkMode ? "text-green-400" : "text-green-700"
                }`}
              >
                <FiCheckCircle />
                SUPERIOR OFFERS IDENTIFIED
              </h4>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {betterOffers.map((offer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-lg p-4 ${
                      darkMode
                        ? "bg-green-900/20 border border-green-800"
                        : "bg-green-50 border border-green-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5
                          className={`font-semibold ${
                            darkMode ? "text-green-300" : "text-green-900"
                          }`}
                        >
                          {offer.casino}
                        </h5>
                        <span
                          className={`text-xs ${
                            darkMode ? "text-green-400" : "text-green-700"
                          }`}
                        >
                          {offer.offerType}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          darkMode
                            ? "bg-green-800 text-green-300"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {offer.confidence} confidence
                      </span>
                    </div>

                    <p
                      className={`text-sm mb-3 ${
                        darkMode ? "text-green-200" : "text-green-800"
                      }`}
                    >
                      {offer.offerName}
                    </p>

                    <div className="flex items-center gap-4 mb-2">
                      <div className="text-sm">
                        <span
                          className={
                            darkMode ? "text-green-400" : "text-green-700"
                          }
                        >
                          Deposit:
                        </span>{" "}
                        <span
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          ${offer.deposit.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span
                          className={
                            darkMode ? "text-green-400" : "text-green-700"
                          }
                        >
                          Bonus:
                        </span>{" "}
                        <span className="font-semibold text-green-600">
                          ${offer.bonus.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span
                          className={
                            darkMode ? "text-green-400" : "text-green-700"
                          }
                        >
                          Value:
                        </span>{" "}
                        <span className="font-semibold text-blue-600">
                          {offer.valueRatio.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div
                      className={`rounded p-2 text-xs ${
                        darkMode
                          ? "bg-gray-700 border border-gray-600 text-gray-300"
                          : "bg-white border border-gray-300 text-gray-700"
                      }`}
                    >
                      <MdCompareArrows className="inline mr-1" />
                      <strong>Why it's better:</strong> {offer.comparisonNotes}
                    </div>

                    <p
                      className={`text-xs mt-2 ${
                        darkMode ? "text-green-400" : "text-green-700"
                      }`}
                    >
                      Source: {offer.source}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Offers Section */}
          {alternativeOffers.length > 0 && (
            <div>
              <h4
                className={`text-sm font-semibold mb-3 ${
                  darkMode ? "text-blue-400" : "text-blue-700"
                }`}
              >
                ALTERNATIVE OFFERS (Similar or Different)
              </h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {alternativeOffers.slice(0, 10).map((offer, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-3 text-sm ${
                      darkMode
                        ? "bg-gray-750 border border-gray-700"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        {offer.casino}
                      </span>
                      <span
                        className={
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        ${offer.bonus} on ${offer.deposit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {betterOffers.length === 0 && alternativeOffers.length === 0 && (
            <div className="text-center py-8">
              <FiCheckCircle className="text-green-600 text-4xl mx-auto mb-2" />
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Research complete! No significantly better offers found. Your current
                data is up to date.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}


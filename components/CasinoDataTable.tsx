"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { casinoOffers, type CasinoOffer } from "@/lib/data/casino-offers";
import { FaChevronLeft, FaChevronRight, FaSort } from "react-icons/fa6";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";
import { HiSparkles } from "react-icons/hi2";
import {
  prioritizeOffers,
  sortOffers,
  getPriorityTier,
  getPriorityBadge,
  type ScoredOffer,
  type SortOption,
} from "@/lib/utils/offer-prioritization";
import { AIOfferAnalyzer } from "@/components/ai/AIOfferAnalyzer";
import { isGeminiConfigured, type OfferAnalysis } from "@/lib/ai/gemini-service";
import { IoIosInformationCircle } from "react-icons/io";

const ITEMS_PER_PAGE = 10;

interface CasinoDataTableProps {
  activeStates: {
    newJersey: boolean;
    michigan: boolean;
    pennsylvania: boolean;
    westVirginia: boolean;
  };
  darkMode?: boolean;
}

export function CasinoDataTable({ activeStates, darkMode = false }: CasinoDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("priority");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [aiEnabled] = useState(isGeminiConfigured());
  const [analysisCache, setAnalysisCache] = useState<Record<string, OfferAnalysis>>({});

  // Filter offers based on active states
  const filteredOffers = casinoOffers.filter((offer) => {
    const stateName = offer.state.Name;
    if (stateName === "New Jersey") return activeStates.newJersey;
    if (stateName === "Michigan") return activeStates.michigan;
    if (stateName === "Pennsylvania") return activeStates.pennsylvania;
    if (stateName === "West Virginia") return activeStates.westVirginia;
    return false;
  });

  // Prioritize and sort offers
  const scoredOffers = prioritizeOffers(filteredOffers);
  const sortedOffers = sortOffers(scoredOffers, sortBy);

  // Calculate pagination
  const totalPages = Math.ceil(sortedOffers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOffers = sortedOffers.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when filters or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeStates, sortBy]);

  const toggleRowExpansion = (offerId: string) => {
    setExpandedRow(expandedRow === offerId ? null : offerId);
  };

  const handleAnalysisComplete = (offerId: string, analysis: OfferAnalysis) => {
    setAnalysisCache((prev) => ({
      ...prev,
      [offerId]: analysis,
    }));
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <motion.div
        className={`flex items-center justify-between rounded-lg shadow-sm px-6 py-3 ${
          darkMode 
            ? "bg-gray-800 border border-gray-700" 
            : "bg-white border border-gray-200"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="flex items-center gap-2">
          <FaSort className={darkMode ? "text-gray-400" : "text-gray-600"} />
          <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Sort by:
          </span>
        </div>
        <div className="flex gap-2">
          {[
            { value: "priority" as SortOption, label: "Priority Score" },
            { value: "bonus-high" as SortOption, label: "Highest Bonus" },
            { value: "value-ratio" as SortOption, label: "Best Value" },
            { value: "state" as SortOption, label: "State" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                sortBy === option.value
                  ? darkMode 
                    ? "bg-blue-600 text-white" 
                    : "bg-black text-white"
                  : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        className={`rounded-lg shadow-sm overflow-hidden ${
          darkMode 
            ? "bg-gray-800 border border-gray-700" 
            : "bg-white border border-gray-200"
        }`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? "bg-gray-750 border-b border-gray-700" : "bg-gray-50 border-b border-gray-200"}>
              <tr>
                <th className={`text-left py-4 px-6 text-sm font-semibold w-[100px] ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  <div className="flex items-center gap-2">
                    Priority
                    <IoIosInformationCircle className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                  </div>
                </th>
                <th className={`text-left py-4 px-6 text-sm font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  State
                </th>
                <th className={`text-left py-4 px-6 text-sm font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Casino
                </th>
                <th className={`text-left py-4 px-6 text-sm font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Offer
                </th>
                <th className={`text-center py-4 px-6 text-sm font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Bonus
                </th>
                <th className={`flex justify-center py-4 px-6 text-sm font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  <div className="flex items-center gap-2">
                    Value
                    <IoIosInformationCircle className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentOffers.map((offer, index) => {
                const tier = getPriorityTier(offer.priorityScore);
                const badge = getPriorityBadge(tier);
                const isExpanded = expandedRow === offer.id;

                return (
                  <React.Fragment key={offer.id}>
                    <motion.tr
                      className={`transition-colors cursor-pointer ${
                        darkMode 
                          ? "border-b border-gray-700 hover:bg-gray-750" 
                          : "border-b border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => toggleRowExpansion(offer.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.6 + index * 0.05,
                        duration: 0.4,
                      }}
                    >
                      <td className="py-4 px-6 text-sm">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {offer.priorityScore}
                          </span>
                          <span className="text-xs">{badge.icon}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                          {offer.state.Abbreviation}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <div>
                          <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                            {offer.Name}
                          </div>
                          <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {offer.offer_type}
                          </div>
                        </div>
                      </td>
                      <td className={`py-4 px-6 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <div className="max-w-md">
                          {offer.Offer_Name.length > 80
                            ? offer.Offer_Name.substring(0, 80) + "..."
                            : offer.Offer_Name}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-center">
                        <div className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                          ${offer.Expected_Bonus.toLocaleString()}
                        </div>
                        <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          on ${offer.Expected_Deposit.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-center">
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${offer.valueRatio >= 2
                              ? "bg-green-50 border-green-200 text-green-700"
                              : offer.valueRatio >= 1
                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                : "bg-gray-50 border-gray-200 text-gray-700"
                            }`}
                        >
                          {offer.valueRatio >= 2 && <HiSparkles className="text-xs" />}
                          <span className="font-semibold">
                            {(offer.valueRatio * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </motion.tr>

                    {/* Expanded Row with Details */}
                    {isExpanded && (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td colSpan={6} className={`px-6 py-4 ${
                          darkMode 
                            ? "bg-gray-750 border-b border-gray-700" 
                            : "bg-gray-50 border-b border-gray-200"
                        }`}>
                          <div className="space-y-3">
                            {/* Full Offer Name */}
                            <div>
                              <div className={`text-xs font-semibold mb-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}>
                                FULL OFFER
                              </div>
                              <div className={`text-sm ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                                {offer.Offer_Name}
                              </div>
                            </div>

                            {/* Insights */}
                            {offer.insights.length > 0 && (
                              <div>
                                <div className={`text-xs font-semibold mb-2 ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}>
                                  AI INSIGHTS
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {offer.insights.map((insight, i) => (
                                    <span
                                      key={i}
                                      className={`text-xs rounded-full px-3 py-1 ${
                                        darkMode 
                                          ? "bg-gray-700 border border-gray-600 text-gray-300" 
                                          : "bg-white border border-gray-200 text-gray-700"
                                      }`}
                                    >
                                      {insight}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Score Breakdown */}
                            <div>
                              <div className={`text-xs font-semibold mb-2 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}>
                                SCORE BREAKDOWN
                              </div>
                              <div className="grid grid-cols-4 gap-3">
                                <div className={`rounded-lg p-2 ${
                                  darkMode 
                                    ? "bg-gray-700 border border-gray-600" 
                                    : "bg-white border border-gray-200"
                                }`}>
                                  <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    Value Ratio
                                  </div>
                                  <div className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    {offer.scoreBreakdown.valueRatioScore}
                                  </div>
                                </div>
                                <div className={`rounded-lg p-2 ${
                                  darkMode 
                                    ? "bg-gray-700 border border-gray-600" 
                                    : "bg-white border border-gray-200"
                                }`}>
                                  <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    Bonus Amount
                                  </div>
                                  <div className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    {offer.scoreBreakdown.bonusAmountScore}
                                  </div>
                                </div>
                                <div className={`rounded-lg p-2 ${
                                  darkMode 
                                    ? "bg-gray-700 border border-gray-600" 
                                    : "bg-white border border-gray-200"
                                }`}>
                                  <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    Offer Type
                                  </div>
                                  <div className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    {offer.scoreBreakdown.offerTypeScore}
                                  </div>
                                </div>
                                <div className={`rounded-lg p-2 ${
                                  darkMode 
                                    ? "bg-gray-700 border border-gray-600" 
                                    : "bg-white border border-gray-200"
                                }`}>
                                  <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    Accessibility
                                  </div>
                                  <div className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    {offer.scoreBreakdown.accessibilityScore}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* AI Deep Analysis */}
                            {aiEnabled && (
                              <div>
                                <AIOfferAnalyzer
                                  offerName={offer.Offer_Name}
                                  casino={offer.Name}
                                  deposit={offer.Expected_Deposit}
                                  bonus={offer.Expected_Bonus}
                                  darkMode={darkMode}
                                  offerId={offer.id}
                                  cachedAnalysis={analysisCache[offer.id]}
                                  onAnalysisComplete={handleAnalysisComplete}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination Controls */}
      <motion.div
        className="flex flex-row items-center justify-between px-4 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Showing {startIndex + 1} to {Math.min(endIndex, sortedOffers.length)}{" "}
          of {sortedOffers.length} results
        </div>

        <div className="flex flex-row gap-2 items-center">
          {/* Previous Button */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-10 h-10 rounded-md border transition-colors ${
              currentPage === 1
                ? darkMode
                  ? "border-gray-700 text-gray-600 cursor-not-allowed"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
                : darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaChevronLeft className="text-sm" />
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className={`flex items-center justify-center w-10 h-10 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => goToPage(page as number)}
                className={`flex items-center justify-center w-10 h-10 rounded-md border transition-colors ${
                  currentPage === page
                    ? darkMode
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-black text-white border-black"
                    : darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-10 h-10 rounded-md border transition-colors ${
              currentPage === totalPages
                ? darkMode
                  ? "border-gray-700 text-gray-600 cursor-not-allowed"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
                : darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}


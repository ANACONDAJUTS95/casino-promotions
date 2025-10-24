"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { casinoOffers, type CasinoOffer } from "@/lib/data/casino-offers";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";

// Helper function to determine comparison status based on bonus amount
const getComparisonStatus = (bonus: number): string => {
  if (bonus >= 1000) return "Better";
  if (bonus >= 500) return "New";
  return "Worse";
};

const ITEMS_PER_PAGE = 10;

export default function CasinoDataTable() {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(casinoOffers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOffers = casinoOffers.slice(startIndex, endIndex);

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
      {/* Table */}
      <motion.div
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  State
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Casino Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Offer Found
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 w-[150px]">
                  Comparison
                </th>
              </tr>
            </thead>
            <tbody>
              {currentOffers.map((offer, index) => {
                const comparison = getComparisonStatus(offer.Expected_Bonus);
                return (
                  <motion.tr
                    key={offer.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.6 + index * 0.05,
                      duration: 0.4,
                    }}
                  >
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {offer.state.Name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {offer.Name}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className="text-gray-700">{offer.offer_type}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {offer.Offer_Name}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center justify-center">
                        {comparison === "Better" ? (
                          <div className="flex items-center gap-1 text-green-600 min-w-[90px] justify-center">
                            <AiOutlineRise className="text-lg" />
                            <span className="font-medium">Better</span>
                          </div>
                        ) : comparison === "Worse" ? (
                          <div className="flex items-center gap-1 text-red-600 min-w-[90px] justify-center">
                            <AiOutlineFall className="text-lg" />
                            <span className="font-medium">Worse</span>
                          </div>
                        ) : (
                          <span className="font-semibold text-blue-600 min-w-[90px] inline-block text-center">New</span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination Controls */}
      <motion.div
        className="flex flex-row items-center justify-between px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, casinoOffers.length)}{" "}
          of {casinoOffers.length} results
        </div>

        <div className="flex flex-row gap-2 items-center">
          {/* Previous Button */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-10 h-10 rounded-md border transition-colors ${
              currentPage === 1
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
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
                  className="flex items-center justify-center w-10 h-10 text-gray-500"
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
                    ? "bg-black text-white border-black"
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
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
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


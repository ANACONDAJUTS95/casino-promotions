"use client";

import { motion } from "framer-motion";
import { CoverageStats, CoverageGap } from "@/lib/utils/gap-analysis";
import { FiAlertCircle, FiInfo, FiTrendingUp } from "react-icons/fi";

interface InsightsDashboardProps {
  stats: CoverageStats;
  isVisible: boolean;
  darkMode?: boolean;
}

export function InsightsDashboard({ stats, isVisible, darkMode = false }: InsightsDashboardProps) {
  if (!isVisible) return null;

  const getSeverityColor = (severity: string) => {
    if (darkMode) {
      switch (severity) {
        case "high":
          return "border-red-800 bg-red-900/30";
        case "medium":
          return "border-yellow-800 bg-yellow-900/30";
        case "low":
          return "border-blue-800 bg-blue-900/30";
        default:
          return "border-gray-700 bg-gray-800";
      }
    }
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <FiAlertCircle className="text-red-600 text-xl" />;
      case "medium":
        return <FiInfo className="text-yellow-600 text-xl" />;
      case "low":
        return <FiTrendingUp className="text-blue-600 text-xl" />;
      default:
        return <FiInfo className="text-gray-600 text-xl" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-6"
    >
      <div className={`rounded-lg shadow-sm p-6 ${
        darkMode 
          ? "bg-gray-800 border border-gray-700" 
          : "bg-white border border-gray-200"
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp className={`text-2xl ${darkMode ? "text-blue-400" : "text-black"}`} />
          <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
            Coverage Insights & Gaps
          </h2>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            darkMode 
              ? "bg-gray-700 text-gray-300" 
              : "bg-gray-100 text-gray-700"
          }`}>
            Algorithm-Based
          </span>
        </div>
        <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Algorithmic analysis of your current casino offer coverage, identifying gaps and opportunities based on data patterns.
        </p>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className={`rounded-lg p-4 ${
            darkMode 
              ? "bg-gray-750 border border-gray-700" 
              : "bg-gray-50 border border-gray-200"
          }`}>
            <div className={`text-sm mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Total Offers
            </div>
            <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
              {stats.totalOffers}
            </div>
          </div>
          <div className={`rounded-lg p-4 ${
            darkMode 
              ? "bg-gray-750 border border-gray-700" 
              : "bg-gray-50 border border-gray-200"
          }`}>
            <div className={`text-sm mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              States Covered
            </div>
            <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
              {Object.keys(stats.stateDistribution).length}
            </div>
          </div>
          <div className={`rounded-lg p-4 ${
            darkMode 
              ? "bg-gray-750 border border-gray-700" 
              : "bg-gray-50 border border-gray-200"
          }`}>
            <div className={`text-sm mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Unique Casinos
            </div>
            <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
              {Object.keys(stats.casinoDistribution).length}
            </div>
          </div>
          <div className={`rounded-lg p-4 ${
            darkMode 
              ? "bg-gray-750 border border-gray-700" 
              : "bg-gray-50 border border-gray-200"
          }`}>
            <div className={`text-sm mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Coverage Gaps
            </div>
            <div className={`text-2xl font-bold ${darkMode ? "text-red-400" : "text-red-600"}`}>
              {stats.gaps.length}
            </div>
          </div>
        </div>

        {/* State Distribution */}
        <div className="mb-6">
          <h3 className={`text-sm font-semibold mb-3 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}>
            Offers by State
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(stats.stateDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([state, count]) => {
                const avgBonus = Math.round(stats.averageBonusByState[state]);
                return (
                  <div
                    key={state}
                    className={`rounded-lg p-3 ${
                      darkMode 
                        ? "bg-gray-700 border border-gray-600" 
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className={`text-sm font-medium ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    }`}>
                      {state}
                    </div>
                    <div className={`text-lg font-bold ${
                      darkMode ? "text-white" : "text-black"
                    }`}>
                      {count} offers
                    </div>
                    <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Avg: ${avgBonus}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Top Casinos */}
        <div className="mb-6">
          <h3 className={`text-sm font-semibold mb-3 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}>
            Top Casinos by Offer Count
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.topCasinos.slice(0, 8).map((casino, index) => (
              <div
                key={casino.name}
                className={`rounded-full px-4 py-2 flex items-center gap-2 ${
                  darkMode 
                    ? "bg-gray-700 border border-gray-600" 
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <span className={`text-xs font-bold ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}>
                  #{index + 1}
                </span>
                <span className={`text-sm font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-900"
                }`}>
                  {casino.name}
                </span>
                <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  ({casino.offerCount})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gaps & Recommendations */}
        {stats.gaps.length > 0 && (
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Identified Gaps & Recommendations
            </h3>
            <div className="space-y-3">
              {stats.gaps.slice(0, 8).map((gap, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getSeverityColor(gap.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getSeverityIcon(gap.severity)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold uppercase ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {gap.type} · {gap.severity} priority
                        </span>
                      </div>
                      <p className={`text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-200" : "text-gray-900"
                      }`}>
                        {gap.description}
                      </p>
                      <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        💡 <span className="font-medium">Recommendation:</span>{" "}
                        {gap.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.gaps.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎉</div>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              No significant coverage gaps detected!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}


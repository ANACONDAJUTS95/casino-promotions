"use client";

import { motion } from "framer-motion";
import { CoverageStats, CoverageGap } from "@/lib/utils/gap-analysis";
import { FiAlertCircle, FiInfo, FiTrendingUp } from "react-icons/fi";

interface InsightsDashboardProps {
  stats: CoverageStats;
  isVisible: boolean;
}

export function InsightsDashboard({ stats, isVisible }: InsightsDashboardProps) {
  if (!isVisible) return null;

  const getSeverityColor = (severity: string) => {
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp className="text-black text-2xl" />
          <h2 className="text-xl font-bold text-black">Coverage Insights & Gaps</h2>
          <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
            Algorithm-Based
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Algorithmic analysis of your current casino offer coverage, identifying gaps and opportunities based on data patterns.
        </p>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Offers</div>
            <div className="text-2xl font-bold text-black">{stats.totalOffers}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">States Covered</div>
            <div className="text-2xl font-bold text-black">
              {Object.keys(stats.stateDistribution).length}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Unique Casinos</div>
            <div className="text-2xl font-bold text-black">
              {Object.keys(stats.casinoDistribution).length}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Coverage Gaps</div>
            <div className="text-2xl font-bold text-red-600">{stats.gaps.length}</div>
          </div>
        </div>

        {/* State Distribution */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Offers by State</h3>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(stats.stateDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([state, count]) => {
                const avgBonus = Math.round(stats.averageBonusByState[state]);
                return (
                  <div
                    key={state}
                    className="bg-white border border-gray-200 rounded-lg p-3"
                  >
                    <div className="text-sm font-medium text-gray-900">{state}</div>
                    <div className="text-lg font-bold text-black">{count} offers</div>
                    <div className="text-xs text-gray-500">Avg: ${avgBonus}</div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Top Casinos */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Casinos by Offer Count</h3>
          <div className="flex flex-wrap gap-2">
            {stats.topCasinos.slice(0, 8).map((casino, index) => (
              <div
                key={casino.name}
                className="bg-gray-50 border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2"
              >
                <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                <span className="text-sm font-medium text-gray-900">{casino.name}</span>
                <span className="text-xs text-gray-500">({casino.offerCount})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gaps & Recommendations */}
        {stats.gaps.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
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
                        <span className="text-xs font-semibold uppercase text-gray-600">
                          {gap.type} · {gap.severity} priority
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {gap.description}
                      </p>
                      <p className="text-sm text-gray-700">
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
            <p className="text-gray-600">No significant coverage gaps detected!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}


"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiLoader, FiTarget } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import {
  getResearchRecommendations,
  type CoverageRecommendation,
} from "@/lib/ai/gemini-service";

interface AIRecommendationsPanelProps {
  gaps: Array<{
    type: string;
    severity: string;
    description: string;
    recommendation: string;
  }>;
  stats: {
    totalOffers: number;
    stateCount: number;
    casinoCount: number;
  };
  darkMode?: boolean;
}

export function AIRecommendationsPanel({
  gaps,
  stats,
  darkMode = false,
}: AIRecommendationsPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<
    CoverageRecommendation[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const recs = await getResearchRecommendations(gaps, stats);
      setRecommendations(recs);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate recommendations"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    if (darkMode) {
      const colors = {
        high: "bg-red-900/30 text-red-400 border-red-800",
        medium: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
        low: "bg-blue-900/30 text-blue-400 border-blue-800",
      };
      return colors[priority as keyof typeof colors] || colors.low;
    }
    const colors = {
      high: "bg-red-100 text-red-700 border-red-300",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      low: "bg-blue-100 text-blue-700 border-blue-300",
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const getEffortBadge = (effort: string) => {
    if (darkMode) {
      const badges = {
        Low: "bg-green-900/30 text-green-400",
        Medium: "bg-yellow-900/30 text-yellow-400",
        High: "bg-red-900/30 text-red-400",
      };
      return badges[effort as keyof typeof badges] || badges.Medium;
    }
    const badges = {
      Low: "bg-green-100 text-green-700",
      Medium: "bg-yellow-100 text-yellow-700",
      High: "bg-red-100 text-red-700",
    };
    return badges[effort as keyof typeof badges] || badges.Medium;
  };

  return (
    <div className={`rounded-lg shadow-sm p-6 ${
      darkMode 
        ? "bg-gray-800 border border-gray-700" 
        : "bg-white border border-gray-200"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiTarget className="text-purple-600 text-2xl" />
          <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            AI Strategy Recommendations
          </h3>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || gaps.length === 0}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <FiLoader className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <HiSparkles />
              <span>Generate Strategy</span>
            </>
          )}
        </button>
      </div>

      {gaps.length === 0 && (
        <div className="text-center py-8">
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            No gaps detected. Your coverage looks good! 🎉
          </p>
        </div>
      )}

      {error && (
        <div className={`rounded-lg p-4 mb-4 ${
          darkMode 
            ? "bg-red-900/20 border border-red-800" 
            : "bg-red-50 border border-red-200"
        }`}>
          <p className={`text-sm ${darkMode ? "text-red-300" : "text-red-700"}`}>
            {error}
          </p>
        </div>
      )}

      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            AI analyzed {gaps.length} gaps and generated {recommendations.length}{" "}
            prioritized action items:
          </p>

          {recommendations.map((rec, index) => (
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
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}>
                    #{index + 1}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border font-semibold ${getPriorityColor(
                      rec.priority
                    )}`}
                  >
                    {rec.priority.toUpperCase()}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getEffortBadge(
                    rec.estimatedEffort
                  )}`}
                >
                  {rec.estimatedEffort} Effort
                </span>
              </div>

              <h4 className={`font-semibold mb-2 ${
                darkMode ? "text-gray-200" : "text-gray-900"
              }`}>
                {rec.action}
              </h4>

              <p className={`text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {rec.reasoning}
              </p>

              <div className={`rounded p-2 mt-3 ${
                darkMode 
                  ? "bg-gray-700 border border-gray-600" 
                  : "bg-white border border-gray-200"
              }`}>
                <p className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <span className="font-semibold">💡 Next Step:</span> {rec.action}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!recommendations.length && !isGenerating && !error && gaps.length > 0 && (
        <div className={`text-center py-8 rounded-lg border-2 border-dashed ${
          darkMode 
            ? "bg-purple-900/10 border-purple-800" 
            : "bg-purple-50 border-purple-200"
        }`}>
          <HiSparkles className="text-purple-600 text-4xl mx-auto mb-2" />
          <p className={`text-sm mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Ready to generate AI-powered strategy
          </p>
          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            AI will analyze {gaps.length} gaps and create an actionable research plan
          </p>
        </div>
      )}
    </div>
  );
}


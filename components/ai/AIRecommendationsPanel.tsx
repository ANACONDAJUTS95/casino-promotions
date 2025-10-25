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
}

export function AIRecommendationsPanel({
  gaps,
  stats,
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
    const colors = {
      high: "bg-red-100 text-red-700 border-red-300",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      low: "bg-blue-100 text-blue-700 border-blue-300",
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const getEffortBadge = (effort: string) => {
    const badges = {
      Low: "bg-green-100 text-green-700",
      Medium: "bg-yellow-100 text-yellow-700",
      High: "bg-red-100 text-red-700",
    };
    return badges[effort as keyof typeof badges] || badges.Medium;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiTarget className="text-purple-600 text-2xl" />
          <h3 className="text-lg font-bold text-gray-900">
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
          <p className="text-gray-600">
            No gaps detected. Your coverage looks good! 🎉
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <p className="text-sm text-gray-600 mb-4">
            AI analyzed {gaps.length} gaps and generated {recommendations.length}{" "}
            prioritized action items:
          </p>

          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400">
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

              <h4 className="font-semibold text-gray-900 mb-2">{rec.action}</h4>

              <p className="text-sm text-gray-700 mb-2">{rec.reasoning}</p>

              <div className="bg-white rounded border border-gray-200 p-2 mt-3">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">💡 Next Step:</span> {rec.action}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!recommendations.length && !isGenerating && !error && gaps.length > 0 && (
        <div className="text-center py-8 bg-purple-50 rounded-lg border-2 border-dashed border-purple-200">
          <HiSparkles className="text-purple-600 text-4xl mx-auto mb-2" />
          <p className="text-sm text-gray-700 mb-1">
            Ready to generate AI-powered strategy
          </p>
          <p className="text-xs text-gray-500">
            AI will analyze {gaps.length} gaps and create an actionable research plan
          </p>
        </div>
      )}
    </div>
  );
}


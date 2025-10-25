"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiLoader, FiAlertTriangle } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { analyzeOfferQuality, type OfferAnalysis } from "@/lib/ai/gemini-service";

interface AIOfferAnalyzerProps {
  offerName: string;
  casino: string;
  deposit: number;
  bonus: number;
}

export function AIOfferAnalyzer({
  offerName,
  casino,
  deposit,
  bonus,
}: AIOfferAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<OfferAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeOfferQuality(offerName, casino, deposit, bonus);
      setAnalysis(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze offer"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 75) return "text-green-600 bg-green-50";
    if (rating >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <HiSparkles className="text-purple-600 text-lg" />
          <span className="text-sm font-semibold text-gray-900">
            AI Deep Analysis
          </span>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-1">
              <FiLoader className="animate-spin" />
              Analyzing...
            </span>
          ) : (
            "Analyze Quality"
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Overall Rating */}
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">
                OVERALL QUALITY SCORE
              </span>
              <span
                className={`text-2xl font-bold px-3 py-1 rounded-lg ${getRatingColor(
                  analysis.overallRating
                )}`}
              >
                {analysis.overallRating}/100
              </span>
            </div>
            <p className="text-sm text-gray-700">{analysis.recommendation}</p>
          </div>

          {/* Actual Value */}
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">
              ACTUAL VALUE ESTIMATE
            </p>
            <p className="text-sm text-gray-800">{analysis.actualValue}</p>
          </div>

          {/* Warnings */}
          {analysis.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <FiAlertTriangle className="text-yellow-600" />
                <p className="text-xs font-semibold text-yellow-800">
                  WARNINGS & CONCERNS
                </p>
              </div>
              <ul className="space-y-1">
                {analysis.warnings.map((warning, i) => (
                  <li key={i} className="text-xs text-yellow-700 flex items-start gap-1">
                    <span>⚠️</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hidden Restrictions */}
          {analysis.hiddenRestrictions.length > 0 && (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-2">
                LIKELY RESTRICTIONS
              </p>
              <ul className="space-y-1">
                {analysis.hiddenRestrictions.map((restriction, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-1">
                    <span>•</span>
                    <span>{restriction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Positives */}
          {analysis.positives.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-800 mb-2">
                ✨ POSITIVE ASPECTS
              </p>
              <ul className="space-y-1">
                {analysis.positives.map((positive, i) => (
                  <li key={i} className="text-xs text-green-700 flex items-start gap-1">
                    <span>✓</span>
                    <span>{positive}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {!analysis && !isAnalyzing && !error && (
        <p className="text-xs text-gray-600 text-center py-2">
          Click "Analyze Quality" to get AI-powered insights about this offer
        </p>
      )}
    </div>
  );
}


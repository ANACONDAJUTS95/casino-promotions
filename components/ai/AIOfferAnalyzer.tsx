"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiLoader, FiAlertTriangle } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { analyzeOfferQuality, type OfferAnalysis } from "@/lib/ai/gemini-service";

interface AIOfferAnalyzerProps {
  offerName: string;
  casino: string;
  deposit: number;
  bonus: number;
  darkMode?: boolean;
  offerId: string;
  cachedAnalysis?: OfferAnalysis;
  onAnalysisComplete?: (offerId: string, analysis: OfferAnalysis) => void;
}

export function AIOfferAnalyzer({
  offerName,
  casino,
  deposit,
  bonus,
  darkMode = false,
  offerId,
  cachedAnalysis,
  onAnalysisComplete,
}: AIOfferAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<OfferAnalysis | null>(cachedAnalysis || null);
  const [error, setError] = useState<string | null>(null);

  // Sync with cached analysis when it becomes available
  useEffect(() => {
    if (cachedAnalysis) {
      setAnalysis(cachedAnalysis);
    }
  }, [cachedAnalysis]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeOfferQuality(offerName, casino, deposit, bonus);
      setAnalysis(result);
      // Save to cache
      if (onAnalysisComplete) {
        onAnalysisComplete(offerId, result);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze offer"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (darkMode) {
      if (rating >= 75) return "text-green-400 bg-green-900/30";
      if (rating >= 50) return "text-yellow-400 bg-yellow-900/30";
      return "text-red-400 bg-red-900/30";
    }
    if (rating >= 75) return "text-green-600 bg-green-50";
    if (rating >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className={`rounded-lg p-4 ${
      darkMode 
        ? "bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-800" 
        : "bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200"
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <HiSparkles className="text-purple-600 text-lg" />
          <span className={`text-sm font-semibold ${
            darkMode ? "text-gray-200" : "text-gray-900"
          }`}>
            AI Deep Analysis
          </span>
          {analysis && cachedAnalysis && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              darkMode 
                ? "bg-green-900/30 text-green-400 border border-green-800" 
                : "bg-green-50 text-green-700 border border-green-200"
            }`}>
              Cached
            </span>
          )}
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
            analysis ? "Re-analyze" : "Analyze Quality"
          )}
        </button>
      </div>

      {error && (
        <div className={`rounded p-2 mb-3 ${
          darkMode 
            ? "bg-red-900/20 border border-red-800" 
            : "bg-red-50 border border-red-200"
        }`}>
          <p className={`text-xs ${darkMode ? "text-red-300" : "text-red-700"}`}>
            {error}
          </p>
        </div>
      )}

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Overall Rating */}
          <div className={`rounded-lg p-3 ${
            darkMode 
              ? "bg-gray-700 border border-gray-600" 
              : "bg-white border border-gray-200"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
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
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {analysis.recommendation}
            </p>
          </div>

          {/* Actual Value */}
          <div className={`rounded-lg p-3 ${
            darkMode 
              ? "bg-gray-700 border border-gray-600" 
              : "bg-white border border-gray-200"
          }`}>
            <p className={`text-xs font-semibold mb-1 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              ACTUAL VALUE ESTIMATE
            </p>
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
              {analysis.actualValue}
            </p>
          </div>

          {/* Warnings */}
          {analysis.warnings.length > 0 && (
            <div className={`rounded-lg p-3 ${
              darkMode 
                ? "bg-yellow-900/20 border border-yellow-800" 
                : "bg-yellow-50 border border-yellow-200"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <FiAlertTriangle className="text-yellow-600" />
                <p className={`text-xs font-semibold ${
                  darkMode ? "text-yellow-400" : "text-yellow-800"
                }`}>
                  WARNINGS & CONCERNS
                </p>
              </div>
              <ul className="space-y-1">
                {analysis.warnings.map((warning, i) => (
                  <li key={i} className={`text-xs flex items-start gap-1 ${
                    darkMode ? "text-yellow-300" : "text-yellow-700"
                  }`}>
                    <span>⚠️</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hidden Restrictions */}
          {analysis.hiddenRestrictions.length > 0 && (
            <div className={`rounded-lg p-3 ${
              darkMode 
                ? "bg-gray-700 border border-gray-600" 
                : "bg-white border border-gray-200"
            }`}>
              <p className={`text-xs font-semibold mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                LIKELY RESTRICTIONS
              </p>
              <ul className="space-y-1">
                {analysis.hiddenRestrictions.map((restriction, i) => (
                  <li key={i} className={`text-xs flex items-start gap-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    <span>•</span>
                    <span>{restriction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Positives */}
          {analysis.positives.length > 0 && (
            <div className={`rounded-lg p-3 ${
              darkMode 
                ? "bg-green-900/20 border border-green-800" 
                : "bg-green-50 border border-green-200"
            }`}>
              <p className={`text-xs font-semibold mb-2 ${
                darkMode ? "text-green-400" : "text-green-800"
              }`}>
                ✨ POSITIVE ASPECTS
              </p>
              <ul className="space-y-1">
                {analysis.positives.map((positive, i) => (
                  <li key={i} className={`text-xs flex items-start gap-1 ${
                    darkMode ? "text-green-300" : "text-green-700"
                  }`}>
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
        <p className={`text-xs text-center py-2 ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}>
          Click "Analyze Quality" to get AI-powered insights about this offer
        </p>
      )}
    </div>
  );
}


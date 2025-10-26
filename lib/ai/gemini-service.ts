import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient() {
  if (!genAI) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "NEXT_PUBLIC_GEMINI_API_KEY is not set. Please add it to your .env.local file."
      );
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * Retry helper with exponential backoff for handling API overload
 * Automatically retries on 503 errors or overload messages
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 2000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "";
      const is503 = errorMessage.includes("503");
      const isOverloaded = errorMessage.includes("overloaded");
      const shouldRetry = (is503 || isOverloaded) && i < maxRetries - 1;
      
      if (shouldRetry) {
        const delay = baseDelay * Math.pow(2, i); // Exponential backoff: 2s, 4s, 8s
        console.log(`⚠️ AI model busy, retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If not retryable or last retry failed, throw the error
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

export interface DiscoveredOffer {
  casino: string;
  offerName: string;
  offerType: string;
  estimatedDeposit: number;
  estimatedBonus: number;
  source: string;
  confidence: "high" | "medium" | "low";
  notes: string;
}

export interface OfferAnalysis {
  overallRating: number; // 0-100
  hiddenRestrictions: string[];
  actualValue: string;
  recommendation: string;
  warnings: string[];
  positives: string[];
}

export interface CoverageRecommendation {
  priority: "high" | "medium" | "low";
  action: string;
  reasoning: string;
  estimatedEffort: string;
}

/**
 * Discover new casino offers using AI web research
 */
export async function discoverOffersWithAI(
  state: string,
  missingCasinos: string[],
  context: string
): Promise<DiscoveredOffer[]> {
  try {
    const genAI = getGeminiClient();
    // Using experimental model with retry logic for reliability
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Limit to top 5 missing casinos to reduce token count
    const topMissingCasinos = missingCasinos.slice(0, 5);

    const prompt = `You are a casino promotions research assistant. Research current casino welcome offers in ${state}.

Context: ${context}

Priority Targets: ${topMissingCasinos.join(", ")}

Task: Find 5-8 current casino welcome bonus offers in ${state}. Focus on major online casinos (BetMGM, DraftKings, FanDuel, Caesars) and the priority targets above.

Return ONLY a valid JSON array (no markdown):
[
  {
    "casino": "Casino Name",
    "offerName": "Full offer description",
    "offerType": "Deposit (Cashable)" or "Lossback" or "No Deposit",
    "estimatedDeposit": 100,
    "estimatedBonus": 100,
    "source": "Brief source",
    "confidence": "high" or "medium" or "low",
    "notes": "Important restrictions"
  }
]

Important: Use realistic data, mark uncertain as "low" confidence, numbers only for amounts.`;

    // Add retry logic with exponential backoff
    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    }, 3, 2000);

    const response = result.response.text();
    
    // Clean the response - remove markdown code blocks if present
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
    }
    
    const offers = JSON.parse(cleanedResponse);
    return offers;
  } catch (error) {
    console.error("Error discovering offers with AI:", error);
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes("503") || error.message.includes("overloaded")) {
        throw new Error("AI service is temporarily busy. Please try again in a few seconds.");
      }
    }
    
    throw new Error(
      error instanceof Error ? error.message : "Failed to discover offers"
    );
  }
}

/**
 * Analyze offer quality and identify hidden restrictions
 */
export async function analyzeOfferQuality(
  offerName: string,
  casino: string,
  deposit: number,
  bonus: number
): Promise<OfferAnalysis> {
  try {
    const genAI = getGeminiClient();
    // Using experimental model with retry logic for reliability
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are an expert casino promotions analyst. Analyze this offer for actual value and hidden restrictions.

Casino: ${casino}
Offer: "${offerName}"
Deposit Required: $${deposit}
Bonus Amount: $${bonus}
Value Ratio: ${((bonus / deposit) * 100).toFixed(0)}%

Your Task:
1. Estimate likely wagering requirements (10-30x is typical)
2. Identify probable time limits (7-30 days common)
3. Consider game restrictions, cashout limits
4. Calculate realistic actual value
5. Identify red flags or concerns
6. Rate the offer 0-100 based on:
   - 90-100: Exceptional value, minimal restrictions
   - 75-89: Good value with reasonable terms
   - 60-74: Average value with standard restrictions
   - 40-59: Below average, restrictive terms
   - 0-39: Poor value or very restrictive

Return ONLY valid JSON (no markdown, no code blocks):
{
  "overallRating": <number 0-100>,
  "hiddenRestrictions": ["List 3-5 likely hidden restrictions or terms"],
  "actualValue": "Explain the real-world value after restrictions",
  "recommendation": "Clear recommendation: Worth it, Skip it, or Proceed with caution",
  "warnings": ["List any red flags or concerns"],
  "positives": ["List positive aspects of the offer"]
}

Be critical and realistic. Most offers have significant restrictions. Vary your ratings based on actual value.`;

    // Add retry logic
    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    }, 3, 2000);

    const response = result.response.text();
    
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
    }
    
    const analysis = JSON.parse(cleanedResponse);
    return analysis;
  } catch (error) {
    console.error("Error analyzing offer:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("503") || error.message.includes("overloaded")) {
        throw new Error("AI service is temporarily busy. Please try again in a moment.");
      }
    }
    
    throw new Error(
      error instanceof Error ? error.message : "Failed to analyze offer"
    );
  }
}

/**
 * Get AI-powered recommendations for coverage improvement
 */
export async function getResearchRecommendations(
  gaps: Array<{ type: string; severity: string; description: string; recommendation: string }>,
  currentStats: {
    totalOffers: number;
    stateCount: number;
    casinoCount: number;
  }
): Promise<CoverageRecommendation[]> {
  try {
    const genAI = getGeminiClient();
    // Using experimental model with retry logic for reliability
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Limit to top 5 gaps to reduce token count and improve reliability
    const topGaps = gaps.slice(0, 5);

    const prompt = `You are a casino promotions research strategist. Analyze gaps and provide prioritized recommendations.

Current Coverage: ${currentStats.totalOffers} offers across ${currentStats.stateCount} states from ${currentStats.casinoCount} casinos.

Top Gaps:
${topGaps.map((g, i) => `${i + 1}. [${g.severity}] ${g.description}`).join("\n")}

Task: Provide 5-7 prioritized recommendations considering ease of implementation, value, and resource efficiency.

Return ONLY valid JSON array (no markdown):
[
  {
    "priority": "high" or "medium" or "low",
    "action": "Specific action to take",
    "reasoning": "Why this is important",
    "estimatedEffort": "Low/Medium/High"
  }
]`;

    // Add retry logic with exponential backoff
    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    }, 3, 2000);

    const response = result.response.text();
    
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
    }
    
    const recommendations = JSON.parse(cleanedResponse);
    return recommendations;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes("503") || error.message.includes("overloaded")) {
        throw new Error("AI service is temporarily busy. Please wait a few seconds and try again.");
      }
      if (error.message.includes("quota")) {
        throw new Error("API rate limit reached. Please wait a moment before trying again.");
      }
    }
    
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate recommendations"
    );
  }
}

/**
 * Check if API key is configured
 */
export function isGeminiConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
}


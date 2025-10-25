import { CasinoOffer } from "@/lib/data/casino-offers";

/**
 * Priority Score Calculation
 * This function calculates a priority score for each offer based on multiple factors:
 * 
 * 1. Value Ratio (40%): Bonus-to-Deposit ratio (higher is better)
 * 2. Absolute Bonus (30%): Total bonus amount (normalized)
 * 3. Offer Type (20%): Weighted preference (Lossback > Deposit)
 * 4. Deposit Accessibility (10%): Lower deposits are more accessible
 */

export interface ScoredOffer extends CasinoOffer {
  priorityScore: number;
  valueRatio: number;
  scoreBreakdown: {
    valueRatioScore: number;
    bonusAmountScore: number;
    offerTypeScore: number;
    accessibilityScore: number;
  };
  insights: string[];
}

export type SortOption =
  | "priority"
  | "bonus-high"
  | "bonus-low"
  | "value-ratio"
  | "state"
  | "casino";

// Weights for scoring components
const WEIGHTS = {
  valueRatio: 0.4,
  bonusAmount: 0.3,
  offerType: 0.2,
  accessibility: 0.1,
};

/**
 * Calculate value ratio (bonus/deposit)
 * Handle edge cases like 0 deposit
 */
function calculateValueRatio(deposit: number, bonus: number): number {
  if (deposit === 0) return bonus > 0 ? 3 : 0; // Free bonus case
  return bonus / deposit;
}

/**
 * Normalize bonus amount to 0-100 scale
 * Using logarithmic scale to handle wide range of values
 */
function normalizeBonusAmount(bonus: number, maxBonus: number): number {
  if (maxBonus === 0) return 0;
  // Use log scale for better distribution
  const logBonus = Math.log10(bonus + 1);
  const logMax = Math.log10(maxBonus + 1);
  return (logBonus / logMax) * 100;
}

/**
 * Score offer type based on value proposition
 * Lossback offers are generally more valuable (risk-free)
 */
function scoreOfferType(offerType: string): number {
  const typeScores: Record<string, number> = {
    Lossback: 100,
    "Deposit (Cashable)": 85,
    "No Deposit": 70,
    "Free Spins": 60,
  };

  return typeScores[offerType] || 50;
}

/**
 * Score accessibility based on deposit requirement
 * Lower deposits are more accessible (inverse relationship)
 */
function scoreAccessibility(deposit: number, maxDeposit: number): number {
  if (maxDeposit === 0) return 100;
  if (deposit === 0) return 100; // No deposit required
  
  // Inverse scoring - lower deposits get higher scores
  return 100 - (deposit / maxDeposit) * 100;
}

/**
 * Generate insights about why an offer is valuable or not
 */
function generateInsights(offer: CasinoOffer, valueRatio: number): string[] {
  const insights: string[] = [];

  // Value ratio insights
  if (valueRatio >= 2) {
    insights.push(`🎯 Exceptional value: ${(valueRatio * 100).toFixed(0)}% return on deposit`);
  } else if (valueRatio >= 1) {
    insights.push(`✅ Good value: ${(valueRatio * 100).toFixed(0)}% match`);
  }

  // Bonus amount insights
  if (offer.Expected_Bonus >= 1000) {
    insights.push(`💰 High bonus amount: $${offer.Expected_Bonus.toLocaleString()}`);
  }

  // Offer type insights
  if (offer.offer_type === "Lossback") {
    insights.push("🛡️ Risk-free: Get losses back");
  }

  // Low barrier insights
  if (offer.Expected_Deposit === 0) {
    insights.push("🎁 No deposit required!");
  } else if (offer.Expected_Deposit <= 100) {
    insights.push(`💵 Low entry: Only $${offer.Expected_Deposit} deposit`);
  }

  // State-specific insights
  if (offer.state.Abbreviation === "WV") {
    insights.push("⭐ West Virginia exclusive");
  }

  return insights;
}

/**
 * Score a single offer
 */
export function scoreOffer(
  offer: CasinoOffer,
  maxBonus: number,
  maxDeposit: number
): ScoredOffer {
  const valueRatio = calculateValueRatio(
    offer.Expected_Deposit,
    offer.Expected_Bonus
  );

  // Calculate individual component scores (0-100)
  const valueRatioScore = Math.min(valueRatio * 50, 100); // Cap at 100
  const bonusAmountScore = normalizeBonusAmount(offer.Expected_Bonus, maxBonus);
  const offerTypeScore = scoreOfferType(offer.offer_type);
  const accessibilityScore = scoreAccessibility(
    offer.Expected_Deposit,
    maxDeposit
  );

  // Calculate weighted priority score
  const priorityScore =
    valueRatioScore * WEIGHTS.valueRatio +
    bonusAmountScore * WEIGHTS.bonusAmount +
    offerTypeScore * WEIGHTS.offerType +
    accessibilityScore * WEIGHTS.accessibility;

  const insights = generateInsights(offer, valueRatio);

  return {
    ...offer,
    priorityScore: Math.round(priorityScore * 10) / 10, // Round to 1 decimal
    valueRatio,
    scoreBreakdown: {
      valueRatioScore: Math.round(valueRatioScore),
      bonusAmountScore: Math.round(bonusAmountScore),
      offerTypeScore: Math.round(offerTypeScore),
      accessibilityScore: Math.round(accessibilityScore),
    },
    insights,
  };
}

/**
 * Score and prioritize all offers
 */
export function prioritizeOffers(offers: CasinoOffer[]): ScoredOffer[] {
  if (offers.length === 0) return [];

  // Calculate max values for normalization
  const maxBonus = Math.max(...offers.map((o) => o.Expected_Bonus));
  const maxDeposit = Math.max(...offers.map((o) => o.Expected_Deposit));

  // Score all offers
  const scoredOffers = offers.map((offer) =>
    scoreOffer(offer, maxBonus, maxDeposit)
  );

  // Sort by priority score (highest first)
  return scoredOffers.sort((a, b) => b.priorityScore - a.priorityScore);
}

/**
 * Sort offers based on selected criteria
 */
export function sortOffers(
  offers: ScoredOffer[],
  sortBy: SortOption
): ScoredOffer[] {
  const sorted = [...offers];

  switch (sortBy) {
    case "priority":
      return sorted.sort((a, b) => b.priorityScore - a.priorityScore);
    
    case "bonus-high":
      return sorted.sort((a, b) => b.Expected_Bonus - a.Expected_Bonus);
    
    case "bonus-low":
      return sorted.sort((a, b) => a.Expected_Bonus - b.Expected_Bonus);
    
    case "value-ratio":
      return sorted.sort((a, b) => b.valueRatio - a.valueRatio);
    
    case "state":
      return sorted.sort((a, b) =>
        a.state.Name.localeCompare(b.state.Name)
      );
    
    case "casino":
      return sorted.sort((a, b) => a.Name.localeCompare(b.Name));
    
    default:
      return sorted;
  }
}

/**
 * Get priority tier for an offer
 */
export function getPriorityTier(
  priorityScore: number
): "high" | "medium" | "low" {
  if (priorityScore >= 75) return "high";
  if (priorityScore >= 50) return "medium";
  return "low";
}

/**
 * Get priority badge styling
 */
export function getPriorityBadge(tier: "high" | "medium" | "low") {
  const badges = {
    high: {
      label: "High Priority",
      className: "bg-green-100 text-green-800 border-green-200",
      icon: "🔥",
    },
    medium: {
      label: "Medium Priority",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: "⭐",
    },
    low: {
      label: "Low Priority",
      className: "bg-gray-100 text-gray-800 border-gray-200",
      icon: "📋",
    },
  };

  return badges[tier];
}


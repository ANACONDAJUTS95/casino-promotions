import { CasinoOffer } from "@/lib/data/casino-offers";

export interface CoverageGap {
  type: "state" | "casino" | "offer_type" | "value";
  severity: "high" | "medium" | "low";
  description: string;
  recommendation: string;
  data: any;
}

export interface CoverageStats {
  totalOffers: number;
  stateDistribution: Record<string, number>;
  casinoDistribution: Record<string, number>;
  offerTypeDistribution: Record<string, number>;
  averageBonusByState: Record<string, number>;
  topCasinos: Array<{ name: string; offerCount: number }>;
  gaps: CoverageGap[];
}

/**
 * Analyze offer coverage and identify gaps
 */
export function analyzeCoverage(offers: CasinoOffer[]): CoverageStats {
  const stateDistribution: Record<string, number> = {};
  const casinoDistribution: Record<string, number> = {};
  const offerTypeDistribution: Record<string, number> = {};
  const bonusByState: Record<string, number[]> = {};

  // Collect statistics
  offers.forEach((offer) => {
    const stateName = offer.state.Name;
    const casinoName = offer.Name;
    const offerType = offer.offer_type;

    // Count by state
    stateDistribution[stateName] = (stateDistribution[stateName] || 0) + 1;

    // Count by casino
    casinoDistribution[casinoName] = (casinoDistribution[casinoName] || 0) + 1;

    // Count by offer type
    offerTypeDistribution[offerType] =
      (offerTypeDistribution[offerType] || 0) + 1;

    // Track bonuses by state
    if (!bonusByState[stateName]) {
      bonusByState[stateName] = [];
    }
    bonusByState[stateName].push(offer.Expected_Bonus);
  });

  // Calculate average bonus by state
  const averageBonusByState: Record<string, number> = {};
  Object.keys(bonusByState).forEach((state) => {
    const bonuses = bonusByState[state];
    averageBonusByState[state] =
      bonuses.reduce((sum, b) => sum + b, 0) / bonuses.length;
  });

  // Get top casinos by offer count
  const topCasinos = Object.entries(casinoDistribution)
    .map(([name, count]) => ({ name, offerCount: count }))
    .sort((a, b) => b.offerCount - a.offerCount)
    .slice(0, 10);

  // Identify gaps
  const gaps = identifyGaps(
    offers,
    stateDistribution,
    casinoDistribution,
    offerTypeDistribution,
    averageBonusByState
  );

  return {
    totalOffers: offers.length,
    stateDistribution,
    casinoDistribution,
    offerTypeDistribution,
    averageBonusByState,
    topCasinos,
    gaps,
  };
}

/**
 * Identify specific gaps in coverage
 */
function identifyGaps(
  offers: CasinoOffer[],
  stateDistribution: Record<string, number>,
  casinoDistribution: Record<string, number>,
  offerTypeDistribution: Record<string, number>,
  averageBonusByState: Record<string, number>
): CoverageGap[] {
  const gaps: CoverageGap[] = [];
  const states = Object.keys(stateDistribution);
  const avgOffersPerState =
    Object.values(stateDistribution).reduce((a, b) => a + b, 0) / states.length;

  // Gap 1: States with low offer count
  states.forEach((state) => {
    const offerCount = stateDistribution[state];
    if (offerCount < avgOffersPerState * 0.7) {
      gaps.push({
        type: "state",
        severity: "high",
        description: `${state} has only ${offerCount} offers (${Math.round(
          (offerCount / avgOffersPerState) * 100
        )}% of average)`,
        recommendation: `Research more casinos operating in ${state} or check for missing promotions from existing casinos.`,
        data: { state, offerCount, average: avgOffersPerState },
      });
    }
  });

  // Gap 2: Casinos with single-state presence that could expand
  const casinosByState: Record<string, Set<string>> = {};
  offers.forEach((offer) => {
    const casinoName = offer.Name;
    if (!casinosByState[casinoName]) {
      casinosByState[casinoName] = new Set();
    }
    casinosByState[casinoName].add(offer.state.Name);
  });

  Object.entries(casinosByState).forEach(([casino, statesSet]) => {
    if (statesSet.size === 1 && casinoDistribution[casino] > 2) {
      const state = Array.from(statesSet)[0];
      const missingStates = states.filter((s) => s !== state);
      
      gaps.push({
        type: "casino",
        severity: "medium",
        description: `${casino} only operates in ${state} but has ${casinoDistribution[casino]} offers there`,
        recommendation: `Check if ${casino} operates in ${missingStates.join(", ")}. Multi-state casinos often have similar offers.`,
        data: { casino, currentState: state, missingStates },
      });
    }
  });

  // Gap 3: Offer type imbalance
  const totalOffers = offers.length;
  Object.entries(offerTypeDistribution).forEach(([offerType, count]) => {
    const percentage = (count / totalOffers) * 100;
    if (percentage < 20 && offerType === "Lossback") {
      gaps.push({
        type: "offer_type",
        severity: "medium",
        description: `Only ${count} Lossback offers (${percentage.toFixed(
          1
        )}% of total)`,
        recommendation:
          "Lossback offers are valuable risk-free options. Search for casinos offering 'money back', 'insurance', or 'risk-free' promotions.",
        data: { offerType, count, percentage },
      });
    }
  });

  // Gap 4: States with below-average bonus values
  const overallAvgBonus =
    Object.values(averageBonusByState).reduce((a, b) => a + b, 0) /
    Object.values(averageBonusByState).length;

  states.forEach((state) => {
    const stateAvg = averageBonusByState[state];
    if (stateAvg < overallAvgBonus * 0.75) {
      gaps.push({
        type: "value",
        severity: "medium",
        description: `${state} average bonus ($${stateAvg.toFixed(
          0
        )}) is 25% below overall average ($${overallAvgBonus.toFixed(0)})`,
        recommendation: `Look for premium offers in ${state} or check if major casinos have higher-tier promotions available.`,
        data: { state, stateAvg, overallAvg: overallAvgBonus },
      });
    }
  });

  // Gap 5: Missing major casinos
  const majorCasinos = [
    "BetMGM",
    "DraftKings",
    "FanDuel",
    "Caesars",
    "BetRivers",
  ];
  
  // Check which major casinos are present
  const presentCasinos = new Set<string>();
  offers.forEach((o) => {
    const lowerName = o.Name.toLowerCase();
    if (lowerName.includes("betmgm")) presentCasinos.add("BetMGM");
    if (lowerName.includes("draftkings")) presentCasinos.add("DraftKings");
    if (lowerName.includes("fanduel")) presentCasinos.add("FanDuel");
    if (lowerName.includes("caesars")) presentCasinos.add("Caesars");
    if (lowerName.includes("rivers")) presentCasinos.add("BetRivers");
  });

  majorCasinos.forEach((casino) => {
    if (!presentCasinos.has(casino)) {
      gaps.push({
        type: "casino",
        severity: "high",
        description: `Major casino ${casino} may be missing from database`,
        recommendation: `${casino} is a major operator. Verify if they have offers in your tracked states.`,
        data: { casino },
      });
    }
  });

  // Sort gaps by severity
  const severityOrder = { high: 0, medium: 1, low: 2 };
  gaps.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return gaps;
}

/**
 * Find casinos present in some states but missing in others
 */
export function findCrossCoverageGaps(
  offers: CasinoOffer[]
): Array<{
  casino: string;
  presentIn: string[];
  missingIn: string[];
}> {
  const allStates = new Set(offers.map((o) => o.state.Name));
  const casinosByState: Record<string, Set<string>> = {};

  // Build casino presence map
  offers.forEach((offer) => {
    if (!casinosByState[offer.Name]) {
      casinosByState[offer.Name] = new Set();
    }
    casinosByState[offer.Name].add(offer.state.Name);
  });

  // Find gaps
  const gaps: Array<{
    casino: string;
    presentIn: string[];
    missingIn: string[];
  }> = [];

  Object.entries(casinosByState).forEach(([casino, presentStates]) => {
    // Only consider casinos in multiple states (likely multi-state operators)
    if (presentStates.size > 1 && presentStates.size < allStates.size) {
      const missingStates = Array.from(allStates).filter(
        (state) => !presentStates.has(state)
      );

      gaps.push({
        casino,
        presentIn: Array.from(presentStates),
        missingIn: missingStates,
      });
    }
  });

  return gaps.sort((a, b) => b.presentIn.length - a.presentIn.length);
}

/**
 * Identify underrepresented offer types by state
 */
export function findOfferTypeGapsByState(
  offers: CasinoOffer[]
): Record<
  string,
  Array<{ offerType: string; count: number; percentage: number }>
> {
  const states = [...new Set(offers.map((o) => o.state.Name))];
  const result: Record<
    string,
    Array<{ offerType: string; count: number; percentage: number }>
  > = {};

  states.forEach((state) => {
    const stateOffers = offers.filter((o) => o.state.Name === state);
    const offerTypes: Record<string, number> = {};

    stateOffers.forEach((offer) => {
      offerTypes[offer.offer_type] = (offerTypes[offer.offer_type] || 0) + 1;
    });

    result[state] = Object.entries(offerTypes)
      .map(([offerType, count]) => ({
        offerType,
        count,
        percentage: (count / stateOffers.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  });

  return result;
}

/**
 * Get recommendation priority for research
 */
export function getResearchPriorities(gaps: CoverageGap[]): string[] {
  const priorities: string[] = [];

  // High severity gaps first
  const highSeverity = gaps.filter((g) => g.severity === "high");
  highSeverity.forEach((gap) => {
    priorities.push(gap.recommendation);
  });

  // Then medium severity
  const mediumSeverity = gaps.filter((g) => g.severity === "medium").slice(0, 3);
  mediumSeverity.forEach((gap) => {
    priorities.push(gap.recommendation);
  });

  return priorities;
}


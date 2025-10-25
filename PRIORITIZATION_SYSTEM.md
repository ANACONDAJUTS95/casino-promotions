# Casino Offer Prioritization System

## Overview

This intelligent research tool helps identify gaps in casino offer coverage and prioritizes promotional offers using a smart scoring algorithm.

## Features

### 1. **Smart Prioritization Algorithm**

The system scores each offer based on four weighted factors:

- **Value Ratio (40%)**: Bonus-to-deposit ratio (higher is better)
- **Absolute Bonus Amount (30%)**: Total bonus value (normalized using logarithmic scale)
- **Offer Type (20%)**: Weighted preference (Lossback > Deposit > Others)
- **Accessibility (10%)**: Lower deposit requirements score higher

#### Priority Tiers
- **High Priority (75-100)**: 🔥 Exceptional offers worth pursuing
- **Medium Priority (50-74)**: ⭐ Good offers worth considering
- **Low Priority (0-49)**: 📋 Standard offers

### 2. **Coverage Gap Analysis**

The system automatically identifies:

#### State Gaps
- States with below-average offer counts
- Percentage comparison to average coverage

#### Casino Expansion Opportunities
- Casinos operating in only one state
- Potential multi-state expansion targets

#### Offer Type Imbalance
- Underrepresented offer types (especially valuable Lossback offers)
- Distribution percentages

#### Value Gaps
- States with below-average bonus values
- Comparison to overall average

#### Missing Major Operators
- Identifies if major casinos (BetMGM, DraftKings, FanDuel, etc.) are missing

### 3. **Sorting Options**

- **Priority Score**: AI-calculated priority (default)
- **Highest Bonus**: Sort by absolute bonus amount
- **Best Value**: Sort by value ratio (bonus/deposit)
- **State**: Alphabetical by state

### 4. **Detailed Insights**

Click any row to expand and see:

- **Full offer description**
- **AI-generated insights** with emoji indicators:
  - 🎯 Exceptional value
  - ✅ Good value
  - 💰 High bonus amount
  - 🛡️ Risk-free offer
  - 🎁 No deposit required
  - 💵 Low entry barrier
  - ⭐ State exclusive

- **Score breakdown** showing individual component scores:
  - Value Ratio Score
  - Bonus Amount Score
  - Offer Type Score
  - Accessibility Score

### 5. **Interactive Dashboard**

Toggle the "Show Insights" button to view:

- **Summary statistics**: Total offers, states covered, unique casinos, gap count
- **State distribution**: Offers per state with average bonus values
- **Top casinos**: Ranked by offer count
- **Prioritized recommendations**: Actionable research priorities

## How to Use

### Quick Start

1. Click "Run Search" on the home page
2. Use the sort controls to view offers by different criteria
3. Click "Show Insights" to see coverage gaps and recommendations
4. Click any offer row to see detailed scoring breakdown

### Research Workflow

1. **Start with Priority Sort**: See the most valuable offers first
2. **Review High Priority Offers** (score ≥ 75): These are exceptional opportunities
3. **Check Insights Dashboard**: Identify coverage gaps
4. **Focus on High Severity Gaps**: Research missing casinos or underrepresented states
5. **Cross-Reference**: Look for similar offers in other states from the same casino

### Understanding Value Indicators

- **Green badges (≥200% value)**: Exceptional offers with sparkle icon ✨
- **Blue badges (≥100% value)**: Standard match offers
- **Gray badges (<100% value)**: Below-average value ratio

## Scoring Examples

### Example 1: High Priority Offer
```
Casino: Four Winds
Offer: 200% Deposit Bonus, max $200
Deposit: $100
Bonus: $200
Priority Score: 85.4

Breakdown:
- Value Ratio: 96 (200% return)
- Bonus Amount: 67
- Offer Type: 85 (Deposit Cashable)
- Accessibility: 96 (Low $100 deposit)

Insights:
- 🎯 Exceptional value: 200% return on deposit
- 💵 Low entry: Only $100 deposit
```

### Example 2: Medium Priority Offer
```
Casino: Caesars Palace
Offer: 100% Deposit Match Up To $1,000
Deposit: $1,000
Bonus: $1,010
Priority Score: 64.8

Breakdown:
- Value Ratio: 50 (100% return)
- Bonus Amount: 89 (High bonus)
- Offer Type: 85 (Deposit Cashable)
- Accessibility: 40 (Higher $1,000 deposit)

Insights:
- ✅ Good value: 100% match
- 💰 High bonus amount: $1,010
```

## Gap Analysis Examples

### State Coverage Gap
```
Type: State
Severity: High
Description: West Virginia has only 8 offers (40% of average)
Recommendation: Research more casinos operating in West Virginia 
or check for missing promotions from existing casinos.
```

### Casino Expansion Opportunity
```
Type: Casino
Severity: Medium
Description: Jackpocket only operates in New Jersey but has 1 offers there
Recommendation: Check if Jackpocket operates in Pennsylvania, Michigan, 
West Virginia. Multi-state casinos often have similar offers.
```

### Offer Type Imbalance
```
Type: Offer Type
Severity: Medium
Description: Only 15 Lossback offers (27.3% of total)
Recommendation: Lossback offers are valuable risk-free options. 
Search for casinos offering 'money back', 'insurance', or 'risk-free' promotions.
```

## Future Enhancements

### When AI Integration is Added

The current smart function can be enhanced with:

1. **Natural Language Queries**: "Find best offers in Pennsylvania with low deposit"
2. **Competitive Analysis**: Compare offers across states automatically
3. **Trend Detection**: Identify seasonal patterns and emerging offers
4. **Personalized Recommendations**: Based on user preferences and history
5. **Automated Research**: AI scraping to find new offers based on gap recommendations

### Extending the Algorithm

To customize the scoring algorithm, edit `lib/utils/offer-prioritization.ts`:

```typescript
const WEIGHTS = {
  valueRatio: 0.4,      // Adjust weight for value ratio
  bonusAmount: 0.3,     // Adjust weight for bonus amount
  offerType: 0.2,       // Adjust weight for offer type
  accessibility: 0.1,   // Adjust weight for accessibility
};
```

## Technical Details

### Files Structure

```
lib/
├── utils/
│   ├── offer-prioritization.ts  # Scoring and sorting logic
│   ├── gap-analysis.ts          # Coverage gap detection
│   └── index.ts                 # Utility exports
components/
├── CasinoDataTable.tsx          # Enhanced table with scoring
├── InsightsDashboard.tsx        # Gap analysis dashboard
└── ...
```

### Key Functions

#### `prioritizeOffers(offers: CasinoOffer[]): ScoredOffer[]`
Scores and sorts all offers by priority

#### `sortOffers(offers: ScoredOffer[], sortBy: SortOption): ScoredOffer[]`
Sorts offers by specified criteria

#### `analyzeCoverage(offers: CasinoOffer[]): CoverageStats`
Analyzes coverage and identifies gaps

#### `getPriorityTier(priorityScore: number): "high" | "medium" | "low"`
Categorizes offers by priority level

## Performance

- Scoring algorithm: O(n) complexity
- Gap analysis: O(n) complexity
- Handles 1000+ offers efficiently
- Real-time sorting and filtering

## Support

For questions or enhancement requests, refer to:
- Scoring algorithm: `lib/utils/offer-prioritization.ts`
- Gap detection: `lib/utils/gap-analysis.ts`
- UI components: `components/CasinoDataTable.tsx` and `components/InsightsDashboard.tsx`


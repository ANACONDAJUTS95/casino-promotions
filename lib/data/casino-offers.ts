export interface CasinoOffer {
  id: string; // Unique identifier for React keys
  casinodb_id: number;
  Offer_Name: string;
  offer_type: string;
  Expected_Deposit: number;
  Expected_Bonus: number;
  Name: string;
  states_id: number;
  state: {
    Name: string;
    Abbreviation: string;
  };
}

// Raw data from database
const rawOffers = [
  {
    "casinodb_id": 1132,
    "Offer_Name": "24 Hour Lossback - Earn back 100% of your net losses back on Slot Games, up to $1,000 in Casino Credits!",
    "offer_type": "Lossback",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1000,
    "Name": "Golden Nugget",
    "states_id": 5,
    "state": {
      "Name": "West Virginia",
      "Abbreviation": "WV"
    }
  },
  {
    "casinodb_id": 1156,
    "Offer_Name": "Casino New Player Bonus: 100% Up to $1,000",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1000,
    "Name": "Bet365",
    "states_id": 2,
    "state": {
      "Name": "Pennsylvania",
      "Abbreviation": "PA"
    }
  },
  {
    "casinodb_id": 1096,
    "Offer_Name": "100% Deposit Match up to $1,000, and $25 Casino Bonus",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1025,
    "Name": "BetMGM",
    "states_id": 2,
    "state": {
      "Name": "Pennsylvania",
      "Abbreviation": "PA"
    }
  },
  {
    "casinodb_id": 1119,
    "Offer_Name": "200% Deposit Bonus, max $200 bonus & 75 Bonus Spins on Cash Eruption",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 100,
    "Expected_Bonus": 200,
    "Name": "Four Winds",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 62,
    "Offer_Name": "100% Deposit Match up to $1,000, and $25 Casino Bonus",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1025,
    "Name": "BetMGM",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 1113,
    "Offer_Name": "100% Deposit Match up to $1,000, and $25 Casino Bonus",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1025,
    "Name": "BetMGM",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 66,
    "Offer_Name": "Welcome Offer - 100% Match up to $100 on your first deposit",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 100,
    "Expected_Bonus": 100,
    "Name": "Stardust",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 1200,
    "Offer_Name": "Up to $100 Cash Back",
    "offer_type": "Lossback",
    "Expected_Deposit": 100,
    "Expected_Bonus": 100,
    "Name": "Monopoly Casino",
    "states_id": 2,
    "state": {
      "Name": "Pennsylvania",
      "Abbreviation": "PA"
    }
  },
  {
    "casinodb_id": 1163,
    "Offer_Name": "New User Offer - 100% bonus match on your first deposit up to $500",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 500,
    "Expected_Bonus": 500,
    "Name": "Horseshoe Online Casino",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 1128,
    "Offer_Name": "New Customers 100% Match up to $500 (1/2)",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 250,
    "Expected_Bonus": 250,
    "Name": "Betly",
    "states_id": 5,
    "state": {
      "Name": "West Virginia",
      "Abbreviation": "WV"
    }
  },
  {
    "casinodb_id": 1128,
    "Offer_Name": "New Customers 100% Match up to $500 (2/2)",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 250,
    "Expected_Bonus": 250,
    "Name": "Betly",
    "states_id": 5,
    "state": {
      "Name": "West Virginia",
      "Abbreviation": "WV"
    }
  },
  {
    "casinodb_id": 1135,
    "Offer_Name": "100% Deposit Match Bonus up to $500",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 500,
    "Expected_Bonus": 500,
    "Name": "Jackpocket",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 77,
    "Offer_Name": "First Day Risk Free Up To $1,000",
    "offer_type": "Lossback",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1000,
    "Name": "FanDuel",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 73,
    "Offer_Name": "First Deposit: 100% match plus 250 Spins on First Deposit",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 100,
    "Expected_Bonus": 100,
    "Name": "Mohegan Sun",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 1166,
    "Offer_Name": "24 Hour Insurance (100% up to $500)",
    "offer_type": "Lossback",
    "Expected_Deposit": 500,
    "Expected_Bonus": 500,
    "Name": "ESPN Bet",
    "states_id": 5,
    "state": {
      "Name": "West Virginia",
      "Abbreviation": "WV"
    }
  },
  {
    "casinodb_id": 1110,
    "Offer_Name": "100%  First Deposit Match Bonus (Up to $400)",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 400,
    "Expected_Bonus": 400,
    "Name": "Wind Creek",
    "states_id": 2,
    "state": {
      "Name": "Pennsylvania",
      "Abbreviation": "PA"
    }
  },
  {
    "casinodb_id": 1118,
    "Offer_Name": "(Day 2 of 5) First Deposit Bonus! Earn up to $750 in iCasino Rewards!",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 0,
    "Expected_Bonus": 75,
    "Name": "Firekeepers",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 83,
    "Offer_Name": "100% Deposit Match Up To $1,000",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1010,
    "Name": "Caesars Palace Online",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 69,
    "Offer_Name": "100% Match Up To $1,000",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1000,
    "Name": "betOcean Online Casino",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 1117,
    "Offer_Name": "Get up to $1,000 back in Casino Bonus on any first-day net loss.",
    "offer_type": "Lossback",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1000,
    "Name": "FanDuel",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 81,
    "Offer_Name": "New Player Offer 100% Deposit Match up to $500",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 500,
    "Expected_Bonus": 500,
    "Name": "PlayStar",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 1122,
    "Offer_Name": "Welcome Offer Package - Up to $1,000",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1000,
    "Name": "Play Eagle",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 84,
    "Offer_Name": "Deposit Match 100% up to $1,000",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1000,
    "Name": "Hard Rock Bet",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 1121,
    "Offer_Name": "Bonus Back Up to $1,000",
    "offer_type": "Lossback",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1000,
    "Name": "Gun Lake",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 1118,
    "Offer_Name": "(Day 5 of 5) First Deposit Bonus! Earn up to $750 in iCasino Rewards!",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 0,
    "Expected_Bonus": 350,
    "Name": "Firekeepers",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 61,
    "Offer_Name": "200% up to $100",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 50,
    "Expected_Bonus": 100,
    "Name": "Party Casino",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 1134,
    "Offer_Name": "100% Deposit Match Up To $1,000",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1010,
    "Name": "Caesars Palace Online",
    "states_id": 5,
    "state": {
      "Name": "West Virginia",
      "Abbreviation": "WV"
    }
  },
  {
    "casinodb_id": 1115,
    "Offer_Name": "100% Deposit Match Up To $1,000",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1010,
    "Name": "Caesars Palace Online",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 1154,
    "Offer_Name": "Welcome Offer: 100% Deposit Match",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1000,
    "Name": "Mohegan Sun",
    "states_id": 2,
    "state": {
      "Name": "Pennsylvania",
      "Abbreviation": "PA"
    }
  },
  {
    "casinodb_id": 82,
    "Offer_Name": "Welcome Offer: Deposit $10, Get $40",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 10,
    "Expected_Bonus": 40,
    "Name": "Wheel of Fortune",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 1101,
    "Offer_Name": "100% Deposit Match Up To $1,000",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1010,
    "Name": "Caesars Palace Online",
    "states_id": 2,
    "state": {
      "Name": "Pennsylvania",
      "Abbreviation": "PA"
    }
  },
  {
    "casinodb_id": 1098,
    "Offer_Name": "Casino Welcome Offer - Get a 100% Deposit Match up to $250",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 250,
    "Expected_Bonus": 250,
    "Name": "Bet Rivers",
    "states_id": 2,
    "state": {
      "Name": "Pennsylvania",
      "Abbreviation": "PA"
    }
  },
  {
    "casinodb_id": 1131,
    "Offer_Name": "First Day Risk Free Up To $1,000",
    "offer_type": "Lossback",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1000,
    "Name": "FanDuel",
    "states_id": 5,
    "state": {
      "Name": "West Virginia",
      "Abbreviation": "WV"
    }
  },
  {
    "casinodb_id": 1108,
    "Offer_Name": "100% Slot Bonus Match up to $250",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 250,
    "Expected_Bonus": 250,
    "Name": "Tropicana Casino",
    "states_id": 2,
    "state": {
      "Name": "Pennsylvania",
      "Abbreviation": "PA"
    }
  },
  {
    "casinodb_id": 1118,
    "Offer_Name": "(Day 3 of 5) First Deposit Bonus! Earn up to $750 in iCasino Rewards!",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 0,
    "Expected_Bonus": 75,
    "Name": "Firekeepers",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 1126,
    "Offer_Name": "100% deposit match up to $2,500",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 2500,
    "Expected_Bonus": 2500,
    "Name": "BetMGM",
    "states_id": 5,
    "state": {
      "Name": "West Virginia",
      "Abbreviation": "WV"
    }
  },
  {
    "casinodb_id": 1118,
    "Offer_Name": "(Day 1 of 5) First Deposit Bonus! Earn up to $750 in iCasino Rewards!",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 500,
    "Expected_Bonus": 50,
    "Name": "Firekeepers",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 71,
    "Offer_Name": "First Deposit: 100% Match Up To $200 Bonus",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 200,
    "Expected_Bonus": 200,
    "Name": "Resorts Casino",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 1104,
    "Offer_Name": "24 Hour Lossback - Earn back 100% of your net losses back on Slot Games, up to $1,000 in Casino Credits!",
    "offer_type": "Lossback",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1000,
    "Name": "Golden Nugget",
    "states_id": 2,
    "state": {
      "Name": "Pennsylvania",
      "Abbreviation": "PA"
    }
  },
  {
    "casinodb_id": 1107,
    "Offer_Name": "Welcome Offer - 100% Match up to $100 on your first deposit",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 100,
    "Expected_Bonus": 100,
    "Name": "Stardust",
    "states_id": 2,
    "state": {
      "Name": "Pennsylvania",
      "Abbreviation": "PA"
    }
  },
  {
    "casinodb_id": 76,
    "Offer_Name": "Up to $100 Cash Back",
    "offer_type": "Lossback",
    "Expected_Deposit": 100,
    "Expected_Bonus": 100,
    "Name": "Monopoly Casino",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 1157,
    "Offer_Name": "24 Hour Insurance (100% up to $500)",
    "offer_type": "Lossback",
    "Expected_Deposit": 500,
    "Expected_Bonus": 500,
    "Name": "ESPN Bet",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 1127,
    "Offer_Name": "24 Hour of Casino Losses Back Up To $500",
    "offer_type": "Lossback",
    "Expected_Deposit": 500,
    "Expected_Bonus": 500,
    "Name": "Bet Rivers",
    "states_id": 5,
    "state": {
      "Name": "West Virginia",
      "Abbreviation": "WV"
    }
  },
  {
    "casinodb_id": 1120,
    "Offer_Name": "24 Hour Lossback - Earn back 100% of your net losses back on Slot Games, up to $1,000 in Casino Credits!",
    "offer_type": "Lossback",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1000,
    "Name": "Golden Nugget",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 67,
    "Offer_Name": "Casino New Player Bonus: 100% Up to $1,000",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1000,
    "Name": "Bet365",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 1164,
    "Offer_Name": "24 Hour Insurance (100% up to $500)",
    "offer_type": "Lossback",
    "Expected_Deposit": 500,
    "Expected_Bonus": 500,
    "Name": "ESPN Bet",
    "states_id": 2,
    "state": {
      "Name": "Pennsylvania",
      "Abbreviation": "PA"
    }
  },
  {
    "casinodb_id": 1165,
    "Offer_Name": "24 Hour Insurance (100% up to $500)",
    "offer_type": "Lossback",
    "Expected_Deposit": 500,
    "Expected_Bonus": 500,
    "Name": "ESPN Bet",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 80,
    "Offer_Name": "Casino Welcome Offer - 100% Back on Day One Casino Play",
    "offer_type": "Lossback",
    "Expected_Deposit": 500,
    "Expected_Bonus": 500,
    "Name": "Bet Rivers",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 1114,
    "Offer_Name": "Casino Welcome Offer - 100% Back on Day One Casino Play",
    "offer_type": "Lossback",
    "Expected_Deposit": 500,
    "Expected_Bonus": 500,
    "Name": "Bet Rivers",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 1122,
    "Offer_Name": "Welcome Offer Package - Up to $500",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 500,
    "Expected_Bonus": 500,
    "Name": "Play Eagle",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 75,
    "Offer_Name": "100% Slot Bonus Match (Up To $200)",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 200,
    "Expected_Bonus": 200,
    "Name": "Tropicana Casino",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 1118,
    "Offer_Name": "(Day 4 of 5) First Deposit Bonus! Earn up to $750 in iCasino Rewards!",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 0,
    "Expected_Bonus": 100,
    "Name": "Firekeepers",
    "states_id": 4,
    "state": {
      "Name": "Michigan",
      "Abbreviation": "MI"
    }
  },
  {
    "casinodb_id": 1103,
    "Offer_Name": "First Day Risk Free Up To $1,000",
    "offer_type": "Lossback",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1000,
    "Name": "FanDuel",
    "states_id": 2,
    "state": {
      "Name": "Pennsylvania",
      "Abbreviation": "PA"
    }
  },
  {
    "casinodb_id": 65,
    "Offer_Name": "24 Hour Lossback - Earn back 100% of your net losses back on Slot Games, up to $1,000 in Casino Credits!",
    "offer_type": "Lossback",
    "Expected_Deposit": 1000,
    "Expected_Bonus": 1000,
    "Name": "Golden Nugget",
    "states_id": 1,
    "state": {
      "Name": "New Jersey",
      "Abbreviation": "NJ"
    }
  },
  {
    "casinodb_id": 1111,
    "Offer_Name": "125% New Member Offer (Deposit Match Bonus)",
    "offer_type": "Deposit (Cashable)",
    "Expected_Deposit": 500,
    "Expected_Bonus": 625,
    "Name": "Play Live",
    "states_id": 2,
    "state": {
      "Name": "Pennsylvania",
      "Abbreviation": "PA"
    }
  }
];

// Export offers with unique IDs generated from composite key
// This ensures each offer has a unique identifier even if casinodb_id is duplicated
export const casinoOffers: CasinoOffer[] = rawOffers.map((offer, index) => ({
  ...offer,
  // Create unique ID using multiple fields to ensure uniqueness
  id: `${offer.casinodb_id}-${offer.states_id}-${index}`,
}));


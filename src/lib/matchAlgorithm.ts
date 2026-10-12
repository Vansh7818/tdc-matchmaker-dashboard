import { CustomerProfile, MatchScoreBreakdown, ScoredMatch } from '@/types/customer';

export interface MatchFilterOptions {
  minScore?: number;
  sameCityOnly?: boolean;
  sameReligionOnly?: boolean;
  dietPreferenceMatch?: boolean;
  maxAgeDifference?: number;
  sortBy?: 'score' | 'age' | 'income';
}

/**
 * Calculates compatibility score between a primary customer and a candidate profile.
 * Incorporates gender-specific rules as mandated by TDC prompt:
 * - For Male clients: Women who are younger, earn less, shorter, matching views on kids, plus lifestyle.
 * - For Female clients: High compatibility on career/education, values, relocation, height, and age.
 */
export function calculateMatchScore(
  client: CustomerProfile,
  candidate: CustomerProfile
): MatchScoreBreakdown {
  const positiveReasons: string[] = [];
  const frictionPoints: string[] = [];

  let ageScore = 0; // Max 20
  let heightScore = 0; // Max 15
  let careerScore = 0; // Max 20
  let incomeScore = 0; // Max 15
  let lifestyleScore = 0; // Max 20
  let locationScore = 0; // Max 10

  const ageDiff = candidate.age - client.age; // candidate - client
  const heightDiffCm = candidate.heightCm - client.heightCm; // candidate - client

  // -------------------------------------------------------------
  // 1. AGE & HEIGHT SCORING (GENDER-SPECIFIC)
  // -------------------------------------------------------------
  if (client.gender === 'Male') {
    // Male customer: Prefers younger woman (e.g. 1 to 6 years younger)
    if (candidate.age < client.age) {
      const youngerBy = client.age - candidate.age;
      if (youngerBy >= 1 && youngerBy <= 5) {
        ageScore = 20;
        positiveReasons.push(`Optimal age gap: Candidate is ${youngerBy} years younger (${candidate.age} vs ${client.age})`);
      } else if (youngerBy <= 7) {
        ageScore = 16;
        positiveReasons.push(`Candidate is ${youngerBy} years younger`);
      } else {
        ageScore = 11;
        frictionPoints.push(`Larger age gap: ${youngerBy} years younger`);
      }
    } else if (candidate.age === client.age) {
      ageScore = 14;
      positiveReasons.push(`Peer age match (both ${client.age})`);
    } else {
      // Candidate is older than male client
      const olderBy = candidate.age - client.age;
      if (olderBy <= 2) {
        ageScore = 8;
        frictionPoints.push(`Candidate is slightly older (${candidate.age} vs ${client.age})`);
      } else {
        ageScore = 3;
        frictionPoints.push(`Age variance: Candidate is ${olderBy} years older than client`);
      }
    }

    // Height: Prefers woman who is shorter
    if (candidate.heightCm < client.heightCm) {
      const shorterBy = client.heightCm - candidate.heightCm;
      if (shorterBy >= 5 && shorterBy <= 18) {
        heightScore = 15;
        positiveReasons.push(`Complimentary height: ${candidate.heightFormatted} vs ${client.heightFormatted}`);
      } else {
        heightScore = 12;
        positiveReasons.push(`Shorter height profile (${candidate.heightFormatted})`);
      }
    } else if (candidate.heightCm === client.heightCm) {
      heightScore = 10;
      positiveReasons.push(`Equal height profile`);
    } else {
      heightScore = 4;
      frictionPoints.push(`Candidate is taller (${candidate.heightFormatted} vs ${client.heightFormatted})`);
    }
  } else if (client.gender === 'Female') {
    // Female customer: Prefers same age or slightly older man (e.g. 0 to 4 years older)
    if (candidate.age >= client.age) {
      const olderBy = candidate.age - client.age;
      if (olderBy >= 0 && olderBy <= 4) {
        ageScore = 20;
        positiveReasons.push(`Optimal age synergy: Male partner is ${olderBy === 0 ? 'same age' : `${olderBy} years older`}`);
      } else if (olderBy <= 7) {
        ageScore = 15;
        positiveReasons.push(`Age gap of +${olderBy} years`);
      } else {
        ageScore = 9;
        frictionPoints.push(`Significant age gap: Male is ${olderBy} years older`);
      }
    } else {
      const youngerBy = client.age - candidate.age;
      if (youngerBy <= 2) {
        ageScore = 12;
        frictionPoints.push(`Partner is ${youngerBy} years younger`);
      } else {
        ageScore = 5;
        frictionPoints.push(`Age difference: Candidate is ${youngerBy} years younger`);
      }
    }

    // Height: Prefers taller man
    if (candidate.heightCm > client.heightCm) {
      const tallerBy = candidate.heightCm - client.heightCm;
      if (tallerBy >= 7 && tallerBy <= 20) {
        heightScore = 15;
        positiveReasons.push(`Ideal height ratio: Male is taller by ${tallerBy} cm (${candidate.heightFormatted})`);
      } else {
        heightScore = 12;
        positiveReasons.push(`Male partner is taller (${candidate.heightFormatted})`);
      }
    } else if (candidate.heightCm === client.heightCm) {
      heightScore = 9;
    } else {
      heightScore = 4;
      frictionPoints.push(`Candidate is shorter than client (${candidate.heightFormatted} vs ${client.heightFormatted})`);
    }
  } else {
    // Neutral fallback
    ageScore = Math.abs(ageDiff) <= 3 ? 18 : 10;
    heightScore = 12;
  }

  // -------------------------------------------------------------
  // 2. INCOME DYNAMICS (GENDER-SPECIFIC)
  // -------------------------------------------------------------
  if (client.gender === 'Male') {
    // Prompt rule: "Match with women who earn less"
    if (candidate.incomeLpa <= client.incomeLpa) {
      incomeScore = 15;
      positiveReasons.push(`Financial comfort: Woman earns ₹${candidate.incomeLpa} LPA vs client's ₹${client.incomeLpa} LPA`);
    } else {
      // Candidate earns more than male client
      const excessRatio = (candidate.incomeLpa - client.incomeLpa) / client.incomeLpa;
      if (excessRatio <= 0.25) {
        incomeScore = 10;
        frictionPoints.push(`Candidate earns moderately higher (₹${candidate.incomeLpa} LPA)`);
      } else {
        incomeScore = 5;
        frictionPoints.push(`Significant income gap: Candidate earns ₹${candidate.incomeLpa} LPA vs ₹${client.incomeLpa} LPA`);
      }
    }
  } else {
    // Female customer: High compatibility with financially established or peer partner
    if (candidate.incomeLpa >= client.incomeLpa) {
      incomeScore = 15;
      positiveReasons.push(`Strong financial parity: Partner earns ₹${candidate.incomeLpa} LPA (Client: ₹${client.incomeLpa} LPA)`);
    } else {
      const deficitRatio = (client.incomeLpa - candidate.incomeLpa) / client.incomeLpa;
      if (deficitRatio <= 0.2) {
        incomeScore = 12;
        positiveReasons.push(`Comparable financial tier (₹${candidate.incomeLpa} LPA)`);
      } else {
        incomeScore = 7;
        frictionPoints.push(`Income difference: Partner earns ₹${candidate.incomeLpa} LPA vs client's ₹${client.incomeLpa} LPA`);
      }
    }
  }

  // -------------------------------------------------------------
  // 3. CAREER & EDUCATION ALIGNMENT (Max 20)
  // -------------------------------------------------------------
  const tierOneColleges = [
    'IIT', 'BITS', 'IIM', 'ISB', 'SRCC', 'St. Stephen', 'LSR', 'Stanford', 'Harvard', 
    'Columbia', 'Oxford', 'Cambridge', 'AIIMS', 'NLSIU', 'NIT', 'DTU', 'London Business School'
  ];

  const clientHasTierOne = tierOneColleges.some(t => 
    client.undergraduateCollege.includes(t) || (client.postgraduateCollege && client.postgraduateCollege.includes(t))
  );
  const candidateHasTierOne = tierOneColleges.some(t => 
    candidate.undergraduateCollege.includes(t) || (candidate.postgraduateCollege && candidate.postgraduateCollege.includes(t))
  );

  let eduPoints = 0;
  if (clientHasTierOne && candidateHasTierOne) {
    eduPoints = 10;
    positiveReasons.push(`Premier educational pedigree: Both alumni of tier-1 institutions (${client.undergraduateCollege.split(' ')[0]} & ${candidate.undergraduateCollege.split(' ')[0]})`);
  } else if (client.undergraduateDegree === candidate.undergraduateDegree) {
    eduPoints = 8;
    positiveReasons.push(`Shared educational degree background (${client.undergraduateDegree})`);
  } else {
    eduPoints = 6;
  }

  let careerFieldPoints = 0;
  if (client.careerField === candidate.careerField) {
    careerFieldPoints = 10;
    positiveReasons.push(`Shared industry domain: Both in ${client.careerField}`);
  } else {
    // High synergy cross-fields: Tech & Consulting, Finance & Consulting, Law & Business
    const synergisticFields = [
      ['Tech & Engineering', 'Finance & Banking'],
      ['Tech & Engineering', 'Consulting & Strategy'],
      ['Consulting & Strategy', 'Finance & Banking'],
      ['Business & Entrepreneurship', 'Tech & Engineering'],
      ['Medicine & Healthcare', 'Medicine & Healthcare'],
    ];

    const isSynergistic = synergisticFields.some(pair => 
      (pair[0] === client.careerField && pair[1] === candidate.careerField) ||
      (pair[1] === client.careerField && pair[0] === candidate.careerField)
    );

    if (isSynergistic) {
      careerFieldPoints = 8;
      positiveReasons.push(`High career synergy: ${client.careerField} & ${candidate.careerField}`);
    } else {
      careerFieldPoints = 5;
    }
  }
  careerScore = Math.min(20, eduPoints + careerFieldPoints);

  // -------------------------------------------------------------
  // 4. LIFESTYLE & VALUES (KIDS, PETS, DIET, HABITS) (Max 20)
  // -------------------------------------------------------------
  // A. Kids Views (Crucial Matrimonial Dealbreaker)
  let kidsScore = 0;
  if (client.wantKids === candidate.wantKids) {
    kidsScore = 7;
    positiveReasons.push(`Aligned on family vision: Both want children (${client.wantKids})`);
  } else if (
    (client.wantKids === 'Maybe' && candidate.wantKids !== 'No') ||
    (candidate.wantKids === 'Maybe' && client.wantKids !== 'No')
  ) {
    kidsScore = 5;
    positiveReasons.push(`Open to future family planning discussion`);
  } else {
    kidsScore = 0;
    frictionPoints.push(`Family vision divergence: Client wants kids '${client.wantKids}' vs candidate '${candidate.wantKids}'`);
  }

  // B. Diet Compatibility
  let dietScore = 0;
  if (client.diet === candidate.diet) {
    dietScore = 5;
    positiveReasons.push(`Perfect culinary alignment: Both are ${client.diet}`);
  } else if (
    (client.diet === 'Vegetarian' && candidate.diet === 'Eggetarian') ||
    (client.diet === 'Eggetarian' && candidate.diet === 'Vegetarian')
  ) {
    dietScore = 4;
  } else if (
    (client.diet === 'Jain' && candidate.diet !== 'Jain')
  ) {
    dietScore = 1;
    frictionPoints.push(`Dietary divergence: Strict Jain vs ${candidate.diet}`);
  } else {
    dietScore = 3;
  }

  // C. Pets Alignment
  let petScore = 0;
  if (client.openToPets === candidate.openToPets) {
    petScore = 4;
    if (client.openToPets === 'Yes') positiveReasons.push(`Both are pet lovers 🐾`);
  } else if (client.openToPets === 'No' && candidate.openToPets === 'Yes') {
    petScore = 1;
    frictionPoints.push(`Pet preference mismatch (Client: No vs Candidate: Yes)`);
  } else {
    petScore = 3;
  }

  // D. Alcohol & Smoking Habits
  let habitsScore = 0;
  if (client.smoking === 'Never' && candidate.smoking !== 'Never') {
    habitsScore = 1;
    frictionPoints.push(`Smoking habit clash: Client non-smoker vs candidate ${candidate.smoking.toLowerCase()}`);
  } else if (client.smoking === candidate.smoking) {
    habitsScore += 2;
  } else {
    habitsScore += 1;
  }

  if (Math.abs(
    (client.drinking === 'Never' ? 0 : client.drinking === 'Socially' ? 1 : 2) -
    (candidate.drinking === 'Never' ? 0 : candidate.drinking === 'Socially' ? 1 : 2)
  ) <= 1) {
    habitsScore += 2;
  }

  lifestyleScore = Math.min(20, kidsScore + dietScore + petScore + habitsScore);

  // -------------------------------------------------------------
  // 5. LOCATION & RELOCATION (Max 10)
  // -------------------------------------------------------------
  if (client.city.toLowerCase() === candidate.city.toLowerCase()) {
    locationScore = 10;
    positiveReasons.push(`Same home city: Both located in ${client.city}`);
  } else if (client.country.toLowerCase() === candidate.country.toLowerCase()) {
    // Different city, check relocation flexibility
    if (client.openToRelocate === 'Yes' || candidate.openToRelocate === 'Yes') {
      locationScore = 8;
      positiveReasons.push(`Inter-city match (${client.city} & ${candidate.city}) with relocation willingness`);
    } else if (client.openToRelocate === 'Maybe' || candidate.openToRelocate === 'Maybe') {
      locationScore = 6;
      frictionPoints.push(`Different cities (${client.city} vs ${candidate.city}); relocation is conditional`);
    } else {
      locationScore = 2;
      frictionPoints.push(`Geographic barrier: Client in ${client.city}, candidate in ${candidate.city}, neither open to relocate`);
    }
  } else {
    // International
    if (client.openToRelocate === 'Yes' && candidate.openToRelocate === 'Yes') {
      locationScore = 6;
      positiveReasons.push(`Global match: Open to international relocation`);
    } else {
      locationScore = 1;
      frictionPoints.push(`Cross-border relocation required (${client.city}, ${client.country} vs ${candidate.city}, ${candidate.country})`);
    }
  }

  // -------------------------------------------------------------
  // TOTAL SCORE & TIER
  // -------------------------------------------------------------
  const totalScore = Math.min(100, Math.max(0, Math.round(
    ageScore + heightScore + careerScore + incomeScore + lifestyleScore + locationScore
  )));

  let tier: MatchScoreBreakdown['tier'] = 'Moderate Match';
  if (totalScore >= 85) tier = 'High Potential Match';
  else if (totalScore >= 70) tier = 'Strong Match';
  else if (totalScore >= 55) tier = 'Moderate Match';
  else tier = 'Low Compatibility';

  return {
    totalScore,
    tier,
    ageScore,
    heightScore,
    careerScore,
    incomeScore,
    lifestyleScore,
    locationScore,
    positiveReasons,
    frictionPoints,
  };
}

/**
 * Filter and score candidate pool for a given customer.
 */
export function getRankedMatches(
  client: CustomerProfile,
  candidatePool: CustomerProfile[],
  filters: MatchFilterOptions = {}
): ScoredMatch[] {
  // Only match opposite gender
  const oppositeGenderCandidates = candidatePool.filter(c => {
    if (client.gender === 'Male') return c.gender === 'Female';
    if (client.gender === 'Female') return c.gender === 'Male';
    return c.gender !== client.gender;
  });

  const scoredList: ScoredMatch[] = [];

  for (const candidate of oppositeGenderCandidates) {
    // Exclude if already matched or same profile
    if (candidate.id === client.id) continue;

    // Apply strict filters if requested
    if (filters.sameCityOnly && candidate.city.toLowerCase() !== client.city.toLowerCase()) {
      continue;
    }
    if (filters.sameReligionOnly && candidate.religion !== client.religion) {
      continue;
    }
    if (filters.dietPreferenceMatch && candidate.diet !== client.diet) {
      continue;
    }
    if (filters.maxAgeDifference !== undefined) {
      if (Math.abs(candidate.age - client.age) > filters.maxAgeDifference) {
        continue;
      }
    }

    const score = calculateMatchScore(client, candidate);

    if (filters.minScore !== undefined && score.totalScore < filters.minScore) {
      continue;
    }

    scoredList.push({
      profile: candidate,
      score,
    });
  }

  // Sorting
  const sortBy = filters.sortBy || 'score';
  scoredList.sort((a, b) => {
    if (sortBy === 'score') {
      return b.score.totalScore - a.score.totalScore;
    }
    if (sortBy === 'income') {
      return b.profile.incomeLpa - a.profile.incomeLpa;
    }
    if (sortBy === 'age') {
      return a.profile.age - b.profile.age;
    }
    return 0;
  });

  return scoredList;
}

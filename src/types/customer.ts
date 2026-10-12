export type Gender = 'Male' | 'Female' | 'Other';
export type MaritalStatus = 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce';
export type PreferenceDecision = 'Yes' | 'No' | 'Maybe';
export type DietPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Jain' | 'Vegan';
export type AlcoholPreference = 'Never' | 'Socially' | 'Regularly';
export type SmokingPreference = 'Never' | 'Occasionally' | 'Regularly';
export type ManglikStatus = 'Non-Manglik' | 'Manglik' | 'Anshik Manglik' | "Doesn't Matter";
export type FamilyValues = 'Traditional' | 'Moderate' | 'Liberal';
export type FamilyType = 'Nuclear' | 'Joint';

export type JourneyStatus =
  | 'Onboarding'
  | 'Verified'
  | 'Active Matching'
  | 'Introductions Sent'
  | 'First Date Scheduled'
  | 'Under Feedback'
  | 'Courtship'
  | 'Matched'
  | 'On Hold';

export interface MatchmakerNote {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  category?: 'Call' | 'Meeting' | 'Preference Update' | 'Family Feedback' | 'General';
}

export interface SentMatchRecord {
  matchId: string;
  matchName: string;
  dateSent: string;
  introEmailSubject: string;
  introEmailBody: string;
  status: 'Sent' | 'Client Liked' | 'Client Passed' | 'Connected';
}

export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string; // YYYY-MM-DD
  age: number;
  country: string;
  city: string;
  heightCm: number; // e.g. 175
  heightFormatted: string; // e.g. "5'9\" (175 cm)"
  email: string;
  phoneNumber: string;
  
  // Education & Career
  undergraduateCollege: string;
  undergraduateDegree: string;
  postgraduateCollege?: string;
  postgraduateDegree?: string;
  incomeLpa: number; // in LPA INR
  incomeFormatted: string; // e.g. "₹28 LPA"
  currentCompany: string;
  designation: string;
  careerField: 'Tech & Engineering' | 'Consulting & Strategy' | 'Finance & Banking' | 'Medicine & Healthcare' | 'Business & Entrepreneurship' | 'Law & Legal' | 'Marketing & Media' | 'Creative & Design' | 'Other';
  
  // Matrimonial & Cultural (Essential Indian Matchmaking Fields)
  maritalStatus: MaritalStatus;
  languagesKnown: string[];
  siblings: string;
  religion: 'Hindu' | 'Sikh' | 'Jain' | 'Christian' | 'Muslim' | 'Parsi' | 'Buddhist' | 'Spiritual / Non-Religious';
  caste: string;
  subcaste?: string;
  motherTongue: string;
  manglikStatus: ManglikStatus;
  familyType: FamilyType;
  familyValues: FamilyValues;
  
  // Lifestyle & Personal Preferences
  diet: DietPreference;
  drinking: AlcoholPreference;
  smoking: SmokingPreference;
  wantKids: PreferenceDecision;
  openToRelocate: PreferenceDecision;
  openToPets: PreferenceDecision;
  
  // Nuances & Narrative
  aboutMe: string;
  partnerExpectations: string;
  hobbies: string[];
  photoUrl: string;
  
  // Matchmaker Management
  assignedMatchmaker: string;
  statusTag: JourneyStatus;
  verifiedBadge: boolean;
  notes: MatchmakerNote[];
  sentMatches: SentMatchRecord[];
}

export interface MatchScoreBreakdown {
  totalScore: number; // 0 - 100
  tier: 'High Potential Match' | 'Strong Match' | 'Moderate Match' | 'Low Compatibility';
  ageScore: number; // 0 - 20
  heightScore: number; // 0 - 15
  careerScore: number; // 0 - 20
  incomeScore: number; // 0 - 15
  lifestyleScore: number; // 0 - 20
  locationScore: number; // 0 - 10
  positiveReasons: string[];
  frictionPoints: string[];
  aiAnalysis?: {
    summary: string;
    whyItWorks: string;
    watchOuts: string;
    recommendedIcebreakers: string[];
  };
}

export interface ScoredMatch {
  profile: CustomerProfile;
  score: MatchScoreBreakdown;
}

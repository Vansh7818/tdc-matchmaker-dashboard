import { CustomerProfile, MatchScoreBreakdown } from '@/types/customer';

export interface AiMatchAnalysisResponse {
  summary: string;
  whyItWorks: string;
  watchOuts: string;
  recommendedIcebreakers: string[];
}

export interface AiEmailPitchResponse {
  subject: string;
  emailBody: string;
}

/**
 * Generates an AI match analysis explaining profile fit, synergies, and friction points.
 */
export async function generateAiMatchAnalysis(
  client: CustomerProfile,
  candidate: CustomerProfile,
  score: MatchScoreBreakdown,
  customApiKey?: string
): Promise<AiMatchAnalysisResponse> {
  const apiKey = customApiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (apiKey && apiKey.startsWith('sk-')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an elite, emotionally perceptive Senior Matchmaker at "The Date Crew" (TDC). You evaluate compatibility for high-achieving urban Indian professionals. Return a JSON object with:
- "summary": A punchy 1-2 sentence match summary.
- "whyItWorks": 2-3 clear reasons why these two profiles have strong matrimonial/relationship potential.
- "watchOuts": 1-2 realistic differences or considerations the matchmaker should prep them for.
- "recommendedIcebreakers": 3 thoughtful, specific conversation starters for their first date/call.
Return ONLY valid JSON.`,
            },
            {
              role: 'user',
              content: JSON.stringify({
                client: {
                  name: `${client.firstName} ${client.lastName}`,
                  gender: client.gender,
                  age: client.age,
                  city: client.city,
                  designation: client.designation,
                  company: client.currentCompany,
                  college: client.undergraduateCollege,
                  income: client.incomeFormatted,
                  diet: client.diet,
                  wantKids: client.wantKids,
                  openToRelocate: client.openToRelocate,
                  hobbies: client.hobbies,
                  partnerExpectations: client.partnerExpectations,
                },
                candidate: {
                  name: `${candidate.firstName} ${candidate.lastName}`,
                  gender: candidate.gender,
                  age: candidate.age,
                  city: candidate.city,
                  designation: candidate.designation,
                  company: candidate.currentCompany,
                  college: candidate.undergraduateCollege,
                  income: candidate.incomeFormatted,
                  diet: candidate.diet,
                  wantKids: candidate.wantKids,
                  openToRelocate: candidate.openToRelocate,
                  hobbies: candidate.hobbies,
                  aboutMe: candidate.aboutMe,
                },
                algorithmicScore: score.totalScore,
                tier: score.tier,
                keyPositives: score.positiveReasons,
                frictionPoints: score.frictionPoints,
              }),
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);
        return {
          summary: content.summary || `${candidate.firstName} & ${client.firstName} present an exceptional blend of intellectual parity and lifestyle alignment.`,
          whyItWorks: content.whyItWorks || score.positiveReasons.slice(0, 3).join('. '),
          watchOuts: content.watchOuts || (score.frictionPoints.length ? score.frictionPoints.join('. ') : 'Minimal immediate friction; align on long-term city plans.'),
          recommendedIcebreakers: content.recommendedIcebreakers || generateHeuristicIcebreakers(client, candidate),
        };
      }
    } catch (e) {
      console.warn('OpenAI API call failed or timed out, falling back to local heuristic AI engine:', e);
    }
  }

  // Built-in intelligent heuristic engine (100% reliable offline / out-of-the-box fallback)
  return generateHeuristicMatchAnalysis(client, candidate, score);
}

/**
 * Generates a warm, bespoke matchmaking pitch email sent to the client to introduce the candidate.
 */
export async function generateAiPersonalizedEmailPitch(
  client: CustomerProfile,
  candidate: CustomerProfile,
  score: MatchScoreBreakdown,
  customApiKey?: string
): Promise<AiEmailPitchResponse> {
  const apiKey = customApiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (apiKey && apiKey.startsWith('sk-')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are the lead personal matchmaker at "The Date Crew". Write a warm, discreet, highly engaging email to your client introducing an exciting curated match.
The tone is refined, emotionally intelligent, and encouraging without sounding salesy. Highlight mutual values, career pedigree, and why you personally picked them.
Return a JSON object with:
- "subject": An enticing, elegant email subject line.
- "emailBody": The complete email body formatted in clear paragraphs.
Return ONLY valid JSON.`,
            },
            {
              role: 'user',
              content: JSON.stringify({
                clientName: client.firstName,
                candidateName: candidate.firstName,
                candidateAge: candidate.age,
                candidateProfession: `${candidate.designation} at ${candidate.currentCompany}`,
                candidateCollege: candidate.undergraduateCollege,
                candidateCity: candidate.city,
                candidateHobbies: candidate.hobbies.join(', '),
                compatibilityTier: score.tier,
                keyHighlights: score.positiveReasons,
              }),
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);
        return {
          subject: content.subject,
          emailBody: content.emailBody,
        };
      }
    } catch (e) {
      console.warn('OpenAI API call failed, using heuristic email pitch generator:', e);
    }
  }

  return generateHeuristicEmailPitch(client, candidate, score);
}

/**
 * Built-in context-rich NLP reasoning generator
 */
function generateHeuristicMatchAnalysis(
  client: CustomerProfile,
  candidate: CustomerProfile,
  score: MatchScoreBreakdown
): AiMatchAnalysisResponse {
  const sharedCollegeVibe = client.undergraduateCollege.includes('IIT') && candidate.undergraduateCollege.includes('IIT')
    ? 'Both share an analytical foundation from premier engineering institutes'
    : 'Strong intellectual synergy across their educational backgrounds';

  const locationContext = client.city === candidate.city
    ? `Seamless local dating logistics as both are rooted in ${client.city}`
    : `Inter-city dynamics (${client.city} ↔ ${candidate.city}) supported by ${candidate.firstName}'s relocation flexibility`;

  const lifestyleSummary = client.diet === candidate.diet
    ? `harmonious daily living with shared ${client.diet.toLowerCase()} dietary preferences and family values`
    : `adaptable lifestyles with mutual respect for cultural nuances`;

  const summary = `${candidate.firstName} (${candidate.age}, ${candidate.designation}) is a ${score.tier.toLowerCase()} for ${client.firstName}. They exhibit compelling synergy across career stature, age harmony, and core family values.`;

  const whyItWorks = [
    `${sharedCollegeVibe}, fostering mutual respect for demanding professional commitments.`,
    `${locationContext}.`,
    `Complementary outlook on family planning (${client.wantKids === candidate.wantKids ? 'both enthusiastic about children' : 'flexible on timeline'}) and ${lifestyleSummary}.`,
  ].join(' ');

  const watchOuts = score.frictionPoints.length > 0
    ? score.frictionPoints.slice(0, 2).join('. ') + '.'
    : `Primary consideration is scheduling flexibility given demanding careers at ${client.currentCompany} and ${candidate.currentCompany}.`;

  const recommendedIcebreakers = generateHeuristicIcebreakers(client, candidate);

  return {
    summary,
    whyItWorks,
    watchOuts,
    recommendedIcebreakers,
  };
}

function generateHeuristicIcebreakers(
  client: CustomerProfile,
  candidate: CustomerProfile
): string[] {
  const commonHobby = candidate.hobbies.find(h => client.hobbies.includes(h)) || candidate.hobbies[0] || 'weekend getaways';
  
  return [
    `"I noticed you're both passionate about ${commonHobby} — ask ${candidate.firstName} about their favorite spot or recent experience with it."`,
    `"Compare notes on surviving the hustle at ${client.currentCompany} vs ${candidate.currentCompany}."`,
    `"Ask about their comfort food recommendation in ${candidate.city} — a lighthearted debate on culinary loyalties always breaks the ice!"`,
  ];
}

function generateHeuristicEmailPitch(
  client: CustomerProfile,
  candidate: CustomerProfile,
  score: MatchScoreBreakdown
): AiEmailPitchResponse {
  const subject = `Curated Match for ${client.firstName}: Meet ${candidate.firstName} (${candidate.age}, ${candidate.designation} in ${candidate.city})`;

  const highlights = score.positiveReasons.slice(0, 3).map(r => `• ${r}`).join('\n');

  const emailBody = `Hi ${client.firstName},

I hope your week is off to a wonderful start!

As your dedicated matchmaker at The Date Crew, I've been reviewing profiles against your personal preferences, values, and relationship goals. I am thrilled to introduce you to ${candidate.firstName}.

Why I selected ${candidate.firstName} for you:
${candidate.firstName} is ${candidate.age}, currently working as ${candidate.designation} at ${candidate.currentCompany}. An alumnus of ${candidate.undergraduateCollege}, they strike that rare balance between career ambition and grounded family warmth.

Key Compatibility Highlights:
${highlights}

In their own words:
"${candidate.aboutMe}"

What stood out to me most is how effortlessly their life vision and energy complement yours. I genuinely believe a 30-minute coffee or video conversation would be both engaging and refreshing.

Take a look at the attached profile summary and let me know if you would like me to coordinate an introduction!

Warm regards,

Your Matchmaker Team
The Date Crew (TDC) Curated Matchmaking`;

  return {
    subject,
    emailBody,
  };
}

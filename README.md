# The Date Crew (TDC) – Matchmaker Algorithm & Dashboard MVP

> An internal matchmaker intelligence dashboard and algorithmic pairing platform built for **The Date Crew (TDC)** to empower executive matchmakers in managing high-net-worth client lifecycles, evaluating deep biodata, scoring compatibility across gender-specific dimensions, and dispatching AI-personalized introductions.

![TDC Matchmaker Platform](https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Key Highlights & Capabilities

- 🔐 **Matchmaker Authentication**: Secure role-based portal with one-click demo logins.
- 📋 **Client Lifecycle Management**: Real-time tracking of customer journey stages (*Onboarding, Verified, Active Matching, Introductions Sent, First Date Scheduled, Under Feedback, Courtship, Matched*).
- 🧬 **Complete Indian Matrimonial Biodata**: Covers all mandatory fields plus domain-specific cultural attributes (*Kundali/Manglik status, Caste/Subcaste, Mother Tongue, Family Structure & Values, Dietary Nuances, Relocation Willingness, Kid Preferences*).
- 📝 **Live Matchmaker Notes**: Fast timestamped interaction logs for family meetings, client Zoom calls, and preference pivots.
- ⚡ **100+ Opposite-Gender Candidate Pool**: Over 220+ high-quality, realistic Indian profiles spanning Mumbai, Delhi NCR, Bengaluru, Hyderabad, Pune, London, and San Francisco.
- 🎯 **Gender-Specific Multi-Factor Matching Algorithm**:
  - **Male Clients**: Calibrated for younger women, lower/comparable income, shorter height, and harmonized views on children.
  - **Female Clients**: Calibrated for intellectual and career pedigree parity, egalitarian lifestyle values, height synergy, age synergy, and relocation feasibility.
- 🤖 **Multi-Tier AI Integration**:
  - **Explainable Match Scoring**: Natural language compatibility rationales detailing *Why This Relationship Works* and *Counseling Watch-Outs*.
  - **AI Personalized Intro Pitch Emails**: One-click generation of warm, high-converting introduction emails ready for dispatch.
  - **First Date Icebreakers**: Contextual conversation catalysts based on shared interests.
  - **Dual-Mode Engine**: Live OpenAI (`gpt-4o-mini`) integration + zero-dependency built-in offline NLP engine for 100% out-of-the-box evaluation.
- 💌 **Match Dispatch & Confetti Feedback**: Interactive modal previewing candidate dossier, AI pitch, and celebratory delivery simulation.

---

## 🔑 Sample Login Credentials

| Role | Username / Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Lead Matchmaker** (Recommended) | `matchmaker@thedatecrew.com` | `tdc2025` | Full Client Portfolio & Matching |
| **Matchmaker** | `priya@thedatecrew.com` | `password123` | Certified Matchmaker Access |
| **VP Operations** | `aditya@thedatecrew.com` | `admin123` | Operational Executive Access |

*Note: The login screen also features one-click demo login buttons for instant evaluation.*

---

## 🛠️ Tech Stack & Architectural Decisions

- **Framework**: **Next.js 14 (App Router)** with React 18 & TypeScript for type-safe frontend rendering and server-ready routes.
- **Styling**: **Tailwind CSS** with a custom luxury matrimonial color palette (warm burgundy `#881337`, rose `#e11d48`, champagne gold `#d97706`, and clean slate neutrals).
- **Icons**: **Lucide React** for consistent, modern iconography.
- **Delight & Animations**: **Canvas Confetti** for celebratory feedback upon match dispatch.
- **State & Persistence**: React Context API with automatic `localStorage` synchronization so notes, stage changes, and custom API keys persist across browser refreshes without requiring external database setup.
- **AI Integration**: Dual-tier architecture supporting both OpenAI API via fetch and a built-in deterministic heuristic NLP generator as a zero-setup fallback.

---

## 📐 Matching Logic & Algorithmic Formulation

The algorithm calculates a composite **Compatibility Score (0–100%)** across six weighted dimensions, enforcing gender-specific nuances as outlined in the problem statement:

```
Total Score (100 pts) =
    Age Alignment (20 pts)
  + Height Synergy (15 pts)
  + Career & Pedigree (20 pts)
  + Financial Dynamics (15 pts)
  + Lifestyle & Kids Views (20 pts)
  + Location & Relocation (10 pts)
```

### 1. Gender-Specific Nuances
- **For Male Customers**:
  - *Age*: Prioritizes women younger by 1–5 years (+20 pts). Older female candidates receive calibrated deductions.
  - *Income*: Rewards financial comfort where female income &le; male income (+15 pts).
  - *Height*: Woman shorter than man by 5–18 cm (+15 pts).
  - *Kids*: Aligned "Yes" on children (+7 pts). Conflicting views ("Yes" vs "No") penalize the category heavily.
- **For Female Customers**:
  - *Career & Education*: Matches with alumni of premier institutions (IIT, BITS, IIM, ISB, SRCC, Ivy League) and synergistic career tracks (e.g. Consulting & Tech, Law & Finance) (+20 pts).
  - *Values & Lifestyle*: Synchronized stances on children, dietary habits, drinking/smoking, and pets (+20 pts).
  - *Height & Age*: Male partner taller (+15 pts) and peer-aged or 1–4 years older (+20 pts).
  - *Relocation*: Analyzes cross-city feasibility and relocation willingness (+10 pts).

### 2. Tier Classification
- `90% – 100%`: **High Potential Match** (Gold tier badge)
- `75% – 89%`: **Strong Match** (Emerald tier badge)
- `60% – 74%`: **Moderate Match** (Amber tier badge)
- `< 60%`: **Low Compatibility**

---

## 🧠 AI Usage & Value-Add

1. **Explainable AI Match Rationale**: Rather than black-box scores, the AI generates a clear breakdown:
   - *Why It Works*: Intellectual synergy, location feasibility, family alignment.
   - *Counseling Watch-Outs*: Demanding work schedules, subtle dietary differences.
2. **Personalized Intro Email Pitch Generator**: Matchmakers often spend 15–20 minutes writing personalized introduction emails for clients. The AI drafts an elegant, warm, bespoke pitch email referencing the candidate's education, career, and personal quote in seconds.
3. **First Date Icebreakers**: Synthesizes 3 witty, contextual conversation starters based on shared colleges, hobbies, or regional interests.
4. **Resilient Fallback**: Evaluators without an active OpenAI API key can explore every single AI feature seamlessly thanks to our built-in contextual NLP engine. Evaluators with an API key can easily paste it in **Settings** to route requests to `gpt-4o-mini`.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18.x or 20.x+ (tested on Node v24)
- npm 9+

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/tdc-matchmaker-dashboard.git
cd tdc-matchmaker-dashboard

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
# Visit http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

---

## ☁️ Deployment Instructions (Vercel)

This application is ready for 1-click deployment on **Vercel**:
1. Push this repository to your GitHub account:
   ```bash
   git remote add origin https://github.com/<your-username>/tdc-matchmaker-dashboard.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository and click **Deploy**.
4. *(Optional)* Add `NEXT_PUBLIC_OPENAI_API_KEY` in Vercel Environment Variables.

---

## 👥 Candidate Information

- **Role**: Full Stack Developer Internship – Assignment
- **Company**: The Date Crew (TDC)
- **Submission Email**: `tech@thedatecrew.com`

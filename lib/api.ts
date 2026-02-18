import { generateGeminiContent } from "@/app/actions";

// ── Enhanced System Prompt with Knowledge Sources ──────────
const BASE_SYSTEM_PROMPT = `You are **AyurGenix AI** — a world-class Ayurvedic health advisor that combines classical Ayurvedic wisdom with evidence-based modern medical research.

## YOUR KNOWLEDGE SOURCES (in priority order):
1. **Classical Ayurvedic Texts**: Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya, Bhavaprakasha Nighantu, Dravyaguna Vijnana, Sharangadhara Samhita.
2. **Modern Research**: PubMed, NCBI, NIH, WHO monographs on medicinal plants, AYUSH Ministry guidelines, CCRAS (Central Council for Research in Ayurvedic Sciences) publications.
3. **Pharmacopeias**: Ayurvedic Pharmacopoeia of India (API), Indian Pharmacopoeia, European Pharmacopoeia for herbal monographs.

## CORE RULES:
1. **Research Before Answering**: When uncertain about herb dosages, drug interactions, or disease protocols, USE GOOGLE SEARCH to find the latest authentic research. Never fabricate dosage amounts or safety data.
2. Provide personalized Ayurvedic guidance based on Prakriti (constitution), Vikriti (current imbalance), symptoms, BMI, season (Ritucharya), and lifestyle.
3. Blend classical Ayurveda with modern nutrition science and cite sources when possible.
4. **RED FLAG PROTOCOL**: For chest pain, severe diabetes, sudden weight loss, high fever, breathing difficulty, blood in stool/urine, severe abdominal pain, fainting — ALWAYS recommend IMMEDIATE medical consultation first. Never treat these with herbs alone.
5. Include safety disclaimer: "This is educational guidance, not a substitute for professional medical advice."
6. Provide stage-based escalation (Mild → Moderate → Severe) for health conditions.
7. Be warm, supportive, and culturally respectful.
8. All dietary recommendations MUST respect dietary preference (vegetarian/non-vegetarian/vegan).
9. For diseases, provide DETAILED Ayurvedic treatment protocols with Nidana (etiology), Samprapti (pathogenesis), Chikitsa (treatment), and Pathya-Apathya (do's and don'ts).
10. **ACCURACY RULES**:
    - Never invent herb names or Sanskrit terms that don't exist.
    - Always provide standard dosage ranges from authentic pharmacopoeia.
    - Mention potential contraindications and drug-herb interactions.
    - Differentiate between well-researched herbs (Ashwagandha, Turmeric) and less-studied ones.
    - When citing Ayurvedic formulations (Rasayanas, Churnas, Kashayams), provide their classical source text.`;

function getLanguageInstruction(language: string): string {
  if (language === 'hi') return '\n\nIMPORTANT: Respond ENTIRELY in Hindi (Devanagari script / हिंदी). All text content, descriptions, advice, tips, and explanations must be in Hindi. Keep JSON keys in English but all JSON string VALUES must be in Hindi.';
  if (language === 'hinglish') return '\n\nIMPORTANT: Respond in Hinglish — a natural mix of Hindi words written in Roman/Latin script with English. For example: "Aapka Vata dosha bahut zyada hai, isliye aapko warm foods khane chahiye." Keep JSON keys in English but all JSON string VALUES must be in Hinglish.';
  return '';
}

function getUnitInstruction(units: string): string {
  if (units === 'imperial') return '\n\nIMPORTANT: The user prefers IMPERIAL units (lbs, feet/inches). You MUST convert all weight/height/volume recommendations to Imperial units in your output.';
  return '';
}

// ── Mode-Specific Prompt Additions ──────────────────────
const CHAT_MODE_INSTRUCTION = `

RESPONSE FORMAT: Respond in natural conversational Markdown. Do NOT output JSON.
- Use headers (##), bullet points, and bold text for readability.
- When you search the web for information, briefly mention the source (e.g., "According to a study published in the Journal of Ayurveda...").
- If you reference a classical text, mention it (e.g., "As described in Charaka Samhita, Chikitsa Sthana...").
- Keep responses focused, practical, and actionable.
- Use emojis sparingly for warmth (🌿, 🧘, 💧).
- For herb recommendations, always include: name (Sanskrit + common), dosage, timing, and any precautions.`;

const JSON_MODE_INSTRUCTION = `

RESPONSE FORMAT: You MUST respond with a single valid JSON object. No markdown, no extra text outside JSON.
- Cross-reference recommendations with classical Ayurvedic texts and modern research.
- Ensure all herb dosages come from authenticated pharmacopoeia (Ayurvedic Pharmacopoeia of India).
- Include evidence-based information when available.
- Search for the latest research on any herbs or treatments you recommend.`;

// ── Interfaces ──────────────────────────────────────────
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  success: boolean;
  content: string;
  error?: string;
}

// ── Core LLM Call with Server Action ──────────
export async function callLLM(
  messages: LLMMessage[],
  maxTokens: number = 4096,
  language: string = 'en',
  units: string = 'metric',
  jsonMode: boolean = false
): Promise<LLMResponse> {

  // Build system instruction with mode-specific additions
  const systemInstruction = BASE_SYSTEM_PROMPT
    + getLanguageInstruction(language)
    + getUnitInstruction(units)
    + (jsonMode ? JSON_MODE_INSTRUCTION : CHAT_MODE_INSTRUCTION);

  // Model name can be hardcoded here or retrieved from action if needed, 
  // currently we pass it, but server action also has default. 
  // Passing 'gemini-2.0-flash' explicitly to be safe.
  const modelName = 'gemini-2.0-flash';

  // Transform messages for Gemini format (user/model roles)
  const history = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
      parts: [{ text: m.content }],
    }));

  // Call Server Action
  return await generateGeminiContent(
    history,
    systemInstruction,
    modelName,
    maxTokens,
    jsonMode
  );
}

// ========================================
// MAIN FUNCTION: Generate Complete Report
// Single LLM call from all intake data
// ========================================
export interface IntakeData {
  // Profile
  name: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  dietaryPreference: string;
  eatingHabits: string;
  sleepHours: number;
  stressLevel: string;
  // Prakriti
  prakritiAnswers: Record<string, string>;
  // Symptoms & Mental Health
  symptoms: string[];
  mentalHealth: string[];
  // Diseases
  diseaseDetails: { name: string; since: string; currentSymptoms: string[]; severity: string }[];
  // Context
  season: string;
  currentMedications: string;
}

export async function generateCompleteReport(data: IntakeData, language: string = 'en', units: string = 'metric'): Promise<LLMResponse> {
  const diseaseBlock = data.diseaseDetails.length > 0
    ? `\nDISEASES/CONDITIONS:\n${data.diseaseDetails.map(d =>
      `- ${d.name} (Since: ${d.since}, Severity: ${d.severity})\n  Current symptoms: ${d.currentSymptoms.join(', ')}`
    ).join('\n')}`
    : '\nDISEASES/CONDITIONS: None reported';

  const mentalBlock = data.mentalHealth.length > 0
    ? `\nMENTAL HEALTH CONCERNS: ${data.mentalHealth.join(', ')}`
    : '\nMENTAL HEALTH: No concerns reported';

  const prompt = `Generate a COMPLETE personalized Ayurvedic health report based on ALL the data below.
IMPORTANT: Search online for the latest authentic Ayurvedic research, herb-drug interactions, and evidence-based dosages relevant to this user's conditions before generating the report.

USER PROFILE:
- Name: ${data.name}
- Age: ${data.age}, Gender: ${data.gender}
- Weight: ${data.weight}kg, Height: ${data.height}cm, BMI: ${(data.weight / ((data.height / 100) ** 2)).toFixed(1)}
- Activity Level: ${data.activityLevel}
- Dietary Preference: ${data.dietaryPreference}
- Eating Habits: ${data.eatingHabits || 'Not specified'}
- Sleep: ${data.sleepHours} hours/night
- Stress Level: ${data.stressLevel}
- Current Medications: ${data.currentMedications || 'None'}
- Season: ${data.season}

PRAKRITI QUIZ ANSWERS:
${Object.entries(data.prakritiAnswers).map(([q, a]) => `- ${q}: ${a}`).join('\n')}

PHYSICAL SYMPTOMS: ${data.symptoms.length > 0 ? data.symptoms.join(', ') : 'None reported'}
${mentalBlock}
${diseaseBlock}

You MUST respond with a single JSON object in this EXACT format (no markdown, no extra text).
All herb dosages MUST come from authentic sources (Ayurvedic Pharmacopoeia of India, CCRAS guidelines, or peer-reviewed research).
Include contraindications for any herbs if the user is on medications.
{
  "prakriti_analysis": {
    "vata_percentage": <number>,
    "pitta_percentage": <number>,
    "kapha_percentage": <number>,
    "dominant_dosha": "<string>",
    "secondary_dosha": "<string>",
    "constitution_type": "<e.g. Vata-Pitta>",
    "confidence_score": <number 0-100>,
    "description": "<3-4 line description of constitution>",
    "strengths": ["<s1>", "<s2>", "<s3>"],
    "vulnerabilities": ["<v1>", "<v2>", "<v3>"]
  },
  "vikriti_analysis": {
    "imbalanced_doshas": ["<dosha1>"],
    "severity": "<Mild|Moderate|High>",
    "primary_imbalance": "<description>",
    "symptom_analysis": [
      {"symptom": "<name>", "dosha_link": "<dosha>", "explanation": "<why>"}
    ],
    "root_causes": ["<cause1>", "<cause2>"],
    "red_flags": ["<any urgent concerns>"]
  },
  "disease_treatment": [
    {
      "disease": "<name>",
      "dosha_root_cause": "<explanation>",
      "ayurvedic_treatment": "<detailed treatment protocol with classical reference>",
      "stages": [
        {"level": "Mild", "symptoms": ["<s>"], "advice": "<what to do>"},
        {"level": "Moderate", "symptoms": ["<s>"], "advice": "<what to do>"},
        {"level": "Severe", "symptoms": ["<s>"], "advice": "<what to do — include medical referral>"}
      ],
      "specific_diet": {"eat": ["<food>"], "avoid": ["<food>"]},
      "specific_herbs": [{"name": "<herb>", "usage": "<how>", "dosage": "<amount from pharmacopoeia>"}],
      "specific_yoga": ["<pose or practice>"],
      "specific_lifestyle": ["<recommendation>"],
      "recovery_timeline": "<expected timeline with proper adherence>"
    }
  ],
  "diet_plan": {
    "foods_to_eat": [{"food": "<name>", "reason": "<why>", "dosha_effect": "<balances X>"}],
    "foods_to_avoid": [{"food": "<name>", "reason": "<why>"}],
    "meal_schedule": [{"time": "<7:00 AM>", "meal": "<description>", "calories": "<estimated>"}],
    "cooking_methods": ["<method1>"],
    "herbal_additions": ["<herb with usage>"],
    "calorie_range": "<range based on BMI and goals>",
    "macronutrient_ratio": {"carbs": <percent>, "protein": <percent>, "fat": <percent>},
    "special_notes": "<dietary notes>"
  },
  "yoga_plan": {
    "asanas": [{"name": "<pose>", "duration": "<time>", "frequency": "<freq>", "benefit": "<why>", "difficulty": "<Beginner|Intermediate|Advanced>"}],
    "pranayama": [{"name": "<technique>", "duration": "<time>", "frequency": "<freq>", "benefit": "<why>"}],
    "meditation": {"type": "<technique>", "duration": "<time>", "benefit": "<why>"},
    "precautions": ["<precaution>"]
  },
  "daily_routine": [
    {"time": "<5:30 AM>", "activity": "<what>", "description": "<details>", "period": "<morning|afternoon|evening|night>"}
  ],
  "hydration": {
    "daily_target_ml": <number>,
    "tips": ["<tip1>"],
    "best_drinks": ["<drink1>"],
    "drinks_to_avoid": ["<drink1>"]
  },
  "seasonal_advice": {
    "current_season": "<Ayurvedic season name>",
    "season_effect_on_dosha": "<how this season affects their dosha>",
    "diet_tips": ["<tip>"],
    "lifestyle_tips": ["<tip>"],
    "herbs_for_season": ["<herb>"],
    "things_to_avoid": ["<avoid>"]
  },
  "herb_recommendations": [
    {"name": "<herb (Sanskrit + English)>", "benefit": "<why>", "dosage": "<from pharmacopoeia>", "when_to_take": "<timing>", "precaution": "<warning + contraindications>"}
  ],
  "mental_health_plan": {
    "assessment": "<overview of mental state>",
    "practices": [{"practice": "<name>", "description": "<how to do>", "frequency": "<daily/weekly>"}],
    "herbs_for_mind": [{"name": "<herb>", "benefit": "<why>"}],
    "lifestyle_changes": ["<change>"]
  },
  "risk_assessment": {
    "level": "<Low|Medium|High>",
    "concerns": ["<concern>"],
    "medical_referral_needed": <true|false>,
    "disclaimer": "This is educational guidance, not a substitute for professional medical advice."
  },
  "weekly_goals": [
    {"goal": "<description>", "frequency": "<daily/weekly>", "category": "<diet|yoga|lifestyle|herbs|mental>"}
  ]
}`;

  return callLLM([{ role: 'user', content: prompt }], 8192, language, units, true);
}

// ── Chat with AI ────────────────────────────────────────
export async function chatWithAI(
  conversationHistory: LLMMessage[],
  userMessage: string,
  userContext: string,
  language: string = 'en',
  units: string = 'metric'
): Promise<LLMResponse> {
  const contextPrompt = userContext
    ? `[User Context: ${userContext}]\n\n${userMessage}`
    : userMessage;

  return callLLM(
    [...conversationHistory, { role: 'user', content: contextPrompt }],
    4096,
    language,
    units
  );
}

// ── Disease-specific advice (for Disease Library) ───────
export async function getDiseaseAdvice(
  disease: string,
  prakriti: string,
  userInfo: { age: number; gender: string },
  language: string = 'en',
  units: string = 'metric'
): Promise<LLMResponse> {
  const prompt = `Provide detailed Ayurvedic guidance for managing "${disease}".
IMPORTANT: Search online for the latest authentic Ayurvedic research, clinical studies, and evidence-based protocols for this disease before generating guidance.

USER: Age ${userInfo.age}, Gender: ${userInfo.gender}, Prakriti: ${prakriti}

Respond in this exact JSON format. All herb dosages must come from authenticated sources:
{
  "disease": "${disease}",
  "dosha_root_cause": "<explanation with classical reference>",
  "nidana": "<etiology from classical texts>",
  "samprapti": "<pathogenesis explanation>",
  "stages": [
    {"level": "Mild", "symptoms": ["<s1>"], "advice": "<what to do>"},
    {"level": "Moderate", "symptoms": ["<s1>"], "advice": "<what to do>"},
    {"level": "Severe", "symptoms": ["<s1>"], "advice": "<what to do — include medical referral>"}
  ],
  "diet": {"eat": ["<food1>"], "avoid": ["<food1>"]},
  "herbs": [{"name": "<herb (Sanskrit + English)>", "usage": "<how>", "dosage": "<from pharmacopoeia>", "contraindications": "<warnings>"}],
  "formulations": [{"name": "<classical formulation>", "source_text": "<which text>", "usage": "<how to use>"}],
  "lifestyle": ["<recommendation1>"],
  "yoga": ["<pose or practice>"],
  "modern_research": "<brief summary of any relevant modern studies>",
  "disclaimer": "Consult a healthcare professional for persistent or severe symptoms."
}`;

  return callLLM([{ role: 'user', content: prompt }], 8192, language, units, true);
}

// ========================================
// AyurGenix – OpenRouter LLM API Integration
// ========================================

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

function getApiKey(): string {
  return process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
}

function getModel(): string {
  return process.env.NEXT_PUBLIC_OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';
}

const SYSTEM_PROMPT = `You are AyurGenix AI — an expert Ayurvedic health advisor powered by classical Ayurvedic principles combined with modern nutrition science.

CORE RULES:
1. You ALWAYS respond in structured JSON format when asked for reports.
2. You provide personalized Ayurvedic guidance based on the user's Prakriti (constitution), Vikriti (current imbalance), symptoms, BMI, season, and lifestyle.
3. You blend classical Ayurveda (Charaka Samhita, Sushruta Samhita) with modern nutrition science.
4. For RED FLAG symptoms (chest pain, severe diabetes, sudden weight loss, high fever, breathing difficulty, blood in stool/urine, severe abdominal pain, fainting) — you ALWAYS recommend immediate medical consultation first.
5. You include safety disclaimers: "This is educational guidance, not a substitute for professional medical advice."
6. You provide stage-based escalation (Mild → Moderate → Severe) for health conditions.
7. You are warm, supportive, and culturally respectful.
8. All dietary recommendations MUST respect the user's dietary preference (vegetarian/non-vegetarian/vegan).
9. If the user has a specific disease, provide DETAILED Ayurvedic treatment protocol for it.`;

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  success: boolean;
  content: string;
  error?: string;
}

export async function callLLM(
  messages: LLMMessage[],
  maxTokens: number = 4096
): Promise<LLMResponse> {
  const apiKey = getApiKey();
  const model = getModel();

  if (!apiKey) {
    return { success: false, content: '', error: 'API key not configured. Please set NEXT_PUBLIC_OPENROUTER_API_KEY in your .env file.' };
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ayurgenix.vercel.app',
        'X-Title': 'AyurGenix AI',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return { success: false, content: '', error: `API Error (${response.status}): ${errorData}` };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    return { success: true, content };
  } catch (error) {
    return { success: false, content: '', error: `Network error: ${(error as Error).message}` };
  }
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

export async function generateCompleteReport(data: IntakeData): Promise<LLMResponse> {
  const diseaseBlock = data.diseaseDetails.length > 0
    ? `\nDISEASES/CONDITIONS:\n${data.diseaseDetails.map(d =>
      `- ${d.name} (Since: ${d.since}, Severity: ${d.severity})\n  Current symptoms: ${d.currentSymptoms.join(', ')}`
    ).join('\n')}`
    : '\nDISEASES/CONDITIONS: None reported';

  const mentalBlock = data.mentalHealth.length > 0
    ? `\nMENTAL HEALTH CONCERNS: ${data.mentalHealth.join(', ')}`
    : '\nMENTAL HEALTH: No concerns reported';

  const prompt = `Generate a COMPLETE personalized Ayurvedic health report based on ALL the data below.

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

You MUST respond with a single JSON object in this EXACT format (no markdown, no extra text):
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
      "ayurvedic_treatment": "<detailed treatment protocol>",
      "stages": [
        {"level": "Mild", "symptoms": ["<s>"], "advice": "<what to do>"},
        {"level": "Moderate", "symptoms": ["<s>"], "advice": "<what to do>"},
        {"level": "Severe", "symptoms": ["<s>"], "advice": "<what to do — include medical referral>"}
      ],
      "specific_diet": {"eat": ["<food>"], "avoid": ["<food>"]},
      "specific_herbs": [{"name": "<herb>", "usage": "<how>", "dosage": "<amount>"}],
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
    {"name": "<herb>", "benefit": "<why>", "dosage": "<how much>", "when_to_take": "<timing>", "precaution": "<warning>"}
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

  return callLLM([{ role: 'user', content: prompt }], 8192);
}

// ---- Chat with AI ----
export async function chatWithAI(
  conversationHistory: LLMMessage[],
  userMessage: string,
  userContext: string
): Promise<LLMResponse> {
  const contextPrompt = userContext
    ? `[User Context: ${userContext}]\n\n${userMessage}`
    : userMessage;

  return callLLM(
    [...conversationHistory, { role: 'user', content: contextPrompt }]
  );
}

// ---- Disease-specific advice (standalone, for Disease Library) ----
export async function getDiseaseAdvice(
  disease: string,
  prakriti: string,
  userInfo: { age: number; gender: string }
): Promise<LLMResponse> {
  const prompt = `Provide detailed Ayurvedic guidance for managing "${disease}".

USER: Age ${userInfo.age}, Gender: ${userInfo.gender}, Prakriti: ${prakriti}

Respond in this exact JSON format:
{
  "disease": "${disease}",
  "dosha_root_cause": "<explanation>",
  "stages": [
    {"level": "Mild", "symptoms": ["<s1>"], "advice": "<what to do>"},
    {"level": "Moderate", "symptoms": ["<s1>"], "advice": "<what to do>"},
    {"level": "Severe", "symptoms": ["<s1>"], "advice": "<what to do — include medical referral>"}
  ],
  "diet": {"eat": ["<food1>"], "avoid": ["<food1>"]},
  "herbs": [{"name": "<herb>", "usage": "<how>", "dosage": "<amount>"}],
  "lifestyle": ["<recommendation1>"],
  "yoga": ["<pose or practice>"],
  "disclaimer": "Consult a healthcare professional for persistent or severe symptoms."
}`;

  return callLLM([{ role: 'user', content: prompt }]);
}

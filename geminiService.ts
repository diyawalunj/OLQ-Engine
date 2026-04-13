import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AnalysisResult {
  readinessScore: number;
  summary: string;
  realismScore: number;
  realismDescription: string;
  artificialityRisk: "LOW" | "MEDIUM" | "HIGH";
  artificialityDescription: string;
  profile: {
    emotionalStability: string;
    socialAdaptability: string;
    leadershipPotential: string;
    decisionMaking: string;
  };
  identifiedOlqs: {
    name: string;
    strength: "STRONG" | "ADEQUATE" | "MARGINAL";
    explanation: string;
  }[];
  riskSimulation: {
    title: string;
    description: string;
    recommendedProbe: string;
  }[];
  olqWiseAnalysis: {
    name: string;
    score: number;
    evidence: string;
    reasoning: string;
  }[];
  testWiseAnalysis: {
    wat?: { thoughtPattern: string; olqIndicators: string };
    srt?: { decisionMaking: string; practicality: string; responsibility: string };
    tat?: { theme: string; characterBehavior: string; outcome: string };
  };
  strengths: string[];
  weaknesses: string[];
  failureAnalysis: {
    issue: string;
    reasonForRejection: string;
  }[];
  idealResponseHints: {
    context: string;
    hint: string;
  }[];
  overallAssessment: {
    psychologicalProfile: "Officer Like" | "Borderline" | "Needs Improvement";
    recommendation: "Recommended" | "Not Recommended";
    confidenceLevel: "Low" | "Medium" | "High";
  };
  improvementPlan: {
    olqWiseSuggestions: string[];
    watCorrection?: string;
    srtImprovement?: string;
    tatStructuring?: string;
  };
}

export class GeminiError extends Error {
  constructor(public message: string, public type: 'API_KEY' | 'QUOTA' | 'NETWORK' | 'SAFETY' | 'UNKNOWN') {
    super(message);
    this.name = 'GeminiError';
  }
}

export async function analyzeResponses(
  protocol: string, 
  responses: string, 
  image?: string // base64 string
): Promise<AnalysisResult> {
  const parts: any[] = [
    {
      text: `You are an SSB (Services Selection Board) Psychological Assessor.
      Analyze the following candidate responses in ${protocol}${image ? ' and the provided reference image' : ''}.
      
      Assessment must be based ONLY on the following 11 OLQs:
      1. Effective Intelligence
      2. Reasoning Ability
      3. Organising Ability
      4. Power of Expression
      5. Social Adaptability
      6. Cooperation
      7. Sense of Responsibility
      8. Initiative
      9. Self Confidence
      10. Ability to Influence the Group
      11. Determination

      Responses:
      ${responses}

      YOUR TASK:
      1. READINESS SCORE: A score out of 10 representing overall officer potential. This should be a weighted reflection of the 11 OLQ scores.
      2. REALISM SCORE: A score out of 10 (how authentic/natural the responses feel vs coached) with a brief description.
      3. ARTIFICIALITY RISK: LOW, MEDIUM, or HIGH with a brief description of why.
      4. OLQ-WISE ANALYSIS: For each of the 11 OLQs, provide a score (0-10), evidence from responses, and reasoning.
      5. TEST-WISE ANALYSIS: Provide specific insights based on the protocol used (WAT, SRT, or TAT). For each test provided, include an individual score (0-10) and short reasoning.
      6. STRENGTHS & WEAKNESSES: Top 5 each.
      7. FAILURE ANALYSIS: Identify points that might lead to a rejection by an assessor (e.g. irresponsible behavior, panic). Provide the issue and the reason it risks rejection.
      8. IDEAL RESPONSE HINTS: Provide 2-3 specific hints or examples of what an 'ideal' response would have looked like for the context provided.
      9. OVERALL ASSESSMENT: Psychological Profile (Officer Like/Borderline/Needs Improvement), Recommendation (Recommended/Not Recommended), and Confidence Level (Low/Medium/High).
      10. IMPROVEMENT PLAN: OLQ-wise suggestions and test-specific guidance.

      SCORING BANDS (0-10):
      - 0–3: Negative / irresponsible / avoidance / unrealistic.
      - 4–5: Weak / unclear / passive / inconsistent.
      - 6–7: Basic correct and practical response (DO NOT under-score these).
      - 8–9: Strong response with clear action and good judgment.
      - 10: Exceptional response with specific, effective, and leadership-driven action.

      GLOBAL SCORING PRINCIPLES:
      - DO NOT penalize concise responses. Length is NOT a scoring factor.
      - Focus on QUALITY OF THOUGHT: Practicality, Responsibility, Initiative, Clarity of thinking, and Realism.
      - Avoid over-strict evaluation. Reward correct and natural behavior.
      - Reduce score ONLY when: Unrealistic/impractical, avoids responsibility, too vague/irrelevant, or over-ideal/memorized/moral preaching without action.

      TEST-SPECIFIC GUIDELINES:
      - WAT: Evaluate thinking pattern (positive/realistic/negative). Do NOT penalize simple sentences if they reflect a healthy mindset.
      - SRT: Evaluate action in context of the situation. Accept both concise and detailed correct responses.
      - TAT: Evaluate overall story (not length). Focus on main character's actions, problem-solving approach, and realistic positive outcome.

      EVALUATION RULES:
      - Analyze ONLY the tests that are provided in the input.
      - Do NOT assume missing data or fill in gaps with generic traits.
      - Adjust the depth and certainty of your analysis based on the volume and quality of available input.
      - If only ONE test type is provided (e.g., only WAT or only SRT), you MUST start your 'summary' with the exact phrase: "Assessment based on limited data."
      - If MULTIPLE test types are detected in the input (even if the primary protocol is specified as one), you MUST cross-analyze the responses for consistency and psychological alignment across different tests.

      IMPORTANT RULES:
      - Be balanced, not overly strict. Think like a real SSB assessor, not a harsh AI evaluator.
      - Do NOT undervalue correct answers. Do NOT reward only long answers.
      - Maintain consistency across all tests.
`
    }
  ];

  if (image) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: image.split(',')[1] || image
      }
    });
  }

  const performAnalysis = async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction: "You are a Senior Psychologist at the Services Selection Board (SSB). Your task is to analyze candidate responses from psychological tests (WAT, TAT, SRT) and provide a structured, objective, and insightful assessment of their Officer Like Qualities (OLQs). Analyze ONLY the tests provided; do NOT assume missing data. If only one test type is provided, start the 'summary' with 'Assessment based on limited data.' If multiple tests are provided, cross-analyze for consistency. Follow these scoring principles: 1. DO NOT penalize concise responses; length is not a scoring factor. 2. Focus on quality of thought (Practicality, Responsibility, Initiative, Clarity, Realism). 3. Use scoring bands: 0-3 (Negative/Unrealistic), 4-5 (Weak/Passive), 6-7 (Basic correct/practical), 8-9 (Strong/Good judgment), 10 (Exceptional/Leadership). 4. Reward correct and natural behavior; do not be overly strict. Your analysis must be professional, identifying both strengths and potential risk areas. Use the standard 15 OLQ framework used in SSB assessments. Your output must be strictly in JSON format according to the provided schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            readinessScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            realismScore: { type: Type.NUMBER },
            realismDescription: { type: Type.STRING },
            artificialityRisk: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] },
            artificialityDescription: { type: Type.STRING },
            profile: {
              type: Type.OBJECT,
              properties: {
                emotionalStability: { type: Type.STRING },
                socialAdaptability: { type: Type.STRING },
                leadershipPotential: { type: Type.STRING },
                decisionMaking: { type: Type.STRING },
              },
              required: ["emotionalStability", "socialAdaptability", "leadershipPotential", "decisionMaking"],
            },
            identifiedOlqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  strength: { type: Type.STRING, enum: ["STRONG", "ADEQUATE", "MARGINAL"] },
                  explanation: { type: Type.STRING },
                },
                required: ["name", "strength", "explanation"],
              },
            },
            riskSimulation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  recommendedProbe: { type: Type.STRING },
                },
                required: ["title", "description", "recommendedProbe"],
              },
            },
            olqWiseAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  evidence: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                },
                required: ["name", "score", "evidence", "reasoning"],
              },
            },
            testWiseAnalysis: {
              type: Type.OBJECT,
              properties: {
                wat: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    reasoning: { type: Type.STRING },
                    thoughtPattern: { type: Type.STRING },
                    olqIndicators: { type: Type.STRING },
                  },
                  required: ["score", "reasoning"],
                },
                srt: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    reasoning: { type: Type.STRING },
                    decisionMaking: { type: Type.STRING },
                    practicality: { type: Type.STRING },
                    responsibility: { type: Type.STRING },
                  },
                  required: ["score", "reasoning"],
                },
                tat: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    reasoning: { type: Type.STRING },
                    theme: { type: Type.STRING },
                    characterBehavior: { type: Type.STRING },
                    outcome: { type: Type.STRING },
                  },
                  required: ["score", "reasoning"],
                },
              },
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            failureAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  issue: { type: Type.STRING },
                  reasonForRejection: { type: Type.STRING },
                },
                required: ["issue", "reasonForRejection"],
              },
            },
            idealResponseHints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  context: { type: Type.STRING },
                  hint: { type: Type.STRING },
                },
                required: ["context", "hint"],
              },
            },
            overallAssessment: {
              type: Type.OBJECT,
              properties: {
                psychologicalProfile: { type: Type.STRING, enum: ["Officer Like", "Borderline", "Needs Improvement"] },
                recommendation: { type: Type.STRING, enum: ["Recommended", "Not Recommended"] },
                confidenceLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              },
              required: ["psychologicalProfile", "recommendation", "confidenceLevel"],
            },
            improvementPlan: {
              type: Type.OBJECT,
              properties: {
                olqWiseSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                watCorrection: { type: Type.STRING },
                srtImprovement: { type: Type.STRING },
                tatStructuring: { type: Type.STRING },
              },
              required: ["olqWiseSuggestions"],
            },
          },
          required: [
            "readinessScore", "summary", "realismScore", "realismDescription", 
            "artificialityRisk", "artificialityDescription", "profile", 
            "identifiedOlqs", "riskSimulation", "olqWiseAnalysis", "testWiseAnalysis", 
            "strengths", "weaknesses", "failureAnalysis", "idealResponseHints", "overallAssessment", "improvementPlan"
          ],
        },
      },
    });

    if (!response.text) {
      throw new GeminiError("No response text received from the model.", "UNKNOWN");
    }

    return JSON.parse(response.text);
  };

  // Limitless Retry Logic: Automatically handle quota limits
  let lastError: any;
  let delay = 2000;
  const maxRetries = 5;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await performAnalysis();
    } catch (error: any) {
      lastError = error;
      const message = error.message || "";
      const isQuota = message.includes("quota") || message.includes("429");
      
      if (isQuota && i < maxRetries - 1) {
        console.warn(`Quota limit hit. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }

      console.error("Gemini API Error:", error);
      
      if (message.includes("API_KEY_INVALID") || message.includes("API key not valid")) {
        throw new GeminiError("Invalid API Key. Please check your GEMINI_API_KEY in the Secrets panel.", "API_KEY");
      } else if (isQuota) {
        throw new GeminiError("API Quota exceeded. The system is retrying automatically, but the limit is currently too high. Please wait a moment.", "QUOTA");
      } else if (message.includes("fetch") || message.includes("network")) {
        throw new GeminiError("Network error. Please check your internet connection.", "NETWORK");
      } else if (message.includes("safety") || message.includes("blocked")) {
        throw new GeminiError("The content was blocked by safety filters. Please try rephrasing your responses.", "SAFETY");
      }
      
      throw new GeminiError(error.message || "An unexpected error occurred during analysis.", "UNKNOWN");
    }
  }
  
  throw lastError;
}

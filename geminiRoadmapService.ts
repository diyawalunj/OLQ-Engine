import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface RoadmapGoal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  category: 'WAT' | 'TAT' | 'SRT' | 'OIR' | 'PPDT' | 'SDT' | 'GTO' | 'INTERVIEW' | 'GENERAL';
  targetOLQs: string[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  completed: boolean;
}

export interface Roadmap {
  summary: string;
  daysUntilSSB: number;
  weeklyFocus: string;
  dailyGoals: RoadmapGoal[];
  weeklyGoals: RoadmapGoal[];
  monthlyGoals: RoadmapGoal[];
  focusAreas: string[];
  encouragement: string;
}

export async function generateRoadmap(
  entryType: string,
  targetDate: string,
  selfAssessment: Record<string, number>,
  previousAttempts: number,
  recentScores: number[]
): Promise<Roadmap> {
  const daysUntil = Math.max(0, Math.floor((new Date(targetDate).getTime() - Date.now()) / 86400000));
  
  const weakOLQs = Object.entries(selfAssessment)
    .filter(([_, score]) => score <= 5)
    .map(([name]) => name);
  
  const strongOLQs = Object.entries(selfAssessment)
    .filter(([_, score]) => score >= 8)
    .map(([name]) => name);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [{
        text: `You are an SSB preparation coach. Generate a personalized weekly preparation roadmap.

CANDIDATE PROFILE:
- Entry: ${entryType}
- Days until SSB: ${daysUntil}
- Previous attempts: ${previousAttempts}
- Weak OLQs: ${weakOLQs.join(', ') || 'None identified'}
- Strong OLQs: ${strongOLQs.join(', ') || 'None identified'}  
- Self-assessment scores: ${JSON.stringify(selfAssessment)}
- Recent readiness scores: ${recentScores.join(', ') || 'No data yet'}

Generate a PRACTICAL, ACTIONABLE roadmap with specific tasks. Focus extra attention on weak OLQs.
Include a mix of practice types (WAT, SRT, TAT, OIR, GTO exercises).
Daily goals should take 30-60 minutes. Weekly goals should be milestone-based.
Monthly goals should track broader improvement targets.`
      }]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          weeklyFocus: { type: Type.STRING },
          dailyGoals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                category: { type: Type.STRING },
                targetOLQs: { type: Type.ARRAY, items: { type: Type.STRING } },
                priority: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
              },
              required: ['id', 'title', 'description', 'category', 'priority', 'targetOLQs'],
            },
          },
          weeklyGoals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                category: { type: Type.STRING },
                targetOLQs: { type: Type.ARRAY, items: { type: Type.STRING } },
                priority: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
              },
              required: ['id', 'title', 'description', 'category', 'priority', 'targetOLQs'],
            },
          },
          monthlyGoals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                category: { type: Type.STRING },
                targetOLQs: { type: Type.ARRAY, items: { type: Type.STRING } },
                priority: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
              },
              required: ['id', 'title', 'description', 'category', 'priority', 'targetOLQs'],
            },
          },
          focusAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
          encouragement: { type: Type.STRING },
        },
        required: ['summary', 'weeklyFocus', 'dailyGoals', 'weeklyGoals', 'monthlyGoals', 'focusAreas', 'encouragement'],
      },
    },
  });

  if (!response.text) throw new Error("No roadmap generated");
  
  const data = JSON.parse(response.text);
  return {
    ...data,
    daysUntilSSB: daysUntil,
    dailyGoals: data.dailyGoals.map((g: any) => ({ ...g, type: 'daily', completed: false })),
    weeklyGoals: data.weeklyGoals.map((g: any) => ({ ...g, type: 'weekly', completed: false })),
    monthlyGoals: data.monthlyGoals.map((g: any) => ({ ...g, type: 'monthly', completed: false })),
  };
}

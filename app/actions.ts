'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

interface ActionResponse {
    success: boolean;
    content: string;
    error?: string;
}

interface GeminiMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export async function generateGeminiContent(
    history: GeminiMessage[],
    systemInstruction: string,
    modelName: string = 'gemini-2.0-flash',
    maxTokens: number = 4096,
    jsonMode: boolean = false
): Promise<ActionResponse> {
    // 🔒 SECURE: Access API Key only on server
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
        return { success: false, content: '', error: 'Server Error: API key not configured.' };
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // Initialize Model config
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modelConfig: any = {
            model: modelName,
            systemInstruction: systemInstruction,
            generationConfig: {
                responseMimeType: jsonMode ? "application/json" : "text/plain",
                maxOutputTokens: maxTokens,
                temperature: 0.7,
            },
        };

        // ✨ Google Search Grounding (RAG) — only for Chat mode
        // Grounding conflicts with strict JSON output, so we disable it for JSON mode
        if (!jsonMode) {
            modelConfig.tools = [{ googleSearch: {} }];
        }

        const model = genAI.getGenerativeModel(modelConfig);

        const result = await model.generateContent({
            contents: history,
        });

        const response = await result.response;
        const text = response.text();

        return { success: true, content: text };
    } catch (error) {
        console.error("Gemini Server Action Error:", error);
        return { success: false, content: '', error: `AI Error: ${(error as Error).message}` };
    }
}

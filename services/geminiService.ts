
import { GoogleGenAI, Type } from "@google/genai";
import { UserData, LifeStage, Scene, Language } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getLanguageName = (lang: Language) => (lang === 'zh' ? 'Chinese' : 'English');

export async function generateDestinyReport(userData: UserData, language: Language): Promise<string> {
    const { name, birthDate, birthTime, birthPlace } = userData;
    const languageName = getLanguageName(language);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on the following birth information: Name: ${name}, Birth Date: ${birthDate}, Birth Time: ${birthTime}, Birth Place: ${birthPlace}. Please generate a multi-part Destiny Report. The report should be beautifully written and include sections for: 1. Core Personality & Archetype. 2. Strengths & Latent Talents. 3. Life's Challenges & Karmic Lessons. 4. Path in Relationships & Love. Use evocative and metaphorical language. Format the response in Markdown with headings for each section. IMPORTANT: The entire response must be in ${languageName}.`,
        config: {
            systemInstruction: "You are a wise and ancient astrologer, a master of esoteric arts like Western astrology, Bazi, and Tarot. Your language is poetic, profound, and mystical. You are creating a personalized 'Destiny Report' for a person.",
            temperature: 0.8,
        }
    });
    
    return response.text;
}

export async function generateGameScene(stage: LifeStage, destinyReport: string, storyLog: string[], language: Language): Promise<Scene> {
    const storySoFar = storyLog.join('\n');
    const languageName = getLanguageName(language);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `A player has the following destiny profile: \n---\n${destinyReport}\n---\n Their story so far:\n${storySoFar}\n\nNow, generate a scenario for their '${stage}' life stage. Describe a situation and present them with exactly 3 distinct, meaningful, and challenging choices. The choices should reflect the themes in their destiny report. IMPORTANT: The entire JSON response (both the 'scenario' and the 'choices' array) must be in ${languageName}.`,
        config: {
            systemInstruction: "You are a master storyteller and game master for a text-based life simulation game about destiny. Your tone is narrative and engaging. Respond only with the requested JSON object.",
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    scenario: { type: Type.STRING },
                    choices: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        if (parsed.scenario && Array.isArray(parsed.choices) && parsed.choices.length > 0) {
            return parsed as Scene;
        } else {
             throw new Error("Invalid scene format from API");
        }
    } catch (error) {
        console.error("Failed to parse scene JSON:", error);
        throw new Error("The celestial pathways are unclear. Could not generate the next scene.");
    }
}

export async function generateEnding(storyLog: string[], language: Language): Promise<string> {
    const storySoFar = storyLog.join('\n');
    const languageName = getLanguageName(language);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `The life journey has concluded. Here is the log of major choices made:\n---\n${storySoFar}\n---\n\nBased on this path, write a final, philosophical summary of this person's life. It should not be a simple 'good' or 'bad' ending, but a thoughtful reflection on their experiences, their legacy, and the meaning they found or created. Conclude with a poignant final sentence. IMPORTANT: The entire response must be in ${languageName}.`,
        config: {
            systemInstruction: "You are a wise, philosophical narrator, like a biographer of souls. Your tone is reflective, poetic, and profound.",
            temperature: 0.7,
        }
    });
    
    return response.text;
}

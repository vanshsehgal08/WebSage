require("dotenv").config();
import express from "express";
import axios from "axios";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import {basePrompt as nodeBasePrompt} from "./defaults/node";
import {basePrompt as reactBasePrompt} from "./defaults/react";
import cors from "cors";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Type definitions for Gemini API response
interface GeminiPart {
    text: string;
}

interface GeminiContent {
    parts: GeminiPart[];
}

interface GeminiCandidate {
    content: GeminiContent;
}

interface GeminiResponse {
    candidates: GeminiCandidate[];
}

const app = express();
app.use(express.json())
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://websage30.vercel.app',
    'https://websage-vanshsehgal08s-projects.vercel.app'
  ],
  credentials: true
}))

// Helper function to call Gemini API
async function callGeminiAPI(prompt: string, systemPrompt?: string) {
    try {
        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        
        const response = await axios.post<GeminiResponse>(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [
                {
                    parts: [
                        {
                            text: fullPrompt
                        }
                    ]
                }
            ],
            generationConfig: {
                maxOutputTokens: 32000,
                temperature: 0.7,
                topP: 0.8,
                topK: 40
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
}

//TEMPLATE ENDPOINT

app.post("/template", async (req, res) => {
    const prompt = req.body.prompt;
    
    try {
        const answer = await callGeminiAPI(
            prompt,
            "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
        );

        if (answer.toLowerCase().includes("react")) {
            res.json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [reactBasePrompt]
            })
            return;
        }

        if (answer.toLowerCase().includes("node")) {
            res.json({
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [nodeBasePrompt]
            })
            return;
        }

        res.status(403).json({message: "You cant access this"})
        return;
    } catch (error) {
        console.error('Error in template endpoint:', error);
        res.status(500).json({message: "Internal server error"});
    }
})

// CHAT ENDPOINT

app.post("/chat", async (req, res) => {
    const messages = req.body.messages;
    
    try {
        // Convert messages array to a single prompt for Gemini
        const conversationText = messages.map((msg: any) => 
            `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n\n');
        
        const response = await callGeminiAPI(conversationText, getSystemPrompt());

        console.log(response);

        res.json({
            response: response
        });
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({message: "Internal server error"});
    }
})

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
}

// Export for Vercel
export default app;


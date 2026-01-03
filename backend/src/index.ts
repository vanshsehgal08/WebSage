import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import axios from "axios";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import {basePrompt as nodeBasePrompt} from "./defaults/node";
import {basePrompt as reactBasePrompt} from "./defaults/react";
import cors from "cors";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

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
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://websage30.vercel.app',
      'https://websage-vanshsehgal08s-projects.vercel.app',
      'https://websage-frontend.vercel.app',
      'https://web-sage-sigma.vercel.app'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}))

// Handle preflight requests
app.options('*', (req: Request, res: Response) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});

// Root route
app.get("/", (req: Request, res: Response) => {
    res.json({ 
        message: "WebSage Backend API is running!",
        timestamp: new Date().toISOString(),
        cors: "enabled"
    });
})

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
    res.json({ 
        status: "healthy",
        timestamp: new Date().toISOString()
    });
})

// Helper function to call Gemini API
async function callGeminiAPI(prompt: string, systemPrompt?: string) {
    try {
        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        
        const response = await axios.post<GeminiResponse>(GEMINI_API_URL, {
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
                'Content-Type': 'application/json',
                'X-goog-api-key': GEMINI_API_KEY
            }
        });

        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
}

//TEMPLATE ENDPOINT

app.post("/template", async (req: Request, res: Response) => {
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

app.post("/chat", async (req: Request, res: Response) => {
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

// For local development and Render deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export for Vercel
export default app;


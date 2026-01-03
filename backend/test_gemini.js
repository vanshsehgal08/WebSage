const axios = require('axios');

const GEMINI_API_KEY = "AIzaSyB4rFr40fKxOp1QtB55x1wH64jrXPLBzQI";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function run() {
    try {
        console.log("Testing Gemini API...");
        // API key usually goes in query param 'key' for google APIs, but the code put it in X-goog-api-key header.
        // I will try both or stick to what the code did. Code did X-goog-api-key.
        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [{ parts: [{ text: "Hello" }] }]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("Success:", response.status);
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        }
    }
}

run();

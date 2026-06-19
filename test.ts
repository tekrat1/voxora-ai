console.log(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
import "dotenv/config";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

async function main() {
    try {
        const { text } = await generateText({
            model: google("gemini-2.0-flash"),
            prompt: "Hello",
        });

        console.log(text);
    } catch (e) {
        console.error(e);
    }
}

main();
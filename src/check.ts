import dotenv from 'dotenv';
dotenv.config();

async function checkModels() {
    console.log("🔍 Google se models ki list mangwa rahe hain...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`);
        const data = await response.json();
        
        console.log("\n✅ Google ke paas yeh models available hain:");
        data.models.forEach((m: any) => {
            if (m.supportedGenerationMethods.includes("generateContent")) {
                console.log("👉", m.name.replace("models/", ""));
            }
        });
    } catch (error) {
        console.error("❌ Error fetching models:", error);
    }
}
checkModels();
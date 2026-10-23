import express from 'express';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { bedRotAgent } from '../lib/agent'; 

dotenv.config();

const app = express();
const port = 3000;

const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './'),
    filename: (req, file, cb) => cb(null, 'command.wav')
});
const upload = multer({ storage });

app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.json());

app.post('/upload', upload.single('audio'), async (req, res) => {
    console.log("✅ Audio received! AI is processing... ⏳");

    try {
        const audioStream = fs.createReadStream('command.wav');
        const response = await elevenlabs.speechToText.convert({
            file: audioStream,
            modelId: "scribe_v1",
        });

        console.log("🗣️ Tumne kaha: =>", response.text);
        
        const aiResponse = await bedRotAgent.generate(response.text, { maxSteps: 3 });
        
        console.log("🤖 Bed-Rot Coder ne code bhej diya!");

        res.json({ 
            success: true, 
            transcription: response.text,
            code: aiResponse.text 
        });
        
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ success: false, error: "AI failed to process." });
    }
});

app.listen(port, () => {
    console.log(`🦥 Bed-Rot Coder UI is live! http://localhost:${port}`);
});
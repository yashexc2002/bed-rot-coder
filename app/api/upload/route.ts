import { NextResponse } from 'next/server';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import fsPromises from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';

import { bedRotAgent } from '@/lib/agent'; 

const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

export async function POST(req: Request) {
    console.log("✅ Audio received at Next.js API! AI is processing... ⏳");

    try {
        const formData = await req.formData();
        const audioFile = formData.get('audio') as File;

        if (!audioFile) {
            return NextResponse.json({ success: false, error: 'No audio file provided' }, { status: 400 });
        }

        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filePath = path.join(process.cwd(), 'command.wav');
        await fsPromises.writeFile(filePath, buffer);

        const audioStream = createReadStream(filePath);
        const response = await elevenlabs.speechToText.convert({
            file: audioStream,
            modelId: "scribe_v1",
        });

        console.log("🗣️ Tumne kaha: =>", response.text);

        const aiResponse = await bedRotAgent.generate(response.text, { maxSteps: 1 });
        
        console.log("🤖 Bed-Rot Coder ne code bhej diya!");

        await fsPromises.unlink(filePath).catch(() => {});

        return NextResponse.json({
            success: true, 
            transcription: response.text,
            code: aiResponse.text 
        });

    } catch (error) {
        console.error("❌ Error:", error);
        return NextResponse.json({ success: false, error: "AI failed to process." }, { status: 500 });
    }
}
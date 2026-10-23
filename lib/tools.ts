import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

export const writeFileTool = createTool({
    id: 'write_file_tool',
    description: 'You MUST use this tool to write the generated code into a file. NEVER skip this tool.',
    inputSchema: z.object({
        filename: z.string().describe('Name of the file (e.g., hello.py, index.html)'),
        content: z.string().describe('The complete code to write in the file')
    }),
    execute: async ({ filename, content }) => {
        console.log("\n🛠️ TOOL TRIGGER HUA! AI kaam kar raha hai! 🚀");
        console.log("📂 File ka naam:", filename);
        
        const outputDir = path.join(process.cwd(), 'output');
        const filePath = path.join(outputDir, filename);

        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(filePath, content, 'utf8');
        
        console.log("✅ Code sach me file me Save Ho Gaya!\n");
        return { success: true, message: `Saved ${filename} successfully.` };
    }
});
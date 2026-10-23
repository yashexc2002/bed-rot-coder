import fs from 'fs/promises';
import path from 'path';

export async function saveCodeToFile(filename: string, content: string) {
    try {
        const dirPath = path.join(process.cwd(), 'output');
        
        await fs.mkdir(dirPath, { recursive: true });

        const filePath = path.join(dirPath, filename);

        await fs.writeFile(filePath, content, 'utf-8');
        
        return `Success: ${filename} saved successfully!`;
    } catch (error) {
        return `Error: File save nahi ho payi - ${error}`;
    }
}
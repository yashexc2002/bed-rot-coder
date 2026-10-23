import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

export const bedRotAgent = new Agent({
    id: 'bed-rot-coder',
    name: 'Bed-Rot Coder',
    instructions: `You are a fast voice-to-code assistant.
    Understand the user's request and generate the complete code needed to fulfil it.
    Return only the code, without Markdown fences, explanations, or file-saving instructions.
    Choose a sensible language and include all required code in one response.`,
    model: google('gemini-3.8-flash'),
});

import type { ChatMode } from './types';

export const BUSINESS_SERVICES = `
1. Website Development
2. Website Design
3. App Development
4. App Design
5. Logo Design
6. Graphic Design
7. UI/UX Design
8. Software Development
9. VFX Design
10. Photography
11. Photo and Video Editing
12. Animation Design
13. Digital Marketing
14. Business Growth Solution and Consultancy
`;

export const SYSTEM_INSTRUCTION = `You are a helpful and friendly chatbot for a creative and tech agency. 
Your goal is to assist potential clients by answering their questions about the services we offer.
Here is the list of our services:
${BUSINESS_SERVICES}

Be professional, concise, and engaging. If a user asks about something not on the list, politely state that it's outside your current scope of expertise but you can help with the listed services. 
When asked to compare services, provide clear distinctions. 
Do not make up services or prices.
Keep your answers focused on the provided list of services.
`;

export const MODE_CONFIG = {
  STANDARD: {
    name: 'Standard',
    model: 'gemini-2.5-flash',
    description: 'Balanced speed and intelligence.',
  },
  QUICK: {
    name: 'Quick Response',
    model: 'gemini-flash-lite-latest',
    description: 'Fastest response time, ideal for quick questions.',
  },
  DEEP_THOUGHT: {
    name: 'Deep Thought',
    model: 'gemini-2.5-pro',
    description: 'Maximum reasoning for complex problems.',
  },
  WEB_SEARCH: {
    name: 'Web Search',
    model: 'gemini-2.5-flash',
    description: 'Accesses Google for up-to-date info.',
  },
} as const;

export type ModeKey = keyof typeof MODE_CONFIG;

/* eslint-disable */


import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { messages, feature, jobDescription, userCvContent, schema } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = "";

    if (feature === 'cover-letter' && jobDescription) {
      prompt = `Generate a professional cover letter based on this job description: ${jobDescription}. 

Format it with proper spacing and structure including:
- Header with contact information
- Date
- Employer's address
- Dear Hiring Manager/[Name]
- Opening paragraph expressing interest
- Body paragraphs highlighting relevant skills and experience
- Specific examples matching job requirements
- Closing paragraph with call to action
- Professional sign-off

Make it compelling, personalized, and directly address the job requirements.`;
    } else if (feature === 'cv' && jobDescription && userCvContent) {
      prompt = `I need you to tailor this existing CV to match the job description provided.

**Current CV:**
${userCvContent}

**Job Description:**
${jobDescription}

Please rewrite and optimize the CV to:
1. Match the job requirements perfectly
2. Include relevant keywords from the job description
3. Highlight experiences that align with the role
4. Reorder sections to emphasize the most relevant qualifications
5. Quantify achievements where possible
6. Use action verbs that match the job posting
7. Make it ATS-friendly

IMPORTANT: Return ONLY the complete, professionally formatted CV content. Do NOT include any explanatory paragraphs, advice, tips, or commentary about the CV at the beginning or end. Do NOT add sentences like "This revised CV directly addresses..." or "This approach will help..." or any similar AI-generated advice. Just return the clean, tailored CV content ready for professional use.

The output should start directly with the CV content (name/contact info) and end with the last relevant CV section (skills, education, etc.).`;
    } else {
      // Regular chat - handle cases where messages might be undefined
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        prompt = `You are a professional resume and career assistant. Help with resume building, job applications, and career advice. 

How can I help you with your resume or career today?`;
      } else {
        const lastMessage = messages[messages.length - 1];
        prompt = `You are a professional resume and career assistant. Help with resume building, job applications, and career advice. 

User question: ${lastMessage.content}

Provide helpful, specific advice about resumes, job applications, or career development.`;
      }
    }

    // If a strict JSON schema is requested, enforce it via generationConfig
    if (schema === 'ai_feedback') {
      const generationConfig: {
        responseMimeType: string;
        responseSchema: Schema;
      } = {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            message: { type: SchemaType.STRING },
            suggestions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            encouragement: { type: SchemaType.STRING }
          },
          required: ['message', 'suggestions', 'encouragement']
        }
      };

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }]}],
        generationConfig
      });
      const response = await result.response;
      const text = response.text();
      return NextResponse.json({ message: text, structured: true });
    }

    // Default free-form response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json({ message: 'Sorry, I encountered an error. Please try again.' }, { status: 500 });
  }
}
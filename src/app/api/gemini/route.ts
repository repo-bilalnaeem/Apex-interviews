import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, feature, jobDescription, userCvContent, schema } = await req.json();

    let prompt = '';

    if (feature === 'cover-letter' && jobDescription) {
      prompt = `Generate a professional cover letter for a candidate applying to this role.

${userCvContent ? `**Candidate CV:**\n${userCvContent}\n\n` : ''}**Job Description:**
${jobDescription}

Format it with proper spacing and structure including:
- Date
- Dear Hiring Manager
- Opening paragraph expressing interest in the specific role
- Body paragraphs drawing on the candidate's actual experience and skills${userCvContent ? ' from their CV' : ''} to match the job requirements
- Specific examples aligning the candidate's background with the role
- Closing paragraph with call to action
- Professional sign-off

${userCvContent ? 'Personalise the letter using the candidate\'s real experience, job titles, and achievements from their CV. Do not invent details not present in the CV.' : 'Make it compelling and directly address the job requirements.'}

Return ONLY the cover letter text. No commentary or meta-text.`;
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

IMPORTANT: Return ONLY the complete, professionally formatted CV content. Do NOT include any explanatory paragraphs, advice, tips, or commentary. Just return the clean, tailored CV content ready for professional use.

The output should start directly with the CV content (name/contact info) and end with the last relevant CV section.`;
    } else {
      const lastMessage = messages?.length ? messages[messages.length - 1] : null;
      prompt = `You are a professional resume and career assistant. Help with resume building, job applications, and career advice.\n\n${lastMessage ? `User question: ${lastMessage.content}` : 'How can I help you with your resume or career today?'}`;
    }

    if (schema === 'ai_feedback') {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });
      const text = completion.choices[0].message.content ?? '';
      return NextResponse.json({ message: text, structured: true });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    const text = completion.choices[0].message.content ?? '';
    return NextResponse.json({ message: text });
  } catch (error) {
    console.error('OpenAI error:', error);
    return NextResponse.json(
      { message: 'Sorry, I encountered an error. Please try again.' },
      { status: 500 }
    );
  }
}

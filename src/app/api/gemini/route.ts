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
      prompt = `You are an expert CV writer and ATS optimisation specialist. Rewrite the candidate's CV to maximise its ATS parse score for the target role while keeping it truthful to their actual experience.

**Current CV:**
${userCvContent}

**Target Job Description:**
${jobDescription}

---

**ATS OPTIMISATION RULES — follow every one of these:**

KEYWORDS & CONTENT
- Extract every hard skill, tool, technology, qualification, and job title mentioned in the job description
- Mirror those exact keywords and phrases in the CV (do not paraphrase — ATS matches exact strings)
- Place the most critical keywords in the Summary and Skills sections, not only buried in job bullets
- Add a dedicated "Core Skills" or "Technical Skills" section listing keywords as a clean comma-separated or bulleted list — ATS scans this section heavily
- Quantify achievements with numbers wherever the original CV allows (%, £/$, headcount, timescales)
- Use strong action verbs that match the job description language

SECTION HEADINGS — use only these standard names that every ATS recognises:
- "Professional Summary" (not "Profile", "About Me", "Bio")
- "Work Experience" (not "Career History", "Employment")
- "Education"
- "Core Skills" or "Technical Skills"
- "Certifications" (if applicable)
- "Projects" (if applicable)

FORMATTING RULES — ATS parsers fail on complex formatting:
- Plain text only — no tables, no columns, no text boxes
- No headers or footers (name/contact at top of main body only)
- No graphics, icons, or special characters except standard bullets (•) and hyphens
- No horizontal lines between sections (use blank lines instead)
- Dates in consistent format: "Month YYYY – Month YYYY" or "MMM YYYY – Present"
- Job title first on each role line, then company name, then dates — all on separate lines or clearly separated
- Use • bullets for all job responsibilities and achievements

SECTION ORDER (most ATS-friendly):
1. Name + Contact (phone, email, LinkedIn, location)
2. Professional Summary (3-4 lines, keyword-rich)
3. Core Skills / Technical Skills
4. Work Experience (reverse chronological)
5. Education
6. Certifications / Projects (if present in original)

Do not invent experience, qualifications, or employers not present in the original CV. Only reframe and reword what exists.

IMPORTANT: Return ONLY the complete CV text. No commentary, no tips, no meta-text. Start with the candidate's name and end with the last CV section.`;
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

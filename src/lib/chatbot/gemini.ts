export async function getGeminiResponse(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set in environment');

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey;
  const body = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${err}`);
    }
    const data = await res.json();
    // Gemini API returns candidates[0].content.parts[0].text
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response from Gemini API');
    return text;
  } catch (error: unknown) {
    let errorMsg = '';
    if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMsg = (error as { message: string }).message;
    } else {
      errorMsg = String(error);
    }
    throw new Error('Failed to get response from Gemini API: ' + errorMsg);
  }
}

// New streaming function that simulates character-by-character streaming
export async function streamGeminiResponse(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
  const fullResponse = await getGeminiResponse(prompt);
  
  // Simulate streaming by sending chunks character by character with realistic delays
  const words = fullResponse.split(' ');
  let currentText = '';
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    currentText += (i > 0 ? ' ' : '') + word;
    onChunk(currentText);
    
    // Add realistic delay between words (faster for short words, slower for long ones)
    const delay = Math.min(Math.max(word.length * 20, 50), 200);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

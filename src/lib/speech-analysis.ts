import 'server-only';
import OpenAI, { toFile } from 'openai';

export interface SpeechAnalysis {
  fillerWords: {
    total: number;
    breakdown: Record<string, number>;
  };
  wpm: number;
  wpmLabel: 'too slow' | 'good' | 'too fast';
  analyzedAt: string;
}

const FILLER_WORDS = new Set(['um', 'uh', 'like', 'basically', 'literally']);

export function computeSpeechMetrics(
  words: Array<{ word: string; start: number; end: number }>
): SpeechAnalysis {
  if (words.length === 0) {
    return {
      fillerWords: { total: 0, breakdown: {} },
      wpm: 0,
      wpmLabel: 'good',
      analyzedAt: new Date().toISOString(),
    };
  }

  const breakdown: Record<string, number> = {};
  for (const { word } of words) {
    const normalized = word.toLowerCase().replace(/[^a-z]/g, '');
    if (FILLER_WORDS.has(normalized)) {
      breakdown[normalized] = (breakdown[normalized] ?? 0) + 1;
    }
  }
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const durationMinutes = (words[words.length - 1].end - words[0].start) / 60;
  const wpm = durationMinutes > 0 ? Math.round(words.length / durationMinutes) : 0;
  const wpmLabel: SpeechAnalysis['wpmLabel'] =
    wpm < 120 ? 'too slow' : wpm > 180 ? 'too fast' : 'good';

  return {
    fillerWords: { total, breakdown },
    wpm,
    wpmLabel,
    analyzedAt: new Date().toISOString(),
  };
}

export async function analyzeRecordingWithWhisper(
  recordingUrl: string
): Promise<SpeechAnalysis | null> {
  const apiKey = process.env.OPENAI_SECRET_KEY;
  if (!apiKey) return null;

  const res = await fetch(recordingUrl);
  if (!res.ok) return null;

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const client = new OpenAI({ apiKey });
  const file = await toFile(buffer, 'recording.webm', { type: 'audio/webm' });

  const transcription = await client.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['word'],
  });

  const words: Array<{ word: string; start: number; end: number }> =
    (transcription as unknown as { words?: Array<{ word: string; start: number; end: number }> })
      .words ?? [];

  return computeSpeechMetrics(words);
}

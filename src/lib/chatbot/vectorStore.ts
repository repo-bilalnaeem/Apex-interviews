import 'server-only';

import { embedBatch } from './embeddings';

export interface EmbeddedChunk {
  text: string;
  embedding: number[];
  meetingId?: string;
  speaker?: string;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

export function topK(
  query: number[],
  chunks: EmbeddedChunk[],
  k: number
): EmbeddedChunk[] {
  return chunks
    .map((chunk) => ({ chunk, score: cosineSimilarity(query, chunk.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((r) => r.chunk);
}

// Static KB store with lazy init
let kbChunks: EmbeddedChunk[] | null = null;
let kbInitPromise: Promise<void> | null = null;

export async function initKB(rawTexts: string[]): Promise<void> {
  if (kbInitPromise) {
    await kbInitPromise;
    return;
  }
  kbInitPromise = (async () => {
    const embeddings = await embedBatch(rawTexts);
    kbChunks = rawTexts.map((text, i) => ({ text, embedding: embeddings[i] }));
  })();
  await kbInitPromise;
}

export async function getKBChunks(): Promise<EmbeddedChunk[]> {
  if (kbChunks === null) {
    throw new Error('KB not initialized — call initKB() first');
  }
  return kbChunks;
}

// Per-meeting transcript store
const transcriptStore = new Map<string, EmbeddedChunk[]>();

export function storeTranscriptChunks(
  meetingId: string,
  chunks: EmbeddedChunk[]
): void {
  transcriptStore.set(meetingId, chunks);
}

export function getTranscriptChunks(
  meetingId: string
): EmbeddedChunk[] | undefined {
  return transcriptStore.get(meetingId);
}

export function hasTranscript(meetingId: string): boolean {
  return transcriptStore.has(meetingId);
}

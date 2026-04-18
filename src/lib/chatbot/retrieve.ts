import 'server-only';
import { embed } from './embeddings';
import { initKB, getKBChunks, getTranscriptChunks, topK, EmbeddedChunk } from './vectorStore';
import { knowledgeBase } from './knowledgeBase';

// Lazy-init sentinel — runs once per server process
let kbReady = false;

async function ensureKB(): Promise<void> {
  if (kbReady) return;
  await initKB(knowledgeBase);
  kbReady = true;
}

export async function getRelevantDocs(query: string, meetingId?: string): Promise<string> {
  await ensureKB();

  const queryVector = await embed(query);
  const TOP_K = 5;

  const kbChunks = await getKBChunks();
  const kbResults = topK(queryVector, kbChunks, TOP_K);

  let transcriptResults: EmbeddedChunk[] = [];
  if (meetingId) {
    const txChunks = getTranscriptChunks(meetingId);
    if (txChunks && txChunks.length > 0) {
      transcriptResults = topK(queryVector, txChunks, TOP_K);
    }
  }

  const parts: string[] = [];

  if (kbResults.length > 0) {
    parts.push('Interview coaching knowledge:\n' + kbResults.map(c => c.text).join('\n'));
  }

  if (transcriptResults.length > 0) {
    parts.push(
      'Relevant transcript excerpts from this interview:\n' +
      transcriptResults.map(c => c.speaker ? `${c.speaker}: ${c.text}` : c.text).join('\n')
    );
  }

  return parts.join('\n\n');
}

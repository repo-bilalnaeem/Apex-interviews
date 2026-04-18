import 'server-only';

import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY! });

export async function embed(text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const response = await client.embeddings.create({
    model: 'text-embedding-ada-002',
    input: texts,
  });
  return response.data.map((d) => d.embedding);
}

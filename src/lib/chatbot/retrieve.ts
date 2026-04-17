import { knowledgeBase } from './knowledgeBase';

export function getRelevantDocs(query: string): string {
  // Simple: return docs containing any query word
  const words = query.toLowerCase().split(/\s+/);
  return knowledgeBase.filter(doc =>
    words.some(word => doc.text.toLowerCase().includes(word))
  ).map(doc => doc.text).join('\n');
}

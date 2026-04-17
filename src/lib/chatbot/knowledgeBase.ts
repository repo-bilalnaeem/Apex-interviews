interface Doc {
  id: number;
  text: string;
}

const knowledgeBase: Doc[] = [
  { id: 1, text: "Our interviews are conducted via video call with AI." },
  { id: 2, text: "You can schedule interviews from your dashboard." },
  { id: 3, text: "The AI will ask you technical and behavioral questions." },
  // Add more docs as needed
];

export { knowledgeBase };

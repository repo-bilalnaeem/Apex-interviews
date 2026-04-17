// Remove all the pdfjs-dist imports and replace with API calls

export const getSupportedFileTypes = () => {
  return '.pdf,.doc,.docx,.txt';
};

export const isFileTypeSupported = (file: File) => {
  const supportedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  return supportedTypes.includes(file.type);
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  if (file.type === 'text/plain') {
    // Handle text files directly
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Error reading text file'));
      reader.readAsText(file);
    });
  } else if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    // Use your existing API endpoint for PDF and DOCX files
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload-cv', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (response.ok) {
      return data.extractedText;
    } else {
      throw new Error(data.error || 'Failed to extract text from file');
    }
  } else {
    throw new Error('Unsupported file type');
  }
};
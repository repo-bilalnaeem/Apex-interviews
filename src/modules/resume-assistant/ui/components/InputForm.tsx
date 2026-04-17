import React, { useState, ChangeEvent, FormEvent } from 'react';
import { extractTextFromFile, getSupportedFileTypes, isFileTypeSupported } from '../utils/fileParser';

interface InputFormProps {
  onMatch: (cvs: string[], jd: string, fileNames: string[]) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onMatch }) => {
  const [jdText, setJdText] = useState('');
  const [uploadedCvs, setUploadedCvs] = useState<string[]>(['', '', '', '']);
  const [cvFileNames, setCvFileNames] = useState<string[]>(['', '', '', '']);
  const [isUploading, setIsUploading] = useState<boolean[]>([false, false, false, false]);

  const handleJdChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJdText(e.target.value);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      // Check file type
      if (!isFileTypeSupported(file)) {
        alert('Unsupported file format. Please upload PDF, Word document, or text file.');
        return;
      }

      // Set loading state
      const newIsUploading = [...isUploading];
      newIsUploading[index] = true;
      setIsUploading(newIsUploading);

      try {
        console.log('Starting text extraction for:', file.name);
        
        // Uncomment the next line for PDF debugging
        // if (file.type === 'application/pdf') await testPdfParsing(file);
        
        const text = await extractTextFromFile(file);
        console.log('Text extracted successfully, length:', text.length);
        console.log('Text preview:', text.substring(0, 200));
        
        if (!text || text.trim().length === 0) {
          throw new Error('No text content found in the file. The file might be empty or contain only images.');
        }
        
        const newCvs = [...uploadedCvs];
        const newFileNames = [...cvFileNames];
        newCvs[index] = text;
        newFileNames[index] = file.name;
        setUploadedCvs(newCvs);
        setCvFileNames(newFileNames);
      } catch (error) {
        console.error('Error reading file:', error);
        let errorMessage = 'Error reading file. Please try again.';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        // Add specific suggestions based on file type
        if (file.type === 'application/pdf') {
          errorMessage += '\n\nTips for PDF files:\n• Ensure the PDF contains selectable text (not just images)\n• Try a different PDF or convert to text format\n• Some password-protected PDFs may not work';
        } else if (file.name.toLowerCase().includes('.doc')) {
          errorMessage += '\n\nTips for Word documents:\n• Ensure the document contains text content\n• Try saving as .docx format\n• Check if the file is corrupted';
        }
        
        alert(errorMessage);
      } finally {
        // Reset loading state
        const newIsUploading = [...isUploading];
        newIsUploading[index] = false;
        setIsUploading(newIsUploading);
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validCvs = uploadedCvs.filter(cv => cv.trim() !== '');
    if (validCvs.length === 0) {
      alert('Please upload at least one CV file.');
      return;
    }
    if (!jdText.trim()) {
      alert('Please provide a job description.');
      return;
    }
    onMatch(validCvs, jdText, cvFileNames.filter((_, index) => uploadedCvs[index].trim() !== ''));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
      <div>
        <label className="block font-semibold mb-4">Upload CV Files (PDF, Word, or Text):</label>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id={`cv-${index}`}
                className="hidden"
                accept={getSupportedFileTypes()}
                onChange={(e) => handleFileUpload(e, index)}
                disabled={isUploading[index]}
              />
              <label
                htmlFor={`cv-${index}`}
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  {isUploading[index] ? (
                    <span className="text-blue-600 animate-spin">⏳</span>
                  ) : (
                    <span className="text-blue-600 font-bold">📄</span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {isUploading[index] 
                    ? 'Processing...'
                    : cvFileNames[index] 
                      ? cvFileNames[index] 
                      : `Upload CV ${index + 1}`
                  }
                </span>
                <span className="text-xs text-gray-500">
                  {isUploading[index] 
                    ? 'Please wait'
                    : cvFileNames[index] 
                      ? 'Click to replace' 
                      : 'PDF, Word, or Text'
                  }
                </span>
              </label>
              {uploadedCvs[index] && !isUploading[index] && (
                <div className="mt-2">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    ✓ Uploaded ({uploadedCvs[index].length} chars)
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-2">Job Description:</label>
        <textarea
          className="w-full border rounded p-2 min-h-[80px]"
          value={jdText}
          onChange={handleJdChange}
          placeholder="Paste the job description here..."
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
        disabled={uploadedCvs.every(cv => cv.trim() === '') || !jdText.trim() || isUploading.some(loading => loading)}
      >
        {isUploading.some(loading => loading) 
          ? 'Processing Files...' 
          : `Match Candidates (${uploadedCvs.filter(cv => cv.trim() !== '').length}/4 CVs uploaded)`
        }
      </button>
    </form>
  );
};

export default InputForm;

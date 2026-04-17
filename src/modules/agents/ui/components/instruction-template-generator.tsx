import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, FileText, Upload, X, Check } from "lucide-react";

interface InstructionTemplateGeneratorProps {
  onTemplateGenerated: (instructions: string) => void;
}

const InstructionTemplateGenerator = ({ onTemplateGenerated }: InstructionTemplateGeneratorProps) => {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('');
  const [jobDescriptionFileName, setJobDescriptionFileName] = useState('');

  const generateTemplate = () => {
    // Create a template that incorporates the resume and job description
    const template = `You are an AI interview agent conducting a job interview.

RESUME INFORMATION:
${resume.trim() ? resume : '[No resume provided]'}

JOB DESCRIPTION:
${jobDescription.trim() ? jobDescription : '[No job description provided]'}

INTERVIEW INSTRUCTIONS:
- Ask relevant questions based on the job description and candidate's resume
- Focus on assessing the candidate's skills, experience, and fit for the role
- Be professional and courteous throughout the interview
- Provide constructive feedback when appropriate
- Ask follow-up questions to clarify responses
- Evaluate technical skills mentioned in the resume against job requirements
- Assess soft skills like communication, problem-solving, and teamwork
- End the interview by asking if the candidate has any questions

Please conduct this interview in a professional manner while evaluating the candidate's suitability for the position.`;

    onTemplateGenerated(template);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'jobDescription') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set filename for display
    if (type === 'resume') {
      setResumeFileName(file.name);
    } else {
      setJobDescriptionFileName(file.name);
    }

    // Handle PDF files
    if (file.type === 'application/pdf') {
      setIsParsingPdf(true);
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64 = event.target?.result as string;

          try {
            const response = await fetch('/api/parseResume', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pdfBase64: base64 })
            });

            const data = await response.json();

            if (data.text) {
              if (type === 'resume') {
                setResume(data.text);
              } else {
                setJobDescription(data.text);
              }
              toast.success(`${type === 'resume' ? 'Resume' : 'Job description'} PDF parsed successfully`);
            } else {
              toast.error(data.error || 'Failed to parse PDF');
            }
          } catch (error) {
            console.error('Error parsing PDF:', error);
            toast.error('Failed to parse PDF file');
          } finally {
            setIsParsingPdf(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error reading file:', error);
        toast.error('Failed to read PDF file');
        setIsParsingPdf(false);
      }
    } else {
      // Handle text files
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (type === 'resume') {
          setResume(content);
        } else {
          setJobDescription(content);
        }
        toast.success(`${type === 'resume' ? 'Resume' : 'Job description'} file loaded successfully`);
      };
      reader.readAsText(file);
    }
  };

  const clearContent = (type: 'resume' | 'jobDescription') => {
    if (type === 'resume') {
      setResume('');
      setResumeFileName('');
    } else {
      setJobDescription('');
      setJobDescriptionFileName('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resume Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Resume</Label>
            {resume && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearContent('resume')}
                className="h-6 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {!resume ? (
            <div className="space-y-2">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors">
                <input
                  id="resumeFile"
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, 'resume')}
                  className="hidden"
                  disabled={isParsingPdf}
                />
                <label htmlFor="resumeFile" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="font-medium text-primary">Click to upload</span>
                      <span className="text-muted-foreground"> or drag and drop</span>
                    </div>
                    <p className="text-xs text-muted-foreground">PDF, TXT, DOC, DOCX</p>
                  </div>
                </label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('paste-resume')}
                className="w-full text-xs"
              >
                <FileText className="h-3 w-3 mr-1" />
                Or paste text
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-700 dark:text-green-300 truncate">
                  {resumeFileName || 'Resume loaded'}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {resume.length} characters
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Job Description Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Job Description</Label>
            {jobDescription && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearContent('jobDescription')}
                className="h-6 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {!jobDescription ? (
            <div className="space-y-2">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors">
                <input
                  id="jobDescriptionFile"
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, 'jobDescription')}
                  className="hidden"
                  disabled={isParsingPdf}
                />
                <label htmlFor="jobDescriptionFile" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="font-medium text-primary">Click to upload</span>
                      <span className="text-muted-foreground"> or drag and drop</span>
                    </div>
                    <p className="text-xs text-muted-foreground">PDF, TXT, DOC, DOCX</p>
                  </div>
                </label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('paste-job')}
                className="w-full text-xs"
              >
                <FileText className="h-3 w-3 mr-1" />
                Or paste text
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-700 dark:text-green-300 truncate">
                  {jobDescriptionFileName || 'Job description loaded'}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {jobDescription.length} characters
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isParsingPdf && (
        <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-sm text-blue-700 dark:text-blue-300">Parsing PDF...</span>
        </div>
      )}



      {/* Individual Paste Sections */}
      {activeTab === 'paste-resume' && (
        <div className="space-y-3 border rounded-lg p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Paste Resume</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('upload')}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Close
            </Button>
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Paste your resume content here..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              className="min-h-[150px] text-sm"
            />
            {resume && (
              <p className="text-xs text-muted-foreground">
                {resume.length} characters
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'paste-job' && (
        <div className="space-y-3 border rounded-lg p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Paste Job Description</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('upload')}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Close
            </Button>
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[150px] text-sm"
            />
            {jobDescription && (
              <p className="text-xs text-muted-foreground">
                {jobDescription.length} characters
              </p>
            )}
          </div>
        </div>
      )}

      {/* Combined Paste Modal */}
      {activeTab === 'paste' && (
        <div className="space-y-3 border rounded-lg p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Paste Content</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('upload')}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Close
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resumePaste" className="text-sm">Resume</Label>
              <Textarea
                id="resumePaste"
                placeholder="Paste resume here..."
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className="min-h-[120px]"
              />
              {resume && (
                <p className="text-xs text-muted-foreground">
                  {resume.length} characters
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobDescriptionPaste" className="text-sm">Job Description</Label>
              <Textarea
                id="jobDescriptionPaste"
                placeholder="Paste job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[120px]"
              />
              {jobDescription && (
                <p className="text-xs text-muted-foreground">
                  {jobDescription.length} characters
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <Button
        onClick={generateTemplate}
        className="w-full"
        disabled={(!resume.trim() && !jobDescription.trim()) || isParsingPdf}
      >
        {isParsingPdf ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 mr-2" />
            Generate Instructions
          </>
        )}
      </Button>
    </div>
  );
};

export default InstructionTemplateGenerator;
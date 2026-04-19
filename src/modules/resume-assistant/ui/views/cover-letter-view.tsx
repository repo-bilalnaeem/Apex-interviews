/* eslint-disable */

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileEdit, FileText, Download, Upload, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

const CoverLetterView = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [userCvContent, setUserCvContent] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload only PDF or DOCX files.");
      return;
    }

    setIsExtractingFile(true);
    setUploadedFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload-cv", { method: "POST", body: formData });
      const data = await response.json();
      if (response.ok) {
        setUserCvContent(data.extractedText);
      } else {
        toast.error(data.error || "Failed to extract text from file");
        setUploadedFileName("");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to upload file. Please try again.");
      setUploadedFileName("");
    } finally {
      setIsExtractingFile(false);
    }
  };

  const handleGenerate = async (type: "pdf" | "word") => {
    if (generatedContent) {
      // Already generated — download directly
      if (type === "pdf") {
        await createPDF(generatedContent);
      } else {
        await createWord(generatedContent);
      }
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature: "cover-letter", jobDescription, userCvContent }),
      });
      const data = await res.json();
      const content = data.message || "Generated cover letter content";
      setGeneratedContent(content);
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate document. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const createPDF = async (content: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let yPosition = margin;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(today, pageWidth - margin - doc.getTextWidth(today), yPosition);
    yPosition += 25;

    const paragraphs = content.split("\n\n").filter((p) => p.trim());
    paragraphs.forEach((paragraph, index) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
      }
      const cleanParagraph = paragraph.trim().replace(/\n/g, " ");
      const lines = doc.splitTextToSize(cleanParagraph, maxWidth);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 5 + (index < paragraphs.length - 1 ? 12 : 0);
    });

    doc.save(`cover-letter-${Date.now()}.pdf`);
  };

  const createWord = async (content: string) => {
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const paragraphs = content.split("\n\n").filter((p) => p.trim());

    const wordDoc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: today, size: 22 })],
              alignment: "right",
              spacing: { after: 400 },
            }),
            ...paragraphs.map(
              (paragraph, index) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: paragraph
                        .trim()
                        .replace(/\n/g, " ")
                        .replace(/\*\*(.*?)\*\*/g, "$1")
                        .replace(/\*(.*?)\*/g, "$1")
                        .replace(/[*]/g, "")
                        .trim(),
                      size: 22,
                    }),
                  ],
                  spacing: { after: index < paragraphs.length - 1 ? 240 : 0 },
                  alignment: "left",
                })
            ),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(wordDoc);
    saveAs(blob, `cover-letter-${Date.now()}.docx`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <Card className="border border-[#1E1E1E] bg-[#111111]">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#CAFF02]/10 rounded-lg">
                <FileEdit className="size-5 text-[#CAFF02]" />
              </div>
              <div>
                <CardTitle className="text-xl text-[#F5F5F5]">Cover Letter Generator</CardTitle>
                <CardDescription className="text-[#6B6B6B]">
                  Create professional cover letters tailored to job descriptions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[#CAFF02]/10 rounded-lg">
                    <FileEdit className="size-5 text-[#CAFF02]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#F5F5F5]">Cover Letter Generator</h3>
                    <p className="text-sm text-[#6B6B6B]">AI-powered professional cover letters</p>
                  </div>
                </div>
                <p className="text-sm text-[#9B9B9B]">
                  I&apos;ll analyze the job description and create a compelling cover letter that highlights your
                  relevant skills and experience.
                </p>
              </div>

              <div className="space-y-4">
                {/* CV Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2 text-[#F5F5F5]">
                    <Upload className="size-4" />
                    Your CV (Optional)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 transition-all ${
                      uploadedFileName
                        ? "border-[#CAFF02]/40 bg-[#CAFF02]/5"
                        : "border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#CAFF02]/30"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.docx"
                      className="hidden"
                    />
                    <div className="text-center">
                      {uploadedFileName ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2 text-[#CAFF02]">
                            <CheckCircle className="size-6" />
                          </div>
                          <div>
                            <p className="font-medium text-[#F5F5F5]">{uploadedFileName}</p>
                            <p className="text-sm text-[#CAFF02]">File uploaded successfully</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              fileInputRef.current?.click();
                              setUserCvContent("");
                              setUploadedFileName("");
                            }}
                            className="border-[#2A2A2A] text-[#F5F5F5] hover:bg-[#1A1A1A] hover:text-[#CAFF02]"
                          >
                            Upload Different File
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex justify-center">
                            <Upload className="size-8 text-[#6B6B6B]" />
                          </div>
                          <div>
                            <Button
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isExtractingFile}
                              className="border-[#2A2A2A] text-[#F5F5F5] hover:bg-[#1A1A1A] hover:text-[#CAFF02]"
                            >
                              {isExtractingFile ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-[#CAFF02] border-t-transparent rounded-full animate-spin" />
                                  Extracting...
                                </div>
                              ) : (
                                "Choose CV File"
                              )}
                            </Button>
                            <p className="text-xs text-[#6B6B6B] mt-2">PDF or DOCX files only</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2 text-[#F5F5F5]">
                    <FileText className="size-4" />
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here, including requirements, responsibilities, and company information..."
                    className="w-full h-40 p-4 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F5] placeholder:text-[#6B6B6B] rounded-xl resize-none text-sm focus:ring-2 focus:ring-[#CAFF02] focus:border-transparent transition-all outline-none"
                  />
                  <p className="text-xs text-[#6B6B6B] mt-2">
                    Include all job requirements for the best results
                  </p>
                </div>
              </div>

              {/* Preview pane */}
              {generatedContent && (
                <div className="space-y-2">
                  <div className="max-h-64 overflow-y-auto bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-sm text-[#F5F5F5] whitespace-pre-wrap">
                    {generatedContent}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setGeneratedContent(null)}
                      className="text-xs text-[#6B6B6B] hover:text-[#CAFF02] transition-colors"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleGenerate("pdf")}
                  disabled={!jobDescription.trim() || isProcessing}
                  className="bg-[#CAFF02] text-[#0A0A0A] hover:bg-[#B8E602] h-12 font-semibold disabled:opacity-40"
                >
                  <div className="flex items-center gap-2">
                    <Download className="size-4" />
                    {isProcessing
                      ? "Generating..."
                      : generatedContent
                      ? "Download PDF"
                      : "Generate + Download PDF"}
                  </div>
                </Button>
                <Button
                  onClick={() => handleGenerate("word")}
                  variant="outline"
                  disabled={!jobDescription.trim() || isProcessing}
                  className="border-[#2A2A2A] text-[#F5F5F5] hover:bg-[#1A1A1A] hover:text-[#CAFF02] h-12 disabled:opacity-40"
                >
                  <div className="flex items-center gap-2">
                    <Download className="size-4" />
                    {isProcessing
                      ? "Generating..."
                      : generatedContent
                      ? "Download Word"
                      : "Generate + Download Word"}
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoverLetterView;

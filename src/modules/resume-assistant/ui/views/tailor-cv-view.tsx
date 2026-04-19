/* eslint-disable */

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle, Download, Target } from "lucide-react";
import { toast } from "sonner";

import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

const STOPWORDS = new Set([
  "the","and","for","with","that","this","are","have","will","from","they","been",
  "has","but","not","you","all","can","her","was","one","our","out","who","get",
  "use","more","also","into","than","then","when","what","your","their","which",
  "would","could","should","about","after","before","these","those","other","such",
  "some","each","both","been","being","were","very","just","like","over","even",
  "only","most","well","made","make","any","how","its","may","two","new","own",
  "same","while","see","way","per","few","end","use","using","used","users","work",
  "works","working","worked","team","years","year",
]);

function computeAtsScore(jobDescription: string, cvContent: string): number {
  const jdTokens = new Set(
    (jobDescription.toLowerCase().match(/\b[a-z]{3,}\b/g) ?? []).filter(
      (t) => !STOPWORDS.has(t)
    )
  );
  const cvTokens = cvContent.toLowerCase().match(/\b[a-z]{3,}\b/g) ?? [];
  const cvSet = new Set(cvTokens.filter((t) => !STOPWORDS.has(t)));

  let matches = 0;
  jdTokens.forEach((token) => {
    if (cvSet.has(token)) matches++;
  });

  const score = Math.round((matches / Math.max(jdTokens.size, 1)) * 100);
  return Math.min(100, Math.max(0, score));
}

const TailorCvView = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [userCvContent, setUserCvContent] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);

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

  const removeAIAdviceParagraphs = (content: string): string => {
    const lines = content.split("\n");
    const filteredLines: string[] = [];

    const aiAdvicePatterns = [
      /^This\s+(revised|updated|tailored|optimized)\s+CV/i,
      /^This\s+CV\s+(has\s+been|is\s+now|directly)/i,
      /^The\s+(revised|updated|tailored|optimized)\s+(CV|resume)/i,
      /^By\s+(incorporating|including|highlighting|emphasizing)/i,
      /^This\s+(format|approach|structure)\s+(ensures|helps|allows)/i,
      /^Remember\s+to/i,
      /^Please\s+(note|remember|ensure)/i,
      /^I\s+hope\s+this\s+(helps|CV|resume)/i,
      /^Good\s+luck\s+with/i,
      /^Feel\s+free\s+to/i,
      /^Let\s+me\s+know\s+if/i,
      /^If\s+you\s+(need|would\s+like|have)/i,
      /directly\s+addresses\s+the\s+job\s+description/i,
      /matches\s+the\s+requirements/i,
      /should\s+significantly\s+improve/i,
      /increases\s+your\s+chances/i,
      /This\s+approach\s+will\s+help/i,
      /The\s+key\s+is\s+to/i,
      /Make\s+sure\s+to/i,
      /Don't\s+forget\s+to/i,
      /Consider\s+adding/i,
      /You\s+may\s+also\s+want\s+to/i,
      /Additionally,\s+you\s+could/i,
      /For\s+best\s+results/i,
      /This\s+will\s+ensure/i,
      /Keep\s+in\s+mind/i,
      /It's\s+important\s+to/i,
      /Be\s+sure\s+to/i,
      /Finally,/i,
      /In\s+conclusion/i,
      /To\s+summarize/i,
      /Overall,\s+this/i,
      /This\s+strategy\s+will/i,
      /Here\s+are\s+some\s+tips/i,
      /Additional\s+suggestions/i,
      /Pro\s+tip/i,
      /Best\s+of\s+luck/i,
    ];

    let inAdviceSection = false;

    for (const line of lines) {
      const trimmed = line.trim();
      const isAdviceLine = aiAdvicePatterns.some((p) => p.test(trimmed));

      if (isAdviceLine) {
        inAdviceSection = true;
        continue;
      }

      if (inAdviceSection) {
        const isLegitimateContent =
          trimmed.match(/^[A-Z\s]{3,}:?\s*$/i) ||
          trimmed.includes("@") ||
          trimmed.match(/^\d{3}/) ||
          trimmed.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+/) ||
          trimmed.match(/^\w+\s+\d{4}\s*-/) ||
          trimmed.match(/^•\s*\w/) ||
          trimmed.match(/^\d+/) ||
          (trimmed.length > 50 &&
            !trimmed.includes("CV") &&
            !trimmed.includes("resume") &&
            !trimmed.includes("job description"));

        if (isLegitimateContent) {
          inAdviceSection = false;
          filteredLines.push(trimmed);
        }
        continue;
      }

      filteredLines.push(trimmed);
    }

    return filteredLines.join("\n").trim();
  };

  const parseResumeContent = (content: string) => {
    const sections: any = {};

    try {
      let cleanedContent = content
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/^\s*-{3,}\s*$/gm, "")
        .replace(/^\s*={3,}\s*$/gm, "")
        .replace(/^\s*_{3,}\s*$/gm, "")
        .replace(/#+\s*/g, "")
        .replace(/^\s*[\-\*\+]\s*$/gm, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      const lines = cleanedContent
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const sectionHeaders: Record<string, string[]> = {
        header: ["name", "contact", "contact information", "personal details"],
        summary: ["professional summary", "summary", "profile", "objective", "about", "overview"],
        experience: [
          "professional experience",
          "work experience",
          "experience",
          "employment",
          "career history",
          "work history",
        ],
        education: [
          "education",
          "educational background",
          "academic background",
          "qualifications",
          "academic qualifications",
        ],
        skills: [
          "skills",
          "technical skills",
          "core competencies",
          "competencies",
          "key skills",
          "abilities",
          "technologies",
        ],
      };

      let currentSection = "";
      let currentContent: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineLower = line.toLowerCase();

        let foundSection = "";
        for (const [sectionKey, headers] of Object.entries(sectionHeaders)) {
          if (
            headers.some(
              (header) =>
                lineLower === header ||
                lineLower.startsWith(header + ":") ||
                (lineLower.includes(header) && line.length < 50)
            )
          ) {
            foundSection = sectionKey;
            break;
          }
        }

        if (foundSection) {
          if (currentSection && currentContent.length > 0) {
            sections[currentSection] = currentContent.join("\n").trim();
          }
          currentSection = foundSection;
          currentContent = [];
          if (line.includes(":")) {
            const afterColon = line.split(":").slice(1).join(":").trim();
            if (afterColon) currentContent.push(afterColon);
          }
        } else if (currentSection) {
          currentContent.push(line);
        } else {
          if (
            !sections.header &&
            (lineLower.includes("email") ||
              lineLower.includes("phone") ||
              lineLower.includes("@") ||
              i === 0)
          ) {
            if (!sections.header) sections.header = {};
            if (i === 0 && !lineLower.includes("@") && !lineLower.includes("phone")) {
              sections.header.name = line;
            } else {
              sections.header.contact = (sections.header.contact || "") + "\n" + line;
            }
          } else if (!sections.summary) {
            sections.summary = line;
          } else {
            sections.summary += "\n" + line;
          }
        }
      }

      if (currentSection && currentContent.length > 0) {
        sections[currentSection] = currentContent.join("\n").trim();
      }

      if (Object.keys(sections).length === 0 || (!sections.experience && !sections.summary)) {
        const paragraphs = content.split("\n\n").filter((p) => p.trim());
        if (paragraphs.length > 0) {
          const firstPara = paragraphs[0];
          if (firstPara.includes("@") || firstPara.includes("phone") || firstPara.includes("email")) {
            const nameMatch = firstPara.match(/^([^\n@]+)(?=\n|@)/);
            sections.header = { name: nameMatch ? nameMatch[1].trim() : "Resume", contact: firstPara };
          } else {
            sections.header = { name: firstPara.split("\n")[0], contact: "" };
            if (!sections.summary && paragraphs.length > 1) sections.summary = firstPara;
          }
          paragraphs.slice(1).forEach((para) => {
            const paraLower = para.toLowerCase();
            if (paraLower.includes("experience") || paraLower.includes("worked") || paraLower.includes("position")) {
              sections.experience = (sections.experience || "") + "\n\n" + para;
            } else if (paraLower.includes("education") || paraLower.includes("degree") || paraLower.includes("university")) {
              sections.education = (sections.education || "") + "\n\n" + para;
            } else if (paraLower.includes("skills") || paraLower.includes("technologies") || paraLower.includes("programming")) {
              sections.skills = (sections.skills || "") + "\n\n" + para;
            } else if (!sections.summary) {
              sections.summary = para;
            } else if (!sections.experience) {
              sections.experience = para;
            } else {
              sections.experience += "\n\n" + para;
            }
          });
        }
      }

      if (!sections.header) sections.header = { name: "Resume", contact: "" };
      if (!sections.summary && !sections.experience) sections.summary = content.substring(0, 500) + "...";

      Object.keys(sections).forEach((key) => {
        if (typeof sections[key] === "string") {
          sections[key] = sections[key]
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/\*(.*?)\*/g, "$1")
            .replace(/^\s*-{2,}\s*$/gm, "")
            .replace(/^\s*={2,}\s*$/gm, "")
            .replace(/^\s*_{2,}\s*$/gm, "")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
        } else if (typeof sections[key] === "object" && sections[key] !== null) {
          Object.keys(sections[key]).forEach((prop) => {
            if (typeof sections[key][prop] === "string") {
              sections[key][prop] = sections[key][prop]
                .replace(/\*\*(.*?)\*\*/g, "$1")
                .replace(/\*(.*?)\*/g, "$1")
                .replace(/^\s*-{2,}\s*$/gm, "")
                .replace(/^\s*={2,}\s*$/gm, "")
                .replace(/^\s*_{2,}\s*$/gm, "")
                .trim();
            }
          });
        }
      });
    } catch (error) {
      console.error("Error parsing resume content:", error);
      sections.header = { name: "Resume", contact: "" };
      sections.summary = content.substring(0, 1000);
      if (content.length > 1000) sections.experience = content.substring(1000);
    }

    return sections;
  };

  const addSectionToPDF = (
    doc: any,
    title: string,
    content: string,
    yPosition: number,
    margin: number,
    maxWidth: number,
    pageHeight: number
  ) => {
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(46, 89, 132);
    doc.text(title, margin, yPosition);
    yPosition += 5;

    doc.setDrawColor(46, 89, 132);
    doc.setLineWidth(0.3);
    doc.line(margin, yPosition, margin + doc.getTextWidth(title), yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const cleanContent = content
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/^\s*-{2,}\s*$/gm, "")
      .replace(/^\s*={2,}\s*$/gm, "")
      .replace(/^\s*_{2,}\s*$/gm, "");

    const contentParts = cleanContent
      .split("\n")
      .filter((part) => part.trim() && !part.match(/^[-=_]{2,}$/));

    contentParts.forEach((part) => {
      if (yPosition > pageHeight - 25) {
        doc.addPage();
        yPosition = margin;
      }
      const trimmed = part.trim();
      if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const bulletText = trimmed.substring(1).trim();
        if (bulletText) {
          const lines = doc.splitTextToSize(`• ${bulletText}`, maxWidth - 10);
          doc.text(lines, margin + 5, yPosition);
          yPosition += lines.length * 4.5 + 2;
        }
      } else if (trimmed.length > 0) {
        const lines = doc.splitTextToSize(trimmed, maxWidth);
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 4.5 + (trimmed.length > 100 ? 6 : 3);
      }
    });

    return yPosition + 12;
  };

  const createPDF = async (content: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let yPosition = margin;

    const sections = parseResumeContent(content);

    if (sections.header) {
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(46, 89, 132);
      const name =
        (typeof sections.header === "string"
          ? sections.header.split("\n")[0]
          : sections.header.name) || "Resume";
      const nameLines = doc.splitTextToSize(name, maxWidth);
      doc.text(nameLines, margin, yPosition);
      yPosition += nameLines.length * 8 + 3;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(102, 102, 102);
      const contactInfo =
        typeof sections.header === "string"
          ? sections.header.split("\n").slice(1).join(" | ")
          : sections.header.contact || "";
      if (contactInfo) {
        const contactLines = doc.splitTextToSize(contactInfo, maxWidth);
        doc.text(contactLines, margin, yPosition);
        yPosition += contactLines.length * 5 + 15;
      } else {
        yPosition += 10;
      }

      doc.setDrawColor(46, 89, 132);
      doc.setLineWidth(1);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;
    }

    const sectionOrder = [
      { key: "summary", title: "SUMMARY" },
      { key: "experience", title: "EXPERIENCE" },
      { key: "skills", title: "CORE COMPETENCIES" },
      { key: "education", title: "EDUCATION" },
    ];

    sectionOrder.forEach(({ key, title }) => {
      if (sections[key]) {
        yPosition = addSectionToPDF(doc, title, sections[key], yPosition, margin, maxWidth, pageHeight);
      }
    });

    Object.keys(sections).forEach((key) => {
      if (!["header", "summary", "experience", "education", "skills"].includes(key) && sections[key]) {
        const title = key.toUpperCase().replace(/([A-Z])/g, " $1").trim();
        yPosition = addSectionToPDF(doc, title, sections[key], yPosition, margin, maxWidth, pageHeight);
      }
    });

    doc.save(`tailored-resume-${Date.now()}.pdf`);
  };

  const createWord = async (content: string) => {
    const sections = parseResumeContent(content);

    const wordDoc = new Document({
      styles: {
        paragraphStyles: [
          {
            id: "nameStyle",
            name: "Name Style",
            basedOn: "Normal",
            run: { size: 36, bold: true, color: "2E5984" },
            paragraph: { spacing: { after: 120 } },
          },
          {
            id: "sectionHeading",
            name: "Section Heading",
            basedOn: "Normal",
            run: { size: 24, bold: true, color: "2E5984" },
            paragraph: { spacing: { before: 300, after: 150 } },
          },
        ],
      },
      sections: [
        {
          children: [
            ...(sections.header
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: (typeof sections.header === "string"
                          ? sections.header.split("\n")[0]
                          : sections.header.name || "Resume"
                        )
                          .replace(/\*\*(.*?)\*\*/g, "$1")
                          .replace(/\*(.*?)\*/g, "$1")
                          .replace(/[*]/g, "")
                          .trim(),
                        bold: true,
                        size: 36,
                        color: "2E5984",
                      }),
                    ],
                    spacing: { after: 120 },
                  }),
                  ...(() => {
                    const contactInfo = (
                      typeof sections.header === "string"
                        ? sections.header.split("\n").slice(1).join(" | ")
                        : sections.header.contact || ""
                    )
                      .replace(/\*\*(.*?)\*\*/g, "$1")
                      .replace(/\*(.*?)\*/g, "$1")
                      .replace(/[*]/g, "")
                      .trim();
                    return contactInfo
                      ? [
                          new Paragraph({
                            children: [new TextRun({ text: contactInfo, size: 20, color: "666666" })],
                            spacing: { after: 400 },
                          }),
                        ]
                      : [];
                  })(),
                ]
              : []),

            ...(sections.summary
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: "SUMMARY", bold: true, size: 24, color: "2E5984" })],
                    spacing: { before: 300, after: 150 },
                  }),
                  ...sections.summary
                    .split("\n")
                    .filter((line: string) => line.trim() && !line.match(/^[-=_*]{2,}$/))
                    .map((line: string) => {
                      const cleanLine = line
                        .trim()
                        .replace(/\*\*(.*?)\*\*/g, "$1")
                        .replace(/\*(.*?)\*/g, "$1")
                        .replace(/[*]/g, "")
                        .replace(/^\s*[-•]\s*/, "")
                        .trim();
                      return cleanLine
                        ? new Paragraph({
                            children: [new TextRun({ text: cleanLine, size: 22 })],
                            spacing: { after: 100 },
                          })
                        : null;
                    })
                    .filter((p: any) => p !== null),
                ]
              : []),

            ...(sections.experience
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: "EXPERIENCE", bold: true, size: 24, color: "2E5984" })],
                    spacing: { before: 300, after: 150 },
                  }),
                  ...sections.experience
                    .split("\n")
                    .filter((line: string) => line.trim() && !line.match(/^[-=_*]{2,}$/))
                    .map((line: string) => {
                      const cleanLine = line
                        .trim()
                        .replace(/\*\*(.*?)\*\*/g, "$1")
                        .replace(/\*(.*?)\*/g, "$1")
                        .replace(/[*]/g, "")
                        .trim();
                      if (cleanLine.startsWith("•") || cleanLine.startsWith("-")) {
                        const bulletText = cleanLine.substring(1).trim();
                        return bulletText
                          ? new Paragraph({
                              children: [new TextRun({ text: `• ${bulletText}`, size: 22 })],
                              spacing: { after: 80 },
                              indent: { left: 360 },
                            })
                          : null;
                      } else if (cleanLine) {
                        return new Paragraph({
                          children: [new TextRun({ text: cleanLine, size: 22, bold: cleanLine.length < 100 })],
                          spacing: { after: cleanLine.length < 100 ? 120 : 100 },
                        });
                      }
                      return null;
                    })
                    .filter((p: any) => p !== null),
                ]
              : []),

            ...(sections.skills
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: "CORE COMPETENCIES", bold: true, size: 24, color: "2E5984" })],
                    spacing: { before: 300, after: 150 },
                  }),
                  ...sections.skills
                    .split("\n")
                    .filter((line: string) => line.trim() && !line.match(/^[-=_*]{2,}$/))
                    .map((line: string) => {
                      const cleanLine = line
                        .trim()
                        .replace(/\*\*(.*?)\*\*/g, "$1")
                        .replace(/\*(.*?)\*/g, "$1")
                        .replace(/[*]/g, "")
                        .replace(/^\s*[-•]\s*/, "")
                        .trim();
                      return cleanLine
                        ? new Paragraph({
                            children: [
                              new TextRun({
                                text: cleanLine.startsWith("•") ? cleanLine : `• ${cleanLine}`,
                                size: 22,
                              }),
                            ],
                            spacing: { after: 80 },
                            indent: { left: 360 },
                          })
                        : null;
                    })
                    .filter((p: any) => p !== null),
                ]
              : []),

            ...(sections.education
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: "EDUCATION", bold: true, size: 24, color: "2E5984" })],
                    spacing: { before: 300, after: 150 },
                  }),
                  ...sections.education
                    .split("\n")
                    .filter((line: string) => line.trim() && !line.match(/^[-=_*]{2,}$/))
                    .map((line: string) => {
                      const cleanLine = line
                        .trim()
                        .replace(/\*\*(.*?)\*\*/g, "$1")
                        .replace(/\*(.*?)\*/g, "$1")
                        .replace(/[*]/g, "")
                        .replace(/^\s*[-•]\s*/, "")
                        .trim();
                      return cleanLine
                        ? new Paragraph({
                            children: [new TextRun({ text: cleanLine, size: 22 })],
                            spacing: { after: 100 },
                          })
                        : null;
                    })
                    .filter((p: any) => p !== null),
                ]
              : []),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(wordDoc);
    saveAs(blob, `tailored-resume-${Date.now()}.docx`);
  };

  const handleDownload = async (type: "pdf" | "word") => {
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
        body: JSON.stringify({ feature: "cv", jobDescription, userCvContent }),
      });
      const data = await res.json();
      const content = removeAIAdviceParagraphs(data.message || "Generated CV content");
      setGeneratedContent(content);
      setAtsScore(computeAtsScore(jobDescription, content));
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to generate document. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <Card className="border border-[#1E1E1E] bg-[#111111]">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#CAFF02]/10 rounded-lg">
                <Target className="size-5 text-[#CAFF02]" />
              </div>
              <div>
                <CardTitle className="text-xl text-[#F5F5F5]">CV Tailoring</CardTitle>
                <CardDescription className="text-[#6B6B6B]">
                  Optimize your resume for specific job opportunities
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[#CAFF02]/10 rounded-lg">
                    <Target className="size-5 text-[#CAFF02]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#F5F5F5]">CV Tailoring</h3>
                    <p className="text-sm text-[#6B6B6B]">Smart resume optimization for any job</p>
                  </div>
                </div>
                <p className="text-sm text-[#9B9B9B]">
                  Upload your CV and job description. I&apos;ll analyze both and create a perfectly tailored
                  resume that matches the job requirements.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-[#F5F5F5]">
                    <Upload className="size-4" />
                    Your Current CV
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

                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-[#F5F5F5]">
                    <FileText className="size-4" />
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here, including requirements, skills, and responsibilities..."
                    className="w-full h-40 p-4 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F5] placeholder:text-[#6B6B6B] rounded-xl resize-none text-sm focus:ring-2 focus:ring-[#CAFF02] focus:border-transparent transition-all outline-none"
                  />
                  <p className="text-xs text-[#6B6B6B]">
                    Include all job requirements and preferred qualifications
                  </p>
                </div>
              </div>

              {/* ATS Score Badge */}
              {atsScore !== null && (
                <div className="flex items-center gap-3 p-4 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      atsScore >= 70
                        ? "bg-[#CAFF02]/20 text-[#CAFF02]"
                        : atsScore >= 40
                        ? "bg-[#FBBF24]/20 text-[#FBBF24]"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {atsScore}% ATS Match
                  </div>
                  <p className="text-xs text-[#6B6B6B]">
                    {atsScore >= 70
                      ? "Strong keyword alignment with job description"
                      : atsScore >= 40
                      ? "Moderate alignment — consider adding more keywords"
                      : "Low alignment — review job requirements carefully"}
                  </p>
                </div>
              )}

              {/* Preview pane */}
              {generatedContent && (
                <div className="space-y-2">
                  <div className="max-h-64 overflow-y-auto bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-sm text-[#F5F5F5] whitespace-pre-wrap">
                    {generatedContent}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setGeneratedContent(null);
                        setAtsScore(null);
                      }}
                      className="text-xs text-[#6B6B6B] hover:text-[#CAFF02] transition-colors"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleDownload("pdf")}
                  disabled={!jobDescription.trim() || !userCvContent.trim() || isProcessing}
                  className="bg-[#CAFF02] text-[#0A0A0A] hover:bg-[#B8E602] h-12 font-semibold disabled:opacity-40"
                >
                  <div className="flex items-center gap-2">
                    <Download className="size-4" />
                    {isProcessing
                      ? "Generating..."
                      : generatedContent
                      ? "Download Tailored CV (PDF)"
                      : "Generate + Download Tailored CV (PDF)"}
                  </div>
                </Button>
                <Button
                  onClick={() => handleDownload("word")}
                  variant="outline"
                  disabled={!jobDescription.trim() || !userCvContent.trim() || isProcessing}
                  className="border-[#2A2A2A] text-[#F5F5F5] hover:bg-[#1A1A1A] hover:text-[#CAFF02] h-12 disabled:opacity-40"
                >
                  <div className="flex items-center gap-2">
                    <Download className="size-4" />
                    {isProcessing
                      ? "Generating..."
                      : generatedContent
                      ? "Download Tailored CV (Word)"
                      : "Generate + Download Tailored CV (Word)"}
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

export default TailorCvView;

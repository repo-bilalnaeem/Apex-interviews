/* eslint-disable */

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  MessageCircle,
  FileEdit,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Download,
  Bot,
  Zap,
  Target
} from "lucide-react";



import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";



const ResumeAssistantView = () => {
  // states for chatbot features
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: 'user' | 'bot', content: string, timestamp: Date}>>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<'chat' | 'offer-letter' | 'cv-tailoring' | 'cover-letter' | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [userCvContent, setUserCvContent] = useState(""); 
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);



  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsProcessing(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage]
        })
      });

      const data = await res.json();
      const botMessage = {
        id: Date.now().toString(),
        type: 'bot' as const,
        content: data.message || "Something went wrong.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only PDF or DOCX files.');
      return;
    }

    setIsExtractingFile(true);
    setUploadedFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUserCvContent(data.extractedText);
      } else {
        alert(data.error || 'Failed to extract text from file');
        setUploadedFileName("");
      }
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload file. Please try again.');
      setUploadedFileName("");
    } finally {
      setIsExtractingFile(false);
    }
  };
  
  // Function to remove AI-generated advice paragraphs from the end of content
  const removeAIAdviceParagraphs = (content: string): string => {
    const lines = content.split('\n');
    const filteredLines: string[] = [];
    
    // AI advice patterns to detect and remove
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
      /Best\s+of\s+luck/i
    ];
    
    let inAdviceSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if this line starts an AI advice paragraph
      const isAdviceLine = aiAdvicePatterns.some(pattern => pattern.test(line));
      
      if (isAdviceLine) {
        inAdviceSection = true;
        continue; // Skip this line
      }
      
      // If we're in an advice section, continue skipping lines until we hit proper CV content
      if (inAdviceSection) {
        // Check if this looks like legitimate CV content (section headers, contact info, etc.)
        const isLegitimateContent = (
          line.match(/^[A-Z\s]{3,}:?\s*$/i) || // Section headers like "EXPERIENCE:" or "EDUCATION"
          line.includes('@') || // Email addresses
          line.match(/^\d{3}/) || // Phone numbers
          line.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+/) || // Names
          line.match(/^\w+\s+\d{4}\s*-/) || // Dates like "Jan 2020 -"
          line.match(/^•\s*\w/) || // Bullet points with content
          line.match(/^\d+/) || // Years or numbers
          (line.length > 50 && !line.includes('CV') && !line.includes('resume') && !line.includes('job description'))
        );
        
        if (isLegitimateContent) {
          inAdviceSection = false;
          filteredLines.push(line);
        }
        continue;
      }
      
      // Add the line if we're not in an advice section
      filteredLines.push(line);
    }
    
    return filteredLines.join('\n').trim();
  };

  const handleDownload = async (type: 'pdf' | 'word', content: 'cover-letter' | 'cv') => {
    setIsProcessing(true);
    
    try {
      // Generate content using Gemini
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: content,
          jobDescription: jobDescription,
          userCvContent: content === 'cv' ? userCvContent : undefined
        })
      });

      const data = await res.json();
      let generatedContent = data.message || `Generated ${content} content`;

      // For CV content, remove AI advice paragraphs
      if (content === 'cv') {
        generatedContent = removeAIAdviceParagraphs(generatedContent);
      }

      // Create and download the file
      if (type === "pdf") {
        await createProfessionalPDF(generatedContent, content);
      } else {
        await createProfessionalWord(generatedContent, content);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to generate document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const createProfessionalPDF = async (content: string, docType: 'cover-letter' | 'cv') => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    if (docType === 'cv') {
      // Parse the AI-generated content
      const sections = parseResumeContent(content);

      // Header section with name and contact info
      if (sections.header) {
        // Name - larger and bold
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(46, 89, 132); // Professional blue
        const name = (typeof sections.header === 'string' ? sections.header.split('\n')[0] : sections.header.name) || 'Resume';
        const nameLines = doc.splitTextToSize(name, maxWidth);
        doc.text(nameLines, margin, yPosition);
        yPosition += nameLines.length * 8 + 3;

        // Contact information
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(102, 102, 102); // Gray
        const contactInfo = typeof sections.header === 'string' 
          ? sections.header.split('\n').slice(1).join(' | ')
          : sections.header.contact || '';
        if (contactInfo) {
          const contactLines = doc.splitTextToSize(contactInfo, maxWidth);
          doc.text(contactLines, margin, yPosition);
          yPosition += contactLines.length * 5 + 15;
        } else {
          yPosition += 10;
        }

        // Separator line
        doc.setDrawColor(46, 89, 132);
        doc.setLineWidth(1);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 15;
      }

      // Add sections in professional order
      const sectionOrder = [
        { key: 'summary', title: 'SUMMARY' },
        { key: 'experience', title: 'EXPERIENCE' },
        { key: 'skills', title: 'CORE COMPETENCIES' },
        { key: 'education', title: 'EDUCATION' }
      ];

      sectionOrder.forEach(({ key, title }) => {
        if (sections[key]) {
          yPosition = addProfessionalSectionToPDF(doc, title, sections[key], yPosition, margin, maxWidth, pageHeight);
        }
      });

      // Add any remaining sections
      Object.keys(sections).forEach(key => {
        if (!['header', 'summary', 'experience', 'education', 'skills'].includes(key) && sections[key]) {
          const title = key.toUpperCase().replace(/([A-Z])/g, ' $1').trim();
          yPosition = addProfessionalSectionToPDF(doc, title, sections[key], yPosition, margin, maxWidth, pageHeight);
        }
      });

    } else {
      // Cover letter formatting
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      // Date (right aligned)
      const today = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.text(today, pageWidth - margin - doc.getTextWidth(today), yPosition);
      yPosition += 25;

      // Cover letter content with proper paragraph spacing
      const paragraphs = content.split('\n\n').filter(p => p.trim());
      paragraphs.forEach((paragraph, index) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
        }

        const cleanParagraph = paragraph.trim().replace(/\n/g, ' ');
        const lines = doc.splitTextToSize(cleanParagraph, maxWidth);
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 5 + (index < paragraphs.length - 1 ? 12 : 0);
      });
    }

    doc.save(`${docType === 'cv' ? 'tailored-resume' : 'cover-letter'}-${Date.now()}.pdf`);
  };

  const addProfessionalSectionToPDF = (doc: any, title: string, content: string, yPosition: number, margin: number, maxWidth: number, pageHeight: number) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = margin;
    }

    // Section title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(46, 89, 132); // Professional blue
    doc.text(title, margin, yPosition);
    yPosition += 5; // Reduced spacing before underline

    // Underline - thinner and closer
    doc.setDrawColor(46, 89, 132);
    doc.setLineWidth(0.3); // Much thinner line
    doc.line(margin, yPosition, margin + doc.getTextWidth(title), yPosition);
    yPosition += 8; // Reduced spacing after underline

    // Section content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    // Clean and split content into bullet points or paragraphs
    const cleanContent = content
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
      .replace(/\*(.*?)\*/g, '$1') // Remove *italic*
      .replace(/^\s*-{2,}\s*$/gm, '') // Remove lines with only dashes
      .replace(/^\s*={2,}\s*$/gm, '') // Remove lines with only equals
      .replace(/^\s*_{2,}\s*$/gm, ''); // Remove lines with only underscores
    
    const contentParts = cleanContent.split('\n').filter(part => part.trim() && !part.match(/^[-=_]{2,}$/));
    
    contentParts.forEach((part, index) => {
      if (yPosition > pageHeight - 25) {
        doc.addPage();
        yPosition = margin;
      }

      const trimmedPart = part.trim();
      if (trimmedPart.startsWith('•') || trimmedPart.startsWith('-') || trimmedPart.startsWith('*')) {
        // Handle bullet points
        const bulletText = trimmedPart.substring(1).trim();
        if (bulletText) { // Only add if there's actual content
          const lines = doc.splitTextToSize(`• ${bulletText}`, maxWidth - 10);
          doc.text(lines, margin + 5, yPosition);
          yPosition += lines.length * 4.5 + 2;
        }
      } else if (trimmedPart.length > 0) {
        // Handle regular paragraphs
        const lines = doc.splitTextToSize(trimmedPart, maxWidth);
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 4.5 + (trimmedPart.length > 100 ? 6 : 3);
      }
    });

    return yPosition + 12; // Reduced bottom spacing
  };


  const parseResumeContent = (content: string) => {
    const sections: any = {};

    try {
      // Clean up markdown formatting and unwanted characters
      let cleanedContent = content
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold** formatting
        .replace(/\*(.*?)\*/g, '$1') // Remove *italic* formatting
        .replace(/^\s*-{3,}\s*$/gm, '') // Remove lines with only dashes (---)
        .replace(/^\s*={3,}\s*$/gm, '') // Remove lines with only equals (===)
        .replace(/^\s*_{3,}\s*$/gm, '') // Remove lines with only underscores (___)
        .replace(/#+\s*/g, '') // Remove markdown headers (#, ##, ###)
        .replace(/^\s*[\-\*\+]\s*$/gm, '') // Remove empty bullet points
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
        .trim();

      // Split content into lines for easier parsing
      const lines = cleanedContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      // Define section headers to look for (more comprehensive)
      const sectionHeaders = {
        header: ['name', 'contact', 'contact information', 'personal details'],
        summary: ['professional summary', 'summary', 'profile', 'objective', 'about', 'overview'],
        experience: ['professional experience', 'work experience', 'experience', 'employment', 'career history', 'work history'],
        education: ['education', 'educational background', 'academic background', 'qualifications', 'academic qualifications'],
        skills: ['skills', 'technical skills', 'core competencies', 'competencies', 'key skills', 'abilities', 'technologies']
      };

      let currentSection = '';
      let currentContent: string[] = [];
      
      // First, try to find structured sections with headers
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineLower = line.toLowerCase();
        
        // Check if this line is a section header
        let foundSection = '';
        for (const [sectionKey, headers] of Object.entries(sectionHeaders)) {
          if (headers.some(header => 
            lineLower === header || 
            lineLower.startsWith(header + ':') ||
            lineLower.includes(header) && line.length < 50
          )) {
            foundSection = sectionKey;
            break;
          }
        }

        if (foundSection) {
          // Save previous section if it exists
          if (currentSection && currentContent.length > 0) {
            sections[currentSection] = currentContent.join('\n').trim();
          }
          
          // Start new section
          currentSection = foundSection;
          currentContent = [];
          
          // If the header line contains content, include it
          if (line.includes(':')) {
            const afterColon = line.split(':').slice(1).join(':').trim();
            if (afterColon) {
              currentContent.push(afterColon);
            }
          }
        } else if (currentSection) {
          // Add content to current section
          currentContent.push(line);
        } else {
          // No section identified yet, treat as header or summary
          if (!sections.header && (
            lineLower.includes('email') || 
            lineLower.includes('phone') || 
            lineLower.includes('@') ||
            i === 0 // First line often contains name
          )) {
            if (!sections.header) sections.header = {};
            if (i === 0 && !lineLower.includes('@') && !lineLower.includes('phone')) {
              sections.header.name = line;
            } else {
              sections.header.contact = (sections.header.contact || '') + '\n' + line;
            }
          } else if (!sections.summary) {
            sections.summary = line;
          } else {
            sections.summary += '\n' + line;
          }
        }
      }

      // Save the last section
      if (currentSection && currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n').trim();
      }

      // If we still don't have structured content, try paragraph-based parsing
      if (Object.keys(sections).length === 0 || (!sections.experience && !sections.summary)) {
        const paragraphs = content.split('\n\n').filter(p => p.trim());
        
        if (paragraphs.length > 0) {
          // First paragraph with name/contact info
          const firstPara = paragraphs[0];
          if (firstPara.includes('@') || firstPara.includes('phone') || firstPara.includes('email')) {
            const nameMatch = firstPara.match(/^([^\n@]+)(?=\n|@)/);
            sections.header = {
              name: nameMatch ? nameMatch[1].trim() : 'Resume',
              contact: firstPara
            };
          } else {
            sections.header = { name: firstPara.split('\n')[0], contact: '' };
            if (!sections.summary && paragraphs.length > 1) {
              sections.summary = firstPara;
            }
          }

          // Remaining paragraphs
          const remainingParas = paragraphs.slice(1);
          if (remainingParas.length > 0) {
            // Try to identify sections by content
            remainingParas.forEach((para, index) => {
              const paraLower = para.toLowerCase();
              if (paraLower.includes('experience') || paraLower.includes('worked') || paraLower.includes('position')) {
                sections.experience = (sections.experience || '') + '\n\n' + para;
              } else if (paraLower.includes('education') || paraLower.includes('degree') || paraLower.includes('university')) {
                sections.education = (sections.education || '') + '\n\n' + para;
              } else if (paraLower.includes('skills') || paraLower.includes('technologies') || paraLower.includes('programming')) {
                sections.skills = (sections.skills || '') + '\n\n' + para;
              } else if (!sections.summary) {
                sections.summary = para;
              } else if (!sections.experience) {
                sections.experience = para;
              } else {
                sections.experience += '\n\n' + para;
              }
            });
          }
        }
      }

      // Ensure we have at least basic sections
      if (!sections.header) {
        sections.header = { name: 'Resume', contact: '' };
      }
      if (!sections.summary && !sections.experience) {
        sections.summary = content.substring(0, 500) + '...';
      }

      // Clean up sections and remove formatting
      Object.keys(sections).forEach(key => {
        if (typeof sections[key] === 'string') {
          sections[key] = sections[key]
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
            .replace(/\*(.*?)\*/g, '$1') // Remove *italic*
            .replace(/^\s*-{2,}\s*$/gm, '') // Remove lines with dashes
            .replace(/^\s*={2,}\s*$/gm, '') // Remove lines with equals
            .replace(/^\s*_{2,}\s*$/gm, '') // Remove lines with underscores
            .replace(/\n{3,}/g, '\n\n') // Multiple newlines to double
            .trim();
        } else if (typeof sections[key] === 'object' && sections[key] !== null) {
          // Clean up object properties (like header.name, header.contact)
          Object.keys(sections[key]).forEach(prop => {
            if (typeof sections[key][prop] === 'string') {
              sections[key][prop] = sections[key][prop]
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/^\s*-{2,}\s*$/gm, '')
                .replace(/^\s*={2,}\s*$/gm, '')
                .replace(/^\s*_{2,}\s*$/gm, '')
                .trim();
            }
          });
        }
      });

    } catch (error) {
      console.error('Error parsing resume content:', error);
      // Fallback structure
      sections.header = { name: 'Resume', contact: '' };
      sections.summary = content.substring(0, 1000);
      if (content.length > 1000) {
        sections.experience = content.substring(1000);
      }
    }

    return sections;
  };

  const createProfessionalWord = async (content: string, docType: 'cover-letter' | 'cv') => {
    const sections = parseResumeContent(content);

    if (docType === 'cv') {
      // Professional CV Word document
      const wordDoc = new Document({
        styles: {
          paragraphStyles: [
            {
              id: "nameStyle",
              name: "Name Style",
              basedOn: "Normal",
              run: {
                size: 36,
                bold: true,
                color: "2E5984",
              },
              paragraph: {
                spacing: { after: 120 },
              },
            },
            {
              id: "contactStyle",
              name: "Contact Style",
              basedOn: "Normal",
              run: {
                size: 20,
                color: "666666",
              },
              paragraph: {
                spacing: { after: 300 },
              },
            },
            {
              id: "sectionHeading",
              name: "Section Heading",
              basedOn: "Normal",
              run: {
                size: 24,
                bold: true,
                color: "2E5984",
              },
              paragraph: {
                spacing: { before: 300, after: 150 },
              },
            },
          ],
        },
        sections: [{
          children: [
            // Header
            ...(sections.header ? [
              new Paragraph({
                children: [new TextRun({ 
                  text: (typeof sections.header === 'string' ? 
                    sections.header.split('\n')[0]
                      .replace(/\*\*(.*?)\*\*/g, '$1')
                      .replace(/\*(.*?)\*/g, '$1')
                      .replace(/[*]/g, '')
                      .trim() 
                    : sections.header.name || 'Resume'), 
                  bold: true, 
                  size: 36, 
                  color: "2E5984" 
                })],
                spacing: { after: 120 },
              }),
              ...((() => {
                const contactInfo = typeof sections.header === 'string' 
                  ? sections.header.split('\n').slice(1).join(' | ')
                      .replace(/\*\*(.*?)\*\*/g, '$1')
                      .replace(/\*(.*?)\*/g, '$1')
                      .replace(/[*]/g, '')
                      .trim()
                  : (sections.header.contact || '')
                      .replace(/\*\*(.*?)\*\*/g, '$1')
                      .replace(/\*(.*?)\*/g, '$1')
                      .replace(/[*]/g, '')
                      .trim();
                return contactInfo ? [
                  new Paragraph({
                    children: [new TextRun({ text: contactInfo, size: 20, color: "666666" })],
                    spacing: { after: 400 },
                  })
                ] : [];
              })())
            ] : []),

            // Professional Summary
            ...(sections.summary ? [
              new Paragraph({
                children: [new TextRun({ text: "SUMMARY", bold: true, size: 24, color: "2E5984" })],
                spacing: { before: 300, after: 150 },
              }),
              ...sections.summary.split('\n')
                .filter((line: string) => line.trim() && !line.match(/^[-=_*]{2,}$/))
                .map((line: string) => {
                  const cleanLine = line.trim()
                    .replace(/\*\*(.*?)\*\*/g, '$1')
                    .replace(/\*(.*?)\*/g, '$1')
                    .replace(/[*]/g, '')
                    .replace(/^\s*[-•]\s*/, '')
                    .trim();
                  
                  return cleanLine ? new Paragraph({
                    children: [new TextRun({ text: cleanLine, size: 22 })],
                    spacing: { after: 100 },
                  }) : null;
                })
                .filter((paragraph: any) => paragraph !== null)
            ] : []),

            // Experience
            ...(sections.experience ? [
              new Paragraph({
                children: [new TextRun({ text: "EXPERIENCE", bold: true, size: 24, color: "2E5984" })],
                spacing: { before: 300, after: 150 },
              }),
              ...sections.experience.split('\n')
                .filter((line: string) => line.trim() && !line.match(/^[-=_*]{2,}$/))
                .map((line: string) => {
                  const cleanLine = line.trim()
                    .replace(/\*\*(.*?)\*\*/g, '$1')
                    .replace(/\*(.*?)\*/g, '$1')
                    .replace(/[*]/g, '')
                    .trim();
                  
                  if (cleanLine.startsWith('•') || cleanLine.startsWith('-')) {
                    const bulletText = cleanLine.substring(1).trim();
                    return bulletText ? new Paragraph({
                      children: [new TextRun({ text: `• ${bulletText}`, size: 22 })],
                      spacing: { after: 80 },
                      indent: { left: 360 },
                    }) : null;
                  } else if (cleanLine) {
                    return new Paragraph({
                      children: [new TextRun({ text: cleanLine, size: 22, bold: cleanLine.length < 100 })],
                      spacing: { after: cleanLine.length < 100 ? 120 : 100 },
                    });
                  }
                  return null;
                })
                .filter((paragraph: any) => paragraph !== null)
            ] : []),

            // Skills
            ...(sections.skills ? [
              new Paragraph({
                children: [new TextRun({ text: "CORE COMPETENCIES", bold: true, size: 24, color: "2E5984" })],
                spacing: { before: 300, after: 150 },
              }),
              ...sections.skills.split('\n')
                .filter((line: string) => line.trim() && !line.match(/^[-=_*]{2,}$/))
                .map((line: string) => {
                  const cleanLine = line.trim()
                    .replace(/\*\*(.*?)\*\*/g, '$1')
                    .replace(/\*(.*?)\*/g, '$1')
                    .replace(/[*]/g, '')
                    .replace(/^\s*[-•]\s*/, '')
                    .trim();
                  
                  return cleanLine ? new Paragraph({
                    children: [new TextRun({ 
                      text: cleanLine.startsWith('•') ? cleanLine : `• ${cleanLine}`, 
                      size: 22 
                    })],
                    spacing: { after: 80 },
                    indent: { left: 360 },
                  }) : null;
                })
                .filter((paragraph: any) => paragraph !== null)
            ] : []),

            // Education
            ...(sections.education ? [
              new Paragraph({
                children: [new TextRun({ text: "EDUCATION", bold: true, size: 24, color: "2E5984" })],
                spacing: { before: 300, after: 150 },
              }),
              ...sections.education.split('\n')
                .filter((line: string) => line.trim() && !line.match(/^[-=_*]{2,}$/))
                .map((line: string) => {
                  const cleanLine = line.trim()
                    .replace(/\*\*(.*?)\*\*/g, '$1')
                    .replace(/\*(.*?)\*/g, '$1')
                    .replace(/[*]/g, '')
                    .replace(/^\s*[-•]\s*/, '')
                    .trim();
                  
                  return cleanLine ? new Paragraph({
                    children: [new TextRun({ text: cleanLine, size: 22 })],
                    spacing: { after: 100 },
                  }) : null;
                })
                .filter((paragraph: any) => paragraph !== null)
            ] : [])
          ]
        }]
      });

      const blob = await Packer.toBlob(wordDoc);
      saveAs(blob, `tailored-resume-${Date.now()}.docx`);

    } else {
      // Cover letter Word document
      const today = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const paragraphs = content.split('\n\n').filter(p => p.trim());

      const wordDoc = new Document({
        sections: [{
          children: [
            // Date
            new Paragraph({
              children: [new TextRun({ text: today, size: 22 })],
              alignment: "right",
              spacing: { after: 400 },
            }),

            // Cover letter paragraphs
            ...paragraphs.map((paragraph, index) => 
              new Paragraph({
                children: [new TextRun({ 
                  text: paragraph.trim()
                    .replace(/\n/g, ' ')
                    .replace(/\*\*(.*?)\*\*/g, '$1')
                    .replace(/\*(.*?)\*/g, '$1')
                    .replace(/[*]/g, '')
                    .trim(), 
                  size: 22 
                })],
                spacing: { after: index < paragraphs.length - 1 ? 240 : 0 },
                alignment: "left",
              })
            )
          ]
        }]
      });

      const blob = await Packer.toBlob(wordDoc);
      saveAs(blob, `cover-letter-${Date.now()}.docx`);
    }
  };
  
  const renderChatbotContent = () => {
    if (selectedFeature === 'cover-letter') {
      return (
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
              I&apos;ll analyze the job description and create a compelling cover letter that highlights your relevant skills and experience.
            </p>
          </div>

          <div className="space-y-4">
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

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleDownload('pdf', 'cover-letter')}
              disabled={!jobDescription.trim() || isProcessing}
              className="bg-[#CAFF02] text-[#0A0A0A] hover:bg-[#B8E602] h-12 font-semibold disabled:opacity-40"
            >
              <div className="flex items-center gap-2">
                <Download className="size-4" />
                {isProcessing ? 'Generating...' : 'Download PDF'}
              </div>
            </Button>
            <Button
              onClick={() => handleDownload('word', 'cover-letter')}
              variant="outline"
              disabled={!jobDescription.trim() || isProcessing}
              className="border-[#2A2A2A] text-[#F5F5F5] hover:bg-[#1A1A1A] hover:text-[#CAFF02] h-12 disabled:opacity-40"
            >
              <div className="flex items-center gap-2">
                <Download className="size-4" />
                {isProcessing ? 'Generating...' : 'Download Word'}
              </div>
            </Button>
          </div>
        </div>
      );
    }

    if (selectedFeature === 'cv-tailoring') {
      return (
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
              Upload your CV and job description. I&apos;ll analyze both and create a perfectly tailored resume that matches the job requirements.
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
                    ? 'border-[#CAFF02]/40 bg-[#CAFF02]/5'
                    : 'border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#CAFF02]/30'
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
                              <div className="w-4 h-4 border-2 border-[#CAFF02] border-t-transparent rounded-full animate-spin"></div>
                              Extracting...
                            </div>
                          ) : (
                            'Choose CV File'
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

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleDownload('pdf', 'cv')}
              disabled={!jobDescription.trim() || !userCvContent.trim() || isProcessing}
              className="bg-[#CAFF02] text-[#0A0A0A] hover:bg-[#B8E602] h-12 font-semibold disabled:opacity-40"
            >
              <div className="flex items-center gap-2">
                <Download className="size-4" />
                {isProcessing ? 'Generating...' : 'Download Tailored CV (PDF)'}
              </div>
            </Button>
            <Button
              onClick={() => handleDownload('word', 'cv')}
              variant="outline"
              disabled={!jobDescription.trim() || !userCvContent.trim() || isProcessing}
              className="border-[#2A2A2A] text-[#F5F5F5] hover:bg-[#1A1A1A] hover:text-[#CAFF02] h-12 disabled:opacity-40"
            >
              <div className="flex items-center gap-2">
                <Download className="size-4" />
                {isProcessing ? 'Generating...' : 'Download Tailored CV (Word)'}
              </div>
            </Button>
          </div>
        </div>
      );
    }

    // Default chat interface
    return (
      <div className="space-y-6">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#CAFF02]/10 rounded-lg">
              <Bot className="size-5 text-[#CAFF02]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#F5F5F5]">AI Assistant Ready</h3>
              <p className="text-sm text-[#6B6B6B]">Choose a tool or ask me anything!</p>
            </div>
          </div>

          <div className="grid gap-3">
            <Button
              variant="outline"
              onClick={() => setSelectedFeature('cover-letter')}
              className="justify-start h-auto p-4 bg-[#0A0A0A] hover:bg-[#CAFF02]/5 border-[#2A2A2A] hover:border-[#CAFF02]/30 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#CAFF02]/10 rounded-lg group-hover:bg-[#CAFF02]/20 transition-colors">
                  <FileEdit className="size-4 text-[#CAFF02]" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#F5F5F5]">Generate Cover Letter</p>
                  <p className="text-xs text-[#6B6B6B]">From job description</p>
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedFeature('cv-tailoring')}
              className="justify-start h-auto p-4 bg-[#0A0A0A] hover:bg-[#CAFF02]/5 border-[#2A2A2A] hover:border-[#CAFF02]/30 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#CAFF02]/10 rounded-lg group-hover:bg-[#CAFF02]/20 transition-colors">
                  <Target className="size-4 text-[#CAFF02]" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#F5F5F5]">Tailor Your CV</p>
                  <p className="text-xs text-[#6B6B6B]">Upload & optimize for jobs</p>
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        {chatMessages.length > 0 && (
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-sm p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-[#CAFF02] text-[#0A0A0A]'
                      : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F5]'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-[#0A0A0A]/60' : 'text-[#6B6B6B]'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#CAFF02] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#CAFF02] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-[#CAFF02] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-[#6B6B6B]">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        {/* Hero Header */}
        <div className="text-center py-12 mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#CAFF02] rounded-2xl">
              <Bot className="size-8 text-[#0A0A0A]" />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[#F5F5F5] mb-4">
            AI Resume Assistant
          </h1>
          <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
            Transform your career with AI-powered resume tools. Create compelling cover letters,
            tailor your CV for any job, and get expert career advice.
          </p>
        </div>

        {selectedFeature ? (
          /* Selected Feature View */
          <div className="max-w-4xl mx-auto">
            <Card className="border border-[#1E1E1E] bg-[#111111]">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedFeature === 'cover-letter' ? (
                      <>
                        <div className="p-2 bg-[#CAFF02]/10 rounded-lg">
                          <FileEdit className="size-5 text-[#CAFF02]" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-[#F5F5F5]">Cover Letter Generator</CardTitle>
                          <CardDescription className="text-[#6B6B6B]">Create professional cover letters tailored to job descriptions</CardDescription>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-2 bg-[#CAFF02]/10 rounded-lg">
                          <Target className="size-5 text-[#CAFF02]" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-[#F5F5F5]">CV Tailoring</CardTitle>
                          <CardDescription className="text-[#6B6B6B]">Optimize your resume for specific job opportunities</CardDescription>
                        </div>
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFeature(null);
                      setJobDescription("");
                      setUserCvContent("");
                      setUploadedFileName("");
                    }}
                    className="border-[#2A2A2A] text-[#F5F5F5] hover:bg-[#1A1A1A] hover:text-[#CAFF02]"
                  >
                    ← Back to Tools
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {renderChatbotContent()}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Main Dashboard View */
          <>
            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card
                className="cursor-pointer transition-all duration-200 hover:border-[#2A2A2A] border border-[#1E1E1E] bg-[#111111] group"
                onClick={() => setSelectedFeature('cover-letter')}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#CAFF02] rounded-xl group-hover:scale-110 transition-transform">
                      <FileEdit className="size-6 text-[#0A0A0A]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#F5F5F5]">Cover Letter Generator</CardTitle>
                      <Badge className="mt-1 bg-[#CAFF02]/10 text-[#CAFF02] border-[#CAFF02]/20 hover:bg-[#CAFF02]/10">AI-Powered</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-[#6B6B6B] mb-4">
                    Create professional cover letters that grab hiring managers&apos; attention in minutes.
                  </p>
                  <div className="flex items-center text-[#CAFF02] text-sm font-medium">
                    Get Started <ArrowRight className="size-4 ml-1" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all duration-200 hover:border-[#2A2A2A] border border-[#1E1E1E] bg-[#111111] group"
                onClick={() => setSelectedFeature('cv-tailoring')}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#CAFF02] rounded-xl group-hover:scale-110 transition-transform">
                      <Target className="size-6 text-[#0A0A0A]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#F5F5F5]">CV Tailoring</CardTitle>
                      <Badge className="mt-1 bg-[#CAFF02]/10 text-[#CAFF02] border-[#CAFF02]/20 hover:bg-[#CAFF02]/10">Smart Matching</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-[#6B6B6B] mb-4">
                    Automatically optimize your resume for any job description with AI insights.
                  </p>
                  <div className="flex items-center text-[#CAFF02] text-sm font-medium">
                    Upload & Tailor <ArrowRight className="size-4 ml-1" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-[#1E1E1E] bg-[#111111] md:col-span-2 lg:col-span-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#1A1A1A] rounded-xl">
                      <Sparkles className="size-6 text-[#CAFF02]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#F5F5F5]">Quick Stats</CardTitle>
                      <Badge className="mt-1 bg-[#1A1A1A] text-[#6B6B6B] border-[#2A2A2A] hover:bg-[#1A1A1A]">Your Progress</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B6B6B]">Documents Created</span>
                    <span className="font-semibold text-[#F5F5F5]">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B6B6B]">Jobs Applied</span>
                    <span className="font-semibold text-[#F5F5F5]">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B6B6B]">Success Rate</span>
                    <span className="font-semibold text-[#CAFF02]">New User</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Chat Assistant */}
            <Card className="border border-[#1E1E1E] bg-[#111111]">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1A1A1A] rounded-lg">
                    <MessageCircle className="size-5 text-[#CAFF02]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-[#F5F5F5]">Career Chat Assistant</CardTitle>
                    <CardDescription className="text-[#6B6B6B]">Get personalized career advice and resume tips</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderChatbotContent()}
                <div className="border-t border-[#1E1E1E] pt-4 mt-4">
                  <div className="flex gap-2">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Ask me anything about resumes, cover letters, or career advice..."
                      className="flex-1 bg-[#1A1A1A] border-[#2A2A2A] text-[#F5F5F5] placeholder:text-[#6B6B6B] focus-visible:ring-[#CAFF02]"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!currentMessage.trim() || isProcessing}
                      className="bg-[#CAFF02] text-[#0A0A0A] hover:bg-[#B8E602] font-semibold disabled:opacity-40"
                    >
                      <Zap className="size-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}








      </div>
    </div>
  );
};

export default ResumeAssistantView;

// Loading and Error components for Suspense boundaries
export const ResumeAssistantViewLoading = () => (
  <div className="flex flex-col gap-6 p-4 md:p-6 bg-[#0A0A0A] min-h-screen">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="h-8 w-48 bg-[#1A1A1A] animate-pulse rounded" />
        <div className="h-4 w-96 bg-[#1A1A1A] animate-pulse rounded mt-2" />
      </div>
      <div className="flex gap-2">
        <div className="h-10 w-32 bg-[#1A1A1A] animate-pulse rounded" />
        <div className="h-10 w-32 bg-[#1A1A1A] animate-pulse rounded" />
      </div>
    </div>
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 bg-[#111111] border border-[#1E1E1E] animate-pulse rounded-xl" />
      ))}
    </div>
  </div>
);

export const ResumeAssistantViewError = () => (
  <div className="flex flex-col items-center justify-center p-6 gap-4 bg-[#0A0A0A] min-h-screen">
    <div className="text-red-400 text-lg font-semibold">Failed to load resume assistant</div>
    <p className="text-[#6B6B6B]">Something went wrong while loading the resume assistant.</p>
  </div>
);

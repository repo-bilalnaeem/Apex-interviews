import { NextResponse } from "next/server";

const spec = {
  openapi: "3.0.3",
  info: {
    title: "Apex Interviews API",
    version: "1.0.0",
    description:
      "Backend API documentation for the Apex Interviews platform. Covers AI chat, resume processing, cover letter generation, CV tailoring, and webhook integrations.",
  },
  servers: [{ url: "/api", description: "Current origin" }],
  tags: [
    { name: "AI", description: "AI-powered chat and document generation" },
    { name: "Resume", description: "Resume parsing and CV upload" },
    { name: "Webhooks", description: "External service webhooks" },
    { name: "Auth", description: "Authentication" },
    { name: "Email", description: "Transactional email" },
  ],
  paths: {
    "/chatbot": {
      post: {
        tags: ["AI"],
        summary: "Stream AI interview assistant response",
        description:
          "Sends a user message to the multi-agent interview assistant and streams back a Server-Sent Events (SSE) response. Each SSE event is a JSON object with one of: `agentName`, `toolCall`, `answer`, or `error`.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["message"],
                properties: {
                  message: {
                    type: "string",
                    description: "The user's chat message.",
                    example: "What are common behavioural interview questions?",
                  },
                  resume: {
                    type: "string",
                    description: "Optional plain-text resume content for context.",
                    example: "John Smith\nSoftware Engineer with 5 years experience...",
                  },
                  meetingId: {
                    type: "string",
                    description: "Optional meeting ID to scope the response to a specific session.",
                    example: "meeting_abc123",
                  },
                  history: {
                    type: "array",
                    description: "Previous conversation turns for context.",
                    items: {
                      type: "object",
                      properties: {
                        role: { type: "string", enum: ["user", "assistant"] },
                        content: { type: "string" },
                      },
                    },
                  },
                },
              },
              example: {
                message: "What is the STAR method?",
                history: [
                  { role: "user", content: "Help me prepare for interviews." },
                  { role: "assistant", content: "Sure! What role are you interviewing for?" },
                ],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Server-Sent Events stream of agent tokens.",
            content: {
              "text/event-stream": {
                schema: {
                  type: "string",
                  description:
                    "Newline-delimited SSE frames. Each frame is `data: <json>\\n\\n` where JSON is one of:\n- `{ \"agentName\": \"string\" }` — active agent changed\n- `{ \"toolCall\": \"string\" }` — tool invoked\n- `{ \"answer\": \"string\" }` — response token\n- `{ \"error\": \"string\" }` — error message",
                },
              },
            },
          },
          "500": {
            description: "Internal server error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/gemini": {
      post: {
        tags: ["AI"],
        summary: "Generate cover letter or tailor CV",
        description:
          "Uses OpenAI GPT-4o-mini to generate a cover letter from a job description, tailor an existing CV to a job description, or answer a general career/resume question.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  feature: {
                    type: "string",
                    enum: ["cover-letter", "cv"],
                    description:
                      "`cover-letter` — generate a cover letter. `cv` — tailor existing CV. Omit for general chat.",
                  },
                  jobDescription: {
                    type: "string",
                    description: "Full job description text. Required for `cover-letter` and `cv` features.",
                    example: "We are looking for a senior React developer...",
                  },
                  userCvContent: {
                    type: "string",
                    description: "Plain-text content of the user's existing CV. Required for `cv` feature.",
                  },
                  messages: {
                    type: "array",
                    description: "Chat history for general assistant mode (when `feature` is omitted).",
                    items: {
                      type: "object",
                      properties: {
                        role: { type: "string", enum: ["user", "assistant"] },
                        content: { type: "string" },
                      },
                    },
                  },
                  schema: {
                    type: "string",
                    enum: ["ai_feedback"],
                    description:
                      "Pass `ai_feedback` to receive a structured JSON response instead of plain text.",
                  },
                },
              },
              examples: {
                coverLetter: {
                  summary: "Generate a cover letter",
                  value: { feature: "cover-letter", jobDescription: "Senior React Developer at Acme Corp..." },
                },
                tailorCv: {
                  summary: "Tailor CV to job",
                  value: {
                    feature: "cv",
                    jobDescription: "Senior React Developer at Acme Corp...",
                    userCvContent: "Jane Doe\nReact Developer\n3 years experience...",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Generated text or structured JSON.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Generated cover letter, tailored CV, or chat reply.",
                    },
                    structured: {
                      type: "boolean",
                      description: "Present and `true` when `schema: ai_feedback` was requested.",
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "OpenAI error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/upload-cv": {
      post: {
        tags: ["Resume"],
        summary: "Upload and extract text from CV file",
        description:
          "Accepts a PDF or DOCX file via multipart/form-data and returns the extracted plain text. Used by the CV Tailoring feature to obtain the user's current resume content.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "PDF or DOCX file to extract text from.",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Extracted text content.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    extractedText: {
                      type: "string",
                      description: "Raw text extracted from the uploaded file.",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "No file provided or unsupported file type.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Text extraction failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/parseResume": {
      post: {
        tags: ["Resume"],
        summary: "Parse resume from base64-encoded PDF",
        description:
          "Accepts a base64-encoded PDF and extracts its text. Uses `pdf-parse` for text-based PDFs and falls back to GPT-4o vision for scanned/image-only PDFs.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["pdfBase64"],
                properties: {
                  pdfBase64: {
                    type: "string",
                    description:
                      "Base64-encoded PDF string. May include a data URI prefix (`data:application/pdf;base64,`).",
                    example: "data:application/pdf;base64,JVBERi0xLjQK...",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Extracted text and the extraction method used.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    text: { type: "string", description: "Extracted plain text from the PDF." },
                    source: {
                      type: "string",
                      enum: ["pdf-parse", "vision"],
                      description: "Which extraction method succeeded.",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "No PDF provided or PDF too small.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "422": {
            description: "Could not extract text — prompt user to paste text manually.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "PDF parsing error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/webhook": {
      post: {
        tags: ["Webhooks"],
        summary: "Stream.io video & chat webhook",
        description:
          "Receives and verifies signed webhook events from Stream.io. Handles video call lifecycle events and chat message events to drive the AI interview assistant in real-time meetings.",
        parameters: [
          {
            in: "header",
            name: "x-signature",
            required: true,
            schema: { type: "string" },
            description: "HMAC signature from Stream.io for request verification.",
          },
          {
            in: "header",
            name: "x-api-key",
            required: true,
            schema: { type: "string" },
            description: "Stream.io API key.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: [
                      "call.session_started",
                      "call.session_participant_left",
                      "call.session_ended",
                      "call.transcription_ready",
                      "call.recording_ready",
                      "message.new",
                    ],
                    description: "Stream.io event type.",
                  },
                },
              },
              examples: {
                sessionStarted: {
                  summary: "Call session started",
                  value: { type: "call.session_started", call: { custom: { meetingId: "meeting_abc123" } } },
                },
                transcriptionReady: {
                  summary: "Transcription available",
                  value: {
                    type: "call.transcription_ready",
                    call_cid: "default:meeting_abc123",
                    call_transcription: { url: "https://cdn.stream.io/transcripts/abc.json" },
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Event processed successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { status: { type: "string", example: "ok" } },
                },
              },
            },
          },
          "400": {
            description: "Missing signature, API key, meetingId, or invalid JSON.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Invalid webhook signature.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Meeting or agent not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/send-welcome-mail": {
      post: {
        tags: ["Email"],
        summary: "Send welcome email",
        description: "Triggers a welcome email to a new user via the platform mailer.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email", example: "user@example.com" },
                  name: { type: "string", example: "Jane Doe" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Email sent successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { success: { type: "boolean" } },
                },
              },
            },
          },
          "500": {
            description: "Email delivery failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/inngest": {
      get: {
        tags: ["Webhooks"],
        summary: "Inngest introspection (GET)",
        description: "Used by the Inngest dashboard for function introspection and health checks.",
        responses: {
          "200": { description: "OK" },
        },
      },
      post: {
        tags: ["Webhooks"],
        summary: "Inngest event handler (POST)",
        description:
          "Receives events from the Inngest platform and dispatches them to registered background functions (e.g. `meetings/processing`).",
        responses: {
          "200": { description: "Event dispatched." },
        },
      },
      put: {
        tags: ["Webhooks"],
        summary: "Inngest sync (PUT)",
        description: "Used by Inngest to sync function manifests.",
        responses: {
          "200": { description: "Synced." },
        },
      },
    },
    "/auth/{action}": {
      get: {
        tags: ["Auth"],
        summary: "Authentication handler (GET)",
        description:
          "Handled by `better-auth`. Covers OAuth callbacks, session retrieval, and sign-out flows.",
        parameters: [
          {
            in: "path",
            name: "action",
            required: true,
            schema: { type: "string" },
            description: "Catch-all path segment (e.g. `signin`, `callback/google`).",
          },
        ],
        responses: {
          "200": { description: "Auth action completed." },
          "302": { description: "Redirect after OAuth flow." },
        },
      },
      post: {
        tags: ["Auth"],
        summary: "Authentication handler (POST)",
        description: "Handles credential sign-in, sign-up, and token refresh via `better-auth`.",
        parameters: [
          {
            in: "path",
            name: "action",
            required: true,
            schema: { type: "string" },
            description: "Catch-all path segment.",
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: { type: "object", description: "Payload varies by action." },
            },
          },
        },
        responses: {
          "200": { description: "Auth action completed." },
          "401": { description: "Invalid credentials." },
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: { type: "string", description: "Human-readable error message." },
        },
        example: { error: "No file uploaded" },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec);
}

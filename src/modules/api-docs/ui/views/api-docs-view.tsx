"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

const ApiDocsView = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="border-b border-[#1E1E1E] px-6 py-4">
        <h1 className="font-display text-2xl font-bold text-[#F5F5F5] tracking-tight">
          API Documentation
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-1">
          Explore and test all Apex Interviews backend routes
        </p>
      </div>

      {/* Swagger UI — override styles to match dark theme */}
      <div className="swagger-wrapper p-4">
        <SwaggerUI url="/api/docs" docExpansion="list" defaultModelsExpandDepth={-1} />
      </div>

      <style>{`
        /* ── Base ── */
        .swagger-wrapper .swagger-ui,
        .swagger-wrapper .swagger-ui .wrapper,
        .swagger-wrapper .swagger-ui .opblock-tag-section {
          background: transparent !important;
        }

        /* Hide the top bar / Swagger branding */
        .swagger-wrapper .swagger-ui .topbar { display: none !important; }

        /* ── Info section ── */
        .swagger-wrapper .swagger-ui .info { margin: 16px 0 !important; }
        .swagger-wrapper .swagger-ui .info .title,
        .swagger-wrapper .swagger-ui .info p,
        .swagger-wrapper .swagger-ui .info li,
        .swagger-wrapper .swagger-ui .info a {
          color: #F5F5F5 !important;
        }
        .swagger-wrapper .swagger-ui .info .base-url { color: #6B6B6B !important; }

        /* ── Tag / section headers ── */
        .swagger-wrapper .swagger-ui .opblock-tag {
          border-bottom: 1px solid #1E1E1E !important;
          color: #F5F5F5 !important;
        }
        .swagger-wrapper .swagger-ui .opblock-tag:hover { background: #1A1A1A !important; }
        .swagger-wrapper .swagger-ui .opblock-tag small { color: #6B6B6B !important; }

        /* ── Operation blocks ── */
        .swagger-wrapper .swagger-ui .opblock {
          background: #111111 !important;
          border: 1px solid #1E1E1E !important;
          border-radius: 12px !important;
          margin-bottom: 8px !important;
          box-shadow: none !important;
        }
        .swagger-wrapper .swagger-ui .opblock .opblock-summary {
          border-bottom: none !important;
          padding: 12px 16px !important;
        }
        .swagger-wrapper .swagger-ui .opblock .opblock-summary-description,
        .swagger-wrapper .swagger-ui .opblock .opblock-summary-path,
        .swagger-wrapper .swagger-ui .opblock .opblock-summary-path__deprecated {
          color: #F5F5F5 !important;
          font-size: 14px !important;
        }

        /* POST green → brand yellow */
        .swagger-wrapper .swagger-ui .opblock.opblock-post {
          border-color: #CAFF02 !important;
        }
        .swagger-wrapper .swagger-ui .opblock.opblock-post .opblock-summary-method {
          background: #CAFF02 !important;
          color: #0A0A0A !important;
        }

        /* GET */
        .swagger-wrapper .swagger-ui .opblock.opblock-get {
          border-color: #3B82F6 !important;
        }
        .swagger-wrapper .swagger-ui .opblock.opblock-get .opblock-summary-method {
          background: #3B82F6 !important;
          color: #fff !important;
        }

        /* PUT */
        .swagger-wrapper .swagger-ui .opblock.opblock-put {
          border-color: #F59E0B !important;
        }
        .swagger-wrapper .swagger-ui .opblock.opblock-put .opblock-summary-method {
          background: #F59E0B !important;
          color: #0A0A0A !important;
        }

        /* DELETE */
        .swagger-wrapper .swagger-ui .opblock.opblock-delete {
          border-color: #EF4444 !important;
        }
        .swagger-wrapper .swagger-ui .opblock.opblock-delete .opblock-summary-method {
          background: #EF4444 !important;
          color: #fff !important;
        }

        /* ── Expanded block body ── */
        .swagger-wrapper .swagger-ui .opblock-body,
        .swagger-wrapper .swagger-ui .opblock-description-wrapper,
        .swagger-wrapper .swagger-ui .opblock-external-docs-wrapper,
        .swagger-wrapper .swagger-ui .opblock-title_normal {
          background: #0F0F0F !important;
          color: #9B9B9B !important;
          padding: 12px 16px !important;
        }
        .swagger-wrapper .swagger-ui .opblock-body p,
        .swagger-wrapper .swagger-ui .opblock-body li,
        .swagger-wrapper .swagger-ui .opblock-description-wrapper p {
          color: #9B9B9B !important;
        }

        /* ── Tab bar ── */
        .swagger-wrapper .swagger-ui .tab li { color: #6B6B6B !important; }
        .swagger-wrapper .swagger-ui .tab li.active { color: #CAFF02 !important; border-bottom: 2px solid #CAFF02 !important; }
        .swagger-wrapper .swagger-ui .tab li button { color: inherit !important; }

        /* ── Parameters table ── */
        .swagger-wrapper .swagger-ui table thead tr td,
        .swagger-wrapper .swagger-ui table thead tr th {
          background: #1A1A1A !important;
          color: #F5F5F5 !important;
          border-bottom: 1px solid #2A2A2A !important;
        }
        .swagger-wrapper .swagger-ui table tbody tr td {
          background: #111111 !important;
          color: #9B9B9B !important;
          border-bottom: 1px solid #1E1E1E !important;
        }
        .swagger-wrapper .swagger-ui .parameter__name { color: #F5F5F5 !important; }
        .swagger-wrapper .swagger-ui .parameter__type { color: #CAFF02 !important; }
        .swagger-wrapper .swagger-ui .parameter__in { color: #6B6B6B !important; }
        .swagger-wrapper .swagger-ui .parameter__deprecated { color: #EF4444 !important; }
        .swagger-wrapper .swagger-ui .parameter__empty_value_toggle { color: #6B6B6B !important; }

        /* ── Request body / schema ── */
        .swagger-wrapper .swagger-ui .body-param textarea,
        .swagger-wrapper .swagger-ui textarea {
          background: #1A1A1A !important;
          color: #F5F5F5 !important;
          border: 1px solid #2A2A2A !important;
          border-radius: 8px !important;
        }

        /* ── Code / pre blocks ── */
        .swagger-wrapper .swagger-ui .highlight-code,
        .swagger-wrapper .swagger-ui .microlight {
          background: #1A1A1A !important;
          border-radius: 8px !important;
          padding: 12px !important;
        }
        .swagger-wrapper .swagger-ui .microlight span { color: #F5F5F5 !important; }

        /* ── Response section ── */
        .swagger-wrapper .swagger-ui .responses-wrapper,
        .swagger-wrapper .swagger-ui .response-col_status {
          background: transparent !important;
          color: #9B9B9B !important;
        }
        .swagger-wrapper .swagger-ui .response-col_status { color: #CAFF02 !important; }
        .swagger-wrapper .swagger-ui .response-col_description { color: #9B9B9B !important; }

        /* ── Models section — hide ── */
        .swagger-wrapper .swagger-ui section.models { display: none !important; }

        /* ── Execute / Try It Out buttons ── */
        .swagger-wrapper .swagger-ui .btn.execute {
          background: #CAFF02 !important;
          color: #0A0A0A !important;
          border: none !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
        }
        .swagger-wrapper .swagger-ui .btn.execute:hover { background: #B8E602 !important; }
        .swagger-wrapper .swagger-ui .try-out__btn {
          color: #CAFF02 !important;
          border-color: #CAFF02 !important;
          border-radius: 8px !important;
        }
        .swagger-wrapper .swagger-ui .cancel { color: #EF4444 !important; border-color: #EF4444 !important; border-radius: 8px !important; }

        /* ── Misc text ── */
        .swagger-wrapper .swagger-ui .markdown p,
        .swagger-wrapper .swagger-ui .renderedMarkdown p { color: #9B9B9B !important; }
        .swagger-wrapper .swagger-ui select {
          background: #1A1A1A !important;
          color: #F5F5F5 !important;
          border: 1px solid #2A2A2A !important;
        }
        .swagger-wrapper .swagger-ui input[type="text"],
        .swagger-wrapper .swagger-ui input[type="email"] {
          background: #1A1A1A !important;
          color: #F5F5F5 !important;
          border: 1px solid #2A2A2A !important;
        }

        /* ── Loading indicator ── */
        .swagger-wrapper .swagger-ui .loading-container .loading::after {
          border-color: #CAFF02 transparent transparent !important;
        }
      `}</style>
    </div>
  );
};

export default ApiDocsView;

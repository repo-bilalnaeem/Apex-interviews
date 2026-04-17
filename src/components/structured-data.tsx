import { BASE_URL } from "@/constants";

// Type for structured data objects (schema.org JSON-LD)
interface StructuredDataObject {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

export interface StructuredDataProps {
  type?: "organization" | "website" | "breadcrumbList" | "faq" | "product";
  data?: StructuredDataObject;
}

export function StructuredData({
  type = "organization",
  data,
}: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AI Interview Agents",
          description:
            "AI-powered interview platform for automated recruitment and candidate screening",
          url: BASE_URL,
          logo: `${BASE_URL}/logo.png`,
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: `contact@${new URL(BASE_URL).hostname}`,
          },
          foundingDate: "2024",
          numberOfEmployees: "1-10",
          industry: "Software Development",
          keywords:
            "AI interviews, automated hiring, recruitment platform, interview agents",
        };

      case "website":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "AI Interview Agents",
          description:
            "Transform your hiring process with AI-powered interview agents",
          url: BASE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: `${BASE_URL}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        };

      case "product":
        return {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "AI Interview Agents Platform",
          description:
            "AI-powered interview platform for automated recruitment and candidate screening",
          url: BASE_URL,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web Browser",
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            price: "0",
            description: "Free trial available",
          },
          features: [
            "24/7 Automated Screening",
            "Bias-Free Evaluations",
            "Real-time Analytics",
            "Seamless Integration",
          ],
        };

      case "breadcrumbList":
        if (!data) {
          throw new Error("Data is required for type 'breadcrumbList'");
        }
        const breadcrumbData = Object.fromEntries(
          Object.entries(data).filter(
            ([key]) => key !== "@context" && key !== "@type"
          )
        );
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          ...breadcrumbData,
        };

      case "faq":
        if (!data) {
          throw new Error("Data is required for type 'faq'");
        }
        const faqData = Object.fromEntries(
          Object.entries(data).filter(
            ([key]) => key !== "@context" && key !== "@type"
          )
        );
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          ...faqData,
        };
      default:
        return data || {};
    }
  };

  const structuredData = getStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

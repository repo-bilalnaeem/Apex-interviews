import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          backgroundImage:
            "linear-gradient(45deg, #f0f9ff 25%, transparent 25%), linear-gradient(-45deg, #f0f9ff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f9ff 75%), linear-gradient(-45deg, transparent 75%, #f0f9ff 75%)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "16px",
            padding: "60px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(124, 58, 237, 0.2)",
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: "bold",
              background: "linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.1,
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            AI Interview Agents
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#6b7280",
              textAlign: "center",
              maxWidth: "800px",
              lineHeight: 1.3,
            }}
          >
            Transform Your Hiring Process with AI-Powered Interview Agents
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "32px",
              gap: "16px",
            }}
          >
            <div
              style={{
                backgroundColor: "#7c3aed",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Start Free Trial
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#6b7280",
                fontSize: "16px",
              }}
            >
              <span>⭐⭐⭐⭐⭐</span>
              <span>4.9/5 rating</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

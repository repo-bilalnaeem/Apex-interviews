import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

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
              fontSize: 56,
              fontWeight: "bold",
              background: "linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.1,
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            Start Your Free Trial
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#6b7280",
              textAlign: "center",
              maxWidth: "800px",
              lineHeight: 1.3,
              marginBottom: "16px",
            }}
          >
            Join 500+ companies using AI Interview Agents
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginTop: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>✅</span>
              <span style={{ fontSize: "18px", color: "#374151" }}>
                No Credit Card Required
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>🚀</span>
              <span style={{ fontSize: "18px", color: "#374151" }}>
                Setup in 5 Minutes
              </span>
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

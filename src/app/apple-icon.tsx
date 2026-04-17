import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "22px",
          fontWeight: "bold",
          fontFamily: "system-ui",
        }}
      >
        AI
      </div>
    ),
    {
      ...size,
    }
  );
}

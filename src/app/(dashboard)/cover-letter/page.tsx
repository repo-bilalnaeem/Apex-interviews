import { Suspense } from "react";
import ResumeAssistantView from "@/modules/resume-assistant/ui/views/resume-assistant-view";

export default function CoverLetterPage() {
  return (
    <Suspense>
      <ResumeAssistantView initialFeature="cover-letter" />
    </Suspense>
  );
}

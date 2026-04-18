import { Suspense } from "react";
import ResumeAssistantView from "@/modules/resume-assistant/ui/views/resume-assistant-view";

export default function TailorCvPage() {
  return (
    <Suspense>
      <ResumeAssistantView initialFeature="cv-tailoring" />
    </Suspense>
  );
}

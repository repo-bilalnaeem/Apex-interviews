import { Suspense } from "react";
import CoverLetterView from "@/modules/resume-assistant/ui/views/cover-letter-view";

export default function CoverLetterPage() {
  return (
    <Suspense>
      <CoverLetterView />
    </Suspense>
  );
}

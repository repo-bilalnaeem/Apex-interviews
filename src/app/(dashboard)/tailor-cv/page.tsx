import { Suspense } from "react";
import TailorCvView from "@/modules/resume-assistant/ui/views/tailor-cv-view";

export default function TailorCvPage() {
  return (
    <Suspense>
      <TailorCvView />
    </Suspense>
  );
}

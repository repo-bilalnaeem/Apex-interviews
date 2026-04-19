import { Suspense } from "react";
import ApiDocsView from "@/modules/api-docs/ui/views/api-docs-view";

export default function ApiDocsPage() {
  return (
    <Suspense>
      <ApiDocsView />
    </Suspense>
  );
}

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

interface Props {
  agentId: string;
  agentName: string;
  onEdit: () => void;
  onRemove: () => void;
}

export const AgentIdViewHeader = ({
  agentName,
  onEdit,
  onRemove,
}: Props) => {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Left: back + name */}
      <div className="flex min-w-0 items-center gap-3">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-lg text-[#CAFF02] hover:bg-[#CAFF02]/10 hover:text-[#CAFF02]"
        >
          <Link href="/agents">
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
        </Button>
        <h1
          className="truncate font-[family-name:var(--font-display)] text-[24px] font-bold capitalize text-white"
          title={agentName}
        >
          {agentName}
        </h1>
      </div>

      {/* Right: edit + delete */}
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          aria-label="Edit agent"
          className="h-8 w-8 rounded-lg text-[#6B6B6B] hover:bg-[#1E1E1E] hover:text-[#F5F5F5] transition-colors duration-150"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          aria-label="Delete agent"
          className="h-8 w-8 rounded-lg text-[#6B6B6B] hover:bg-[#FF4444]/10 hover:text-[#FF4444] transition-colors duration-150"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

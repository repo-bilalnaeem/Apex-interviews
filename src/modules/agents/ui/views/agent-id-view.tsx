"use client";

import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { VideoIcon, PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import UpdateAgentDialog from "../components/update-agent-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );
        router.push("/agents");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `This will remove ${data.meetingCount} associated meeting${data.meetingCount === 1 ? "" : "s"}.`
  );

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    await removeAgent.mutateAsync({ id: agentId });
  };

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog
        open={updateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
        initialValues={data}
      />
      <div className="flex flex-1 flex-col gap-y-6 px-4 py-4 md:px-8">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemoveAgent}
        />

        {/* Hero section */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#2A2A2A] bg-[#141414] px-6 py-8 text-center sm:flex-row sm:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#CAFF02]">
            <span className="font-[family-name:var(--font-display)] text-[40px] font-bold leading-none text-black">
              {data.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[36px] font-bold capitalize leading-tight text-white">
              {data.name}
            </h2>
            <p className="mt-1 text-sm text-[#6B6B6B]">AI Interview Agent</p>
            <div className="mt-2 flex items-center gap-1.5">
              <VideoIcon className="h-3.5 w-3.5 text-[#818CF8]" />
              <span className="text-xs text-[#6B6B6B]">
                {data.meetingCount}{" "}
                {data.meetingCount === 1 ? "meeting" : "meetings"}
              </span>
            </div>
          </div>
        </div>

        {/* Instructions card */}
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#6B6B6B]">
              INSTRUCTIONS
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setUpdateAgentDialogOpen(true)}
              aria-label="Edit instructions"
              className="h-7 w-7 rounded-lg text-[#6B6B6B] hover:bg-[#1E1E1E] hover:text-[#F5F5F5] transition-colors duration-150"
            >
              <PencilIcon className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-sm leading-relaxed text-[#F5F5F5]">
            {data.instructions}
          </p>
        </div>

        {/* Start Interview CTA */}
        <Button
          asChild
          className="h-11 w-full rounded-md bg-[#CAFF02] font-[family-name:var(--font-display)] text-sm font-bold text-black hover:bg-[#A8D900] active:scale-[0.97] transition-all duration-150"
        >
          <Link href="/meetings">
            <VideoIcon className="mr-2 h-5 w-5" />
            Start Interview
          </Link>
        </Button>
      </div>
    </>
  );
};

export const AgentIdViewLoading = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-6 px-4 py-4 md:px-8">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-pulse rounded-lg bg-[#1E1E1E]" />
        <div className="h-7 w-40 animate-pulse rounded bg-[#1E1E1E]" />
      </div>
      {/* Hero skeleton */}
      <div className="flex gap-4 rounded-2xl border border-[#2A2A2A] bg-[#141414] px-6 py-8">
        <div className="h-20 w-20 animate-pulse rounded-full bg-[#1E1E1E]" />
        <div className="flex flex-col justify-center gap-2">
          <div className="h-9 w-44 animate-pulse rounded bg-[#1E1E1E]" />
          <div className="h-4 w-28 animate-pulse rounded bg-[#1E1E1E]" />
        </div>
      </div>
      {/* Instructions skeleton */}
      <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6">
        <div className="mb-4 h-3 w-24 animate-pulse rounded bg-[#1E1E1E]" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-[#1E1E1E]" style={{ width: `${85 - i * 10}%` }} />
          ))}
        </div>
      </div>
      {/* Button skeleton */}
      <div className="h-12 animate-pulse rounded-xl bg-[#1E1E1E]" />
    </div>
  );
};

export const AgentIdViewError = () => {
  return (
    <div className="flex flex-1 items-center justify-center px-4 pb-4 md:px-8">
      <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] px-8 py-12 text-center">
        <p className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
          Error Loading Agent
        </p>
        <p className="mt-2 text-sm text-[#6B6B6B]">Please try again later.</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4 rounded-md border-[#2A2A2A] bg-[#1E1E1E] text-[#F5F5F5] hover:border-[#CAFF02]/30 hover:bg-[#252525] transition-all duration-150"
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};

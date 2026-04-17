import { agentsRouter } from "@/modules/agents/server/procedures";
import { createTRPCRouter } from "../init";
import { meetingsRouter } from "@/modules/meetings/server/procedures";
import { dashboardRouter } from "@/modules/dashboard/server/procedures";
import { userRouter } from "@/modules/user/server/procedures";

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
  dashboard: dashboardRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

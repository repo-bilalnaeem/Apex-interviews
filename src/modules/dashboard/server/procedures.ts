import { and, count, desc, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get total meetings count
    const [
      [totalMeetingsResult],
      [thisWeekMeetingsResult],
      [activeMeetingsResult],
      [totalAgentsResult],
      [upcomingMeetingsResult],
    ] = await Promise.all([
      db.select({ count: count() }).from(meetings).where(eq(meetings.userId, userId)),
      db
        .select({ count: count() })
        .from(meetings)
        .where(
          and(eq(meetings.userId, userId), gte(meetings.createdAt, lastWeek))
        ),
      db
        .select({ count: count() })
        .from(meetings)
        .where(and(eq(meetings.userId, userId), eq(meetings.status, "active"))),
      db.select({ count: count() }).from(agents).where(eq(agents.userId, userId)),
      db
        .select({ count: count() })
        .from(meetings)
        .where(and(eq(meetings.userId, userId), eq(meetings.status, "upcoming"))),
    ]);
    // Calculate dynamic descriptions
    const weeklyChange = thisWeekMeetingsResult.count;
    const totalMeetingsText =
      weeklyChange > 0
        ? `+${weeklyChange} from last week`
        : weeklyChange === 0
        ? "No change from last week"
        : `${Math.abs(weeklyChange)} fewer from last week`;

    const activeMeetingsText =
      activeMeetingsResult.count > 0
        ? "Currently in progress"
        : "No active meetings";

    const agentsText =
      totalAgentsResult.count > 0
        ? "Ready for deployment"
        : "Create your first agent";

    const upcomingText =
      upcomingMeetingsResult.count > 0 ? "Next 7 days" : "No upcoming meetings";

    return {
      totalMeetings: totalMeetingsResult.count,
      activeMeetings: activeMeetingsResult.count,
      totalAgents: totalAgentsResult.count,
      upcomingMeetings: upcomingMeetingsResult.count,
      // Dynamic descriptions
      totalMeetingsText,
      activeMeetingsText,
      agentsText,
      upcomingText,
    };
  }),

  getRecentActivity: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;

    // Get recent meetings (last 10)
    const recentMeetings = await db
      .select({
        id: meetings.id,
        name: meetings.name,
        status: meetings.status,
        createdAt: meetings.createdAt,
        updatedAt: meetings.updatedAt,
        agentName: agents.name,
      })
      .from(meetings)
      .innerJoin(agents, eq(meetings.agentId, agents.id))
      .where(eq(meetings.userId, userId))
      .orderBy(desc(meetings.updatedAt))
      .limit(5);

    // Get recent agents (last 5)
    const recentAgents = await db
      .select({
        id: agents.id,
        name: agents.name,
        createdAt: agents.createdAt,
        updatedAt: agents.updatedAt,
      })
      .from(agents)
      .where(eq(agents.userId, userId))
      .orderBy(desc(agents.createdAt))
      .limit(3);

    // Combine and format the activity
    const activity = [
      ...recentMeetings.map((meeting) => ({
        id: `meeting-${meeting.id}`,
        type: "meeting" as const,
        title: meeting.name,
        description: getStatusDescription(meeting.status, meeting.agentName),
        time: getRelativeTime(meeting.updatedAt),
        status: meeting.status,
        timestamp: meeting.updatedAt,
      })),
      ...recentAgents.map((agent) => ({
        id: `agent-${agent.id}`,
        type: "agent" as const,
        title: `${agent.name} Created`,
        description: "AI Agent ready for deployment",
        time: getRelativeTime(agent.createdAt),
        status: "ready" as const,
        timestamp: agent.createdAt,
      })),
    ];

    // Sort by timestamp and return top 6
    return activity
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 6);
  }),
});

function getStatusDescription(status: string, agentName: string): string {
  switch (status) {
    case "completed":
      return `Completed with ${agentName}`;
    case "active":
      return `In progress with ${agentName}`;
    case "upcoming":
      return `Scheduled with ${agentName}`;
    case "processing":
      return `Processing recording with ${agentName}`;
    case "cancelled":
      return `Cancelled - was scheduled with ${agentName}`;
    default:
      return `Meeting with ${agentName}`;
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

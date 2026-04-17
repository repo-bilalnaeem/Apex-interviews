import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { userUpdateSchema } from "../schemas";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  // Get current user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const [userProfile] = await db
      .select()
      .from(user)
      .where(eq(user.id, ctx.auth.user.id));

    if (!userProfile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return userProfile;
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(userUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [updatedUser] = await db
        .update(user)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(user.id, ctx.auth.user.id))
        .returning();

      if (!updatedUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return updatedUser;
    }),
});
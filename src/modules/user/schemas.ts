import { z } from "zod";

// Update schema - only include fields that can be updated
export const userUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  image: z.string().url("Invalid image URL").optional().nullable().or(z.literal("")),
});

// Type exports
export type UserUpdate = z.infer<typeof userUpdateSchema>;
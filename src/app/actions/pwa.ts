"use server";

import webpush from "web-push";
import { SerializedPushSubscription, PWAActionResult } from "@/types/pwa";

// Configure VAPID keys (you'll need to generate these)
webpush.setVapidDetails(
  "mailto:support@aiinterviewagents.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// In-memory storage for demo purposes
// In production, store subscriptions in your database
let subscription: SerializedPushSubscription | null = null;

export async function subscribeUser(
  sub: SerializedPushSubscription
): Promise<PWAActionResult> {
  // Convert plain object to format compatible with web-push
  subscription = {
    endpoint: sub.endpoint,
    keys: {
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    },
  };

  // In production: await db.subscriptions.create({ data: sub })
  console.log("User subscribed to push notifications");
  return { success: true };
}

export async function unsubscribeUser(): Promise<PWAActionResult> {
  subscription = null;
  // In production: await db.subscriptions.delete({ where: { ... } })
  console.log("User unsubscribed from push notifications");
  return { success: true };
}

export async function sendNotification(
  message: string
): Promise<PWAActionResult> {
  if (!subscription) {
    throw new Error("No subscription available");
  }

  try {
    await webpush.sendNotification(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      subscription as any, // Cast to any for web-push compatibility
      JSON.stringify({
        title: "AI Interview Agents",
        body: message,
        icon: "/icon",
        badge: "/icon",
      })
    );
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}

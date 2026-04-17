"use client";

import { useState, useEffect } from "react";
import {
  subscribeUser,
  unsubscribeUser,
  sendNotification,
} from "@/app/actions/pwa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, BellOff } from "lucide-react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  }

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          (() => {
            if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
              throw new Error("Missing VAPID public key. Ensure NEXT_PUBLIC_VAPID_PUBLIC_KEY is set in the environment.");
            }
            return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          })()
        ),
      });

      // Serialize PushSubscription to plain object for server action
      // Convert keys to string format for server action
      const subJSON = sub.toJSON();

      if (!subJSON.endpoint || !subJSON.keys) {
        throw new Error("Invalid subscription data");
      }

      const serializedSub = {
        endpoint: subJSON.endpoint,
        keys: subJSON.keys,
      };

      setSubscription(sub);
      await subscribeUser(serializedSub);
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
    }
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (message.trim()) {
      try {
        const result = await sendNotification(message);
        if (result.success) {
          setMessage("");
        } else {
          console.error("Failed to send notification:", result.error);
        }
      } catch (error) {
        console.error("Error sending test notification:", error);
      }
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Push notifications are not supported in this browser.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Get notified about important updates and interview reminders.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {subscription ? (
            <Button onClick={unsubscribeFromPush} variant="outline">
              <BellOff className="mr-2 h-4 w-4" />
              Unsubscribe
            </Button>
          ) : (
            <Button onClick={subscribeToPush}>
              <Bell className="mr-2 h-4 w-4" />
              Enable Notifications
            </Button>
          )}
        </div>

        {subscription && (
          <div className="space-y-2">
            <Label htmlFor="message">Test Notification</Label>
            <div className="flex gap-2">
              <Input
                id="message"
                type="text"
                placeholder="Enter test message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button onClick={sendTestNotification} disabled={!message.trim()}>
                Send
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

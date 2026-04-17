// Type definitions for PWA functionality

export interface SerializedPushSubscription {
  endpoint: string;
  keys: Record<string, string>;
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
}

export interface PWAActionResult {
  success: boolean;
  error?: string;
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import LoadingState from "@/components/loading-state";
import ErrorState from "@/components/error-state";

const SettingsView = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Fetch current user profile
  const { 
    data: userProfile, 
    isLoading, 
    error 
  } = useQuery(trpc.user.getProfile.queryOptions());

  // Local form state
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  // Update form data when userProfile loads
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        image: userProfile.image || "",
      });
    }
  }, [userProfile]);

  // Update mutation
  const updateProfile = useMutation(
    trpc.user.updateProfile.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.user.getProfile.queryOptions());
        toast.success("Profile updated successfully!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile.mutate({
      name: formData.name,
      image: formData.image || null,
    });
  };

  const hasChanges = 
    formData.name !== userProfile?.name ||
    formData.image !== (userProfile?.image || "");

  if (isLoading) {
    return (
      <LoadingState
        title="Loading Settings"
        description="Fetching your profile settings..."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Error Loading Settings"
        description="Unable to load your profile settings. Please try again."
      />
    );
  }

  return (
    <div className="flex flex-col p-6 gap-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile information.
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your basic profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email Field (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={userProfile?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed from here
              </p>
            </div>

            {/* Profile Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Profile Image URL</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://example.com/your-image.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL to your profile picture (optional)
              </p>
            </div>

            {/* Save Button */}
            <Button 
              type="submit" 
              disabled={!hasChanges || updateProfile.isPending}
              className="w-full sm:w-auto"
            >
              <Save className="mr-2 h-4 w-4" />
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsView;

export const SettingsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Settings"
      description="Fetching your account settings..."
    />
  );
};

export const SettingsViewError = () => {
  return (
    <ErrorState
      title="Error Loading Settings"
      description="Unable to load account settings. Please try again."
    />
  );
};
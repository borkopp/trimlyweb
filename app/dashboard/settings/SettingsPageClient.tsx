"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { updateBarbershopSettings } from "@/app/actions/barbershop-actions";
import { Tables } from "@/database.types";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

type BarbershopSettings = Tables<"barbershop">;

export default function SettingsPageClient({
  initialSettings,
  refreshSettings,
}: {
  initialSettings: BarbershopSettings;
  refreshSettings: () => Promise<BarbershopSettings>;
}) {
  const [settings, setSettings] = useState<BarbershopSettings>(initialSettings);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateBarbershopSettings(settings);
      const updatedSettings = await refreshSettings();
      setSettings(updatedSettings);
      toast({
        title: "Settings updated",
        description: "Your barbershop settings have been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage your barbershop&apos;s general information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Barbershop Name</Label>
              <Input id="name" name="name" value={settings.name || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Address</Label>
              <Textarea id="location" name="location" value={settings.location || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={settings.phone || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="opening_time">Opening Time</Label>
              <Input id="opening_time" name="opening_time" type="time" value={settings.opening_time || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closing_time">Closing Time</Label>
              <Input id="closing_time" name="closing_time" type="time" value={settings.closing_time || ""} onChange={handleInputChange} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white self-center"></div>
                  <span className="ml-2">Updating...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

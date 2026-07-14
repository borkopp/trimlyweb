"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnjeqkna";

export function AccountDeletionForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(event.currentTarget),
        headers: {
          Accept: "application/json",
        },
      });

      const result = (await response.json().catch(() => null)) as {
        errors?: Array<{ message?: string }>;
      } | null;

      if (!response.ok) {
        const message = result?.errors
          ?.map((error) => error.message)
          .filter(Boolean)
          .join(" ");
        throw new Error(message || "Your request could not be submitted.");
      }

      setFormData({ name: "", phone: "", email: "" });
      toast.success("Deletion request received", {
        description:
          "We’ll contact you to verify the account before completing deletion.",
      });
    } catch (error) {
      toast.error("Request not submitted", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card id="deletion-request" className="scroll-mt-28">
      <CardHeader>
        <CardTitle>Submit a deletion request</CardTitle>
        <CardDescription>
          Use the details connected to your ART Barbershop account. We will
          verify your identity before deleting data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <input
            type="hidden"
            name="_subject"
            value="ART Barbershop account deletion request"
          />
          <input type="hidden" name="app" value="ART Barbershop" />
          <input
            type="hidden"
            name="request_type"
            value="Account and data deletion"
          />
          <FieldGroup className="gap-6">
            <Field>
              <FieldLabel htmlFor="deletion-name">Full name</FieldLabel>
              <Input
                id="deletion-name"
                name="name"
                placeholder="Your full name"
                autoComplete="name"
                required
                value={formData.name}
                onChange={(event) =>
                  setFormData({ ...formData, name: event.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="deletion-phone">
                Account phone number
              </FieldLabel>
              <Input
                id="deletion-phone"
                name="phone"
                type="tel"
                placeholder="+389"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={(event) =>
                  setFormData({ ...formData, phone: event.target.value })
                }
              />
              <FieldDescription>
                Enter the phone number used to sign in to ART Barbershop.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="deletion-email">Contact email</FieldLabel>
              <Input
                id="deletion-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(event) =>
                  setFormData({ ...formData, email: event.target.value })
                }
              />
              <FieldDescription>
                We will use this address only to verify and update you about
                this request.
              </FieldDescription>
            </Field>
            <Button
              className="w-full"
              disabled={isSubmitting}
              type="submit"
              variant="destructive"
            >
              <Trash2 data-icon="inline-start" />
              {isSubmitting ? "Submitting…" : "Submit deletion request"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

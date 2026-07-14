"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { toast } from "sonner";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnjeqkna";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
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
        throw new Error(message || "Your message could not be sent.");
      }

      setFormData({ name: "", email: "", message: "" });
      toast.success("Message sent", {
        description: "Thanks for reaching out. We’ll get back to you soon.",
      });
    } catch (error) {
      toast.error("Message not sent", {
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
    <div className="container relative mx-auto max-w-2xl px-4 py-24 md:py-32">
      <div className="relative z-10 mb-12 flex flex-col items-center gap-4 text-center">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
          CONTACT
        </h3>
        <h2 className="text-4xl font-semibold tracking-tighter font-montserrat sm:text-5xl">
          Let&apos;s get in touch
        </h2>
        <p className="relative mx-auto max-w-xl text-center font-lato text-[1.2rem] text-neutral-500">
          Tell us about your barbershop and the app you have in mind.
        </p>
      </div>

      <Card className="relative z-10">
        <CardHeader>
          <CardTitle>Send us a message</CardTitle>
          <CardDescription>
            We&apos;ll get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <input
              type="hidden"
              name="_subject"
              value="New Fadely website enquiry"
            />
            <FieldGroup className="gap-6">
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message"
                  className="min-h-[120px]"
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </Field>
              <Button disabled={isSubmitting} type="submit" className="w-full">
                <Send data-icon="inline-start" />
                {isSubmitting ? "Sending…" : "Send Message"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <BackgroundBeams />
    </div>
  );
}

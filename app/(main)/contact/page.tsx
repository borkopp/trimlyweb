"use client";
import {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Calendar, Mail, Phone} from "lucide-react";
import {InlineWidget} from "react-calendly";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 lg:py-32 max-w-4xl">
      <div className="space-y-4 items-center text-center mb-24">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">CONTACT</h3>
        <h2 className="text-4xl font-semibold tracking-tighter font-montserrat sm:text-5xl">Let&apos;s get in touch</h2>
        <p className="text-neutral-500 text-[1.2rem] font-lato mx-auto my-4 text-center relative">
          Feel free to write us an email or schedule a 30 minute meeting with us.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Reach out to us directly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>contact@fadely.app</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground text-sm uppercase">soon</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule a Meeting</CardTitle>
            <CardDescription>Book a time that works for you</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background rounded-lg p-4">
                <DialogHeader>
                  <DialogTitle>Schedule a Meeting</DialogTitle>
                </DialogHeader>
                <InlineWidget
                  url="https://calendly.com/borko-petrevski"
                  styles={{height: "630px", minWidth: "320px", borderRadius: "10px"}}
                  pageSettings={{
                    backgroundColor: "1a1a1a",
                    textColor: "ffffff",
                    primaryColor: "ea580b",
                  }}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

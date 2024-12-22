import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {CheckIcon} from "lucide-react";
import {CalendarScript} from "./CalendarScript";

export default function Pricing() {
  return (
    <section id="pricing" className="w-full mx-auto relative overflow-hidden">
      {/* Pricing content */}
      <div className="container py-16 lg:py-20 relative z-10">
        {/* Title */}
        <div className="space-y-4 items-center text-center mb-24">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">PRICING</h3>
          <h2 className="text-4xl font-semibold tracking-tighter font-montserrat sm:text-5xl">Solutions for everyone</h2>
          <p className="text-neutral-500 text-[1.2rem] font-lato mx-auto my-4 text-center relative">
            Whatever your status, our offers evolve according to your needs.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-center">
          {/* Card */}
          <Card className="bg-background/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="mb-7">Basic</CardTitle>
              <span className="font-bold text-5xl">€179</span>
              <span className="text-sm text-muted-foreground mt-2">per month</span>
              <span className="text-xs text-primary mt-1">Billed annually</span>
            </CardHeader>
            <CardDescription className="text-center w-11/12 mx-auto">Perfect for getting started with digital presence</CardDescription>
            <CardContent>
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">iOS and Android App</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Appointment booking</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Gallery</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={"outline"}>
                Contact us
              </Button>
            </CardFooter>
          </Card>

          {/* Card */}
          <Card className="border-primary bg-background/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <Badge className="uppercase w-max self-center mb-3">Most popular</Badge>
              <CardTitle className="!mb-7">Plus</CardTitle>
              <span className="font-bold text-5xl">€299</span>
              <span className="text-sm text-muted-foreground mt-2">per month</span>
              <span className="text-xs text-primary mt-1">Billed annually</span>
            </CardHeader>
            <CardDescription className="text-center w-11/12 mx-auto">Elevate your barbershop to the next level</CardDescription>
            <CardContent>
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">
                    All features from <b>Basic</b>
                  </span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Loyalty program</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Feedback and rating system</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Admin Dashboard</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Contact us
              </Button>
            </CardFooter>
          </Card>

          {/* Card */}
          <Card className="bg-background/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="mb-7">One-Time Payment</CardTitle>
              <span className="font-bold text-5xl">Let&apos;s talk</span>
            </CardHeader>
            <CardDescription className="text-center  w-11/12 mx-auto">Advanced features for scaling your business</CardDescription>
            <CardContent>
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">
                    All features from <b>Plus</b>
                  </span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Custom features on demand</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">
                    <b>24/7</b> Support
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={"outline"}
                data-cal-link="fadely/30min"
                data-cal-namespace="30min"
                data-cal-config='{"layout":"month_view"}'>
                Book a call
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <CalendarScript />
    </section>
  );
}

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {CheckIcon} from "lucide-react";
import ShinyButton from "./ui/shiny-button";
import {CalendarScript} from "./CalendarScript";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {loadStripe} from "@stripe/stripe-js";
import {createSubscription} from "@/app/actions/subscription-actions";
import {useToast} from "@/components/ui/use-toast";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Pricing() {
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();
  const router = useRouter();

  const handleSubscribe = async (plan: "basic" | "plus") => {
    try {
      setIsLoading(true);

      // Create the subscription and get the client secret
      const {clientSecret} = await createSubscription(plan);

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");

      // Confirm the payment with Stripe
      const {error} = await stripe.confirmCardPayment(clientSecret);

      if (error) {
        throw error;
      }

      toast({
        title: "Subscription started!",
        description: "Your 30-day trial has begun. Enjoy Fadely!",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: "Failed to start subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="pricing" className="w-full mx-auto relative overflow-hidden">
      {/* Background effects */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <ShootingStars className="absolute top-0 left-0 w-full h-full" />
        <StarsBackground className="absolute inset-0 w-full h-full" />
      </div> */}

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
        {/* End Title */}
        {/* Switch */}
        {/* <div className="flex justify-center items-center">
          <Label htmlFor="payment-schedule" className="me-3">
            Monthly
          </Label>
          <Switch id="payment-schedule" className="z-20" />
          <Label htmlFor="payment-schedule" className="relative ms-3">
            Annual
            <span className="absolute -top-10 start-auto -end-28">
              <span className="flex items-center">
                <svg className="w-14 h-8 -me-6" width={45} height={25} viewBox="0 0 45 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                    fill="currentColor"
                    className="text-muted-foreground"
                  />
                </svg>
                <Badge className="mt-3 uppercase text-white">Save up to 10%</Badge>
              </span>
            </span>
          </Label>
        </div> */}
        {/* End Switch */}
        {/* Grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-center">
          {/* Card */}
          <Card className="bg-background/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="mb-7">Basic</CardTitle>
              <span className="font-bold text-5xl">€99</span>
            </CardHeader>
            <CardDescription className="text-center  w-11/12 mx-auto">The basics</CardDescription>
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
                Sign up
              </Button>
            </CardFooter>
          </Card>
          {/* End Card */}
          {/* Card */}
          <Card className="border-primary bg-background/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <Badge className="uppercase w-max self-center mb-3">Best value</Badge>
              <CardTitle className="!mb-7">Plus</CardTitle>
              <span className="font-bold text-5xl">€139</span>
            </CardHeader>
            <CardDescription className="text-center w-11/12 mx-auto">Everything you need for a growing business</CardDescription>
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
                {/* <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Notifications & Reminders</span>
                </li> */}
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
              <Button className="w-full" variant="outline" disabled={isLoading} onClick={() => handleSubscribe("plus")}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary self-center"></div>
                    <span className="ml-2">Processing...</span>
                  </div>
                ) : (
                  "Start 30-day trial"
                )}
              </Button>
            </CardFooter>
          </Card>
          {/* End Card */}
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
          {/* End Card */}
        </div>
        {/* End Grid */}
        {/* End Comparison table */}
      </div>
      {/* End Pricing content */}
      <CalendarScript />
    </section>
  );
}

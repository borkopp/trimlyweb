import {PhoneOff, Clock, Calendar} from "lucide-react";

export default function ProblemSection() {
  return (
    <section className="bg-background">
      <div className="max-w-6xl mx-auto py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="space-y-4 items-center text-center">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">PROBLEM</h3>
            <h2 className="text-4xl font-semibold tracking-tighter font-montserrat sm:text-5xl">Interruptions and inefficiency hurt your business</h2>
          </div>
          <div className="grid gap-12 mt-32 sm:grid-cols-3">
            <div data-aos="fade-up" className="flex flex-col items-start space-y-3">
              <div className="p-3 rounded-full bg-neutral-200/40 dark:bg-neutral-800">
                <PhoneOff className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-montserrat font-medium">Interruptions During Cuts</h3>
              <p className="text-md text-neutral-500 font-lato">
                Barbers are constantly interrupted by phone calls for bookings, disrupting their work and client experience.
              </p>
            </div>
            <div data-aos="fade-up" data-aos-delay={100} className="flex flex-col items-start space-y-3">
              <div className="p-3 rounded-full bg-neutral-200/40 dark:bg-neutral-800">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-montserrat font-medium">Inefficient Scheduling</h3>
              <p className="text-md text-neutral-500 font-lato">
                Manual booking systems lead to scheduling conflicts, double bookings, and wasted time for both barbers and clients.
              </p>
            </div>
            <div data-aos="fade-up" data-aos-delay={200} className="flex flex-col items-start space-y-3">
              <div className="p-3 rounded-full bg-neutral-200/40 dark:bg-neutral-800">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-montserrat font-medium">Limited Availability</h3>
              <p className="text-md text-neutral-500 font-lato">
                Clients struggle to book appointments outside business hours or find available slots that fit their schedule.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

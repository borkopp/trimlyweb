import {
  BellRing,
  Calendar,
  Clock4,
  Smartphone,
  Image as ImageIcon,
  Star,
} from "lucide-react";

export default function Features() {
  return (
    <>
      {/* Icon Blocks */}
      <div className="container py-24 lg:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              Features
            </h2>
            <p className="mt-1 text-muted-foreground">
              All in one place. For your loyal customers.
            </p>
          </div>
          {/* End Title */}
          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
            <div className="space-y-6 lg:space-y-10">
              {/* Icon Block */}
              <div className="flex">
                <Smartphone className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Your own mobile app
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    You get your own app with your own branding including your
                    barbershop name and logo on both <b>iOS</b> and{" "}
                    <b>Android</b>.
                  </p>
                </div>
              </div>
              {/* End Icon Block */}
              {/* Icon Block */}
              <div className="flex">
                <Calendar className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Appointment booking
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Book appointments with preferred barbers, select desired
                    services with our easy to use booking interface.
                  </p>
                </div>
              </div>
              {/* End Icon Block */}

              {/* Icon Block */}
              <div className="flex">
                <BellRing className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Automatic notifications
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Receive reminders, notifications for new appointments,
                    changes in schedules and important updates.
                  </p>
                </div>
              </div>
              {/* End Icon Block */}
            </div>
            {/* End Col */}
            <div className="space-y-6 lg:space-y-10">
              {/* Icon Block */}
              <div className="flex">
                <ImageIcon className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Gallery
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Showcase your work and talent with the haircuts gallery.
                    Upload your work and attract more customers.
                  </p>
                </div>
              </div>
              {/* End Icon Block */}
              {/* Icon Block */}
              <div className="flex">
                <Clock4 className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Barber&apos;s availability
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Tailor barber availability to meet individual preferences
                    and requirements. Personalize working hours, breaks and
                    holiday schedules.
                  </p>
                </div>
              </div>
              {/* End Icon Block */}
              {/* Icon Block */}
              <div className="flex">
                <Star className="flex-shrink-0 mt-2 h-8 w-8" />
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Feedback and rating system
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Collect client feedback and ratings to improve service
                    quality, enhance customer satisfaction, and foster loyalty.
                  </p>
                </div>
              </div>
              {/* End Icon Block */}
            </div>
            {/* End Col */}
          </div>
          {/* End Grid */}
        </div>
      </div>
      {/* End Icon Blocks */}
    </>
  );
}

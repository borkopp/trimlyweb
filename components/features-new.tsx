import {cn} from "@/lib/utils";
import {IconHeart} from "@tabler/icons-react";
import {BellRing, Calendar, Clock4, ImageIcon, Settings, Smartphone, Star} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Your own mobile app",
      description: "You get your own app with your own branding including your barbershop name and logo on both iOS and Android.",
      icon: <Smartphone />,
    },
    {
      title: "Appointment booking",
      description: "Book appointments with preferred barbers, select desired services with our easy to use booking interface.",
      icon: <Calendar />,
    },
    {
      title: "Automatic notifications",
      description: "Receive reminders, notifications for new appointments, changes in schedules and important updates.",
      icon: <BellRing />,
    },
    {
      title: "Gallery",
      description: "Showcase your work and talent with the haircuts gallery. Upload your work and attract more customers.",
      icon: <ImageIcon />,
    },
    {
      title: "Barber's availability",
      description:
        "Tailor barber availability to meet individual preferences and requirements. Personalize working hours, breaks and holiday schedules.",
      icon: <Clock4 />,
    },
    {
      title: "Feedback and rating system",
      description: "Collect client feedback and ratings to improve service quality, enhance customer satisfaction, and foster loyalty.",
      icon: <Star />,
    },
    {
      title: "Admin dashboard",
      description: "Manage your barbershop with ease. Add barbers, manage appointments, and view analytics.",
      icon: <Settings />,
    },
    // {
    //   title: "30 days trial",
    //   description: "If you don't like it, you don't pay. It's that simple.",
    //   icon: <IconAdjustmentsBolt />,
    // },
    {
      title: "Affordable pricing",
      description:
        "We believe in affordable pricing. We want to help you grow your barbershop. And we want to do it in a way that is fair for both of us.",
      icon: <IconHeart />,
    },
  ];
  return (
    <div className="bg-neutral-950">
      <div className="container py-24 lg:py-36">
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Features</h2>
          <p className="mt-1 text-muted-foreground">All in one place. For your loyal customers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

const Feature = ({title, description, icon, index}: {title: string; description: string; icon: React.ReactNode; index: number}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}>
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-primary">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">{title}</span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">{description}</p>
    </div>
  );
};

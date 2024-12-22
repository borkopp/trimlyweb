"use client";
import {BellIcon, CalendarIcon, GlobeIcon} from "@radix-ui/react-icons";
import {BentoCard, BentoGrid} from "@/components/magicui/bento-grid";
import Image from "next/image";
import {ImageIcon, Monitor} from "lucide-react";
import Globe from "./magicui/globe";
import Iphone15Pro from "./magicui/iphone-15-pro";
import Safari from "./magicui/safari";
import DotPattern from "./magicui/dot-pattern";

const features = [
  {
    Icon: CalendarIcon,
    name: "Appointment Booking",
    description: "Mobile app for your customers and barbers.",
    href: "/",
    cta: "Learn more",
    delay: 50,
    background: (
      <div className="relative">
        <Iphone15Pro src="/barbercalendar.jpeg" className="absolute -right-20 -top-[520px] opacity-60" />
      </div>
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Monitor,
    name: "Dashboard",
    description: "Manage your barbershop with ease.",
    href: "/",
    cta: "Learn more",
    delay: 0,
    background: (
      <div className="absolute inset-0  overflow-hidden">
        <Safari src="/images/dashboard.png" className="absolute -right-[780px] scale-[0.9] -top-0 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-90" />
      </div>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Multilingual",
    description: "Supports 10+ languages",
    href: "/",
    cta: "Learn more",
    delay: 100,
    background: <Globe className="-right-[500px] -top-20" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: BellIcon,
    name: "Notifications",
    description: "Get reminded before appointments. Both barbers and customers.",
    href: "/",
    cta: "Learn more",
    delay: 0,
    background: (
      <div className="absolute inset-0  overflow-hidden">
        <DotPattern className="absolute -right-20 -top-20 opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-90" />
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: ImageIcon,
    name: "Gallery",
    description: "Showcase your haircuts and styles.",
    href: "/",
    delay: 150,
    cta: "Learn more",
    background: <Iphone15Pro src="/images/gallery.png" className="absolute -right-10 -top-[430px] scale-[0.65] opacity-50" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export function FeaturesBentoGrid() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard dataAos="fade-up" dataAosDelay={feature.delay} key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}

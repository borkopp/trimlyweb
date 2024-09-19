import Image from "next/image";
import {BackgroundBeams} from "@/components/ui/background-beams";

export default function HeroMockup() {
  return (
    <div className="">
      {/* <BackgroundBeams className="absolute inset-0 z-0" /> */}
      <div className="relative z-20">
        <Image className="w-full" src="/hero-mockup.png" alt="Hero" width={2000} height={1000} />
      </div>
    </div>
  );
}

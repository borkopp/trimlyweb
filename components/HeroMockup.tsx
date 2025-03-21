import {useEffect, useState} from "react";
import Iphone15Pro from "./magicui/iphone-15-pro";
import {useTheme} from "next-themes";

export default function HeroMockup() {
  const {theme} = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return dark theme images during SSR to avoid flash
    return (
      <div className="bg-background">
        <div className="relative max-w-[120rem] mx-auto">
          <div className="relative z-20 scale-75 lg:scale-100 flex justify-center items-center h-[600px]">
            <div
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="100"
              className="relative w-full h-[400px] flex justify-center items-center">
              <Iphone15Pro
                src="/images/barber-calendar-dark.png"
                className="absolute transition-all duration-1000 ease-in-out left-[25%] opacity-70 scale-[0.65] z-20"
              />
              <Iphone15Pro src="/images/homescreen-dark.png" className="absolute z-30 scale-75" />
              <Iphone15Pro
                src="/images/barber-dashboard-dark.png"
                className="absolute transition-all duration-1000 ease-in-out right-[25%] opacity-70 scale-[0.65] z-20"
              />
            </div>
          </div>
          {/* Bottom fade overlay for SSR */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/90 to-transparent z-30"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="relative max-w-[120rem] mx-auto">
        <div className="relative z-20 scale-75 lg:scale-100 flex justify-center items-center h-[600px]">
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="100"
            className="relative w-full h-[400px] flex justify-center items-center">
            {/* Left iPhone */}
            <Iphone15Pro
              src={theme === "dark" ? "/images/barber-calendar-dark.png" : "/images/barber-calendar-light.png"}
              className="absolute transition-all duration-1000 ease-in-out left-[25%] opacity-70 scale-[0.65] z-20"
            />
            {/* Center iPhone */}
            <Iphone15Pro src={theme === "dark" ? "/images/homescreen-dark.png" : "/images/homescreen-light.png"} className="absolute z-30 scale-75" />
            {/* Right iPhone */}
            <Iphone15Pro
              src={theme === "dark" ? "/images/barber-dashboard-dark.png" : "/images/barber-dashboard-light.png"}
              className="absolute transition-all duration-1000 ease-in-out right-[25%] opacity-70 scale-[0.65] z-20"
            />
          </div>
        </div>
        {/* Bottom fade overlay */}
        
      </div>
    </div>
  );
}

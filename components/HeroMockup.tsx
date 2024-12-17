import {useEffect, useState} from "react";
import Iphone15Pro from "./magicui/iphone-15-pro";

export default function HeroMockup() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

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
              src="/images/barber-calendar.png"
              className={`absolute transition-all duration-1000 ease-in-out ${
                scrolled ? "left-[15%] opacity-100 scale-75" : "left-[25%] opacity-70 scale-[0.65]"
              } z-20`}
            />
            {/* Center iPhone */}
            <Iphone15Pro src="/images/homescreen-new.png" className="absolute z-30 scale-75" />
            {/* Right iPhone */}
            <Iphone15Pro
              src="/images/barber-dashboard.png"
              className={`absolute transition-all duration-1000 ease-in-out ${
                scrolled ? "right-[15%] opacity-100 scale-75" : "right-[25%] opacity-70 scale-[0.65]"
              } z-20`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

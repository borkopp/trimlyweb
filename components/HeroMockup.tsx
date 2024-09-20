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
    <div className="relative py-16">
      <div className="relative z-20 flex justify-center items-center h-[500px]">
        <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100" className="relative w-full h-[400px] flex justify-center items-center">
          {/* Left iPhone */}
          <Iphone15Pro
            src="/barber-calendar.png"
            className={`absolute transition-all duration-1000 ease-in-out ${
              scrolled ? "left-[15%] opacity-100 scale-75" : "left-[25%] opacity-70 scale-[0.65]"
            } z-20`}
          />
          {/* Center iPhone */}
          <Iphone15Pro src="/homescreen.png" className="absolute z-30 scale-75" />
          {/* Right iPhone */}
          <Iphone15Pro
            src="/barber-dashboard.png"
            className={`absolute transition-all duration-1000 ease-in-out ${
              scrolled ? "right-[15%] opacity-100 scale-75" : "right-[25%] opacity-70 scale-[0.65]"
            } z-20`}
          />
        </div>
      </div>
    </div>
  );
}

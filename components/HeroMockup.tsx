import Iphone15Pro from "./magicui/iphone-15-pro";

export default function HeroMockup() {
  return (
    <div className="relative py-16">
      <div data-aos="fade-up" data-aos-delay="400" data-aos-duration="500" className="relative z-20 flex justify-center items-center h-[500px]">
        <div className="relative w-full h-[400px] flex justify-center items-center">
          {/* Left back iPhone */}
          {/* <Iphone15Pro src="/homescreen.png" className="absolute left-[5%] z-10 transform scale-[0.65]" /> */}
          {/* Left middle iPhone */}
          <Iphone15Pro src="/barber-calendar.png" className="absolute left-[25%] z-20 transform scale-[0.7] opacity-70" />
          {/* Center iPhone */}
          <Iphone15Pro src="/homescreen.png" className="absolute z-30 transform scale-[0.8] " />
          {/* Right middle iPhone */}
          <Iphone15Pro src="/barber-dashboard.png" className="absolute right-[25%] z-20 transform scale-[0.7] opacity-70" />
          {/* Right back iPhone */}
          {/* <Iphone15Pro src="/homescreen.png" className="absolute right-[5%] z-10 transform scale-[0.65]" /> */}
        </div>
      </div>
    </div>
  );
}

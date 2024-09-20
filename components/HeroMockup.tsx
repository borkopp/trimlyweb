import Image from "next/image";

export default function HeroMockup() {
  return (
    <div className="">
      <div data-aos="fade-up" data-aos-delay="400" data-aos-duration="500" className="relative z-20">
        <Image className="w-full" src="/hero-mockup.png" alt="Hero" width={2000} height={1000} />
      </div>
    </div>
  );
}

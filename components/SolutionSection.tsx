import {FeaturesBentoGrid} from "./FeaturesBentoGrid";
import {ShootingStars} from "./ui/shooting-stars";
import {StarsBackground} from "./ui/stars-background";

export default function SolutionSection() {
  return (
    <section
      id="solution"
      className="bg-background dark:bg-neutral-900 flex flex-col items-center justify-center relative w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="space-y-4 items-center text-center mb-24">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">SOLUTION</h3>
          <h2 className="text-4xl font-semibold tracking-tighter font-montserrat sm:text-5xl">Your own app to run your business seamlesly</h2>
          <p className="text-neutral-500 text-[1.2rem] font-lato mx-auto my-4 text-center relative">
            This is not a basic appointment scheduler. This is a full-fledged software that will help you run your business.
            <br />
            You get your own mobile app and desktop dashboard. Your name - your logo - your brand.
          </p>
        </div>
        <FeaturesBentoGrid />
      </div>
      <ShootingStars className="absolute top-0 left-0 w-full h-full z-0" />
      <StarsBackground className="absolute inset-0 w-full h-full z-0" />
    </section>
  );
}

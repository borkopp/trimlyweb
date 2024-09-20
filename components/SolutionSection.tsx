import {FeaturesBentoGrid} from "./FeaturesBentoGrid";

export default function SolutionSection() {
  return (
    <section className="w-full bg-neutral-900 mx-auto py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="space-y-4 items-center text-center mb-24">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">SOLUTION</h3>
          <h2 className="text-4xl font-semibold tracking-tighter sm:text-5xl">Your own app to run your business seamlesly.</h2>
          <p className="text-neutral-500 text-[1.2rem]  mx-auto my-4 text-center relative">
            This is not a basic appointment scheduler. This is a full-fledged software that will help you run your business.
            <br />
            You get your own mobile app and desktop dashboard. Your name - your logo - your brand.
          </p>
        </div>
        <FeaturesBentoGrid />
      </div>
    </section>
  );
}

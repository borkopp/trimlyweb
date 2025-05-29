import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqItems = [
    {
      question: "Who is this for?",
      answer:
        "This is for barbershops who want to take their business to the next level. It's ideal for those looking to offer clients a seamless, professional experience, attract new customers, and stand out from the competition. By implementing our solution, you'll elevate your barbershop's image, streamline operations, and create a modern, tech-savvy impression that today's clients expect.",
    },
    {
      question: "Why should I consider your service?",
      answer:
        "Our service is tailored specifically for the barbershop industry, addressing key challenges you face daily. We offer solutions to common issues such as appointment scheduling interruptions, client management, and operational inefficiencies. By implementing our system, you can enhance customer experience, streamline your operations, and focus on what you do best - providing excellent grooming services. Our comprehensive solution is designed to elevate your barbershop's efficiency and professionalism.",
    },
    {
      question: "What will I get?",
      answer:
        "You will get your own branded mobile app on both iOS and Android and a web dashboard. It will allow your clients to book appointments seamlessly, get notifications for upcoming appointments, see updates, promotions and much more.",
    },

    {
      question: "Is the app for the clients and for the barbers different?",
      answer:
        "No, the app for the clients and for the barbers is the same. To not make it confusing for everybody there is only one app and barbers get access to the barber dashboard where they can see upcoming appointments, manage appointments, book breaks or holidays and much more.",
    },
    {
      question: "How does the loyalty program work?",
      answer:
        "Our loyalty program rewards you for each visit. You'll earn points for every service, which can be redeemed for discounts on future appointments or product purchases. Check your point balance and available rewards in the 'Loyalty' section of the app.",
    },
    {
      question: "Can I leave feedback for my barber?",
      answer:
        "Absolutely! We encourage feedback to help maintain our high standards. After your appointment, you'll have the option to rate your experience and leave a review. This feedback is valuable for both our barbers and future clients.",
    },
  ];

  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="space-y-4 items-center text-center mb-24">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
            FAQ
          </h3>
          <h2 className="text-4xl font-semibold tracking-tighter font-montserrat sm:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl mx-auto"
        >
          {faqItems.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left text-secondary-foreground hover:text-primary transition-colors">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-secondary-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

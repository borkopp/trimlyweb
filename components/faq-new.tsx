"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const FAQs = [
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
export function SimpleFaqsWithBackground() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-20 md:px-8 md:py-40">
      <div className="space-y-4 items-center text-center mb-12">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
          FAQ
        </h3>
        <h2 className="text-4xl font-semibold tracking-tighter font-montserrat sm:text-5xl">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="mx-auto w-full max-w-3xl">
        {FAQs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            open={open}
            setOpen={setOpen}
          />
        ))}
      </div>
    </div>
  );
}

const FAQItem = ({
  question,
  answer,
  setOpen,
  open,
}: {
  question: string;
  answer: string;
  open: string | null;
  setOpen: (open: string | null) => void;
}) => {
  const isOpen = open === question;

  return (
    <div
      className="shadow-input mb-8 w-full cursor-pointer rounded-lg bg-white p-4 dark:bg-neutral-900"
      onClick={() => {
        if (isOpen) {
          setOpen(null);
        } else {
          setOpen(question);
        }
      }}
    >
      <div className="flex items-start">
        <div className="relative mr-4 mt-1 h-6 w-6 flex-shrink-0">
          <IconChevronUp
            className={cn(
              "absolute inset-0 h-6 w-6 transform text-black transition-all duration-200 dark:text-white",
              isOpen && "rotate-90 scale-0"
            )}
          />
          <IconChevronDown
            className={cn(
              "absolute inset-0 h-6 w-6 rotate-90 scale-0 transform text-black transition-all duration-200 dark:text-white",
              isOpen && "rotate-0 scale-100"
            )}
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-200">
            {question}
          </h3>
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden text-neutral-500 dark:text-neutral-400"
              >
                {answer.split("").map((line, index) => (
                  <motion.span
                    initial={{ opacity: 0, filter: "blur(5px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                      delay: index * 0.005,
                    }}
                    key={index}
                  >
                    {line}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

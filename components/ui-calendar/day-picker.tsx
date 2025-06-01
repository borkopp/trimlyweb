"use client";

import { enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker as ReactDayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui-calendar/button";

import { cn } from "@/utils/helpers/cn.helper";

import type { ComponentProps } from "react";

// ================================== //

type TDayPickerProps = ComponentProps<typeof ReactDayPicker>;

function DayPicker({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: TDayPickerProps) {
  return (
    <ReactDayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months:
          "flex flex-col select-none sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",

        month_caption:
          "flex justify-center pt-1 relative items-center capitalize",
        caption_label: "text-base",

        nav: "space-x-1 flex items-center",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
        ),
        weekdays: "flex",
        weekday: "w-9 font-medium text-sm capitalize",
        week: "flex w-full mt-2",

        day: cn(
          "size-9 flex items-center justify-center text-t-secondary text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          "[&:has([aria-selected].day-range-end)]:rounded-r-lg last:[&:has([aria-selected])]:rounded-r-lg first:[&:has([aria-selected])]:rounded-l-lg [&:has([aria-selected])]:bg-bg-secondary"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8.5 w-8 h-8 hover:bg-primary-400/15 font-normal aria-selected:opacity-100"
        ),
        selected:
          "bg-primary-600 text-white hover:bg-primary-700 focus:bg-primary-700",
        today: "text-primary",
        outside: "opacity-50 aria-selected:opacity-40",
        range_middle:
          "aria-selected:bg-bg-secondary aria-selected:text-t-primary",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({
          orientation,
          className,
          size,
          disabled,
          ...props
        }: {
          orientation?: "left" | "right" | "up" | "down";
          className?: string;
          size?: number;
          disabled?: boolean;
        }) => {
          switch (orientation) {
            case "left":
              return (
                <ChevronLeft className={cn("size-4", className)} {...props} />
              );
            case "right":
              return (
                <ChevronRight className={cn("size-4", className)} {...props} />
              );
            default:
              return (
                <ChevronLeft className={cn("size-4", className)} {...props} />
              );
          }
        },
      }}
      locale={enUS}
      {...props}
    />
  );
}

// ================================== //

export { DayPicker };

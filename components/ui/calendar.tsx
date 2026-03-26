"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months:          "flex flex-col sm:flex-row gap-4",
        month:           "flex flex-col gap-4",
        month_caption:   "flex justify-center pt-1 relative items-center w-full",
        caption_label:   "text-sm font-medium",
        nav:             "flex items-center gap-1",
        button_previous: cn(
          "absolute left-1 h-7 w-7 flex items-center justify-center rounded-md border border-border bg-transparent",
          "text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
        ),
        button_next: cn(
          "absolute right-1 h-7 w-7 flex items-center justify-center rounded-md border border-border bg-transparent",
          "text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
        ),
        month_grid:    "w-full border-collapse",
        weekdays:      "flex",
        weekday:       "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        week:          "flex w-full mt-2",
        day:           "relative p-0 text-center text-sm",
        day_button: cn(
          "h-8 w-8 rounded-md text-center text-sm font-normal transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        ),
        selected:      "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
        today:         "[&>button]:font-semibold [&>button]:underline",
        outside:       "text-muted-foreground opacity-50",
        disabled:      "text-muted-foreground opacity-50 [&>button]:cursor-not-allowed",
        range_start:   "[&>button]:rounded-r-none",
        range_end:     "[&>button]:rounded-l-none",
        range_middle:  "[&>button]:rounded-none [&>button]:bg-accent",
        hidden:        "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left"
            ? <ChevronLeft className="h-4 w-4" />
            : <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }

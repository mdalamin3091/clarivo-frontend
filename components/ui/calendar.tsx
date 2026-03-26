"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 [--cell-size:2rem]", className)}
      classNames={{
        // ── Layout ──────────────────────────────────────────────────────────
        months:        "relative flex flex-col sm:flex-row gap-4",
        month:         "flex w-full flex-col gap-4",

        // ── Caption row — padded to leave room for the nav buttons ──────────
        month_caption: "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
        caption_label: "text-sm font-medium select-none",

        // ── Nav — absolutely anchored to the top of <months> ───────────────
        nav: "absolute inset-x-0 top-0 flex h-[--cell-size] w-full items-center justify-between",
        button_previous: cn(
          "flex h-[--cell-size] w-[--cell-size] items-center justify-center",
          "rounded-md border border-border bg-transparent",
          "text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
          "aria-disabled:opacity-50 aria-disabled:cursor-not-allowed select-none",
        ),
        button_next: cn(
          "flex h-[--cell-size] w-[--cell-size] items-center justify-center",
          "rounded-md border border-border bg-transparent",
          "text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
          "aria-disabled:opacity-50 aria-disabled:cursor-not-allowed select-none",
        ),

        // ── Grid ────────────────────────────────────────────────────────────
        month_grid: "w-full border-collapse",
        weekdays:   "flex",
        weekday:    "w-8 text-center text-[0.8rem] font-normal text-muted-foreground select-none",
        week:       "mt-2 flex w-full",
        day:        "relative p-0 text-center text-sm",
        day_button: cn(
          "h-8 w-8 rounded-md text-sm font-normal transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        ),

        // ── States ──────────────────────────────────────────────────────────
        selected: cn(
          "[&>button]:bg-primary [&>button]:text-primary-foreground",
          "[&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
        ),
        today:        "[&>button]:bg-accent [&>button]:text-accent-foreground [&>button]:font-semibold",
        outside:      "text-muted-foreground opacity-40",
        disabled:     "text-muted-foreground opacity-40 [&>button]:cursor-not-allowed",
        range_start:  "[&>button]:rounded-r-none",
        range_end:    "[&>button]:rounded-l-none",
        range_middle: "[&>button]:rounded-none [&>button]:bg-accent",
        hidden:       "invisible",

        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left"
            ? <ChevronLeftIcon  className="h-4 w-4" />
            : <ChevronRightIcon className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }

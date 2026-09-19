import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/15 text-primary dark:bg-primary/20",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive/15 text-destructive dark:bg-destructive/25",
        outline: "text-foreground border-border",
        // Specific WhatsApp Dashboard Statuses
        pending:
          "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400 dark:bg-amber-500/15",
        confirmed:
          "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400 dark:bg-blue-500/15",
        preparing:
          "border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-400 dark:bg-purple-500/15",
        out_for_delivery:
          "border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 dark:bg-cyan-500/15",
        delivered:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 dark:bg-emerald-500/15",
        cancelled:
          "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400 dark:bg-rose-500/15",
        paid:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        cod:
          "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

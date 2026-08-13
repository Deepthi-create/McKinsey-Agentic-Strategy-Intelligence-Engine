import { cn } from "../../lib/utils";

export function Input(props) {
  return <input {...props} className={cn("h-11 w-full rounded-lg border border-slate-300/80 bg-white px-3 text-sm text-slate-950 shadow-sm shadow-slate-900/[0.03] outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-primary/70 focus:bg-white focus:ring-2 focus:ring-primary/25 dark:border-border/80 dark:bg-background/70 dark:text-foreground dark:shadow-none dark:placeholder:text-muted-foreground/70 dark:hover:border-border dark:focus:bg-elevated/80", props.className)} />;
}

export function Textarea(props) {
  return <textarea {...props} className={cn("min-h-28 w-full rounded-lg border border-slate-300/80 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm shadow-slate-900/[0.03] outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-primary/70 focus:bg-white focus:ring-2 focus:ring-primary/25 dark:border-border/80 dark:bg-background/70 dark:text-foreground dark:shadow-none dark:placeholder:text-muted-foreground/70 dark:hover:border-border dark:focus:bg-elevated/80", props.className)} />;
}

export function Select({ children, ...props }) {
  return <select {...props} className={cn("h-11 w-full rounded-lg border border-slate-300/80 bg-white px-3 text-sm text-slate-950 shadow-sm shadow-slate-900/[0.03] outline-none transition-all duration-200 hover:border-slate-400 focus:border-primary/70 focus:bg-white focus:ring-2 focus:ring-primary/25 dark:border-border/80 dark:bg-background/70 dark:text-foreground dark:shadow-none dark:hover:border-border dark:focus:bg-elevated/80", props.className)}>{children}</select>;
}

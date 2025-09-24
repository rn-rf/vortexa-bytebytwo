import { cn } from "@/lib/utils"

interface BannerProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "primary" | "secondary"
}

export function Banner({ children, className, variant = "default" }: BannerProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-6 text-center",
        {
          "bg-card text-card-foreground border": variant === "default",
          "bg-primary text-primary-foreground": variant === "primary",
          "bg-secondary text-secondary-foreground": variant === "secondary",
        },
        className
      )}
    >
      {children}
    </div>
  )
}
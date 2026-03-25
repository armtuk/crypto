import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

const Spinner: React.FC<{className?: string}> = ({ className }) => {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
    />
  )
}

export { Spinner }

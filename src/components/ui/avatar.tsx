"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}

const Avatar = ({ className, children, ...props }: AvatarProps) => {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  className?: string
  onLoadingStatusChange?: (status: "idle" | "loading" | "loaded" | "error") => void
}

const AvatarImage = ({ 
  className, 
  src,
  alt = "",
  onLoadingStatusChange,
  ...props 
}: AvatarImageProps) => {
  const [imageStatus, setImageStatus] = React.useState<"idle" | "loading" | "loaded" | "error">("idle")

  React.useEffect(() => {
    if (!src) {
      setImageStatus("error")
      return
    }

    setImageStatus("loading")

    const img = new Image()
    img.src = src
    
    img.onload = () => {
      setImageStatus("loaded")
      onLoadingStatusChange?.("loaded")
    }
    
    img.onerror = () => {
      setImageStatus("error")
      onLoadingStatusChange?.("error")
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, onLoadingStatusChange])

  if (imageStatus !== "loaded") {
    return null
  }

  return (
    <img
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      src={src}
      alt={alt}
      {...props}
    />
  )
}

type AvatarFallbackProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
  delay?: number
}

const AvatarFallback = ({ 
  className, 
  children,
  delay = 0,
  ...props 
}: AvatarFallbackProps) => {
  const [canRender, setCanRender] = React.useState(delay === 0)

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setCanRender(true), delay)
      return () => clearTimeout(timer)
    }
  }, [delay])

  if (!canRender) {
    return null
  }

  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "bg-gray-5 flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Avatar, AvatarImage, AvatarFallback }

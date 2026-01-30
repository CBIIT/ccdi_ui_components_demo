"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type BannerProps = React.HTMLAttributes<HTMLElement> & {
  languageToggle?: {
    text: string
    href: string 
    label: string
  }
};

const Banner = React.forwardRef<HTMLElement, BannerProps>(
  ({ languageToggle, className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        aria-label="Official government website"
        className={cn("bg-gray-5", className)}
        {...props}
      >
        <header className="py-2 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-4 min-h-7">
              <div className="flex items-center gap-2">
              {/* Flag */}
                <div className="pt-0.5 md:pt-0 shrink-0 w-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64">
                    <path fill="#DB3E1F" d="M32 10h32v4H32zM32 18h32v4H32zM32 26h32v4H32zM32 34h32v4H32zM0 42h64v4H0zM0 50h64v4H0z"/>
                    <path fill="#fff" d="M32 14h32v4H32zM32 22h32v4H32zM32 30h32v4H32z"/>
                    <path fill="#fff" d="M32 30h32v4H32zM0 46h64v4H0zM0 38h64v4H0z"/>
                    <path fill="#fff" d="M0 38h64v4H0z"/>
                    <path fill="#1D33B1" d="M0 10h32v28H0z"/>
                    <path fill="#fff" d="M4 14h4v4H4zM8 22h4v4H8zM4 30h4v4H4zM12 14h4v4h-4zM16 22h4v4h-4zM12 30h4v4h-4zM20 14h4v4h-4zM24 22h4v4h-4zM20 30h4v4h-4z"/>
                  </svg>
                </div>
                <span className="font-open-sans text-xs text-gray-90">
                  {languageToggle?.text || 'An official website of the United States government'}
                </span>
              </div>
              {languageToggle && (
                <a
                  href={languageToggle.href || '#'}
                  className="text-sm text-blue-60v hover:text-blue-warm-70v underline focus:outline focus:outline-4 focus:outline-blue-40v"
                >
                  {languageToggle.label || 'English'}
                </a>
              )}
            </div>
          </div>
        </header>
      </section>
    )
  }
)
Banner.displayName = "Banner"

export { Banner }
export type { BannerProps }


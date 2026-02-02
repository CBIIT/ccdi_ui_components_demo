"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icon } from "./icon"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("@container flex justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex space-x-2", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("h-10 min-w-10 inline-flex", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
  isLast?: boolean
} & React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  isLast,
  children,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    aria-label={isLast ? `Last page, page ${children}` : `Page ${children}`}
    className={cn(
      "p-2 w-full flex rounded border border-gray-90/20 text-blue-60 justify-center items-center hover:text-blue-warm-70 hover:border-blue-warm-70 focus:text-blue-warm-70 focus:border-blue-warm-70 focus:outline focus:outline-offset-0 focus:outline-4 focus:outline-blue-40 font-public-sans",
      isActive && "bg-gray-90 text-white hover:text-white focus:text-white",
      className
    )}
    {...props}
  >
    {children}
  </a>
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationItem className="h-10 min-w-10 hidden tablet:inline-flex">
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("pr-2 mr-3 inline-flex items-center text-blue-60 hover:underline hover:text-blue-warm-70 focus:underline focus:text-blue-warm-70 focus:outline focus:outline-4 focus:outline-blue-40 border-0", className)}
      {...props}
    >
      <Icon icon="navigate_before" size="xs" className="align-middle size-4" aria-hidden="true" />
      Previous
    </PaginationLink>
  </PaginationItem>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationItem className="h-10 min-w-10 hidden tablet:inline-flex">
    <PaginationLink
      aria-label="Go to next page"
      className={cn("pl-2 ml-3 inline-flex items-center text-blue-60 hover:underline hover:text-blue-warm-70 focus:underline focus:text-blue-warm-70 focus:outline focus:outline-4 focus:outline-blue-40 border-0", className)}
      {...props}
    >
      Next
      <Icon icon="navigate_next" size="xs" className="align-middle size-4" aria-hidden="true" />
    </PaginationLink>
  </PaginationItem>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    aria-label="ellipsis indicating non-visible pages"
    className={cn("h-10 min-w-10 p-2 select-none flex items-center justify-center", className)}
    {...props}
  >
    <span>...</span>
  </li>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} 
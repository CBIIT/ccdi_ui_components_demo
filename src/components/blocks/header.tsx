"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Search } from "@/components/ui/search"
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"

// Types for navigation structure
export interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
  children?: NavigationItem[]
}

export interface HeaderNavigation {
  primary: NavigationItem[]
  secondary?: NavigationItem[]
}

// Header variants
const headerVariants = cva(
  "bg-white border-b border-gray-cool-10",
  {
    variants: {
      variant: {
        default: "",
        extended: "border-b-0"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

// Navigation dropdown component
const NavigationDropdown: React.FC<{
  item: NavigationItem
  isMobile?: boolean
}> = ({ item, isMobile = false }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [focusedIndex, setFocusedIndex] = React.useState(-1)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!item.children) return

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(0)
        } else if (focusedIndex >= 0) {
          // Navigate to focused item
          const focusedItem = item.children[focusedIndex]
          if (focusedItem) {
            window.location.href = focusedItem.href
          }
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(0)
        } else if (item.children) {
          setFocusedIndex(prev => 
            prev < item.children!.length - 1 ? prev + 1 : 0
          )
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(item.children ? item.children.length - 1 : 0)
        } else if (item.children) {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : item.children!.length - 1
          )
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setFocusedIndex(-1)
        buttonRef.current?.focus()
        break
      case 'Tab':
        if (isOpen) {
          setIsOpen(false)
          setFocusedIndex(-1)
        }
        break
    }
  }

  // Close dropdown and reset focus
  const closeDropdown = () => {
    setIsOpen(false)
    setFocusedIndex(-1)
  }

  if (!item.children) {
    return (
      <a
        href={item.href}
        className={cn(
          isMobile
            ? "block py-3 px-4 leading-none text-gray-60 hover:text-blue-60 hover:bg-gray-5 focus:outline focus:outline-4 focus:outline-blue-40"
            : cn(
                "relative p-4 flex font-bold text-gray-cool-60 focus:outline focus:outline-4 focus:outline-blue-40 hover:text-blue-60 hover:after:bg-blue-60  hover:after:absolute hover:after:-bottom-1 hover:after:inset-x-4 hover:after:h-1",
                item.isActive && "after:bg-blue-60 after:absolute after:-bottom-1 after:inset-x-4 after:h-1"
              )
        )}
      >
        {item.label}
      </a>
    )
  }

  if (isMobile) {
    return (
      <div className="border-t border-t-gray-10">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={cn(
            "text-left group relative flex items-center justify-between w-full py-3 pl-4 leading-none hover:bg-gray-5 focus:z-10 focus:outline focus:outline-4 focus:outline-blue-40 gap-3",
            item.isActive && "font-bold after:block after:absolute after:bg-blue-60 after:inset-y-1 after:left-0 after:w-1 after:rounded-full"
          )}
          aria-expanded={isOpen}
        >
          <span className={cn(
            "text-gray-60 group-hover:text-blue-60",
            item.isActive && "text-blue-60"
          )}>
            {item.label}
          </span>
          <span className="h-full flex items-center">
            <Icon 
              icon={isOpen ? "remove" : "add"} 
              size="sm" 
              className="size-5" 
            />
          </span>
        </button>
        {isOpen && (
          <ul>
            {item.children.map((child, index) => (
              <li key={index} className="border-t border-t-gray-10">
                <a
                  href={child.href}
                  className={cn(
                    "block py-2 pl-8 pr-4 text-gray-60 hover:text-blue-60 hover:bg-gray-5 focus:outline focus:outline-4 focus:outline-blue-40",
                    focusedIndex === index && "bg-gray-5 text-blue-60"
                  )}
                  onClick={closeDropdown}
                >
                  {child.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => closeDropdown(), 150)}
        className={cn(
          "relative flex items-center gap-1 group p-4 font-bold text-gray-cool-60 focus:outline focus:outline-4 focus:outline-blue-40",
          isOpen && "bg-blue-warm-80 text-white",
          item.isActive && !isOpen && "after:bg-blue-60  after:absolute after:-bottom-1 after:inset-x-4 after:h-1",
          isOpen && "after:hidden"
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span>{item.label}</span>
        <div aria-hidden="true" className="hidden lg:inline-flex">
          <Icon 
            icon={isOpen ? "arrow_drop_up" : "arrow_drop_down"} 
            size="xs" 
            className="align-middle size-4" 
          />
        </div>
      </button>
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute outline-none z-10 bg-blue-warm-80 py-2 w-60 leading-snug"
          role="menu"
        >
          {item.children.map((child, index) => (
            <a
              key={index}
              href={child.href}
              role="menuitem"
              className={cn(
                "flex text-white py-2 px-4 hover:underline focus:outline focus:outline-4 focus:-outline-offset-4 focus:outline-blue-40",
                focusedIndex === index && "underline bg-blue-warm-70"
              )}
              onClick={closeDropdown}
            >
              {child.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

// Desktop navigation component
const DesktopNavigation: React.FC<{
  navigation: HeaderNavigation
  onSearch?: (value: string) => void
}> = ({ navigation, onSearch }) => (
  <nav className="flex justify-end items-center pl-2 pb-1">
    <ul className="flex">
      {navigation.primary.map((item, index) => (
        <li key={index} className="leading-none">
          <NavigationDropdown item={item} />
        </li>
      ))}
    </ul>

    <section aria-label="search component">
      <Search
        iconOnly
        onSearch={onSearch}
        className="max-w-lg"
        inputProps={{
          className: "h-8 border-r-0"
        }}
        buttonProps={{
          className: "h-8 px-3"
        }}
      />
    </section>
  </nav>
)

// Mobile navigation component
const MobileNavigation: React.FC<{
  navigation: HeaderNavigation
  onSearch?: (value: string) => void
}> = ({ navigation, onSearch }) => (
  <div className="flex flex-col gap-6 pt-16 pb-4 px-4 bg-white w-60 fixed right-0 inset-y-0 overflow-auto">
    <DialogClose className="absolute top-0 right-0 size-12 flex items-center justify-center text-black bg-transparent focus:outline focus:outline-4 focus:-outline-offset-4 focus:outline-blue-40" aria-label="Close">
      <Icon icon="close" size="sm" className="size-6" />
    </DialogClose>

    <ul className="flex flex-col">
      {navigation.primary.map((item, index) => (
        <li key={index}>
          <NavigationDropdown item={item} isMobile />
        </li>
      ))}
    </ul>

    <div className="flex flex-col gap-4">
      {navigation.secondary && navigation.secondary.length > 0 && (
        <ul>
          {navigation.secondary.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="text-gray-50 text-sm leading-1 hover:underline hover:text-blue-60 focus:outline focus:outline-4 focus:outline-blue-40"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      <section aria-label="search component">
        <Search
          onSearch={onSearch}
          inputProps={{
            className: "bg-transparent h-8 border-r-0"
          }}
          buttonProps={{
            className: "h-8 px-3"
          }}
        />
      </section>
    </div>
  </div>
)

export interface HeaderProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof headerVariants> {
  projectTitle: string
  projectTitleHref?: string
  navigation: HeaderNavigation
  onSearch?: (value: string) => void
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({
    className,
    variant,
    projectTitle,
    projectTitleHref = "/",
    navigation,
    onSearch,
    ...props
  }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(headerVariants({ variant }), className)}
        {...props}
      >
        <div className="w-full">
          <div className={cn(
            "max-w-5xl flex mx-auto justify-between items-center border-b border-b-gray-cool-10 px-4",
            variant === "extended" ? "lg:items-end lg:border-b-0" : "lg:items-end lg:border-b-0"
          )}>
            {/* Project Title */}
            <div className={cn(
              "lg:w-1/3 w-full",
              variant === "extended" ? "lg:text-4xl lg:pt-8 lg:pb-6" : "lg:text-2xl lg:mt-8 lg:mb-4"
            )}>
              <em className="font-bold not-italic">
                <a
                  className="text-gray-90 focus:outline focus:outline-4 focus:outline-blue-40v"
                  href={projectTitleHref}
                >
                  {projectTitle}
                </a>
              </em>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="uppercase ml-auto leading-none text-white text-sm h-12 px-3 bg-blue-60v hover:bg-blue-warm-70v active:bg-blue-warm-80v focus:outline focus:outline-4 focus:outline-blue-40v"
                  >
                    Menu
                  </Button>
                </DialogTrigger>
                <DialogContent className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center p-4">
                  <MobileNavigation navigation={navigation} onSearch={onSearch} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Desktop Navigation - only show for default variant */}
            {variant !== "extended" && (
              <div className="hidden lg:flex ml-auto">
                <DesktopNavigation navigation={navigation} onSearch={onSearch} />
              </div>
            )}
          </div>

          {/* Extended variant navigation */}
          {variant === "extended" && (
            <div className="hidden lg:block border-t border-t-gray-cool-10">
              <DesktopNavigation navigation={navigation} onSearch={onSearch} />
            </div>
          )}
        </div>
      </header>
    )
  }
)

Header.displayName = "Header"

export { Header, headerVariants }
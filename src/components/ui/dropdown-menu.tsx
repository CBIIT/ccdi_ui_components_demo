"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icon } from "./icon"

// ============================================
// DROPDOWN MENU ROOT
// ============================================
type DropdownMenuProps = {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const DropdownMenu = ({ children, open: controlledOpen, onOpenChange }: DropdownMenuProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  
  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const setIsOpen = React.useCallback((value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value)
    } else {
      setUncontrolledOpen(value)
    }
  }, [onOpenChange])

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

// ============================================
// CONTEXT
// ============================================
type DropdownMenuContextType = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | undefined>(undefined)

const useDropdownMenu = () => {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error('DropdownMenu components must be used within DropdownMenu')
  }
  return context
}

// ============================================
// TRIGGER
// ============================================
type DropdownMenuTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ children, asChild, className, ...props }, ref) => {
    const { isOpen, setIsOpen } = useDropdownMenu()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      setIsOpen(!isOpen)
      props.onClick?.(e)
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        onClick: handleClick,
        'aria-expanded': isOpen,
        'aria-haspopup': 'true',
      })
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={className}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

// ============================================
// CONTENT
// ============================================
type DropdownMenuContentProps = React.HTMLAttributes<HTMLDivElement> & {
  sideOffset?: number
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ children, className, sideOffset = 4, align = "start", side = "bottom", ...props }, ref) => {
    const { isOpen, setIsOpen } = useDropdownMenu()
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (isOpen) {
        const handleClickOutside = (event: MouseEvent) => {
          if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
            setIsOpen(false)
          }
        }

        const handleEscape = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            setIsOpen(false)
          }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)

        return () => {
          document.removeEventListener('mousedown', handleClickOutside)
          document.removeEventListener('keydown', handleEscape)
        }
      }
    }, [isOpen, setIsOpen])

    if (!isOpen) return null

    return (
      <div
        ref={contentRef}
        role="menu"
        className={cn(
          "absolute z-50 min-w-[8rem] overflow-hidden rounded border border-gray-30",
          "bg-white shadow-lg",
          "p-1",
          "animate-in fade-in-0 zoom-in-95",
          side === "bottom" && "slide-in-from-top-2",
          side === "top" && "slide-in-from-bottom-2",
          side === "left" && "slide-in-from-right-2",
          side === "right" && "slide-in-from-left-2",
          className
        )}
        style={{
          marginTop: side === "bottom" ? `${sideOffset}px` : undefined,
          marginBottom: side === "top" ? `${sideOffset}px` : undefined,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
DropdownMenuContent.displayName = "DropdownMenuContent"

// ============================================
// PORTAL (No-op for native implementation)
// ============================================
const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

// ============================================
// GROUP
// ============================================
type DropdownMenuGroupProps = React.HTMLAttributes<HTMLDivElement>

const DropdownMenuGroup = React.forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} role="group" className={className} {...props} />
  }
)
DropdownMenuGroup.displayName = "DropdownMenuGroup"

// ============================================
// ITEM
// ============================================
type DropdownMenuItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  inset?: boolean
  variant?: "default" | "destructive"
}

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, inset, variant = "default", children, ...props }, ref) => {
    const { setIsOpen } = useDropdownMenu()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(e)
      if (!props.disabled) {
        setIsOpen(false)
      }
    }

    return (
      <button
        ref={ref}
        role="menuitem"
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5",
          "text-sm font-source-sans outline-hidden text-left",
          "focus:bg-blue-5 focus:text-blue-70v",
          "hover:bg-blue-5 hover:text-blue-70v",
          "disabled:pointer-events-none disabled:opacity-50",
          variant === "destructive" && [
            "text-red-60v",
            "focus:bg-red-10 focus:text-red-70v",
            "hover:bg-red-10 hover:text-red-70v"
          ],
          inset && "pl-8",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)
DropdownMenuItem.displayName = "DropdownMenuItem"

// ============================================
// CHECKBOX ITEM
// ============================================
type DropdownMenuCheckboxItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const DropdownMenuCheckboxItem = React.forwardRef<HTMLButtonElement, DropdownMenuCheckboxItemProps>(
  ({ className, children, checked, onCheckedChange, ...props }, ref) => {
    return (
      <button
        ref={ref}
        role="menuitemcheckbox"
        aria-checked={checked}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center gap-2 rounded py-1.5 pr-2 pl-8",
          "text-sm font-source-sans outline-hidden text-left",
          "focus:bg-blue-5 focus:text-blue-70v",
          "hover:bg-blue-5 hover:text-blue-70v",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        onClick={(e) => {
          onCheckedChange?.(!checked)
          props.onClick?.(e)
        }}
        {...props}
      >
        <span className="absolute left-2 flex size-3.5 items-center justify-center">
          {checked && <Icon icon="check" className="size-4 text-blue-60v" />}
        </span>
        {children}
      </button>
    )
  }
)
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

// ============================================
// RADIO GROUP
// ============================================
type DropdownMenuRadioGroupProps = {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

const DropdownMenuRadioGroup = ({ value, onValueChange, children }: DropdownMenuRadioGroupProps) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div role="group">{children}</div>
    </RadioGroupContext.Provider>
  )
}

type RadioGroupContextType = {
  value?: string
  onValueChange?: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextType | undefined>(undefined)

const useRadioGroup = () => {
  const context = React.useContext(RadioGroupContext)
  if (!context) {
    throw new Error('DropdownMenuRadioItem must be used within DropdownMenuRadioGroup')
  }
  return context
}

// ============================================
// RADIO ITEM
// ============================================
type DropdownMenuRadioItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string
}

const DropdownMenuRadioItem = React.forwardRef<HTMLButtonElement, DropdownMenuRadioItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: groupValue, onValueChange } = useRadioGroup()
    const isChecked = groupValue === value

    return (
      <button
        ref={ref}
        role="menuitemradio"
        aria-checked={isChecked}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center gap-2 rounded py-1.5 pr-2 pl-8",
          "text-sm font-source-sans outline-hidden text-left",
          "focus:bg-blue-5 focus:text-blue-70v",
          "hover:bg-blue-5 hover:text-blue-70v",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        onClick={(e) => {
          onValueChange?.(value)
          props.onClick?.(e)
        }}
        {...props}
      >
        <span className="absolute left-2 flex size-3.5 items-center justify-center">
          {isChecked && (
            <div className="size-2 rounded-full bg-blue-60v" />
          )}
        </span>
        {children}
      </button>
    )
  }
)
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

// ============================================
// LABEL
// ============================================
type DropdownMenuLabelProps = React.HTMLAttributes<HTMLDivElement> & {
  inset?: boolean
}

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ className, inset, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "px-2 py-1.5 text-sm font-bold font-source-sans text-gray-90",
          inset && "pl-8",
          className
        )}
        {...props}
      />
    )
  }
)
DropdownMenuLabel.displayName = "DropdownMenuLabel"

// ============================================
// SEPARATOR
// ============================================
type DropdownMenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-gray-20", className)}
        {...props}
      />
    )
  }
)
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

// ============================================
// SHORTCUT
// ============================================
type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>

const DropdownMenuShortcut = React.forwardRef<HTMLSpanElement, DropdownMenuShortcutProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "ml-auto text-sm tracking-widest text-gray-50 font-source-sans",
          className
        )}
        {...props}
      />
    )
  }
)
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

// ============================================
// SUB MENU
// ============================================
type DropdownMenuSubProps = {
  children: React.ReactNode
}

const DropdownMenuSub = ({ children }: DropdownMenuSubProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <SubMenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SubMenuContext.Provider>
  )
}

type SubMenuContextType = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const SubMenuContext = React.createContext<SubMenuContextType | undefined>(undefined)

const useSubMenu = () => {
  const context = React.useContext(SubMenuContext)
  if (!context) {
    throw new Error('SubMenu components must be used within DropdownMenuSub')
  }
  return context
}

// ============================================
// SUB TRIGGER
// ============================================
type DropdownMenuSubTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  inset?: boolean
}

const DropdownMenuSubTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuSubTriggerProps>(
  ({ className, inset, children, ...props }, ref) => {
    const { setIsOpen } = useSubMenu()

    return (
      <button
        ref={ref}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5",
          "text-sm font-source-sans outline-hidden text-left",
          "focus:bg-blue-5 focus:text-blue-70v",
          "hover:bg-blue-5 hover:text-blue-70v",
          "data-[state=open]:bg-blue-5 data-[state=open]:text-blue-70v",
          inset && "pl-8",
          className
        )}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        {...props}
      >
        {children}
        <Icon icon="navigate_next" className="ml-auto size-4" />
      </button>
    )
  }
)
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger"

// ============================================
// SUB CONTENT
// ============================================
type DropdownMenuSubContentProps = React.HTMLAttributes<HTMLDivElement>

const DropdownMenuSubContent = React.forwardRef<HTMLDivElement, DropdownMenuSubContentProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen } = useSubMenu()

    if (!isOpen) return null

    return (
      <div
        ref={ref}
        className={cn(
          "absolute left-full top-0 z-50 ml-1 min-w-[8rem] rounded border border-gray-30",
          "bg-white shadow-lg",
          "p-1",
          "animate-in fade-in-0 zoom-in-95 slide-in-from-left-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
DropdownMenuSubContent.displayName = "DropdownMenuSubContent"

// ============================================
// EXPORTS
// ============================================
export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}

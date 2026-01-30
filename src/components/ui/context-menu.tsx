"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icon } from "./icon"

// ============================================
// CONTEXT MENU ROOT
// ============================================
type ContextMenuProps = {
  children: React.ReactNode
}

const ContextMenu = ({ children }: ContextMenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const menuRef = React.useRef<HTMLDivElement>(null)

  const handleContextMenu = React.useCallback((e: MouseEvent) => {
    e.preventDefault()
    setPosition({ x: e.clientX, y: e.clientY })
    setIsOpen(true)
  }, [])

  const handleClick = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [isOpen, handleClick])

  return (
    <ContextMenuContext.Provider value={{ isOpen, position, setIsOpen, handleContextMenu, menuRef }}>
      {children}
    </ContextMenuContext.Provider>
  )
}

// ============================================
// CONTEXT
// ============================================
type ContextMenuContextType = {
  isOpen: boolean
  position: { x: number; y: number }
  setIsOpen: (isOpen: boolean) => void
  handleContextMenu: (e: MouseEvent) => void
  menuRef: React.RefObject<HTMLDivElement | null>
}

const ContextMenuContext = React.createContext<ContextMenuContextType | undefined>(undefined)

const useContextMenu = () => {
  const context = React.useContext(ContextMenuContext)
  if (!context) {
    throw new Error('ContextMenu components must be used within ContextMenu')
  }
  return context
}

// ============================================
// TRIGGER
// ============================================
type ContextMenuTriggerProps = {
  children: React.ReactNode
  className?: string
}

const ContextMenuTrigger = ({ children, className }: ContextMenuTriggerProps) => {
  const { handleContextMenu } = useContextMenu()
  const triggerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const element = triggerRef.current
    if (element) {
      element.addEventListener('contextmenu', handleContextMenu as any)
      return () => element.removeEventListener('contextmenu', handleContextMenu as any)
    }
  }, [handleContextMenu])

  return (
    <div ref={triggerRef} className={cn("inline-block", className)}>
      {children}
    </div>
  )
}

// ============================================
// CONTENT
// ============================================
type ContextMenuContentProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  className?: string
}

const ContextMenuContent = React.forwardRef<HTMLDivElement, ContextMenuContentProps>(
  ({ children, className, ...props }, ref) => {
    const { isOpen, position, menuRef } = useContextMenu()
    const [adjustedPosition, setAdjustedPosition] = React.useState(position)

    React.useEffect(() => {
      if (isOpen && menuRef.current) {
        const menu = menuRef.current
        const rect = menu.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        let x = position.x
        let y = position.y

        // Adjust if menu goes off right edge
        if (x + rect.width > viewportWidth) {
          x = viewportWidth - rect.width - 8
        }

        // Adjust if menu goes off bottom edge
        if (y + rect.height > viewportHeight) {
          y = viewportHeight - rect.height - 8
        }

        setAdjustedPosition({ x, y })
      }
    }, [isOpen, position, menuRef])

    if (!isOpen) return null

    return (
      <div
        ref={menuRef}
        className={cn(
          "fixed z-50 min-w-[12rem] rounded border border-gray-30",
          "bg-white shadow-lg",
          "p-1",
          "animate-in fade-in-0 zoom-in-95",
          className
        )}
        style={{
          left: `${adjustedPosition.x}px`,
          top: `${adjustedPosition.y}px`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ContextMenuContent.displayName = "ContextMenuContent"

// ============================================
// ITEM
// ============================================
type ContextMenuItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  inset?: boolean
  variant?: "default" | "destructive"
}

const ContextMenuItem = React.forwardRef<HTMLButtonElement, ContextMenuItemProps>(
  ({ className, inset, variant = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5",
          "text-sm font-source-sans outline-hidden",
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
        {...props}
      >
        {children}
      </button>
    )
  }
)
ContextMenuItem.displayName = "ContextMenuItem"

// ============================================
// CHECKBOX ITEM
// ============================================
type ContextMenuCheckboxItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const ContextMenuCheckboxItem = React.forwardRef<HTMLButtonElement, ContextMenuCheckboxItemProps>(
  ({ className, children, checked, onCheckedChange, ...props }, ref) => {
    return (
      <button
        ref={ref}
        role="menuitemcheckbox"
        aria-checked={checked}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center gap-2 rounded py-1.5 pr-2 pl-8",
          "text-sm font-source-sans outline-hidden",
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
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem"

// ============================================
// RADIO GROUP
// ============================================
type ContextMenuRadioGroupProps = {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

const ContextMenuRadioGroup = ({ value, onValueChange, children }: ContextMenuRadioGroupProps) => {
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
    throw new Error('ContextMenuRadioItem must be used within ContextMenuRadioGroup')
  }
  return context
}

// ============================================
// RADIO ITEM
// ============================================
type ContextMenuRadioItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string
}

const ContextMenuRadioItem = React.forwardRef<HTMLButtonElement, ContextMenuRadioItemProps>(
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
          "text-sm font-source-sans outline-hidden",
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
ContextMenuRadioItem.displayName = "ContextMenuRadioItem"

// ============================================
// LABEL
// ============================================
type ContextMenuLabelProps = React.HTMLAttributes<HTMLDivElement> & {
  inset?: boolean
}

const ContextMenuLabel = React.forwardRef<HTMLDivElement, ContextMenuLabelProps>(
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
ContextMenuLabel.displayName = "ContextMenuLabel"

// ============================================
// SEPARATOR
// ============================================
type ContextMenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>

const ContextMenuSeparator = React.forwardRef<HTMLDivElement, ContextMenuSeparatorProps>(
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
ContextMenuSeparator.displayName = "ContextMenuSeparator"

// ============================================
// SHORTCUT
// ============================================
type ContextMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>

const ContextMenuShortcut = React.forwardRef<HTMLSpanElement, ContextMenuShortcutProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "ml-auto text-xs tracking-widest text-gray-50 font-source-sans",
          className
        )}
        {...props}
      />
    )
  }
)
ContextMenuShortcut.displayName = "ContextMenuShortcut"

// ============================================
// SUB MENU
// ============================================
type ContextMenuSubProps = {
  children: React.ReactNode
}

const ContextMenuSub = ({ children }: ContextMenuSubProps) => {
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
    throw new Error('SubMenu components must be used within ContextMenuSub')
  }
  return context
}

// ============================================
// SUB TRIGGER
// ============================================
type ContextMenuSubTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  inset?: boolean
}

const ContextMenuSubTrigger = React.forwardRef<HTMLButtonElement, ContextMenuSubTriggerProps>(
  ({ className, inset, children, ...props }, ref) => {
    const { setIsOpen } = useSubMenu()

    return (
      <button
        ref={ref}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5",
          "text-sm font-source-sans outline-hidden",
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
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger"

// ============================================
// SUB CONTENT
// ============================================
type ContextMenuSubContentProps = React.HTMLAttributes<HTMLDivElement>

const ContextMenuSubContent = React.forwardRef<HTMLDivElement, ContextMenuSubContentProps>(
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
ContextMenuSubContent.displayName = "ContextMenuSubContent"

// ============================================
// GROUP
// ============================================
type ContextMenuGroupProps = React.HTMLAttributes<HTMLDivElement>

const ContextMenuGroup = React.forwardRef<HTMLDivElement, ContextMenuGroupProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} role="group" className={className} {...props} />
  }
)
ContextMenuGroup.displayName = "ContextMenuGroup"

// ============================================
// PORTAL (No-op for native implementation)
// ============================================
const ContextMenuPortal = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

// ============================================
// EXPORTS
// ============================================
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}

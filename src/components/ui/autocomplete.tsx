"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SearchIcon } from "@/components/ui/icon";

export interface AutocompleteOption {
  /** Unique value/id for the option */
  value: string;
  /** Display label for the option */
  label: string;
  /** Optional additional data */
  data?: Record<string, any>;
}

export interface AutocompleteProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onSelect'> {
  /** Unique identifier for the autocomplete element */
  id?: string;
  /** Name attribute for form submission */
  name?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Current input value */
  value?: string;
  /** Callback when input value changes */
  onChange?: (value: string) => void;
  /** Callback when an option is selected */
  onSelect?: (option: AutocompleteOption) => void;
  /** Callback to fetch suggestions based on input */
  onSearch?: (query: string) => Promise<AutocompleteOption[]> | AutocompleteOption[];
  /** Array of options to display */
  options?: AutocompleteOption[];
  /** Loading state */
  loading?: boolean;
  /** Disables the autocomplete element */
  disabled?: boolean;
  /** Marks the autocomplete as required */
  required?: boolean;
  /** Marks the autocomplete as having an error/invalid state */
  invalid?: boolean;
  /** Marks the autocomplete as having a success state */
  success?: boolean;
  /** Minimum characters before showing suggestions (default: 3) */
  minCharCount?: number;
  /** Maximum number of options to display (default: 10) */
  maxOptionsCount?: number;
  /** Message to show when below minimum character count */
  minPlaceholderMsg?: string;
  /** Highlight matching text in suggestions */
  highlightMatchingText?: boolean;
  /** Custom className for additional styling */
  className?: string;
  /** Custom className for the listbox */
  listboxClassName?: string;
  /** ARIA label for accessibility */
  "aria-label"?: string;
  /** ID of element that labels this autocomplete */
  "aria-labelledby"?: string;
  /** ID of element that describes this autocomplete */
  "aria-describedby"?: string;
}

const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      id,
      name,
      placeholder = "Search...",
      value = "",
      onChange,
      onSelect,
      onSearch,
      options = [],
      loading = false,
      disabled = false,
      required = false,
      invalid = false,
      success = false,
      minCharCount = 3,
      maxOptionsCount = 10,
      minPlaceholderMsg = "",
      highlightMatchingText = true,
      className,
      listboxClassName,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "aria-describedby": ariaDescribedby,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value);
    const [isOpen, setIsOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const [suggestions, setSuggestions] = React.useState<AutocompleteOption[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listboxRef = React.useRef<HTMLDivElement>(null);
    const optionRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const statusRef = React.useRef<HTMLDivElement>(null);
    
    // Generate unique IDs
    const autocompleteId = id || React.useId();
    const listboxId = `${autocompleteId}-listbox`;
    const statusId = `${autocompleteId}-status`;

    // Sync external value with internal state
    React.useEffect(() => {
      setInternalValue(value);
    }, [value]);

    // Handle input change
    const handleInputChange = React.useCallback(async (newValue: string) => {
      setInternalValue(newValue);
      setActiveIndex(-1);
      onChange?.(newValue);

      if (newValue.length >= minCharCount) {
        setIsLoading(true);
        setIsOpen(true);
        
        try {
          let results: AutocompleteOption[] = [];
          
          if (onSearch) {
            const searchResults = await onSearch(newValue);
            results = Array.isArray(searchResults) ? searchResults : [];
          } else {
            // Use provided options if no search function
            results = options.filter(option =>
              option.label.toLowerCase().includes(newValue.toLowerCase())
            );
          }
          
          setSuggestions(results.slice(0, maxOptionsCount));
          
          // Update aria-live region
          if (statusRef.current) {
            const count = results.length;
            const message = count === 0 
              ? "No suggestions found"
              : `${count} suggestion${count === 1 ? '' : 's'} found, use up and down arrows to review`;
            statusRef.current.textContent = message;
          }
        } catch (error) {
          console.error('Autocomplete search error:', error);
          setSuggestions([]);
          if (statusRef.current) {
            statusRef.current.textContent = "Error loading suggestions";
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsOpen(false);
        setSuggestions([]);
        if (statusRef.current) {
          statusRef.current.textContent = minPlaceholderMsg;
        }
      }
    }, [minCharCount, maxOptionsCount, onSearch, options, onChange, minPlaceholderMsg]);

    // Handle option selection
    const handleSelectOption = React.useCallback((option: AutocompleteOption) => {
      setInternalValue(option.label);
      setIsOpen(false);
      setActiveIndex(-1);
      onChange?.(option.label);
      onSelect?.(option);
      
      // Return focus to input
      inputRef.current?.focus();
      
      // Clear status
      if (statusRef.current) {
        statusRef.current.textContent = "";
      }
    }, [onChange, onSelect]);

    // Highlight matching text
    const highlightText = React.useCallback((text: string, query: string) => {
      if (!highlightMatchingText || !query) return text;
      
      const regex = new RegExp(`(${query})`, 'gi');
      const parts = text.split(regex);
      
      return parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-20 text-gray-90">
            {part}
          </mark>
        ) : part
      );
    }, [highlightMatchingText]);

    // Keyboard navigation
    const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || suggestions.length === 0) {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setActiveIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setActiveIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
        case 'ArrowRight':
          event.preventDefault();
          if (activeIndex >= 0 && suggestions[activeIndex]) {
            handleSelectOption(suggestions[activeIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setActiveIndex(-1);
          break;
        case 'Tab':
          setIsOpen(false);
          setActiveIndex(-1);
          break;
        default:
          break;
      }
    }, [isOpen, suggestions, activeIndex, handleSelectOption]);

    // Update option refs array when suggestions change
    React.useEffect(() => {
      optionRefs.current = optionRefs.current.slice(0, suggestions.length);
    }, [suggestions.length]);

    // Scroll active option into view
    React.useEffect(() => {
      if (activeIndex >= 0 && optionRefs.current[activeIndex]) {
        optionRefs.current[activeIndex]?.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }, [activeIndex]);

    // Close listbox when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          listboxRef.current &&
          !listboxRef.current.contains(event.target as Node) &&
          !inputRef.current?.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setActiveIndex(-1);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    const showListbox = isOpen && (suggestions.length > 0 || isLoading || (internalValue.length > 0 && internalValue.length < minCharCount && minPlaceholderMsg));

    return (
      <div className="relative">
        {/* Screen reader status announcements */}
        <div
          ref={statusRef}
          id={statusId}
          className="sr-only"
          aria-live="assertive"
          aria-atomic="true"
        />
        
        {/* Input wrapper */}
        <div className="relative flex items-center mt-2">
          <input
            ref={React.useMemo(() => {
              return (node: HTMLInputElement | null) => {
                inputRef.current = node;
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
              };
            }, [ref])}
            id={autocompleteId}
            name={name}
            type="text"
            placeholder={placeholder}
            value={internalValue}
            disabled={disabled}
            required={required}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby ? `${ariaDescribedby} ${statusId}` : statusId}
            aria-invalid={invalid ? "true" : undefined}
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-owns={showListbox ? listboxId : undefined}
            aria-activedescendant={
              activeIndex >= 0 && suggestions[activeIndex] 
                ? `${listboxId}-option-${activeIndex}` 
                : undefined
            }
            role="combobox"
            autoComplete="off"
            className={cn(
              // Base styling
              "flex w-full font-public-sans text-gray-90",
              // Size and spacing
              "h-12 px-3 py-2 pr-10",
              // Background and border
              "bg-white border border-gray-60 rounded-none",
              // Focus states
              "focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-40 focus-visible:border-blue-60",
              // Invalid states
              invalid && "aria-[invalid=true]:border-red-60v aria-[invalid=true]:border-4",
              // Success states  
              success && "border-green-50 border-4",
              // Disabled states
              "disabled:cursor-not-allowed disabled:text-gray-70 disabled:bg-gray-20",
              className
            )}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            {...props}
          />
          
          {/* Search icon */}
          <div className="absolute right-3 pointer-events-none">
            <SearchIcon 
              size="xs" 
              className={cn(
                "text-gray-60",
                disabled && "text-gray-50"
              )}
            />
          </div>
        </div>

        {/* Suggestions listbox */}
        {showListbox && (
          <div
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-label="Search suggestions"
            className={cn(
              "absolute z-50 w-full mt-1 bg-white border border-gray-60 rounded-none shadow-lg max-h-60 overflow-auto",
              listboxClassName
            )}
          >
            {isLoading && (
              <div className="px-3 py-2 text-gray-70 text-sm">
                Loading suggestions...
              </div>
            )}
            
            {!isLoading && internalValue.length > 0 && internalValue.length < minCharCount && minPlaceholderMsg && (
              <div className="px-3 py-2 text-gray-70 text-sm">
                {minPlaceholderMsg}
              </div>
            )}
            
            {!isLoading && suggestions.length === 0 && internalValue.length >= minCharCount && (
              <div className="px-3 py-2 text-gray-70 text-sm">
                No suggestions found
              </div>
            )}
            
            {!isLoading && suggestions.map((option, index) => (
              <div
                key={`${option.value}-${index}`}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={activeIndex === index}
                className={cn(
                  "px-3 py-2 cursor-pointer text-gray-90 font-public-sans",
                  "hover:bg-blue-10 focus:bg-blue-10",
                  activeIndex === index && "bg-blue-10"
                )}
                onClick={() => handleSelectOption(option)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {highlightText(option.label, internalValue)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Autocomplete.displayName = "Autocomplete";

export { Autocomplete };
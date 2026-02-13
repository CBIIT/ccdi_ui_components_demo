"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import { Icon } from "@/components/ui/icon"
import { Search } from "@/components/ui/search";

type NavItem = {
  id: string;
  label: string;
  title?: string;
  href?: string;
  hasSubmenu?: boolean;
  submenu?: NavItem[];
};

type NCIDSNavbarProps = {
  logo?: React.ReactNode;
  navItems: NavItem[];
  className?: string;
};

export default function NCIDSNavbar({
  logo,
  navItems,
  className,
}: NCIDSNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSecondaryMenu, setActiveSecondaryMenu] = useState<string | null>(
    null,
  );
  const [isMobile, setIsMobile] = useState(false);
  // Navigation stack for mobile/tablet menu pages
  const [mobileMenuStack, setMobileMenuStack] = useState<NavItem[]>([]);

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const navButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Handle responsive behavior
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Recalculate dropdown position for full-width
  useEffect(() => {
    if (!activeDropdown || !navContainerRef.current) return;

    const updateDropdownPosition = () => {
      const dropdownEl = dropdownRefs.current[activeDropdown];
      if (dropdownEl && navContainerRef.current) {
        const navContainerRect = navContainerRef.current.getBoundingClientRect();
        // Calculate offset to make dropdown full viewport width
        const leftOffset = -navContainerRect.left;
        const rightOffset = -(window.innerWidth - navContainerRect.right);
        dropdownEl.style.left = `${leftOffset}px`;
        dropdownEl.style.right = `${rightOffset}px`;
      }
    };

    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);
    return () => window.removeEventListener("resize", updateDropdownPosition);
  }, [activeDropdown]);

  // Handle dropdown clicks
  const handleDropdownClick = (itemId: string) => {
    if (isMobile) {
      // For mobile/tablet: navigate to submenu page instead of dropdown
      const currentItems = mobileMenuStack.length > 0 
        ? mobileMenuStack[mobileMenuStack.length - 1].submenu || []
        : navItems;
      
      const item = currentItems.find((item) => item.id === itemId);
      if (item && item.hasSubmenu && item.submenu && item.submenu.length > 0) {
        setMobileMenuStack([...mobileMenuStack, item]);
      }
    } else {
      // Desktop: toggle dropdown
      if (activeDropdown === itemId) {
        setActiveDropdown(null);
      } else {
        setActiveDropdown(itemId);
      }
    }
  };

  // Handle mobile menu navigation - go back
  const handleMobileMenuBack = () => {
    if (mobileMenuStack.length > 0) {
      setMobileMenuStack(mobileMenuStack.slice(0, -1));
    }
  };

  // Reset mobile menu stack when closing menu
  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileMenuStack([]);
    setActiveSecondaryMenu(null);
  };

  // Handle outside clicks for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobile) {
        const target = event.target as HTMLElement;

        // Don't close if clicking on a navigation button
        const isNavButton = Object.values(navButtonRefs.current).some(
          (ref) => ref && ref.contains(target),
        );
        if (isNavButton) {
          return;
        }

        // Don't close if clicking inside the dropdown
        const isInsideDropdown = Object.values(dropdownRefs.current).some(
          (ref) => ref && ref.contains(target),
        );
        if (isInsideDropdown) {
          return;
        }

        // Close dropdown if clicking outside
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  // Handle mobile menu outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
        setMobileMenuStack([]);
        setActiveSecondaryMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderDesktopNavItem = (item: NavItem) => {
    const hasSubmenu =
      item.hasSubmenu && item.submenu && item.submenu.length > 0;
    const isActive = activeDropdown === item.id;

    return (
      <div
        key={item.id}
        ref={(el) => {
          navItemRefs.current[item.id] = el;
        }}
      >
        {hasSubmenu ? (
          <button
            ref={(el) => {
              navButtonRefs.current[item.id] = el;
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleDropdownClick(item.id);
            }}
            className={cn(
              // Base styles
              "relative flex items-center px-4 py-4 text-base font-semibold whitespace-nowrap leading-4",

              isActive ? "bg-cerulean-70 text-white" : "text-gray-cool-60",
              // Hover styles
              !isActive && "hover:text-cerulean-50",
              !isActive &&
                "hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-4 hover:after:right-4 hover:after:h-1 hover:after:bg-cerulean-50 hover:after:rounded-none hover:after:block",
              // Focus styles
              "focus:outline focus:outline-4 focus:outline-blue-40v",
            )}
          >
            <span>{item.label}</span>
            <svg
              className={cn("ml-2 h-4 w-4", isActive && "rotate-180")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        ) : (
          <a
            href={item.href}
            className={cn(
              // Base styles
              "relative block px-4 py-4 text-base font-semibold whitespace-nowrap text-gray-cool-60 leading-4",
              // Hover styles
              "hover:text-cerulean-50",
              "hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-4 hover:after:right-4 hover:after:h-1 hover:after:bg-cerulean-50 hover:after:rounded-none hover:after:block",
              // Focus styles
              "focus:outline focus:outline-4 focus:outline-blue-40v",
            )}
          >
            {item.label}
          </a>
        )}
      </div>
    );
  };

  const renderDesktopDropdown = (item: NavItem) => {
    if (!item.hasSubmenu || !item.submenu || activeDropdown !== item.id) {
      return null;
    }

    return (
      <div
        ref={(el) => {
          dropdownRefs.current[item.id] = el;
          if (el && navContainerRef.current) {
            const navContainerRect = navContainerRef.current.getBoundingClientRect();
            // Calculate offset to make dropdown full viewport width
            const leftOffset = -navContainerRect.left;
            const rightOffset = -(window.innerWidth - navContainerRect.right);
            el.style.left = `${leftOffset}px`;
            el.style.right = `${rightOffset}px`;
          }
        }}
        className="absolute top-full z-50 bg-cerulean-70 shadow-lg"
      >
        <div className="max-w-[87.5rem] mx-auto flex gap-2 px-8 py-8 grid grid-cols-4">
          <div className="flex flex-col col-span-1">
            <a
              href={item.href}
              className="text-white text-xl font-semibold hover:underline focus:outline focus:outline-4 focus:outline-blue-40v"
            >
              {item.title || item.label}
            </a>
          </div>
          <div className="flex gap-8 col-span-3 grid grid-flow-col grid-rows-[auto_auto_auto]">
            <div className="flex flex-col items-start grid grid-cols-3">
              {item.submenu?.slice(0, 3).map((subItem) => (
                <div key={subItem.id} className="px-4">
                  <a
                    href={subItem.href}
                    onClick={() => setActiveDropdown(null)}
                    className="text-white text-xl font-semibold hover:underline focus:outline focus:outline-4 focus:outline-blue-40v"
                  >
                    {subItem.label}
                  </a>
                  {subItem.hasSubmenu && (
                    <ul>
                      {subItem.submenu?.map((subItemChild) => (
                        <li
                          key={subItemChild.id}
                          className="my-2 leading-5"
                        >
                          <a
                            href={subItemChild.href}
                            className="font-open-sans text-base text-white leading-4 font-light hover:underline focus:outline focus:outline-4 focus:outline-blue-40v tracking-wide"
                          >
                            {subItemChild.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start grid grid-cols-3">
              {item.submenu?.slice(3, 6).map((subItem) => (
                <div key={subItem.id} className="px-4">
                  <a
                    href={subItem.href}
                    onClick={() => setActiveDropdown(null)}
                    className="text-white text-xl font-semibold hover:underline focus:outline focus:outline-4 focus:outline-blue-40v"
                  >
                    {subItem.label}
                  </a>
                  {subItem.hasSubmenu && (
                    <ul>
                      {subItem.submenu?.map((subItemChild) => (
                        <li
                          key={subItemChild.id}
                          className="my-2 leading-5"
                        >
                          <a
                            href={subItemChild.href}
                            className="font-open-sans text-base text-white leading-4 font-light hover:underline focus:outline focus:outline-4 focus:outline-blue-40v"
                          >
                            {subItemChild.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start grid grid-cols-3">
              {item.submenu?.slice(6).map((subItem) => (
                <div key={subItem.id} className="px-4">
                  <a
                    href={subItem.href}
                    onClick={() => setActiveDropdown(null)}
                    className="text-white text-xl font-semibold hover:underline focus:outline focus:outline-4 focus:outline-blue-40v"
                  >
                    {subItem.label}
                  </a>
                  {subItem.hasSubmenu && (
                    <ul>
                      {subItem.submenu?.map((subItemChild) => (
                        <li
                          key={subItemChild.id}
                          className="my-2 leading-5"
                        >
                          <a
                            href={subItemChild.href}
                            className="font-open-sans text-base text-white leading-4 font-light hover:underline focus:outline focus:outline-4 focus:outline-blue-40v"
                          >
                            {subItemChild.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMobileNavItem = (item: NavItem) => {
    const hasSubmenu =
      item.hasSubmenu && item.submenu && item.submenu.length > 0;

    return (
      <div key={item.id} className="border-t last:border-b border-gray-10">
        {hasSubmenu ? (
          <button
            onClick={() => handleDropdownClick(item.id)}
            className="font-open-sans text-left group relative flex items-center cursor-pointer justify-between w-full py-3 pl-4 leading-none hover:bg-gray-5 focus:z-10 focus:outline focus:outline-4 focus:outline-blue-40v gap-3"
          >
            <span className="text-gray-warm-60">
              {item.label}
            </span>
            <svg
              className="mx-2 h-4 w-4 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ) : (
          <a
            href={item.href}
            onClick={handleCloseMobileMenu}
            className="block font-open-sans text-left group relative flex items-center justify-between w-full py-3 pl-4 leading-none hover:bg-gray-5 focus:z-10 focus:outline focus:outline-4 focus:outline-blue-40v gap-3"
          >
            <span className="text-gray-warm-60">
              {item.label}
            </span>
          </a>
        )}
      </div>
    );
  };

  return (
    <div ref={navbarRef} className={cn("bg-white", className)}>
      {/* Main Header - Figma Layout */}
      <div className="max-w-[87.5rem] mx-auto px-4 py-8 lg:px-8 pb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Logo */}
        <div className="h-auto w-full">
          <a
            href="/"
            className="block focus:outline focus:outline-4 focus:outline-blue-40v"
            aria-label="National Cancer Institute Home Page"
          >
            {logo || (
              <>
                {/* Desktop logo - visible on large screens (≥1024px) */}
                <LogoNCI className="hidden h-[3.125rem] max-h-[3.125rem] lg:block" />
                {/* Mobile logo - visible on small screens (<1024px) */}
                <LogoNCIMobile className="h-[2.375rem] max-h-[2.375rem] lg:hidden" />
              </>
            )}
          </a>
        </div>

        {/* Search Bar - Using USWDS Search Component */}
        <div className="flex flex-row items-center gap-6 w-full justify-start lg:justify-end">
          {/* Mobile menu button - Using USWDS Button */}
          <div className="flex items-center lg:hidden">
            <Button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                if (!isMobileMenuOpen) {
                  setMobileMenuStack([]);
                }
              }}
              className="bg-cerulean-70 text-white px-5 py-3 text-base leading-4"
            >
              Menu
            </Button>
          </div>
          <Search
            iconOnly={isMobile ? true : false}
            label="Search Data Sharing Hub"
            buttonText="Search"
            size={isMobile ? "large" : "default"}
            onSearch={(value) => console.log("Search:", value)}
          />
        </div>
      </div>

      {/* Navigation - Figma Colors and Layout */}
      <div
        ref={navContainerRef}
        className="hidden lg:block max-w-[87.5rem] mx-auto px-8 relative"
      >
        <div className="flex items-center h-12">
          {/* Desktop Navigation */}
          <div className="flex items-center space-x-0 -mx-4">
            {navItems.map((item) => renderDesktopNavItem(item))}
          </div>
        </div>
        {/* Desktop Dropdown - Full Width */}
        {activeDropdown && (
          <>
            {navItems
              .filter((item) => item.id === activeDropdown)
              .map((item) => (
                <React.Fragment key={item.id}>
                  {renderDesktopDropdown(item)}
                </React.Fragment>
              ))}
          </>
        )}
      </div>

      {/* Mobile Navigation Overlay - Figma Style */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-gray-400/20"
            onClick={handleCloseMobileMenu}
          />
          <div
            ref={mobileMenuRef}
            className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-12">
                {mobileMenuStack.length > 0 ? (
                  <button
                    onClick={handleMobileMenuBack}
                    className="flex items-center text-gray-900 cursor-pointer focus:outline focus:outline-4 focus:outline-blue-40v"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span className="text-base font-open-sans text-cerulean-70">
                      {mobileMenuStack.length > 1 
                        ? mobileMenuStack[mobileMenuStack.length - 2].label
                        : "Main Menu"}
                    </span>
                  </button>
                ) : (
                  <div></div>
                )}
                <button
                  onClick={handleCloseMobileMenu}
                  className="text-gray-900 cursor-pointer focus:outline focus:outline-4 focus:outline-blue-40v"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {mobileMenuStack.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-base font-open-sans font-semibold text-cerulean-70 pl-4">
                    {mobileMenuStack[mobileMenuStack.length - 1].label}
                  </h2>
                </div>
              )}
              <div className="space-y-0">
                {(mobileMenuStack.length > 0
                  ? mobileMenuStack[mobileMenuStack.length - 1].submenu || []
                  : navItems
                ).map((item) => renderMobileNavItem(item))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const LogoNCI = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 597 50"
      className={cn("w-auto", className)}
      role="img"
      aria-label="National Cancer Institute Logo"
      aria-hidden={true}
    >
      <g fill="#BB0E3D">
        <path d="M89.6 16.5h3.7v16.4h-3.7l-7.8-10.3v10.3h-3.7V16.5h3.4l8 10.5V16.5zM108.9 32.9l-1.5-3.5h-6.9L99 32.9h-3.9l7.1-16.4h3.5l7.1 16.4h-3.9zM104 21.4l-2.1 4.8h4.1l-2-4.8zM120.4 19.7v13.2h-3.7V19.7h-4.6v-3.2H125v3.2h-4.6zM127.7 16.5h3.7v16.4h-3.7V16.5zM149.2 30.6c-1.7 1.6-3.7 2.4-6.1 2.4-2.4 0-4.5-.8-6.1-2.4-1.7-1.6-2.5-3.6-2.5-6s.8-4.4 2.5-6c1.7-1.6 3.7-2.4 6.1-2.4 2.4 0 4.5.8 6.1 2.4 1.7 1.6 2.5 3.6 2.5 6s-.9 4.4-2.5 6zm-1.3-6c0-1.5-.5-2.7-1.4-3.7-.9-1-2.1-1.5-3.5-1.5s-2.5.5-3.5 1.5c-.9 1-1.4 2.3-1.4 3.7 0 1.5.5 2.7 1.4 3.7.9 1 2.1 1.5 3.5 1.5s2.5-.5 3.5-1.5 1.4-2.2 1.4-3.7zM166.2 16.5h3.7v16.4h-3.7l-7.8-10.3v10.3h-3.7V16.5h3.4l8 10.5V16.5zM185.5 32.9l-1.5-3.5h-6.9l-1.5 3.5h-3.9l7.1-16.4h3.5l7.1 16.4h-3.9zm-4.9-11.5-2.1 4.8h4.1l-2-4.8zM191.3 32.9V16.5h3.7v13.1h7v3.3h-10.7zM218.3 29.7c1.8 0 3.3-.7 4.4-2.1L225 30c-1.9 2.1-4 3.1-6.6 3.1-2.5 0-4.6-.8-6.2-2.4-1.6-1.6-2.4-3.6-2.4-6s.8-4.5 2.5-6.1c1.7-1.6 3.7-2.4 6.1-2.4 2.7 0 4.9 1 6.7 3.1l-2.3 2.6c-1.2-1.4-2.6-2.2-4.3-2.2-1.4 0-2.5.4-3.5 1.3s-1.5 2.1-1.5 3.6.5 2.7 1.4 3.7c1 .9 2.1 1.4 3.4 1.4zM239.5 32.9l-1.5-3.5h-6.9l-1.5 3.5h-3.9l7.1-16.4h3.5l7.1 16.4h-3.9zm-5-11.5-2.1 4.8h4.1l-2-4.8zM256.7 16.5h3.7v16.4h-3.7l-7.8-10.3v10.3h-3.7V16.5h3.4l8 10.5.1-10.5zM271.9 29.7c1.8 0 3.3-.7 4.4-2.1l2.3 2.4c-1.9 2.1-4 3.1-6.6 3.1-2.5 0-4.6-.8-6.2-2.4-1.6-1.6-2.4-3.6-2.4-6s.8-4.5 2.5-6.1c1.7-1.6 3.7-2.4 6.1-2.4 2.7 0 4.9 1 6.7 3.1l-2.3 2.6c-1.2-1.4-2.6-2.2-4.3-2.2-1.4 0-2.5.4-3.5 1.3s-1.5 2.1-1.5 3.6.5 2.7 1.4 3.7c1 .9 2.1 1.4 3.4 1.4zM293.3 16.5v3.3h-8.1v3.4h7.3v3.1h-7.3v3.4h8.4v3.2h-12.1V16.5h11.8zM310.1 22c0 2.6-1 4.3-3.1 5.1l4.1 5.9h-4.5l-3.6-5.2h-2.5V33h-3.7V16.5h6.2c2.5 0 4.4.4 5.4 1.3 1.1.9 1.7 2.3 1.7 4.2zm-4.4 1.9c.5-.4.7-1 .7-1.9 0-.9-.2-1.5-.7-1.8-.5-.3-1.3-.5-2.5-.5h-2.7v4.8h2.7c1.2 0 2-.2 2.5-.6zM320 16.5h3.7v16.4H320V16.5zM339.1 16.5h3.7v16.4h-3.7l-7.8-10.3v10.3h-3.7V16.5h3.4l8 10.5.1-10.5zM350.6 19.8c-.4.3-.5.7-.5 1.1s.2.9.6 1.1 1.4.6 3 1 2.8 1 3.6 1.7c.9.8 1.3 1.9 1.3 3.3 0 1.5-.6 2.7-1.7 3.6s-2.5 1.4-4.3 1.4c-2.6 0-4.9-1-7-2.9l2.2-2.7c1.8 1.5 3.4 2.3 4.9 2.3.7 0 1.2-.1 1.6-.4.4-.3.6-.7.6-1.2s-.2-.9-.6-1.2c-.4-.3-1.2-.6-2.4-.9-1.9-.5-3.3-1-4.2-1.8-.9-.7-1.3-1.9-1.3-3.4 0-1.6.6-2.8 1.7-3.6 1.1-.8 2.5-1.3 4.2-1.3 1.1 0 2.2.2 3.3.6 1.1.4 2 .9 2.9 1.6l-1.8 2.7c-1.4-1.1-2.9-1.6-4.4-1.6-.8.2-1.3.3-1.7.6zM368.5 19.7v13.2h-3.7V19.7h-4.6v-3.2h12.9v3.2h-4.6zM375.8 16.5h3.7v16.4h-3.7V16.5zM390.4 19.7v13.2h-3.7V19.7h-4.6v-3.2H395v3.2h-4.6zM402.1 28.7c.6.8 1.4 1.1 2.5 1.1 1 0 1.8-.4 2.4-1.1.6-.8.9-1.8.9-3.1v-9h3.7v9.2c0 2.4-.7 4.2-2 5.5-1.3 1.3-3 1.9-5 1.9s-3.7-.6-5-1.9-2-3.1-2-5.5v-9.2h3.7v9c-.1 1.3.2 2.3.8 3.1zM422.3 19.7v13.2h-3.7V19.7H414v-3.2h12.9v3.2h-4.6zM441.4 16.5v3.3h-8.1v3.4h7.3v3.1h-7.3v3.4h8.4v3.2h-12.1V16.5h11.8z" />
      </g>
      <path
        fill="#BA1F40"
        d="M57.8 6c-.9-1.3-2.4-2.2-3.9-2.2h-3.6l12 21.2-12 21.2h3.6c1.7 0 3.2-.9 3.9-2.2l10.5-19L57.8 6z"
      />
      <path
        fill="#606061"
        d="M58.9 25 47.2 3.8H4.7C2.1 3.8.1 5.9.1 8.4v33.3c0 2.5 2 4.6 4.6 4.6h42.5L58.9 25z"
      />
      <path
        fill="#FFF"
        d="M25.3 15.6h3.2v18.8h-3.2zM18.9 15.6v13.7l-8.6-13.7H7.2v18.9h3.1V20.6l8.6 13.9h3.2V15.6zM43.3 15.6v7.8h-8.7v-7.8h-3.2v18.9h3.2v-7.9h8.7v7.9h3.1V15.6z"
      />
    </svg>
  );
};

const LogoNCIMobile = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 288 38"
      className={cn("w-auto", className)}
      role="img"
      aria-label="National Cancer Institute Logo"
      aria-hidden={true}
    >
      <g fill="#BB0E3D">
        <path d="M67.3 6h2.3v10.4h-2.3l-5-6.5v6.5H60V6h2.2l5.1 6.7V6zM79.6 16.4l-1-2.2h-4.4l-1 2.2h-2.5L75.3 6h2.2L82 16.4h-2.4zm-3.1-7.3-1.3 3h2.6l-1.3-3zM86.9 8v8.4h-2.3V8h-2.9V6h8.2v2h-3zM91.6 6h2.3v10.4h-2.3V6zM105.2 15c-1.1 1-2.3 1.5-3.9 1.5s-2.8-.5-3.9-1.5-1.6-2.3-1.6-3.8.5-2.8 1.6-3.8 2.3-1.5 3.9-1.5 2.8.5 3.9 1.5 1.6 2.3 1.6 3.8-.5 2.8-1.6 3.8zm-.8-3.8c0-.9-.3-1.7-.9-2.4-.6-.7-1.3-1-2.2-1s-1.6.3-2.2 1c-.6.7-.9 1.4-.9 2.4 0 .9.3 1.7.9 2.4.6.7 1.3 1 2.2 1s1.6-.3 2.2-1c.6-.7.9-1.5.9-2.4zM116 6h2.3v10.4H116l-5-6.5v6.5h-2.3V6h2.2l5.1 6.7V6zM128.3 16.4l-1-2.2H123l-1 2.2h-2.5L124.1 6h2.2l4.5 10.4h-2.5zm-3.1-7.3-1.3 3h2.6l-1.3-3zM132 16.4V6h2.3v8.3h4.4v2.1H132zM149.2 14.4c1.1 0 2.1-.5 2.8-1.4l1.5 1.5c-1.2 1.3-2.6 2-4.2 2s-2.9-.5-4-1.5c-1-1-1.6-2.3-1.6-3.8s.5-2.8 1.6-3.9c1.1-1 2.4-1.5 3.9-1.5 1.7 0 3.1.7 4.3 2l-1.4 1.6c-.7-.9-1.6-1.4-2.7-1.4-.9 0-1.6.3-2.2.9-.6.6-.9 1.3-.9 2.3s.3 1.7.9 2.3c.4.6 1.2.9 2 .9zM162.6 16.4l-1-2.2h-4.4l-1 2.2h-2.5L158.4 6h2.2l4.5 10.4h-2.5zm-3.1-7.3-1.3 3h2.6l-1.3-3zM173.6 6h2.3v10.4h-2.3l-5-6.5v6.5h-2.3V6h2.2l5.1 6.7V6zM183.3 14.4c1.1 0 2.1-.5 2.8-1.4l1.5 1.5c-1.2 1.3-2.6 2-4.2 2s-2.9-.5-4-1.5c-1-1-1.6-2.3-1.6-3.8s.5-2.8 1.6-3.9c1.1-1 2.3-1.5 3.9-1.5 1.7 0 3.1.7 4.3 2l-1.4 1.6c-.7-.9-1.6-1.4-2.7-1.4-.9 0-1.6.3-2.2.9-.6.6-.9 1.3-.9 2.3s.3 1.7.9 2.3c.4.6 1.1.9 2 .9zM196.9 6v2.1h-5.2v2.1h4.7v2h-4.7v2.2h5.3v2.1h-7.7V6h7.6zM207.6 9.5c0 1.7-.7 2.7-2 3.2l2.6 3.7h-2.9l-2.3-3.3h-1.6v3.3h-2.3V6h3.9c1.6 0 2.8.3 3.5.8.7.6 1.1 1.5 1.1 2.7zm-2.8 1.2c.3-.3.4-.7.4-1.2s-.1-.9-.4-1.2c-.3-.2-.8-.3-1.6-.3h-1.7v3.1h1.7c.7 0 1.3-.1 1.6-.4zM60 21.6h2.3V32H60V21.6zM72.2 21.6h2.3V32h-2.3l-5-6.5V32h-2.3V21.6h2.2l5.1 6.7v-6.7zM79.5 23.7c-.2.2-.3.4-.3.7s.1.5.4.7c.3.2.9.4 1.9.6 1 .2 1.8.6 2.3 1.1.5.5.8 1.2.8 2.1 0 .9-.3 1.7-1 2.3s-1.6.9-2.8.9c-1.6 0-3.1-.6-4.5-1.8l1.4-1.7c1.1 1 2.2 1.5 3.1 1.5.4 0 .8-.1 1-.3.2-.2.4-.4.4-.7s-.1-.6-.4-.7c-.3-.2-.8-.4-1.5-.6-1.2-.3-2.1-.7-2.7-1.1s-.8-1.2-.8-2.2c0-1 .4-1.7 1.1-2.3.7-.5 1.6-.8 2.7-.8.7 0 1.4.1 2.1.4.7.2 1.3.6 1.8 1l-1.2 1.7c-.9-.7-1.8-1-2.8-1-.5-.1-.8 0-1 .2zM90.9 23.6V32h-2.3v-8.4h-2.9v-2h8.2v2h-3zM95.5 21.6h2.3V32h-2.3V21.6zM104.8 23.6V32h-2.3v-8.4h-2.9v-2h8.2v2h-3zM112.2 29.3c.4.5.9.7 1.6.7s1.2-.2 1.6-.7c.4-.5.6-1.1.6-2v-5.7h2.3v5.8c0 1.5-.4 2.7-1.3 3.5-.8.8-1.9 1.2-3.2 1.2-1.3 0-2.4-.4-3.2-1.2-.8-.8-1.3-2-1.3-3.5v-5.8h2.3v5.7c0 .9.2 1.5.6 2zM125.1 23.6V32h-2.3v-8.4h-2.9v-2h8.2v2h-3zM137.2 21.6v2.1H132v2.1h4.7v2H132V30h5.3v2h-7.7V21.6h7.6z" />
      </g>
      <path
        fill="#606061"
        d="m45.1 19-9-16.1H3.6C1.7 2.9.1 4.4.1 6.4v25.4c0 1.9 1.5 3.5 3.5 3.5H36L45.1 19z"
      />
      <path
        fill="#BA1F40"
        d="M44.2 4.5c-.6-1-1.8-1.7-3-1.7h-2.7L47.6 19l-9.1 16.2h2.7c1.2 0 2.4-.6 3-1.7l8-14.5-8-14.5z"
      />
      <path
        fill="#FFF"
        d="M19.3 11.8h2.4v14.4h-2.4zM14.5 11.8v10.5L8 11.8H5.6v14.3H8V15.6l6.5 10.5h2.4V11.8zM33.1 11.8v6h-6.6v-6h-2.4v14.3h2.4v-6h6.6v6h2.4V11.8z"
      />
    </svg>
  );
};

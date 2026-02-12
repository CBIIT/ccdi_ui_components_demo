"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"

// Types for footer structure
export interface FooterLink {
  label: string
  href: string
}

export interface FooterTopic {
  title: string
  links: FooterLink[]
}

export interface SocialLink {
  platform: string
  href: string
  icon: string // Icon class name
  label: string // Screen reader label
}

export interface ContactInfo {
  phone?: string
  email?: string
  address?: string
}

export interface AgencyInfo {
  name: string
  logo?: string
  logoAlt?: string
}

export interface FooterNavigation {
  topics?: FooterTopic[]
  primaryLinks?: FooterLink[]
  socialLinks?: SocialLink[]
}

// Footer variants
const footerVariants = cva(
  "@container",
  {
    variants: {
      variant: {
        default: "",
        medium: "",
        slim: ""
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

// Accordion component for mobile navigation
const FooterAccordion: React.FC<{
  topics: FooterTopic[]
}> = ({ topics }) => {
  const [openItems, setOpenItems] = React.useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className="@mobile-lg:hidden @desktop:gap-x-8 divide-y @mobile-lg:divide-y-0 divide-gray-30 border-t @mobile-lg:border-t-0 border-t-gray-30">
      {topics.map((topic, index) => {
        const isOpen = openItems.has(index)
        return (
          <section key={index}>
            <h4 className="relative font-bold font-merriweather">
              <button
                onClick={() => toggleItem(index)}
                className="group flex items-center w-full p-4 bg-gray-5 font-bold focus:outline focus:outline-4 focus:-outline-offset-4 focus:outline-blue-40 cursor-pointer text-left gap-2"
                aria-expanded={isOpen}
              >
                <Icon 
                  icon={isOpen ? "expand_more" : "arrow_forward"} 
                  size="sm" 
                  className="size-6" 
                />
                {topic.title}
              </button>
            </h4>
            {isOpen && (
              <div>
                <ul className="space-y-4 px-4 pb-6 pt-3">
                  {topic.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-blue-60 visited:text-violet-70 hover:text-blue-70 focus:outline focus:outline-4 focus:outline-blue-40 underline"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

// Desktop navigation grid
const FooterDesktopNav: React.FC<{
  topics: FooterTopic[]
}> = ({ topics }) => (
  <div className="hidden @mobile-lg:grid @mobile-lg:grid-cols-2 @desktop:grid-cols-4 gap-x-4 gap-y-8">
    {topics.map((topic, index) => (
      <section key={index}>
        <h4 className="font-bold font-merriweather mb-4">{topic.title}</h4>
        <ul className="space-y-4">
          {topic.links.map((link, linkIndex) => (
            <li key={linkIndex}>
              <a
                href={link.href}
                className="text-blue-60 hover:text-blue-70 focus:outline focus:outline-4 focus:outline-blue-40 underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    ))}
  </div>
)

// Newsletter signup component
const NewsletterSignup: React.FC<{
  onSignup?: (email: string) => void
}> = ({ onSignup }) => {
  const [email, setEmail] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSignup?.(email)
    setEmail("")
  }

  return (
    <div className="py-8 px-4 @desktop:px-8">
      <h3 className="text-lg font-bold font-merriweather">Sign Up</h3>
      <form onSubmit={handleSubmit} className="max-w-xs mt-3">
        <label htmlFor="footer-email" className="block">Your email address</label>
        <div className="mt-2 relative">
          <input
            id="footer-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              "p-2 w-full max-w-lg h-10 border border-gray-60",
              "focus:outline focus:outline-offset-0 focus:outline-4 focus:outline-blue-40",
              "data-[invalid]:ring-4 data-[invalid]:ring-red-60 data-[invalid]:border-transparent data-[invalid]:outline-offset-4"
            )}
            required
          />
          <Button
            type="submit"
            className="mt-2 w-full bg-blue-60 hover:bg-blue-warm-70 active:bg-blue-warm-80 focus:outline-blue-40"
          >
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  )
}

// Social media links component
const SocialLinks: React.FC<{
  socialLinks: SocialLink[]
}> = ({ socialLinks }) => (
  <div className="flex flex-wrap @mobile-lg:justify-end gap-2">
    {socialLinks.map((social, index) => (
      <div key={index}>
        <a
          href={social.href}
          className="block text-gray-90 size-12 p-2 bg-black/10 hover:bg-white focus:outline focus:outline-4 focus:outline-blue-40"
        >
          <div className={cn(social.icon, "size-full")} />
          <span className="sr-only">{social.label}</span>
        </a>
      </div>
    ))}
  </div>
)

// Contact information component
const ContactInfo: React.FC<{
  contact: ContactInfo
  className?: string
}> = ({ contact, className }) => (
  <address className={cn("flex flex-wrap gap-x-4 @desktop:gap-x-8", className)}>
    {contact.phone && (
      <div className="leading-tighter">
        <a
          href={`tel:${contact.phone.replace(/\D/g, '')}`}
          className="text-gray-90 visited:text-violet-70 hover:text-blue-70 focus:outline focus:outline-4 focus:outline-blue-40 underline"
        >
          {contact.phone}
        </a>
      </div>
    )}
    {contact.email && (
      <div className="leading-tighter">
        <a
          href={`mailto:${contact.email}`}
          className="text-gray-90 visited:text-violet-70 hover:text-blue-70 focus:outline focus:outline-4 focus:outline-blue-40 underline"
        >
          {contact.email}
        </a>
      </div>
    )}
  </address>
)

export interface FooterProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  navigation?: FooterNavigation
  agencyInfo?: AgencyInfo
  contactInfo?: ContactInfo
  showReturnToTop?: boolean
  showNewsletter?: boolean
  onNewsletterSignup?: (email: string) => void
  returnToTopHref?: string
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({
    className,
    variant,
    navigation = {},
    agencyInfo,
    contactInfo,
    showReturnToTop = true,
    showNewsletter = false,
    onNewsletterSignup,
    returnToTopHref = "#",
    ...props
  }, ref) => {
    const { topics = [], primaryLinks = [], socialLinks = [] } = navigation

    const renderDefaultFooter = () => (
      <>
        {/* Return to top */}
        {showReturnToTop && (
          <div className="px-4 py-5 @desktop:px-8">
            <a
              href={returnToTopHref}
              className="text-blue-60 visited:text-violet-70 hover:text-blue-70 focus:outline focus:outline-4 focus:outline-blue-40 underline"
            >
              Return to top
            </a>
          </div>
        )}

        {/* Main content area */}
        <div className="bg-gray-5 grid @tablet:grid-cols-3 gap-x-4">
          {/* Navigation */}
          {topics.length > 0 && (
            <nav
              aria-label="Footer navigation"
              className="@tablet:col-span-2 @mobile-lg:py-8 @mobile-lg:px-4 @desktop:px-8 border-b @tablet:border-b-0 border-b-gray-30"
            >
              <FooterAccordion topics={topics} />
              <FooterDesktopNav topics={topics} />
            </nav>
          )}

          {/* Newsletter signup */}
          {showNewsletter && (
            <NewsletterSignup onSignup={onNewsletterSignup} />
          )}
        </div>

        {/* Primary links */}
        {primaryLinks.length > 0 && (
          <nav className="bg-gray-5 @desktop:px-4">
            <ul className="flex flex-wrap flex-col @mobile-lg:flex-row divide-y @mobile-lg:divide-y-0 divide-y-gray-30 border-y @mobile-lg:border-y-0 border-y-gray-30">
              {primaryLinks.map((link, index) => (
                <li key={index} className="@mobile-lg:w-1/3 @desktop:w-auto">
                  <a
                    href={link.href}
                    className="block p-4 font-bold text-gray-90 visited:text-violet-70 hover:text-blue-70 focus:outline focus:outline-4 focus:outline-blue-40 underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Agency info and contact */}
        {(agencyInfo || contactInfo || socialLinks.length > 0) && (
          <div className="bg-gray-10 px-4 @desktop:px-8 py-5">
            <div className="grid @mobile-lg:grid-cols-2 gap-y-8 gap-x-4">
              {/* Agency info */}
              {agencyInfo && (
                <div className="flex flex-wrap flex-col @mobile-lg:flex-row @mobile-lg:items-center gap-4">
                  {agencyInfo.logo && (
                    <div>
                      <img
                        src={agencyInfo.logo}
                        alt={agencyInfo.logoAlt || agencyInfo.name}
                        className="bg-white size-20 rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-xl font-bold">{agencyInfo.name}</p>
                  </div>
                </div>
              )}

              {/* Social links and contact */}
              <div className="@mobile-lg:text-right grow space-y-3">
                {socialLinks.length > 0 && (
                  <SocialLinks socialLinks={socialLinks} />
                )}
                {contactInfo && (
                  <>
                    <p className="text-xl font-bold">Agency Contact Center</p>
                    <ContactInfo
                      contact={contactInfo}
                      className="@mobile-lg:justify-end"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    )

    const renderSlimFooter = () => (
      <>
        {/* Return to top */}
        {showReturnToTop && (
          <div className="px-4 py-5 @desktop:px-8">
            <a
              href={returnToTopHref}
              className="text-blue-60 visited:text-violet-70 hover:text-blue-70 focus:outline focus:outline-4 focus:outline-blue-40 underline"
            >
              Return to top
            </a>
          </div>
        )}

        {/* Primary navigation and contact */}
        <nav className="bg-gray-5 @desktop:px-4 grid @mobile-lg:grid-cols-3">
          {primaryLinks.length > 0 && (
            <ul className="flex flex-wrap @mobile-lg:col-span-2 flex-col @mobile-lg:flex-row divide-y @mobile-lg:divide-y-0 divide-y-gray-30 border-y @mobile-lg:border-y-0 border-y-gray-30">
              {primaryLinks.map((link, index) => (
                <li key={index} className="@mobile-lg:w-1/2 @desktop:w-auto">
                  <a
                    href={link.href}
                    className="block p-4 font-bold text-gray-90 visited:text-violet-70 hover:text-blue-70 focus:outline focus:outline-4 focus:outline-blue-40 underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {contactInfo && (
            <ContactInfo
              contact={contactInfo}
              className="flex-wrap p-4 @mobile-lg:p-0 gap-x-8 @mobile-lg:gap-x-0"
            />
          )}
        </nav>

        {/* Agency info */}
        {agencyInfo && (
          <div className="bg-gray-10 px-4 @desktop:px-8 py-5">
            <div className="flex flex-wrap @mobile-lg:items-center @mobile-lg:justify-between gap-4">
              {agencyInfo.logo && (
                <img
                  src={agencyInfo.logo}
                  alt={agencyInfo.logoAlt || agencyInfo.name}
                  className="bg-white size-12 rounded-full object-cover"
                />
              )}
              <p className="text-xl font-bold">{agencyInfo.name}</p>
            </div>
          </div>
        )}
      </>
    )

    return (
      <footer
        ref={ref}
        className={cn(footerVariants({ variant }), className)}
        {...props}
      >
        <div className="w-full max-w-screen-xl mx-auto">
          {variant === "slim" ? renderSlimFooter() : renderDefaultFooter()}
        </div>
      </footer>
    )
  }
)

Footer.displayName = "Footer"

export { Footer, footerVariants }
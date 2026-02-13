"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Icon, type IconType } from "@/components/ui/icon"

// Types for footer structure
export interface FooterLink {
  label: string
  href: string
}

export interface FooterSection {
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
  liveChat?: string
  siteFeedback?: string
}

export interface AgencyInfo {
  name: string
  logo?: string
  logoAlt?: string
  description?: string
}

export interface FooterNavigation {
  sections?: FooterSection[]
  primaryLinks?: FooterLink[]
  socialLinks?: SocialLink[]
}

const svgList = {
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" className="usa-icon fill-golden-20" role="img" aria-labelledby="facebook-title">
      <title id="facebook-title">Facebook</title>
      <rect fill="none" height="24" width="24"></rect>
      <path className="fill-golden-20" d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-2 c-0.55,0-1,0.45-1,1v2h3v3h-3v6.95C18.05,21.45,22,17.19,22,12z"></path>
    </svg>
  ),
  twitter: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" className="usa-icon fill-golden-20" role="img" aria-labelledby="x-title">
      <title id="x-title">Follow on X</title>
      <path className="fill-golden-20" d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zm5.2-15.6L13.3 11l4.3 6.2h-3.1L11.6 13 8 17.2h-.9l4.1-4.8-4.1-6h3.1l2.7 3.9 3.4-3.9h.9zm-5.6 5.4.4.6 2.8 4h1.4l-3.5-5-.4-.6-2.6-3.7H8.3l3.3 4.7z"></path>
    </svg>
  ),
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" className="usa-icon" role="img" aria-labelledby="instagram-title">
      <title id="instagram-title">Instagram</title>
      <g id="Instagram">
        <path className="fill-golden-20" d="M12,10a2,2,0,1,0,2,2A2,2,0,0,0,12,10Z"></path>
        <path className="fill-golden-20" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm6,12.69A3.32,3.32,0,0,1,14.69,18H9.31A3.32,3.32,0,0,1,6,14.69V9.31A3.32,3.32,0,0,1,9.31,6h5.38A3.32,3.32,0,0,1,18,9.31Z"></path>
        <path className="fill-golden-20" d="M16.94,9.31a2.25,2.25,0,0,0-2.25-2.25H9.31A2.25,2.25,0,0,0,7.06,9.31v5.38a2.25,2.25,0,0,0,2.25,2.25h5.38a2.25,2.25,0,0,0,2.25-2.25h0ZM12,15.09A3.09,3.09,0,1,1,15.09,12,3.09,3.09,0,0,1,12,15.09Zm3.77-5.75a.79.79,0,0,1-.55.23.83.83,0,0,1-.55-.23.78.78,0,0,1,0-1.11A.82.82,0,0,1,15.22,8a.78.78,0,0,1,.55,1.33Z"></path>
      </g>
    </svg>
  ),
  youtube: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" className="usa-icon" role="img" aria-labelledby="youtube-title">
      <title id="youtube-title">Youtube</title>
      <g id="YouTube">
        <path className="fill-golden-20" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm5.75,12.91A1.49,1.49,0,0,1,16.69,16a34.65,34.65,0,0,1-4.69.26A34.65,34.65,0,0,1,7.31,16a1.49,1.49,0,0,1-1.06-1.06A15.88,15.88,0,0,1,6,12a15.88,15.88,0,0,1,.25-2.91A1.49,1.49,0,0,1,7.31,8,34.65,34.65,0,0,1,12,7.77,34.65,34.65,0,0,1,16.69,8a1.49,1.49,0,0,1,1.06,1.06A15.88,15.88,0,0,1,18,12,15.88,15.88,0,0,1,17.75,14.91Z"></path>
        <polygon className="fill-golden-20" points="10.77 13.78 13.91 12 10.77 10.22 10.77 13.78"></polygon>
      </g>
    </svg>
  ),
  instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" className="usa-icon" role="img" aria-labelledby="linkedin-title">
      <title id="linkedin-title">Linkedin</title>
      <g id="final">
        <path className="fill-golden-20" d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M8.912001,17.584H6.584v-7.472h2.328001V17.584z
              M7.744,9.104C6.992,9.104,6.4,8.488,6.4,7.76c0-0.752,0.592-1.344,1.344-1.344c0.728,0,1.343999,0.592,1.343999,1.344
              C9.087999,8.488,8.472,9.104,7.744,9.104z M17.6,17.584h-2.328v-3.64c0-0.856-0.024001-1.967999-1.216001-1.967999
              s-1.392,0.927999-1.392,1.912v3.696H10.36v-7.472h2.224v1.008h0.024c0.464-0.752,1.296-1.216001,2.199999-1.192
              c2.352001,0,2.792,1.552001,2.792,3.544001C17.6,13.472,17.6,17.584,17.6,17.584z"></path>
      </g>
    </svg>
  )
}

// Mobile accordion component for collapsible sections
const MobileAccordion: React.FC<{
  sections: FooterSection[]
}> = ({ sections }) => {
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
    <div className="lg:hidden">
      {sections.map((section, index) => {
        const isOpen = openItems.has(index)
        return (
          <div 
            key={index} 
            className="border-t border-black"
          >
            <div className="flex flex-col">
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center gap-1 p-4 cursor-pointer focus:outline focus:outline-4 focus:outline-blue-40"
                aria-expanded={isOpen}
              >
                <div className={cn(
                  "flex items-center justify-center size-6 transition-transform duration-200",
                  isOpen ? "rotate-180" : "rotate-90"
                )}>
                  {/* <Icon icon="expand_more" className="size-6 text-white" /> */}
                  <Icon icon="expand_less" size="sm" className="text-white"/>
                </div>
                <span className="font-bold text-white font-['Open_Sans'] text-base leading-4">
                  {section.title}
                </span>
              </button>
              {isOpen && (
                <div className="flex flex-col pl-4 pb-5">
                  {section.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.href}
                      className={cn(
                        "text-white visited:text-white pl-4 hover:text-white focus:outline focus:outline-4 focus:outline-blue-40 hover:underline font-['Open_Sans'] font-normal leading-normal text-[16.16px]",
                        linkIndex < section.links.length - 1 ? 'mb-4' : 'mb-0'
                      )}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Desktop grid navigation
const DesktopNavigation: React.FC<{
  sections: FooterSection[]
}> = ({ sections }) => (
  <div className="hidden lg:grid lg:grid-cols-4 gap-8">
    {sections.map((section, index) => (
      <div key={index}>
        <h3 className="font-bold font-public-sans text-white mb-4 text-base">
          {section.title}
        </h3>
        <ul className="space-y-3">
          {section.links.map((link, linkIndex) => (
            <li key={linkIndex}>
              <a
                href={link.href}
                className="text-white visited:text-white hover:text-white focus:outline focus:outline-4 focus:outline-blue-40 hover:underline font-public-sans text-sm"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)

// Newsletter signup component
const NewsletterSignup: React.FC<{
  onSignup?: (email: string) => void
}> = ({ onSignup }) => {
  const [email, setEmail] = React.useState("")
  const [error, setError] = React.useState("")
  const [touched, setTouched] = React.useState(false)

  const validateEmail = (emailValue: string) => {
    if (!emailValue) {
      return ""
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailValue)) {
      return "Enter a valid email address"
    }
    return ""
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (touched) {
      setError(validateEmail(value))
    }
  }

  const handleBlur = () => {
    setTouched(true)
    setError(validateEmail(email))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateEmail(email)
    if (validationError) {
      setError(validationError)
      setTouched(true)
      return
    }
    onSignup?.(email)
    setEmail("")
    setError("")
    setTouched(false)
  }

  return (
    <>
      {/* Mobile version */}
      <div className="lg:hidden border-t border-black">
        <div className="flex flex-col gap-[20px] pt-6 pb-[30px] px-4">
          <h3 className="font-poppins font-bold text-white w-full text-[22.88px] leading-normal">
            Sign up for email updates
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] w-full" noValidate>
            <div className={cn(
              "flex flex-col mb-[10px] w-full",
              error && "border-l-4 border-cranberry-50v pl-2"
            )}>
              <label 
                htmlFor="footer-email-mobile" 
                className="text-white w-full mb-[10px] font-open-sans text-base font-normal leading-normal"
              >
                Enter your email address
              </label>
              {error && (
                <div className="bg-cranberry-50v text-white px-2 py-1 font-open-sans text-base font-normal leading-normal border-l-4 border-cranberry-50v">
                  {error}
                </div>
              )}
              <Input
                id="footer-email-mobile"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleBlur}
                placeholder=""
                required
                className={cn(
                  "w-full bg-white h-[47px]",
                  error && "mt-0 border-2 border-cranberry-50v"
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full text-gray-90 bg-golden-20 hover:bg-golden-30 px-4 py-[9px] font-['Open_Sans'] text-base font-bold"
            >
              Sign up
            </Button>
          </form>
        </div>
      </div>

      {/* Desktop version */}
      <div className="hidden lg:block">
        <h3 className="text-lg font-bold font-public-sans text-white mb-3">
          Sign up for email updates
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className={cn(
                error && "border-l-4 border-cranberry-50v pl-2"
              )}>
            <label 
              htmlFor="footer-email-desktop" 
              className={"block text-sm font-medium text-white mb-2"}
            >
              Enter your email address
            </label>
            {error && (
              <div className="bg-cranberry-50v text-white px-2 py-1 text-sm font-normal leading-normal border-l-4 border-cranberry-50v">
                {error}
              </div>
            )}
            <Input
              id="footer-email-desktop"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              required
              className={cn(
                "w-full",
                error && "mt-0 border-2 border-cranberry-50v"
              )}
            />
          </div>
          <Button
            type="submit"
            className="px-4 py-2 text-sm font-public-sans bg-[#F1D40E] hover:bg-[#E6C50D] text-black"
          >
            Sign up
          </Button>
        </form>
      </div>
    </>
  )
}

// Social media links component
const SocialLinks: React.FC<{
  socialLinks: SocialLink[]
}> = ({ socialLinks }) => (
  <div className="flex flex-wrap gap-3">
    {socialLinks.map((social, index) => (
      <a
        key={index}
        href={social.href}
        className="flex items-center justify-center size-10 focus:outline focus:outline-4 focus:outline-blue-40 rounded-full transition-colors"
        aria-label={social.label}
      >
       {svgList[social.icon as keyof typeof svgList]}
      </a>
    ))}
  </div>
)

// Contact information component
const ContactInfo: React.FC<{
  contact: ContactInfo
  className?: string
}> = ({ contact, className }) => {
  const contactTextClassName = "text-base font-['Open_Sans'] font-normal leading-normal"

  return (
    <div className={cn("", className)}>
      {/* Desktop: Only email, right-aligned, horizontal */}
      <div className="hidden lg:flex gap-[14px] items-center justify-end">
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className={cn("text-white visited:text-white hover:text-white focus:outline focus:outline-4 focus:outline-blue-40 hover:underline font-public-sans", contactTextClassName)}
          >
            {contact.email}
          </a>
        )}
      </div>

      {/* Tablet: Horizontal layout, left-aligned */}
      <div className="hidden md:flex lg:hidden gap-[10px] items-start flex-wrap">
        {contact.liveChat && (
          <p className={cn("text-white font-public-sans whitespace-nowrap", contactTextClassName)}>
            {contact.liveChat}
          </p>
        )}
        {contact.phone && (
          <a
            href={`tel:${contact.phone.replace(/\D/g, '')}`}
            className={cn("text-white visited:text-white hover:text-white focus:outline focus:outline-4 focus:outline-blue-40 hover:underline font-public-sans whitespace-nowrap", contactTextClassName)}
          >
            {contact.phone}
          </a>
        )}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className={cn("text-white visited:text-white hover:text-white focus:outline focus:outline-4 focus:outline-blue-40 hover:underline font-public-sans whitespace-nowrap", contactTextClassName)}
          >
            {contact.email}
          </a>
        )}
        {contact.siteFeedback && (
          <p className={cn("text-white font-public-sans whitespace-nowrap", contactTextClassName)}>
            {contact.siteFeedback}
          </p>
        )}
      </div>

      {/* Mobile: Vertical layout, left-aligned */}
      <div className="flex md:hidden flex-col gap-[2px] items-start">
        {contact.liveChat && (
          <p className={cn("text-white font-public-sans", contactTextClassName)}>
            {contact.liveChat}
          </p>
        )}
        {contact.phone && (
          <a
            href={`tel:${contact.phone.replace(/\D/g, '')}`}
            className={cn("text-white visited:text-white hover:text-white focus:outline focus:outline-4 focus:outline-blue-40 hover:underline font-public-sans", contactTextClassName)}
          >
            {contact.phone}
          </a>
        )}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className={cn("text-white visited:text-white hover:text-white focus:outline focus:outline-4 focus:outline-blue-40 hover:underline font-public-sans", contactTextClassName)}
          >
            {contact.email}
          </a>
        )}
        {contact.siteFeedback && (
          <p className={cn("text-white font-public-sans", contactTextClassName)}>
            {contact.siteFeedback}
          </p>
        )}
      </div>
    </div>
  )
}

// Agency info component
const AgencyInfo: React.FC<{
  agency: AgencyInfo
}> = ({ agency }) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-white mb-2">
        <span className="font-poppins font-bold text-2xl leading-normal">
          National Cancer Institute
        </span>
        <br />
        <span className="font-poppins font-medium text-lg leading-[21px]">
          at the National Institutes of Health
        </span>
      </h2>
      {agency.description && (
        <p className="text-white font-public-sans text-sm">
          {agency.description}
        </p>
      )}
    </div>
  </div>
)

export interface USWDSFooterProps
  extends React.HTMLAttributes<HTMLElement> {
  navigation?: FooterNavigation
  agencyInfo?: AgencyInfo
  contactInfo?: ContactInfo
  showNewsletter?: boolean
  onNewsletterSignup?: (email: string) => void
}

const USWDSFooter = React.forwardRef<HTMLElement, USWDSFooterProps>(
  ({
    className,
    navigation = {},
    agencyInfo,
    contactInfo,
    showNewsletter = true,
    onNewsletterSignup,
    ...props
  }, ref) => {
    const { sections = [], primaryLinks = [], socialLinks = [] } = navigation

  return (
    <footer
      ref={ref}
      className={cn("w-full bg-cerulean-70", className)}
      {...props}
    >
        <div className="w-full">

          {/* Main content area */}
          <div className="pb-8 lg:px-8 lg:pt-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Navigation */}
                {sections.length > 0 && (
                  <div className="lg:col-span-2">
                    <MobileAccordion sections={sections} />
                    <DesktopNavigation sections={sections} />
                  </div>
                )}

                {/* Newsletter signup */}
                {showNewsletter && (
                  <div className="lg:col-span-1">
                    <NewsletterSignup onSignup={onNewsletterSignup} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom section with agency info, contact, and social links */}
          {(agencyInfo || contactInfo || socialLinks.length > 0) && (
            <>
              <div className="w-full px-4 py-5 lg:px-8 lg:py-8 bg-cerulean-80">
                <div className="max-w-7xl mx-auto">
                  {/* Mobile layout: vertical stack */}
                  <div className="flex flex-col gap-5 lg:hidden">
                    {/* Agency info */}
                    {agencyInfo && (
                      <div className="pb-[10px]">
                        <AgencyInfo agency={agencyInfo} />
                      </div>
                    )}

                    {/* Contact Us */}
                    {contactInfo && (
                      <div className="flex flex-col gap-[4px] items-start">
                        <h3 className="font-poppins font-bold text-white text-[22px] leading-normal">
                          Contact Us
                        </h3>
                        <ContactInfo contact={contactInfo} />
                      </div>
                    )}

                    {/* Follow us and Government hierarchy */}
                    <div className="flex flex-col gap-[17px] items-start">
                      {/* Social links */}
                      {socialLinks.length > 0 && (
                        <div>
                          <h3 className="font-poppins font-bold text-white mb-[14px] text-[22px] leading-normal">
                            Follow us
                          </h3>
                          <SocialLinks socialLinks={socialLinks} />
                        </div>
                      )}

                      {/* Government hierarchy */}
                      <div className="text-white font-public-sans text-[14.24px] leading-[18px]">
                        <p className="mb-[5px]">U.S. Department of Health and Human Services</p>
                        <p className="mb-[5px]">National Institutes of Health</p>
                        <p className="mb-[5px]">National Cancer Institute</p>
                        <p>USA.gov</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop/Tablet layout: grid */}
                  <div className="hidden lg:grid lg:grid-cols-2 gap-8">
                    {/* Left: Agency info and Social */}
                    <div className="space-y-6">
                      {/* Agency info */}
                      {agencyInfo && (
                        <AgencyInfo agency={agencyInfo} />
                      )}

                      {/* Social links */}
                      {socialLinks.length > 0 && (
                        <div>
                          <h3 className="font-poppins font-bold text-white mb-3 text-[22px] leading-normal">
                            Follow us
                          </h3>
                          <SocialLinks socialLinks={socialLinks} />
                        </div>
                      )}
                    </div>

                    {/* Right: Contact Us and Government hierarchy */}
                    <div className="flex flex-col justify-between text-right">
                      <div className="space-y-6">
                        {/* Contact info */}
                        {contactInfo && (
                          <div className="flex flex-col gap-[10px] items-end">
                            <h3 className="font-poppins font-bold text-white text-[22px] leading-normal">
                              Contact Us
                            </h3>
                            <ContactInfo contact={contactInfo} />
                          </div>
                        )}

                        {/* Government hierarchy */}
                        <div className="text-white font-public-sans text-right text-sm leading-[18px]">
                          <p className="mb-[5px]">U.S. Department of Health and Human Services</p>
                          <p className="mb-[5px]">National Institutes of Health</p>
                          <p className="mb-[5px]">National Cancer Institute</p>
                          <p>USA.gov</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </footer>
    )
  }
)

USWDSFooter.displayName = "USWDSFooter"

export { USWDSFooter }

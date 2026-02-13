import NCIDSNavbar from "@/components/blocks/header";
import { USWDSFooter } from "@/components/blocks/footer";
import { Banner } from "@/components/ui/banner";
import { Icon } from "@/components/ui/icon";
import { navItems } from "./data/header-data";
import { agencyInfo, contactInfo, navigation } from "./data/footer-data";

export default function HeaderAndFooterPage() {
  return (
    <>
      <Banner />
      <NCIDSNavbar navItems={navItems} />
      <div className="h-screen flex flex-col items-center justify-center">
        <Icon icon="bookmark" size="lg" className="size-16 mx-auto mb-4" />
        <p className="text-lg">Integrate other components here</p>
      </div>
      <USWDSFooter agencyInfo={agencyInfo} contactInfo={contactInfo} navigation={navigation} />
    </>
  )
}

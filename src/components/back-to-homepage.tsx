import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function BackToHomepage() {
  return (
    <Link
      href="/"
      className="fixed top-4 right-4 z-50 flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow-md transition-colors hover:bg-gray-200 hover:text-gray-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-40v"
      aria-label="Back to Homepage"
    >
      <Icon icon="home" size="default" />
    </Link>
  );
}

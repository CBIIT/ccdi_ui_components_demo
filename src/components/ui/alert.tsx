import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

const alertVariants = cva(
  "relative p-4 border-l-8 font-public-sans [&_a]:underline",
  {
    variants: {
      variant: {
        default: "bg-cyan-5 border-l-cyan-30 text-gray-90 [&_a]:text-blue-60v",
        success:
          "bg-green-cool-5 border-l-green-cool-40v text-gray-90 [&_a]:text-blue-60v",
        warning:
          "bg-yellow-5 border-l-gold-20v text-gray-90 [&_a]:text-blue-60v",
        error:
          "bg-red-warm-10 border-l-red-warm-50v text-gray-90 [&_a]:text-blue-60v",
        info: "bg-cyan-5 border-l-cyan-30v text-gray-90 [&_a]:text-blue-60v",
        emergency:
          "bg-red-warm-60v border-l-red-warm-60v text-white [&_a]:!text-gray-10",
      },
      hasIcon: {
        true: "px-16",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type AlertProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    role?: "alert" | "status";
    icon?: boolean;
  };

const getIconName = (variant?: AlertProps["variant"]) => {
  switch (variant) {
    case "success":
      return "check_circle";
    case "warning":
      return "warning";
    case "error":
    case "emergency":
      return "error";
    default:
      return "info";
  }
};

const Alert = ({
  className,
  variant,
  role = "alert",
  icon = true,
  ...props
}: AlertProps) => {
  const iconName = getIconName(variant);

  return (
    <div
      role={role}
      className={cn(alertVariants({ variant, hasIcon: icon }), className)}
      {...props}
    >
      {icon && (
        <div className="absolute left-6 top-3">
          <Icon icon={iconName} className="size-8" />
        </div>
      )}
      {props.children}
    </div>
  );
};

const AlertTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h4
    className={cn(
      "text-2xl font-bold mb-2 leading-none font-public-sans",
      className
    )}
    {...props}
  />
);

const AlertDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("leading-normal font-public-sans", className)}
    {...props}
  />
);

export { Alert, AlertTitle, AlertDescription };

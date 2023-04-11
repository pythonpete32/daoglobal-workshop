import React, { ImgHTMLAttributes } from "react";
import clsx from "clsx";

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = "md",
  bordered = false,
  ...imgProps
}) => {
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <img
      className={clsx(
        sizeClass,
        "rounded-full",
        bordered && "ring-2 ring-gray-300 dark:ring-gray-500"
      )}
      src={src}
      alt={alt}
      {...imgProps}
    />
  );
};
type AvatarSize = "sm" | "md" | "lg" | "xl";
const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};
interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: AvatarSize;
  bordered?: boolean;
}

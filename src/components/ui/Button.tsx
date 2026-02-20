"use client";

import { motion } from "framer-motion";
import { MaterialIcon } from "./MaterialIcon";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "gradient";
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconPosition?: "left" | "right";
  skewed?: boolean;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  skewed = false,
  className = "",
  onClick,
  href,
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all cursor-pointer";

  const variantStyles = {
    primary: "bg-primary hover:bg-accent hover:text-white text-black neon-glow-button",
    secondary: "border border-white/30 backdrop-blur-sm hover:bg-white/10 text-white",
    outline: "border border-primary/50 bg-primary/10 text-primary hover:bg-primary hover:text-black",
    gradient: "bg-gradient-to-r from-accent to-primary text-black hover:scale-105 shadow-[0_0_20px_rgba(255,214,0,0.3)]",
  };

  const sizeStyles = {
    sm: "h-9 px-4 text-sm",
    md: "h-12 px-8 text-base",
    lg: "h-14 px-10 text-lg",
  };

  const skewedStyles = skewed ? "btn-skewed rounded-none" : "rounded-lg";

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${skewedStyles} ${className}`;

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <MaterialIcon name={icon} className="mr-2 text-sm" />
      )}
      <span className={skewed ? "block" : ""}>{children}</span>
      {icon && iconPosition === "right" && (
        <motion.span
          className="ml-2"
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <MaterialIcon name={icon} className="text-sm" />
        </motion.span>
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={combinedStyles}
        whileHover={{ scale: variant === "gradient" ? 1.05 : 1 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={combinedStyles}
      onClick={onClick}
      whileHover={{ scale: variant === "gradient" ? 1.05 : 1 }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
}

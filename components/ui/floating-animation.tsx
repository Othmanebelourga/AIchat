"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export function FloatingAnimation({
  children,
  className,
  delay = 0,
  duration = 4,
  yOffset = 10,
}: FloatingAnimationProps) {
  return (
    <motion.div
      className={cn("", className)}
      initial={{ y: 0 }}
      animate={{ y: [-yOffset, yOffset, -yOffset] }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
} 
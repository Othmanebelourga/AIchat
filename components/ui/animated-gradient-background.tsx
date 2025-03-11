"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientBackground({
  children,
  className,
}: AnimatedGradientBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background",
        className
      )}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 bg-background z-0" />
        <motion.div
          className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]"
          animate={{
            x: mousePosition.x * 0.05,
            y: mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", damping: 50, stiffness: 100 }}
        />
        <motion.div
          className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-secondary/20 blur-[100px]"
          animate={{
            x: -mousePosition.x * 0.05,
            y: -mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", damping: 50, stiffness: 100 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 h-[600px] w-[600px] rounded-full bg-accent/20 blur-[100px]"
          animate={{
            x: mousePosition.x * 0.03,
            y: mousePosition.y * 0.03,
          }}
          transition={{ type: "spring", damping: 50, stiffness: 100 }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Content */}
      <div className="container relative z-20">{children}</div>
    </div>
  );
} 
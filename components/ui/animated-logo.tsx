"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export function AnimatedLogo() {
  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.1,
      }}
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute h-16 w-16 rounded-full bg-primary/30 blur-md"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <MessageSquare className="h-7 w-7" />
        </motion.div>
      </div>
      <motion.h1
        className="ml-3 text-4xl font-bold tracking-tight"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        AI Chat
      </motion.h1>
    </motion.div>
  );
} 
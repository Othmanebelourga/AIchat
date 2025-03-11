"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatedGradientBackground } from "@/components/ui/animated-gradient-background";
import { FloatingAnimation } from "@/components/ui/floating-animation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, LogOut, Mail, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // Get initials for avatar fallback
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <AnimatedGradientBackground>
      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl overflow-hidden">
            <div className="absolute -z-10 top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-sm"></div>
            
            <CardHeader className="text-center pt-12">
              <div className="flex justify-center mb-4">
                <FloatingAnimation yOffset={5} duration={3}>
                  <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {getInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </FloatingAnimation>
              </div>
              <CardTitle className="text-2xl">{session?.user?.name || "User"}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-1 mt-1">
                <Mail className="h-3 w-3" />
                {session?.user?.email}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Account Information</h3>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex justify-between">
                      <span>User ID:</span>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {session?.user?.id?.substring(0, 12)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Type:</span>
                      <span>Standard</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 w-full">
                <Link href="/" className="w-full">
                  <Button variant="outline" className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>
                <Button variant="destructive" className="w-full gap-2" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </AnimatedGradientBackground>
  );
} 
import { SignupForm } from "@/components/auth/signup-form";
import { AnimatedGradientBackground } from "@/components/ui/animated-gradient-background";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { FloatingAnimation } from "@/components/ui/floating-animation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | AI Chat",
  description: "Create a new AI Chat account",
};

export default function SignupPage() {
  return (
    <AnimatedGradientBackground>
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AnimatedLogo />
            <p className="text-center text-sm text-muted-foreground">
              Join us and start chatting with AI
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -left-10 bottom-1/3 opacity-70 pointer-events-none">
            <FloatingAnimation delay={0.8} yOffset={18}>
              <div className="h-28 w-28 rounded-full bg-accent/10 blur-xl" />
            </FloatingAnimation>
          </div>
          <div className="absolute -right-10 top-1/3 opacity-70 pointer-events-none">
            <FloatingAnimation delay={0.2} yOffset={12}>
              <div className="h-20 w-20 rounded-full bg-primary/10 blur-xl" />
            </FloatingAnimation>
          </div>
          
          <SignupForm />
        </div>
      </div>
    </AnimatedGradientBackground>
  );
} 
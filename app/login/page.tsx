import { LoginForm } from "@/components/auth/login-form";
import { AnimatedGradientBackground } from "@/components/ui/animated-gradient-background";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { FloatingAnimation } from "@/components/ui/floating-animation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | AI Chat",
  description: "Login to your AI Chat account",
};

export default function LoginPage() {
  return (
    <AnimatedGradientBackground>
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AnimatedLogo />
            <p className="text-center text-sm text-muted-foreground">
              Your intelligent conversation partner
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -left-10 top-1/4 opacity-70 pointer-events-none">
            <FloatingAnimation delay={0.5} yOffset={15}>
              <div className="h-24 w-24 rounded-full bg-primary/10 blur-xl" />
            </FloatingAnimation>
          </div>
          <div className="absolute -right-10 bottom-1/4 opacity-70 pointer-events-none">
            <FloatingAnimation delay={1.2} yOffset={20}>
              <div className="h-32 w-32 rounded-full bg-secondary/10 blur-xl" />
            </FloatingAnimation>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </AnimatedGradientBackground>
  );
} 
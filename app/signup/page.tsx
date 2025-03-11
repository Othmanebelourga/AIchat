import { SignupForm } from "@/components/auth/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | AI Chat",
  description: "Create a new AI Chat account",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="h-14 w-14 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h1 className="ml-3 text-4xl font-bold tracking-tight">AI Chat</h1>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Join us and start chatting with AI
          </p>
        </div>
        
        <SignupForm />
      </div>
    </div>
  );
}
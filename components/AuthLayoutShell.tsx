"use client";

import { usePathname } from "next/navigation";

const authPageConfig: Record<string, { title: string; description: string }> = {
  "/auth/login": {
    title: "Welcome Back",
    description: "Sign in to your account to continue.",
  },
  "/auth/sign-up": {
    title: "Join Us Today",
    description: "Create your account and start your journey.",
  },
  "/auth/forgot-password": {
    title: "Reset Your Password",
    description: "We'll help you recover your account access.",
  },
};

export default function AuthHeaderShell() {
  const pathname = usePathname();
  const config = authPageConfig[pathname] ?? {
    title: "Welcome",
    description: "Access your account or create a new one.",
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
      <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
        {config.description}
      </p>
    </div>
  );
}
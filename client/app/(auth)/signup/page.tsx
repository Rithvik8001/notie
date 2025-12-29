"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/services/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Container from "@/components/container";
import { toast } from "sonner";
import { PublicRoute } from "@/components/auth";

export default function SignupPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      toast.error("Email and password are required");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await signup(email, password, userName.trim() || undefined);
      toast.success("Account created successfully");
      router.push("/login");
    } catch (err) {
      if (err instanceof Error) {
        const errorWithDetails = err as Error & {
          errors?: Array<{ field: string; message: string }>;
        };

        if (errorWithDetails.errors && errorWithDetails.errors.length > 0) {
          if (errorWithDetails.errors.length === 1) {
            toast.error(errorWithDetails.errors[0].message, {
              duration: 5000,
            });
          } else {
            const firstError = errorWithDetails.errors[0];
            const otherErrors = errorWithDetails.errors
              .slice(1)
              .map((e) => `• ${e.message}`)
              .join("\n");

            toast.error(firstError.message, {
              duration: 6000,
              description: otherErrors,
            });
          }
        } else {
          toast.error(err.message, {
            duration: 4000,
          });
        }
      } else {
        toast.error("Failed to sign up. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicRoute redirectIfAuthenticated={true}>
      <Container
        maxWidth="5xl"
        className="min-h-screen border-l border-r border-gray-100"
      >
        <div className="flex items-center justify-center min-h-screen py-12">
          <div className="w-full max-w-md">
            <div className="grid grid-cols-1 gap-0">
              {/* Header Section */}
              <div className="border border-gray-100 p-8 text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  Create account
                </h1>
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <p className="text-muted-foreground text-sm">
                    Sign up to get started with Notie
                  </p>
                </div>
              </div>

              {/* Form Section */}
              <div className="border-l border-r border-b border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2 pb-4 border-b border-gray-100">
                      <Label htmlFor="userName">Username (optional)</Label>
                      <Input
                        id="userName"
                        type="text"
                        placeholder="johndoe"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        autoComplete="username"
                      />
                    </div>

                    <div className="space-y-2 pb-4 border-b border-gray-100">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </div>

                    <div className="space-y-2 pb-4 border-b border-gray-100">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                      <p className="text-xs text-muted-foreground pt-2">
                        Must be at least 8 characters with uppercase, lowercase,
                        and a number
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-destructive text-center p-3 border border-destructive/20 rounded-md bg-destructive/5">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Sign up"}
                  </Button>
                </form>
              </div>

              {/* Footer Section */}
              <div className="border-l border-r border-b border-gray-100 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-foreground hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </PublicRoute>
  );
}

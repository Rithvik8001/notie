"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Container from "@/components/container";
import { toast } from "sonner";
import { userStore } from "@/store/store";

export default function LoginPage() {
  const router = useRouter();
  const { fetchUser } = userStore();
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
      await login(email, password);
      // Fetch user data and store it
      await fetchUser(true);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        const errorWithDetails = err as Error & {
          errors?: Array<{ field: string; message: string }>;
        };

        if (errorWithDetails.errors && errorWithDetails.errors.length > 0) {
          const errorMessages = errorWithDetails.errors
            .map((error) => error.message)
            .join(", ");
          toast.error(errorMessages, {
            duration: 5000,
          });
        } else {
          toast.error(err.message, {
            duration: 4000,
          });
        }
      } else {
        toast.error("Failed to login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <div className="flex items-center justify-center min-h-screen py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
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

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

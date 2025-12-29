import { Button } from "../ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-4xl px-8">
        <div className="grid grid-cols-1 gap-0">
          {/* Hero Section */}
          <div className="border border-gray-100 p-12 flex flex-col items-center justify-center text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight">
                Notie
              </h1>
              <div className="border-t border-gray-100 pt-6">
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  An AI powered note taking app that helps you take notes faster
                  and easier.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-r border-b border-gray-100">
            <div className="p-8 border-r border-gray-100 md:border-r-gray-100 space-y-3">
              <h3 className="font-semibold text-lg">Fast & Simple</h3>
              <p className="text-sm text-muted-foreground">
                Take notes instantly with our intuitive interface
              </p>
            </div>
            <div className="p-8 border-t md:border-t-0 border-r border-gray-100 space-y-3">
              <h3 className="font-semibold text-lg">AI Powered</h3>
              <p className="text-sm text-muted-foreground">
                Smart suggestions and automatic organization
              </p>
            </div>
            <div className="p-8 border-t md:border-t-0 border-gray-100 space-y-3">
              <h3 className="font-semibold text-lg">Secure</h3>
              <p className="text-sm text-muted-foreground">
                Your notes are encrypted and protected
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="border-l border-r border-b border-gray-100 p-10 flex flex-col items-center justify-center space-y-4">
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Free to start. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

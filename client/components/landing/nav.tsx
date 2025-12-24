import { BadgeTurkishLira } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Nav() {
  return (
    <>
      <div className="w-full flex items-center justify-between p-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Link href="/">
            <BadgeTurkishLira size={30} />
          </Link>
          <span className="text-2xl tracking-tight cursor-pointer">Notie</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="default">Sign Up</Button>
          </Link>
        </div>
      </div>
    </>
  );
}

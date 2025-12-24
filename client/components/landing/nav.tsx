import { BadgeTurkishLira } from "lucide-react";
import { Button } from "../ui/button";

export default function Nav() {
  return (
    <>
      <div className="w-full flex items-center justify-between p-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <BadgeTurkishLira size={30} />
          <span className="text-2xl tracking-tight cursor-pointer">Notie</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Login</Button>
          <Button variant="default">Sign Up</Button>
        </div>
      </div>
    </>
  );
}

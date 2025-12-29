import { BadgeTurkishLira } from "lucide-react";
import { SidebarHeader } from "@/components/ui/sidebar";

export function DashboardSidebarHeader() {
  return (
    <SidebarHeader>
      <div className="flex items-center gap-2 p-2">
        <BadgeTurkishLira size={24} className="text-primary" />
        <span className="text-lg font-semibold">Notie</span>
      </div>
    </SidebarHeader>
  );
}

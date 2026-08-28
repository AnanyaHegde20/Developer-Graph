"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Code2, FolderOpen, Briefcase, Hexagon, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/graph", label: "Graph Explorer", icon: Network },
  { href: "/developers", label: "Developers", icon: Users },
  { href: "/skills", label: "Skills", icon: Code2 },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/roles", label: "Job Roles", icon: Briefcase },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-card">
      <div className="flex items-center gap-2 px-6 py-5">
        <Hexagon className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">DevGraph</span>
      </div>
      <Separator />
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  FileText,
  Users,
  ClipboardList,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", href: "/dashboard", icon: Calendar },
  { title: "Consultas", href: "/appointments", icon: FileText },
  { title: "Pacientes", href: "/patients", icon: Users },
  { title: "Procedimentos", href: "/procedures", icon: ClipboardList },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-background p-4 sm:flex">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-lg">DentalCare</span>
      </div>
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              pathname === item.href && "bg-muted text-primary"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
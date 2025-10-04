'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  FileText,
  Users,
  ClipboardList,
  Stethoscope,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", href: "/dashboard", icon: Calendar },
  { title: "Consultas", href: "/appointments", icon: FileText },
  { title: "Pacientes", href: "/patients", icon: Users },
  { title: "Procedimentos", href: "/procedures", icon: ClipboardList },
];

export function MobileSidebar() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Stethoscope className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">DentalCare</span>
          </Link>
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                pathname === item.href && "text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
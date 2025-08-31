"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  HouseIcon,
  UserGearIcon,
  BriefcaseIcon,
  UsersIcon,
  HamburgerIcon,
  BellIcon,
  GearIcon,
  MoonIcon,
  SunIcon,
} from "@phosphor-icons/react";

const navigation = [
  { name: "Dashboard", href: "/", icon: HouseIcon },
  { name: "Leads", href: "/leads", icon: UserGearIcon },
  { name: "Campaigns", href: "/campaigns", icon: BriefcaseIcon },
  { name: "Users", href: "/users", icon: UsersIcon },
];

// Custom hook to detect mobile screen. Must be client-side.
const useIsMobile = (breakpoint = 1024) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < breakpoint);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [breakpoint]);
  return isMobile;
};

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();

  const getPageName = () => {
    if (pathname === "/") return "Dashboard";
    // Sort by href length to match more specific routes first (e.g., /users/new before /users)
    const activeRoute = [...navigation]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => pathname.startsWith(item.href) && item.href !== "/");
    return activeRoute?.name || "Dashboard";
  };
  const currentPageName = getPageName();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">LM</span>
        </div>
        <span className="font-semibold text-lg">Lead Manager</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isCurrent =
            (item.href === "/" && pathname === "/") ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isCurrent
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-hover hover:text-foreground",
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-md bg-muted">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs">JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">
              Lead Manager
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const ThemeToggleButton = () => (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <SunIcon
        size={18}
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <MoonIcon
        size={18}
        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );

  if (isMobile) {
    return (
      <>
        <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex items-center justify-between p-4 h-16">
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HamburgerIcon size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">LM</span>
                </div>
                <span className="font-semibold">Lead Manager</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggleButton />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <BellIcon size={18} />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="p-4">{children}</main>
      </>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 fixed inset-y-0 left-0 hidden lg:block z-20">
        <SidebarContent />
      </aside>
      <div className="flex-1 flex flex-col lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex items-center justify-between p-4 lg:px-6 h-16">
            <h1 className="text-2xl font-bold">{currentPageName}</h1>
            <div className="flex items-center gap-3">
              <ThemeToggleButton />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <BellIcon size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <GearIcon size={18} />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
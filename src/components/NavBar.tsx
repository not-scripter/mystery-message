"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun, Cat } from "lucide-react";
import { useTheme } from "next-themes";

import { MessageSquareHeart } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function NavBar() {
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <nav className="sticky top-0 z-10 p-4 md:p-6 shadow-md backdrop-blur-md">
      <div className="flex relative justify-between items-center">
        <Link href="/" prefetch className="grow-0">
          <MessageSquareHeart size="36" />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              {resolvedTheme === "dark" ? (
                <Moon />
              ) : resolvedTheme === "light" ? (
                <Sun />
              ) : (
                <Cat />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("latte")}>
              Latte
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("frappe")}>
              Frappe
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("macchiato")}>
              Macchiato
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("mocha")}>
              Mocha
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full">
              <Avatar>
                <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <Link href={`/u/${user.username}`}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => signOut()} className="text-red">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto" variant={"outline"}>
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

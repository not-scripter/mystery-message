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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Moon, Sun, Cat } from "lucide-react";
import { useTheme } from "next-themes";

import { MessageSquareHeart } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function NavBar() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <nav className="sticky top-0 z-10 p-4 md:p-6 shadow-md backdrop-blur-md">
      <div className="flex relative justify-between items-center">
        <Link href="/" prefetch className="grow-0">
          <MessageSquareHeart size="36" />
        </Link>

        {session ? (
          <Drawer>
            <DrawerTrigger className="rounded-full" asChild>
              <Avatar>
                <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
              </Avatar>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle className="text-2xl text-subtext0 mb-2">
                  Settings
                </DrawerTitle>
                <DrawerDescription className="text-xl font-semibold">
                  <Link href={`/u/${user.username}`}>Profile</Link>

                  <div className="flex justify-between items-center">
                    Theme
                    <Select
                      onValueChange={(value) => setTheme(value)}
                      defaultValue={theme}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Choose a theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Themes</SelectLabel>
                          <SelectItem value="latte">Latte</SelectItem>
                          <SelectItem value="frappe">Frappe</SelectItem>
                          <SelectItem value="macchiato">Macchiato</SelectItem>
                          <SelectItem value="mocha">Mocha</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => signOut()}
                    variant={"ghost"}
                    className="p-0 text-red text-xl"
                  >
                    Logout
                  </Button>
                </DrawerDescription>
              </DrawerHeader>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
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

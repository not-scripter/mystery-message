"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useTheme } from "next-themes";

import { MessageSquareHeart } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Container from "./Container";
import { useMediaQuery } from "usehooks-ts";

export default function NavBar() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();
  const user = session?.user as User;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <nav className="w-full sticky top-0 z-10 shadow-md backdrop-blur-md flex items-center justify-center">
      <Container>
        <div className="w-full flex relative justify-between items-center">
          <Link href="/" prefetch className="grow-0">
            <MessageSquareHeart size="36" />
          </Link>

          {session ? (
            !isDesktop ? (
              <Drawer>
                <DrawerTrigger className="rounded-full" asChild>
                  <Avatar>
                    <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="text-left">
                    <DrawerTitle className="text-3xl text-subtext0 mb-4">
                      Settings
                    </DrawerTitle>
                    <DrawerDescription className="text-xl font-semibold flex flex-col gap-2 items-start">
                      <Link href={`/u/${user.username}`}>
                        <DrawerClose>Profile</DrawerClose>
                      </Link>

                      <div className="flex items-center justify-between w-full">
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
                              <SelectItem value="macchiato">
                                Macchiato
                              </SelectItem>
                              <SelectItem value="mocha">Mocha</SelectItem>
                              <SelectItem value="system">System</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button type="button" className="text-red">
                            Logout
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will Logout
                              yout account from this device.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => signOut()}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
              <Dialog>
                <DialogTrigger className="rounded-full">
                  <Avatar>
                    <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                  </DialogHeader>
                  <DialogFooter className="text-xl font-semibold flex flex-col gap-2 items-start">
                    <Link href={`/u/${user.username}`}>
                      <DialogClose>Profile</DialogClose>
                    </Link>

                    <div className="flex items-center justify-between w-full">
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button type="button" className="text-red">
                          Logout
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will Logout yout
                            account from this device.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => signOut()}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )
          ) : (
            <Link href="/sign-in">
              <Button className="w-full md:w-auto" variant={"outline"}>
                Login
              </Button>
            </Link>
          )}
        </div>
      </Container>
    </nav>
  );
}

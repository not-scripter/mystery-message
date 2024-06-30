"use client";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { SignInSchema } from "@/schemas/signInSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function page() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setisSubmitting] = useState(false);

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    setisSubmitting(true);
    try {
      await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      router.replace("/dashboard");
    } catch (error) {
      toast({
        title: "Logon Failed",
        description: "invalid password or username",
        variant: "destructive",
      });
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <Container>
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-xl mb-6">
            Login to Mystery Message
          </h1>
          <p className="mb-4">Login to continue your anonymous journey</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your Username or Email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Don't have an Account?{" "}
            <Link
              prefetch
              href={"/sign-up"}
              className="text-blue hover:text-blue/90"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
}

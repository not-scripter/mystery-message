"use client";
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
import { SignUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import * as z from "zod";

export default function page() {
  const [usernameMessage, setusernameMessage] = useState("");
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);

  const [debouncedUsername, setusername] = useDebounceValue("", 500);
  const router = useRouter();
  const { toast } = useToast();

  //NOTE: ZOD Implementation
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setisCheckingUsername(true);
        setusernameMessage("");
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debouncedUsername}`,
          ); //NOTE: axios alternative is ReactQuery
          setusernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setusernameMessage(
            axiosError.response?.data.message || "error checking username",
          );
        } finally {
          setisCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setisSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/sign-up`, data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${debouncedUsername}`);
    } catch (error) {
      console.error("error signup", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-xl mb-6">
          Join Mystery Message
        </h1>
        <p className="mb-4">Sign up to start your anonymous journey</p>
      </div>
      {/* NOTE: shadcn form starts here */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* NOTE: username field */}
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setusername(e.target.value);
                    }}
                  />
                </FormControl>
                {isCheckingUsername && <Loader2 className="animate-spin" />}
                <p
                  className={`text-sm ${usernameMessage === "username is unique" ? "text-green-600" : "text-red-600"}`}
                >
                  {usernameMessage}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* NOTE: email field */}
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* NOTE: password field */}
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
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
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center mt-4">
        <p>
          Already a member?{" "}
          <Link
            prefetch
            href={"/sign-in"}
            className="text-blue hover:text-blue/90"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

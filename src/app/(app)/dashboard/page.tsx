"use client";

import Container from "@/components/Container";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { AcceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, CircleArrowOutUpRight } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function page() {
  const { toast } = useToast();

  const [messages, setmessages] = useState<Message[]>([]);
  const [isloading, setisloading] = useState(false);
  const [isSwitchLoading, setisSwitchLoading] = useState(false);

  const handleMessageDelete = (messageId: string) => {
    setmessages(messages.filter((message) => message?._id !== messageId));
  };

  const { data: session } = useSession();

  const { register, watch, setValue } = useForm({
    resolver: zodResolver(AcceptMessagesSchema),
  });

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setisSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setisSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setisloading(true);
      setisSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>(`/api/get-messages`);
        setmessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ||
            "failed to fetch message settings",
          variant: "destructive",
        });
      } finally {
        setisloading(false);
        setisSwitchLoading(false);
      }
    },
    [setisloading, setmessages],
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  //NOTE: handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "failed to fetch message settings",
        variant: "destructive",
      });
    }
  };

  // const { username } = session?.user as User; //NOTE: causing error
  const router = useRouter();
  const username = session?.user.username;
  const [baseUrl, setbaseUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const { protocol, hostname, port } = window.location;
      const baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ""}`;
      setbaseUrl(baseUrl);
    }
  }, [router]);
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Url copied",
    });
  };

  if (!session || !session.user) {
    return (
      <div className="w-full p-40 flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <Container>
      <div className="rounded w-full">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            Visit to your profile
            <Link href={profileUrl}>
              <CircleArrowOutUpRight size={16} />
            </Link>
          </h2>
          <div className="flex items-center">
            <Input
              type="text"
              value={profileUrl}
              disabled
              className="w-full p-2 mr-2"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="ml-2">
              Accepting Messages: {acceptMessages ? "On" : "Off"}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </div>

        <Separator />

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={() => handleMessageDelete(message._id)}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </Container>
  );
}

"use client";

import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Send, MessageSquareOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useChat } from "@ai-sdk/react";
import Container from "@/components/Container";

export default function page() {
  const { data: session } = useSession();
  const user = session?.user as User;

  const { messages, input, handleInputChange, handleSubmit, stop, isLoading } =
    useChat({
      api: "/api/chat",
    });

  return (
    <div className="pb-24 w-full">
      <Container className="flex-col">
        {messages.map((m: any) => (
          <div
            key={m.id}
            className={`flex p-4 flex-col w-full ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <Label
              htmlFor={m.id}
              className={`flex mb-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Avatar>
                {/* <AvatarImage src={m.role === "user" ? "" : ""} /> */}
                <AvatarFallback>
                  {m.role === "user" ? user.username?.charAt(0) : "AI"}
                </AvatarFallback>
              </Avatar>
            </Label>
            <p
              id={m.id}
              className={`flex mb-2 w-4/5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.content}
            </p>
            {m.role === "model" && <Separator />}
          </div>
        ))}
      </Container>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full bg-gradient-to-t from-base via-surface0 via-80% to-transparent"
      >
        <Container className="gap-4">
          <Input
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            className="relative hover:border-none hover:outline-none"
          />
          {isLoading ? (
            <Button onSubmit={() => stop}>
              <MessageSquareOff />
            </Button>
          ) : (
            <Button type="submit">
              <Send />
            </Button>
          )}
        </Container>
      </form>
    </div>
  );
}

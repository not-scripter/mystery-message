"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { format, parseISO } from "date-fns";
import Autoplay from "embla-carousel-autoplay";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Home() {
  const [recentMessages, setrecentMessages] = useState<any>([]);
  const getRecentMessages = async () => {
    const response = await axios.get("/api/get-recent-messages");
    setrecentMessages(response.data.messages);
  };
  useEffect(() => {
    getRecentMessages();
  }, []);
  return (
    <main className="min-h-svh flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive into the World of Anonymous Feedback
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          True Feedback - Where your identity remains a secret.
        </p>
      </section>

      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full max-w-lg md:max-w-xl"
      >
        <CarouselContent>
          {recentMessages.map((message: any, index: number) => (
            <CarouselItem key={index} className="p-4">
              <Card>
                <CardHeader>
                  <CardTitle>{message.username}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                  <Mail className="flex-shrink-0" />
                  <div>
                    <p>{message.messages.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(
                        parseISO(message.messages.createdAt.toString()),
                        "dd/MM/yyyy HH:mm",
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </main>
  );
}

"use client";

import { useCompletion } from "@ai-sdk/react";

export default function Completion() {
  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

  const { completion, complete, error, isLoading } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Handle error appropriately
    }
  };

  return (
    <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
      <form>
        {isLoading ? <p>Loading...</p> : <p>Completion result: {completion}</p>}
        <button
          onClick={fetchSuggestedMessages}
          className="my-4"
          disabled={isLoading}
        >
          Suggest Messages
        </button>
      </form>
    </div>
  );
}

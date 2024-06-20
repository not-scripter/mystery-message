"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function page() {
  const [recentMessages, setrecentMessages] = useState<any>([]);
  const getResentMessages = async () => {
    const response = await axios.get("/api/get-recent-messages");
    setrecentMessages(response.data.messages);
    console.log(response.data.messages);
  };
  useEffect(() => {
    getResentMessages();
  }, []);

  return (
    <div>
      <h2>Resent Messages</h2>
      <br />
      {recentMessages.toString()}
    </div>
  );
}

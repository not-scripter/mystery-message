import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "user nor found",
        },
        { status: 401 },
      );
    }

    if (!user.isAcceptingMessages) {
      return NextResponse.json(
        {
          success: false,
          message: "user is not accepting the messages",
        },
        { status: 403 },
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "message send successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("error sending messages", error);
    return NextResponse.json(
      {
        success: false,
        message: "error sending messages",
      },
      { status: 500 },
    );
  }
}

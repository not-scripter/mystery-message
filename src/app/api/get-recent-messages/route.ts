import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const results = await UserModel.aggregate([
      { $unwind: "$messages" }, // Deconstruct the messages array
      { $sort: { "messages.createdAt": -1 } }, // Sort messages by date in descending order
      { $limit: 3 }, // Limit to the last 3 messages
      {
        $project: {
          _id: 0,
          username: 1,
          "messages.content": 1,
          "messages.createdAt": 1,
        },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        messages: results,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "unexpected error",
      },
      { status: 500 },
    );
  }
}

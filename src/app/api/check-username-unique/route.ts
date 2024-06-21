import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { UsernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";
import { z } from "zod";

const UsernameValidationSchema = z.object({
  username: UsernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    // Validate with ZOD
    const result = UsernameValidationSchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "error validating username",
        },
        { status: 400 },
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "username is unique",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("error checking username", error);
    return NextResponse.json(
      {
        success: false,
        message: "error checking username",
      },
      { status: 500 },
    );
  }
}

//NOTE: extra fix
export const dynamic = "force-dynamic";

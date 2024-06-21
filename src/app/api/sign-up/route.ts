import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserVerifindByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifindByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 400 },
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User with same email already exists",
          },
          { status: 400 },
        );
      } else {
        const hashedPassword = bcrypt.hash(password, 10).toString();
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryData = new Date();
      expiryData.setHours(expiryData.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryData,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // Send Verification Email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: emailResponse.message,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error registering user", error);
    return NextResponse.json(
      {
        success: false,
        message: "error registering user",
      },
      {
        status: 500,
      },
    );
  }
}

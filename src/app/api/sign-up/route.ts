import { ApiMessage, ApiResponse } from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/src/models/user.model";
import { signupSchema } from "@/src/Schema/signupSchema";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // console.log( "Body =  " + body)
    const result = signupSchema.safeParse(body);
    // console.log(result)
    if (!result.success) {
      return ApiResponse(
        false,
        "Invalid Input",
        result.error.flatten().fieldErrors,
        400,
      );
    }

    const { email, password, name } = result.data;

    await dbConnect();

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      return ApiMessage(false, "User is already exists with this Email", 400);
    }

    const newuser = new UserModel({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      authProvider: "credentials",
    });

    await newuser.save();

    return ApiMessage(true, "User registered successfully.", 200);
  } catch (error) {
    console.error("Error registering user:", error);

    return ApiResponse(
      false,
      "Error registering use",
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
}

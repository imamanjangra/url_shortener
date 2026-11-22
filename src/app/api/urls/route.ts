import { ApiMessage, ApiResponse } from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnect";
import urlModel from "@/src/models/url.model";
import { urlSchema } from "@/src/Schema/urlSchema";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);

    const result = urlSchema.safeParse(body);

    if(!session?.user){
        return ApiMessage(
            false,
            "Unauthorized",
            401
        )
    }

    const userId = session.user._id;

    if (!result.success) {
      return ApiResponse(
        false,
        "Invalid Input",
        result.error.flatten().fieldErrors,
        400,
      );
    }

    const { originalUrl, customName, qrcode } = result.data;

    await dbConnect();
    let shortID;
    if (customName) {
      const trimedName = customName.trim();

      const existing = await urlModel.findOne({ shortID: trimedName });

      if (existing) {
        return ApiMessage(false, "Custome name is already taken ", 400);
      }

      shortID = trimedName;
    } else {
      let existing;

      do {
        shortID = nanoid(7);
        existing = await urlModel.findOne({ shortID });
      } while (existing);
    }

    const newUrl = await urlModel.create({
        shortID,
        originalUrl : originalUrl.trim(),
        userId 
    })

    return ApiResponse(
        true,
        "Short Url is created",
        newUrl,
        200
    )

  } catch (error) {
    console.error("Error registering user:", error);

    return ApiResponse(
      false,
      "Error in creating short Url",
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
}


export async function GET() {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

         if(!session?.user){
        return ApiMessage(
            false,
            "Unauthorized",
            401
        )
    }

     const userId = session.user._id;

    const urls = await urlModel.find({userId});

    return ApiResponse(
        true,
        "All url of user",
        urls,
        200
    )
    } catch (error) {
    console.error("Error registering user:", error);

    return ApiResponse(
      false,
      "Error in fetching short Url",
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  
    }
}
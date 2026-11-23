import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/option";
import { ApiMessage, ApiResponse } from "@/lib/apiResponse";
import urlModel from "@/src/models/url.model";
import { NextResponse } from "next/server";
import { trackClick } from "../services/tracking.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> },
) {
  try {
    await dbConnect();
     const { shortCode } = await params;

    const session = await getServerSession(authOptions);

    if (!session) {
      return ApiMessage(false, "Not authenticated", 401);
    }

    const url = await urlModel.findOne({ shortID : shortCode});

    if(!url){
        return ApiMessage(
            false,
            "Url is not found",
            404
        )
    }

    await trackClick(url , request);

    url.totalClicks += 1;

    await url.save();

     return NextResponse.redirect(url.originalUrl, 302);


  } catch (error) {
     console.error("Error to redirect url :", error);
    
        return ApiResponse(
          false,
          "Error to redirect url ",
          {
            error: error instanceof Error ? error.message : "Unknown error",
          },
          500,
        );
  }
}

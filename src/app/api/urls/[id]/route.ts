import { ApiMessage, ApiResponse } from "@/lib/apiResponse";
import urlModel from "@/src/models/url.model";
import { updatedUrlSchema } from "@/src/Schema/updateUrlSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return ApiMessage(false, "Not authenticated", 401);
    }

    const { id } = await params;

    const body = await request.json();

    const result = updatedUrlSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse(
        false,
        "Invalid input",
        result.error.flatten().fieldErrors,
        400,
      );
    }

    await dbConnect();

    const { customName } = result.data;

    if (customName) {
      const existing = await urlModel.findOne({
        shortID: customName.trim(),
        _id: { $ne: id },
      });

      if (existing) {
        return ApiMessage(false, "Custom name already taken", 400);
      }
    }

    const updateData = {
      ...result.data,
      ...(result.data.originalUrl && {
        originalUrl: result.data.originalUrl.trim(),
      }),
      ...(customName && {
        customName: undefined,
        shortID: customName.trim(),
      }),
    };

    delete updateData.customName;

    const updatedUrl = await urlModel.findOneAndUpdate(
      {
        _id: id,
        userId: session.user._id,
      },
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUrl) {
      return ApiMessage(false, "URL not found", 404);
    }

    return ApiResponse(
      true,
      "URL updated successfully",
      updatedUrl,
      200,
    );
  } catch (error) {
    console.error("Error updating URL:", error);

    return ApiResponse(
      false,
      "Error updating URL",
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
}



export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session) {
      return ApiMessage(false, "Not authenticated", 401);
    }

    const deleteUrl = await urlModel.findOneAndDelete({
      _id: id,
      userId: session.user._id,
    });

    if (!deleteUrl) {
      return ApiMessage(false, "Url not found", 404);
    }

    return ApiResponse(true, "Url is deleted successfully", deleteUrl, 200);
  } catch (error) {
    console.error("Error registering user:", error);

    return ApiResponse(
      false,
      "Error crating todo",
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
}

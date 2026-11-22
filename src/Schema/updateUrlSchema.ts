import z from "zod";


export const updatedUrlSchema = z.object({
    originalUrl : z
    .url()
    .min(5 , {message : "url must be at least 5 char"})
    .max(2000 , {message : "url must be at most 2000 char"})
    .optional(),

    customName : z
    .string()
    .min(2 , {message : "custom name must be at least 5 char"})
    .max(200 , {message : "custom name must be at most 2000 char"})
    .optional(),

    qrcode : z
    .string()
    .optional(),
})
 .refine(
    (data) =>
      data.originalUrl !== undefined ||
      data.customName !== undefined ||
      data.qrcode !== undefined,
    {
      message: "At least one field is required",
    })

export type updatedUrlSchemaType = z.infer<typeof updatedUrlSchema>
import z from "zod";


export const urlSchema = z.object({
    originalUrl : z
    .url()
    .min(5 , {message : "url must be at least 5 char"})
    .max(2000 , {message : "url must be at most 2000 char"}),

    customName : z
    .string()
    .min(2 , {message : "custom name must be at least 5 char"})
    .max(200 , {message : "custom name must be at most 2000 char"})
    .optional(),

    qrcode : z
    .string()
    .optional(),
})

export type urlSchemaType = z.infer<typeof urlSchema>
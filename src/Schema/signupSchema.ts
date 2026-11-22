import z from "zod";


export const signupSchema = z.object({
    name : z
    .string()
    .min(2 , {message : "Name must be at least 2 char"})
    .max(20 , {message : "Name must be at most 20 char"}),


    email : z
    .string()
    .email({message : 'Invalid email address'}),
    
    password : z
    .string()
    .min(6 , {message : "password must be at least 6 char"})
    .max(20 , {message : "password must be at most 20 char"})

})


export type signupSchemaType = z.infer<typeof signupSchema>
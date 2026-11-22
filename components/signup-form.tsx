"use client"

import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { signupSchemaType } from "@/src/Schema/signupSchema"
import { useState } from "react"
import axios from "axios"
import { toast } from "./ui/toast"
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"


export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const [isSubmitting, setIsSubmitting] = useState(false);
   const router = useRouter();
  const form = useForm<signupSchemaType>({
    defaultValues : {
      name : "",
      email : "",
      password : "",
    }
  })

  const onSubmit = async (data : signupSchemaType) => {
    setIsSubmitting(true);

    try {
        const response = await axios.post(`/api/sign-up` , data);

        toast.add({
          type : "success",
          description: "Account created successfully",
        })

        router.replace("/dashbord")
         setIsSubmitting(false);

    } catch (error) {
      toast.add({
        type: "warning",
        title: "Sign Up Failed",
      });

      setIsSubmitting(false);
    }
  }

  return (
    <form  onSubmit={form.handleSubmit(onSubmit)}
     className={cn("flex flex-col gap-1", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            {...form.register("name")}
            className="bg-background"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            {...form.register("email")}
            className="bg-background"
          />
          
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            {...form.register("password")}
            className="bg-background"
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        
          <Button type="submit" >Create Account</Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button 
          variant="outline"
           type="button"
           onClick={() => signIn("google" , {
            callbackUrl : "/dashboard"
           })}
           >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Sign up with Google
          </Button>
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="#">Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}


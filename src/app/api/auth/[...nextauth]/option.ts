import dbConnect from "@/lib/dbConnect";
import UserModel from "@/src/models/user.model";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // id : "Credentials",
      credentials: {
        identifier: {
          label: "Email ",
          type: "email",
          placeholder: "Enter your emai",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },

      async authorize(credentials): Promise<any> {
        await dbConnect();

        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const user = await UserModel.findOne({
          email: credentials.identifier.toLowerCase(),
          authProvider: "credentials",
        });

        if (!user) {
          return null;
        }

        if (!user.password) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordCorrect) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // 1. Google email verification and account check
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        await dbConnect();
        console.log(profile)
        const googleProfile = profile as {
          email?: string;
        };

        if (!googleProfile.email ) {
          return false;
        }

        const existingUser = await UserModel.findOne({
          email: googleProfile.email.toLowerCase(),
        });

        if (
          existingUser &&
          existingUser.googleId !== account.providerAccountId
        ) {
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      // Credentials login
      if (account?.provider === "credentials" && user) {
        token._id = user.id;
      }

      if (account?.provider === "google" && user) {
        await dbConnect();

        const googleId = account.providerAccountId;
        const email = user.email?.toLowerCase();

        if (!email) {
          throw new Error("Google email not available");
        }

        let dbUser = await UserModel.findOne({ googleId });

        if (!dbUser) {
          dbUser = await UserModel.create({
            name: user.name || "Google User",
            email,
            googleId,
            authProvider: "google",
          });
        }

        token._id = dbUser._id.toString();
      }

      return token;
    },

    // 3. Add MongoDB ID to session
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id as string;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/sign-in",
  },
};
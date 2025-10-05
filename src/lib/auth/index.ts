import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google"
import { getUserByEmail } from "./actions";
import bcrypt from "bcryptjs";
import { loginSchema } from "../validation/login-schema";

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, token }) {
      console.log(session, token)
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
	providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const validatedCredentials = loginSchema.safeParse(credentials);
        if (!validatedCredentials.success) {
          return null;
        }
        const { username, password } = validatedCredentials.data;

        const user = await getUserByEmail(username);
  
        if (user.success && user.data) {
          const isPasswordValid = await bcrypt.compare(
            password as string,
            user.data.passwordHash
          );
          if (!isPasswordValid) {
            return null;
          } else {
            return user.data;
          }
        }
        return null;
      }
    }),
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
});

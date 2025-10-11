import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import { getUserByEmail } from "../db/actions";
import bcrypt from "bcryptjs";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	adapter: PrismaAdapter(prisma),
	cookies: {
	},
	callbacks: {
		async jwt({ token, user }) {
			// On first sign-in, fetch memberships
			if (user) {
				const memberships = await prisma.membership.findMany({
					where: { userId: user.id },
					include: { tenant: true },
				});
				token.tenants = memberships.map((m) => ({
					id: m.tenantId,
					slug: m.tenant.slug,
					role: m.role,
				}));
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub;
				// @ts-expect-error: memberships is added dynamically to the user object
				if (token?.tenants) session.user.memberships = token.tenants;
			}
      return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				
				const { email, password } = credentials;
				
				const user = await getUserByEmail(email as string);

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
			},
		}),
		Google({
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
});

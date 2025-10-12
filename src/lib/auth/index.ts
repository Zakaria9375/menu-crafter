import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import { getUserByEmail, getUserMembershipsWithTenants } from "../db/actions";
import bcrypt from "bcryptjs";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	adapter: DrizzleAdapter(db),
	cookies: {
	},
	callbacks: {
		async jwt({ token, user }) {
			// On first sign-in, fetch memberships
			if (user) {
				const result = await getUserMembershipsWithTenants(user.id ?? "");

				if (result.succeeded && result.data) {
					token.tenants = result.data.map((m) => ({
						id: m.tenantId,
						slug: m.slug,
						role: m.role,
					}));
				}
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

				if (user.succeeded && user.data) {
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

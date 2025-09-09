import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import logger from "@/lib/logger";

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async jwt({ token, account, user }) {
			if (account) {
				logger.info(
					`[api/auth/[...nextauth]] setting google jwt token for user: ${user?.email}`
				);
				token.idToken = account.id_token;
			}
			return token;
		},
		async session({ session, token }) {
			logger.info(
				`[api/auth/[...nextauth]] setting session token for user: ${token?.email}`
			);
			(session as any).idToken = token.idToken;
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

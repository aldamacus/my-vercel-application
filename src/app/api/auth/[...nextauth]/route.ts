import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

// Only these emails can access admin
const allowedAdmins = [
  "al.damacus@gmail.com",
  "second.admin@example.com"
];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow sign in if email is in allowedAdmins
      return allowedAdmins.includes(user.email || "");
    },
    async session({ session, token }) {
      // Add isAdmin flag to session
      if (session?.user?.email && allowedAdmins.includes(session.user.email)) {
        session.user.isAdmin = true;
      } else {
        session.user.isAdmin = false;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

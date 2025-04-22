import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Define authOptions
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Restrict access to a specific Google account
      if (
        account?.provider === "google" &&
        user.email === "ankur.boyed@gmail.com"
      ) {
        return true;
      } else {
        // Return false to display a default error message
        // Or redirect to a specific page
        // return '/unauthorized'
        return false;
      }
    },
  },
};

// Use authOptions in the handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

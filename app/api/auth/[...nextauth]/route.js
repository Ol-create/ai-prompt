import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID, // Correct key name
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        // Connect to the database
        await connectToDB();

        // Find the user by email
        const sessionUser = await User.findOne({ email: session.user.email });

        // Attach the user's ID to the session object
        session.user.id = sessionUser._id.toString();
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
    async signIn({ profile }) {
      try {
        // Connect to the database
        await connectToDB();

        // Check if the user exists
        const userExists = await User.findOne({ email: profile.email });

        // If not, create a new user
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(/\s+/g, "").toLowerCase(), // Generate a username
            image: profile.picture,
          });
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false; // Deny sign-in on error
      }
    },
  },
});

export { handler as GET, handler as POST };

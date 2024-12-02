import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import { connectToDB } from "@utils/database"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            ClientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    async session({ session }) {

    },
    async signIn({ profile }) {
       try {
         await connectToDB();

         // check if a user already exists

         // if not, create a new user
       } catch (error) {
        
       }
    }
})

export { handler as GET, handler as POST}
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { getFirestore } from "firebase-admin/firestore";
import { cert } from "firebase-admin/app";
import { NextApiRequest, NextApiResponse } from "next";

import { firebaseAdminApp } from "../../../lib/firebase-admin";

const firestore = getFirestore(firebaseAdminApp);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  }),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      const userRef = firestore.collection("users").doc(user.id);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        await userRef.set({
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: new Date(),
          usage: {
            lettersGenerated: 0,
            cvsEdited: 0,
            freeUsed: false,
          },
          subscription: {
            hasMonthlyAccess: false,
            expiresAt: null,
          },
        });
      }

      return true;
    },
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  try {
    return await NextAuth(req, res, authOptions);
  } catch (e) {
    console.error("[AUTH ERROR]", e);
    res.status(500).end("Authentication error");
  }
}

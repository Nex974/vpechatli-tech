import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { getFirestore } from "firebase-admin/firestore";
import { cert } from "firebase-admin/app";

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
    async signIn({ user, account }) {
      if (!account) {
        return true; // just in case
      }

      const usersRef = firestore.collection("users");
      const accountsRef = firestore.collection("accounts");

      // Query user by email
      const userQuery = await usersRef.where("email", "==", user.email).get();

      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        const userId = userDoc.id;

        // Check if OAuth account already linked
        const accountQuery = await accountsRef
          .where("providerAccountId", "==", account.providerAccountId)
          .where("provider", "==", account.provider)
          .get();

        if (accountQuery.empty) {
          // Link OAuth account manually
          await accountsRef.add({
            userId,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token ?? null,
            access_token: account.access_token ?? null,
            expires_at: account.expires_at ?? null,
            token_type: account.token_type ?? null,
            scope: account.scope ?? null,
            id_token: account.id_token ?? null,
            session_state: account.session_state ?? null,
          });
        }
      }

      return true;
    },
  },
};

export default NextAuth(authOptions);

// pages/api/check-access.ts
import { getToken } from "next-auth/jwt";
import { getFirestore } from "firebase-admin/firestore";
import { firebaseAdminApp } from "../../lib/firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

const firestore = getFirestore(firebaseAdminApp);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    console.log("🔐 Token from getToken:", token);

    if (!token || !token.sub) {
      console.warn("Unauthorized: no token or token.sub");
      return res.status(401).json({ unlocked: false, reason: "unauthorized" });
    }

    const userRef = firestore.collection("users").doc(token.sub);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      console.warn(`User document not found for id: ${token.sub}`);
      return res.status(404).json({ unlocked: false, reason: "not_found" });
    }

    const user = userSnap.data();

    // Logging user data for debug (remove or reduce in production)
    console.log("User data:", user);

    const hasFreeUse = user?.usage?.freeUsed === false;
    const hasSubscription =
      user?.subscription?.hasMonthlyAccess === true &&
      (!user?.subscription?.expiresAt || new Date(user.subscription.expiresAt) > new Date());

    const unlocked = hasFreeUse || hasSubscription;

    console.log("Access check result:", { hasFreeUse, hasSubscription, unlocked });

    return res.status(200).json({ unlocked });
  } catch (error) {
    console.error("Error in check-access:", error);
    return res.status(500).json({ unlocked: false, reason: "internal_error" });
  }
}
